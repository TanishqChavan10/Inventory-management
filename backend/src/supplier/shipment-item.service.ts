import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ShipmentItem } from './shipment-item.entity';
import { Product } from '../inventory/product/product.entity';
import { CreateShipmentItemInput } from './dto/create-shipment-item.input';

@Injectable()
export class ShipmentItemService {
  constructor(
    @InjectRepository(ShipmentItem)
    private shipmentItemRepository: Repository<ShipmentItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(
    createShipmentItemInput: CreateShipmentItemInput,
  ): Promise<ShipmentItem> {
    return await this.dataSource.transaction(async (manager) => {
      const shipmentItem = manager.create(
        ShipmentItem,
        createShipmentItemInput,
      );
      const savedShipmentItem = await manager.save(shipmentItem);

      // Update inventory stock
      const product = await manager.findOne(Product, {
        where: { product_id: parseInt(savedShipmentItem.product_id) },
      });

      if (product) {
        product.stock += savedShipmentItem.quantity_received;
        await manager.save(Product, product);
        console.log(
          `✅ Updated inventory for ${product.product_name}: +${savedShipmentItem.quantity_received} (New stock: ${product.stock})`,
        );
      } else {
        console.warn(
          `⚠️ Product with ID ${savedShipmentItem.product_id} not found in inventory. Stock not updated.`,
        );
      }

      return savedShipmentItem;
    });
  }

  async createMultiple(
    createShipmentItemsInput: CreateShipmentItemInput[],
  ): Promise<ShipmentItem[]> {
    return await this.dataSource.transaction(async (manager) => {
      const shipmentItems = manager.create(
        ShipmentItem,
        createShipmentItemsInput,
      );
      const savedShipmentItems = await manager.save(shipmentItems);

      // Update inventory stock for each item
      for (const item of savedShipmentItems) {
        const product = await manager.findOne(Product, {
          where: { product_id: parseInt(item.product_id) },
        });

        if (product) {
          product.stock += item.quantity_received;
          await manager.save(Product, product);
          console.log(
            `✅ Updated inventory for ${product.product_name}: +${item.quantity_received} (New stock: ${product.stock})`,
          );
        } else {
          console.warn(
            `⚠️ Product with ID ${item.product_id} not found in inventory. Stock not updated.`,
          );
        }
      }

      return savedShipmentItems;
    });
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
    return await this.dataSource.transaction(async (manager) => {
      const shipmentItem = await manager.findOne(ShipmentItem, {
        where: { id },
        relations: ['shipment'],
      });

      if (!shipmentItem) {
        throw new NotFoundException(`Shipment item with ID ${id} not found`);
      }

      // Update inventory stock - decrease
      const product = await manager.findOne(Product, {
        where: { product_id: parseInt(shipmentItem.product_id) },
      });

      if (product) {
        product.stock = Math.max(
          0,
          product.stock - shipmentItem.quantity_received,
        );
        await manager.save(Product, product);
        console.log(
          `✅ Reverted inventory for ${product.product_name}: -${shipmentItem.quantity_received} (New stock: ${product.stock})`,
        );
      } else {
        console.warn(
          `⚠️ Product with ID ${shipmentItem.product_id} not found in inventory. Stock not reverted.`,
        );
      }

      await manager.delete(ShipmentItem, id);
      return shipmentItem;
    });
  }

  async getExpiringItems(days: number = 30): Promise<ShipmentItem[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return await this.shipmentItemRepository
      .createQueryBuilder('shipmentItem')
      .where('shipmentItem.expiry_date IS NOT NULL')
      .andWhere('shipmentItem.expiry_date <= :expiryDate', { expiryDate })
      .andWhere('shipmentItem.expiry_date > :currentDate', {
        currentDate: new Date(),
      })
      .orderBy('shipmentItem.expiry_date', 'ASC')
      .getMany();
  }
}
