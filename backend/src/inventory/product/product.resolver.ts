import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { ClerkUser } from '../../auth/decorators/clerk-user.decorator';
import { ClerkService } from '../../auth/clerk.service';

@Resolver(() => Product)
@UseGuards(ClerkAuthGuard)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly clerkService: ClerkService,
  ) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<Product> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.create(createProductInput, user.id);
  }

  @Query(() => [Product], { name: 'products' })
  async findAllProducts(@ClerkUser() clerkUser: { clerkId: string }): Promise<Product[]> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.findAll(user.id);
  }

  @Query(() => Product, { name: 'product' })
  async findOneProduct(
    @Args('id', { type: () => Int }) id: number,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<Product> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.findOne(id, user.id);
  }

  @Query(() => [Product], { name: 'productsByName' })
  async findProductsByName(
    @Args('name') name: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<Product[]> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.findByName(name, user.id);
  }

  @Query(() => [Product], { name: 'searchProducts' })
  async searchProducts(
    @Args('searchTerm') searchTerm: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<Product[]> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.searchByName(searchTerm, user.id);
  }

  @Query(() => [Product], { name: 'lowStockProducts' })
  async findLowStockProducts(@ClerkUser() clerkUser: { clerkId: string }): Promise<Product[]> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.findLowStockProducts(user.id);
  }

  @Query(() => [Product], { name: 'productsByCategory' })
  async findProductsByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<Product[]> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.findByCategory(categoryId, user.id);
  }

  @Query(() => Float, { name: 'totalInventoryValue' })
  async getTotalInventoryValue(@ClerkUser() clerkUser: { clerkId: string }): Promise<number> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.getTotalValue(user.id);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<Product> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.update(updateProductInput.product_id, updateProductInput, user.id);
  }

  @Mutation(() => Product)
  async updateProductStock(
    @Args('id', { type: () => Int }) id: number,
    @Args('quantity', { type: () => Int }) quantity: number,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<Product> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.updateStock(id, quantity, user.id);
  }

  @Mutation(() => Boolean)
  async removeProduct(
    @Args('id', { type: () => Int }) id: number,
    @ClerkUser() clerkUser: { clerkId: string },
  ): Promise<boolean> {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return await this.productService.remove(id, user.id);
  }
}