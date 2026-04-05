"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import dynamic from 'next/dynamic';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [priceSort, setPriceSort] = useState('None');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rooms`);
        setRooms(response.data);
        setFilteredRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    let result = [...rooms];
    if (typeFilter !== 'All') {
      result = result.filter(room => room.type === typeFilter);
    }
    if (priceSort === 'LowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'HighToLow') {
      result.sort((a, b) => b.price - a.price);
    }
    setFilteredRooms(result);
  }, [typeFilter, priceSort, rooms]);

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Toaster position="top-right" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105 brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter"
          >
            My World <span className="text-[#C5A059]">Hotel</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light"
          >
            A sanctuary of sophistication and timeless luxury. Experience the pinnacle of hospitality where your world comes first.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a href="#rooms" className="px-10 py-5 bg-[#C5A059] text-white rounded-full text-lg font-bold hover:bg-[#A6864A] transition-all shadow-2xl inline-block">
              Explore Our Rooms
            </a>
          </motion.div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Our <span className="text-[#C5A059]">Rooms</span></h2>
              <p className="text-gray-500 max-w-md">Discover the perfect room for your stay. From cozy singles to opulent presidential suites.</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059] appearance-none cursor-pointer bg-white"
              >
                <option value="All">All Types</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
              
              <select 
                value={priceSort} 
                onChange={(e) => setPriceSort(e.target.value)}
                className="px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059] appearance-none cursor-pointer bg-white"
              >
                <option value="None">Sort by Price</option>
                <option value="LowToHigh">Price: Low to High</option>
                <option value="HighToLow">Price: High to Low</option>
              </select>
            </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-24">
                <div className="w-16 h-16 border-4 border-t-[#C5A059] border-gray-200 rounded-full animate-spin"></div>
            </div>
        ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredRooms.map((room) => (
                <RoomCard key={room._id} room={room} onBookNow={handleBookNow} />
            ))}
            </div>
        ) : (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-2xl text-gray-400 font-bold">No rooms found matching your criteria.</p>
            </div>
        )}
      </section>

      <Footer />

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
