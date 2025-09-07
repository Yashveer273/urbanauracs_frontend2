import React from 'react';
import { motion } from 'framer-motion';

// Icons for each category to make the UI visually appealing.
// Make sure you have these icons installed, for example from 'lucide-react'
import {
    Sparkles, Droplets, Wind, Sun,
    Home, Wrench, PaintBrush, Zap,
    Balloon, Map, Star, Phone
} from 'lucide-react';

// Define the service categories
const serviceCategories = [
    { name: "Full Home Cleaning", icon: <Home /> },
    { name: "AC Repair", icon: <Wind /> },
    { name: "Plumber", icon: <Droplets /> },
    { name: "Electrician", icon: <Zap /> },
    { name: "Home Painting", icon: <PaintBrush /> },
    { name: "Pest Control", icon: <Sparkles /> },
    { name: "Balloon Decoration", icon: <Balloon /> },
];

const ServiceFilterBar = ({ onSelectCategory, activeCategory }) => {
    return (
        <motion.div
            className="flex items-center justify-start overflow-x-auto gap-4 p-4 bg-[#15171f] rounded-xl shadow-lg border border-gray-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {serviceCategories.map((category, index) => (
                <button
                    key={index}
                    className={`flex-shrink-0 flex items-center gap-2 py-2 px-4 rounded-full font-semibold transition-colors duration-300 ${
                        activeCategory === category.name
                            ? "bg-[#f87559] text-white"
                            : "bg-[#2c2d34] text-gray-400 hover:bg-[#3d3f47] hover:text-white"
                    }`}
                    onClick={() => onSelectCategory(category.name)}
                >
                    {React.cloneElement(category.icon, { size: 20 })}
                    <span>{category.name}</span>
                </button>
            ))}
        </motion.div>
    );
};

export default ServiceFilterBar;