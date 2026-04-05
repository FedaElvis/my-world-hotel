"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { motion } from 'framer-motion';

export default function ViewBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Toaster />
      <AdminSidebar />
      <div className="flex-1 min-w-0 md:ml-64 p-4 sm:p-6 md:p-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">View <span className="text-[#C5A059]">Bookings</span></h1>
          <p className="text-gray-500">Monitor and manage all hotel reservations</p>
        </header>

        <motion.div 

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-gray-200">ID</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-gray-200">Customer</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-gray-200">Contact</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-gray-200">Room Info</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-gray-200">Dates</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-gray-200">Amount</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs border-b border-gray-200 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading bookings...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">No bookings yet.</td></tr>
                ) : bookings.map((booking: any) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{booking.bookingId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{booking.customerName}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-gray-600">{booking.email}</p>
                      <p className="text-gray-500">{booking.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                       {booking.roomId ? (
                          <>
                            <p className="font-bold">Room {booking.roomId.roomNumber}</p>
                            <p className="text-gray-500 text-xs">{booking.roomId.type}</p>
                          </>
                       ) : (
                          <span className="text-red-400">Room Deleted</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>In: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                      <p>Out: {new Date(booking.expiryDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 mt-1">{booking.numberOfDays} night(s)</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#C5A059]">
                      GH₵{booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
