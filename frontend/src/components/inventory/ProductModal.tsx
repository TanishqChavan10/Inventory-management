import { Button } from '@/components/ui/button';

type ProductForm = {
  name: string;
  category: string;
  qty: number;
  price: number;
  minCount: number;
};

interface ProductModalProps {
  isOpen: boolean;
  isEditing: boolean;
  form: ProductForm;
  categories: string[];
  onFormChange: (form: ProductForm) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ProductModal({
  isOpen,
  isEditing,
  form,
  categories,
  onFormChange,
  onSave,
  onClose,
}: ProductModalProps) {
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
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter the details for the{' '}
            {isEditing ? 'product' : 'new product you want to add to inventory'}.
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
            <label className="block font-medium mb-1 dark:text-gray-200">Product Name</label>
            <input
              value={form.name || ''}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              required
              placeholder="Enter product name"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 dark:text-gray-200">Category</label>
            <select
              value={form.category || ''}
              onChange={(e) => onFormChange({ ...form, category: e.target.value })}
              required
              className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            >
              <option value="">Select category</option>
              {categories
                .filter((cat) => cat !== 'All')
                .map((cat) => (
                  <option key={String(cat)} value={String(cat)}>
                    {String(cat)}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.price === 0 ? '' : form.price}
                onChange={(e) => onFormChange({ ...form, price: e.target.value === '' ? 0 : Number(e.target.value) })}
                required
                placeholder="0.00"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Initial Stock</label>
              <input
                type="number"
                value={form.qty === 0 ? '' : form.qty}
                onChange={(e) => onFormChange({ ...form, qty: e.target.value === '' ? 0 : Number(e.target.value) })}
                required
                placeholder="0"
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1 dark:text-gray-200">Minimum Stock Level</label>
            <input
              type="number"
              value={form.minCount === 0 ? '' : form.minCount}
              onChange={(e) => onFormChange({ ...form, minCount: e.target.value === '' ? 0 : Number(e.target.value) })}
              required
              placeholder="0"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-neutral-800">
              {isEditing ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
