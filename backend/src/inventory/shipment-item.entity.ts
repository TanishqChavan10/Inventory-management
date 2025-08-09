import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';
import { Product } from 'src/products/product.entity';

@Entity()
export class ShipmentItem {
  @PrimaryGeneratedColumn()
  shipment_item_id: number;

  @Column()
  quantity_recieved: number;

  @Column({ type: 'float' })
  unit_price: number; // This is the cost price from the supplier

  @Column({ type: 'timestamp', nullable: true })
  mfg_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiry_date: Date;

  @ManyToOne(() => Shipment, (shipment) => shipment.shipmentItems)
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @ManyToOne(() => Product, (product) => product.shipmentItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}