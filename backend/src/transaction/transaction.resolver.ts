import { Resolver, Query, Mutation, Args, ID, Int, ResolveField, Parent } from '@nestjs/graphql';
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

@Resolver(() => TransactionModel)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionModel, { name: 'createTransaction' })
  createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput) {
    return this.transactionService.createTransaction(createTransactionInput);
  }

  @Query(() => [TransactionModel], { name: 'transactions' })
  findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
    @Args('status', { type: () => String, nullable: true }) status?: string,
    @Args('customer_id', { type: () => String, nullable: true }) customer_id?: string,
  ) {
    return this.transactionService.findAll(page, limit, status, customer_id);
  }

  @Query(() => TransactionModel, { name: 'transaction' })
  findOne(@Args('transaction_id', { type: () => ID }) transaction_id: string) {
    return this.transactionService.findOne(transaction_id);
  }

  @Query(() => [TransactionModel], { name: 'transactionsByCustomer' })
  findByCustomer(@Args('customer_id', { type: () => ID }) customer_id: string) {
    return this.transactionService.findByCustomer(customer_id);
  }

  @Query(() => [TransactionModel], { name: 'transactionsByEmployee' })
  findByEmployee(@Args('employee_id', { type: () => ID }) employee_id: string) {
    return this.transactionService.findByEmployee(employee_id);
  }

  // Sales Analytics Queries
  @Query(() => SalesOverviewModel, { name: 'salesOverview' })
  getSalesOverview() {
    return this.transactionService.getSalesOverview();
  }

  @Query(() => [TopProductModel], { name: 'topProducts' })
  getTopProducts(@Args('limit', { type: () => Int, defaultValue: 5 }) limit: number) {
    return this.transactionService.getTopProducts(limit);
  }

  @Query(() => [PaymentMethodStatsModel], { name: 'paymentMethodStats' })
  getPaymentMethodStats() {
    return this.transactionService.getPaymentMethodStats();
  }

  @Query(() => [RevenueByCategoryModel], { name: 'revenueByCategory' })
  getRevenueByCategory() {
    return this.transactionService.getRevenueByCategory();
  }

  @Query(() => SalesAnalyticsModel, { name: 'salesAnalytics' })
  async getSalesAnalytics(): Promise<SalesAnalyticsModel> {
    const [overview, topProducts, paymentMethods, revenueByCategory] = await Promise.all([
      this.transactionService.getSalesOverview(),
      this.transactionService.getTopProducts(5),
      this.transactionService.getPaymentMethodStats(),
      this.transactionService.getRevenueByCategory(),
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
      total_price: item.total_price,
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