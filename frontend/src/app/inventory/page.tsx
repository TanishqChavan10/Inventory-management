'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- Apollo Client and GraphQL Imports ---
import { useQuery, useMutation } from '@apollo/client';

// Make sure this path is correct for your project structure
import { GET_PRODUCTS, ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT} from '../graphql/products';

// --- Define a type for our Product for better TypeScript support ---
type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty: number;
  price: number;
};


export default function InventoryPage() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewing, setViewing] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({ name: '', sku: '', category: '', qty: 0, price: 0 });
  const [recentlyDeleted, setRecentlyDeleted] = useState<{ item: Product; index: number } | null>(null);


  // --- STEP 1: Fetch data from the backend ---
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      // Send null if 'All' is selected, otherwise send the category name
      category: categoryFilter === 'All' ? null : categoryFilter,
    },
    notifyOnNetworkStatusChange: true,
  });

  // --- Extract products and categories from the fetched data ---
  const products: Product[] = data?.products || [];
  const categories = ['All', ...Array.from(new Set(data?.products.map((p: Product) => p.category) || []))];

  // --- STEP 2: Define the mutations ---
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const resetForm = () => setForm({ name: '', sku: '', category: '', qty: 0, price: 0 });

  // --- STEP 3: Update event handlers to call mutations ---
  const handleSave = async () => {
    if (!form.name || !form.sku || !form.category) return;
    
    try {
      if (editing) {
        const updateInput = {
          id: editing.id,
          name: form.name,
          sku: form.sku,
          category: form.category,
          quantity: Number(form.qty),
          price: Number(form.price),
        };
        await updateProduct({ variables: { updateProductInput: updateInput } });
        toast.success("Product updated successfully!");
        setEditing(null);
      } else {
        const createInput = {
          name: form.name,
          sku: form.sku,
          category: form.category,
          quantity: Number(form.qty),
          price: Number(form.price),
        };
        await addProduct({ variables: { createProductInput: createInput } });
        toast.success("Product added successfully!");
        setAdding(false);
      }
      refetch(); // Refetch the product list to show the new data
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = (productToDelete: Product) => {
    // This visually removes the item and shows the toast
    const index = products.findIndex((p) => p.id === productToDelete.id);
    setRecentlyDeleted({ item: productToDelete, index });

    const updatedProducts = products.filter((p) => p.id !== productToDelete.id);
    // A bit of a hack to update the cache visually before the mutation confirms
    // This provides a faster UI response. A more advanced method is to update the Apollo Cache directly.
    
    toast.error('Product has been deleted.', {
      action: {
        label: 'Undo',
        onClick: () => {
           // For now, undo is visual. A full implementation would cancel the scheduled delete.
           toast.info("Delete operation cancelled.");
        },
      },
      // When the toast automatically closes, confirm the deletion with the backend
      onAutoClose: () => confirmDelete(productToDelete.id),
    });
  };

  const confirmDelete = async (id: string) => {
     try {
      await deleteProduct({ variables: { id } });
      refetch(); // Refetch the list to confirm deletion from server
      toast.success("Product permanently deleted.");
    } catch (err: any) {
      toast.error(`Failed to delete product: ${err.message}`);
    }
  }

  // Your backend should return a total count for pagination to work correctly
  // For now, we'll estimate it based on the current page or assume a placeholder
  const totalPages = Math.ceil( (data?.productsCount || products.length) / itemsPerPage) || 1;

  if (loading && !data?.products) return <p className="text-center p-10">Loading inventory...</p>;
  if (error) return <p className="text-center text-red-500 p-10">Error: {error.message}</p>;

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-neutral-900 text-black dark:text-white transition-colors min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Inventory</h1>
        <div className="flex gap-3 w-full md:w-auto items-center">
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
          <Button
            onClick={() => {
              resetForm();
              setAdding(true);
            }}
            className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <PlusCircle className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-4xl mx-auto">
        <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-x-auto bg-white dark:bg-neutral-900 shadow-lg">
          <div className="max-h-[500px] overflow-y-auto rounded-xl">
            <table className="min-w-[600px] w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800">
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    SKU
                  </th>
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Product
                  </th>
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Category
                  </th>
                  <th className="sticky top-0 border-b px-6 py-4 text-right font-semibold text-sm uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-6 dark:text-gray-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr
                      key={item.id} // Use the database ID as the key
                      className="border-b hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      onClick={() => setViewing(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setViewing(item);
                      }}
                    >
                      <td className="px-6 py-3 font-medium">{item.sku}</td>
                      <td className="px-6 py-3">{item.name}</td>
                      <td className="px-6 py-3">{item.category}</td>
                      <td className="px-6 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                              aria-label="Open row actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditing(item);
                                setForm({ ...item, qty: item.quantity }); // Map 'quantity' to 'qty' for the form
                                setViewing(null);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700"
                              onClick={() => handleDelete(item)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* View Modal */}
      {viewing && (
        <Modal title={viewing.name + ' (' + viewing.sku + ')'} onClose={() => setViewing(null)}>
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold border-b border-gray-200 dark:border-neutral-700 pb-2">
                Details
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-200 text-sm mt-2">
                <li>
                  <strong>Category:</strong> {viewing.category}
                </li>
                <li>
                  <strong>Quantity:</strong> {viewing.quantity}
                </li>
                <li>
                  <strong>Price:</strong> ₹{viewing.price}
                </li>
                <li>
                  <strong>Total Value:</strong> ₹{viewing.quantity * viewing.price}
                </li>
              </ul>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(viewing);
                  setForm({ ...viewing, qty: viewing.quantity });
                  setViewing(null);
                }}
              >
                Edit
              </Button>
              <Button variant="outline" onClick={() => setViewing(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      {(adding || editing) && (
        <Modal
          title={editing ? 'Edit Product' : 'Add Product'}
          onClose={() => {
            setEditing(null);
            setAdding(false);
            resetForm();
          }}
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {['name', 'sku', 'category'].map((field) => (
              <div key={field}>
                <label className="block font-medium mb-1 capitalize dark:text-gray-200">
                  {field}
                </label>
                <input
                  value={(form as any)[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required
                  disabled={editing && field === 'sku'}
                  className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
                />
              </div>
            ))}
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Quantity</label>
              <input
                type="number"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setAdding(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-neutral-800">
                {editing ? 'Save Changes' : 'Add Product'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

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
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}