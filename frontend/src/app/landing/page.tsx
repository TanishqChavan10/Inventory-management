import Image from 'next/image';

export default function LandingPage() {
  return (
    // Hero Section
    <section className="relative bg-white py-24 md:py-40 fade-in-section">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Boost Your <span className="gradient-text">Engagement Rate</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Our modern inventory platform helps you understand your audience and drive meaningful interactions. Turn data into growth.
        </p>
        <div className="mt-20">
          <Image
            src="https://placehold.co/800x500/E0E7FF/4F46E5?text=Dashboard+Preview"
            alt="Dashboard Illustration"
            width={800}
            height={500}
            className="mx-auto rounded-xl shadow-2xl hero-image-glow"
            priority
          />
        </div>
      </div>
    </section>
  );
}

