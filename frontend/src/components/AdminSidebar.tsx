"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Bed, BookOpen, LogOut, ChevronLeft } from 'lucide-react';

const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

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
        <aside className="w-full md:w-64 h-auto md:h-screen bg-[#1A1A1A] text-white static md:fixed left-0 top-0 p-4 md:py-10 md:px-6 flex flex-col md:justify-between shadow-xl z-50">
            <div>
                <div className="flex items-center justify-between md:mb-12 mb-4">
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 md:w-10 md:h-10 gold-gradient rounded-xl"></div>
                       <h2 className="text-lg md:text-xl font-bold tracking-tighter uppercase whitespace-nowrap">My World <span className="text-[#C5A059]">Admin</span></h2>
                   </div>
                   
                   <div className="md:hidden flex space-x-2">
                       <Link href="/" className="p-2 text-gray-400 bg-white/5 rounded-lg">
                           <ChevronLeft size={18} />
                       </Link>
                       <button onClick={handleLogout} className="p-2 text-red-400 bg-red-500/10 rounded-lg">
                           <LogOut size={18} />
                       </button>
                   </div>
                </div>

                <nav className="flex flex-row md:flex-col gap-2 md:space-y-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl transition-all ${
                                    isActive ? 'gold-gradient text-white shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <Icon size={18} className="md:w-5 md:h-5" />
                                <span className="font-semibold text-sm md:text-base">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="hidden md:flex flex-col space-y-4">
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
    );
};

export default AdminSidebar;
