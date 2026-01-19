import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

const ReusableSearchAutocomplete = ({ data, onItemSelected, BookingCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

 
  const filteredItems = (() => {
    if (!searchTerm) return data;

    const lower = searchTerm.toLowerCase();

    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) &&
        item.location === BookingCity
    );
  })();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleClear = () => {
    setSearchTerm("");
    setIsDropdownOpen(true);
  };

  const handleItemSelect = useCallback(
    (item) => {
      setSearchTerm(item.name);
      setIsDropdownOpen(false);
      onItemSelected(item, item.name);
    },
    [onItemSelected]
  );

  const handleFocus = () => setIsDropdownOpen(true);

  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 150);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && isDropdownOpen && filteredItems.length > 0) {
      e.preventDefault();
      handleItemSelect(filteredItems[0]);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative">
      <div className="relative flex items-center shadow-xl rounded-xl focus-within:ring-4 focus-within:ring-[#f87559] bg-white">
        <div className="absolute left-4 text-[#f87559] pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchTerm}
          placeholder="Search..."
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full py-3.5 pl-12 pr-12 bg-transparent focus:outline-none"
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full w-full mt-2 bg-white border rounded-xl shadow-2xl max-h-40 overflow-y-auto z-20">
          <ul>
            {filteredItems.length ? (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  onMouseDown={() => handleItemSelect(item)}
                  className="cursor-pointer p-3 hover:bg-gray-50"
                >
                  {item.name}
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500 text-center">
                No items found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReusableSearchAutocomplete;
