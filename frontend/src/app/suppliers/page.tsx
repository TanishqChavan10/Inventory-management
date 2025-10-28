'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useApolloClient } from '@apollo/client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

// --- Component Imports ---
import {
  SuppliersHeader,
  SuppliersSearchBar,
  SuppliersTable,
  SupplierModal,
} from '@/components/suppliers';

// --- Custom Hook ---
import { useSuppliers, useSupplierForEdit } from '@/hooks/useSuppliers';

// --- Types ---
import type { Supplier, SupplierGraphQL, CreateSupplierInput } from '@/types';

export default function SuppliersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Apollo client for manual queries
  const apolloClient = useApolloClient();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierGraphQL | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [fetchingSupplierForEdit, setFetchingSupplierForEdit] = useState(false);

  // Form state with explicit types to match GraphQL expectations
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone_no: string;
    address: string;
    contact_person: string;
    registration_number: string;
    tax_id: string;
    status: 'Active' | 'Inactive';
    category_id: string;
  }>({
    name: '',
    email: '',
    phone_no: '',
    address: '',
    contact_person: '',
    registration_number: '',
    tax_id: '',
    status: 'Active', // Default to Active
    category_id: '', // Will be converted to number before sending to API
  });

  // Use the custom hooks
  const { suppliers, loading, error, addSupplier, updateSupplier, deleteSupplier, refetch } =
    useSuppliers(page, 10, status);
  const { fetchSupplierById } = useSupplierForEdit();

  // Filter suppliers based on search and category
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower) ||
      supplier.contact.toLowerCase().includes(searchLower);

    // If category filter is applied, only show suppliers from that category
    const matchesCategory = categoryFilter
      ? supplier.category_id?.toString() === categoryFilter
      : true;

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const itemsPerPage = 10;
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSuppliers.slice(startIndex, endIndex);
  }, [filteredSuppliers, page, itemsPerPage]);

  const handleAddSupplier = () => {
    setIsEditing(false);
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditSupplier = async (supplier: Supplier) => {
    setFetchingSupplierForEdit(true);
    try {
      // Fetch full supplier details from database
      const fullSupplierData = await fetchSupplierById(supplier.id, apolloClient);

      if (fullSupplierData) {
        setIsEditing(true);
        setEditingSupplier(fullSupplierData);
        setForm({
          name: fullSupplierData.name,
          email: fullSupplierData.email,
          phone_no: fullSupplierData.phone_no,
          address: fullSupplierData.address || '',
          contact_person: fullSupplierData.contact_person || '',
          registration_number: fullSupplierData.registration_number || '',
          tax_id: fullSupplierData.tax_id || '',
          status: fullSupplierData.status,
          category_id: fullSupplierData.category_id?.toString() || '',
        });
        setIsModalOpen(true);
      } else {
        toast.error('Could not fetch supplier details');
      }
    } catch (error) {
      console.error('Failed to fetch supplier for editing:', error);
      toast.error('Failed to load supplier details');
    } finally {
      setFetchingSupplierForEdit(false);
    }
  };

  const handleSaveSupplier = async (supplierData: typeof form) => {
    console.log('🔄 Starting supplier save process...');
    console.log('📝 Supplier data to save:', supplierData);
    console.log('✏️ Is editing:', isEditing);
    console.log('👤 Editing supplier:', editingSupplier);

    setModalLoading(true);
    try {
      // Convert string category_id to number and prepare input data
      const formattedData = {
        ...supplierData,
        // Properly handle category_id conversion, ensuring valid number or undefined
        category_id:
          supplierData.category_id && supplierData.category_id.trim() !== ''
            ? parseInt(supplierData.category_id, 10)
            : undefined,
      };

      if (isEditing && editingSupplier) {
        console.log('🔄 Calling updateSupplier...');
        const updatedSupplier = await updateSupplier({
          supplier_id: editingSupplier.supplier_id,
          ...formattedData,
        });

        console.log('✅ Update response:', updatedSupplier);

        if (updatedSupplier) {
          toast.success('Supplier updated successfully!');
          setIsModalOpen(false);
          setEditingSupplier(null);
          setIsEditing(false);
        }
      } else {
        console.log('🔄 Calling addSupplier...');
        const createInput = {
          ...formattedData,
          status: formattedData.status || 'Active', // Ensure status is never undefined
        };

        const newSupplier = await addSupplier(createInput);

        console.log('✅ Add response:', newSupplier);

        if (newSupplier) {
          toast.success('Supplier added successfully!');
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
      // Error toast is already handled in the hook
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setIsEditing(false);
  };

  const handleDeleteSupplier = async (supplier: Supplier) => {
    try {
      await deleteSupplier(supplier.id);
      // Refetch the suppliers list to show updated data
      await refetch();
    } catch (error) {
      // Error handling is done in the hook
      console.error('Delete failed:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading suppliers...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error loading suppliers: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-32 py-8 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <SuppliersHeader onAddSupplier={handleAddSupplier} />

      {/* Category Filter Indicator */}
      {categoryFilter && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Filtered by Category ID: {categoryFilter}
            </span>
          </div>
          <button
            onClick={() => router.push('/suppliers')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      <SuppliersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <SuppliersTable
        suppliers={currentItems}
        onEditSupplier={handleEditSupplier}
        onDeleteSupplier={handleDeleteSupplier}
        fetchingSupplierForEdit={fetchingSupplierForEdit}
      />

      {/* Show empty state if no suppliers */}
      {filteredSuppliers.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-600 dark:text-gray-400">
            {categoryFilter
              ? 'No suppliers found for this category.'
              : searchQuery
                ? 'No suppliers found matching your search.'
                : 'No suppliers found. Add your first supplier!'}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                [...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))
              ) : (
                // Show limited pages with ellipsis for larger page counts
                <>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={page === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {page > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {page > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page - 1);
                        }}
                      >
                        {page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page !== 1 && page !== totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(page + 1);
                        }}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={page === totalPages}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) {
                      setPage(page + 1);
                    }
                  }}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="mt-2 text-center text-sm text-gray-500">
            Showing page {page} of {totalPages} ({totalItems} suppliers)
          </div>
        </div>
      )}

      <SupplierModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        form={form}
        onFormChange={(newForm) => setForm(newForm)}
        onSave={() => handleSaveSupplier(form)}
        onClose={handleCloseModal}
        loading={modalLoading}
      />
    </div>
  );
}
