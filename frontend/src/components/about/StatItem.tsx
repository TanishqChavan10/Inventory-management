export default function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-5xl md:text-6xl font-extrabold">{value}</div>
      <div className="mt-3 text-base text-neutral-500 dark:text-neutral-400">{label}</div>
    </div>
  );
}
