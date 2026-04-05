"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCountdown } from '@/hooks/useCountdown';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Calendar, User, Phone, Mail, Hash } from 'lucide-react';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings/${id}`);
        setBooking(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const timeLeft = useCountdown(booking?.expiryDate);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-[#C5A059] border-gray-200 rounded-full animate-spin"></div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Booking not found</h1>
    </div>
  );

  return (
    <main className="min-h-screen pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-10 border border-t-8 border-t-green-500"
        >
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500">Thank you for choosing My World Hotel. Your stay is secured.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl"><Hash className="w-6 h-6 text-[#C5A059]" /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Booking ID</p>
                        <p className="font-bold text-lg">{booking.bookingId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl"><User className="w-6 h-6 text-[#C5A059]" /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Customer</p>
                        <p className="font-bold text-lg">{booking.customerName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl"><Mail className="w-6 h-6 text-[#C5A059]" /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                        <p className="font-bold text-lg">{booking.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl"><Phone className="w-6 h-6 text-[#C5A059]" /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                        <p className="font-bold text-lg">{booking.phone}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl"><Calendar className="w-6 h-6 text-[#C5A059]" /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Check-in</p>
                        <p className="font-bold text-lg">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl"><Calendar className="w-6 h-6 text-[#C5A059]" /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Expiry</p>
                        <p className="font-bold text-lg">{new Date(booking.expiryDate).toLocaleDateString()}</p>
                    </div>
                </div>
                
                {/* Countdown Timer */}
                <div className={`mt-8 p-6 rounded-2xl border-2 ${timeLeft.isExpired ? 'bg-red-50 border-red-200' : 'bg-[#FDFBF7] border-[#C5A059]/20'}`}>
                    <div className="flex items-center gap-2 mb-4 text-[#C5A059] font-bold uppercase text-xs tracking-widest">
                        <Clock className="w-4 h-4" /> {timeLeft.isExpired ? 'Booking Expired' : 'Time Remaining'}
                    </div>
                    {timeLeft.isExpired ? (
                        <p className="text-2xl font-black text-red-500">EXPIRED</p>
                    ) : (
                        <div className="flex gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-black">{timeLeft.days}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Days</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black">:</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black">{timeLeft.hours}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Hrs</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black">:</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black">{timeLeft.minutes}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Min</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black">:</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-[#C5A059]">{timeLeft.seconds}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Sec</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button 
                onClick={() => window.print()}
                className="btn-secondary flex items-center gap-2 mx-auto"
            >
                Print Receipt
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
