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
import { User } from '../auth/entities/user.entity';

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

  // Multi-tenant: Each shipment belongs to a user
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.shipments)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relationships
  @ManyToOne(() => Supplier, (supplier) => supplier.shipments)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => ShipmentItem, (shipmentItem) => shipmentItem.shipment)
  shipmentItems: ShipmentItem[];
}
