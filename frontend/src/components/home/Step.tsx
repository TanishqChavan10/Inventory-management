"use client";

import { motion } from "framer-motion";

export default function Step({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <h4 className="flex items-center text-lg font-semibold mb-4">
        {icon}
        {title}
      </h4>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
        {children}
      </p>
    </motion.div>
  );
}
