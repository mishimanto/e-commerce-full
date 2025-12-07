import React from 'react';
import Layout from '@/Layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    HomeIcon,
    CreditCardIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';

const Show = ({ order }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
            case 'shipped':
                return <TruckIcon className="h-6 w-6 text-blue-500" />;
            case 'processing':
                return <ClockIcon className="h-6 w-6 text-yellow-500" />;
            default:
                return <ClockIcon className="h-6 w-6 text-gray-500" />;
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

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getImageUrl = (product) => {
        if (!product.images) {
            return '/images/default-product.png';
        }
        
        try {
            let imagesArray;
            if (Array.isArray(product.images)) {
                imagesArray = product.images;
            } else if (typeof product.images === 'string') {
                imagesArray = JSON.parse(product.images);
            } else {
                return '/images/default-product.png';
            }
            
            if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                return `/storage/${imagesArray[0]}`;
            }
        } catch (error) {
            if (typeof product.images === 'string' && product.images.includes('products/')) {
                return `/storage/${product.images}`;
            }
        }
        
        return '/images/default-product.png';
    };

    return (
        <Layout>
            <Head title={`Order #${order.order_number}`} />
            
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Order Header */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Order #{order.order_number}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Placed on {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <Link
                                        href={route('orders.index')}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        ← Back to Orders
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Status Badges */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-2 capitalize">{order.status}</span>
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                    <CreditCardIcon className="h-4 w-4 mr-2" />
                                    <span className="capitalize">{order.payment_status}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        {/* Order Items */}
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <ul className="divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-20 w-20 object-cover rounded"
                                                        src={getImageUrl(item.product)}
                                                        alt={item.product.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/images/default-product.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                {item.product.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {formatPrice(item.total)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Order Summary */}
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex justify-between text-sm font-medium text-gray-900">
                                        <p>Subtotal</p>
                                        <p>{formatPrice(order.subtotal)}</p>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                                        <p>Shipping</p>
                                        <p>{formatPrice(order.shipping)}</p>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-900 mt-2">
                                        <p>Tax</p>
                                        <p>{formatPrice(order.tax)}</p>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                                        <p>Total</p>
                                        <p>{formatPrice(order.total)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="mt-8 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
                            <div className="space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <h3 className="text-md font-medium text-gray-900">Shipping Address</h3>
                                    </div>
                                    <div className="text-sm text-gray-700 whitespace-pre-line">
                                        {order.shipping_address}
                                    </div>
                                </div>

                                {/* Billing Address */}
                                {order.billing_address && order.billing_address !== order.shipping_address && (
                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                        <div className="flex items-center mb-4">
                                            <HomeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <h3 className="text-md font-medium text-gray-900">Billing Address</h3>
                                        </div>
                                        <div className="text-sm text-gray-700 whitespace-pre-line">
                                            {order.billing_address}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Information */}
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <h3 className="text-md font-medium text-gray-900">Payment Information</h3>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <p className="font-medium capitalize">{order.payment_method}</p>
                                        <p className="mt-1">Payment Status: 
                                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                {order.notes && (
                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                        <div className="flex items-center mb-4">
                                            <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <h3 className="text-md font-medium text-gray-900">Order Notes</h3>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {order.notes}
                                        </div>
                                    </div>
                                )}

                                {/* Contact Support */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-md font-medium text-blue-900 mb-2">
                                        Need Help?
                                    </h3>
                                    <p className="text-sm text-blue-700 mb-4">
                                        If you have any questions about your order, please contact our customer support.
                                    </p>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                    >
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Show;