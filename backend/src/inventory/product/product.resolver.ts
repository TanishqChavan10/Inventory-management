import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return await this.productService.create(createProductInput);
  }

  @Query(() => [Product], { name: 'products' })
  async findAllProducts(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  async findOneProduct(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Query(() => [Product], { name: 'productsByName' })
  async findProductsByName(@Args('name') name: string): Promise<Product[]> {
    return await this.productService.findByName(name);
  }

  @Query(() => [Product], { name: 'searchProducts' })
  async searchProducts(@Args('searchTerm') searchTerm: string): Promise<Product[]> {
    return await this.productService.searchByName(searchTerm);
  }

  @Query(() => [Product], { name: 'lowStockProducts' })
  async findLowStockProducts(): Promise<Product[]> {
    return await this.productService.findLowStockProducts();
  }

  @Query(() => [Product], { name: 'productsByCategory' })
  async findProductsByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<Product[]> {
    return await this.productService.findByCategory(categoryId);
  }

  @Query(() => Float, { name: 'totalInventoryValue' })
  async getTotalInventoryValue(): Promise<number> {
    return await this.productService.getTotalValue();
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return await this.productService.update(updateProductInput.product_id, updateProductInput);
  }

  @Mutation(() => Product)
  async updateProductStock(
    @Args('id', { type: () => Int }) id: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<Product> {
    return await this.productService.updateStock(id, quantity);
  }

  @Mutation(() => Boolean)
  async removeProduct(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return await this.productService.remove(id);
  }
}