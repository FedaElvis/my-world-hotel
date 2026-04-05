"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { motion } from 'framer-motion';
import { Users, Bed, BookOpen, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    activeBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [roomsRes, bookingsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rooms`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings`, config)
        ]);

        const totalRooms = roomsRes.data.length;
        const availableRooms = roomsRes.data.filter((r: any) => r.isAvailable).length;
        const activeBookings = bookingsRes.data.filter((b: any) => b.status === 'active').length;
        const totalRevenue = bookingsRes.data.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);

        setStats({ totalRooms, availableRooms, activeBookings, totalRevenue });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const statCards = [
    { label: 'Total Rooms', value: stats.totalRooms, icon: Bed, color: 'text-blue-500' },
    { label: 'Available Rooms', value: stats.availableRooms, icon: Users, color: 'text-green-500' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: BookOpen, color: 'text-[#C5A059]' },
    { label: 'Total Revenue', value: `GH₵${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 w-full md:ml-64 p-4 sm:p-6 md:p-12 overflow-x-hidden">
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Dashboard <span className="text-[#C5A059]">Overview</span></h1>
          <p className="text-gray-500">Real-time statistics of My World Hotel</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-gray-50 transition-colors group-hover:bg-[#C5A059]/10 ${stat.color}`}>
                     <Icon size={24} />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
