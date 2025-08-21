"use client";

import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import SupplierChat from "@/components/dashboard/SupplierChat";
import DashboardModal from "@/components/dashboard/DashboardModal";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { stats, statDetails, suppliers, activity } from "@/data/dashboardData";

export default function DashboardPage() {
  const [modal, setModal] = useState<null | { title: string; columns: string[]; data: any[][] }>(null);

  return (
    <div className="px-6 py-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-neutral-950 dark:to-neutral-900">
      <header className="flex flex-col lg:flex-row justify-between mb-10">
        <h1 className="text-4xl font-extrabold">Dashboard</h1>
        <p className="text-gray-500">Inventory overview & recent activity</p>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            Icon={stat.icon}
            onClick={() => setModal(statDetails[stat.label] || null)}
          />
        ))}
      </section>

      {/* Chat + Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SupplierChat suppliers={suppliers} />
        <RecentActivity activity={activity} />
      </section>

      {modal && <DashboardModal modal={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
