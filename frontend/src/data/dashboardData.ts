import {
  PackageSearch,
  AlertCircle,
  Timer,
  IndianRupee,
} from "lucide-react";

export const statDetails: Record<
  string,
  { title: string; columns: string[]; data: any[][] }
> = {
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

export const stats = [
  { label: "Total Products", value: 104, icon: PackageSearch },
  { label: "Low Stock Alerts", value: 8, icon: AlertCircle },
  { label: "Expired Items", value: 2, icon: Timer },
  { label: "Total Inventory Value", value: "₹42,350", icon: IndianRupee },
];

export const suppliers = [
  "DairyCo",
  "BakeSmart Foods",
  "GlowCare Essentials",
  "HydroPure Ltd.",
  "CleanCare Inc.",
  "FreshFarms Pvt Ltd",
  "SpiceWorld Imports",
];

export const activity = [
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
