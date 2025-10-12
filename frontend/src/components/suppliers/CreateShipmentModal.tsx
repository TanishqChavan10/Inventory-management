import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';
import { useShipmentCreation } from '@/hooks/useShipments';
import { GET_SUPPLIER_PRODUCTS } from '@/app/graphql/suppliers';
import { formatIndianRupee } from '@/lib/formatters';
import type {
  CreateShipmentModalProps,
  CreateShipmentInput,
  ShipmentItemInput,
  Product,
} from '@/types';

export function CreateShipmentModal({
  isOpen,
  onClose,
  supplier,
  onShipmentCreated,
}: CreateShipmentModalProps) {
  const [form, setForm] = useState<CreateShipmentInput>({
    supplier_id: supplier.supplier_id,
    ref_no: '',
    payment_status: 'Pending',
    payment_mthd: '',
    invoice_amt: 0,
    total_items: 0,
    items: [],
    received_date: new Date(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use the shipment creation hook
  const { createShipment, loading } = useShipmentCreation();

  // Fetch products available for this supplier
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery(GET_SUPPLIER_PRODUCTS, {
    variables: { supplier_id: supplier.supplier_id },
    errorPolicy: 'all',
  });

  const availableProducts: Product[] = productsData?.supplierProducts || [];

  const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'Mobile Payment'];

  useEffect(() => {
    if (isOpen) {
      // Generate a unique reference number
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      const refNo = `SHIP-${timestamp}-${randomSuffix}`;

      // Reset form when modal opens
      setForm({
        supplier_id: supplier.supplier_id,
        ref_no: refNo,
        received_date: new Date(),
        payment_status: 'Pending',
        payment_mthd: '',
        invoice_amt: 0,
        total_items: 0,
        items: [],
      });
      setErrors({});
    }
  }, [isOpen, supplier.supplier_id]);

  const addItem = () => {
    const newItem: ShipmentItemInput = {
      product_id: '',
      product_name: '',
      quantity_received: 1,
      unit_price: 0,
      batch_number: `BATCH-${Date.now()}`,
    };

    setForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
      total_items: prev.items.length + 1,
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
      total_items: prev.items.length - 1,
    }));
    calculateTotal();
  };

  const updateItem = (index: number, field: keyof ShipmentItemInput, value: string | number) => {
    setForm((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      // Auto-fill product details when product is selected
      if (field === 'product_id') {
        const product = availableProducts.find((p) => p.product_id.toString() === value);
        if (product) {
          newItems[index].product_name = product.product_name;
          newItems[index].unit_price = product.default_price;
        }
      }

      return { ...prev, items: newItems };
    });

    // Recalculate total when item changes
    setTimeout(() => calculateTotal(), 0);
  };

  const calculateTotal = () => {
    const total = form.items.reduce((sum, item) => {
      return sum + item.quantity_received * item.unit_price;
    }, 0);

    setForm((prev) => ({ ...prev, invoice_amt: total }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.ref_no.trim()) newErrors.ref_no = 'Reference number is required';
    if (!form.payment_mthd.trim()) newErrors.payment_mthd = 'Payment method is required';
    if (form.items.length === 0) newErrors.items = 'At least one item is required';

    form.items.forEach((item, index) => {
      if (!item.product_id) newErrors[`item_${index}_product`] = 'Product is required';
      if (item.quantity_received <= 0)
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      if (item.unit_price <= 0) newErrors[`item_${index}_price`] = 'Price must be greater than 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      console.log('🔄 Creating shipment with data:', form);

      // Prepare the data for GraphQL mutation
      const shipmentInput = {
        supplier_id: form.supplier_id,
        ref_no: form.ref_no.trim(),
        received_date: form.received_date,
        payment_status: form.payment_status,
        payment_mthd: form.payment_mthd.trim(),
        invoice_amt: form.invoice_amt,
        total_items: form.total_items,
        items: form.items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity_received: item.quantity_received,
          unit_price: item.unit_price,
          batch_number:
            item.batch_number?.trim() || `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        })),
      };

      console.log('📤 Sending to GraphQL:', shipmentInput);

      await createShipment(shipmentInput);

      // Success! Close modal and notify parent
      onShipmentCreated?.();
      onClose();
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      // Error is already handled by the hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-gray-200 dark:border-neutral-700">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-neutral-900 px-8 py-6 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Shipment
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Creating shipment order for{' '}
                <span className="font-medium text-gray-900 dark:text-white">{supplier.name}</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Shipment Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-neutral-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Shipment Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="ref_no"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reference Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ref_no"
                    value={form.ref_no}
                    onChange={(e) => setForm((prev) => ({ ...prev, ref_no: e.target.value }))}
                    placeholder="e.g., SHIP-2024-001"
                    className={`h-11 ${errors.ref_no ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-neutral-600'}`}
                    disabled={loading}
                  />
                  {errors.ref_no && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.ref_no}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="payment_method"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Payment Method <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.payment_mthd}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, payment_mthd: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger
                      className={`h-11 ${errors.payment_mthd ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'}`}
                    >
                      <SelectValue placeholder="Choose payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method} className="py-3">
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.payment_mthd && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.payment_mthd}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="payment_status"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Payment Status
                  </Label>
                  <Select
                    value={form.payment_status}
                    onValueChange={(value: 'Pending' | 'Paid' | 'Failed') =>
                      setForm((prev) => ({ ...prev, payment_status: value }))
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="h-11 border-gray-300 dark:border-neutral-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending" className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="Paid" className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Paid
                        </div>
                      </SelectItem>
                      <SelectItem value="Failed" className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Failed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Shipment Items
                  </h3>
                  <Badge variant="secondary" className="ml-2">
                    {form.items.length} {form.items.length === 1 ? 'item' : 'items'}
                  </Badge>
                </div>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-10 px-4 border-2 border-dashed border-gray-300 dark:border-neutral-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>

              {errors.items && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.items}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {form.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-6 relative"
                  >
                    <div className="absolute top-4 right-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pr-12">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Product <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={item.product_id}
                          onValueChange={(value) => updateItem(index, 'product_id', value)}
                          disabled={loading}
                        >
                          <SelectTrigger
                            className={`h-11 ${errors[`item_${index}_product`] ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'}`}
                          >
                            <SelectValue placeholder="Choose product" />
                          </SelectTrigger>
                          <SelectContent>
                            {productsLoading ? (
                              <SelectItem value="" disabled>
                                Loading products...
                              </SelectItem>
                            ) : productsError ? (
                              <SelectItem value="" disabled>
                                Error loading products
                              </SelectItem>
                            ) : availableProducts.length === 0 ? (
                              <SelectItem value="" disabled>
                                No products available for this supplier
                              </SelectItem>
                            ) : (
                              availableProducts.map((product) => (
                                <SelectItem
                                  key={product.product_id}
                                  value={product.product_id.toString()}
                                  className="py-3"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{product.product_name}</span>
                                    <span className="text-xs text-gray-500">
                                      Stock: {product.stock} | Default:{' '}
                                      {formatIndianRupee(product.default_price)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {errors[`item_${index}_product`] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors[`item_${index}_product`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity Needed <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={item.quantity_received}
                          onChange={(e) =>
                            updateItem(index, 'quantity_received', parseInt(e.target.value) || 0)
                          }
                          min="1"
                          placeholder="Enter quantity received"
                          className={`h-11 ${errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'}`}
                          disabled={loading}
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors[`item_${index}_quantity`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Unit Price (₹) <span className="text-red-500">*</span>
                        </Label>
                        {item.product_id && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {(() => {
                              const selectedProduct = availableProducts.find(
                                (p) => p.product_id.toString() === item.product_id,
                              );
                              return selectedProduct
                                ? `Default price: ${formatIndianRupee(selectedProduct.default_price)} `
                                : '';
                            })()}
                          </div>
                        )}
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) =>
                            updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)
                          }
                          min="0"
                          placeholder="0.00"
                          className={`h-11 ${errors[`item_${index}_price`] ? 'border-red-500' : 'border-gray-300 dark:border-neutral-600'}`}
                          disabled={loading}
                        />
                        {errors[`item_${index}_price`] && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            {errors[`item_${index}_price`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Batch Number
                        </Label>
                        <Input
                          value={item.batch_number || ''}
                          onChange={(e) => updateItem(index, 'batch_number', e.target.value)}
                          placeholder="e.g., BATCH-001"
                          className="h-11 border-gray-300 dark:border-neutral-600"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Item #{index + 1}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatIndianRupee(item.quantity_received * item.unit_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {form.items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-xl bg-gray-50 dark:bg-neutral-900">
                  <div className="mx-auto w-12 h-12 bg-gray-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No items added yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                    Click &quot;Add Item&quot; to start building your shipment
                  </p>
                </div>
              )}
            </div>

            

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 dark:border-neutral-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="px-8 py-3 h-12 border-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || form.items.length === 0}
                className="px-8 py-3 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Shipment Order'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
