'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="inline-block w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
            <span className="text-2xl font-bold text-gray-800 tracking-tight group-hover:text-indigo-600 transition">
              Inventory-Management
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#dashboard"
            className="text-gray-600 hover:text-indigo-600 transition duration-300"
          >
            Dashboard
          </a>
          <Link
            href="/about"
            className="text-gray-600 hover:text-indigo-600 transition duration-300"
          >
            About
          </Link>
        </div>
        <Link
          href="/login"
          className="hidden md:block bg-indigo-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg"
        >
          Login
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          id="mobile-menu-button"
          className="md:hidden text-gray-700 focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </nav>
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden px-6 pb-4`}>
        <a href="#dashboard" className="block py-2 text-gray-600 hover:text-indigo-600">
          Dashboard
        </a>
        <Link href="/about" className="block py-2 text-gray-600 hover:text-indigo-600">
          About
        </Link>
        <Link
          href="/login"
          className="block mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-center"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
