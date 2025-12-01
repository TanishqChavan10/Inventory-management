'use client';

import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-20 text-center max-w-5xl">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-base font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest"
      >
        Smart Stock Management
      </motion.p>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight"
      >
        Take Full Control of Your Inventory
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8 text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed"
      >
        Reduce waste, optimize purchasing, and supercharge your margins with real-time visibility
        and AI-driven insights.
      </motion.p>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-12">
        <Link href="/auth/sign-in">
          <Button
            size="lg"
            className="text-lg py-4 px-10 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] transition-all"
          >
            Get Started <MoveRight className="ml-2 h-6 w-6" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
