import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { ShipmentItem } from './shipment-item.entity';

@Entity()
export class Shipment {
  @PrimaryGeneratedColumn()
  shipment_id: number;

  @CreateDateColumn()
  received_date: Date;

  @Column({ type: 'float' })
  invoice_amt: number;

  @Column({ length: 50 })
  payment_mthd: string;

  @Column({ length: 50, default: 'Pending' })
  payment_status: string;

  @Column({ length: 100, nullable: true })
  ref_no: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.shipments)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => ShipmentItem, (item) => item.shipment, { cascade: true })
  shipmentItems: ShipmentItem[];
}