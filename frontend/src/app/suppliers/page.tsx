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
import { PlusCircle, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

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
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editForm, setEditForm] = useState({
    company: '',
    email: '',
    phone: '',
    category: '',
  });
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

  function openEditDialog(supplier: Supplier) {
    setEditingSupplier(supplier);
    setEditForm({
      company: supplier.company,
      email: supplier.email,
      phone: supplier.phone,
      category: supplier.category,
    });
  }

  function saveEdit() {
    if (!editingSupplier) return;
    const updatedSuppliers = suppliers.map((s) =>
      s.id === editingSupplier.id ? { ...s, ...editForm } : s,
    );
    setSuppliers(updatedSuppliers);
    setEditingSupplier(null);
    toast.success('Supplier updated successfully!');
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
                          {/* Dropdown three dots menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open supplier actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(s)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/suppliers/${s.id}`} className="w-full block">
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(s)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Edit Modal */}
      {editingSupplier && (
        <Modal
          title={`Edit Supplier ${editingSupplier.id}`}
          onClose={() => setEditingSupplier(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
            }}
            className="space-y-4"
          >
            {['company', 'email', 'phone', 'category'].map((field) => (
              <div key={field}>
                <label className="block font-medium mb-1 capitalize">{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={editForm[field as keyof typeof editForm]}
                  onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingSupplier(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Modal component reused from previous example (adjust styling if necessary)
function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 text-black dark:text-white p-6 rounded-2xl shadow-2xl max-w-lg w-full relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 text-2xl hover:text-black dark:hover:text-white transition"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
