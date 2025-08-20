'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PlusCircle, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

const initialSuppliers = [
  // Example suppliers
  {
    id: 'S001',
    company: 'FreshFarms Pvt Ltd',
    contact: 'Aarav Singh',
    phone: '+91 99876 12345',
    email: 'aarav@freshfarms.com',
    category: 'Groceries',
  },
  {
    id: 'S002',
    company: 'DairyCo',
    contact: 'Meera Raj',
    phone: '+91 88990 56744',
    email: 'meera@dairyco.in',
    category: 'Dairy',
  },
  {
    id: 'S003',
    company: 'CleanPro Suppliers',
    contact: 'Sonal Jain',
    phone: '+91 90221 44567',
    email: 'sonal@cleanpro.com',
    category: 'Cleaning Supplies',
  },
  // Add more suppliers as needed
];

type Supplier = (typeof initialSuppliers)[number];
type RecentlyDeleted = { item: Supplier; index: number } | null;

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [recentlyDeleted, setRecentlyDeleted] = useState<RecentlyDeleted>(null);
  const itemsPerPage = 5;

  const categories = ['All', ...Array.from(new Set(suppliers.map((s) => s.category)))];

  const filtered =
    categoryFilter === 'All' ? suppliers : suppliers.filter((s) => s.category === categoryFilter);

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  function handleDelete(supplierToDelete: Supplier) {
    const index = suppliers.findIndex((s) => s.id === supplierToDelete.id);
    setRecentlyDeleted({ item: supplierToDelete, index });
    setSuppliers((prev) => prev.filter((s) => s.id !== supplierToDelete.id));
    toast.error('Supplier has been deleted.', {
      action: { label: 'Undo', onClick: () => handleUndo() },
    });
  }

  function handleUndo() {
    if (!recentlyDeleted) return;
    const { item, index } = recentlyDeleted;
    const updated = [...suppliers];
    updated.splice(index, 0, item);
    setSuppliers(updated);
    setRecentlyDeleted(null);
    toast.success('Supplier restored!');
  }

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-neutral-900 text-black dark:text-white min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Suppliers</h1>

        {/* Controls */}
        <div className="flex items-center gap-3 justify-end mb-6">
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-56 bg-white dark:bg-neutral-900 border dark:border-neutral-700 text-black dark:text-white shadow-sm rounded-lg">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-4xl mx-auto">
        <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-x-auto bg-white dark:bg-neutral-900 shadow-lg">
          <div className="max-h-[500px] overflow-y-auto rounded-xl relative">
            <table className="min-w-[720px] w-full border-separate border-spacing-0 rounded-lg">
              <thead className="z-10 sticky top-0">
                <tr className="bg-gray-100 dark:bg-neutral-800">
                  <th className="border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Supplier ID
                  </th>
                  <th className="border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Company
                  </th>
                  <th className="border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Category
                  </th>
                  <th className="border-b px-6 py-4 text-right font-semibold text-sm uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-6 dark:text-gray-500">
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  paginatedSuppliers.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <td className="px-6 py-3 font-medium">{s.id}</td>
                      <td className="px-6 py-3">{s.company}</td>
                      <td className="px-6 py-3">{s.category}</td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-2">
                          {/* View (Eye) */}
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="text-blue-600 hover:text-blue-800"
                            aria-label={`View ${s.company}`}
                          >
                            <Link href={`/suppliers/${s.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(s)}
                            aria-label={`Delete ${s.company}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
