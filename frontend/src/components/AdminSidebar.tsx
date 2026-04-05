"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Bed, BookOpen, LogOut, ChevronLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    const links = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Rooms', href: '/admin/rooms', icon: Bed },
        { name: 'View Bookings', href: '/admin/bookings', icon: BookOpen },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden bg-[#1A1A1A] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 gold-gradient rounded-xl"></div>
                   <h2 className="text-lg font-bold tracking-tighter uppercase">Admin</h2>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-white bg-white/10 rounded-lg">
                    <Menu size={20} />
                </button>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen w-64 bg-[#1A1A1A] text-white py-10 px-6 flex flex-col justify-between shadow-2xl z-50 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-2 text-white bg-white/10 rounded-lg">
                    <X size={20} />
                </button>

                <div>
                    <div className="flex items-center gap-3 mb-12">
                       <div className="w-10 h-10 gold-gradient rounded-xl"></div>
                       <h2 className="text-xl font-bold tracking-tighter uppercase">My World <span className="text-[#C5A059]">Admin</span></h2>
                    </div>

                    <nav className="space-y-4">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                                        isActive ? 'gold-gradient text-white shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-semibold">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="space-y-4">
                    <button 
                       onClick={handleLogout}
                       className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 text-sm hover:text-gray-300">
                        <ChevronLeft size={16} /> Back to Website
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
