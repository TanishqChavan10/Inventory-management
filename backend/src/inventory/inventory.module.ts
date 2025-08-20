import { Module } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsService } from './inventory.service';
import { ProductsResolver } from './inventory.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsResolver, ProductsService],
})
export class InventoryModule {}
