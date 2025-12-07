import React from 'react';
import Layout from '@/Layouts/Layout';
import { Link, usePage, router  } from '@inertiajs/react';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const Cart = ({ cartItems, total }) => {
    const { auth } = usePage().props;

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        router.put(route('cart.update', productId), { quantity: newQuantity });
    };

    return (
        <Layout>
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
                        Shopping Cart
                    </h1>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
                            <div className="mt-6">
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                            <div className="lg:col-span-8">
                                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                    <ul className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <li key={item.product.id} className="p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        {item.product.images && item.product.images[0] ? (
                                                            <img
                                                                className="h-24 w-24 object-cover rounded"
                                                                src={`/storage/${item.product.images[0]}`}
                                                                alt={item.product.name}
                                                            />
                                                        ) : (
                                                            <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center">
                                                                <span className="text-gray-400">No image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-6 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-medium text-gray-900">
                                                                    {item.product.name}
                                                                </h3>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    ${item.product.final_price} each
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex items-center border border-gray-300 rounded">
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                                                        className="p-2 hover:bg-gray-100"
                                                                    >
                                                                        <MinusIcon className="h-4 w-4" />
                                                                    </button>
                                                                    <span className="px-4 py-2">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                                                        className="p-2 hover:bg-gray-100"
                                                                    >
                                                                        <PlusIcon className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                                <div className="text-lg font-medium text-gray-900">
                                                                    ${item.subtotal.toFixed(2)}
                                                                </div>
                                                                <Link
                                                                    href={route('cart.remove', item.product.id)}
                                                                    method="delete"
                                                                    as="button"
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href={route('products.index')}
                                        className="text-indigo-600 hover:text-indigo-500"
                                    >
                                        ← Continue Shopping
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-8 lg:mt-0 lg:col-span-4">
                                <div className="bg-white shadow sm:rounded-lg">
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">Subtotal</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ${total.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">Shipping</p>
                                                <p className="text-sm font-medium text-gray-900">$50.00</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">Tax</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    ${(total * 0.1).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                                <p className="text-base font-medium text-gray-900">Order total</p>
                                                <p className="text-base font-medium text-gray-900">
                                                    ${(total + 50 + total * 0.1).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            {auth.user ? (
                                                <Link
                                                    href={route('checkout.index')}
                                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    Proceed to Checkout
                                                </Link>
                                            ) : (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-600">
                                                        Please login to proceed to checkout.
                                                    </p>
                                                    <Link
                                                        href={route('login')}
                                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                                    >
                                                        Login to Checkout
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Cart;