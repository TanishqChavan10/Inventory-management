import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  async findAllCategories(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @Query(() => [Category], { name: 'categoriesSimple' })
  async findAllCategoriesSimple(): Promise<Category[]> {
    return await this.categoryService.findAllSimple();
  }

  @Query(() => Category, { name: 'category' })
  async findOneCategory(@Args('id', { type: () => Int }) id: number): Promise<Category> {
    return await this.categoryService.findOne(id);
  }

  @Query(() => [Category], { name: 'categoriesByName' })
  async findCategoriesByName(@Args('name') name: string): Promise<Category[]> {
    return await this.categoryService.findByName(name);
  }

  @Query(() => [Category], { name: 'searchCategories' })
  async searchCategories(@Args('searchTerm') searchTerm: string): Promise<Category[]> {
    return await this.categoryService.searchByName(searchTerm);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return await this.categoryService.update(updateCategoryInput.category_id, updateCategoryInput);
  }

  @Mutation(() => Boolean)
  async removeCategory(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return await this.categoryService.remove(id);
  }
}