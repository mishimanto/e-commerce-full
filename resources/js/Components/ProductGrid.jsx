import React from 'react';
import { Link } from '@inertiajs/react';

const ProductGrid = ({ products = { data: [] } }) => {
    const formatPrice = (price) => {
        if (!price && price !== 0) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getImageUrl = (product) => {
        if (!product?.images) return '/images/default-product.png';
        
        try {
            if (Array.isArray(product.images) && product.images.length > 0) {
                return `/storage/${product.images[0]}`;
            }
            if (typeof product.images === 'string') {
                return `/storage/${product.images}`;
            }
        } catch (error) {
            console.error('Error parsing image:', error);
        }
        
        return '/images/default-product.png';
    };

    if (!products.data || products.data.length === 0) {
        return (
            <div className="text-center py-12 min-h-[400px] flex flex-col justify-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="min-h-[400px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.data.map((product) => (
                    <div key={product.id} className="group bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <Link href={route('products.show', product.slug)}>
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <img
                                    src={getImageUrl(product)}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/default-product.png';
                                    }}
                                />
                                {product.is_featured && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                                        FEATURED
                                    </div>
                                )}
                            </div>
                        </Link>
                        
                        <div className="p-4">
                            <Link href={route('products.show', product.slug)}>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {product.name}
                                </h3>
                            </Link>
                            
                            {product.description && (
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                    {product.description}
                                </p>
                            )}
                            
                            <div className="mt-3 flex items-center justify-between">
                                <div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatPrice(product.sale_price || product.price)}
                                    </span>
                                    {product.sale_price && product.sale_price < product.price && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>
                                
                                <Link
                                    href={route('products.show', product.slug)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Pagination */}
            {products.links && products.links.length > 3 && (
                <div className="mt-8">
                    <nav className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-2 text-sm rounded-lg ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;