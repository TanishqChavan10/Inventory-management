import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierModel } from './models/supplier.model';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { Product } from '../inventory/product/product.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => SupplierModel)
@UseGuards(JwtAuthGuard)
export class SupplierResolver {
  constructor(private readonly supplierService: SupplierService) {}

  @Mutation(() => SupplierModel, { name: 'addSupplier' })
  createSupplier(
    @Args('createSupplierInput') createSupplierInput: CreateSupplierInput,
    @CurrentUser() user: User,
  ) {
    return this.supplierService.create(createSupplierInput, user.id);
  }

  @Query(() => [SupplierModel], { name: 'suppliers' })
  findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('status', { type: () => String, nullable: true }) status: string | undefined,
    @CurrentUser() user: User,
  ) {
    return this.supplierService.findAll(page, limit, status, user.id);
  }

  @Query(() => SupplierModel, { name: 'supplier' })
  findOne(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @CurrentUser() user: User,
  ) {
    return this.supplierService.findOne(supplier_id, user.id);
  }

  @Query(() => [Product], { name: 'supplierProducts' })
  async findProductsBySupplierCategory(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @CurrentUser() user: User,
  ) {
    return this.supplierService.findProductsBySupplierCategory(supplier_id, user.id);
  }

  @Mutation(() => SupplierModel, { name: 'updateSupplier' })
  updateSupplier(
    @Args('updateSupplierInput') updateSupplierInput: UpdateSupplierInput,
    @CurrentUser() user: User,
  ) {
    return this.supplierService.update(updateSupplierInput, user.id);
  }

  @Mutation(() => SupplierModel, { name: 'deleteSupplier' })
  removeSupplier(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @CurrentUser() user: User,
  ) {
    return this.supplierService.remove(supplier_id, user.id);
  }

  @Query(() => String, { name: 'supplierStats' })
  async getSupplierStats(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @CurrentUser() user: User,
  ) {
    const stats = await this.supplierService.getSupplierStats(supplier_id, user.id);
    return JSON.stringify(stats);
  }
}