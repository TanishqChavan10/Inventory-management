import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/entities/user.entity';

@Resolver(() => Category)
@UseGuards(JwtAuthGuard)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryInput, user.id);
  }

  @Query(() => [Category], { name: 'categories' })
  async findAllCategories(@CurrentUser() user: User): Promise<Category[]> {
    return await this.categoryService.findAll(user.id);
  }

  @Query(() => [Category], { name: 'categoriesSimple' })
  async findAllCategoriesSimple(@CurrentUser() user: User): Promise<Category[]> {
    return await this.categoryService.findAllSimple(user.id);
  }

  @Query(() => Category, { name: 'category' })
  async findOneCategory(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return await this.categoryService.findOne(id, user.id);
  }

  @Query(() => [Category], { name: 'categoriesByName' })
  async findCategoriesByName(
    @Args('name') name: string,
    @CurrentUser() user: User,
  ): Promise<Category[]> {
    return await this.categoryService.findByName(name, user.id);
  }

  @Query(() => [Category], { name: 'searchCategories' })
  async searchCategories(
    @Args('searchTerm') searchTerm: string,
    @CurrentUser() user: User,
  ): Promise<Category[]> {
    return await this.categoryService.searchByName(searchTerm, user.id);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
    @CurrentUser() user: User,
  ): Promise<Category> {
    return await this.categoryService.update(updateCategoryInput.category_id, updateCategoryInput, user.id);
  }

  @Mutation(() => Boolean)
  async removeCategory(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.categoryService.remove(id, user.id);
  }
}