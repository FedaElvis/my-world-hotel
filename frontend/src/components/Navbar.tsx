"use client";
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 glass-morphism border-b border-white/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#C5A059] tracking-widest uppercase">
          My World <span className="text-[#1A1A1A]">Hotel</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-medium">
          <Link href="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
          <Link href="/#rooms" className="hover:text-[#C5A059] transition-colors">Rooms</Link>
          <Link href="/admin/login" className="px-4 py-2 bg-[#C5A059] text-white rounded-full hover:bg-[#A6864A] transition-all">AdminPortal</Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#1A1A1A]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden flex flex-col gap-4 mt-4 px-6 pb-6"
        >
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-[#C5A059]">Home</Link>
          <Link href="/#rooms" onClick={() => setIsOpen(false)} className="hover:text-[#C5A059]">Rooms</Link>
          <Link href="/admin/login" onClick={() => setIsOpen(false)} className="text-[#C5A059] font-bold">Admin Portal</Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
