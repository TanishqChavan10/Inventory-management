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

import { useEffect, useState } from "react";
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

// Get dark mode status dynamically
const getChartTextColor = () =>
  typeof window !== "undefined" &&
  document.documentElement.classList.contains("dark")
    ? "#f4f4f5"
    : "#222";

const getGridColor = () =>
  typeof window !== "undefined" &&
  document.documentElement.classList.contains("dark")
    ? "rgba(255,255,255,0.07)"
    : "rgba(0,0,0,0.07)";

// Labels
const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

// Inventory Bar + Returns Line
const inventoryData = {
  labels: months,
  datasets: [
    {
      label: "Stock Level",
      data: [500, 475, 450, 430, 420, 400],
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      barPercentage: 0.4,
    },
    {
      label: "Sales",
      data: [300, 320, 280, 250, 270, 300],
      backgroundColor: "rgba(120, 120, 120, 0.6)",
      barPercentage: 0.4,
    },
    {
      label: "Returns",
      type: "line" as const,
      data: [10, 12, 9, 11, 8, 7],
      borderColor: "#ff5722",
      pointBackgroundColor: "#ff5722",
      backgroundColor: "#ff5722",
      tension: 0.3,
      borderWidth: 3,
      pointRadius: 5,
      yAxisID: "y1",
    },
  ],
};

const valueGrowthData = {
  labels: months,
  datasets: [
    {
      label: "Inventory Value (₹)",
      data: [100000, 98000, 96000, 94000, 93000, 92000],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      pointRadius: 5,
      pointHoverRadius: 6,
      tension: 0.4,
    },
  ],
};

const salesData = {
  labels: months,
  datasets: [
    {
      label: "Sales",
      data: [300, 320, 280, 250, 270, 300],
      borderColor: "#0f172a",
      backgroundColor: "rgba(15, 23, 42, 0.1)",
      tension: 0.3,
    },
    {
      label: "Returns",
      data: [10, 12, 9, 11, 8, 7],
      borderColor: "#f97316",
      backgroundColor: "rgba(249, 115, 22, 0.2)",
      tension: 0.3,
    },
  ],
};

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
      backgroundColor: "rgba(0,0,0,0.8)",
    },
  ],
};

export default function ReportsPage() {
  const [textColor, setTextColor] = useState("#222");
  const [gridColor, setGridColor] = useState("rgba(0,0,0,0.07)");

  useEffect(() => {
    const updateColors = () => {
      setTextColor(getChartTextColor());
      setGridColor(getGridColor());
    };
    updateColors();

    if (typeof window !== "undefined") {
      const observer = new MutationObserver(updateColors);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }
  }, []);

  // Reusable chart config generator
  const baseOptions = {
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: textColor },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="w-full px-4 md:px-8 py-10 bg-white dark:bg-black text-black dark:text-white transition-colors">
      <h1 className="text-3xl font-bold mb-12">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Inventory + Sales + Returns */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-md transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black dark:text-white">
              📊 Inventory, Sales & Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={inventoryData}
              options={{
                ...baseOptions,
                scales: {
                  ...baseOptions.scales,
                  y1: {
                    position: "right",
                    grid: { drawOnChartArea: false },
                    ticks: { color: "#ff5722" },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Inventory Value */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-md transition-colors">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black dark:text-white">
              💰 Inventory Value Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={valueGrowthData} options={baseOptions} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales vs Returns */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black dark:text-white">
              📈 Sales vs Returns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={salesData} options={baseOptions} />
          </CardContent>
        </Card>

        {/* Top Suppliers */}
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black dark:text-white">
              🏷️ Top Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={supplierData} options={baseOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
