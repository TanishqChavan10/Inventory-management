"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PackageSearch,
  AlertCircle,
  Timer,
  IndianRupee,
  ActivitySquare,
  Send,
  CheckCircle,
  AlertTriangle,
  XCircle,
  UserPlus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// --- Stat Cards Data ---
const statDetails = {
  "Total Products": {
    title: "All Products",
    columns: ["Product", "SKU", "Category", "Supplier", "Qty", "Price"],
    data: [
      ["Sunflower Oil", "OIL001", "Grocery", "FreshFarms Pvt Ltd", 20, "₹120"],
      ["Toothpaste", "TP456", "Personal Care", "GlowCare Essentials", 6, "₹80"],
      ["Shampoo", "SHP123", "Personal Care", "CleanCare Inc.", 40, "₹150"],
      ["Bread - Whole Wheat", "BRW001", "Bakery", "BakeSmart Foods", 18, "₹35"],
      ["Milk", "MILK001", "Dairy", "DairyCo", 15, "₹45"],
      ["Bottled Water - 24 Pack", "BW24", "Beverages", "HydroPure Ltd.", 60, "₹480"],
    ],
  },
  "Low Stock Alerts": {
    title: "Low Stock Products",
    columns: ["Product", "SKU", "Qty"],
    data: [
      ["Toothpaste", "TP456", 6],
      ["Bread - Whole Wheat", "BRW001", 4],
    ],
  },
  "Expired Items": {
    title: "Expired Products",
    columns: ["Product", "SKU", "Expiry"],
    data: [
      ["Milk", "MILK001", "2025-07-20"],
      ["Bottled Water - 24 Pack", "BW24", "2025-06-10"],
    ],
  },
  "Total Inventory Value": {
    title: "Inventory Value",
    columns: ["Product", "SKU", "Qty", "Price", "Total"],
    data: [
      ["Sunflower Oil", "OIL001", 20, "₹120", "₹2,400"],
      ["Toothpaste", "TP456", 6, "₹80", "₹480"],
    ],
  },
};

const stats = [
  { label: "Total Products", value: 104, icon: PackageSearch },
  { label: "Low Stock Alerts", value: 8, icon: AlertCircle },
  { label: "Expired Items", value: 2, icon: Timer },
  { label: "Total Inventory Value", value: "₹42,350", icon: IndianRupee },
];

const suppliers = [
  "DairyCo",
  "BakeSmart Foods",
  "GlowCare Essentials",
  "HydroPure Ltd.",
  "CleanCare Inc.",
  "FreshFarms Pvt Ltd",
  "SpiceWorld Imports",
];

const activity = [
  { id: 1, text: "New purchase order created for DairyCo (PO #1025).", time: "2 hours ago" },
  { id: 2, text: "Stock level updated for Shampoo - 40 → 80 units.", time: "Today" },
  { id: 3, text: "Item 'Milk' marked as expired batch.", time: "Yesterday" },
  { id: 4, text: "Added new supplier: FreshGreens Pvt Ltd.", time: "2 days ago" },
  { id: 5, text: "Low stock alert for Bread - Whole Wheat.", time: "2 days ago" },
  { id: 6, text: "Received shipment from BakeSmart Foods (Invoice #876).", time: "3 days ago" },
  { id: 7, text: "Price updated for Sunflower Oil - ₹110 → ₹120.", time: "Last week" },
  { id: 8, text: "New purchase order created for OceanicFoods (PO #1026).", time: "Last week" },
  { id: 9, text: "Out-of-stock alert: Organic Honey.", time: "8 days ago" },
  { id: 10, text: "Supplier payment processed: HydroPure Ltd.", time: "9 days ago" },
  { id: 11, text: "Warehouse inventory audit completed.", time: "2 weeks ago" },
  { id: 12, text: "Low stock alert for Fresh Apples.", time: "2 weeks ago" },
  { id: 13, text: "Expired batch removed: Yogurt, DairyCo.", time: "3 weeks ago" },
  { id: 14, text: "New supplier added: SpiceWorld Imports.", time: "1 month ago" },
];

