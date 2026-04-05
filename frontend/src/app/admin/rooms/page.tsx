"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // New room state
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'Single',
    price: '',
    description: '',
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rooms`);
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      let imageUrls: string[] = [];

      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach(file => {
          formData.append('images', file);
        });

        const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrls = uploadRes.data.urls;
      }

      const roomData = {
        ...newRoom,
        price: Number(newRoom.price),
        images: imageUrls
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rooms`, roomData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Room added successfully');
      setIsAdding(false);
      setNewRoom({ roomNumber: '', type: 'Single', price: '', description: '' });
      setSelectedImages([]);
      fetchRooms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rooms/${id}/availability`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Availability changed');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to change availability');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Room deleted');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex">
      <Toaster />
      <AdminSidebar />
      <div className="flex-1 ml-64 p-12 overflow-y-auto">
        <div className="flex justify-between items-end mb-12">
          <header>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Manage <span className="text-[#C5A059]">Rooms</span></h1>
            <p className="text-gray-500">Add, update, or remove rooms from the inventory</p>
          </header>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#C5A059] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#A6864A] transition-colors"
          >
            {isAdding ? 'Cancel' : <><Plus size={20} /> Add New Room</>}
          </button>
        </div>

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl mb-12 border border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-6">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Room Number</label>
                  <input required type="text" value={newRoom.roomNumber} onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#C5A059] outline-none" placeholder="e.g. 101" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Type</label>
                  <select value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#C5A059] outline-none">
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Price per Night (GH₵)</label>
                  <input required type="number" min="0" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#C5A059] outline-none" placeholder="e.g. 150" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Upload Images</label>
                <input required type="file" multiple accept="image/*" onChange={e => {
                  if (e.target.files) setSelectedImages(Array.from(e.target.files));
                }} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#C5A059] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                <textarea required rows={3} value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#C5A059] outline-none" placeholder="Describe the room..." />
              </div>
              <button type="submit" className="px-8 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-colors">
                Save Room
              </button>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Room</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Type</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Price</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading rooms...</td></tr>
              ) : rooms.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No rooms found. Add one above.</td></tr>
              ) : rooms.map((room: any) => (
                <tr key={room._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold">Room {room.roomNumber}</td>
                  <td className="px-6 py-4 text-gray-500">{room.type}</td>
                  <td className="px-6 py-4 font-bold text-[#C5A059]">GH₵{room.price}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleAvailability(room._id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${room.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                    >
                      {room.isAvailable ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                      {room.isAvailable ? 'Available' : 'Occupied'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(room._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
