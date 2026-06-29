import React, { useMemo, useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { GetVenderData } from "./GetVenderData";
import axios from "axios";
import { API_BASE_URL } from "../API";
import { CalculateConvenienceFee } from "../components/TexFee";


// Main App component for the form.
const AddSalesItem = ({ userData,selectedProductInfo }) => {
  // Array of available products for the dropdown menu.
  const products = [
    { product_name: "Deep Cleaning", og_product_id: 102, description: "2 BATHROOMS" },
    { product_name: "Other", og_product_id: 102, description: "Other" },
    { product_name: "Pest Control", og_product_id: 201, description: "APARTMENT" },
    {
      product_name: "Sofa Cleaning",
      og_product_id: 305,
      description: "FABRIC & LEATHER",
    },
    {
      product_name: "Appliance Repair",
      og_product_id: 410,
      description: "MAJOR APPLIANCES",
    },
    { product_name: "Deep Cleaning", og_product_id: 102, description: "1 BHK" },
    { product_name: "Pest Control", og_product_id: 201, description: "VILLA" },
  ];

  // State to control the visibility of the modal popup.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial state for the new item form data.
  const initialFormData = {
    description: "",
    duration: "",
    item_price: "",
quantity:0,
    og_product_id: "",
    originalPrice: "",
    product_name: "",
    product_purchase_id: "",

    discount: "",
    customServiceNote: "",
    bookingAddress:userData.bookingAddress??"",
    timeFinal: "",
    bookingDate: "",
    vendor_details: {
      vendorlocation: "",
      vendor_id: "",
      vendorName: "",
      
    },
  };

  // State for managing the form input values.
  const [newItem, setNewItem] = useState(initialFormData);
  const [afterConvenienceFee, setAfterConvenienceFee] = useState(0);
  const [total, setTotal] = useState(0);

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
      const selectedProduct = products.find((p) => p.product_name === value);
      if (selectedProduct) {
        updatedItem = {
          ...updatedItem,
          og_product_id: selectedProduct.og_product_id,
          description: selectedProduct.description,
        };
      }
    }

    // Handle discount calculation
    if (name === "discount" || name === "originalPrice") {
      const originalPrice = parseFloat(updatedItem.originalPrice);
      const discount = parseFloat(updatedItem.discount) || 0;
      if (!isNaN(originalPrice) && !isNaN(discount)) {
        updatedItem.item_price =
          originalPrice - (originalPrice * discount) / 100;
        
      }
    }

    setNewItem(updatedItem);
  };

  // Handles form submission.
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Generate a new product_purchase_id based on parentId, item_price, and timestamp
    const timestamp = Date.now();
   

   
    // Create the final item object to be submitted/logged
    const itemToSubmit = {
      ...newItem,
    
      product_purchase_id: timestamp,

    };

  try {
    const res = await axios.post(`${API_BASE_URL}/sales/addNewItemInCart`, {
      S_orderId: selectedProductInfo.S_orderId,
     userId: selectedProductInfo.userData.userId,
      // or however you track the orderId
      newCartItem: itemToSubmit,
      id:selectedProductInfo.id
    });

    if (res.data.success) {
      alert("✅ New item added successfully!");
        handleCloseModal();
    } else {
      alert("❌ Failed to add item");
    }
  } catch (err) {
    console.log("Error adding new item:", err);
    alert("⚠️ Error adding item to cart");
  }
    // Close the modal.

  };
  const passVender = (selectedVendor) => {
   
    const data = {
      vendorName: selectedVendor.vendorName,
    vendorlocation:selectedVendor.vendorLocation,
  
      vendor_id: selectedVendor._id,
    };

    let updatedItem = {
      ...newItem,
      vendor_details: data,
    };
 
    setNewItem(updatedItem);
  };
  const [open, setOpen] = useState(false);

const timeSlots = [
  "8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM"
];

  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);
  return (
  <div className="flex flex-col items-center justify-center">
    <div className="w-full max-w-lg flex flex-col items-center">
      <button
        onClick={handleOpenModal}
        className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:scale-95"
      >
        <PlusCircle size={18} />
        Add New Item
      </button>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">
                Add New Cart Item
              </h2>
              <p className="text-sm text-zinc-500">
                Fill service, price, booking and vendor details.
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <section className="rounded-2xl border border-zinc-200 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Service Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Product Name
                  </label>
                  <select
                    name="product_name"
                    value={newItem.product_name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  >
                    <option value="">Select a product</option>
                    {products.map((product, index) => (
                      <option
                        key={`${product.og_product_id}-${index}`}
                        value={product.product_name}
                      >
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Original Price ₹
                  </label>
                  <input
                    type="number"
                    required
                    name="originalPrice"
                    value={newItem.originalPrice}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={newItem.discount}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Item Price ₹
                  </label>
                  <input
                    type="number"
                    value={newItem.item_price}
                    readOnly
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Amount Summary
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Total Price ₹
                  </label>
                  <input
                    type="number"
                    value={total}
                    readOnly
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const Total =
                        newItem.item_price * newItem.quantity +
                        CalculateConvenienceFee(
                          newItem.item_price * newItem.quantity
                        ).convenienceFee;

                      setTotal(Total);
                    }}
                    className="mt-2 rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-95"
                  >
                    See Total Amount
                  </button>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Charges Fee ₹
                  </label>
                  <input
                    type="number"
                    value={afterConvenienceFee}
                    readOnly
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const feeAdded = CalculateConvenienceFee(
                        newItem.item_price * newItem.quantity
                      ).convenienceFee;
                      setAfterConvenienceFee(feeAdded);
                    }}
                    className="mt-2 rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-95"
                  >
                    See Charges Fee
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Booking Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={newItem.duration}
                    required
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>

                <div
                  className="relative"
                  onClick={() =>
                    document.getElementById("bookingDate").showPicker()
                  }
                >
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="location_booking_time"
                    min={minDate}
                    id="bookingDate"
                    value={newItem.location_booking_time}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>

                <div className="relative md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Booking Time
                  </label>
                  <input
                    type="text"
                    readOnly
                    name="SelectedServiceTime"
                    required
                    value={newItem.SelectedServiceTime}
                    placeholder="Select Time"
                    onClick={() => setOpen(!open)}
                    className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  {open && (
                    <div className="absolute z-50 mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl">
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {timeSlots.map((slot, index) => {
                          const [start, end] = slot.split(" - ");

                          return (
                            <button
                              type="button"
                              key={index}
                              onClick={() => {
                                setNewItem({
                                  ...newItem,
                                  SelectedServiceTime: slot,
                                });
                                setOpen(false);
                              }}
                              className={`rounded-xl border px-3 py-2 text-center text-sm transition ${
                                newItem.SelectedServiceTime === slot
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                              }`}
                            >
                              <span className="block font-semibold">
                                {start}
                              </span>
                              <span className="block text-[10px] opacity-60">
                                to
                              </span>
                              <span className="block font-semibold">{end}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="bookingAddress"
                    placeholder="Enter Booking Address"
                    value={newItem.bookingAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-200 p-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Vendor Details
              </h3>

              <GetVenderData passVender={passVender} />

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Vendor ID
                  </label>
                  <input
                    type="text"
                    value={newItem.vendor_details.vendor_id}
                    readOnly
                    disabled
                    required
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={newItem.vendor_details.vendorName}
                    readOnly
                    disabled
                    required
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700">
                    Vendor Location
                  </label>
                  <input
                    type="text"
                    value={newItem.vendor_details.vendorlocation}
                    readOnly
                    disabled
                    required
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500"
                  />
                </div>
              </div>
            </section>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white py-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:scale-95"
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
