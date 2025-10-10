import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Shipment } from './shipment.entity';
import { ShipmentItem } from './shipment-item.entity';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';
import { Product } from '../inventory/product/product.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentItem)
    private shipmentItemRepository: Repository<ShipmentItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createSupplierInput: CreateSupplierInput): Promise<Supplier> {
    try {
      // Convert empty string to undefined for registration_number to avoid unique constraint issues
      const supplierData = {
        ...createSupplierInput,
        registration_number: createSupplierInput.registration_number?.trim() || undefined,
      };
      
      const supplier = this.supplierRepository.create(supplierData);
      return await this.supplierRepository.save(supplier);
    } catch (error) {
      // Handle unique constraint violation for registration_number
      if (error.code === '23505' && error.constraint === 'UQ_7ddf950e27c9dddcbec1cc2e73b') {
        throw new ConflictException('A supplier with this registration number already exists. Please use a different registration number.');
      }
      // Re-throw other errors
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, status?: string): Promise<Supplier[]> {
    const queryBuilder = this.supplierRepository.createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.category', 'category');

    if (status) {
      queryBuilder.where('supplier.status = :status', { status });
    }

    return await queryBuilder
      .orderBy('supplier.created_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findOne(supplier_id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { supplier_id },
      relations: ['shipments', 'category'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplier_id} not found`);
    }

    return supplier;
  }

  async findProductsBySupplierCategory(supplier_id: string): Promise<Product[]> {
    const supplier = await this.findOne(supplier_id);
    
    return await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .where('category.category_id = :categoryId', { categoryId: supplier.category_id })
      .getMany();
  }

  async update(updateSupplierInput: UpdateSupplierInput): Promise<Supplier> {
    try {
      const { supplier_id, ...updateData } = updateSupplierInput;
      
      // Convert empty string to undefined for registration_number to avoid unique constraint issues
      if ('registration_number' in updateData) {
        updateData.registration_number = updateData.registration_number?.trim() || undefined;
      }
      
      // Remove category_id from update if it's null or undefined to avoid NOT NULL constraint violation
      if (!updateData.category_id || updateData.category_id <= 0) {
        delete updateData.category_id;
      }
      
      await this.supplierRepository.update(supplier_id, updateData);
      
      const updatedSupplier = await this.findOne(supplier_id);
      return updatedSupplier;
    } catch (error) {
      // Handle unique constraint violation for registration_number
      if (error.code === '23505' && error.constraint === 'UQ_7ddf950e27c9dddcbec1cc2e73b') {
        throw new ConflictException('A supplier with this registration number already exists. Please use a different registration number.');
      }
      // Re-throw other errors
      throw error;
    }
  }

  async remove(supplier_id: string): Promise<Supplier> {
    const supplier = await this.findOne(supplier_id);
    
    // Use transaction to ensure data consistency
    await this.dataSource.transaction(async manager => {
      // First, get all shipments for this supplier
      const shipments = await manager.find(Shipment, {
        where: { supplier_id },
        select: ['shipment_id']
      });
      
      if (shipments.length > 0) {
        const shipmentIds = shipments.map(shipment => shipment.shipment_id);
        
        // Delete all shipment items for these shipments
        await manager
          .createQueryBuilder()
          .delete()
          .from(ShipmentItem)
          .where('shipment_id IN (:...shipmentIds)', { shipmentIds })
          .execute();
        
        // Delete all shipments for this supplier
        await manager.delete(Shipment, { supplier_id });
      }
      
      // Finally, delete the supplier
      await manager.delete(Supplier, supplier_id);
    });
    
    return supplier;
  }

  async getSupplierStats(supplier_id: string): Promise<any> {
    const supplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.shipments', 'shipment')
      .leftJoinAndSelect('supplier.category', 'category')
      .where('supplier.supplier_id = :supplier_id', { supplier_id })
      .getOne();

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplier_id} not found`);
    }

    const totalShipments = supplier.shipments.length;
    const totalValue = supplier.shipments.reduce((sum, shipment) => sum + Number(shipment.invoice_amt), 0);
    const avgOrderValue = totalShipments > 0 ? totalValue / totalShipments : 0;

    return {
      totalShipments,
      totalValue,
      avgOrderValue,
      supplier,
    };
  }
}