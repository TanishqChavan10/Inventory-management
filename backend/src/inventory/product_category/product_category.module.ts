import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './product_category.entity';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';
import { ProductCategoryService } from './product_category.service';
import { ProductCategoryResolver } from './product_category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory, Product, Category])],
  providers: [ProductCategoryResolver, ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}