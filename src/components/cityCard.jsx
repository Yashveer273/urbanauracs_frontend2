import React, { useState, useEffect } from "react";
export default function CityCards({ setMyCity }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const cities = [
    "Delhi", "Gurgaon", "Faridabad", "Chandigarh", "Ghaziabad", "Noida",
    "Kolkata", "Mumbai", "Pune", "Varanasi", "Mathura", "Patna",
    "Meerut", "Jaipur", "Ranchi", "Lucknow", "Ahmedabad", "Dehradun",
    "Jammu", "Gwalior", "Bhopal", "Indore", "Hyderabad", "Bengaluru",
    "Mysore", "Allahabad"
  ];
// Logic to stop background scrolling
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup if component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setIsModalOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCitySelect = (cityName) => {
    setIsModalOpen(false);
    setMyCity(cityName);
  };

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>
        {`
          .modal-fade {
            opacity: 0;
            transform: translateY(20px);
            animation: modalFadeIn 0.3s ease-out forwards;
          }
          @keyframes modalFadeIn {
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      
      {isModalOpen && (
        <div className="fixed mt-20 inset-0 flex items-end md:items-center justify-center z-[100] bg-black/50 modal-fade">
          {/* Modal Container */}
          <div className="bg-white w-full h-[90vh] md:h-auto md:max-h-[80vh] md:max-w-4xl md:rounded-xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header Area */}
            <div className="p-4 md:p-6 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-base md:text-xl font-semibold text-gray-800">Where do you need House Cleaning service</h1>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-gray-400 hover:text-red-500 text-2xl p-2"
                >
                  ✕
                </button>
              </div>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search for your city" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-0 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-3">
                {filteredCities.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className="
                      w-full text-left px-6 py-4 border-b border-gray-50
                      md:w-auto md:text-center md:px-2 md:py-2 md:border md:border-gray-200 md:rounded-lg md:bg-white md:hover:bg-blue-50 md:hover:border-blue-200
                      transition-all active:bg-gray-100 md:active:scale-95 cursor-pointer select-none
                    "
                  >
                    <p className="text-gray-700 font-normal md:text-sm text-[15px]">{city}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}