"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Initial Data (add more for testing scroll)
const initialData = [
  {
    name: "Sunflower Oil",
    sku: "OIL001",
    category: "Grocery",
    supplier: "FreshFarms Pvt Ltd",
    qty: 20,
    price: 120,
  },
  {
    name: "Toothpaste",
    sku: "TP456",
    category: "Personal Care",
    supplier: "GlowCare Essentials",
    qty: 6,
    price: 80,
  },
  {
    name: "Bread - Whole Wheat",
    sku: "BRW001",
    category: "Bakery",
    supplier: "BakeSmart Foods",
    qty: 18,
    price: 35,
  },
  {
    name: "Shampoo",
    sku: "SHP123",
    category: "Personal Care",
    supplier: "CleanCare Inc.",
    qty: 40,
    price: 150,
  },
  {
    name: "Milk",
    sku: "MILK001",
    category: "Dairy",
    supplier: "DairyCo",
    qty: 15,
    price: 45,
  },
  {
    name: "Bottled Water - 24 Pack",
    sku: "BW24",
    category: "Beverages",
    supplier: "HydroPure Ltd.",
    qty: 60,
    price: 480,
  },
  // Add more mock rows to test scrollable body:
  {
    name: "Handwash",
    sku: "HW001",
    category: "Personal Care",
    supplier: "GlowCare Essentials",
    qty: 34,
    price: 85,
  },
  {
    name: "Tissue Paper",
    sku: "TPAP01",
    category: "Household",
    supplier: "CleanPro Suppliers",
    qty: 50,
    price: 60,
  },
  {
    name: "Cold Drink 500ml",
    sku: "CD500",
    category: "Beverages",
    supplier: "ChillBeverages",
    qty: 100,
    price: 40,
  },
  {
    name: "Detergent Powder",
    sku: "DPWD01",
    category: "Household",
    supplier: "CleanPro Suppliers",
    qty: 22,
    price: 180,
  },
];

export default function InventoryPage() {
  const [products, setProducts] = useState(initialData);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    qty: 0,
    price: 0,
  });

  const resetForm = () =>
    setForm({
      name: "",
      sku: "",
      category: "",
      supplier: "",
      qty: 0,
      price: 0,
    });

  const filtered = products.filter((item) =>
    [item.name, item.sku, item.category, item.supplier]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.sku || !form.category || !form.supplier || !form.qty || !form.price)
      return;

    const newProduct = {
      ...form,
      qty: Number(form.qty),
      price: Number(form.price),
    };

    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.sku === editing.sku ? newProduct : p))
      );
      setEditing(null);
    } else if (adding) {
      setProducts((prev) => [...prev, newProduct]);
      setAdding(false);
    }

    resetForm();
  };

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-black">Inventory</h1>
        <div className="flex gap-3 w-full md:w-auto">
          <Input
            className="w-full md:w-64"
            placeholder="Search by name, SKU, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              resetForm();
              setAdding(true);
            }}
            className="bg-black text-white"
          >
            <PlusCircle className="mr-2 w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* True Sticky, Scrollable Table */}
      <div className="rounded-xl border border-gray-200 overflow-x-auto bg-white shadow-md">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-[900px] w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-left font-semibold">Product</th>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-left font-semibold">SKU</th>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-left font-semibold">Category</th>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-left font-semibold">Supplier</th>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-right font-semibold">Qty</th>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-right font-semibold">Price</th>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-right font-semibold">Value</th>
                <th className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-6">
                    No matching products.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.sku} className="border-b border-gray-100">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.sku}</td>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2">{item.supplier}</td>
                    <td className="px-4 py-2 text-right">{item.qty}</td>
                    <td className="px-4 py-2 text-right">₹{item.price}</td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ₹{item.qty * item.price}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewing(item)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditing(item);
                            setForm({ ...item });
                          }}
                        >
                          Edit
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

      {/* View Modal */}
      {viewing && (
        <Modal title="Product Details" onClose={() => setViewing(null)}>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><strong>Name:</strong> {viewing.name}</li>
            <li><strong>SKU:</strong> {viewing.sku}</li>
            <li><strong>Category:</strong> {viewing.category}</li>
            <li><strong>Supplier:</strong> {viewing.supplier}</li>
            <li><strong>Qty:</strong> {viewing.qty}</li>
            <li><strong>Price:</strong> ₹{viewing.price}</li>
            <li><strong>Total:</strong> ₹{viewing.qty * viewing.price}</li>
          </ul>
        </Modal>
      )}

      {/* Add/Edit Modal */}
      {(adding || editing) && (
        <Modal
          title={editing ? "Edit Product" : "Add Product"}
          onClose={() => {
            setAdding(false);
            setEditing(null);
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
            {["name", "sku", "category", "supplier"].map((field) => (
              <div key={field}>
                <label className="block font-medium mb-1 capitalize">{field}</label>
                <Input
                  value={(form as any)[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  required
                  disabled={editing && field === "sku"}
                />
              </div>
            ))}
            <div>
              <label className="block font-medium mb-1">Quantity</label>
              <Input
                type="number"
                value={form.qty}
                onChange={(e) =>
                  setForm({ ...form, qty: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Price</label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => {
                setAdding(false);
                setEditing(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white">
                {editing ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
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
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-2xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
