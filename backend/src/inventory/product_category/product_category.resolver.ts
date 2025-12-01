import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductCategoryService } from './product_category.service';
import { ProductCategory } from './product_category.model';
import { CreateProductCategoryInput } from './dto/create-product-category.input';
import { RemoveProductCategoryInput } from './dto/remove-product-category.input';

@Resolver(() => ProductCategory)
export class ProductCategoryResolver {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Mutation(() => ProductCategory)
  async createProductCategory(
    @Args('createProductCategoryInput')
    createProductCategoryInput: CreateProductCategoryInput,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.create(createProductCategoryInput);
  }

  @Query(() => [ProductCategory], { name: 'productCategories' })
  async findAllProductCategories(): Promise<ProductCategory[]> {
    return await this.productCategoryService.findAll();
  }

  @Query(() => [ProductCategory], { name: 'productCategoriesByProduct' })
  async findProductCategoriesByProduct(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<ProductCategory[]> {
    return await this.productCategoryService.findByProduct(productId);
  }

  @Query(() => [ProductCategory], { name: 'productCategoriesByCategory' })
  async findProductCategoriesByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<ProductCategory[]> {
    return await this.productCategoryService.findByCategory(categoryId);
  }

  @Mutation(() => Boolean)
  async removeProductCategory(
    @Args('removeProductCategoryInput')
    removeProductCategoryInput: RemoveProductCategoryInput,
  ): Promise<boolean> {
    return await this.productCategoryService.remove(removeProductCategoryInput);
  }

  @Mutation(() => Boolean)
  async removeAllCategoriesFromProduct(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<boolean> {
    return await this.productCategoryService.removeAllByProduct(productId);
  }

  @Mutation(() => Boolean)
  async removeAllProductsFromCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<boolean> {
    return await this.productCategoryService.removeAllByCategory(categoryId);
  }

  @Mutation(() => [ProductCategory])
  async bulkAssignCategoriesToProduct(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('categoryIds', { type: () => [Int] }) categoryIds: number[],
  ): Promise<ProductCategory[]> {
    return await this.productCategoryService.bulkAssignCategoriesToProduct(
      productId,
      categoryIds,
    );
  }
}
