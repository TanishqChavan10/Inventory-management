import { Package, BarChart2, Truck } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    Icon: Package,
    title: 'Live Stock Tracking',
    desc: 'Know exactly what’s on your shelves and in your warehouse—updated every second.',
  },
  {
    Icon: BarChart2,
    title: 'Analytics That Drive Action',
    desc: 'Identify trends, forecast demand, and make smarter restocking decisions.',
  },
  {
    Icon: Truck,
    title: 'Supplier Hub',
    desc: 'Consolidate supplier info, manage purchase orders, and negotiate with confidence.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="container mx-auto px-6 mt-36 grid gap-10 md:grid-cols-3">
      {features.map((f, i) => (
        <FeatureCard key={i} {...f} />
      ))}
    </section>
  );
}
