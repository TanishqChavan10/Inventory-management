import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  supplier_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 20 })
  phone_no: string;

  @OneToMany(() => Shipment, (shipment) => shipment.supplier)
  shipments: Shipment[];
}