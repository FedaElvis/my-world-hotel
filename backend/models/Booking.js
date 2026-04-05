const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    numberOfDays: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending', enum: ['pending', 'success', 'failed'] },
    checkInDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, default: 'active', enum: ['active', 'completed', 'expired'] },
    paystackRef: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
