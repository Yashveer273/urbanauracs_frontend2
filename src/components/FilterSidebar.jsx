import React, { useState, useEffect } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";

const FilterSidebar = ({
  onApplyFilters,
  onClose,
  minPrice,
  maxPrice,
  serviceTypes,
  apartmentSize,
  selectedLocation,
  // allServiceTypes,
  allApartmentSizes, // Prop for unique apartment sizes
}) => {
  const [minPriceState, setMinPriceState] = useState(minPrice);
  const [maxPriceState, setMaxPriceState] = useState(maxPrice);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState(
    new Set(serviceTypes)
  );
  const [selectedApartmentSize, setSelectedApartmentSize] =
    useState(apartmentSize); // Changed to a single string
  // const [filteredSizes, setFilteredSizes] = useState(allApartmentSizes); // State for the dropdown list

  const [openSection, setOpenSection] = useState(null);
  const [selectedLocationState, setSelectedLocationState] =
    useState(selectedLocation);

  useEffect(() => {
   
    setMinPriceState(minPrice);
    setMaxPriceState(maxPrice);
    setSelectedServiceTypes(new Set(serviceTypes));
    setSelectedApartmentSize(apartmentSize);
    setSelectedLocationState(selectedLocation);
    // setFilteredSizes(allApartmentSizes);

    if (minPrice !== 400 || maxPrice !== 3000) setOpenSection("price");
    else if (apartmentSize) setOpenSection("size");
    else if (selectedLocation) setOpenSection("location");
    else if (serviceTypes.length > 0) setOpenSection("serviceTypes");
  }, [
    minPrice,
    maxPrice,
    serviceTypes,
    apartmentSize,
    selectedLocation,
    allApartmentSizes,
  ]);

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.id === "min-price-slider") {
      if (value <= maxPriceState) {
        setMinPriceState(value);
      }
    } else {
      if (value >= minPriceState) {
        setMaxPriceState(value);
      }
    }
  };

  // const handleServiceTypeChange = (e) => {
  //   const serviceType = e.target.value;
  //   const newSet = new Set(selectedServiceTypes);
  //   if (e.target.checked) {
  //     newSet.add(serviceType);
  //   } else {
  //     newSet.delete(serviceType);
  //   }
  //   setSelectedServiceTypes(newSet);
  // };

  // const handleApartmentSizeInputChange = (e) => {
  //   const inputValue = e.target.value;
  //   setSelectedApartmentSize(inputValue);
  //   // Filter suggestions based on input
  //   const filtered = allApartmentSizes.filter((size) =>
  //     size.toLowerCase().includes(inputValue.toLowerCase())
  //   );
  //   setFilteredSizes(filtered);
  //   // Open the dropdown when the user starts typing
  //   setOpenSection("size");
  // };

  // const handleApartmentSizeSelect = (size) => {
  //   setSelectedApartmentSize(size);
  //   setFilteredSizes([]); // Hide the dropdown after selection
  // };

  const handleApply = () => {

    onApplyFilters({
      minPrice: minPriceState,
      maxPrice: maxPriceState,
      serviceTypes: Array.from(selectedServiceTypes),
      apartmentSize: selectedApartmentSize, // Pass a single string
      BookingCity: selectedLocationState,
    });
  };

  const handleClear = () => {
    setMinPriceState(minPrice);
    setMaxPriceState(maxPrice);
    setSelectedServiceTypes(new Set());
    setSelectedApartmentSize("");
    setSelectedLocationState("");
    setOpenSection(null);
    onApplyFilters({
      minPrice: 500,
      maxPrice: 10000,
      serviceTypes: [],
      apartmentSize: "",
      BookingCity: "",
    });
  };

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };
  const BookingCities = [
    "Delhi",
    "Gurgaon",
    "Faridabad",
    "Chandigarh",
    "Ghaziabad",
    "Noida",
    "Kolkata",
    "Mumbai",
    "Pune",
    "Varanasi",
    "Mathura",
    "Patna",
    "Meerut",
    "Jaipur",
    "Ranchi",
    "Lucknow",
    "Ahmedabad",
    "Dehradun",
    "Jammu",
    "Gwalior",
    "Bhopal",
    "Indore",
    "Hyderabad",
    "Bengaluru",
    "Mysore",
    "Allahabad",
  ];
  return (
    <div className="filter-sidebar bg-white h-full p-6 shadow-lg flex flex-col font-sans rounded-l-2xl">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          className="text-lg text-gray-500 hover:text-gray-700 ml-4"
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {/* Location Filter */}
        <div className="border-b border-gray-200 py-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("location")}
          >
            <h3 className="font-semibold text-gray-800">Location</h3>
            <div
              className={`p-2 bg-black rounded-full transition-transform duration-300 ${
                openSection === "location" ? "rotate-180" : "rotate-90"
              }`}
            >
              <FaArrowRight className="text-white" />
            </div>
          </div>
          {openSection === "location" && (
            <div className="mt-3">
              <select
                id="Bookinglocation"
                value={selectedLocationState}
                onChange={(e) => setSelectedLocationState(e.target.value)}
                className="w-full bg-transparent focus:outline-none font-semibold text-black placeholder-gray-500 border-b border-gray-600 pb-1 cursor-pointer relative z-10"
              >
                <option value="" disabled hidden>
                  Select Booking City
                </option>
                {BookingCities.map((city, index) => (
                  <option key={index} value={city} className="text-black">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Size of Apartment Filter */}
        {/* <div className="border-b border-gray-200 py-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("size")}
          >
            <h3 className="font-semibold text-gray-800">Size of Apartment</h3>
            <div
              className={`p-2 bg-black rounded-full transition-transform duration-300 ${
                openSection === "size" ? "rotate-180" : "rotate-90"
              }`}
            >
              <FaArrowRight className="text-white" />
            </div>
          </div>
          {openSection === "size" && (
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="e.g., Apartment 2 BHK Furnished"
                value={selectedApartmentSize}
                onChange={handleApartmentSizeInputChange}
                onFocus={() => setOpenSection("size")} // Keep dropdown open on focus
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              {selectedApartmentSize && filteredSizes.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-md shadow-lg z-10 max-h-48 overflow-y-auto mt-1">
                  {filteredSizes.map((size) => (
                    <li
                      key={size}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleApartmentSizeSelect(size)}
                    >
                      {size}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div> */}

        {/* Price Filter */}
        <div className="border-b border-gray-200 py-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("price")}
          >
            <h3 className="font-semibold text-gray-800">Price Range</h3>
            <div
              className={`p-2 bg-black rounded-full transition-transform duration-300 ${
                openSection === "price" ? "rotate-180" : "rotate-90"
              }`}
            >
              <FaArrowRight className="text-white" />
            </div>
          </div>
         {openSection === "price" && (
  <div className="mt-3 space-y-6">

    {/* ---------- MIN PRICE ---------- */}
    <div>
      <div className="flex justify-between text-gray-600 font-bold mb-1">
        <span>Min Price</span>
        <span>₹{minPriceState}</span>
      </div>

      <input
      id="min-price-slider"
        type="range"
        min={minPrice}
        max={maxPrice}
        value={minPriceState}
        onChange={(e) => handlePriceChange(e)}
        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        style={{
          background: `linear-gradient(to right, #f97316 ${
            ((minPriceState - minPrice) / (maxPrice - minPrice)) * 100
          }%, #ddd ${
            ((minPriceState - minPrice) / (maxPrice - minPrice)) * 100
          }%)`,
        }}
      />
    </div>

    {/* ---------- MAX PRICE ---------- */}
    <div>
      <div className="flex justify-between text-gray-600 font-bold mb-1">
        <span>Max Price</span>
        <span>₹{maxPriceState}</span>
      </div>

      <input
         id="max-price-slider"
        type="range"
        min={minPrice}
        max={maxPrice}
        value={maxPriceState}
        onChange={(e) => handlePriceChange(e)}
        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500
        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        style={{
          background: `linear-gradient(to right, #f97316 ${
            ((maxPriceState - minPrice) / (maxPrice - minPrice)) * 100
          }%, #ddd ${
            ((maxPriceState - minPrice) / (maxPrice - minPrice)) * 100
          }%)`,
        }}
      />
    </div>

  </div>
)}

        </div>

        {/* Service Type Filter */}
        {/* <div className="border-b border-gray-200 py-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("serviceTypes")}
          >
            <h3 className="font-semibold text-gray-800">Service Type</h3>
            <div
              className={`p-2 bg-black rounded-full transition-transform duration-300 ${
                openSection === "serviceTypes" ? "rotate-180" : "rotate-90"
              }`}
            >
              <FaArrowRight className="text-white" />
            </div>
          </div>
          {openSection === "serviceTypes" && (
            <ul className="space-y-2 mt-3">
              {allServiceTypes.map((type) => (
                <li key={type}>
                  <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      value={type}
                      checked={selectedServiceTypes.has(type)}
                      onChange={handleServiceTypeChange}
                      className="form-checkbox h-4 w-4 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span>{type}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div> */}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          className="bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          onClick={handleClear}
        >
          Clear All
        </button>
        <button
          className="bg-orange-500 text-white font-medium py-2 px-4 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          onClick={handleApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
