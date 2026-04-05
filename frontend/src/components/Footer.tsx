const Footer = () => {
    return (
        <footer className="bg-[#1A1A1A] text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h3 className="text-2xl font-bold text-[#C5A059] mb-4">MY WORLD HOTEL</h3>
                    <p className="text-gray-400">Experience luxury and comfort in the heart of the world. Your satisfaction is our priority.</p>
                </div>
                <div>
                    <h4 className="text-xl font-semibold mb-4 text-[#C5A059]">Quick Links</h4>
                    <ul className="flex flex-col gap-2">
                        <li><a href="/" className="hover:text-[#C5A059]">Home</a></li>
                        <li><a href="/#rooms" className="hover:text-[#C5A059]">Rooms</a></li>
                        <li><a href="/admin/login" className="hover:text-[#C5A059]">Admin Portal Login</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xl font-semibold mb-4 text-[#C5A059]">Contact Us</h4>
                    <p className="text-gray-400">123 Luxury Lane, Ocean View City</p>
                    <p className="text-gray-400">Phone: +1 (234) 567 890</p>
                    <p className="text-gray-400">Email: info@myworldhotel.com</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-12 text-center text-gray-500">
                <p>© {new Date().getFullYear()} My World Hotel. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
