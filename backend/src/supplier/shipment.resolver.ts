import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentModel } from './models/shipment.model';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { ClerkUser } from '../auth/decorators/clerk-user.decorator';
import { ClerkService } from '../auth/clerk.service';

@Resolver(() => ShipmentModel)
@UseGuards(ClerkAuthGuard)
export class ShipmentResolver {
  constructor(
    private readonly shipmentService: ShipmentService,
    private readonly clerkService: ClerkService,
  ) {}

  @Mutation(() => ShipmentModel, { name: 'addShipment' })
  async createShipment(
    @Args('createShipmentInput') createShipmentInput: CreateShipmentInput,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.shipmentService.create(createShipmentInput, user.id);
  }

  @Query(() => [ShipmentModel], { name: 'shipments' })
  async findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('supplier_id', { type: () => String, nullable: true }) supplier_id: string | undefined,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.shipmentService.findAll(page, limit, supplier_id, user.id);
  }

  @Query(() => ShipmentModel, { name: 'shipment' })
  async findOne(
    @Args('shipment_id', { type: () => ID }) shipment_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.shipmentService.findOne(shipment_id, user.id);
  }

  @Query(() => [ShipmentModel], { name: 'shipmentsBySupplier' })
  async findBySupplier(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.shipmentService.findBySupplier(supplier_id, user.id);
  }

  @Mutation(() => ShipmentModel, { name: 'updateShipmentPaymentStatus' })
  async updatePaymentStatus(
    @Args('shipment_id', { type: () => ID }) shipment_id: string,
    @Args('payment_status', { type: () => String }) payment_status: 'Pending' | 'Paid' | 'Failed',
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.shipmentService.updatePaymentStatus(shipment_id, payment_status, user.id);
  }

  @Mutation(() => ShipmentModel, { name: 'deleteShipment' })
  async removeShipment(
    @Args('shipment_id', { type: () => ID }) shipment_id: string,
    @ClerkUser() clerkUser: { clerkId: string },
  ) {
    const user = await this.clerkService.getUserByClerkId(clerkUser.clerkId);
    return this.shipmentService.remove(shipment_id, user.id);
  }
}