import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  TransactionModel,
  CustomerModel,
  EmployeeModel,
  TransactionItemModel,
} from './models/transaction.model';
import {
  SalesAnalyticsModel,
  SalesOverviewModel,
  TopProductModel,
  PaymentMethodStatsModel,
  RevenueByCategoryModel,
} from './models/analytics.model';
import {
  CreateTransactionInput,
  CreateCustomerInput,
  CreateEmployeeInput,
} from './dto/create-transaction.input';
import { Transaction } from './transaction.entity';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ClerkUser } from '../auth/decorators/clerk-user.decorator';
import { ClerkService } from '../auth/clerk.service';

@Resolver(() => TransactionModel)
@UseGuards(ClerkAuthGuard)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly clerkService: ClerkService,
  ) {}

  @Mutation(() => TransactionModel, { name: 'createTransaction' })
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.createTransaction(
      createTransactionInput,
      user.id,
    );
  }

  @Query(() => [TransactionModel], { name: 'transactions' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('status', { type: () => String, nullable: true })
    status: string | undefined,
    @Args('customer_id', { type: () => String, nullable: true })
    customer_id: string | undefined,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.findAll(
      page,
      limit,
      status,
      customer_id,
      user.id,
    );
  }

  @ResolveField(() => String, { nullable: true })
  async customer_name(@Parent() transaction: Transaction) {
    if (!transaction.customer_id) return 'Walk-in Customer';
    const customer = await this.transactionService.findCustomer(
      transaction.customer_id,
    );
    return customer ? customer.name : 'Unknown Customer';
  }

  @ResolveField(() => String, { nullable: true })
  async employee_name(@Parent() transaction: Transaction) {
    if (!transaction.employee_id) return 'Unknown';
    const employee = await this.transactionService.findEmployee(
      transaction.employee_id,
    );
    return employee ? employee.name : 'Unknown Employee';
  }

  @Query(() => TransactionModel, { name: 'transaction' })
  async findOne(
    @Args('transaction_id', { type: () => ID }) transaction_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.findOne(transaction_id, user.id);
  }

  @Query(() => [TransactionModel], { name: 'transactionsByCustomer' })
  async findByCustomer(
    @Args('customer_id', { type: () => ID }) customer_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.findByCustomer(customer_id, user.id);
  }

  @Query(() => [TransactionModel], { name: 'transactionsByEmployee' })
  async findByEmployee(
    @Args('employee_id', { type: () => ID }) employee_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.findByEmployee(employee_id, user.id);
  }

  // Sales Analytics Queries
  @Query(() => SalesOverviewModel, { name: 'salesOverview' })
  async getSalesOverview(@ClerkUser() clerkUser: { clerkId: string }) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.getSalesOverview(user.id);
  }

  @Query(() => [TopProductModel], { name: 'topProducts' })
  async getTopProducts(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.getTopProducts(limit, user.id);
  }

  @Query(() => [PaymentMethodStatsModel], { name: 'paymentMethodStats' })
  async getPaymentMethodStats(@ClerkUser() clerkUser: { clerkId: string }) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.getPaymentMethodStats(user.id);
  }

  @Query(() => [RevenueByCategoryModel], { name: 'revenueByCategory' })
  async getRevenueByCategory(@ClerkUser() clerkUser: { clerkId: string }) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.transactionService.getRevenueByCategory(user.id);
  }

  @Query(() => SalesAnalyticsModel, { name: 'salesAnalytics' })
  async getSalesAnalytics(
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<SalesAnalyticsModel> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    const [overview, topProducts, paymentMethods, revenueByCategory] =
      await Promise.all([
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
  async items(
    @Parent() transaction: Transaction,
  ): Promise<TransactionItemModel[]> {
    const items = transaction.items || [];
    return items.map((item) => ({
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
  createCustomer(
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ) {
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
  createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: CreateEmployeeInput,
  ) {
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
