import { Button } from '@/components/ui/button';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/app/graphql/categories';
import type { CreateSupplierInput } from '@/types';

interface SupplierForm {
  name: string;
  email: string;
  phone_no: string;
  address: string;
  contact_person: string;
  registration_number: string;
  tax_id: string;
  status: 'Active' | 'Inactive';
  category_id: string;
}

interface SupplierModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: SupplierForm;
  onFormChange: (form: SupplierForm) => void;
  onSave: () => void;
  onClose: () => void;
  loading?: boolean;
}

// Removed INITIAL_FORM as it's managed by the parent component

// Component to render category options from GraphQL
function CategoryOptions() {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) return <option disabled>Loading categories...</option>;
  if (error) return <option disabled>Error loading categories</option>;

  return (
    <>
      {data?.categories?.map((category: { category_id: number; name: string }) => (
        <option key={category.category_id} value={category.category_id.toString()}>
          {category.name}
        </option>
      ))}
    </>
  );
}

export function SupplierModal({
  isOpen,
  isEditing,
  form,
  onFormChange,
  onSave,
  onClose,
  loading = false,
}: SupplierModalProps) {
  if (!isOpen) return null;

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
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-4">
          {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter the details for the {isEditing ? 'supplier' : 'new supplier you want to add'}.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Name*</label>
              <input
                value={form.name}
                onChange={(e) => onFormChange({ ...form, name: e.target.value })}
                required
                placeholder="Enter supplier name"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Contact Person</label>
              <input
                value={form.contact_person || ''}
                onChange={(e) => onFormChange({ ...form, contact_person: e.target.value })}
                placeholder="Enter contact person"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Email*</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => onFormChange({ ...form, email: e.target.value })}
                required
                placeholder="Enter email address"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Phone*</label>
              <input
                type="tel"
                value={form.phone_no}
                onChange={(e) => onFormChange({ ...form, phone_no: e.target.value })}
                required
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 dark:text-gray-200">Address</label>
            <textarea
              value={form.address || ''}
              onChange={(e) => onFormChange({ ...form, address: e.target.value })}
              placeholder="Enter full address"
              rows={3}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">
                Registration Number
              </label>
              <input
                value={form.registration_number || ''}
                onChange={(e) => onFormChange({ ...form, registration_number: e.target.value })}
                placeholder="Enter registration number"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Tax ID</label>
              <input
                value={form.tax_id || ''}
                onChange={(e) => onFormChange({ ...form, tax_id: e.target.value })}
                placeholder="Enter tax ID"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  onFormChange({ ...form, status: e.target.value as 'Active' | 'Inactive' })
                }
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Category*</label>
              <select
                value={form.category_id}
                onChange={(e) => onFormChange({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
                required
              >
                <option value="">Select a category</option>
                <CategoryOptions />
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-neutral-800"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
