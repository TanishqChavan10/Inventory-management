import { Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import Step from './Step';

const steps = [
  {
    title: 'Monitor',
    icon: <Activity className="w-6 h-6 mr-3 text-indigo-500" />,
    desc: 'Instant insights into stock levels, expiry dates, and sales velocity.',
  },
  {
    title: 'Analyze',
    icon: <TrendingUp className="w-6 h-6 mr-3 text-emerald-500" />,
    desc: 'Turn raw data into actionable plans with AI-assisted forecasting.',
  },
  {
    title: 'Optimize',
    icon: <ShieldCheck className="w-6 h-6 mr-3 text-amber-500" />,
    desc: 'Automated reorders, vendor reminders, and shrinkage control—hands-free.',
  },
];

export default function HowItWorks() {
  return (
    <section className="container mx-auto px-6 mt-36 max-w-5xl text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-14">How It Works</h2>
      <div className="grid gap-12 md:grid-cols-3 text-left">
        {steps.map((s, i) => (
          <Step key={i} title={s.title} icon={s.icon}>
            {s.desc}
          </Step>
        ))}
      </div>
    </section>
  );
}
