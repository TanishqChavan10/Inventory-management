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
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner'; // --- NEW --- Import toast

const initialData = [
  { name: 'Sunflower Oil', sku: 'OIL001', category: 'Grocery', qty: 20, price: 120 },
  { name: 'Toothpaste', sku: 'TP456', category: 'Personal Care', qty: 6, price: 80 },
  { name: 'Bread - Whole Wheat', sku: 'BRW001', category: 'Bakery', qty: 18, price: 35 },
  { name: 'Shampoo', sku: 'SHP123', category: 'Personal Care', qty: 40, price: 150 },
  { name: 'Milk', sku: 'MILK001', category: 'Dairy', qty: 15, price: 45 },
  { name: 'Bottled Water - 24 Pack', sku: 'BW24', category: 'Beverages', qty: 60, price: 480 },
  { name: 'Handwash', sku: 'HW001', category: 'Personal Care', qty: 34, price: 85 },
  { name: 'Tissue Paper', sku: 'TPAP01', category: 'Household', qty: 50, price: 60 },
  { name: 'Cold Drink 500ml', sku: 'CD500', category: 'Beverages', qty: 100, price: 40 },
  { name: 'Detergent Powder', sku: 'DPWD01', category: 'Household', qty: 22, price: 180 },
];

export default function InventoryPage() {
  const [products, setProducts] = useState(initialData);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({ name: '', sku: '', category: '', qty: 0, price: 0 });
  const [recentlyDeleted, setRecentlyDeleted] = useState(null); // --- NEW --- State for undo feature

  const resetForm = () => setForm({ name: '', sku: '', category: '', qty: 0, price: 0 });

  const handleSave = () => {
    // ... handleSave logic remains the same
    if (!form.name || !form.sku || !form.category || !form.qty || !form.price) return;
    const newProduct = { ...form, qty: Number(form.qty), price: Number(form.price) };
    if (editing) {
      setProducts((prev) => prev.map((p) => (p.sku === editing.sku ? newProduct : p)));
      setEditing(null);
    } else if (adding) {
      setProducts((prev) => [...prev, newProduct]);
      setAdding(false);
    }
    resetForm();
  };

  // --- MODIFIED --- This function now triggers the undo toast
  const handleDelete = (productToDelete) => {
    const index = products.findIndex((p) => p.sku === productToDelete.sku);
    setRecentlyDeleted({ item: productToDelete, index });

    setProducts((prev) => prev.filter((p) => p.sku !== productToDelete.sku));

    toast.error('Product has been deleted.', {
      action: {
        label: 'Undo',
        onClick: () => handleUndo(),
      },
    });
  };
  
  // --- NEW --- This function restores the deleted product
  const handleUndo = () => {
    if (recentlyDeleted) {
      const { item, index } = recentlyDeleted;
      const updatedProducts = [...products];
      updatedProducts.splice(index, 0, item);
      setProducts(updatedProducts);
      setRecentlyDeleted(null);
      toast.success('Product restored!');
    }
  };


  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered =
    categoryFilter === 'All' ? products : products.filter((p) => p.category === categoryFilter);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-neutral-900 text-black dark:text-white transition-colors min-h-screen">
      {/* Header and Filter sections remain the same */}
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
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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

      {/* Table Container */}
      <div className="max-w-4xl mx-auto">
        <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-x-auto bg-white dark:bg-neutral-900 shadow-lg">
          <div className="max-h-[500px] overflow-y-auto rounded-xl">
            <table className="min-w-[600px] w-full border-separate border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800">
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">SKU</th>
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">Product</th>
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">Category</th>
                  <th className="sticky top-0 border-b px-6 py-4 text-right font-semibold text-sm uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-6 dark:text-gray-500">No products found.</td></tr>
                ) : (
                  paginatedProducts.map((item) => (
                    <tr
                      key={item.sku}
                      className="border-b hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      onClick={() => setViewing(item)}
                      role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setViewing(item); }}
                    >
                      <td className="px-6 py-3 font-medium">{item.sku}</td>
                      <td className="px-6 py-3">{item.name}</td>
                      <td className="px-6 py-3">{item.category}</td>
                      <td className="px-6 py-3 text-right">
                        <Button
                          variant="ghost" size="icon" className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item); // --- MODIFIED --- Pass the entire item to the delete handler
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Component remains the same */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* View and Add/Edit Modals remain unchanged */}
      {viewing && (
        <Modal title={viewing.name + ' (' + viewing.sku + ')'} onClose={() => setViewing(null)}>
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold border-b border-gray-200 dark:border-neutral-700 pb-2">Details</h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-200 text-sm mt-2">
                <li><strong>Category:</strong> {viewing.category}</li>
                <li><strong>Quantity:</strong> {viewing.qty}</li>
                <li><strong>Price:</strong> ₹{viewing.price}</li>
                <li><strong>Total Value:</strong> ₹{viewing.qty * viewing.price}</li>
              </ul>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditing(viewing); setForm({ ...viewing }); setViewing(null); }}>Edit</Button>
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
      {(adding || editing) && (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => { setEditing(null); setAdding(false); resetForm(); }}>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {['name', 'sku', 'category'].map((field) => (
              <div key={field}>
                <label className="block font-medium mb-1 capitalize dark:text-gray-200">{field}</label>
                <input value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required disabled={editing && field === 'sku'} className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white" />
              </div>
            ))}
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Quantity</label>
              <input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} required className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white" />
            </div>
            <div>
              <label className="block font-medium mb-1 dark:text-gray-200">Price</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setEditing(null); setAdding(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" className="bg-black text-white hover:bg-neutral-800">{editing ? 'Save' : 'Add'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Modal component remains unchanged
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 text-black dark:text-white p-6 rounded-2xl shadow-2xl max-w-lg w-full relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 text-2xl hover:text-black dark:hover:text-white transition">×</button>
        <h2 className="text-2xl font-extrabold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}