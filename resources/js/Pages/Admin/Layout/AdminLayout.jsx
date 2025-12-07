import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    HomeIcon, 
    ShoppingBagIcon, 
    FolderIcon, 
    ShoppingCartIcon,
    Bars3Icon,  
    XMarkIcon,
    MagnifyingGlassIcon,
    BellIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    EyeIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { auth } = usePage().props;
    const userMenuRef = useRef(null);
    const searchRef = useRef(null);

    // Navigation with route names
    const navigation = [
        { name: 'Dashboard', route: 'admin.dashboard', icon: HomeIcon },
        { name: 'Products', route: 'admin.products.index', icon: ShoppingBagIcon },
        { name: 'Categories', route: 'admin.categories.index', icon: FolderIcon },
        { name: 'Orders', route: 'admin.orders.index', icon: ShoppingCartIcon },
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const getPageTitle = () => {
        const currentRoute = route().current();
        const routeMap = {
            'admin.dashboard': 'Dashboard',
            'admin.products.index': 'Products',
            'admin.products.create': 'Add Product',
            'admin.products.edit': 'Edit Product',
            'admin.categories.index': 'Categories',
            'admin.categories.create': 'Add Category',
            'admin.categories.edit': 'Edit Category',
            'admin.orders.index': 'Orders',
            'admin.settings': 'Settings'
        };
        
        return routeMap[currentRoute] || currentRoute?.replace('admin.', '').replace('.index', '') || 'Admin Panel';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center">
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = route().current() === item.route; // Compare route names
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={route(item.route)}
                                                    className={`
                                                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium
                                                        transition-colors duration-200
                                                        ${isActive 
                                                            ? 'bg-indigo-50 text-indigo-600'
                                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                        }
                                                    `}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`lg:hidden ${sidebarOpen ? 'fixed inset-0 z-50' : ''}`}>
                {/* Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-gray-900/80"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="flex h-full flex-col bg-white">
                        {/* Sidebar Header */}
                        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
                            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                            <button
                                type="button"
                                className="rounded-md p-2 text-gray-400 hover:text-gray-500"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        
                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <nav className="space-y-1">
                                {navigation.map((item) => {
                                    const isActive = route().current() === item.route;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={route(item.route)}
                                            className={`
                                                group flex items-center rounded-md px-3 py-2 text-sm font-medium
                                                transition-colors duration-200
                                                ${isActive 
                                                    ? 'bg-indigo-50 text-indigo-600' 
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                }
                                            `}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon className="mr-3 h-6 w-6" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        
                        {/* User Info */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="flex items-center">
                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">{auth.user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Navigation */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-200 lg:hidden" />

                    {/* Page Title */}
                    <div className="flex flex-1 items-center">
                        <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-1.5 text-gray-400 hover:text-gray-500"
                                title="Search"
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                            </button>
                            
                            {/* Search Overlay for Mobile */}
                            {searchOpen && (
                                <div className="fixed inset-0 z-50 lg:hidden">
                                    <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setSearchOpen(false)} />
                                    <div className="absolute inset-x-0 top-0 bg-white p-4 shadow-lg">
                                        <form onSubmit={handleSearch} className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search products, orders..."
                                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
                                                autoFocus
                                            />
                                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                            <button type="submit" className="sr-only">Search</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Search Box for Desktop */}
                            <div className="hidden lg:block">
                                <div className={`absolute right-0 top-full mt-2 w-80 transform transition-all duration-200 ${
                                    searchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}>
                                    <div className="rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                                        <form onSubmit={handleSearch} className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search products, orders..."
                                                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500"
                                                autoFocus
                                            />
                                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                            <button type="submit" className="sr-only">Search</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <button className="relative p-1.5 text-gray-400 hover:text-gray-500">
                            <BellIcon className="h-5 w-5" />
                            <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-red-400"></span>
                        </button>

                        {/* View Store */}
                        <Link
                            href={route('home')}
                            className="hidden md:inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            <EyeIcon className="h-4 w-4" />
                            Store
                        </Link>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-x-2 rounded-full p-1 hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-x-2">
                                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium text-gray-700">{auth.user.name}</p>
                                    </div>
                                    <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <UserCircleIcon className="mr-3 h-4 w-4" />
                                            Edit Profile 
                                        </Link>
                                    </div>
                                    
                                    <div className="border-t py-1">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="py-6">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
