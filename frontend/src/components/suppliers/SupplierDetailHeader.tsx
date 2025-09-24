import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SupplierModal } from './SupplierModal';
import type { SupplierDetailHeaderProps } from '@/types/suppliers';

type SupplierForm = {
  name: string;
  email: string;
  phone_no: string;
};

export function SupplierDetailHeader({ supplier }: SupplierDetailHeaderProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState<SupplierForm>({
    name: supplier.name,
    email: supplier.email,
    phone_no: supplier.phone_no,
  });

  const handleEditSupplier = () => {
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSupplier = () => {
    // TODO: Replace this with actual API call to delete supplier
    // Example: await deleteSupplier(supplier.supplier_id);
    
    // Show success message
    toast.success(`Supplier "${supplier.name}" has been deleted successfully!`);
    
    // Navigate back to suppliers list
    router.push('/suppliers');
  };

  const handleSaveSupplier = () => {
    // TODO: Implement actual save logic here
    console.log('Saving supplier:', supplierForm);
    toast.success(`Supplier ${supplierForm.name} updated successfully!`);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form to original values
    setSupplierForm({
      name: supplier.name,
      email: supplier.email,
      phone_no: supplier.phone_no
    });
  };
  return (
    <>
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/suppliers">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{supplier.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleEditSupplier}
            >
              <Edit className="w-4 h-4" />
              Edit Supplier
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950 dark:border-red-800"
              onClick={handleDeleteSupplier}
            >
              <Trash2 className="w-4 h-4" />
              Delete Supplier
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Supplier ID</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{supplier.supplier_id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{supplier.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{supplier.phone_no}</p>
            </div>
          </div>
        </div>
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        isEditing={true}
        form={supplierForm}
        onFormChange={setSupplierForm}
        onSave={handleSaveSupplier}
        onClose={handleCloseModal}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSupplier}
        title={`Delete "${supplier.name}"?`}
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
