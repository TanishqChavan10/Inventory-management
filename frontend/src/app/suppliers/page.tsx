"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Initial supplier data
const initialSuppliers = [
  {
    id: "S001",
    company: "FreshFarms Pvt Ltd",
    contact: "Aarav Singh",
    phone: "+91 99876 12345",
    email: "aarav@freshfarms.com",
  },
  {
    id: "S002",
    company: "DairyCo",
    contact: "Meera Raj",
    phone: "+91 88990 56744",
    email: "meera@dairyco.in",
  },
  {
    id: "S003",
    company: "CleanPro Suppliers",
    contact: "Sonal Jain",
    phone: "+91 90221 44567",
    email: "sonal@cleanpro.com",
  },
  {
    id: "S004",
    company: "GlowCare Essentials",
    contact: "Kabir Mahajan",
    phone: "+91 90007 88811",
    email: "contact@glowcare.com",
  },
  {
    id: "S005",
    company: "BakeSmart Foods",
    contact: "Sunita Patel",
    phone: "+91 88766 11223",
    email: "sunita@bakesmart.com",
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<null | typeof suppliers[0]>(null);
  const [viewing, setViewing] = useState<null | typeof suppliers[0]>(null);

  const [form, setForm] = useState({
    id: "",
    company: "",
    contact: "",
    phone: "",
    email: "",
  });

  const filtered = suppliers.filter((s) =>
    [s.company, s.contact, s.phone, s.email]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.company || !form.contact || !form.phone || !form.email) return;

    if (editing) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...form, id: editing.id } : s))
      );
      setEditing(null);
    } else if (adding) {
      setSuppliers((prev) => [
        ...prev,
        { ...form, id: `S${String(Date.now()).slice(-5)}` },
      ]);
      setAdding(false);
    }

    setForm({ id: "", company: "", contact: "", phone: "", email: "" });
  };

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8 bg-white dark:bg-black text-black dark:text-white transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            className="w-full md:w-72 bg-white dark:bg-neutral-900 border dark:border-neutral-700 text-black dark:text-white"
            placeholder="Search by company, contact, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              setAdding(true);
              setForm({ id: "", company: "", contact: "", phone: "", email: "" });
            }}
            className="bg-black text-white dark:bg-white dark:text-black dark:border dark:border-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <PlusCircle className="mr-2 w-5 h-5" /> Add Supplier
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-x-auto bg-white dark:bg-neutral-900 shadow-md">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-[800px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50 dark:bg-neutral-800">
                <th className="sticky top-0 z-10 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 text-left font-semibold text-black dark:text-white">
                  Company
                </th>
                <th className="sticky top-0 z-10 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 text-left font-semibold text-black dark:text-white">
                  Contact
                </th>
                <th className="sticky top-0 z-10 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 text-left font-semibold text-black dark:text-white">
                  Phone
                </th>
                <th className="sticky top-0 z-10 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 text-left font-semibold text-black dark:text-white">
                  Email
                </th>
                <th className="sticky top-0 z-10 border-b border-gray-200 dark:border-neutral-700 px-4 py-3 text-center font-semibold text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6 dark:text-gray-500">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 dark:border-neutral-700">
                    <td className="px-4 py-2">{s.company}</td>
                    <td className="px-4 py-2">{s.contact}</td>
                    <td className="px-4 py-2">{s.phone}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewing(s)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditing(s);
                            setForm({ ...s });
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

      {/* Add/Edit Modal */}
      {(adding || editing) && (
        <Modal
          title={editing ? "Edit Supplier" : "Add Supplier"}
          onClose={() => {
            setAdding(false);
            setEditing(null);
            setForm({ id: "", company: "", contact: "", phone: "", email: "" });
          }}
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {["company", "contact", "phone", "email"].map((field) => (
              <div key={field}>
                <label className="block font-medium mb-1 capitalize dark:text-white">{field}</label>
                <Input
                  type={field === "email" ? "email" : "text"}
                  value={(form as any)[field]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [field]: e.target.value }))
                  }
                  required
                  className="bg-white dark:bg-neutral-800 text-black dark:text-white"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAdding(false);
                  setEditing(null);
                  setForm({ id: "", company: "", contact: "", phone: "", email: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                {editing ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {viewing && (
        <Modal title="Supplier Details" onClose={() => setViewing(null)}>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200 text-sm">
            <li><strong>Company:</strong> {viewing.company}</li>
            <li><strong>Contact:</strong> {viewing.contact}</li>
            <li><strong>Phone:</strong> {viewing.phone}</li>
            <li><strong>Email:</strong> {viewing.email}</li>
          </ul>
        </Modal>
      )}
    </div>
  );
}

// Modal component
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
        className="bg-white dark:bg-neutral-900 text-black dark:text-white p-6 rounded-lg shadow-lg max-w-md w-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 text-2xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
