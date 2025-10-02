import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Supplier } from './supplier.entity';
import { ShipmentItem } from './shipment-item.entity';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  shipment_id: string;

  @Column()
  supplier_id: string;

  @Column()
  ref_no: string;

  @CreateDateColumn()
  received_date: Date;

  @Column({ default: 'Pending' })
  payment_status: 'Pending' | 'Paid' | 'Failed';

  @Column()
  payment_mthd: string;

  @Column('decimal', { precision: 10, scale: 2 })
  invoice_amt: number;

  @Column('int')
  total_items: number;

  // Relationships
  @ManyToOne(() => Supplier, supplier => supplier.shipments)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => ShipmentItem, shipmentItem => shipmentItem.shipment)
  shipmentItems: ShipmentItem[];
}