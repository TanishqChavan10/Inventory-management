'use client';

import { useState } from 'react';
import { toast } from 'sonner';

// --- Component Imports ---
import { SuppliersHeader, SuppliersSearchBar, SuppliersTable } from '@/components/suppliers';

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

  return (
    <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <SuppliersHeader />

      <SuppliersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <SuppliersTable
        suppliers={filteredSuppliers}
        onViewSupplier={handleViewSupplier}
      />
    </div>
  );
}
