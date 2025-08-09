import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Shipment } from './shipment.entity';
import { ShipmentItem } from './shipment-item.entity';
import { Supplier } from './supplier.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports:[TypeOrmModule.forFeature([Shipment, ShipmentItem,Supplier]),],
  providers: [InventoryService]

})
export class InventoryModule {}
