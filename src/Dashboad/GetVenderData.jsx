import React, { useState, useMemo, useEffect, useRef } from 'react';

import { Search, MapPin, Star, Phone, User, XCircle, ChevronRight } from 'lucide-react';
import { getVendersData } from '../API';


const useOutsideAlerter = (ref, action) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        action();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, action]);
};

// --- Modal Component ---
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export const GetVenderData = ({passVender} ) => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showVendorDetails, setShowVendorDetails] = useState(false);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  // --- Fetch Vendors from Backend ---
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await getVendersData();
        if (res.data.success) {
          setVendors(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  // --- Filter Vendors by Search ---
  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;
    return vendors.filter(vendor =>
      vendor.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorLocation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, vendors]);

  // --- Handlers ---
  const handleSimpleSelect = (vendor) => {
    passVender(vendor);
    setSelectedVendor(vendor);
    setSearchTerm(vendor.vendorName);
    setIsOpen(false);
    setShowVendorDetails(false);
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setSearchTerm(vendor.vendorName);
    setIsOpen(false);
    setShowVendorDetails(true);
  };

  const handleClearSelection = () => {
    setSelectedVendor(null);
    setSearchTerm('');
    setIsOpen(true);
    setShowVendorDetails(false);
  };

  return (
    <div className=" bg-gray-50 p-2 sm:p-2 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center">
     Selecte Vendor
        </h1>

        {/* Searchable Dropdown */}
        <div ref={wrapperRef} className="relative mb-3 shadow-xl rounded-xl bg-white">
          <div className="relative flex items-center border border-gray-300 rounded-xl">
            <Search className="w-5 h-5 text-gray-400 ml-4 absolute" />
            <input
              type="text"
              placeholder="Search for a vendor by name or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
                setSelectedVendor(null);
                setShowVendorDetails(false);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-12 pr-12 py-3 text-lg text-gray-800 rounded-xl focus:outline-none"
            />
            {selectedVendor && (
              <button
                onClick={handleClearSelection}
                className="absolute right-4 text-gray-500 hover:text-red-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <div
                    key={vendor._id}
                    className="flex justify-between items-center p-2 sm:p-3 hover:bg-indigo-50 border-b last:border-b-0"
                  >
                    <div
                      onClick={() => handleSimpleSelect(vendor)}
                      className="flex flex-col flex-grow cursor-pointer p-1 sm:p-2"
                    >
                      <span className="font-semibold text-gray-800 flex items-center">
                        <User className="w-4 h-4 text-indigo-500 mr-2" />
                        {vendor.vendorName}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1" />
                        {vendor.vendorLocation}
                      </span>
                    </div>

                    <button
                      onClick={() => handleViewDetails(vendor)}
                      className="ml-4 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 font-medium rounded-full hover:bg-indigo-200 flex items-center"
                    >
                      View
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No vendors found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Vendor Details */}
      <Modal
        isOpen={showVendorDetails}
        onClose={() => setShowVendorDetails(false)}
        title={selectedVendor ? `Details for ${selectedVendor.vendorName}` : 'Vendor Details'}
      >
        {selectedVendor && (
          <div className="flex flex-col space-y-5">
            <h4 className="text-xl font-bold text-indigo-600 border-b pb-2">Service Information</h4>
            <div className="flex items-center text-lg">
              <Star className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" />
              <span className="font-semibold text-gray-700">
                {selectedVendor.rating?.toFixed(1) || "N/A"} / 5.0
              </span>
              <span className="ml-4 text-gray-500 text-sm italic">
                ({selectedVendor.reviews || "No reviews yet"})
              </span>
            </div>
            <div className="flex items-center text-lg">
              <MapPin className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-gray-700">{selectedVendor.vendorLocation}</span>
            </div>
            <div className="flex items-center text-lg">
              <Phone className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-gray-700">{selectedVendor.vendorPhoneNo}</span>
            </div>
            <div className="pt-4 border-t mt-4">
              
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};


