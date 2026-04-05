"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  room: any;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ room, isOpen, onClose }: BookingModalProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    numberOfDays: 1,
    checkInDate: new Date().toISOString().split('T')[0]
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300); // Reset timer when opened
      return;
    }
    
    if (timeLeft <= 0) {
      toast.error('Booking session expired');
      onClose();
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isOpen, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalPrice = room.price * formData.numberOfDays;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email,
    amount: totalPrice * 100, // Paystack works in pesewas
    currency: 'GHS',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_public_key',
  };

  const initializePayment = usePaystackPayment(config);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSuccess = async (reference: any) => {
    setIsProcessing(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings`, {
        ...formData,
        roomId: room._id,
        totalPrice,
        paystackRef: reference.reference
      });

      if (response.status === 201) {
        toast.success('Booking Successful!');
        router.push(`/booking-confirmation/${response.data.booking.bookingId}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const onClosePayment = () => {
    toast.error('Payment cancelled');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.email || !formData.phone) {
      return toast.error('Please fill all fields');
    }
    initializePayment({ onSuccess, onClose: onClosePayment });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <button onClick={onClose} className="text-gray-400 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 uppercase tracking-tighter">Book {room.type}</h2>
                <p className="text-gray-500">Complete the details below to secure your stay.</p>
              </div>
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold border border-red-100 flex flex-col items-end shadow-sm">
                <span className="text-xs uppercase tracking-widest text-red-400 mb-1">Time Left</span>
                <span className="text-xl tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="+234..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Days</label>
                  <input
                    type="number"
                    name="numberOfDays"
                    min="1"
                    value={formData.numberOfDays}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#C5A059]/20 mt-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">Price per night:</span>
                    <span className="font-bold">GH₵{room.price}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 pt-4">
                    <span>Total Amount:</span>
                    <span className="text-[#C5A059]">GH₵{totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 text-white btn-primary rounded-xl font-bold shadow-xl flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : `Pay & Book Now (GH₵${totalPrice})`}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
