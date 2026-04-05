const Booking = require('../models/Booking');
const Room = require('../models/Room');
const axios = require('axios');
const crypto = require('crypto');

// Helper to generate a unique booking ID
const generateBookingId = () => {
    return 'MWH-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

exports.createBooking = async (req, res) => {
    try {
        const { customerName, email, phone, roomId, numberOfDays, totalPrice, checkInDate, paystackRef } = req.body;

        // Verify Paystack payment
        const paystackHeader = {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        };
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${paystackRef}`, { headers: paystackHeader });

        if (response.data.data.status !== 'success' || response.data.data.amount / 100 !== totalPrice) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Calculate expiry date
        const checkIn = new Date(checkInDate);
        const expiryDate = new Date(checkIn.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));

        const booking = new Booking({
            bookingId: generateBookingId(),
            customerName,
            email,
            phone,
            roomId,
            numberOfDays,
            totalPrice,
            paymentStatus: 'success',
            checkInDate: checkIn,
            expiryDate,
            paystackRef
        });

        await booking.save();

        // Mark room as occupied if needed (though user only said display available rooms in grid)
        // For simplicity, we can keep availability manual or automatic. Let's make it automatic.
        await Room.findByIdAndUpdate(roomId, { isAvailable: false });

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        console.error('Booking Error:', error.response?.data || error.message);
        res.status(400).json({ message: 'Error processing booking', error: error.response?.data || error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
  try {
      const booking = await Booking.findOne({ bookingId: req.params.id }).populate('roomId');
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      res.status(200).json(booking);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};
