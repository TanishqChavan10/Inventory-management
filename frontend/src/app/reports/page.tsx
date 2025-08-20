"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
// Removed unused Button import

const salesData = {
  daily: [
    { date: "Mon", sales: 4000 },
    { date: "Tue", sales: 3000 },
    { date: "Wed", sales: 5000 },
    { date: "Thu", sales: 4000 },
    { date: "Fri", sales: 6000 },
    { date: "Sat", sales: 7000 },
    { date: "Sun", sales: 5000 },
  ],
  weekly: [
    { week: "W1", sales: 25000 },
    { week: "W2", sales: 22000 },
    { week: "W3", sales: 27000 },
    { week: "W4", sales: 30000 },
  ],
  monthly: [
    { month: "Jan", sales: 100000 },
    { month: "Feb", sales: 90000 },
    { month: "Mar", sales: 110000 },
    { month: "Apr", sales: 120000 },
  ],
};

const stockData = [
  { category: "Grocery", stock: 1200 },
  { category: "Personal Care", stock: 800 },
  { category: "Bakery", stock: 400 },
  { category: "Dairy", stock: 600 },
  { category: "Beverages", stock: 1000 },
  { category: "Household", stock: 700 },
];

const revenueData = {
  monthly: [
    { month: "Jan", revenue: 90000 },
    { month: "Feb", revenue: 85000 },
    { month: "Mar", revenue: 92000 },
    { month: "Apr", revenue: 98000 },
  ],
  quarterly: [
    { quarter: "Q1", revenue: 270000 },
    { quarter: "Q2", revenue: 300000 },
    { quarter: "Q3", revenue: 320000 },
    { quarter: "Q4", revenue: 350000 },
  ],
};

const topProductsData = {
  weekly: [
    { product: "Sunflower Oil", sales: 400 },
    { product: "Milk", sales: 350 },
    { product: "Toothpaste", sales: 300 },
    { product: "Bread", sales: 250 },
  ],
  monthly: [
    { product: "Milk", sales: 1600 },
    { product: "Sunflower Oil", sales: 1400 },
    { product: "Cold Drink", sales: 1300 },
    { product: "Shampoo", sales: 1100 },
  ],
};

export default function ReportsPage() {
  const [salesTimeline, setSalesTimeline] = useState("weekly");
  const [stockCategory, setStockCategory] = useState("All");
  const [revenueTimeline, setRevenueTimeline] = useState("monthly");
  const [topProductsTimeline, setTopProductsTimeline] = useState("weekly");

  const categories = ["All", ...stockData.map((d) => d.category)];
  const filteredStockData =
    stockCategory === "All"
      ? stockData
      : stockData.filter((d) => d.category === stockCategory);

  return (
    <div className="w-full min-h-screen px-6 py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-neutral-900 text-black dark:text-white transition-colors">
      <h1 className="text-4xl font-extrabold mb-8">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sales Over Time */}
        <Card title="Sales Over Time" filter={
          <FilterSelect
            value={salesTimeline}
            onChange={setSalesTimeline}
            options={["daily", "weekly", "monthly"]}
            labelMap={{ daily: "Daily", weekly: "Weekly", monthly: "Monthly" }}
          />
        }>
          {(animate) => (
            <ResponsiveContainer width="100%" height={250} className={animate ? "fade-slide" : ""}>
              <LineChart
                data={salesData[salesTimeline]}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis
                  dataKey={
                    salesTimeline === "daily"
                      ? "date"
                      : salesTimeline === "weekly"
                      ? "week"
                      : "month"
                  }
                  stroke="#8884d8"
                />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Stock Levels by Category */}
        <Card title="Stock Levels by Category" filter={
          <FilterSelect
            value={stockCategory}
            onChange={setStockCategory}
            options={categories}
          />
        }>
          {(animate) => (
            <ResponsiveContainer width="100%" height={250} className={animate ? "fade-slide" : ""}>
              <BarChart
                data={filteredStockData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis dataKey="category" stroke="#82ca9d" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Bar dataKey="stock" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Revenue Over Time */}
        <Card title="Revenue Over Time" filter={
          <FilterSelect
            value={revenueTimeline}
            onChange={setRevenueTimeline}
            options={["monthly", "quarterly"]}
            labelMap={{ monthly: "Monthly", quarterly: "Quarterly" }}
          />
        }>
          {(animate) => (
            <ResponsiveContainer width="100%" height={250} className={animate ? "fade-slide" : ""}>
              <BarChart
                data={revenueData[revenueTimeline]}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis
                  dataKey={revenueTimeline === "monthly" ? "month" : "quarter"}
                  stroke="#ffc658"
                />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Bar dataKey="revenue" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top Selling Products */}
        <Card title="Top Selling Products" filter={
          <FilterSelect
            value={topProductsTimeline}
            onChange={setTopProductsTimeline}
            options={["weekly", "monthly"]}
            labelMap={{ weekly: "Weekly", monthly: "Monthly" }}
          />
        }>
          {(animate) => (
            <ResponsiveContainer width="100%" height={250} className={animate ? "fade-slide" : ""}>
              <BarChart
                data={topProductsData[topProductsTimeline]}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                layout="vertical"
              >
                <XAxis type="number" />
                <YAxis
                  dataKey="product"
                  type="category"
                  stroke="#8884d8"
                  width={100}
                />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .fade-slide {
          animation: fadeSlideIn 0.5s ease forwards;
          opacity: 0;
          transform: translateY(10px);
        }
        @keyframes fadeSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function Card({
  title,
  children,
  filter,
}: {
  title: string;
  children: (animate: boolean) => React.ReactNode;
  filter: React.ReactNode;
}) {
  // Animate chart when filter changes
  const [animate, setAnimate] = useState(false);

  // Trigger animation on mount and filter change
  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timeout);
  }, [filter]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 w-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <div>{filter}</div>
      </div>
      {children(animate)}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  labelMap,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  labelMap?: Record<string, string>;
}) {
  return (
    <Select value={value} onValueChange={onChange} className="w-48">
      <SelectTrigger className="bg-white dark:bg-neutral-900 border dark:border-neutral-700 text-black dark:text-white shadow-sm rounded-lg">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {labelMap ? labelMap[opt] ?? opt : opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
