"use client";
import { motion } from 'framer-motion';

interface RoomProps {
    room: {
        _id: string;
        roomNumber: string;
        type: string;
        price: number;
        isAvailable: boolean;
        images: string[];
        description: string;
    };
    onBookNow: (room: any) => void;
}

const RoomCard = ({ room, onBookNow }: RoomProps) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl group transition-all"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={room.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {room.isAvailable ? (
                        <span className="text-green-600">Available</span>
                    ) : (
                        <span className="text-red-500">Occupied</span>
                    )}
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold uppercase">{room.type}</h3>
                    <p className="text-[#C5A059] font-bold text-lg">GH₵{room.price} / night</p>
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{room.description || 'Experience ultimate luxury in our suite rooms, equipped with modern amenities and a stunning view.'}</p>
                <button
                    disabled={!room.isAvailable}
                    onClick={() => onBookNow(room)}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                        room.isAvailable
                        ? 'gold-gradient text-white hover:scale-105 active:scale-95 shadow-xl'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {room.isAvailable ? 'Book Now' : 'Occupied'}
                </button>
            </div>
        </motion.div>
    );
};

export default RoomCard;