export default function DashboardPage() {
  const [modal, setModal] = useState<null | { title: string; columns: string[]; data: any[][] }>(null);

  // --- Supplier Chat State ---
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0]);
  // Use a dictionary to keep chat history per supplier
  const [allChats, setAllChats] = useState<Record<string, { from: "user" | "bot"; text: string; id: number }[]>>({});
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat on supplier or messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedSupplier, allChats]);

  const messages = allChats[selectedSupplier] || [];

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { from: "user", text: input.trim(), id: Date.now() };
    setAllChats((prev) => ({
      ...prev,
      [selectedSupplier]: [...(prev[selectedSupplier] || []), newMsg],
    }));
    setInput("");
    // Simulated bot reply
    setTimeout(() => {
      const botMsg = {
        from: "bot",
        text: `Thank you! We'll process your ${selectedSupplier} request and reply soon.`,
        id: Date.now() + 1,
      };
      setAllChats((prev) => ({
        ...prev,
        [selectedSupplier]: [...(prev[selectedSupplier] || []), botMsg],
      }));
    }, 1200);
  };

  function getActivityIcon(text: string) {
    if (text.toLowerCase().includes("purchase order")) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (text.toLowerCase().includes("low stock") || text.toLowerCase().includes("alert")) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if (text.toLowerCase().includes("expired")) return <XCircle className="w-4 h-4 text-red-500" />;
    if (text.toLowerCase().includes("supplier")) return <UserPlus className="w-4 h-4 text-blue-500" />;
    return <ActivitySquare className="w-4 h-4 text-gray-400 dark:text-gray-300" />;
  }

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-neutral-950 dark:to-neutral-900 min-h-screen text-black dark:text-white transition-colors">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Inventory overview & recent activity
        </p>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <button
            key={stat.label}
            aria-label={`View details for ${stat.label}`}
            className="text-left focus:outline-none"
            onClick={() => setModal(statDetails[stat.label] || null)}
          >
            <Card className="group border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-200 focus:ring-2 focus:ring-indigo-500">
              <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  {stat.label}
                </CardTitle>
                <stat.icon className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  +3% vs last period
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </section>

      {/* Chatbot & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Supplier Chat with Dropdown */}
        <Card className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl shadow-sm flex flex-col h-full min-h-[400px]">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg">Supplier Chat</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Supplier:</span>
                <Select
                  value={selectedSupplier}
                  onValueChange={(v) => setSelectedSupplier(v)}
                >
                  <SelectTrigger className="w-[180px] bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 h-10 rounded-md focus:ring focus:ring-indigo-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent
            ref={chatContainerRef}
            className="flex-grow flex flex-col overflow-y-auto space-y-3 px-4 py-3 scroll-smooth"
            style={{ minHeight: 240 }}
          >
            {messages.length === 0 && (
              <p className="text-gray-500 dark:text-gray-300 text-center mt-10 font-medium">
                Start a conversation with <span className="font-semibold">{selectedSupplier}</span>...
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex max-w-xs rounded-lg px-3 py-2 ${
                  msg.from === "user"
                    ? "bg-indigo-600 text-white self-end"
                    : "bg-gray-200 dark:bg-neutral-800 text-black dark:text-white self-start"
                } shadow-sm`}
              >
                {msg.text}
              </div>
            ))}
          </CardContent>
          <div className="border-t border-gray-200 dark:border-neutral-700 p-4 flex items-center space-x-3 shadow-sm bg-gray-50 dark:bg-neutral-950">
            <input
              type="text"
              placeholder={`Message ${selectedSupplier}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              className="flex-grow rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-3 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-3 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </Card>

        {/* Recent Activity */}
        <div className="lg:col-span-2 h-full min-h-[400px] flex flex-col">
          <Card className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-auto divide-y divide-gray-100 dark:divide-neutral-800 flex-grow">
              {activity.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-150 rounded-md"
                >
                  {getActivityIcon(event.text)}
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-700 dark:text-gray-200">{event.text}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modal for stats */}
      {modal && <DashboardModal modal={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

function DashboardModal({
  modal,
  onClose,
}: {
  modal: { title: string; columns: string[]; data: any[][] };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 text-black dark:text-white p-6 rounded-2xl shadow-2xl max-w-3xl w-full relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 text-2xl hover:text-black dark:hover:text-white transition"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-extrabold mb-4">{modal.title}</h2>
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-sm border border-gray-200 dark:border-neutral-800 rounded-xl">
            <thead className="sticky top-0 bg-gray-100 dark:bg-neutral-800 z-10">
              <tr>
                {modal.columns.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modal.data.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-gray-50 dark:bg-neutral-950/40"}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-2 border-t border-gray-200 dark:border-neutral-800"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
