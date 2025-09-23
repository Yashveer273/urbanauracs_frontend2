import React, { useState, useEffect } from "react";

// The main CityCards component
export default function CityCards({setMyCity}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState(null);

  const cities = [
    "Delhi", "Gurgaon", "Faridabad", "Chandigarh", "Ghaziabad", "Noida",
    "Kolkata", "Mumbai", "Pune", "Varanasi", "Mathura", "Patna",
    "Meerut", "Jaipur", "Ranchi", "Lucknow", "Ahmedabad", "Dehradun",
    "Jammu", "Gwalior", "Bhopal", "Indore", "Hyderabad", "Bengaluru",
    "Mysore", "Allahabad"
  ];

  // Auto-open modal after 2s
  useEffect(() => {
    const timer = setTimeout(() => setIsModalOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCitySelect = (cityName) => {
    setSelectedCityName(cityName);
    
    setIsModalOpen(false);
   
    setMyCity(cityName);
    console.log("Selected City:",selectedCityName, cityName);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 mt-50 mb-20">
          {/* Modal box */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Select Booking City</h1>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-red-500 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable grid */}
            <div className="overflow-y-auto pr-2 flex-1">
              <CityModal cities={cities} onSelectCity={handleCitySelect} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Modal content - city grid
const CityModal = ({ cities, onSelectCity }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {cities.map((city, index) => (
        <CityCard key={index} city={city} onSelectCity={onSelectCity} />
      ))}
    </div>
  );
};

// Individual city card
const CityCard = ({ city, onSelectCity }) => {
  return (
    <button
      onClick={() => onSelectCity(city)}
      className="p-4 rounded-lg shadow-md text-center transition-transform transform 
                 hover:scale-105 active:scale-95 cursor-pointer select-none 
                 bg-gray-100 hover:bg-gray-200 text-black"
    >
      <p className="font-medium text-lg">{city}</p>
    </button>
  );
};
