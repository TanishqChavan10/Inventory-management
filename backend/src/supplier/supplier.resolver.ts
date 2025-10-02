import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { SupplierService } from './supplier.service';
import { SupplierModel } from './models/supplier.model';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { Product } from '../inventory/product/product.model';

@Resolver(() => SupplierModel)
export class SupplierResolver {
  constructor(private readonly supplierService: SupplierService) {}

  @Mutation(() => SupplierModel, { name: 'addSupplier' })
  createSupplier(@Args('createSupplierInput') createSupplierInput: CreateSupplierInput) {
    return this.supplierService.create(createSupplierInput);
  }

  @Query(() => [SupplierModel], { name: 'suppliers' })
  findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
    @Args('status', { type: () => String, nullable: true }) status?: string,
  ) {
    return this.supplierService.findAll(page, limit, status);
  }

  @Query(() => SupplierModel, { name: 'supplier' })
  findOne(@Args('supplier_id', { type: () => ID }) supplier_id: string) {
    return this.supplierService.findOne(supplier_id);
  }

  @Query(() => [Product], { name: 'supplierProducts' })
  async findProductsBySupplierCategory(@Args('supplier_id', { type: () => ID }) supplier_id: string) {
    return this.supplierService.findProductsBySupplierCategory(supplier_id);
  }

  @Mutation(() => SupplierModel, { name: 'updateSupplier' })
  updateSupplier(@Args('updateSupplierInput') updateSupplierInput: UpdateSupplierInput) {
    return this.supplierService.update(updateSupplierInput);
  }

  @Mutation(() => SupplierModel, { name: 'deleteSupplier' })
  removeSupplier(@Args('supplier_id', { type: () => ID }) supplier_id: string) {
    return this.supplierService.remove(supplier_id);
  }

  @Query(() => String, { name: 'supplierStats' })
  async getSupplierStats(@Args('supplier_id', { type: () => ID }) supplier_id: string) {
    const stats = await this.supplierService.getSupplierStats(supplier_id);
    return JSON.stringify(stats);
  }
}