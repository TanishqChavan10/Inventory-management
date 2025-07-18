"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// 📝 Initial supplier data
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

// 🟢 Main Supplier Page
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

  // Search/filter logic
  const filtered = suppliers.filter(s =>
    [s.company, s.contact, s.phone, s.email]
      .join(" ").toLowerCase()
      .includes(search.toLowerCase())
  );

  // Handle save (add/edit)
  const handleSave = () => {
    if (!form.company || !form.contact || !form.phone || !form.email) return;

    if (editing) {
      setSuppliers(suppliers.map(s =>
        s.id === editing.id ? { ...form, id: editing.id } : s
      ));
      setEditing(null);
    } else if (adding) {
      setSuppliers([
        ...suppliers,
        { ...form, id: `S${String(Date.now()).slice(-5)}` },
      ]);
      setAdding(false);
    }
    setForm({ id: "", company: "", contact: "", phone: "", email: "" });
  };

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-black">Suppliers</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            className="w-full md:w-72"
            placeholder="Search by company, contact, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              setAdding(true);
              setForm({ id: "", company: "", contact: "", phone: "", email: "" });
            }}
            className="bg-black text-white"
          >
            <PlusCircle className="mr-2 w-5 h-5" /> Add Supplier
          </Button>
        </div>
      </div>

      {/* Scrollable Supplier Table */}
      <div className="border border-gray-200 rounded-xl overflow-x-auto bg-white shadow-md">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-[800px] w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky top-0 bg-white z-10 border-b px-4 py-3 text-left font-semibold">Company</th>
                <th className="sticky top-0 bg-white z-10 border-b px-4 py-3 text-left font-semibold">Contact</th>
                <th className="sticky top-0 bg-white z-10 border-b px-4 py-3 text-left font-semibold">Phone</th>
                <th className="sticky top-0 bg-white z-10 border-b px-4 py-3 text-left font-semibold">Email</th>
                <th className="sticky top-0 bg-white z-10 border-b px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="border-b">
                    <td className="px-4 py-2">{s.company}</td>
                    <td className="px-4 py-2">{s.contact}</td>
                    <td className="px-4 py-2">{s.phone}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-1">
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
          <form className="space-y-4" onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}>
            <div>
              <label className="block font-medium mb-1">Company</label>
              <Input
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Contact</label>
              <Input
                value={form.contact}
                onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <Input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
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
              <Button type="submit" className="bg-black text-white">
                {editing ? "Save" : "Add"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {viewing && (
        <Modal title="Supplier Details" onClose={() => setViewing(null)}>
          <ul className="space-y-2 text-gray-700 text-sm">
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

// 🗂️ Reusable Modal
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
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-2xl"
        >×</button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}
