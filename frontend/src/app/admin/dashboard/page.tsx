"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '@/components/AdminSidebar';
import { motion } from 'framer-motion';
import { Users, Bed, BookOpen, TrendingUp, ArrowUpRight } from 'lucide-react';

function getRevenue(bookings: any[], from: Date, to: Date) {
  return bookings
    .filter((b: any) => {
      const created = new Date(b.createdAt || b.checkInDate);
      return created >= from && created <= to;
    })
    .reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalRooms: 0, availableRooms: 0, activeBookings: 0, totalRevenue: 0 });
  const [revenueRows, setRevenueRows] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { window.location.href = '/admin/login'; return; }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [roomsRes, bookingsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rooms`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings`, config)
        ]);

        const allBookings = bookingsRes.data;
        const now = new Date();

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(todayStart.getDate() - 1);
        const weekStart = new Date(todayStart); weekStart.setDate(todayStart.getDate() - 7);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const totalRev = allBookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0);

        setRevenueRows([
          {
            period: 'Today',
            revenue: getRevenue(allBookings, todayStart, now),
            bookings: allBookings.filter((b: any) => new Date(b.createdAt || b.checkInDate) >= todayStart).length,
          },
          {
            period: 'Yesterday',
            revenue: getRevenue(allBookings, yesterdayStart, todayStart),
            bookings: allBookings.filter((b: any) => { const d = new Date(b.createdAt || b.checkInDate); return d >= yesterdayStart && d < todayStart; }).length,
          },
          {
            period: 'This Week',
            revenue: getRevenue(allBookings, weekStart, now),
            bookings: allBookings.filter((b: any) => new Date(b.createdAt || b.checkInDate) >= weekStart).length,
          },
          {
            period: 'This Month',
            revenue: getRevenue(allBookings, monthStart, now),
            bookings: allBookings.filter((b: any) => new Date(b.createdAt || b.checkInDate) >= monthStart).length,
          },
          {
            period: 'Last Month',
            revenue: getRevenue(allBookings, lastMonthStart, lastMonthEnd),
            bookings: allBookings.filter((b: any) => { const d = new Date(b.createdAt || b.checkInDate); return d >= lastMonthStart && d <= lastMonthEnd; }).length,
          },
          {
            period: 'All Time',
            revenue: totalRev,
            bookings: allBookings.length,
          },
        ]);

        setRecentBookings([...allBookings].reverse().slice(0, 5));
        setStats({
          totalRooms: roomsRes.data.length,
          availableRooms: roomsRes.data.filter((r: any) => r.isAvailable).length,
          activeBookings: allBookings.filter((b: any) => b.status === 'active').length,
          totalRevenue: totalRev,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Rooms', value: stats.totalRooms, icon: Bed, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Available', value: stats.availableRooms, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: BookOpen, color: 'text-[#C5A059]', bg: 'bg-amber-50' },
    { label: 'Total Revenue', value: `GH₵${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 min-w-0 md:ml-64 p-4 sm:p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Dashboard <span className="text-[#C5A059]">Overview</span></h1>
          <p className="text-gray-400 text-sm">Real-time statistics of My World Hotel</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-t-[#C5A059] border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {statCards.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                    <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Revenue Breakdown Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight">Revenue Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[480px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Period</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Bookings</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {revenueRows.map((row) => {
                      const share = stats.totalRevenue > 0 ? Math.round((row.revenue / stats.totalRevenue) * 100) : 0;
                      const isAllTime = row.period === 'All Time';
                      return (
                        <tr key={row.period} className={`hover:bg-gray-50 transition-colors ${isAllTime ? 'bg-amber-50/40' : ''}`}>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${isAllTime ? 'text-[#C5A059]' : 'text-gray-800'}`}>{row.period}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full text-xs font-bold text-gray-600">
                              <BookOpen size={11} /> {row.bookings}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-black text-lg ${isAllTime ? 'text-[#C5A059]' : ''}`}>
                              GH₵{row.revenue.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-20 bg-gray-100 rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-[#C5A059]" style={{ width: `${isAllTime ? 100 : share}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-gray-400 w-8 text-right">{isAllTime ? 100 : share}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Recent Bookings */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen size={16} className="text-blue-500" />
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-tight">Recent Bookings</h2>
                </div>
                <a href="/admin/bookings" className="text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:underline">
                  View All <ArrowUpRight size={13} />
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[480px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Room</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBookings.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No bookings yet.</td></tr>
                    ) : recentBookings.map((b: any) => (
                      <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold">{b.customerName}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {b.roomId ? `Room ${b.roomId.roomNumber}` : <span className="text-red-400">Deleted</span>}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#C5A059]">GH₵{b.totalPrice}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">Paid</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  );
}
