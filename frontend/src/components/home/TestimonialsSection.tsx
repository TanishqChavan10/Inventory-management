"use client";

import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";

const testimonials = [
  {
    quote:
      "InventoryFlow changed how we operate. Real-time insights and automated restocks let us focus on growing sales, not managing shelves.",
    author: "Aarav S., Store Manager – SuperMart"
  },
  {
    quote:
      "Switching was painless, and our stock accuracy has never been higher. The onboarding team was fantastic.",
    author: "Priya R., Inventory Director – DailyMart"
  },
  {
    quote:
      "We cut waste by 45% in three months. The dashboard is clean, useful, and incredibly intuitive for our staff.",
    author: "Karan J., Operations – LocalBasket"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="container mx-auto px-6 mt-36">
      <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center">Our Customers Speak</h2>
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
  );
}
