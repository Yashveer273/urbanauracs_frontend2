import React, { useState, useEffect, useCallback } from 'react';
// We'll use icons from lucide-react (or similar library) for better aesthetics
import { Edit, Trash2, X, PlusCircle, AlertTriangle, CheckCircle, Loader2, List, Save } from 'lucide-react';

import { API_BASE_URL } from "../API"
import { Link } from 'react-router-dom';

// --- Notification Component (Self-hiding) ---
const Notification = ({ message, type, onClose }) => {
    const baseClasses = "flex items-center p-4 rounded-lg shadow-lg mb-2 text-white transition-opacity duration-300";
    let classes = "";
    let Icon = null;

    switch (type) {
        case 'success':
            classes = "bg-green-500";
            Icon = CheckCircle;
            break;
        case 'error':
            classes = "bg-red-500";
            Icon = AlertTriangle;
            break;
        default:
            classes = "bg-gray-500";
            Icon = List;
    }

    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${baseClasses} ${classes}`}>
            <Icon className="w-5 h-5 mr-3" />
            <p className="flex-grow text-sm font-medium">{message}</p>
            <button onClick={onClose} className="ml-4 opacity-75 hover:opacity-100">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

// --- Form Modal Component ---
const VendorFormModal = ({ isOpen, onClose, onSubmit, initialData, isEdit }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {isEdit ? "Edit Vendor" : "Create New Vendor"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="vendorPhoneNo" className="block text-sm font-medium text-gray-700">Vendor Phone No.</label>
                        <input
                            type="tel"
                            id="vendorPhoneNo"
                            name="vendorPhoneNo"
                            value={formData.vendorPhoneNo || ''}
                            onChange={handleChange}
                            required
                           
                            className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                        />
                    </div>
                    <div>
                        <label htmlFor="vendorLocation" className="block text-sm font-medium text-gray-700">vendor Location</label>
                        <input
                            type="text"
                            id="vendorLocation"
                            name="vendorLocation"
                            value={formData.vendorLocation || ''}
                            onChange={handleChange}
                            required
                          
                            className={`mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150 }`}
                        />
                    </div>
                    <div>
                        <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">Vendor Name</label>
                        <input
                            type="text"
                            id="vendorName"
                            name="vendorName"
                            value={formData.vendorName || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                    </div>
                    <div>
                        <label htmlFor="vendorImage" className="block text-sm font-medium text-gray-700">Vendor Image URL (Optional)</label>
                        <input
                            type="url"
                            id="vendorImage"
                            name="vendorImage"
                            value={formData.vendorImage || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                            <input
                                type="number"
                                id="rating"
                                name="rating"
                                min="0" max="5" step="0.1"
                                value={formData.rating === null || formData.rating === undefined ? '' : formData.rating}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                        <div>
                            <label htmlFor="reviews" className="block text-sm font-medium text-gray-700">Number of Reviews</label>
                            <input
                                type="number"
                                id="reviews"
                                name="reviews"
                                min="0"
                                value={formData.reviews === null || formData.reviews === undefined ? '' : formData.reviews}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150">
                            Cancel
                        </button>
                        <button type="submit"
                            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150">
                            <Save className="w-4 h-4 mr-2" />
                            {isEdit ? "Update Vendor" : "Save Vendor"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Confirmation Modal Component ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-red-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Confirm Deletion
                </h3>
                <p className="mb-6 text-gray-700">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Application Component ---
const VandersSection = () => {
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null); // Used for initial form data

    // Confirmation State
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState(null);

    // Helper for API calls with Exponential Backoff
    const safeFetch = useCallback(async (url, options = {}, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
                    throw new Error(errorBody.message || `API request failed with status ${response.status}`);
                }
                return response.json();
            } catch (error) {
                if (i < retries - 1) {
                    const delay = Math.pow(2, i) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }, []);


    // --- CRUD Operations ---

    const fetchVendors = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await safeFetch(`${API_BASE_URL}/api/vendors`);
            setVendors(data.data || []);
            setIsLoading(false);
        } catch (error) {
            setNotification({ message: `Failed to fetch vendors: ${error.message}`, type: 'error' });
            setVendors([]);
            setIsLoading(false);
        }
    }, [safeFetch]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const handleFormSubmit = async (formData) => {
        setIsFormModalOpen(false); // Close modal immediately
        const { _id, ...updateData } = formData;

        try {
            if (isEditMode) {
                // UPDATE operation
                await safeFetch(`${API_BASE_URL}/api/vendors/update/${_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData), // Send only updatable data
                });
                setNotification({ message: `Vendor ${_id} updated successfully.`, type: 'success' });
            } else {
                // CREATE operation
                await safeFetch(`${API_BASE_URL}/api/vendors/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                setNotification({ message: `Vendor ${_id} created successfully.`, type: 'success' });
            }
            fetchVendors(); // Refresh the list
        } catch (error) {
            setNotification({ message: `Operation failed: ${error.message}`, type: 'error' });
        }
    };

    const handleOpenCreate = () => {
        setIsEditMode(false);
        setCurrentVendor({ _id: '',vendorLocation:"" ,vendorPhoneNo:0,vendorName: '', vendorImage: '', rating: null, reviews: null });
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (vendor) => {
        setIsEditMode(true);
        setCurrentVendor(vendor);
        setIsFormModalOpen(true);
    };

    const handleOpenConfirmDelete = (vendor) => {
        setVendorToDelete(vendor);
        setIsConfirmModalOpen(true);
    };

    const handleDelete = async () => {
        if (!vendorToDelete) return;

        setIsConfirmModalOpen(false);
        const { _id } = vendorToDelete;

        try {
            await safeFetch(`${API_BASE_URL}/api/vendors/delete/${_id}`, {
                method: 'DELETE',
            });
            setNotification({ message: `Vendor ${_id} deleted successfully.`, type: 'success' });
            fetchVendors(); // Refresh the list
        } catch (error) {
            setNotification({ message: `Deletion failed: ${error.message}`, type: 'error' });
        } finally {
            setVendorToDelete(null);
        }
    };

    // --- Render Functions ---

    const renderTableBody = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Loading vendors...
                    </td>
                </tr>
            );
        }

        if (vendors.length === 0) {
            return (
                <tr>
                    <td colSpan="6" className="p-4">
                        <div className="p-10 text-center text-gray-400">
                            <List className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding a new vendor.</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return vendors.map(vendor => (
            <tr key={vendor._id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vendor._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {vendor.vendorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {vendor.vendorLocation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {vendor.vendorPhoneNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {vendor.vendorImage ? (
                        <Link to={vendor.vendorImage} className="text-blue-500 hover:text-blue-700 truncate block max-w-xs">
                            View Image
                        </Link>
                    ) : (
                        <span className="text-gray-400">N/A</span>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {vendor.rating !== null && vendor.rating !== undefined ? `${vendor.rating} / 5` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {vendor.reviews !== null && vendor.reviews !== undefined ? vendor.reviews : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                        onClick={() => handleOpenEdit(vendor)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition duration-150"
                        aria-label={`Edit ${vendor.vendorName}`}
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleOpenConfirmDelete(vendor)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition duration-150"
                        aria-label={`Delete ${vendor.vendorName}`}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </td>
            </tr>
        ));
    };


    return (
        <div className="p-4 md:p-8 bg-gray-100" style={{
    width: "100%"
}}>
            <style>
                {`
                    /* Custom scrollbar for responsive table */
                    .table-container::-webkit-scrollbar { height: 8px; }
                    .table-container::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
                    body { font-family: 'Inter', sans-serif; }
                `}
            </style>

            {/* Notification Area */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </div>

            {/* Header */}
            <header className="mb-8 bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-4xl font-extrabold text-gray-800 border-b pb-2">
                    Vendor Management System
                </h1>
                <p className="text-gray-500 mt-2">Manage vendor information.</p>
            </header>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-700">Vendor List</h2>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02]"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Vendor
                </button>
            </div>

            {/* Vendors Table */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="table-container overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vendor ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vendor Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vendor Phone No.
                                </th>
                              
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image URL
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reviews
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {renderTableBody()}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vendor Form Modal */}
            <VendorFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={currentVendor || {}}
                isEdit={isEditMode}
            />

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDelete}
                message={`Are you sure you want to delete vendor "${vendorToDelete?.vendorName || vendorToDelete?.vendorId}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default VandersSection;
