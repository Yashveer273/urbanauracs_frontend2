import React, { useState, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Filter } from "lucide-react";

const ReusableFilterOnDescriptionSearchAutocomplete = ({
  data,
  onItemSelected,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter vendors based on whether any service.description matches
  const filteredVendors = useMemo(() => {
    if (!searchTerm) return data;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return data
      .map((vendor) => {
        const matchedServices = vendor.services.filter(
          (service) =>
            service.description &&
            service.description.toLowerCase().includes(lowerCaseSearch)
        );
        return { ...vendor, services: matchedServices };
      })
      .filter((vendor) => vendor.services.length > 0);
  }, [searchTerm, data]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    setIsDropdownOpen(true);
    onItemSelected(filteredVendors); // send filtered dataset up
    console.log("Filtered dataset:", filteredVendors);
  };

  const handleClear = () => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    onItemSelected(data); // reset to full dataset
    console.log("Reset dataset:", data);
  };

  const handleItemSelect = useCallback(
    (service) => {
      setSearchTerm(service.description); // keep description in input
      setIsDropdownOpen(false);
      // Return vendors trimmed to only those matching this description
      const newFiltered = data
        .map((vendor) => {
          const matchedServices = vendor.services.filter(
            (s) => s.description === service.description
          );
          return { ...vendor, services: matchedServices };
        })
        .filter((vendor) => vendor.services.length > 0);

      onItemSelected(newFiltered);
      console.log("Selected description, filtered dataset:", newFiltered);
    },
    [data, onItemSelected]
  );

  return (
    <div className="w-full max-w-lg mx-auto relative">
      <div className="relative flex items-center shadow-xl rounded-xl focus-within:ring-4 focus-within:ring-[#f87559] transition-all duration-300 bg-white">
        <div className="absolute left-4 text-[#f87559] pointer-events-none">
          <Filter className="w-5 h-5" />
        </div>

        <input
          type="text"
          placeholder="Search by description..."
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
          className="w-full py-3.5 pl-12 pr-12 text-base text-gray-800 placeholder-gray-400 border-none bg-transparent focus:outline-none focus:ring-0 rounded-xl"
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            aria-label="Clear search input"
            className="absolute right-4 p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-150 z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-40 overflow-y-auto z-20">
          <ul className="divide-y divide-gray-100">
            {filteredVendors.length > 0 ? (
              filteredVendors.flatMap((vendor) =>
                vendor.services.map((service, idx) => (
                  <li
                    key={`${vendor.vendorId}-${idx}`}
                    onMouseDown={() => handleItemSelect(service)}
                    className="cursor-pointer p-3 flex flex-col hover:bg-gray-50 transition-colors duration-100"
                  >
                    <span className="font-medium text-gray-800">
                      {service.description}
                    </span>
                  </li>
                ))
              )
            ) : (
              <li className="p-4 text-gray-500 text-center">
                No items found matching "{searchTerm}".
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReusableFilterOnDescriptionSearchAutocomplete;
