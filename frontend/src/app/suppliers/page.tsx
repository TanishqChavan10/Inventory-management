'use client';

import { useState } from 'react';
import { toast } from 'sonner';

// --- Component Imports ---
import { SuppliersHeader, SuppliersSearchBar, SuppliersTable, SupplierModal } from '@/components/suppliers';

// --- Types ---
import type { Supplier } from '@/types';

// Sample data matching the layout from the image
const initialSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    contact: 'contact@techcorp.com',
    email: 'contact@techcorp.com',
    phone: '+1-555-0101',
    products: ['Laptops', 'Mice'],
    orders: 45,
    totalValue: '$125,000.5',
    lastOrder: '2024-01-10',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Fashion Forward Ltd',
    contact: 'orders@fashionforward.com',
    email: 'orders@fashionforward.com',
    phone: '+1-555-0102',
    products: ['Clothing', 'Accessories'],
    orders: 32,
    totalValue: '$78,500.25',
    lastOrder: '2024-01-12',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Fresh Foods Inc',
    contact: 'supply@freshfoods.com',
    email: 'supply@freshfoods.com',
    phone: '+1-555-0103',
    products: ['Coffee Beans', 'Snacks'],
    orders: 67,
    totalValue: '$45,200.75',
    lastOrder: '2024-01-14',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Office Pro Supply',
    contact: 'sales@officepro.com',
    email: 'sales@officepro.com',
    phone: '+1-555-0104',
    products: ['Paper', 'Pens'],
    orders: 23,
    totalValue: '$32,100',
    lastOrder: '2023-12-15',
    status: 'Inactive',
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    email: '',
    phone_no: '',
  });

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower) ||
      supplier.products.some((product) => product.toLowerCase().includes(searchLower)) ||
      supplier.contact.toLowerCase().includes(searchLower)
    );
  });

  const handleViewSupplier = (supplier: Supplier) => {
    // Navigate to supplier detail page
    window.location.href = `/suppliers/${supplier.id}`;
  };

  const handleAddSupplier = () => {
    setIsModalOpen(true);
  };

  const handleSaveSupplier = () => {
    if (!supplierForm.name || !supplierForm.email || !supplierForm.phone_no) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create new supplier
    const newSupplier: Supplier = {
      id: (suppliers.length + 1).toString(),
      name: supplierForm.name,
      contact: supplierForm.email,
      email: supplierForm.email,
      phone: supplierForm.phone_no,
      products: [],
      orders: 0,
      totalValue: '$0.00',
      lastOrder: 'Never',
      status: 'Active',
    };

    setSuppliers([...suppliers, newSupplier]);
    setSupplierForm({ name: '', email: '', phone_no: '' });
    setIsModalOpen(false);
    toast.success('Supplier added successfully!');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSupplierForm({ name: '', email: '', phone_no: '' });
  };

  return (
    <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <SuppliersHeader onAddSupplier={handleAddSupplier} />

      <SuppliersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <SuppliersTable
        suppliers={filteredSuppliers}
        onViewSupplier={handleViewSupplier}
      />

      <SupplierModal
        isOpen={isModalOpen}
        isEditing={false}
        form={supplierForm}
        onFormChange={setSupplierForm}
        onSave={handleSaveSupplier}
        onClose={handleCloseModal}
      />
    </div>
  );
}
