import React, { useState } from 'react';
import AdminLayout from '../Layout/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    HomeIcon,
    CreditCardIcon,
    ShoppingBagIcon,
    ArrowLeftIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Show = ({ order }) => {
    const { flash } = usePage().props;
    const [status, setStatus] = useState(order.status);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState(order.status);

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

    const updateOrderStatus = () => {
        router.put(route('admin.orders.updateStatus', order.id), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setStatus(newStatus);
                setShowStatusModal(false);
            }
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
        { value: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'shipped', label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
    ];

    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}

                    {/* Order Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Link
                                    href={route('admin.orders.index')}
                                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                                >
                                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                                    Back to Orders
                                </Link>
                                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                                    Order #{order.order_number}
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Placed on {formatDate(order.created_at)}
                                </p>
                            </div>
                            
                            {/* Status Update Button */}
                            <button
                                onClick={() => setShowStatusModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>

                    <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Left Column - Order Items */}
                        <div className="lg:col-span-2">
                            {/* Order Status & Payment */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Order Status */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                                                    {getStatusIcon(status)}
                                                    <span className="ml-2 capitalize">{status}</span>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Payment Status */}
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                                    <CreditCardIcon className="h-4 w-4 mr-2" />
                                                    <span className="capitalize">{order.payment_status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    <ul className="divide-y divide-gray-200">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
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
                                                                    SKU: {item.product.sku}
                                                                </p>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {formatPrice(item.total)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* Order Summary */}
                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
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
                        </div>

                        {/* Right Column - Order Details */}
                        <div className="lg:col-span-1">
                            {/* Customer Information */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{order.user?.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{order.user?.email}</dd>
                                        </div>
                                        {order.user?.phone && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{order.user?.phone}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex items-center">
                                        <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <div className="text-sm text-gray-700 whitespace-pre-line">
                                        {order.shipping_address}
                                    </div>
                                </div>
                            </div>

                            {/* Billing Information */}
                            {order.billing_address && (
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                                    <div className="px-4 py-5 sm:px-6">
                                        <div className="flex items-center">
                                            <HomeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <div className="text-sm text-gray-700 whitespace-pre-line">
                                            {order.billing_address}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Information */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex items-center">
                                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                                            <dd className="mt-1 text-sm text-gray-900 capitalize">
                                                {order.payment_method}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                                                    {order.payment_status}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Order Notes */}
                            {order.notes && (
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <div className="flex items-center">
                                            <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <h3 className="text-lg font-medium text-gray-900">Order Notes</h3>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <div className="text-sm text-gray-700">
                                            {order.notes}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Update Order Status
                                    </h3>
                                    <div className="mt-4">
                                        <div className="space-y-4">
                                            {statusOptions.map((option) => (
                                                <div key={option.value} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        id={`status-${option.value}`}
                                                        name="status"
                                                        value={option.value}
                                                        checked={newStatus === option.value}
                                                        onChange={(e) => setNewStatus(e.target.value)}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                    <label
                                                        htmlFor={`status-${option.value}`}
                                                        className="ml-3 flex items-center"
                                                    >
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${option.color} ml-2`}>
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                                <button
                                    type="button"
                                    onClick={updateOrderStatus}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Update Status
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowStatusModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Show;