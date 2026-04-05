const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['Single', 'Double', 'Deluxe', 'Suite'] },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    images: [{ type: String }], // Array of URLs
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
