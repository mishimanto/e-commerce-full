import React, { useState, useEffect } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, router } from '@inertiajs/react';
import ProductGrid from '@/Components/ProductGrid';
import ProductFilters from '@/Components/ProductFilters';

const Index = ({ products, categories, filters }) => {
    // Initialize state from filters
    const [selectedCategories, setSelectedCategories] = useState(() => {
        if (!filters?.categories) return [];
        
        if (Array.isArray(filters.categories)) {
            return filters.categories.map(id => parseInt(id));
        }
        
        if (typeof filters.categories === 'string') {
            return filters.categories.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        }
        
        return [];
    });
    
    const [priceRange, setPriceRange] = useState(() => [
        parseInt(filters?.min_price) || 0,
        parseInt(filters?.max_price) || 1000
    ]);
    
    const [sortBy, setSortBy] = useState(() => filters?.sort || 'newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(null);

    // Apply filters function
    const applyFilters = () => {
        setLoading(true);
        
        const params = {};
        
        // Add category filters
        if (selectedCategories.length > 0) {
            params.categories = selectedCategories.join(',');
        }
        
        // Add price filters
        if (priceRange[0] > 0 || priceRange[1] < 1000) {
            params.min_price = priceRange[0];
            params.max_price = priceRange[1];
        }
        
        // Add sort
        if (sortBy && sortBy !== 'newest') {
            params.sort = sortBy;
        }
        
        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    };

    // Debounced filter application
    useEffect(() => {
        if (timer) {
            clearTimeout(timer);
        }
        
        const newTimer = setTimeout(() => {
            applyFilters();
        }, 500); // 500ms debounce
        
        setTimer(newTimer);
        
        return () => {
            if (newTimer) {
                clearTimeout(newTimer);
            }
        };
    }, [selectedCategories, priceRange, sortBy]);

    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 1000]);
        setSortBy('newest');
        
        // Clear URL params
        router.get(route('products.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleCategoryToggle = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(prev => prev.filter(id => id !== categoryId));
        } else {
            setSelectedCategories(prev => [...prev, categoryId]);
        }
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    return (
        <Layout>
            <Head title="Products" />
            
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden mb-6">
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span className="font-medium">Filters</span>
                            {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    Active
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                        {/* Filters Sidebar */}
                        <div className="hidden lg:block">
                            <ProductFilters 
                                categories={categories || []} 
                                selectedCategories={selectedCategories}
                                onCategoryToggle={handleCategoryToggle}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                sortBy={sortBy}
                                onSortChange={handleSortChange}
                                onClearFilters={clearFilters}
                            />
                        </div>
                        
                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {loading ? '' : `${products.data.length} products found`}
                                        </h2>
                                    </div>
                                    
                                    {/* Sort Dropdown */}
                                    <div className="mt-4 sm:mt-0">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            className="block w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="newest">Newest Arrivals</option>
                                            <option value="price_asc">Price: Low to High</option>
                                            <option value="price_desc">Price: High to Low</option>
                                            <option value="name_asc">Name: A to Z</option>
                                            <option value="name_desc">Name: Z to A</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {loading ? (
                                <div className="flex justify-center items-center min-h-[400px]">
                                    <div className="text-center">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        <p className="mt-4 text-gray-600">Loading products...</p>
                                    </div>
                                </div>
                            ) : (
                                <ProductGrid products={products} />
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
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Categories */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {categories?.map((category) => (
                                            <div key={category.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`mobile-category-${category.id}`}
                                                    checked={selectedCategories.includes(category.id)}
                                                    onChange={() => handleCategoryToggle(category.id)}
                                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <label htmlFor={`mobile-category-${category.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer flex-1">
                                                    {category.name}
                                                </label>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {category.products_count || 0}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-gray-900">
                                                ${priceRange[0]} - ${priceRange[1]}
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h4>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="name_asc">Name: A to Z</option>
                                        <option value="name_desc">Name: Z to A</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                >
                                    Clear Filters
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Index;