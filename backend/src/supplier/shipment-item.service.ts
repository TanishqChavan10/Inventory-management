import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentItem } from './shipment-item.entity';
import { CreateShipmentItemInput } from './dto/create-shipment-item.input';

@Injectable()
export class ShipmentItemService {
  constructor(
    @InjectRepository(ShipmentItem)
    private shipmentItemRepository: Repository<ShipmentItem>,
  ) {}

  async create(createShipmentItemInput: CreateShipmentItemInput): Promise<ShipmentItem> {
    const shipmentItem = this.shipmentItemRepository.create(createShipmentItemInput);
    return await this.shipmentItemRepository.save(shipmentItem);
  }

  async createMultiple(createShipmentItemsInput: CreateShipmentItemInput[]): Promise<ShipmentItem[]> {
    const shipmentItems = this.shipmentItemRepository.create(createShipmentItemsInput);
    return await this.shipmentItemRepository.save(shipmentItems);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ShipmentItem[]> {
    return await this.shipmentItemRepository.find({
      relations: ['shipment'],
      skip: (page - 1) * limit,
      take: limit,
      order: { shipment: { received_date: 'DESC' } },
    });
  }

  async findOne(id: string): Promise<ShipmentItem> {
    const shipmentItem = await this.shipmentItemRepository.findOne({
      where: { id },
      relations: ['shipment'],
    });

    if (!shipmentItem) {
      throw new NotFoundException(`Shipment item with ID ${id} not found`);
    }

    return shipmentItem;
  }

  async findByShipment(shipment_id: string): Promise<ShipmentItem[]> {
    return await this.shipmentItemRepository.find({
      where: { shipment_id },
      relations: ['shipment'],
    });
  }

  async findBySupplier(supplier_id: string): Promise<ShipmentItem[]> {
    return await this.shipmentItemRepository
      .createQueryBuilder('shipmentItem')
      .leftJoinAndSelect('shipmentItem.shipment', 'shipment')
      .where('shipment.supplier_id = :supplier_id', { supplier_id })
      .orderBy('shipment.received_date', 'DESC')
      .getMany();
  }

  async remove(id: string): Promise<ShipmentItem> {
    const shipmentItem = await this.findOne(id);
    await this.shipmentItemRepository.delete(id);
    return shipmentItem;
  }

  async getExpiringItems(days: number = 30): Promise<ShipmentItem[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return await this.shipmentItemRepository
      .createQueryBuilder('shipmentItem')
      .where('shipmentItem.expiry_date IS NOT NULL')
      .andWhere('shipmentItem.expiry_date <= :expiryDate', { expiryDate })
      .andWhere('shipmentItem.expiry_date > :currentDate', { currentDate: new Date() })
      .orderBy('shipmentItem.expiry_date', 'ASC')
      .getMany();
  }
}