"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PackageSearch,
  AlertCircle,
  Timer,
  IndianRupee,
  PlusCircle,
  ActivitySquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Optional: Mock Data for Modals
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
      ["Sunflower Oil", "OIL001", 20, "₹120", "₹2400"],
      ["Toothpaste", "TP456", 6, "₹80", "₹480"],
    ],
  }
};

const stats = [
  {
    label: "Total Products",
    value: 104,
    icon: PackageSearch,
  },
  {
    label: "Low Stock Alerts",
    value: 8,
    icon: AlertCircle,
  },
  {
    label: "Expired Items",
    value: 2,
    icon: Timer,
  },
  {
    label: "Total Inventory Value",
    value: "₹42,350",
    icon: IndianRupee,
  },
];

const activity = [
  {
    id: 1,
    text: "New purchase order created for DairyCo (PO #1025).",
    time: "2 hours ago",
  },
  {
    id: 2,
    text: "Stock level updated for Shampoo - 40 → 80 units.",
    time: "Today",
  },
  {
    id: 3,
    text: "Item 'Milk' marked as expired batch.",
    time: "Yesterday",
  },
  {
    id: 4,
    text: "Added new supplier: FreshGreens Pvt Ltd.",
    time: "2 days ago",
  },
];

export default function DashboardPage() {
  const [modal, setModal] = useState<null|{title:string,columns:string[],data:any[][]}>(null);

  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8">
      {/* Heading and Add Product button */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
      
      </div>

      {/* Stat Cards: clickable for details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => (
          <button
            key={stat.label}
            className="text-left"
            onClick={() =>
              setModal(statDetails[stat.label] || null)
            }
          >
            <Card className="border border-gray-200 bg-white hover:shadow-sm transition w-full h-full">
              <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-gray-500">
                  {stat.label}
                </CardTitle>
                <stat.icon className="w-5 h-5 text-black" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stat.value}</div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Modal for stat card details */}
      {modal && (
        <DashboardModal modal={modal} onClose={() => setModal(null)} />
      )}

      {/* Recent Activity */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm max-h-[300px] overflow-auto divide-y divide-gray-100">
          {activity.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
            >
              <ActivitySquare className="w-4 h-4 mt-1 text-gray-400" />
              <div className="flex flex-col">
                <p className="text-sm text-gray-700">{event.text}</p>
                <span className="text-xs text-gray-400">{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Modal for stat card details
function DashboardModal({
  modal,
  onClose,
}: {
  modal: { title: string; columns: string[]; data: any[][] };
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 text-2xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">{modal.title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-100 rounded text-sm">
            <thead>
              <tr>
                {modal.columns.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 border-b border-gray-200 text-left font-semibold bg-gray-50"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modal.data.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-3 py-2 border-b border-gray-100"
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
