'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function FeatureCard({
  Icon,
  title,
  desc,
}: {
  Icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card className="p-10 rounded-2xl shadow-sm hover:shadow-lg h-full flex flex-col border border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <div className="p-5 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className="mt-6 text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed flex-grow">
          {desc}
        </CardContent>
      </Card>
    </motion.div>
  );
}
