// src/app/(landing)/page.tsx

import  Navbar  from "@/components/landing/Navbar";
import Image from "next/image";


export default function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 py-20 bg-gray-50">
        {/* Left Text Content */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight mb-6">
            Engagement <br /> Rate
          </h1>
          <p className="text-gray-600 mb-6 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget libero feugiat, faucibus libero id, scelerisque quam
          </p>
          <button className="bg-pink-500 text-white px-6 py-3 rounded-full text-sm hover:bg-pink-600 transition">
            Learn More
          </button>
        </div>

        {/* Right Image */}
        <div className="mb-10 md:mb-0">
          <Image
            src="/assets/illustration.png"
            alt="Dashboard Illustration"
            width={500}
            height={400}
            priority
          />
        </div>
      </section>
    </>
  );
}
