import React, { useState } from 'react';
import AdminLayout from '../Layout/AdminLayout';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    PencilIcon, 
    TrashIcon, 
    PlusIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

const Index = ({ products, categories }) => {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        price: '',
        sale_price: '',
        stock_quantity: '',
        sku: '',
        is_featured: false,
        is_active: true,
        images: [],
        existing_images: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = new FormData();
        
        // Add form fields
        submitData.append('name', formData.name);
        submitData.append('category_id', formData.category_id);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        submitData.append('sale_price', formData.sale_price || '');
        submitData.append('stock_quantity', formData.stock_quantity);
        submitData.append('sku', formData.sku);
        submitData.append('is_featured', formData.is_featured ? 1 : 0);
        submitData.append('is_active', formData.is_active ? 1 : 0);
        
        // Handle images
        if (formData.images && formData.images.length > 0) {
            formData.images.forEach((file) => {
                if (file instanceof File) {
                    submitData.append('images[]', file);
                }
            });
        }
        
        // Handle existing images for edit
        if (editingProduct && formData.existing_images && formData.existing_images.length > 0) {
            formData.existing_images.forEach((image) => {
                submitData.append('existing_images[]', image);
            });
        }

        if (editingProduct) {
            submitData.append('_method', 'PUT');
            router.post(route('admin.products.update', editingProduct.id), submitData, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                }
            });
        } else {
            router.post(route('admin.products.store'), submitData, {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                }
            });
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            images: files
        });
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        
        // Parse images
        let images = [];
        let existingImages = [];
        
        if (product.images) {
            try {
                const parsedImages = typeof product.images === 'string' 
                    ? JSON.parse(product.images) 
                    : product.images;
                    
                if (Array.isArray(parsedImages)) {
                    existingImages = parsedImages;
                }
            } catch (e) {
                console.error('Error parsing images:', e);
            }
        }
        
        setFormData({
            name: product.name || '',
            category_id: product.category_id?.toString() || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            sale_price: product.sale_price?.toString() || '',
            stock_quantity: product.stock_quantity?.toString() || '',
            sku: product.sku || '',
            is_featured: product.is_featured || false,
            is_active: product.is_active !== undefined ? product.is_active : true,
            images: [],
            existing_images: existingImages
        });
        setShowModal(true);
    };

    const getFirstImageUrl = (product) => {
        if (!product.images) return null;
        
        try {
            const images = typeof product.images === 'string' 
                ? JSON.parse(product.images) 
                : product.images;
            
            if (Array.isArray(images) && images.length > 0) {
                return `/storage/${images[0]}`;
            }
        } catch (e) {
            console.error('Error parsing images:', e);
        }
        
        return null;
    };

    const handleRemoveImage = (index) => {
        const newExistingImages = [...formData.existing_images];
        newExistingImages.splice(index, 1);
        setFormData({
            ...formData,
            existing_images: newExistingImages
        });
    };

    return (
        <AdminLayout>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                name: '',
                                category_id: '',
                                description: '',
                                price: '',
                                sale_price: '',
                                stock_quantity: '',
                                sku: '',
                                is_featured: false,
                                is_active: true,
                                images: [],
                                existing_images: []
                            });
                            setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Product
                    </button>
                </div>

                {flash.success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {products.data && products.data.map((product) => {
                            const imageUrl = getFirstImageUrl(product);
                            const category = categories.find(c => c.id === product.category_id);
                            
                            return (
                                <li key={product.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {imageUrl ? (
                                                    <img
                                                        className="h-16 w-16 object-cover rounded"
                                                        src={imageUrl}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'images/1.jpg';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                        <PhotoIcon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-indigo-600">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {category?.name || 'No Category'} • SKU: {product.sku}
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="text-lg font-bold text-gray-900">
                                                            ${parseFloat(product.price).toFixed(2)}
                                                        </span>
                                                        {product.sale_price && (
                                                            <span className="ml-2 text-sm text-gray-500 line-through">
                                                                ${parseFloat(product.sale_price).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    product.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                {product.is_featured && (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Featured
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <Link
                                                    href={route('admin.products.destroy', product.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                    confirm="Are you sure you want to delete this product?"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Product Modal */}
                {showModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Product Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Category *
                                                </label>
                                                <select
                                                    value={formData.category_id}
                                                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories && categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description *
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                rows={3}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Price ($) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Sale Price ($)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={formData.sale_price}
                                                    onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Stock Quantity *
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.stock_quantity}
                                                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                SKU *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.sku}
                                                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Product Images
                                            </label>
                                            
                                            {/* Existing Images */}
                                            {formData.existing_images && formData.existing_images.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.existing_images.map((image, index) => (
                                                            <div key={index} className="relative">
                                                                <img
                                                                    src={`/storage/${image}`}
                                                                    alt={`Existing ${index}`}
                                                                    className="h-20 w-20 object-cover rounded"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* New Images Upload */}
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                <div className="space-y-1 text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                            <span>Upload images</span>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                className="sr-only"
                                                                onChange={handleImageChange}
                                                                accept="image/*"
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF up to 2MB
                                                    </p>
                                                    {formData.images.length > 0 && (
                                                        <p className="text-sm text-gray-500">
                                                            {formData.images.length} new file(s) selected
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="is_featured"
                                                    checked={formData.is_featured}
                                                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                                                    Featured Product
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="is_active"
                                                    checked={formData.is_active}
                                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {editingProduct ? 'Update Product' : 'Create Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Index;