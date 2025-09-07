// components/StatsIcons.jsx
import React from "react";

const StatsIcons = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-5 md:grid-cols-6 gap-5 text-center ">
        <div>
          <h3 className="text-3xl font-bold text-blue-600">1,000+</h3>
          <p className="mt-2 text-gray-600">Homes Cleaned</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-blue-600">4.9/5</h3>
          <p className="mt-2 text-gray-600">Average Rating</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-blue-600">100%</h3>
          <p className="mt-2 text-gray-600">Satisfaction</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
          <p className="mt-2 text-gray-600">Customer Support</p>
        </div>
      </div>
    </section>
  );
};

export default StatsIcons;
