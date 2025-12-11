import React, { useState, useMemo, useCallback } from 'react';
import { Search, X } from 'lucide-react';

// Sample data structure for the autocomplete (spells/items) - Now includes 20 items


const ReusableSearchAutocomplete = ({ data, onItemSelected }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter the list of items based on the search term
  const filteredItems = useMemo(() => {
    if (!searchTerm) {
         return data;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return data.filter(item =>
      item.name.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm, data]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
   setIsDropdownOpen(true);
    console.log("Input Change:", newValue);
  };

  // Handler for clearing the input
  const handleClear = () => {
    setSearchTerm('');
    setIsDropdownOpen(true);
    console.log("Input Cleared:", "");
  };

  const handleItemSelect = useCallback((item) => {
    setSearchTerm(item.name); 
     setIsDropdownOpen(false); 
    onItemSelected(item); 
       console.log("Selected Item and called external function:", item);
  }, [onItemSelected]);

   const handleFocus = () => {
    setIsDropdownOpen(true);
  };

   const handleBlur = () => {
      setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };
  
  const handleKeyDown = (e) => {
   if (e.key === 'Tab' && isDropdownOpen && filteredItems.length > 0) {
      e.preventDefault(); // Prevent default browser focus change
      const selectedItem = filteredItems[0]; // Select the first filtered item
      handleItemSelect(selectedItem);
    }
  };


  return (
    <div className="w-full max-w-lg mx-auto relative">
     
      <div className="relative flex items-center shadow-xl rounded-xl focus-within:ring-4 focus-within:ring-[#f87559] transition-all duration-300 bg-white">
        
   
        <div className="absolute left-4 text-[#f87559] pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

 
        <input
          type="text"
          placeholder="Search for a spell..."
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
           onKeyDown={handleKeyDown} 
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
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  // Using onMouseDown instead of onClick ensures the click is registered before onBlur closes the menu
                  onMouseDown={() => handleItemSelect(item)}
                  className="cursor-pointer p-3 flex items-center hover:bg-gray-50 transition-colors duration-100"
                >
                  <span className="font-medium text-gray-800">{item.name}</span>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500 text-center">No items found matching "{searchTerm}".</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};



export default ReusableSearchAutocomplete;