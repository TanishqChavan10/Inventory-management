import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Transaction } from './transaction.entity';
import { OrderItem } from './order-item.entity';
import { Customer } from './customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[TypeOrmModule.forFeature([Transaction, OrderItem,Customer]),],
  providers: [SalesService]
})
export class SalesModule {}
