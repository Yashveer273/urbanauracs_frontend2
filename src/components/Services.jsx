import React from "react";

const Services = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8 scroll-smooth">
      <div className="bg-[#e6f1fb] text-[#f87559] text-sm font-semibold px-4 py-1 mb-5 rounded-full w-fit mx-auto">
             Services
           </div>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center border-white pb-4">
          Our Cleaning Services
        </h2>
        <p className="text-gray-600 font-bold mb-12 text-center border-white pb-4">Discover a range designed to bring comfort and cleanliness into every corner of your home.</p>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          <div className="bg-white text-black rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <img
              src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSl50UiaOipImx_MtPjWZfCUnOzSUHYOXCv63UCKq7-qzj_bfFR"
              alt="Residential Cleaning"
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Residential Cleaning</h3>
              <p className="text-gray-700">
                Thorough cleaning for your home with eco-friendly products.
              </p>
            </div>
          </div>

          <div className="bg-white text-black rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsOLXKm7d8oF7v-3ms6qzDYnY-Fjda5RAMAojnkaa6qE_AIc5G"
              alt="Office Cleaning"
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Office Cleaning</h3>
              <p className="text-gray-700">
                Keep your workspace clean and professional at all times.
              </p>
            </div>
          </div>

          <div className="bg-white text-black rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <img
              src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRbKKMBZdPVJ8rXhJKrKMc5o5VrVeCTzkeQADpowFi7AnmqNGHb"
              alt="Deep Cleaning"
              className="w-full h-56 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Deep Cleaning</h3>
              <p className="text-gray-700">
                Ideal for move-ins, move-outs, and spring cleaning tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

