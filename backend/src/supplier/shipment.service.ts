import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentItem } from './shipment-item.entity';
import { Product } from '../inventory/product/product.entity';
import { CreateShipmentInput } from './dto/create-shipment.input';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentItem)
    private shipmentItemRepository: Repository<ShipmentItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
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

  async create(createShipmentInput: CreateShipmentInput, userId: string): Promise<Shipment> {
    const { items, ...shipmentData } = createShipmentInput;
    
    console.log('🔄 Creating shipment with data:', { 
      ...shipmentData, 
      itemsCount: items.length 
    });
    
    // Set received_date to current date if not provided
    if (!shipmentData.received_date) {
      shipmentData.received_date = new Date();
    }

    let shipmentId: string | undefined;

    // Use transaction to ensure data consistency
    await this.dataSource.transaction(async manager => {
      try {
        // Create and save shipment with userId
        const shipment = manager.create(Shipment, {
          ...shipmentData,
          userId, // Set the owner
        });
        const savedShipment = await manager.save(shipment);
        shipmentId = savedShipment.shipment_id;
        
        console.log('✅ Shipment saved with ID:', savedShipment.shipment_id);

        // Create shipment items with auto-generated dates
        const shipmentItems = items.map(item => {
          const { mfg_date, expiry_date } = this.generateRandomDates(shipmentData.received_date as Date);
          
          return manager.create(ShipmentItem, {
            ...item,
            shipment_id: savedShipment.shipment_id,
            mfg_date,
            expiry_date,
          });
        });

        await manager.save(ShipmentItem, shipmentItems);
        console.log('✅ Shipment items saved:', shipmentItems.length);

        // Update inventory stock for each shipment item (only user's products)
        for (const item of shipmentItems) {
          // Find the product by product_id and userId
          const product = await manager.findOne(Product, {
            where: { product_id: parseInt(item.product_id), userId }
          });

          if (product) {
            // Add the received quantity to the existing stock
            product.stock += item.quantity_received;
            await manager.save(Product, product);
            
            console.log(`✅ Updated inventory for ${product.product_name}: +${item.quantity_received} (New stock: ${product.stock})`);
          } else {
            console.warn(`⚠️ Product with ID ${item.product_id} not found in inventory. Stock not updated.`);
          }
        }

        console.log('✅ Transaction completed successfully');
      } catch (error) {
        console.error('❌ Error in shipment creation transaction:', error);
        throw error;
      }
    });

    // Load and return the complete shipment after transaction
    if (!shipmentId) {
      throw new Error('Shipment creation failed - no shipment ID generated');
    }
    
    console.log('🔍 Loading shipment with relations for ID:', shipmentId);
    return await this.findOne(shipmentId, userId);
  }

  async findAll(page: number = 1, limit: number = 10, supplier_id: string | undefined, userId: string): Promise<Shipment[]> {
    const queryBuilder = this.shipmentRepository.createQueryBuilder('shipment')
      .where('shipment.userId = :userId', { userId }); // Filter by user

    if (supplier_id) {
      queryBuilder.andWhere('shipment.supplier_id = :supplier_id', { supplier_id });
    }

    return await queryBuilder
      .leftJoinAndSelect('shipment.supplier', 'supplier')
      .orderBy('shipment.received_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOne(shipment_id: string, userId: string): Promise<Shipment> {
    const shipment = await this.shipmentRepository.findOne({
      where: { shipment_id, userId }, // Filter by user
      relations: ['supplier', 'shipmentItems'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${shipment_id} not found`);
    }

    return shipment;
  }

  async findBySupplier(supplier_id: string, userId: string): Promise<Shipment[]> {
    return await this.shipmentRepository.find({
      where: { supplier_id, userId }, // Filter by user
      relations: ['shipmentItems'],
      order: { received_date: 'DESC' },
    });
  }

  async updatePaymentStatus(shipment_id: string, payment_status: 'Pending' | 'Paid' | 'Failed', userId: string): Promise<Shipment> {
    // Verify ownership first
    await this.findOne(shipment_id, userId);
    await this.shipmentRepository.update(shipment_id, { payment_status });
    return await this.findOne(shipment_id, userId);
  }

  async remove(shipment_id: string, userId: string): Promise<Shipment> {
    // Use transaction to ensure data consistency
    return await this.dataSource.transaction(async manager => {
      // Get the shipment with its items before deletion (verify ownership)
      const shipment = await manager.findOne(Shipment, {
        where: { shipment_id, userId }, // Filter by user
        relations: ['shipmentItems'],
      });

      if (!shipment) {
        throw new NotFoundException(`Shipment with ID ${shipment_id} not found`);
      }

      // Decrease inventory stock for each shipment item (only user's products)
      for (const item of shipment.shipmentItems) {
        const product = await manager.findOne(Product, {
          where: { product_id: parseInt(item.product_id), userId }
        });

        if (product) {
          // Subtract the received quantity from the existing stock
          product.stock = Math.max(0, product.stock - item.quantity_received);
          await manager.save(Product, product);
          
          console.log(`✅ Reverted inventory for ${product.product_name}: -${item.quantity_received} (New stock: ${product.stock})`);
        } else {
          console.warn(`⚠️ Product with ID ${item.product_id} not found in inventory. Stock not reverted.`);
        }
      }

      // Delete the shipment (shipment items will be deleted by cascade)
      await manager.delete(Shipment, shipment_id);
      
      return shipment;
    });
  }
}