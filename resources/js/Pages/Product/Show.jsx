import React, { useState } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ShoppingCartIcon,
    StarIcon,
    HeartIcon,
    TruckIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    CheckIcon,
    CreditCardIcon,
    TagIcon,
    ShareIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MinusIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { 
    StarIcon as StarIconSolid,
    HeartIcon as HeartIconSolid,
    CheckIcon as CheckIconSolid,
    ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';

const Show = ({ product, relatedProducts }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [zoomImage, setZoomImage] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    // Helper function to safely get images array
    const getImages = (imagesData) => {
        if (!imagesData) {
            return ['/images/default-product.png'];
        }
        
        try {
            let imagesArray;
            if (Array.isArray(imagesData)) {
                imagesArray = imagesData;
            } else if (typeof imagesData === 'string') {
                const trimmed = imagesData.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    imagesArray = JSON.parse(imagesData);
                } else {
                    return [`/storage/${imagesData}`];
                }
            } else {
                return ['/images/default-product.png'];
            }
            
            if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                return imagesArray.map(img => `/storage/${img}`);
            }
        } catch (error) {
            if (typeof imagesData === 'string' && imagesData.includes('products/')) {
                return [`/storage/${imagesData}`];
            }
        }
        
        return ['/images/default-product.png'];
    };

    const productImages = getImages(product.images);

    const addToCart = () => {
        router.post(route('cart.add', product.id), {
            quantity: quantity
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message
                const event = new CustomEvent('show-toast', {
                    detail: { 
                        message: 'Product added to cart!',
                        type: 'success'
                    }
                });
                window.dispatchEvent(event);
            }
        });
    };

    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        const event = new CustomEvent('show-toast', {
            detail: { 
                message: !isWishlisted ? 'Added to wishlist!' : 'Removed from wishlist!',
                type: 'info'
            }
        });
        window.dispatchEvent(event);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };

    const incrementQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleImageMouseMove = (e) => {
        if (!zoomImage) return;
        
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const calculateDiscount = () => {
        if (!product.sale_price || !product.price) return 0;
        return Math.round(((product.price - product.sale_price) / product.price) * 100);
    };

    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description?.substring(0, 100) + '...',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            const event = new CustomEvent('show-toast', {
                detail: { 
                    message: 'Link copied to clipboard!',
                    type: 'info'
                }
            });
            window.dispatchEvent(event);
        }
    };

    return (
        <Layout>
            <Head title={product.name} />
            
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center text-sm">
                            <Link href={route('home')} className="text-gray-500 hover:text-blue-600 transition-colors">
                                Home
                            </Link>
                            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                            <Link href={route('products.index')} className="text-gray-500 hover:text-blue-600 transition-colors">
                                Products
                            </Link>
                            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                            <Link href={route('products.index', { category: product.category?.slug })} className="text-gray-500 hover:text-blue-600 transition-colors">
                                {product.category?.name || 'Category'}
                            </Link>
                            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">
                        {/* Product Images - Left Side */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            {/* Discount Badge */}
                            {product.sale_price && product.price > product.sale_price && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold rounded-full shadow-lg">
                                        -{calculateDiscount()}% OFF
                                    </span>
                                </div>
                            )}

                            {/* Featured Badge */}
                            {product.is_featured && (
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                                        <SparklesIcon className="h-4 w-4 inline mr-1" />
                                        FEATURED
                                    </span>
                                </div>
                            )}

                            {/* Main Image Container */}
                            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                <div 
                                    className="aspect-w-1 aspect-h-1"
                                    onMouseEnter={() => setZoomImage(true)}
                                    onMouseLeave={() => setZoomImage(false)}
                                    onMouseMove={handleImageMouseMove}
                                >
                                    <img
                                        src={productImages[selectedImageIndex]}
                                        alt={product.name}
                                        className="w-full h-full object-center object-cover cursor-zoom-in transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/default-product.png';
                                        }}
                                    />
                                    
                                    {/* Zoom Overlay */}
                                    {zoomImage && (
                                        <div className="absolute inset-0 overflow-hidden">
                                            <div 
                                                className="absolute inset-0 bg-no-repeat bg-origin-content"
                                                style={{
                                                    backgroundImage: `url(${productImages[selectedImageIndex]})`,
                                                    backgroundSize: '200%',
                                                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                    transform: 'scale(2)'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Navigation Arrows */}
                                {productImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                        >
                                            <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 z-10"
                                        >
                                            <ChevronRightIcon className="h-5 w-5 text-gray-800" />
                                        </button>
                                    </>
                                )}
                                
                                {/* Image Counter */}
                                {productImages.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                                        {selectedImageIndex + 1} / {productImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {productImages.length > 1 && (
                                <div className="mt-6 flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                                selectedImageIndex === index 
                                                    ? 'border-blue-500 shadow-lg scale-105' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/default-product.png';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-500 p-2 rounded-lg">
                                            <TruckIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                                            <p className="text-xs text-gray-600">On orders over $50</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-500 p-2 rounded-lg">
                                            <ShieldCheckIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">2-Year Warranty</p>
                                            <p className="text-xs text-gray-600">Quality guaranteed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Details - Right Side */}
                        <div className="mt-8 lg:mt-0">
                            {/* Category & Brand */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        {product.category?.name || 'Uncategorized'}
                                    </span>                                    
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={toggleWishlist}
                                        className={`p-2 rounded-full transition-all duration-300 ${
                                            isWishlisted 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {isWishlisted ? (
                                            <HeartIconSolid className="h-5 w-5" />
                                        ) : (
                                            <HeartIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={shareProduct}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        <ShareIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Title */}
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating & Reviews */}
                            <div className="mt-4 flex items-center space-x-6">
                                <div className="flex items-center">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIconSolid
                                                key={star}
                                                className="h-5 w-5 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-900">4.8</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="text-gray-900 font-medium">142</span> reviews
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="mt-6 bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {formatPrice(product.sale_price || product.price)}
                                    </span>
                                    {product.sale_price && (
                                        <>
                                            <span className="ml-3 text-2xl text-gray-400 line-through">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="ml-3 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold rounded-full">
                                                Save {formatPrice(product.price - product.sale_price)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Availability:</span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        product.stock_quantity > 10 
                                            ? 'bg-green-100 text-green-800'
                                            : product.stock_quantity > 0
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        <CheckIcon className="h-4 w-4 mr-1" />
                                        {product.stock_quantity > 10 
                                            ? 'In Stock'
                                            : product.stock_quantity > 0
                                            ? `Only ${product.stock_quantity} left`
                                            : 'Out of Stock'
                                        }
                                    </span>
                                </div>
                                
                                {/* Stock Progress Bar */}
                                {product.stock_quantity > 0 && (
                                    <div className="mt-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                                style={{ 
                                                    width: `${Math.min(100, (product.stock_quantity / 100) * 100)}%` 
                                                }}
                                            />
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {product.stock_quantity} units available
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="mt-8">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Quantity
                                </label>

                                <div className="flex items-center space-x-4">
                                    
                                    {/* Quantity Box */}
                                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <MinusIcon className="h-5 w-5" />
                                        </button>

                                        <span className="px-6 py-3 text-lg font-semibold text-gray-900 border-x border-gray-300">
                                            {quantity}
                                        </span>

                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock_quantity}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <PlusIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Add to Cart (FULL WIDTH) */}
                                    <button
                                        onClick={addToCart}
                                        disabled={product.stock_quantity <= 0}
                                        className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        <div className="flex items-center justify-center">
                                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                            Add to Cart
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </button>
                                </div>

                                <div className="mx-2 text-sm text-gray-600">
                                    Max {product.stock_quantity} per customer
                                </div>
                            </div>


                            {/* Action Buttons */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                            </div>

                            {/* Trust Features */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <CreditCardIcon className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">Secure Payment</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">30-Day Returns</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <TruckIcon className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">Free Shipping</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                                    <span className="text-sm text-gray-700">Warranty</span>
                                </div>
                            </div>

                            {/* Description with Tabs */}
                            <div className="mt-10">
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex space-x-8">
                                        <button className="py-4 px-1 border-b-2 border-blue-500 text-sm font-medium text-blue-600">
                                            Description
                                        </button>
                                        <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                            Specifications
                                        </button>
                                        <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                            Reviews (142)
                                        </button>
                                        <button className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                            Shipping
                                        </button>
                                    </nav>
                                </div>
                                <div className="mt-6">
                                    <div className="prose prose-lg max-w-none">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About this item</h3>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {product.description}
                                        </div>
                                        
                                        {product.features && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                                                <ul className="space-y-2">
                                                    {product.features.split('\n').map((feature, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <CheckIconSolid className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-20">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Related Products</h2>
                                    <p className="mt-2 text-gray-600">Customers also viewed these products</p>
                                </div>
                                <Link 
                                    href={route('products.index', { category: product.category?.slug })}
                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                                >
                                    View all
                                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => {
                                    const relatedProductImages = getImages(relatedProduct.images);
                                    const firstImage = relatedProductImages[0] || '/images/default-product.png';
                                    const isOnSale = relatedProduct.sale_price && relatedProduct.price > relatedProduct.sale_price;
                                    
                                    return (
                                        <div key={relatedProduct.id} className="group">
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                                <Link href={route('products.show', relatedProduct.slug)}>
                                                    <div className="relative overflow-hidden">
                                                        <img
                                                            src={firstImage}
                                                            alt={relatedProduct.name}
                                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => { 
                                                                e.target.onerror = null; 
                                                                e.target.src = '/images/default-product.png'; 
                                                            }}
                                                        />
                                                        {isOnSale && (
                                                            <div className="absolute top-3 left-3">
                                                                <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded">
                                                                    SALE
                                                                </span>
                                                            </div>
                                                        )}
                                                        {relatedProduct.is_featured && (
                                                            <div className="absolute top-3 right-3">
                                                                <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded">
                                                                    FEATURED
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="p-5">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                            {relatedProduct.name}
                                                        </h3>
                                                        <div className="mt-3 flex items-center justify-between">
                                                            <div>
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {formatPrice(relatedProduct.sale_price || relatedProduct.price)}
                                                                </span>
                                                                {isOnSale && (
                                                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                                                        {formatPrice(relatedProduct.price)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
                                                                <ShoppingCartIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom CSS for scrollbar hiding */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .prose {
                    color: #374151;
                }
                .prose h3 {
                    color: #111827;
                    margin-top: 1.5em;
                }
                .prose ul {
                    list-style-type: none;
                    padding-left: 0;
                }
            `}</style>
        </Layout>
    );
};

// Add missing SparklesIcon component
const SparklesIcon = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-4 h-4"
        {...props}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" 
        />
    </svg>
);

export default Show;