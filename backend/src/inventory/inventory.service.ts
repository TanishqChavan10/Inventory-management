import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductInput } from './dtos/create-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const newProduct = this.productsRepository.create(createProductInput);
    return this.productsRepository.save(newProduct);
  }

  async findAll(category?: string, page: number = 1, limit: number = 5): Promise<Product[]> {
    const skip = (page - 1) * limit;
    const where = category ? { category } : {};
    
    return this.productsRepository.find({
      where,
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }
  
  async remove(id: string): Promise<Product> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return product; // Return the deleted product for the response
  }
}