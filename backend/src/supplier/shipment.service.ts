import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentItem } from './shipment-item.entity';
import { CreateShipmentInput } from './dto/create-shipment.input';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentItem)
    private shipmentItemRepository: Repository<ShipmentItem>,
  ) {}

  private generateRandomDates(orderDate: Date) {
    // Manufacturing date: 1-6 months before order date
    const mfgDaysBack = Math.floor(Math.random() * 180) + 30; // 30-210 days back
    const mfg_date = new Date(orderDate);
    mfg_date.setDate(mfg_date.getDate() - mfgDaysBack);

    // Expiry date: 6 months to 3 years after manufacturing date
    const expiryDaysForward = Math.floor(Math.random() * 912) + 180; // 180-1092 days (6 months to 3 years)
    const expiry_date = new Date(mfg_date);
    expiry_date.setDate(expiry_date.getDate() + expiryDaysForward);

    return { mfg_date, expiry_date };
  }

  async create(createShipmentInput: CreateShipmentInput): Promise<Shipment> {
    const { items, ...shipmentData } = createShipmentInput;
    
    // Set received_date to current date if not provided
    if (!shipmentData.received_date) {
      shipmentData.received_date = new Date();
    }

    const shipment = this.shipmentRepository.create(shipmentData);
    const savedShipment = await this.shipmentRepository.save(shipment);

    // Create shipment items with auto-generated dates
    const shipmentItems = items.map(item => {
      const { mfg_date, expiry_date } = this.generateRandomDates(shipmentData.received_date as Date);
      
      return this.shipmentItemRepository.create({
        ...item,
        shipment_id: savedShipment.shipment_id,
        mfg_date,
        expiry_date,
      });
    });

    await this.shipmentItemRepository.save(shipmentItems);

    return await this.findOne(savedShipment.shipment_id);
  }

  async findAll(page: number = 1, limit: number = 10, supplier_id?: string): Promise<Shipment[]> {
    const queryBuilder = this.shipmentRepository.createQueryBuilder('shipment');

    if (supplier_id) {
      queryBuilder.where('shipment.supplier_id = :supplier_id', { supplier_id });
    }

    return await queryBuilder
      .leftJoinAndSelect('shipment.supplier', 'supplier')
      .orderBy('shipment.received_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOne(shipment_id: string): Promise<Shipment> {
    const shipment = await this.shipmentRepository.findOne({
      where: { shipment_id },
      relations: ['supplier', 'shipmentItems'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${shipment_id} not found`);
    }

    return shipment;
  }

  async findBySupplier(supplier_id: string): Promise<Shipment[]> {
    return await this.shipmentRepository.find({
      where: { supplier_id },
      relations: ['shipmentItems'],
      order: { received_date: 'DESC' },
    });
  }

  async updatePaymentStatus(shipment_id: string, payment_status: 'Pending' | 'Paid' | 'Failed'): Promise<Shipment> {
    await this.shipmentRepository.update(shipment_id, { payment_status });
    return await this.findOne(shipment_id);
  }

  async remove(shipment_id: string): Promise<Shipment> {
    const shipment = await this.findOne(shipment_id);
    await this.shipmentRepository.delete(shipment_id);
    return shipment;
  }
}