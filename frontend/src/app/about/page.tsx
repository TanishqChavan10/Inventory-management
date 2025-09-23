'use client';

import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  HowItWorks,
  TestimonialsSection,
  FinalCTA,
} from '@/components/about';

export default function HomePage() {
  return (
    <div className="w-full bg-white text-black dark:bg-black dark:text-white antialiased transition-colors">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorks />
      <TestimonialsSection />
      <FinalCTA />
    </div>
  );
}
