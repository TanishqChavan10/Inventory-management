import { Resolver, Query, Mutation, Args, ID, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionModel, CustomerModel, EmployeeModel, TransactionItemModel } from './models/transaction.model';
import { 
  SalesAnalyticsModel, 
  SalesOverviewModel, 
  TopProductModel, 
  PaymentMethodStatsModel, 
  RevenueByCategoryModel 
} from './models/analytics.model';
import { CreateTransactionInput, CreateCustomerInput, CreateEmployeeInput } from './dto/create-transaction.input';
import { Transaction } from './transaction.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => TransactionModel)
@UseGuards(JwtAuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionModel, { name: 'createTransaction' })
  createTransaction(
    @Args('createTransactionInput') createTransactionInput: CreateTransactionInput,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.createTransaction(createTransactionInput, user.id);
  }

  @Query(() => [TransactionModel], { name: 'transactions' })
  findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('status', { type: () => String, nullable: true }) status: string | undefined,
    @Args('customer_id', { type: () => String, nullable: true }) customer_id: string | undefined,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.findAll(page, limit, status, customer_id, user.id);
  }
  
  @ResolveField(() => String, { nullable: true })
  async customer_name(@Parent() transaction: Transaction) {
    if (!transaction.customer_id) return 'Walk-in Customer';
    const customer = await this.transactionService.findCustomer(transaction.customer_id);
    return customer ? customer.name : 'Unknown Customer';
  }
  
  @ResolveField(() => String, { nullable: true })
  async employee_name(@Parent() transaction: Transaction) {
    if (!transaction.employee_id) return 'Unknown';
    const employee = await this.transactionService.findEmployee(transaction.employee_id);
    return employee ? employee.name : 'Unknown Employee';
  }

  @Query(() => TransactionModel, { name: 'transaction' })
  findOne(
    @Args('transaction_id', { type: () => ID }) transaction_id: string,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.findOne(transaction_id, user.id);
  }

  @Query(() => [TransactionModel], { name: 'transactionsByCustomer' })
  findByCustomer(
    @Args('customer_id', { type: () => ID }) customer_id: string,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.findByCustomer(customer_id, user.id);
  }

  @Query(() => [TransactionModel], { name: 'transactionsByEmployee' })
  findByEmployee(
    @Args('employee_id', { type: () => ID }) employee_id: string,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.findByEmployee(employee_id, user.id);
  }

  // Sales Analytics Queries
  @Query(() => SalesOverviewModel, { name: 'salesOverview' })
  getSalesOverview(@CurrentUser() user: User) {
    return this.transactionService.getSalesOverview(user.id);
  }

  @Query(() => [TopProductModel], { name: 'topProducts' })
  getTopProducts(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
    @CurrentUser() user: User,
  ) {
    return this.transactionService.getTopProducts(limit, user.id);
  }

  @Query(() => [PaymentMethodStatsModel], { name: 'paymentMethodStats' })
  getPaymentMethodStats(@CurrentUser() user: User) {
    return this.transactionService.getPaymentMethodStats(user.id);
  }

  @Query(() => [RevenueByCategoryModel], { name: 'revenueByCategory' })
  getRevenueByCategory(@CurrentUser() user: User) {
    return this.transactionService.getRevenueByCategory(user.id);
  }

  @Query(() => SalesAnalyticsModel, { name: 'salesAnalytics' })
  async getSalesAnalytics(@CurrentUser() user: User): Promise<SalesAnalyticsModel> {
    const [overview, topProducts, paymentMethods, revenueByCategory] = await Promise.all([
      this.transactionService.getSalesOverview(user.id),
      this.transactionService.getTopProducts(5, user.id),
      this.transactionService.getPaymentMethodStats(user.id),
      this.transactionService.getRevenueByCategory(user.id),
    ]);

    return {
      overview,
      topProducts,
      paymentMethods,
      revenueByCategory,
    };
  }

  @ResolveField(() => [TransactionItemModel])
  async items(@Parent() transaction: Transaction): Promise<TransactionItemModel[]> {
    const items = transaction.items || [];
    return items.map(item => ({
      transaction_id: item.transaction_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount: item.discount,
      product_name: item.product?.product_name || 'Unknown Product',
      category_name: item.product?.categories?.[0]?.name || undefined,
    }));
  }
}

@Resolver(() => CustomerModel)
export class CustomerResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => CustomerModel, { name: 'createCustomer' })
  createCustomer(@Args('createCustomerInput') createCustomerInput: CreateCustomerInput) {
    return this.transactionService.createCustomer(createCustomerInput);
  }

  @Query(() => [CustomerModel], { name: 'customers' })
  findAllCustomers() {
    return this.transactionService.findAllCustomers();
  }

  @Query(() => CustomerModel, { name: 'customer' })
  findCustomer(@Args('customer_id', { type: () => ID }) customer_id: string) {
    return this.transactionService.findCustomer(customer_id);
  }
}

@Resolver(() => EmployeeModel)
export class EmployeeResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => EmployeeModel, { name: 'createEmployee' })
  createEmployee(@Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput) {
    return this.transactionService.createEmployee(createEmployeeInput);
  }

  @Query(() => [EmployeeModel], { name: 'employees' })
  findAllEmployees() {
    return this.transactionService.findAllEmployees();
  }

  @Query(() => EmployeeModel, { name: 'employee' })
  findEmployee(@Args('employee_id', { type: () => ID }) employee_id: string) {
    return this.transactionService.findEmployee(employee_id);
  }
}