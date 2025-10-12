import { formatIndianRupee } from '@/lib/formatters';
import type { ShipmentItem } from '@/types';

export function useSupplierCalculations() {
  const calculateTotalAmount = (items: ShipmentItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity_received * item.unit_price,
      0
    );
    return total;
  };

  const calculateTotalUnits = (items: ShipmentItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity_received, 0);
  };

  const formatTotal = (items: ShipmentItem[]) => {
    return formatIndianRupee(calculateTotalAmount(items));
  };

  const calculateItemSubtotal = (quantity: number, unitPrice: number) => {
    return formatIndianRupee(quantity * unitPrice);
  };

  return {
    calculateTotalAmount,
    calculateTotalUnits,
    formatTotal,
    calculateItemSubtotal,
  };
}