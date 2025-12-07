import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    ShoppingCartIcon, 
    MagnifyingGlassIcon,
    UserIcon,
    HeartIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    TagIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    TruckIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import { 
    ShoppingCartIcon as ShoppingCartIconSolid,
    HeartIcon as HeartIconSolid,
    HomeIcon as HomeIconSolid,
    TagIcon as TagIconSolid
} from '@heroicons/react/24/solid';

const Layout = ({ children }) => {
    const { auth, cartCount, categories = [] } = usePage().props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.user-dropdown')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [dropdownOpen]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <TruckIcon className="h-4 w-4" />
                                <span>Free Shipping on Orders Over $50</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-1">
                                <ShieldCheckIcon className="h-4 w-4" />
                                <span>100% Secure Payment</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <PhoneIcon className="h-4 w-4" />
                                <span>019XXXXXXXX</span>
                            </div>
                            <div className="hidden lg:flex items-center space-x-1">
                                <GlobeAltIcon className="h-4 w-4" />
                                <span>English</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-xl' : 'bg-white/95 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href={route('home')} className="flex items-center space-x-3">
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        LuxuryMart
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-8">                

                            <Link 
                                href={route('products.index')} 
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                Products
                            </Link>
                            <Link 
                                href="#features" 
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                Features
                            </Link>
                            <Link 
                                href="#about" 
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                About Us
                            </Link>
                            <Link 
                                href={route('products.index')} 
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                Contacts
                            </Link>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                        

                            {/* Cart */}
                            <Link
                                href={route('cart.index')}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
                            >
                                <ShoppingCartIcon className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                                        {cartCount}
                                    </span>

                                )}
                            </Link>

                            {/* User Dropdown */}
                            <div className="relative user-dropdown">
                                {auth.user ? (
                                    <>
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <UserIcon className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                            </div>
                                            <svg
                                                className={`h-4 w-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {dropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100">
                                                
                                                <div className="py-2">
                                                    <Link
                                                        href={route('dashboard')}
                                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <span>Dashboard</span>
                                                    </Link>

                                                    <Link
                                                        href={route('profile.edit')}
                                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                d="M15.232 5.232l3.536 3.536M4 20h4l10-10-4-4L4 16v4z" />
                                                        </svg>
                                                        <span>Edit Profile</span>
                                                    </Link>
                                                    
                                                    <Link
                                                        href={route('orders.index')}
                                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                        <span>My Orders</span>
                                                    </Link>
                                                    
                                                    {auth.user.isAdmin && (
                                                        <Link
                                                            href={route("admin.dashboard")}
                                                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-t border-gray-100 mt-2 pt-2"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>Admin Dashboard</span>
                                                        </Link>
                                                    )}
                                                </div>
                                                
                                                <div className="border-t border-gray-100 pt-2">
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition-colors"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        <span>Logout</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
                        <div className="px-4 py-6 space-y-4">
                            <Link 
                                href={route('home')} 
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <HomeIconSolid className="h-5 w-5" />
                                <span className="font-medium">Home</span>
                            </Link>
                            
                            <div className="px-4 py-3">
                                <h3 className="text-sm font-semibold text-gray-500 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.slice(0, 5).map((category) => (
                                        <Link
                                            key={category.id}
                                            href={route('products.index', { category: category.slug })}
                                            className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span>{category.name}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {category.products_count || 0}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link 
                                href={route('products.index')} 
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <TagIconSolid className="h-5 w-5" />
                                <span className="font-medium">All Products</span>
                            </Link>

                            <div className="border-t pt-4">
                                {!auth.user ? (
                                    <div className="space-y-3">
                                        <Link
                                            href={route('login')}
                                            className="block w-full text-center px-4 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="px-4 text-sm text-gray-500">Logged in as</p>
                                        <p className="px-4 font-medium text-gray-900">{auth.user.name}</p>
                                        <Link
                                            href={route('dashboard')}
                                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span>Dashboard</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow mx-auto w-full">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <h2 className="text-2xl font-bold">LuxuryMart</h2>
                            </div>
                            <p className="text-gray-400 mb-6">
                                Your premium destination for quality products. We bring you the best shopping experience with curated collections and exceptional service.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="h-10 w-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="h-10 w-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="h-10 w-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><Link href={route('home')} className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                                <li><Link href={route('products.index')} className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Featured</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Best Sellers</Link></li>
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
                            <ul className="space-y-3">
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center space-x-3">
                                    <MapPinIcon className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-400">Dhaka, Bangladesh</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <PhoneIcon className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-400">019XXXXXXXX</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                                    <span className="text-gray-400">info@luxurymart.com</span>
                                </li>
                            </ul>
                            <div className="mt-8 p-4 bg-gray-1000 rounded-lg">
                                <h4 className="font-medium mb-2">Newsletter</h4>
                                <div className="flex">
                                    <input 
                                        type="email" 
                                        placeholder="Your email" 
                                        className="flex-grow px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-r-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                &copy; {new Date().getFullYear()} LuxuryMart. All rights reserved.
                            </p>
                            
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;