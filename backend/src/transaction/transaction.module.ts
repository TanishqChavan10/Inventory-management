import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionItem } from './transaction-item.entity';
import { Customer } from './customer.entity';
import { Employee } from './employee.entity';
import { Product } from '../inventory/product/product.entity';
import { TransactionService } from './transaction.service';
import { TransactionResolver, CustomerResolver, EmployeeResolver } from './transaction.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      TransactionItem,
      Customer,
      Employee,
      Product,
    ]),
    AuthModule,
  ],
  providers: [
    TransactionService,
    TransactionResolver,
    CustomerResolver,
    EmployeeResolver,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}