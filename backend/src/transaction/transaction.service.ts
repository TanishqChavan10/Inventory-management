import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionStatus } from './transaction.entity';
import { TransactionItem } from './transaction-item.entity';
import { Customer } from './customer.entity';
import { Employee } from './employee.entity';
import { Product } from '../inventory/product/product.entity';
import { CreateTransactionInput, CreateCustomerInput, CreateEmployeeInput } from './dto/create-transaction.input';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async createTransaction(createTransactionInput: CreateTransactionInput, userId: string): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate employee exists
      const employee = await this.employeeRepository.findOne({
        where: { employee_id: createTransactionInput.employee_id }
      });
      if (!employee) {
        throw new NotFoundException(`Employee with ID ${createTransactionInput.employee_id} not found`);
      }

      // Handle customer - create new customer if name/phone provided
      let customer: Customer | null = null;
      let customer_id: string | undefined = undefined;
      
      if (createTransactionInput.customer_name && createTransactionInput.customer_phone) {
        // Check if customer already exists with this phone number
        customer = await this.customerRepository.findOne({
          where: { phone_number: createTransactionInput.customer_phone }
        });

        if (!customer) {
          // Create new customer
          const customerId = `CUST${Date.now()}${Math.floor(Math.random() * 1000)}`;
          customer = this.customerRepository.create({
            customer_id: customerId,
            name: createTransactionInput.customer_name,
            phone_number: createTransactionInput.customer_phone,
          });
          customer = await queryRunner.manager.save(customer);
        }
        
        customer_id = customer.customer_id;
      }

      // Validate products and check stock (only user's products)
      const productIds = createTransactionInput.items.map(item => item.product_id);
      const products = await this.productRepository.find({
        where: productIds.map(id => ({ product_id: id, userId })) as any
      });
      
      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }

      // Check stock availability
      for (const item of createTransactionInput.items) {
        const product = products.find(p => p.product_id === item.product_id);
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.product_id} not found`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.product_name}. Available: ${product.stock}, Required: ${item.quantity}`);
        }
      }

      // Calculate totals with standard discount and GST
      let subtotal = 0;
      for (const item of createTransactionInput.items) {
        const itemTotal = (item.unit_price * item.quantity) - (item.discount || 0);
        subtotal += itemTotal;
      }

      // Apply standard 10% store discount
      const storeDiscountRate = 0.1;
      const discount_amount = subtotal * storeDiscountRate;
      const afterDiscount = subtotal - discount_amount;

      // Apply 18% GST
      const gstRate = 0.18;
      const tax_amount = afterDiscount * gstRate;
      const total_amount = afterDiscount + tax_amount;

      // Create transaction with userId
      const transaction = this.transactionRepository.create({
        transaction_id: createTransactionInput.transaction_id,
        payment_method: createTransactionInput.payment_method as any,
        customer_id: customer_id,
        employee_id: createTransactionInput.employee_id,
        payment_refno: createTransactionInput.payment_refno,
        subtotal,
        discount_amount,
        tax_amount,
        total_amount,
        status: TransactionStatus.COMPLETED,
        transaction_date: new Date(),
        userId, // Set the owner
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Create transaction items and update product stock
      const transactionItems: TransactionItem[] = [];
      for (const item of createTransactionInput.items) {
        // Calculate total price with proper validation
        const quantity = Math.max(1, item.quantity); // Ensure minimum quantity of 1
        const unitPrice = Math.max(0, item.unit_price); // Ensure non-negative price
        const discount = Math.max(0, Math.min(item.discount || 0, unitPrice * quantity)); // Ensure discount doesn't exceed total

        const transactionItem = this.transactionItemRepository.create({
          transaction_id: savedTransaction.transaction_id,
          product_id: item.product_id,
          quantity: quantity,
          unit_price: unitPrice,
          discount: discount,
        });

        await queryRunner.manager.save(transactionItem);
        transactionItems.push(transactionItem);

        // Update product stock (only user's products)
        await queryRunner.manager.decrement(
          Product,
          { product_id: item.product_id, userId },
          'stock',
          item.quantity
        );
      }

      await queryRunner.commitTransaction();

      // Return the complete transaction with relations
      return this.findOne(savedTransaction.transaction_id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number = 1, limit: number = 10, status: string | undefined, customer_id: string | undefined, userId: string): Promise<Transaction[]> {
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.customer', 'customer')
      .leftJoinAndSelect('transaction.employee', 'employee')
      .leftJoinAndSelect('transaction.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('transaction.userId = :userId', { userId }) // Filter by user
      .orderBy('transaction.transaction_date', 'DESC');

    if (status) {
      queryBuilder.andWhere('transaction.status = :status', { status });
    }

    if (customer_id) {
      queryBuilder.andWhere('transaction.customer_id = :customer_id', { customer_id });
    }

    return queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOne(transaction_id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transaction_id, userId }, // Filter by user
      relations: ['customer', 'employee', 'items', 'items.product', 'items.product.categories'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transaction_id} not found`);
    }

    return transaction;
  }

  async findByCustomer(customer_id: string, userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { customer_id, userId }, // Filter by user
      relations: ['customer', 'employee', 'items', 'items.product'],
      order: { transaction_date: 'DESC' },
    });
  }

  async findByEmployee(employee_id: string, userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { employee_id, userId }, // Filter by user
      relations: ['customer', 'employee', 'items', 'items.product'],
      order: { transaction_date: 'DESC' },
    });
  }

  async getDailySales(date: Date | undefined, userId: string): Promise<{ total_sales: number; transaction_count: number }> {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.total_amount)', 'total_sales')
      .addSelect('COUNT(transaction.transaction_id)', 'transaction_count')
      .where('transaction.transaction_date BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .getRawOne();

    return {
      total_sales: parseFloat(result.total_sales) || 0,
      transaction_count: parseInt(result.transaction_count) || 0,
    };
  }

  // Customer management methods
  async createCustomer(createCustomerInput: CreateCustomerInput): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerInput);
    return this.customerRepository.save(customer);
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find({
      order: { created_date: 'DESC' },
    });
  }

  async findCustomer(customer_id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customer_id },
      relations: ['transactions'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customer_id} not found`);
    }

    return customer;
  }

  // Employee management methods
  async createEmployee(createEmployeeInput: CreateEmployeeInput): Promise<Employee> {
    const employee = this.employeeRepository.create(createEmployeeInput);
    return this.employeeRepository.save(employee);
  }

  async findAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findEmployee(employee_id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { employee_id },
      relations: ['transactions'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employee_id} not found`);
    }

    return employee;
  }

  // Sales Analytics Methods
  async getSalesOverview(userId: string): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    avgOrderValue: number;
    growthRate: number;
  }> {
    // Get current period (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get previous period (30 days before that)
    const previousEndDate = new Date(startDate);
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - 30);

    const currentPeriod = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.total_amount)', 'total_revenue')
      .addSelect('COUNT(transaction.transaction_id)', 'total_transactions')
      .addSelect('AVG(transaction.total_amount)', 'avg_order_value')
      .where('transaction.transaction_date BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .getRawOne();

    const previousPeriod = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.total_amount)', 'total_revenue')
      .where('transaction.transaction_date BETWEEN :start AND :end', {
        start: previousStartDate,
        end: previousEndDate,
      })
      .andWhere('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .getRawOne();

    const currentRevenue = parseFloat(currentPeriod.total_revenue) || 0;
    const previousRevenue = parseFloat(previousPeriod.total_revenue) || 0;
    const growthRate = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
      totalRevenue: currentRevenue,
      totalTransactions: parseInt(currentPeriod.total_transactions) || 0,
      avgOrderValue: parseFloat(currentPeriod.avg_order_value) || 0,
      growthRate: Math.round(growthRate * 10) / 10,
    };
  }

  async getTopProducts(limit: number = 5, userId: string): Promise<Array<{
    product_id: number;
    product_name: string;
    category_name: string;
    total_sold: number;
    revenue: number;
    avg_price: number;
    trend: string;
  }>> {
    const result = await this.transactionItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.product', 'product')
      .leftJoin('product.categories', 'category')
      .leftJoin('item.transaction', 'transaction')
      .select('item.product_id', 'product_id')
      .addSelect('product.product_name', 'product_name')
      .addSelect('category.name', 'category_name')
      .addSelect('SUM(item.quantity)', 'total_sold')
      .addSelect('SUM(item.unit_price * item.quantity - item.discount)', 'revenue')
      .addSelect('AVG(item.unit_price)', 'avg_price')
      .where('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .groupBy('item.product_id')
      .addGroupBy('product.product_name')
      .addGroupBy('category.name')
      .orderBy('SUM(item.unit_price * item.quantity - item.discount)', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(item => ({
      product_id: parseInt(item.product_id),
      product_name: item.product_name || 'Unknown Product',
      category_name: item.category_name || 'Uncategorized',
      total_sold: parseInt(item.total_sold) || 0,
      revenue: parseFloat(item.revenue) || 0,
      avg_price: parseFloat(item.avg_price) || 0,
      trend: 'stable', // TODO: Calculate actual trend
    }));
  }

  async getPaymentMethodStats(userId: string): Promise<Array<{
    method: string;
    count: number;
    total_amount: number;
    percentage: number;
  }>> {
    const totalResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.total_amount)', 'total')
      .where('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .getRawOne();

    const totalAmount = parseFloat(totalResult.total) || 0;

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.payment_method', 'method')
      .addSelect('COUNT(transaction.transaction_id)', 'count')
      .addSelect('SUM(transaction.total_amount)', 'total_amount')
      .where('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .groupBy('transaction.payment_method')
      .orderBy('SUM(transaction.total_amount)', 'DESC')
      .getRawMany();

    return result.map(item => ({
      method: item.method || 'Unknown',
      count: parseInt(item.count) || 0,
      total_amount: parseFloat(item.total_amount) || 0,
      percentage: totalAmount > 0 ? Math.round((parseFloat(item.total_amount) / totalAmount) * 1000) / 10 : 0,
    }));
  }

  async getRevenueByCategory(userId: string): Promise<Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>> {
    const totalResult = await this.transactionItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.transaction', 'transaction')
      .select('SUM(item.unit_price * item.quantity - item.discount)', 'total')
      .where('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .getRawOne();

    const totalRevenue = parseFloat(totalResult.total) || 0;

    const result = await this.transactionItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.product', 'product')
      .leftJoin('product.categories', 'category')
      .leftJoin('item.transaction', 'transaction')
      .select('category.name', 'category')
      .addSelect('SUM(item.unit_price * item.quantity - item.discount)', 'revenue')
      .where('transaction.status = :status', { status: TransactionStatus.COMPLETED })
      .andWhere('transaction.userId = :userId', { userId }) // Filter by user
      .groupBy('category.name')
      .orderBy('SUM(item.unit_price * item.quantity - item.discount)', 'DESC')
      .getRawMany();

    return result.map(item => ({
      category: item.category || 'Uncategorized',
      revenue: parseFloat(item.revenue) || 0,
      percentage: totalRevenue > 0 ? Math.round((parseFloat(item.revenue) / totalRevenue) * 1000) / 10 : 0,
    }));
  }
}