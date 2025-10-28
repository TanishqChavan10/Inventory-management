import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async create(createProductInput: CreateProductInput, userId: string): Promise<Product> {
    const { categoryIds, ...productData } = createProductInput;
    
    const product = this.productRepository.create({
      ...productData,
      userId, // Set the owner
    });

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        category_id: In(categoryIds),
        userId, // Only use user's own categories
      });
      product.categories = categories;
    }

    return await this.productRepository.save(product);
  }

  async findAll(userId: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { userId }, // Filter by user
      relations: ['categories'],
    });
  }

  async findOne(id: number, userId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_id: id, userId }, // Filter by user
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductInput: UpdateProductInput, userId: string): Promise<Product> {
    const { categoryIds, ...productData } = updateProductInput;
    const product = await this.findOne(id, userId);

    Object.assign(product, productData);

    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoryRepository.findBy({
          category_id: In(categoryIds),
          userId, // Only use user's own categories
        });
        product.categories = categories;
      } else {
        product.categories = [];
      }
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number, userId: string): Promise<boolean> {
    const product = await this.findOne(id, userId);
    await this.productRepository.remove(product);
    return true;
  }

  async findByName(name: string, userId: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { product_name: name, userId }, // Filter by user
      relations: ['categories'],
    });
  }

  async searchByName(searchTerm: string, userId: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('product.userId = :userId', { userId }) // Filter by user
      .leftJoinAndSelect('product.categories', 'categories')
      .getMany();
  }

  async findLowStockProducts(userId: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock <= product.min_stock')
      .andWhere('product.userId = :userId', { userId }) // Filter by user
      .leftJoinAndSelect('product.categories', 'categories')
      .getMany();
  }

  async findByCategory(categoryId: number, userId: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .where('category.category_id = :categoryId', { categoryId })
      .andWhere('product.userId = :userId', { userId }) // Filter by user
      .getMany();
  }

  async updateStock(id: number, quantity: number, userId: string): Promise<Product> {
    const product = await this.findOne(id, userId);
    product.stock += quantity;
    return await this.productRepository.save(product);
  }

  async getTotalValue(userId: string): Promise<number> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.stock * product.default_price)', 'total')
      .where('product.userId = :userId', { userId }) // Filter by user
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }
}