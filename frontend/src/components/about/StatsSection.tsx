import StatItem from './StatItem';

const stats = [
  { value: '99.9%', label: 'Stock Accuracy' },
  { value: '24/7', label: 'System Uptime' },
  { value: '45%', label: 'Avg Waste Reduced' },
  { value: '1200+', label: 'Active Retailers' },
];

export default function StatsSection() {
  return (
    <section className="mt-36 py-20">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 text-center gap-16">
        {stats.map((s, i) => (
          <StatItem key={i} {...s} />
        ))}
      </div>
    </section>
  );
}
