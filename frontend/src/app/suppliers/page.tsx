'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useApolloClient } from '@apollo/client';

// --- Component Imports ---
import { SuppliersHeader, SuppliersSearchBar, SuppliersTable } from '@/components/suppliers';

// --- Custom Hook ---
import { useSuppliers, useSupplierForEdit } from '@/hooks/useSuppliers';

// --- Types ---
import type { Supplier, SupplierGraphQL } from '@/types';

export default function SuppliersPage() {
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

  // Use the custom hooks
  const { suppliers, loading, error, addSupplier, updateSupplier, deleteSupplier } = useSuppliers(
    page,
    10,
    status,
  );
  const { fetchSupplierById } = useSupplierForEdit();

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower) ||
      supplier.contact.toLowerCase().includes(searchLower)
    );
  });

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

  const handleSaveSupplier = async (supplierData: any) => {
    console.log('🔄 Starting supplier save process...');
    console.log('📝 Supplier data to save:', supplierData);
    console.log('✏️ Is editing:', isEditing);
    console.log('👤 Editing supplier:', editingSupplier);

    setModalLoading(true);
    try {
      if (isEditing && editingSupplier) {
        console.log('🔄 Calling updateSupplier...');
        const updatedSupplier = await updateSupplier({
          supplier_id: editingSupplier.supplier_id,
          ...supplierData,
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
        const newSupplier = await addSupplier(supplierData);

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

      <SuppliersSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <SuppliersTable
        suppliers={filteredSuppliers}
        onEditSupplier={handleEditSupplier}
        onDeleteSupplier={handleDeleteSupplier}
        fetchingSupplierForEdit={fetchingSupplierForEdit}
      />

      {/* Show empty state if no suppliers */}
      {filteredSuppliers.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? 'No suppliers found matching your search.'
              : 'No suppliers found. Add your first supplier!'}
          </div>
        </div>
      )}
    </div>
  );
}
