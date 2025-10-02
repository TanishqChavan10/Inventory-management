import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryInput);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['products'],
    });
  }

  async findAllSimple(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    const category = await this.findOne(id);
    
    Object.assign(category, updateCategoryInput);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<boolean> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return true;
  }

  async findByName(name: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { name: name },
      relations: ['products'],
    });
  }

  async searchByName(searchTerm: string): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .leftJoinAndSelect('category.products', 'products')
      .getMany();
  }
}