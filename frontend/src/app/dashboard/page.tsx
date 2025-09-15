"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import NewRecentActivity from "@/components/dashboard/RecentActivity";
import LowStockAlert from "@/components/dashboard/LowStockAlert";
import DashboardModal from "@/components/dashboard/DashboardModal";
import { statsData, recentActivity, lowStockItems } from "@/data/dashboardData";

export default function DashboardPage() {
  const [modal, setModal] = useState<null | { title: string; columns: string[]; data: (string | number)[][] }>(null);

  return (
    <div className="px-32 py-8 min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your inventory today.</p>
        </div>
        <Link href="/inventory">
          <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 mt-4 sm:mt-0">
            <Settings className="w-4 h-4 mr-2" />
            Manage Inventory
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard 
            key={index} 
            stat={stat} 
            onClick={() => setModal(stat.details)}
          />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NewRecentActivity activities={recentActivity} />
        <LowStockAlert items={lowStockItems} />
      </div>

      {/* Modal */}
      {modal && <DashboardModal modal={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
