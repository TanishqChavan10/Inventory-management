import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity('shipment_items')
export class ShipmentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipment_id: string;

  @Column()
  product_id: string;

  @Column()
  product_name: string;

  @Column('int')
  quantity_received: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column({ nullable: true })
  mfg_date?: Date;

  @Column({ nullable: true })
  expiry_date?: Date;

  @Column({ nullable: true })
  batch_number?: string;

  // Relationships
  @ManyToOne(() => Shipment, shipment => shipment.shipmentItems)
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;
}