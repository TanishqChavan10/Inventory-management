import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierModel } from './models/supplier.model';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { Product } from '../inventory/product/product.model';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ClerkUser } from '../auth/decorators/clerk-user.decorator';
import { ClerkService } from '../auth/clerk.service';

@Resolver(() => SupplierModel)
@UseGuards(ClerkAuthGuard)
export class SupplierResolver {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly clerkService: ClerkService,
  ) {}

  @Mutation(() => SupplierModel, { name: 'addSupplier' })
  async createSupplier(
    @Args('createSupplierInput') createSupplierInput: CreateSupplierInput,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.supplierService.create(createSupplierInput, user.id);
  }

  @Query(() => [SupplierModel], { name: 'suppliers' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('status', { type: () => String, nullable: true }) status: string | undefined,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.supplierService.findAll(page, limit, status, user.id);
  }

  @Query(() => SupplierModel, { name: 'supplier' })
  async findOne(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.supplierService.findOne(supplier_id, user.id);
  }

  @Query(() => [Product], { name: 'supplierProducts' })
  async findProductsBySupplierCategory(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.supplierService.findProductsBySupplierCategory(supplier_id, user.id);
  }

  @Mutation(() => SupplierModel, { name: 'updateSupplier' })
  async updateSupplier(
    @Args('updateSupplierInput') updateSupplierInput: UpdateSupplierInput,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.supplierService.update(updateSupplierInput, user.id);
  }

  @Mutation(() => SupplierModel, { name: 'deleteSupplier' })
  async removeSupplier(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.supplierService.remove(supplier_id, user.id);
  }

  @Query(() => String, { name: 'supplierStats' })
  async getSupplierStats(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    const stats = await this.supplierService.getSupplierStats(supplier_id, user.id);
    return JSON.stringify(stats);
  }
}