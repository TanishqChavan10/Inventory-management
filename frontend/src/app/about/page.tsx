"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  BarChart2,
  Truck,
  MoveRight,
  Activity,
  ShieldCheck,
  TrendingUp,
  Sparkle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const testimonials = [
    {
      quote:
        "InventoryFlow changed how we operate. Real-time insights and automated restocks let us focus on growing sales, not managing shelves.",
      author: "Aarav S., Store Manager – SuperMart",
    },
    {
      quote:
        "Switching was painless, and our stock accuracy has never been higher. The onboarding team was fantastic.",
      author: "Priya R., Inventory Director – DailyMart",
    },
    {
      quote:
        "We cut waste by 45% in three months. The dashboard is clean, useful, and incredibly intuitive for our staff.",
      author: "Karan J., Operations – LocalBasket",
    },
  ];

  return (
    <div className="w-full bg-white text-black dark:bg-black dark:text-white antialiased transition-colors">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-28 md:py-40 text-center max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest"
        >
          Smart Stock Management
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight text-black dark:text-white"
        >
          Take Full Control of Your Inventory
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed"
        >
          Reduce waste, optimize purchasing, and supercharge your margins with real-time visibility and AI-driven insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="text-lg py-4 px-10 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] transition-all"
            >
              Get Started <MoveRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-6 mt-36 grid gap-10 md:grid-cols-3">
        <FeatureCard
          Icon={Package}
          title="Live Stock Tracking"
          desc="Know exactly what’s on your shelves and in your warehouse—updated every second."
        />
        <FeatureCard
          Icon={BarChart2}
          title="Analytics That Drive Action"
          desc="Identify trends, forecast demand, and make smarter restocking decisions."
        />
        <FeatureCard
          Icon={Truck}
          title="Supplier Hub"
          desc="Consolidate supplier info, manage purchase orders, and negotiate with confidence."
        />
      </section>

      {/* Stats Section */}
      <section className="mt-36 bg-white dark:bg-black py-20">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 text-center gap-16">
          <StatItem value="99.9%" label="Stock Accuracy" />
          <StatItem value="24/7" label="System Uptime" />
          <StatItem value="45%" label="Avg Waste Reduced" />
          <StatItem value="1200+" label="Active Retailers" />
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 mt-36 max-w-5xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-14 text-black dark:text-white">How It Works</h2>
        <div className="grid gap-12 md:grid-cols-3 text-left">
          <Step
            icon={<Activity className="w-6 h-6 mr-3 text-indigo-500" />}
            title="Monitor"
          >
            Instant insights into stock levels, expiry dates, and sales velocity.
          </Step>
          <Step
            icon={<TrendingUp className="w-6 h-6 mr-3 text-emerald-500" />}
            title="Analyze"
          >
            Turn raw data into actionable plans with AI-assisted forecasting.
          </Step>
          <Step
            icon={<ShieldCheck className="w-6 h-6 mr-3 text-amber-500" />}
            title="Optimize"
          >
            Automated reorders, vendor reminders, and shrinkage control—hands‑free.
          </Step>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-6 mt-36">
        <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center text-black dark:text-white">Our Customers Speak</h2>
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 rounded-2xl p-10 shadow-sm"
            >
              <Sparkle className="w-6 h-6 text-indigo-500 mb-6" />
              <p className="text-lg text-neutral-800 dark:text-neutral-200 mb-8 leading-relaxed">
                “{t.quote}”
              </p>
              <div className="text-sm uppercase text-neutral-500 dark:text-neutral-400 font-medium">
                {t.author}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-40 bg-white dark:bg-black py-20 text-center border-t border-neutral-200 dark:border-neutral-800">
        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-black dark:text-white">
          Ready to transform inventory management?
        </h3>
        <Link href="/login">
          <Button
            size="lg"
            className="text-lg py-4 px-10 rounded-full bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] transition-all"
          >
            Start Now <MoveRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

// Components
function FeatureCard({
  Icon,
  title,
  desc,
}: {
  Icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 p-10 rounded-2xl shadow-sm hover:shadow-lg h-full flex flex-col">
        <CardHeader>
          <div className="p-5 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
            <Icon className="h-8 w-8 text-neutral-800 dark:text-neutral-100" />
          </div>
          <CardTitle className="mt-6 text-2xl text-black dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed flex-grow">
          {desc}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-5xl md:text-6xl font-extrabold text-black dark:text-white">
        {value}
      </div>
      <div className="mt-3 text-base text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
    </div>
  );
}

function Step({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="p-6 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800">
      <h4 className="flex items-center text-lg font-semibold mb-4 text-black dark:text-white">
        {icon}
        {title}
      </h4>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
        {children}
      </p>
    </motion.div>
  );
}
