import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    CreditCardIcon, 
    BanknotesIcon,
    BuildingLibraryIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';

const Checkout = ({ cartItems, subtotal, tax, shipping, total, user }) => {
    const { flash } = usePage().props;
    const [formData, setFormData] = useState({
        shipping_address: user?.address || '',
        billing_address: user?.address || '',
        payment_method: 'cash',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('checkout.process'), formData);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
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
            <Head title="Checkout" />
            
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                        {/* Checkout Form */}
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                                Checkout
                            </h1>

                            {flash.error && (
                                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {flash.error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Shipping Address */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
                                    <div>
                                        <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">
                                            Full Address
                                        </label>
                                        <textarea
                                            id="shipping_address"
                                            name="shipping_address"
                                            rows={3}
                                            value={formData.shipping_address}
                                            onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h2>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="same_as_shipping"
                                                name="same_as_shipping"
                                                type="checkbox"
                                                checked={formData.billing_address === formData.shipping_address}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFormData({...formData, billing_address: formData.shipping_address});
                                                    } else {
                                                        setFormData({...formData, billing_address: ''});
                                                    }
                                                }}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="same_as_shipping" className="font-medium text-gray-700">
                                                Same as shipping address
                                            </label>
                                        </div>
                                    </div>
                                    {formData.billing_address !== formData.shipping_address && (
                                        <div className="mt-4">
                                            <label htmlFor="billing_address" className="block text-sm font-medium text-gray-700">
                                                Billing Address
                                            </label>
                                            <textarea
                                                id="billing_address"
                                                name="billing_address"
                                                rows={3}
                                                value={formData.billing_address}
                                                onChange={(e) => setFormData({...formData, billing_address: e.target.value})}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <input
                                                type="radio"
                                                id="cash"
                                                name="payment_method"
                                                value="cash"
                                                checked={formData.payment_method === 'cash'}
                                                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="cash"
                                                className={`relative flex cursor-pointer rounded-lg border-2 p-4 focus:outline-none ${
                                                    formData.payment_method === 'cash'
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <BanknotesIcon className="h-6 w-6 text-gray-400" />
                                                    <div className="ml-3">
                                                        <span className="block text-sm font-medium text-gray-900">
                                                            Cash on Delivery
                                                        </span>
                                                        <span className="block text-sm text-gray-500">
                                                            Pay when you receive
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        <div>
                                            <input
                                                type="radio"
                                                id="card"
                                                name="payment_method"
                                                value="card"
                                                checked={formData.payment_method === 'card'}
                                                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="card"
                                                className={`relative flex cursor-pointer rounded-lg border-2 p-4 focus:outline-none ${
                                                    formData.payment_method === 'card'
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <CreditCardIcon className="h-6 w-6 text-gray-400" />
                                                    <div className="ml-3">
                                                        <span className="block text-sm font-medium text-gray-900">
                                                            Credit/Debit Card
                                                        </span>
                                                        <span className="block text-sm text-gray-500">
                                                            Pay with card
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        <div>
                                            <input
                                                type="radio"
                                                id="bkash"
                                                name="payment_method"
                                                value="bkash"
                                                checked={formData.payment_method === 'bkash'}
                                                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="bkash"
                                                className={`relative flex cursor-pointer rounded-lg border-2 p-4 focus:outline-none ${
                                                    formData.payment_method === 'bkash'
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <BuildingLibraryIcon className="h-6 w-6 text-gray-400" />
                                                    <div className="ml-3">
                                                        <span className="block text-sm font-medium text-gray-900">
                                                            bKash
                                                        </span>
                                                        <span className="block text-sm text-gray-500">
                                                            Mobile banking
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        <div>
                                            <input
                                                type="radio"
                                                id="nagad"
                                                name="payment_method"
                                                value="nagad"
                                                checked={formData.payment_method === 'nagad'}
                                                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                                                className="sr-only"
                                            />
                                            <label
                                                htmlFor="nagad"
                                                className={`relative flex cursor-pointer rounded-lg border-2 p-4 focus:outline-none ${
                                                    formData.payment_method === 'nagad'
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <BuildingLibraryIcon className="h-6 w-6 text-gray-400" />
                                                    <div className="ml-3">
                                                        <span className="block text-sm font-medium text-gray-900">
                                                            Nagad
                                                        </span>
                                                        <span className="block text-sm text-gray-500">
                                                            Mobile banking
                                                        </span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Order Notes (Optional)
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Any special instructions or notes about your order..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Place Order
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-8 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="bg-white shadow sm:rounded-lg">
                                <div className="p-6">
                                    {/* Cart Items */}
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.product.id} className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-16 w-16 object-cover rounded"
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
                                                            <p className="text-sm text-gray-500">
                                                                Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {formatPrice(item.subtotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Totals */}
                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-600">Subtotal</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatPrice(subtotal)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-600">Shipping</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatPrice(shipping)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-600">Tax</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatPrice(tax)}
                                                </p>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3 flex justify-between">
                                                <p className="text-base font-medium text-gray-900">Total</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    {formatPrice(total)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Return to Cart */}
                                    <div className="mt-6">
                                        <Link
                                            href={route('cart.index')}
                                            className="text-sm text-indigo-600 hover:text-indigo-500"
                                        >
                                            ← Return to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ShoppingBagIcon className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Secure Checkout
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>
                                                Your payment information is processed securely. We do not store credit card details.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;