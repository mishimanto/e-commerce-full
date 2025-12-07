import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const ProductFilters = ({
    categories = [],
    selectedCategories = [],
    onCategoryToggle,
    priceRange = [0, 1000],
    setPriceRange,
    sortBy = 'newest',
    onSortChange,
    onClearFilters,
    isMobile = false
}) => {
    const [dragging, setDragging] = useState(null);

    // Dragging logic - Welcome.jsx এর মতো
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

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${!isMobile ? 'sticky top-6' : ''}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
            </div>

            {/* Categories Filter - Welcome.jsx এর মতো */}
            {categories.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Categories</h4>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="all-categories"
                                checked={selectedCategories.length === 0}
                                onChange={() => onCategoryToggle('all')} // 'all' টা handle করতে হবে parent এ
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
                                    onChange={() => onCategoryToggle(category.id)}
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

            {/* Price Range Filter - Welcome.jsx এর মতো */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
                
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                            ${priceRange[0]} - ${priceRange[1]}
                        </div>
                    </div>

                    {/* Custom Slider Container - Welcome.jsx এর মতো */}
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

            {/* Sort By - Welcome.jsx এর মতো */}
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
                                onChange={(e) => onSortChange(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`sort-${option.value}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {!isMobile && (
                <button
                    onClick={onClearFilters}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
};

export default ProductFilters;