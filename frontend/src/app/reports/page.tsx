"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// 📅 Months
const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

// 📦 Inventory + Sales + Returns (Main bar + line)
const inventoryData = {
  labels: months,
  datasets: [
    {
      label: "Stock Level",
      data: [500, 475, 450, 430, 420, 400],
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      barPercentage: 0.5,
    },
    {
      label: "Sales",
      data: [300, 320, 280, 250, 270, 300],
      backgroundColor: "rgba(100, 100, 100, 0.6)",
      barPercentage: 0.5,
    },
    {
      label: "Returns",
      type: "line",
      data: [10, 12, 9, 11, 8, 7],
      borderColor: "#ff3d00",
      pointBackgroundColor: "#ff3d00",
      backgroundColor: "#ff3d00",
      tension: 0.3,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 6,
      yAxisID: "y1",
    },
  ],
};

const inventoryOptions = {
  responsive: true,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "top" as const,
      labels: { color: "#333" },
    },
  },
  scales: {
    x: {
      ticks: { color: "#666" },
    },
    y: {
      ticks: { color: "#666" },
    },
    y1: {
      position: "right" as const,
      grid: { drawOnChartArea: false },
      ticks: { color: "#ff3d00" },
    },
  },
};

// 📈 New Chart: Inventory Value Over Time (Line chart)
const valueGrowthData = {
  labels: months,
  datasets: [
    {
      label: "Inventory Value (₹)",
      data: [100000, 98000, 96000, 94000, 93000, 92000],
      borderColor: "#444",
      backgroundColor: "rgba(0,0,0,0.15)",
      pointRadius: 5,
      pointHoverRadius: 6,
      tension: 0.4,
    },
  ],
};

const valueGrowthOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    x: { ticks: { color: "#444" } },
    y: {
      ticks: { color: "#444" },
      beginAtZero: false,
    },
  },
};

// 📈 Sales vs Returns
const salesData = {
  labels: months,
  datasets: [
    {
      label: "Sales",
      data: [300, 320, 280, 250, 270, 300],
      borderColor: "#000",
      backgroundColor: "rgba(0,0,0,0.1)",
      tension: 0.3,
    },
    {
      label: "Returns",
      data: [10, 12, 9, 11, 8, 7],
      borderColor: "#888",
      backgroundColor: "rgba(136,136,136,0.2)",
      tension: 0.3,
    },
  ],
};

const salesOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
  },
  scales: {
    x: { ticks: { color: "#444" } },
    y: { ticks: { color: "#444" } },
  },
};

// 🏷️ Top Suppliers
const supplierData = {
  labels: [
    "FreshFarms",
    "DairyCo",
    "GlowCare",
    "CleanPro",
    "BakeSmart",
    "HydroPure",
  ],
  datasets: [
    {
      label: "Inventory Value (₹)",
      data: [40000, 21000, 14500, 9800, 6700, 5200],
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  ],
};

const supplierOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { ticks: { color: "#444" } },
    y: { ticks: { color: "#444" }, beginAtZero: true },
  },
};

export default function ReportsPage() {
  return (
    <div className="w-full px-0 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-12">Reports</h1>

      {/* First Row - Inventory & Value Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>📊 Inventory, Sales & Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={inventoryData} options={inventoryOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💰 Inventory Value (₹) Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={valueGrowthData} options={valueGrowthOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Sales/Returns + Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card>
          <CardHeader>
            <CardTitle>📈 Sales vs Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={salesData} options={salesOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏷️ Top Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={supplierData} options={supplierOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
