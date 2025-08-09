"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Updated supplier data with categories
const initialSuppliers = [
  {
    id: "S001",
    company: "FreshFarms Pvt Ltd",
    contact: "Aarav Singh",
    phone: "+91 99876 12345",
    email: "aarav@freshfarms.com",
    category: "Groceries",
  },
  {
    id: "S002",
    company: "DairyCo",
    contact: "Meera Raj",
    phone: "+91 88990 56744",
    email: "meera@dairyco.in",
    category: "Dairy",
  },
  {
    id: "S003",
    company: "CleanPro Suppliers",
    contact: "Sonal Jain",
    phone: "+91 90221 44567",
    email: "sonal@cleanpro.com",
    category: "Cleaning Supplies",
  },
  {
    id: "S004",
    company: "GlowCare Essentials",
    contact: "Kabir Mahajan",
    phone: "+91 90007 88811",
    email: "contact@glowcare.com",
    category: "Cosmetics",
  },
  {
    id: "S005",
    company: "BakeSmart Foods",
    contact: "Sunita Patel",
    phone: "+91 88766 11223",
    email: "sunita@bakesmart.com",
    category: "Bakery",
  },
];

// Sample recent transactions for each supplier
const supplierTransactions: Record<
  string,
  { date: string; item: string; amount: string }[]
> = {
  S001: [
    { date: "2025-08-01", item: "Fresh Vegetables", amount: "₹2,000" },
    { date: "2025-07-25", item: "Organic Fruits", amount: "₹1,500" },
  ],
  S002: [
    { date: "2025-07-30", item: "Milk Supply", amount: "₹3,200" },
    { date: "2025-07-20", item: "Cheese Blocks", amount: "₹2,000" },
  ],
  S003: [{ date: "2025-07-29", item: "Cleaning Supplies", amount: "₹1,800" }],
  S004: [{ date: "2025-08-02", item: "Skincare Products", amount: "₹5,000" }],
  S005: [{ date: "2025-07-28", item: "Bakery Ingredients", amount: "₹2,500" }],
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [viewing, setViewing] = useState<null | typeof suppliers[0]>(null);

  // ----------- ADD SUPPLIER STATE -----------
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contact: "",
    phone: "",
    email: "",
    category: "",
  });

  // ------- Helper for input dropdown ---------
  const allCategories = [
    ...new Set([...suppliers.map((s) => s.category), "Groceries", "Dairy", "Bakery", "Cosmetics", "Cleaning Supplies"]),
  ];

  const filtered =
    categoryFilter === "All"
      ? suppliers
      : suppliers.filter((s) => s.category === categoryFilter);

  // Get unique categories for the dropdown
  const categories = ["All", ...new Set(suppliers.map((s) => s.category))];

  // ----- Handle Add supplier -----
  function handleAddSupplier(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.company || !form.contact || !form.phone || !form.email || !form.category) return;
    setSuppliers((prev) => [
      ...prev,
      {
        id: "S" + String(Date.now()).slice(-5),
        company: form.company,
        contact: form.contact,
        phone: form.phone,
        email: form.email,
        category: form.category,
      },
    ]);
    setForm({ company: "", contact: "", phone: "", email: "", category: "" });
    setAdding(false);
  }

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-neutral-900 text-black dark:text-white transition-colors min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Suppliers</h1>

        <div className="flex gap-3 w-full md:w-auto items-center">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
          {/* --------- Add Supplier Button --------- */}
          <Button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <PlusCircle className="w-4 h-4" />
            Add Supplier
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
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Supplier ID
                  </th>
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Company
                  </th>
                  <th className="sticky top-0 border-b px-6 py-4 text-left font-semibold text-sm uppercase tracking-wide">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center text-gray-400 py-6 dark:text-gray-500"
                    >
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      onClick={() => setViewing(s)}
                    >
                      <td className="px-6 py-3 font-medium">{s.id}</td>
                      <td className="px-6 py-3">{s.company}</td>
                      <td className="px-6 py-3">{s.category}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {adding && (
        <Modal title="Add Supplier" onClose={() => setAdding(false)}>
          <form className="space-y-4" onSubmit={handleAddSupplier}>
            <div>
              <label className="block font-medium mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Contact Person</label>
              <input
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                required
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="w-full px-3 py-2 border rounded bg-white dark:bg-neutral-800 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Category</label>
              <Select
                value={form.category}
                onValueChange={(cat) => setForm((f) => ({ ...f, category: cat }))}
                required
              >
                <SelectTrigger className="w-full bg-white dark:bg-neutral-900 border dark:border-neutral-700 text-black dark:text-white rounded px-3 py-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories
                    .filter((cat) => cat !== "All")
                    .map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdding(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-neutral-800">
                Add Supplier
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {viewing && (
        <Modal
          title={`Supplier: ${viewing.company}`}
          onClose={() => setViewing(null)}
        >
          <div className="space-y-6">
            {/* Supplier Details */}
            <div>
              <h3 className="text-lg font-bold border-b border-gray-200 dark:border-neutral-700 pb-2">
                Details
              </h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-200 text-sm mt-2">
                <li>
                  <strong>Contact:</strong> {viewing.contact}
                </li>
                <li>
                  <strong>Phone:</strong> {viewing.phone}
                </li>
                <li>
                  <strong>Email:</strong> {viewing.email}
                </li>
                <li>
                  <strong>Category:</strong> {viewing.category}
                </li>
              </ul>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-lg font-bold border-b border-gray-200 dark:border-neutral-700 pb-2">
                Recent Transactions
              </h3>
              <table className="w-full text-sm border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden mt-2">
                <thead className="bg-gray-100 dark:bg-neutral-800">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierTransactions[viewing.id]?.length ? (
                    supplierTransactions[viewing.id].map((t, i) => (
                      <tr
                        key={i}
                        className={`border-t border-gray-200 dark:border-neutral-700 ${
                          i % 2 === 0
                            ? "bg-gray-50 dark:bg-neutral-900"
                            : "bg-white dark:bg-neutral-800"
                        }`}
                      >
                        <td className="px-4 py-2">{t.date}</td>
                        <td className="px-4 py-2">{t.item}</td>
                        <td className="px-4 py-2">{t.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-center text-gray-500"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
