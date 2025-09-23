import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

// Main App component for the form.
const AddSalesItem = ({ parentId }) => {
    // Array of available vendors for the dropdown menu.
    const vendors = [
        { vendor_id: 1, vendor_name: "Perfect Urban Services", vendorLocation: "Bengaluru, Karnataka" },
        { vendor_id: 2, vendor_name: "CleanUp Crew", vendorLocation: "Mumbai, Maharashtra" },
        { vendor_id: 3, vendor_name: "Eco-Friendly Homes", vendorLocation: "Delhi, India" },
    ];
    
    // Array of available products for the dropdown menu.
    const products = [
        { product_name: "Deep Cleaning", og_product_id: 102, tag: "2 BATHROOMS" },
        { product_name: "Pest Control", og_product_id: 201, tag: "APARTMENT" },
        { product_name: "Sofa Cleaning", og_product_id: 305, tag: "FABRIC & LEATHER" },
        { product_name: "Appliance Repair", og_product_id: 410, tag: "MAJOR APPLIANCES" },
        { product_name: "Deep Cleaning", og_product_id: 102, tag: "1 BHK" },
        { product_name: "Pest Control", og_product_id: 201, tag: "VILLA" },
    ];

    // State to control the visibility of the modal popup.
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial state for the new item form data.
    const initialFormData = {
        description: "",
        duration: "",
        item_price: "",
        location_booking_time: "",
        og_product_id: "",
        originalPrice: "",
        product_name: "",
        product_purchase_id: "",
        tag: "",
        discount: "",
        customServiceNote: "",
        vendor_details: {
            vendorLocation: "",
            vendor_id: "",
            vendor_name: ""
        }
    };

    // State for managing the form input values.
    const [newItem, setNewItem] = useState(initialFormData);
    const uniqueTags = [...new Set(products.map(p => p.tag))];

    // Opens the modal when the "Add New" button is clicked.
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Closes the modal and resets the form data.
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewItem(initialFormData); // Reset form data
    };

    // Handles changes to form inputs, including nested fields and the vendor dropdown.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let updatedItem = { ...newItem, [name]: value };

        // Handle product name selection from dropdown
        if (name === "product_name") {
            const selectedProduct = products.find(p => p.product_name === value);
            if (selectedProduct) {
                updatedItem = {
                    ...updatedItem,
                    og_product_id: selectedProduct.og_product_id,
                    tag: selectedProduct.tag,
                };
            }
        }
        
        // Handle vendor name selection from dropdown
        if (name === "vendor_name") {
            const selectedVendor = vendors.find(v => v.vendor_name === value);
            if (selectedVendor) {
                updatedItem = {
                    ...updatedItem,
                    vendor_details: selectedVendor
                };
            }
        }

        // Handle discount calculation
        if (name === "discount" || name === "originalPrice") {
            const originalPrice = parseFloat(updatedItem.originalPrice);
            const discount = parseFloat(updatedItem.discount) || 0;
            if (!isNaN(originalPrice) && !isNaN(discount)) {
                updatedItem.item_price = originalPrice - (originalPrice * discount / 100);
            }
        }
        
        setNewItem(updatedItem);
    };

    // Handles form submission.
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Generate a new product_purchase_id based on parentId, item_price, and timestamp
        const timestamp = Date.now();
        const generatedPurchaseId = `${parentId}_${newItem.item_price}_${timestamp}`;

        // Generate the description string based on form data
        const generatedDescription = `${newItem.product_name} with tag "${newItem.tag}" for ${newItem.duration} on ${newItem.location_booking_time}`;

        // Create the final item object to be submitted/logged
        const itemToSubmit = {
            ...newItem,
            description: generatedDescription,
            product_purchase_id: generatedPurchaseId,
        };

        // Log the new item data to the console as requested.
        console.log("Submitted new item:", itemToSubmit);
        
        // Close the modal.
        handleCloseModal();
    };

    return (
        <div className=" flex flex-col items-center justify-center">
            {/* Main content container */}
            <div className="w-full max-w-lg flex flex-col items-center">
                <button 
                    onClick={handleOpenModal} 
                    className="bg-zinc-900 text-white rounded-full py-2 px-6 flex items-center space-x-2 shadow-lg hover:bg-zinc-800 transition-all duration-300 transform active:scale-95"
                >
                    <PlusCircle size={20} />
                    <span className="text-sm md:text-base font-semibold">Add New Item</span>
                </button>
            </div>

            {/* Modal Popup for adding new item */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-zinc-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                        {/* Close button */}
                        <button 
                            onClick={handleCloseModal} 
                            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Add New Cart Item</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Product Info Fields */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700">Product Name</label>
                                <select 
                                    name="product_name" 
                                    value={newItem.product_name} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500"
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product, index) => (
                                        <option key={`${product.og_product_id}-${index}`} value={product.product_name}>
                                            {product.product_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700">Tag</label>
                                <select 
                                    name="tag" 
                                    value={newItem.tag} 
                                    onChange={handleInputChange} 
                                    required
                                    className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500"
                                >
                                    <option value="">Select a tag</option>
                                    {uniqueTags.map((tag, index) => (
                                        <option key={index} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700">Original Price (₹)</label>
                                    <input type="number" name="originalPrice" value={newItem.originalPrice} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700">Discount (%)</label>
                                    <input type="number" name="discount" value={newItem.discount} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700">Item Price (₹)</label>
                                    <input type="number" name="item_price" value={newItem.item_price} readOnly disabled className="mt-1 block w-full px-4 py-2 bg-zinc-200 border border-zinc-300 rounded-xl shadow-sm cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700">Duration</label>
                                    <input type="text" name="duration" value={newItem.duration} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700">Booking Date</label>
                                    <input type="date" name="location_booking_time" value={newItem.location_booking_time} onChange={handleInputChange} className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700">Custom Service Note</label>
                                <textarea name="customServiceNote" value={newItem.customServiceNote} onChange={handleInputChange} rows="3" className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500" />
                            </div>

                            {/* Vendor Details Fields */}
                            <div className="pt-4 border-t border-zinc-200">
                                <h3 className="text-lg font-bold text-zinc-800 mb-2">Vendor Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700">Vendor Name</label>
                                    <select 
                                        name="vendor_name" 
                                        value={newItem.vendor_details.vendor_name} 
                                        onChange={handleInputChange} 
                                        className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm focus:ring-zinc-500 focus:border-zinc-500"
                                    >
                                        <option value="">Select a vendor</option>
                                        {vendors.map(vendor => (
                                            <option key={vendor.vendor_id} value={vendor.vendor_name}>
                                                {vendor.vendor_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700">Vendor ID</label>
                                        <input 
                                            type="number" 
                                            name="vendor_id" 
                                            value={newItem.vendor_details.vendor_id} 
                                            readOnly 
                                            disabled
                                            className="mt-1 block w-full px-4 py-2 bg-zinc-200 border border-zinc-300 rounded-xl shadow-sm cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700">Vendor Location</label>
                                        <input 
                                            type="text" 
                                            name="vendor_location" 
                                            value={newItem.vendor_details.vendorLocation} 
                                            readOnly 
                                            disabled
                                            className="mt-1 block w-full px-4 py-2 bg-zinc-200 border border-zinc-300 rounded-xl shadow-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <div className="flex justify-end space-x-4 mt-6">
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal} 
                                    className="px-6 py-2 border border-zinc-300 rounded-full text-zinc-700 font-semibold hover:bg-zinc-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-zinc-900 text-white rounded-full font-semibold shadow-lg hover:bg-zinc-800 transition-all duration-300"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddSalesItem;
