const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Public route: Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
});

// Admin route: Add new room
router.post('/', auth, async (req, res) => {
    try {
        const { roomNumber, type, price, images, description } = req.body;
        const newRoom = new Room({ roomNumber, type, price, images, description });
        await newRoom.save();
        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
        res.status(400).json({ message: 'Error creating room', error: error.message });
    }
});

// Admin route: Update room details
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRoom) return res.status(404).json({ message: 'Room not found' });
        res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        res.status(400).json({ message: 'Error updating room', error: error.message });
    }
});

// Admin route: Toggle room availability
router.patch('/:id/availability', auth, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        room.isAvailable = !room.isAvailable;
        await room.save();
        res.status(200).json({ message: 'Room availability toggled', room });
    } catch (error) {
        res.status(400).json({ message: 'Error toggling availability', error: error.message });
    }
});

// Admin route: Delete room
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: 'Room not found' });
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
});

module.exports = router;
