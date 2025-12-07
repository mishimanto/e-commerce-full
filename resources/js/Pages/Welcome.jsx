import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    StarIcon, 
    ShoppingCartIcon,
    FunnelIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowRightIcon,
    SparklesIcon,
    ShieldCheckIcon,
    TruckIcon,
    ArrowPathIcon,
    CheckIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Welcome = ({ 
    featuredProducts = [], 
    categories: initialCategories = [], 
    products: initialProducts = { data: [] },
    filters: initialFilters = {}
}) => {
    // Null checking for all props
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(
        Array.isArray(initialFilters?.categories) ? initialFilters.categories : []
    );
    const [priceRange, setPriceRange] = useState([
        initialFilters?.min_price || 0, 
        initialFilters?.max_price || 1000
    ]);
    const [sortBy, setSortBy] = useState(initialFilters?.sort || 'newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [products, setProducts] = useState(initialProducts?.data || []);
    const [categories, setCategories] = useState(initialCategories || []);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [activeFilters, setActiveFilters] = useState([]);

    const categoriesRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [dragging, setDragging] = useState(null);

    // Hero Carousel Images
    const heroSlides = [
        {
            id: 1,
            title: "Summer Collection 2025",
            subtitle: "Discover the latest trends",
            description: "Up to 50% off on selected items",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2100&q=80",
            color: "from-blue-600 to-purple-600",
            buttonText: "Shop Now",
            buttonLink: route('products.index')
        },
        {
            id: 2,
            title: "Premium Quality",
            subtitle: "Best Products Guaranteed",
            description: "100% satisfaction or your money back",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2100&q=80",
            color: "from-emerald-600 to-teal-600",
            buttonText: "Explore Quality",
            buttonLink: route('products.index')
        },
        {
            id: 3,
            title: "Free Shipping",
            subtitle: "On Orders Over $50",
            description: "Fast delivery to your doorstep",
            image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2100&q=80",
            color: "from-orange-500 to-red-500",
            buttonText: "Shop Free Shipping",
            buttonLink: route('products.index')
        }
    ];

    // Initial setup from props
    useEffect(() => {
        if (initialProducts?.data) {
            setProducts(initialProducts.data);
        }
        if (initialCategories) {
            setCategories(initialCategories);
        }
        
        // Set active filters from initial filters
        updateActiveFiltersDisplay();
    }, [initialProducts, initialCategories]);

    const startDragging = (e, type) => {
        e.preventDefault();
        setDragging(type);
        
        const moveHandler = (moveEvent) => {
            const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
            if (!clientX) return;
            
            const slider = e.currentTarget.parentElement;
            const rect = slider.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const value = Math.round((percentage / 100) * 1000);
            
            if (type === 'min') {
                setPriceRange([
                    Math.min(value, priceRange[1] - 10),
                    priceRange[1]
                ]);
            } else {
                setPriceRange([
                    priceRange[0],
                    Math.max(value, priceRange[0] + 10)
                ]);
            }
        };
        
        const stopDragging = () => {
            setDragging(null);
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('touchend', stopDragging);
        };
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('touchmove', moveHandler);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    };    

    // Update active filters display
    const updateActiveFiltersDisplay = () => {
        const newActiveFilters = [];
        
        if (selectedCategories.length > 0 && categories.length > 0) {
            selectedCategories.forEach(catId => {
                const cat = categories.find(c => c.id === catId);
                if (cat) newActiveFilters.push(cat.name);
            });
        }
        
        if (priceRange[0] > 0 || priceRange[1] < 1000) {
            newActiveFilters.push(`Price: $${priceRange[0]} - $${priceRange[1]}`);
        }
        
        if (sortBy !== 'newest') {
            const sortLabels = {
                'price_asc': 'Price: Low to High',
                'price_desc': 'Price: High to Low',
                'name_asc': 'Name: A to Z',
                'name_desc': 'Name: Z to A'
            };
            newActiveFilters.push(sortLabels[sortBy] || sortBy);
        }
        
        setActiveFilters(newActiveFilters);
    };

    // Auto slide carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Check scroll for categories
    useEffect(() => {
        const checkScroll = () => {
            if (categoriesRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
                setShowLeftArrow(scrollLeft > 0);
                setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
            }
        };

        if (categoriesRef.current) {
            categoriesRef.current.addEventListener('scroll', checkScroll);
            checkScroll();
        }

        return () => {
            if (categoriesRef.current) {
                categoriesRef.current.removeEventListener('scroll', checkScroll);
            }
        };
    }, [categories]);

    // Fetch products when filters change (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedCategories, priceRange, sortBy]);

    // Apply filters with Inertia.js
    const applyFilters = () => {
        setLoading(true);
        
        const filters = {};
        
        if (selectedCategories.length > 0) {
            filters.categories = selectedCategories;
        }
        
        if (priceRange[0] > 0 || priceRange[1] < 1000) {
            filters.min_price = priceRange[0];
            filters.max_price = priceRange[1];
        }
        
        if (sortBy && sortBy !== 'newest') {
            filters.sort = sortBy;
        }

        router.get(route('home'), filters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['products', 'filters'], 
            onSuccess: (page) => {
                setProducts(page.props.products?.data || []);
                setCategories(page.props.categories || []);
                setVisibleProducts(8);
                updateActiveFiltersDisplay();
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    // Handle category checkbox
    const handleCategoryCheckbox = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 1000]);
        setSortBy('newest');
        setActiveFilters([]);
        
        router.get(route('home'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: (page) => {
                setProducts(page.props.products?.data || []);
                setCategories(page.props.categories || []);
            }
        });
    };

    // Remove single filter
    const removeFilter = (filterIndex) => {
        const filter = activeFilters[filterIndex];
        
        if (filter && filter.startsWith('Price: $')) {
            setPriceRange([0, 1000]);
        } else if (filter && (filter.includes('Price: Low') || filter.includes('Price: High') || 
                   filter.includes('Name: A') || filter.includes('Name: Z'))) {
            setSortBy('newest');
        } else if (filter) {
            // It's a category filter
            const category = categories.find(c => c.name === filter);
            if (category) {
                setSelectedCategories(prev => prev.filter(id => id !== category.id));
            }
        }
        
        // Remove from active filters display
        const newActiveFilters = [...activeFilters];
        newActiveFilters.splice(filterIndex, 1);
        setActiveFilters(newActiveFilters);
    };

    // Add to cart function
    const addToCart = (product) => {
        if (!product?.id) return;
        
        router.post(route('cart.add', product.id), {
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Show success message
            }
        });
    };

    // Format price
    const formatPrice = (price) => {
        if (!price && price !== 0) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    // Get image URL helper function
    const getImageUrl = (product) => {
        if (!product?.images) {
            return '/images/default-product.png';
        }
        
        try {
            let imagesArray;
            
            // Check if images is already an array
            if (Array.isArray(product.images)) {
                imagesArray = product.images;
            } 
            // Try to parse as JSON
            else if (typeof product.images === 'string') {
                // First check if it looks like a JSON array
                const trimmed = product.images.trim();
                if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                    // It's JSON, try to parse
                    imagesArray = JSON.parse(product.images);
                } else {
                    // It's a direct string path
                    return `/storage/${product.images}`;
                }
            } else {
                return '/images/default-product.png';
            }
            
            // If we have an array with images
            if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                return `/storage/${imagesArray[0]}`;
            }
        } catch (error) {
            // If any error occurs, return the string directly or default
            console.error('Error parsing image:', error);
            if (typeof product.images === 'string') {
                return `/storage/${product.images}`;
            }
        }
        
        return '/images/default-product.png';
    };

    // Next/Previous slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    // Load more products
    const loadMoreProducts = () => {
        setVisibleProducts((prev) => Math.min(prev + 4, products.length));
    };

    // Scroll categories
    const scrollCategories = (direction) => {
        if (categoriesRef.current) {
            const scrollAmount = 200;
            categoriesRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Check if featuredProducts exists and has items
    const hasFeaturedProducts = featuredProducts && featuredProducts.length > 0;
    const hasCategories = categories && categories.length > 0;
    const hasProducts = products && products.length > 0;

    return (
        <Layout>
            <Head title="Welcome to LuxuryMart" />
            
            {/* Hero Carousel Section */}
            <div className="relative overflow-hidden">
                {/* Carousel */}
                <div className="relative h-[500px] md:h-[600px]">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20 z-0" />
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4 md:px-8">
                                    <div className="max-w-2xl">
                                        <div className="mb-4">
                                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-2">
                                                {slide.subtitle}
                                            </span>
                                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                                {slide.title}
                                            </h1>
                                            <p className="text-xl text-white/90 mb-8">
                                                {slide.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Link
                                                href={slide.buttonLink}
                                                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-2xl"
                                            >
                                                {slide.buttonText}
                                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                                            </Link>
                                            <Link
                                                href="#featured"
                                                className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                                            >
                                                Explore Featured
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide 
                                        ? 'bg-white w-10' 
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Search Bar - Fixed Position */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-4xl px-4">
                    <form onSubmit={(e) => { e.preventDefault(); router.get(route('products.index'), { search: searchQuery }); }} className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="w-full pl-14 pr-36 py-4 text-lg rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm focus:ring-3 focus:ring-blue-500/30"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
                        >
                            
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
                <div className="bg-white border-b border-gray-100 py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                                {activeFilters.map((filter, index) => (
                                    <div key={index} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-full text-sm text-blue-700">
                                        <span>{filter}</span>
                                        <button
                                            onClick={() => removeFilter(index)}
                                            className="ml-1 hover:text-blue-900"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Section & Products */}
            <div className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                        {/* Filters Sidebar */}
                        <div className="hidden lg:block">
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                                    <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
                                </div>

                                {/* Categories Filter */}
                                {hasCategories && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="all-categories"
                                                    checked={selectedCategories.length === 0}
                                                    onChange={() => setSelectedCategories([])}
                                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <label htmlFor="all-categories" className="ml-2 text-sm text-gray-700 cursor-pointer">
                                                    All Categories
                                                </label>
                                            </div>
                                            {categories.map((category) => (
                                                <div key={category.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`category-${category.id}`}
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => handleCategoryCheckbox(category.id)}
                                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer flex-1">
                                                        {category.name}
                                                    </label>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {category.products_count || 0}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
                                    
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-gray-900">
                                                ${priceRange[0]} - ${priceRange[1]}
                                            </div>
                                        </div>

                                        {/* Custom Slider Container */}
                                        <div className="relative h-12">
                                            {/* Track */}
                                            <div className="absolute top-5 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>
                                            
                                            {/* Active Track */}
                                            <div 
                                                className="absolute top-5 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                style={{
                                                    left: `${(priceRange[0] / 1000) * 100}%`,
                                                    width: `${((priceRange[1] - priceRange[0]) / 1000) * 100}%`
                                                }}
                                            ></div>
                                            
                                            {/* Clickable Track for Min/Max */}
                                            <div 
                                                className="absolute top-0 left-0 right-0 h-12 cursor-pointer"
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const x = e.clientX - rect.left;
                                                    const percentage = (x / rect.width) * 100;
                                                    const value = Math.round((percentage / 100) * 1000);
                                                    
                                                    // Determine which handle is closer
                                                    const minDistance = Math.abs(value - priceRange[0]);
                                                    const maxDistance = Math.abs(value - priceRange[1]);
                                                    
                                                    if (minDistance < maxDistance) {
                                                        // Update min
                                                        setPriceRange([
                                                            Math.min(value, priceRange[1] - 10),
                                                            priceRange[1]
                                                        ]);
                                                    } else {
                                                        // Update max
                                                        setPriceRange([
                                                            priceRange[0],
                                                            Math.max(value, priceRange[0] + 10)
                                                        ]);
                                                    }
                                                }}
                                            >
                                                {/* Min Handle */}
                                                <div 
                                                    className="absolute top-2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-lg transform -translate-x-1/2 cursor-pointer z-10"
                                                    style={{ left: `${(priceRange[0] / 1000) * 100}%` }}
                                                    onMouseDown={(e) => startDragging(e, 'min')}
                                                    onTouchStart={(e) => startDragging(e, 'min')}
                                                >
                                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                        ${priceRange[0]}
                                                    </div>
                                                </div>
                                                
                                                {/* Max Handle */}
                                                <div 
                                                    className="absolute top-2 w-6 h-6 bg-white border-2 border-purple-500 rounded-full shadow-lg transform -translate-x-1/2 cursor-pointer z-10"
                                                    style={{ left: `${(priceRange[1] / 1000) * 100}%` }}
                                                    onMouseDown={(e) => startDragging(e, 'max')}
                                                    onTouchStart={(e) => startDragging(e, 'max')}
                                                >
                                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                        ${priceRange[1]}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* Sort By */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h4>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'newest', label: 'Newest Arrivals' },
                                            { value: 'price_asc', label: 'Price: Low to High' },
                                            { value: 'price_desc', label: 'Price: High to Low' },
                                            { value: 'name_asc', label: 'Name: A to Z' },
                                            { value: 'name_desc', label: 'Name: Z to A' }
                                        ].map((option) => (
                                            <div key={option.value} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`sort-${option.value}`}
                                                    name="sort"
                                                    value={option.value}
                                                    checked={sortBy === option.value}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor={`sort-${option.value}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* <button
                                    onClick={applyFilters}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    Apply Filters
                                </button> */}
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            {/* Mobile Filter Button */}
                            <div className="lg:hidden mb-6">
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FunnelIcon className="h-5 w-5" />
                                    <span className="font-medium">Filters</span>
                                    {activeFilters.length > 0 && (
                                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                            {activeFilters.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Products Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Our Products</h2>
                                    <p className="text-gray-600 mt-1">
                                        {loading ? '' : `Showing ${Math.min(visibleProducts, products.length)} of ${products.length} products`}
                                    </p>
                                </div>
                                <Link
                                    href={route('products.index')}
                                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    View All Products
                                    <ArrowRightIcon className="h-5 w-5" />
                                </Link>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : !hasProducts ? (
                                <div className="bg-white rounded-lg p-8 text-center">
                                    <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.slice(0, visibleProducts).map((product) => (
                                            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                                                <Link href={route('products.show', product.slug)}>
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={getImageUrl(product)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/images/default-product.png';
                                                            }}
                                                        />
                                                    </div>
                                                </Link>
                                                
                                                <div className="p-4">
                                                    <Link href={route('products.show', product.slug)}>
                                                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                    
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <div>
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {formatPrice(product.sale_price || product.price)}
                                                            </span>
                                                            {product.sale_price && (
                                                                <span className="ml-2 text-sm text-gray-500 line-through">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        <button
                                                            onClick={() => addToCart(product)}
                                                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <ShoppingCartIcon className="h-4 w-4" />
                                                            
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Load More Button */}
                                    {visibleProducts < products.length && (
                                        <div className="text-center mt-8">
                                            <button
                                                onClick={loadMoreProducts}
                                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Load More ({products.length - visibleProducts} remaining)
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Categories Filter */}
                                {hasCategories && (
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                                        <div className="space-y-2">
                                            {categories.map((category) => (
                                                <div key={category.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`mobile-category-${category.id}`}
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => handleCategoryCheckbox(category.id)}
                                                        className="h-5 w-5 text-blue-600 rounded border-gray-300"
                                                    />
                                                    <label htmlFor={`mobile-category-${category.id}`} className="ml-3 text-gray-700">
                                                        {category.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price Range Filter */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            step="10"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                            className="w-full"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            step="10"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                                    <div className="space-y-2">
                                        {['newest', 'price_asc', 'price_desc', 'name_asc', 'name_desc'].map((option) => (
                                            <div key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`mobile-sort-${option}`}
                                                    name="mobile-sort"
                                                    value={option}
                                                    checked={sortBy === option}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor={`mobile-sort-${option}`} className="ml-3 text-gray-700 capitalize">
                                                    {option.replace('_', ' ')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => {
                                        applyFilters();
                                        setShowMobileFilters(false);
                                    }}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Featured Products */}
            {hasFeaturedProducts && (
                <div id="featured" className="py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <SparklesIcon className="h-6 w-6 text-yellow-500" />
                                    <span className="text-sm font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                                        FEATURED COLLECTION
                                    </span>
                                </div>
                            </div>
                            
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <div key={product.id} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="relative overflow-hidden">
                                        <Link href={route('products.show', product.slug)}>
                                            <img
                                                src={getImageUrl(product)}
                                                alt={product.name}
                                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/default-product.png';
                                                }}
                                            />
                                        </Link>
                                        {product.is_featured && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded">
                                                FEATURED
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-4">
                                        <Link href={route('products.show', product.slug)}>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="mt-2 flex items-center justify-between">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatPrice(product.sale_price || product.price)}
                                                </span>
                                                {product.sale_price && (
                                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                                        {formatPrice(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                            >
                                                <ShoppingCartIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12 md:hidden">
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                            >
                                View All Products
                                <ArrowRightIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Features Section */}
            <div className="bg-gray-900 text-white py-12 mt-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-blue-400">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-white">Quality Products</h3>
                            <p className="mt-2 text-gray-300">
                                We guarantee the highest quality for all our products.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-green-400">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-white">Fast Delivery</h3>
                            <p className="mt-2 text-gray-300">
                                Get your products delivered quickly to your doorstep.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="mx-auto h-12 w-12 text-purple-400">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-white">Secure Payment</h3>
                            <p className="mt-2 text-gray-300">
                                Your payment information is always secure with us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollbar Hide Style */}
            <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </Layout>
    );
};

export default Welcome;