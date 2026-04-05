const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Create a booking (Public after payment)
router.post('/', bookingController.createBooking);

// Get booking by ID (For confirmation page)
router.get('/:id', bookingController.getBookingById);

// Get all bookings (Admin only)
router.get('/', auth, bookingController.getAllBookings);

module.exports = router;
