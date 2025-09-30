'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import CategoryDashboard from '@/components/dashboard/CategoryDashboard';
import LowStockAlert from '@/components/dashboard/LowStockAlert';
import DashboardModal from '@/components/dashboard/DashboardModal';
import { statsData, lowStockItems } from '@/data/dashboardData';

export default function DashboardPage() {
  const [modal, setModal] = useState<null | {
    title: string;
    columns: string[];
    data: (string | number)[][];
  }>(null);

  return (
    <div className="px-32 py-8 min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening with your inventory today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} stat={stat} onClick={() => setModal(stat.details)} />
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryDashboard />
        <LowStockAlert items={lowStockItems} />
      </div>

      {/* Modal */}
      {modal && <DashboardModal modal={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
