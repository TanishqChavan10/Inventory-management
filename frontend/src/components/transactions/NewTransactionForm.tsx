'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X, ShoppingCart, User, CreditCard, Receipt, Calculator } from 'lucide-react';
import { formatIndianRupee } from '@/lib/formatters';
import type { Product, Customer, Employee } from '@/types';

interface TransactionItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  available_stock: number;
  discount_applied?: number;
}

interface NewTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionData: any) => void;
  products: Product[];
  employees: Employee[];
  customers?: Customer[];
}

const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash Payment', icon: '💵' },
  { value: 'Credit Card', label: 'Credit Card', icon: '💳' },
  { value: 'Debit Card', label: 'Debit Card', icon: '💳' },
  { value: 'Mobile Payment', label: 'Mobile Payment', icon: '📱' },
];

export function NewTransactionForm({
  isOpen,
  onClose,
  onSubmit,
  products = [],
  employees = [],
  customers = [],
}: NewTransactionFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedCashier, setSelectedCashier] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<TransactionItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentRefNo, setPaymentRefNo] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(10); // Default 10% tax
  const [notes, setNotes] = useState<string>('');
  const [searchProduct, setSearchProduct] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Customer form for new customer
  const [showNewCustomerForm, setShowNewCustomerForm] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone_no: '',
    email: '',
    address: '',
  });

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchProduct.toLowerCase()) ||
        product.product_id.toString().includes(searchProduct),
    );
  }, [products, searchProduct]);

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = selectedItems.reduce((sum, item) => sum + item.total_price, 0);
    const discountTotal =
      selectedItems.reduce((sum, item) => sum + (item.discount_applied || 0), 0) + discountAmount;
    const taxableAmount = subtotal - discountTotal;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const totalAmount = taxableAmount + taxAmount;

    return {
      subtotal,
      discountTotal,
      taxAmount,
      totalAmount,
      totalItems: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
      uniqueProducts: selectedItems.length,
    };
  }, [selectedItems, discountAmount, taxRate]);

  const addProductToTransaction = (product: Product) => {
    const existingItem = selectedItems.find(
      (item) => item.product_id === product.product_id.toString(),
    );

    if (existingItem) {
      updateItemQuantity(existingItem.product_id, existingItem.quantity + 1);
    } else {
      const newItem: TransactionItem = {
        product_id: product.product_id.toString(),
        product_name: product.product_name,
        quantity: 1,
        unit_price: product.default_price,
        total_price: product.default_price,
        available_stock: product.stock,
        discount_applied: 0,
      };
      setSelectedItems([...selectedItems, newItem]);
    }
    setSearchProduct('');
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setSelectedItems((items) =>
      items.map((item) => {
        if (item.product_id === productId) {
          const updatedItem = {
            ...item,
            quantity: Math.min(newQuantity, item.available_stock),
            total_price:
              Math.min(newQuantity, item.available_stock) * item.unit_price -
              (item.discount_applied || 0),
          };
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const updateItemDiscount = (productId: string, discount: number) => {
    setSelectedItems((items) =>
      items.map((item) => {
        if (item.product_id === productId) {
          const maxDiscount = item.quantity * item.unit_price;
          const validDiscount = Math.min(Math.max(0, discount), maxDiscount);
          return {
            ...item,
            discount_applied: validDiscount,
            total_price: item.quantity * item.unit_price - validDiscount,
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems((items) => items.filter((item) => item.product_id !== productId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCashier) {
      alert('Please select a cashier');
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please add at least one product to the transaction');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsSubmitting(true);

    try {
      const transactionData = {
        customer_id: selectedCustomer && selectedCustomer !== 'walk-in' ? selectedCustomer : null,
        cashier_id: selectedCashier,
        payment_method: paymentMethod,
        payment_refno: paymentRefNo || null,
        total_amt: calculations.totalAmount,
        subtotal: calculations.subtotal,
        tax_amount: calculations.taxAmount,
        discount_amount: calculations.discountTotal,
        notes: notes || null,
        items: selectedItems,
        new_customer: showNewCustomerForm ? newCustomer : null,
      };

      await onSubmit(transactionData);

      // Reset form
      setSelectedCustomer('');
      setSelectedCashier('');
      setSelectedItems([]);
      setPaymentMethod('');
      setPaymentRefNo('');
      setDiscountAmount(0);
      setNotes('');
      setShowNewCustomerForm(false);
      setNewCustomer({ name: '', phone_no: '', email: '', address: '' });

      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Transaction</h2>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer and Cashier Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer">Select Customer (Optional)</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.customer_id} value={customer.customer_id}>
                          {customer.name} - {customer.phone_no}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                  className="w-full"
                >
                  {showNewCustomerForm ? 'Cancel' : 'Add New Customer'}
                </Button>

                {showNewCustomerForm && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                    <div>
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="Enter customer name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
                        id="customerPhone"
                        value={newCustomer.phone_no}
                        onChange={(e) =>
                          setNewCustomer({ ...newCustomer, phone_no: e.target.value })
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cashier Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Cashier Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="cashier">Select Cashier *</Label>
                  <Select value={selectedCashier} onValueChange={setSelectedCashier} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a cashier..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.employee_id} value={employee.employee_id}>
                          {employee.name} - {employee.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Product Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Search */}
              <div>
                <Label htmlFor="productSearch">Search Products</Label>
                <Input
                  id="productSearch"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Search by product name or ID..."
                />
              </div>

              {/* Product Search Results */}
              {searchProduct && filteredProducts.length > 0 && (
                <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-neutral-700 rounded-lg">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="p-3 border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer flex items-center justify-between"
                      onClick={() => addProductToTransaction(product)}
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.product_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ID: {product.product_id} • Stock: {product.stock} • Price:{' '}
                          {formatIndianRupee(product.default_price)}
                        </p>
                      </div>
                      <Button size="sm" type="button">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Items */}
              {selectedItems.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Selected Items</h4>
                  {selectedItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="p-4 border border-gray-200 dark:border-neutral-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {item.product_id} • Available: {item.available_stock}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product_id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(item.product_id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(item.product_id, parseInt(e.target.value) || 0)
                              }
                              className="text-center"
                              min="1"
                              max={item.available_stock}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateItemQuantity(item.product_id, item.quantity + 1)}
                              disabled={item.quantity >= item.available_stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">Unit Price</Label>
                          <p className="text-sm font-medium py-2">
                            {formatIndianRupee(item.unit_price)}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor={`discount-${item.product_id}`} className="text-xs">
                            Item Discount
                          </Label>
                          <Input
                            id={`discount-${item.product_id}`}
                            type="number"
                            value={item.discount_applied || 0}
                            onChange={(e) =>
                              updateItemDiscount(item.product_id, parseFloat(e.target.value) || 0)
                            }
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            max={item.quantity * item.unit_price}
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Total</Label>
                          <p className="text-sm font-bold py-2 text-green-600 dark:text-green-400">
                            {formatIndianRupee(item.total_price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            <span>{method.icon}</span>
                            {method.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="paymentRefNo">Payment Reference No.</Label>
                  <Input
                    id="paymentRefNo"
                    value={paymentRefNo}
                    onChange={(e) => setPaymentRefNo(e.target.value)}
                    placeholder="Enter reference number (optional)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calculations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="additionalDiscount">Additional Discount</Label>
                  <Input
                    id="additionalDiscount"
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    placeholder="10"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="h-[1px] bg-gray-200 dark:bg-neutral-700 my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium">{formatIndianRupee(calculations.subtotal)}</span>
                </div>

                {calculations.discountTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Discount:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{formatIndianRupee(calculations.discountTotal)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax ({taxRate}%):</span>
                  <span className="font-medium">{formatIndianRupee(calculations.taxAmount)}</span>
                </div>

                <div className="h-[1px] bg-gray-200 dark:bg-neutral-700 my-3" />

                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {formatIndianRupee(calculations.totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    {calculations.totalItems} items • {calculations.uniqueProducts} products
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes for this transaction..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-neutral-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedItems.length === 0}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Complete Transaction
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
