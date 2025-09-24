// Suppliers page specific types and interfaces

// Import dependent types
import type { 
  Supplier, 
  SupplierDetail, 
  Shipment, 
  ShipmentItem, 
  SupplierMetrics 
} from './index';

export interface SuppliersHeaderProps {
  onAddSupplier: () => void;
}

export interface SuppliersSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface SupplierRowProps {
  supplier: Supplier;
  onView: (supplier: Supplier) => void;
}

export interface SuppliersTableProps {
  suppliers: Supplier[];
  onViewSupplier: (supplier: Supplier) => void;
}

// Supplier detail page props
export interface SupplierDetailHeaderProps {
  supplier: SupplierDetail;
}

export interface SupplierStatsProps {
  totalShipments: number;
  totalValue: number;
  totalProducts: number;
  avgOrderValue: number;
  lastOrderDate: string;
}

export interface SupplierShipmentsProps {
  shipments: Shipment[];
  supplierId: string;
  onViewShipment?: (shipment: Shipment) => void;
}

export interface SupplierProductsProps {
  shipmentItems: ShipmentItem[];
}

// Shipment detail page props
export interface ShipmentDetailHeaderProps {
  shipment: Shipment;
  supplierName: string;
  supplierId: string;
}

export interface ShipmentItemsTableProps {
  shipmentItems: ShipmentItem[];
  shipmentId: string;
}

// Re-export for convenience
export type { 
  Supplier, 
  SupplierDetail, 
  Shipment, 
  ShipmentItem, 
  SupplierMetrics 
};