import { Button } from '@/components/ui/button';

type SupplierForm = {
  name: string;
  email: string;
  phone_no: string;
};

interface SupplierModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: SupplierForm;
  onFormChange: (form: SupplierForm) => void;
  onSave: () => void;
  onClose: () => void;
}

export function SupplierModal({
  isOpen,
  isEditing,
  form,
  onFormChange,
  onSave,
  onClose,
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
            Enter the details for the{' '}
            {isEditing ? 'supplier' : 'new supplier you want to add'}.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div>
            <label className="block font-medium mb-1 dark:text-gray-200">Supplier Name</label>
            <input
              value={form.name || ''}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              required
              placeholder="Enter supplier name"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 dark:text-gray-200">Email</label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => onFormChange({ ...form, email: e.target.value })}
              required
              placeholder="Enter email address"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 dark:text-gray-200">Phone Number</label>
            <input
              type="tel"
              value={form.phone_no || ''}
              onChange={(e) => onFormChange({ ...form, phone_no: e.target.value })}
              required
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-neutral-800">
              {isEditing ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}