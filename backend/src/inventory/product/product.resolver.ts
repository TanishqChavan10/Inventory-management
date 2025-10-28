import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/entities/user.entity';

@Resolver(() => Product)
@UseGuards(JwtAuthGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return await this.productService.create(createProductInput, user.id);
  }

  @Query(() => [Product], { name: 'products' })
  async findAllProducts(@CurrentUser() user: User): Promise<Product[]> {
    return await this.productService.findAll(user.id);
  }

  @Query(() => Product, { name: 'product' })
  async findOneProduct(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return await this.productService.findOne(id, user.id);
  }

  @Query(() => [Product], { name: 'productsByName' })
  async findProductsByName(
    @Args('name') name: string,
    @CurrentUser() user: User,
  ): Promise<Product[]> {
    return await this.productService.findByName(name, user.id);
  }

  @Query(() => [Product], { name: 'searchProducts' })
  async searchProducts(
    @Args('searchTerm') searchTerm: string,
    @CurrentUser() user: User,
  ): Promise<Product[]> {
    return await this.productService.searchByName(searchTerm, user.id);
  }

  @Query(() => [Product], { name: 'lowStockProducts' })
  async findLowStockProducts(@CurrentUser() user: User): Promise<Product[]> {
    return await this.productService.findLowStockProducts(user.id);
  }

  @Query(() => [Product], { name: 'productsByCategory' })
  async findProductsByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
    @CurrentUser() user: User,
  ): Promise<Product[]> {
    return await this.productService.findByCategory(categoryId, user.id);
  }

  @Query(() => Float, { name: 'totalInventoryValue' })
  async getTotalInventoryValue(@CurrentUser() user: User): Promise<number> {
    return await this.productService.getTotalValue(user.id);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return await this.productService.update(updateProductInput.product_id, updateProductInput, user.id);
  }

  @Mutation(() => Product)
  async updateProductStock(
    @Args('id', { type: () => Int }) id: number,
    @Args('quantity', { type: () => Int }) quantity: number,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return await this.productService.updateStock(id, quantity, user.id);
  }

  @Mutation(() => Boolean)
  async removeProduct(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.productService.remove(id, user.id);
  }
}