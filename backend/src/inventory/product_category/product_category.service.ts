import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './product_category.entity';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';
import { CreateProductCategoryInput } from './dto/create-product-category.input';
import { RemoveProductCategoryInput } from './dto/remove-product-category.input';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createProductCategoryInput: CreateProductCategoryInput,
  ): Promise<ProductCategory> {
    const { product_id, category_id } = createProductCategoryInput;

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { product_id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    // Check if category exists
    const category = await this.categoryRepository.findOne({
      where: { category_id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }

    // Check if relationship already exists
    const existingRelation = await this.productCategoryRepository.findOne({
      where: { product_id, category_id },
    });
    if (existingRelation) {
      throw new BadRequestException(
        `Product ${product_id} is already associated with category ${category_id}`,
      );
    }

    const productCategory = this.productCategoryRepository.create({
      product_id,
      category_id,
    });

    return await this.productCategoryRepository.save(productCategory);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find();
  }

  async findByProduct(productId: number): Promise<ProductCategory[]> {
    const product = await this.productRepository.findOne({
      where: { product_id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return await this.productCategoryRepository.find({
      where: { product_id: productId },
    });
  }

  async findByCategory(categoryId: number): Promise<ProductCategory[]> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return await this.productCategoryRepository.find({
      where: { category_id: categoryId },
    });
  }

  async remove(
    removeProductCategoryInput: RemoveProductCategoryInput,
  ): Promise<boolean> {
    const { product_id, category_id } = removeProductCategoryInput;

    const productCategory = await this.productCategoryRepository.findOne({
      where: { product_id, category_id },
    });

    if (!productCategory) {
      throw new NotFoundException(
        `Association between product ${product_id} and category ${category_id} not found`,
      );
    }

    await this.productCategoryRepository.remove(productCategory);
    return true;
  }

  async removeAllByProduct(productId: number): Promise<boolean> {
    const productCategories = await this.findByProduct(productId);
    if (productCategories.length > 0) {
      await this.productCategoryRepository.remove(productCategories);
    }
    return true;
  }

  async removeAllByCategory(categoryId: number): Promise<boolean> {
    const productCategories = await this.findByCategory(categoryId);
    if (productCategories.length > 0) {
      await this.productCategoryRepository.remove(productCategories);
    }
    return true;
  }

  async bulkAssignCategoriesToProduct(
    productId: number,
    categoryIds: number[],
  ): Promise<ProductCategory[]> {
    // Remove existing associations
    await this.removeAllByProduct(productId);

    // Create new associations
    const productCategories: ProductCategory[] = [];
    for (const categoryId of categoryIds) {
      const productCategory = await this.create({
        product_id: productId,
        category_id: categoryId,
      });
      productCategories.push(productCategory);
    }

    return productCategories;
  }
}
