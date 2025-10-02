import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const { categoryIds, ...productData } = createProductInput;
    
    const product = this.productRepository.create(productData);

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        category_id: In(categoryIds),
      });
      product.categories = categories;
    }

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['categories'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
    const { categoryIds, ...productData } = updateProductInput;
    const product = await this.findOne(id);

    Object.assign(product, productData);

    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoryRepository.findBy({
          category_id: In(categoryIds),
        });
        product.categories = categories;
      } else {
        product.categories = [];
      }
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<boolean> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return true;
  }

  async findByName(name: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { product_name: name },
      relations: ['categories'],
    });
  }

  async searchByName(searchTerm: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .leftJoinAndSelect('product.categories', 'categories')
      .getMany();
  }

  async findLowStockProducts(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock <= product.min_stock')
      .leftJoinAndSelect('product.categories', 'categories')
      .getMany();
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('category.category_id = :categoryId', { categoryId })
      .getMany();
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock += quantity;
    return await this.productRepository.save(product);
  }

  async getTotalValue(): Promise<number> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.stock * product.default_price)', 'total')
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}