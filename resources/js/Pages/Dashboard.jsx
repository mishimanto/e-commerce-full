import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { 
    ShoppingBagIcon, 
    ClockIcon,
    CheckCircleIcon,
    TruckIcon,
    XCircleIcon,
    EyeIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ orders, recentOrders, stats }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'shipped':
                return <TruckIcon className="h-5 w-5 text-blue-500" />;
            case 'processing':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />;
            case 'pending':
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
            case 'cancelled':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Orders
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats?.total_orders || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-6 w-6 text-green-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Completed Orders
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats?.completed_orders || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ClockIcon className="h-6 w-6 text-yellow-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Pending Orders
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {stats?.pending_orders || 0}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <TruckIcon className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Spent
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {formatPrice(stats?.total_spent || 0)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Recent Orders
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Your recent purchase history
                                </p>
                            </div>
                            <Link
                                href={route('orders.index')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                View all orders →
                            </Link>
                        </div>
                        
                        {recentOrders && recentOrders.length > 0 ? (
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <li key={order.id} className="hover:bg-gray-50">
                                            <Link 
                                                href={route('orders.show', order.id)}
                                                className="block"
                                            >
                                                <div className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0">
                                                                    {getStatusIcon(order.status)}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        Order #{order.order_number}
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center mt-1">
                                                                        <span className={`mr-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                                        </span>
                                                                        <span className="text-sm text-gray-500">
                                                                            {formatDate(order.created_at)} • {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-right">
                                                                <p className="text-sm font-semibold text-gray-900">
                                                                    {formatPrice(order.total)}
                                                                </p>
                                                            </div>
                                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="px-4 py-12 text-center">
                                <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by placing your first order.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route('products.index')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <ShoppingBagIcon className="mr-2 -ml-1 h-5 w-5" />
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Quick Actions
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
                                <Link
                                    href={route('products.index')}
                                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
                                >
                                    <div className="flex-shrink-0">
                                        <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        <p className="text-sm font-medium text-gray-900">
                                            Continue Shopping
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            Browse our products
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('orders.index')}
                                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
                                >
                                    <div className="flex-shrink-0">
                                        <ClockIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        <p className="text-sm font-medium text-gray-900">
                                            View All Orders
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            See your complete order history
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}