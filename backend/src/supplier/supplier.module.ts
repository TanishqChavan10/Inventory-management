import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Shipment } from './shipment.entity';
import { ShipmentItem } from './shipment-item.entity';
import { Product } from '../inventory/product/product.entity';
import { SupplierService } from './supplier.service';
import { ShipmentService } from './shipment.service';
import { ShipmentItemService } from './shipment-item.service';
import { SupplierResolver } from './supplier.resolver';
import { ShipmentResolver } from './shipment.resolver';
import { ShipmentItemResolver } from './shipment-item.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, Shipment, ShipmentItem, Product]),
    AuthModule,
  ],
  providers: [
    SupplierService,
    ShipmentService,
    ShipmentItemService,
    SupplierResolver,
    ShipmentResolver,
    ShipmentItemResolver,
  ],
  exports: [SupplierService, ShipmentService, ShipmentItemService],
})
export class SupplierModule {}
