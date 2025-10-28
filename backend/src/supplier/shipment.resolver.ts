import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentModel } from './models/shipment.model';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => ShipmentModel)
@UseGuards(JwtAuthGuard)
export class ShipmentResolver {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Mutation(() => ShipmentModel, { name: 'addShipment' })
  createShipment(
    @Args('createShipmentInput') createShipmentInput: CreateShipmentInput,
    @CurrentUser() user: User,
  ) {
    return this.shipmentService.create(createShipmentInput, user.id);
  }

  @Query(() => [ShipmentModel], { name: 'shipments' })
  findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('supplier_id', { type: () => String, nullable: true }) supplier_id: string | undefined,
    @CurrentUser() user: User,
  ) {
    return this.shipmentService.findAll(page, limit, supplier_id, user.id);
  }

  @Query(() => ShipmentModel, { name: 'shipment' })
  findOne(
    @Args('shipment_id', { type: () => ID }) shipment_id: string,
    @CurrentUser() user: User,
  ) {
    return this.shipmentService.findOne(shipment_id, user.id);
  }

  @Query(() => [ShipmentModel], { name: 'shipmentsBySupplier' })
  findBySupplier(
    @Args('supplier_id', { type: () => ID }) supplier_id: string,
    @CurrentUser() user: User,
  ) {
    return this.shipmentService.findBySupplier(supplier_id, user.id);
  }

  @Mutation(() => ShipmentModel, { name: 'updateShipmentPaymentStatus' })
  updatePaymentStatus(
    @Args('shipment_id', { type: () => ID }) shipment_id: string,
    @Args('payment_status', { type: () => String }) payment_status: 'Pending' | 'Paid' | 'Failed',
    @CurrentUser() user: User,
  ) {
    return this.shipmentService.updatePaymentStatus(shipment_id, payment_status, user.id);
  }

  @Mutation(() => ShipmentModel, { name: 'deleteShipment' })
  removeShipment(
    @Args('shipment_id', { type: () => ID }) shipment_id: string,
    @CurrentUser() user: User,
  ) {
    return this.shipmentService.remove(shipment_id, user.id);
  }
}