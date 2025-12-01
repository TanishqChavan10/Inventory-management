import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { ShipmentItemService } from './shipment-item.service';
import { ShipmentItemModel } from './models/shipment-item.model';
import { CreateShipmentItemInput } from './dto/create-shipment-item.input';

@Resolver(() => ShipmentItemModel)
export class ShipmentItemResolver {
  constructor(private readonly shipmentItemService: ShipmentItemService) {}

  @Mutation(() => ShipmentItemModel, { name: 'addShipmentItem' })
  createShipmentItem(
    @Args('createShipmentItemInput')
    createShipmentItemInput: CreateShipmentItemInput,
  ) {
    return this.shipmentItemService.create(createShipmentItemInput);
  }

  @Mutation(() => [ShipmentItemModel], { name: 'addShipmentItems' })
  createMultipleShipmentItems(
    @Args('createShipmentItemsInput', { type: () => [CreateShipmentItemInput] })
    createShipmentItemsInput: CreateShipmentItemInput[],
  ) {
    return this.shipmentItemService.createMultiple(createShipmentItemsInput);
  }

  @Query(() => [ShipmentItemModel], { name: 'shipmentItems' })
  findAll(
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
  ) {
    return this.shipmentItemService.findAll(page, limit);
  }

  @Query(() => ShipmentItemModel, { name: 'shipmentItem' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.shipmentItemService.findOne(id);
  }

  @Query(() => [ShipmentItemModel], { name: 'shipmentItemsByShipment' })
  findByShipment(@Args('shipment_id', { type: () => ID }) shipment_id: string) {
    return this.shipmentItemService.findByShipment(shipment_id);
  }

  @Query(() => [ShipmentItemModel], { name: 'shipmentItemsBySupplier' })
  findBySupplier(@Args('supplier_id', { type: () => ID }) supplier_id: string) {
    return this.shipmentItemService.findBySupplier(supplier_id);
  }

  @Query(() => [ShipmentItemModel], { name: 'expiringShipmentItems' })
  getExpiringItems(
    @Args('days', { type: () => Int, defaultValue: 30 }) days?: number,
  ) {
    return this.shipmentItemService.getExpiringItems(days);
  }

  @Mutation(() => ShipmentItemModel, { name: 'deleteShipmentItem' })
  removeShipmentItem(@Args('id', { type: () => ID }) id: string) {
    return this.shipmentItemService.remove(id);
  }
}
