import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from './Layout/AdminLayout';
import { 
    ShoppingBagIcon, 
    FolderIcon, 
    ShoppingCartIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

const Dashboard = ({ stats }) => {
    const statCards = [
        {
            name: 'Total Products',
            value: stats.total_products,
            icon: ShoppingBagIcon,
            color: 'bg-blue-500',
            href: route('admin.products.index')
        },
        {
            name: 'Total Categories',
            value: stats.total_categories,
            icon: FolderIcon,
            color: 'bg-green-500',
            href: route('admin.categories.index')
        },
        {
            name: 'Total Orders',
            value: stats.total_orders,
            icon: ShoppingCartIcon,
            color: 'bg-yellow-500',
            href: route('admin.orders.index')
        },
        {
            name: 'Total Users',
            value: stats.total_users,
            icon: UserGroupIcon,
            color: 'bg-purple-500',
            href: '#'
        },
        {
            name: 'Total Revenue',
            value: `$${stats.revenue.toFixed(2)}`,
            icon: CurrencyDollarIcon,
            color: 'bg-indigo-500',
            href: '#'
        }
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="">
                <div className="mx-auto">                    
                    {/* Stats Grid */}
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {statCards.map((card) => (
                            <Link
                                key={card.name}
                                href={card.href}
                                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                            <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {card.name}
                                                </dt>
                                                <dd className="text-lg font-semibold text-gray-900">
                                                    {card.value}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-8">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Recent Orders
                                </h3>
                                <Link
                                    href={route('admin.orders.index')}
                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {stats.recent_orders.map((order) => (
                                        <li key={order.id}>
                                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-indigo-600 truncate">
                                                            Order #{order.order_number}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {order.user?.name} • {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            ${parseFloat(order.total).toFixed(2)}
                                                        </p>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                            order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Featured Products */}
                    <div className="mt-8">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Featured Products
                                </h3>
                                <Link
                                    href={route('admin.products.index')}
                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="border-t border-gray-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {stats.top_products.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={route('admin.products.index')}
                                            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-center">
                                                    {product.images && product.images[0] ? (
                                                        <img
                                                            className="h-16 w-16 object-cover rounded"
                                                            src={`/storage/${product.images[0]}`}
                                                            alt={product.name}
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                            <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="ml-4">
                                                        <h4 className="text-sm font-medium text-gray-900">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {product.category?.name}
                                                        </p>
                                                        <div className="mt-1">
                                                            <span className="text-lg font-bold text-gray-900">
                                                                ${product.price}
                                                            </span>
                                                            {product.sale_price && (
                                                                <span className="ml-2 text-sm text-gray-500 line-through">
                                                                    ${product.sale_price}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        product.stock_quantity > 0 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        product.is_featured 
                                                            ? 'bg-yellow-100 text-yellow-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {product.is_featured ? 'Featured' : 'Regular'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;