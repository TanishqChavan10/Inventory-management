// src/products/products.resolver.ts

import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { ProductsService } from './inventory.service';
import { ProductModel } from './models/product.model';
import { CreateProductInput } from './dtos/create-product.input';

@Resolver(() => ProductModel)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => ProductModel, { name: 'addProduct' })
  createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [ProductModel], { name: 'products' })
  findAll(
    @Args('category', { type: () => String, nullable: true }) category?: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit?: number,
  ) {
    return this.productsService.findAll(category, page, limit);
  }

  @Query(() => ProductModel, { name: 'product' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findOne(id);
  }

  @Mutation(() => ProductModel, { name: 'deleteProduct' })
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.remove(id);
  }
}