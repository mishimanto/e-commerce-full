import React, { useState, useEffect } from 'react';
import AdminLayout from '../Layout/AdminLayout';
import { Link, usePage, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';

const Index = ({ categories }) => {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        image: null
    });
    const [formErrors, setFormErrors] = useState({});

    // Flash messages clear করবে
    useEffect(() => {
        if (flash.success || flash.error) {
            const timer = setTimeout(() => {
                router.get(route('admin.categories.index'));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors({});
        
        const url = editingCategory 
            ? route('admin.categories.update', editingCategory.id)
            : route('admin.categories.store');
        
        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        form.append('is_active', formData.is_active ? 1 : 0);
        
        if (formData.image instanceof File) {
            form.append('image', formData.image);
        }
        
        if (editingCategory) {
            // PUT request with _method
            form.append('_method', 'PUT');
            router.post(url, form, {
                forceFormData: true,
                onError: (errors) => {
                    setFormErrors(errors);
                },
                onSuccess: () => {
                    resetForm();
                }
            });
        } else {
            router.post(url, form, {
                forceFormData: true,
                onError: (errors) => {
                    setFormErrors(errors);
                },
                onSuccess: () => {
                    resetForm();
                }
            });
        }
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            is_active: category.is_active,
            image: null // নতুন ইমেজ আপলোডের জন্য null রাখুন
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            is_active: true,
            image: null
        });
        setEditingCategory(null);
        setFormErrors({});
        setShowModal(false);
    };

    const getImageUrl = (category) => {
        if (category.image) {
            // URL ঠিক করুন
            const imagePath = category.image.replace(/\\\\/g, '/').replace(/\\/g, '/');
            return `/storage/${imagePath}`;
        }
        return null;
    };

    const handleDelete = (category) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', category.id));
        }
    };

    return (
        <AdminLayout>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Category
                    </button>
                </div>

                {/* Flash Messages */}
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

                {/* Categories List */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {categories.data && categories.data.map((category) => (
                            <li key={category.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {category.image ? (
                                                <img
                                                    className="h-12 w-12 object-cover rounded"
                                                    src={getImageUrl(category)}
                                                    alt={category.name}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/images/default-category.png';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                                                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {category.slug}
                                                </div>
                                                {category.description && (
                                                    <p className="mt-1 text-sm text-gray-500 truncate">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                category.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <button
                                                onClick={() => handleEditClick(category)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Category Modal */}
                {showModal && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                required
                                            />
                                            {formErrors.name && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                rows={3}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Category Image
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                <div className="space-y-1 text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                            <span>Upload image</span>
                                                            <input
                                                                type="file"
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
                                                    {formData.image && (
                                                        <p className="text-sm text-gray-500">
                                                            {formData.image.name || 'Image selected'}
                                                        </p>
                                                    )}
                                                    {editingCategory && editingCategory.image && !formData.image && (
                                                        <p className="text-sm text-gray-500">
                                                            Current image will be kept
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {formErrors.image && (
                                                <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                                            )}
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

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {editingCategory ? 'Update Category' : 'Create Category'}
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