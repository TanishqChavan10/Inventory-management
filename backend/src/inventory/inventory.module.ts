import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product_category/product_category.module';

@Module({
  imports: [CategoryModule, ProductModule, ProductCategoryModule],
  exports: [CategoryModule, ProductModule, ProductCategoryModule],
})
export class InventoryModule {}
