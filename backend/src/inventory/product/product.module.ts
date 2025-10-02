import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
})
export class ProductModule {}