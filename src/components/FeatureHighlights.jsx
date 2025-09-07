// import React from "react";

// const FeatureHighlights = () => {
//   return (
//     <section className="bg-white text-[#001d3d] py-16 px-6 md:px-20">
//           <div className="bg-[#e6f1fb] text-[#2e6ef7] text-sm font-semibold px-4 py-1 rounded-full w-fit">
//             ABOUT US
//           </div>
//          <div className="flex">
//           <h2 className="text-3xl md:text-4xl font-bold">
//             Trusted By Hundreds <br /> Of Happy Homes
//           </h2>
//           <p className="text-gray-600 text-base md:text-lg">
//             We believe a clean home creates space for a better life. From standard upkeep to detailed deep cleaning, we handle every corner with care, precision, and eco-friendly solutions.
//           </p>
//          </div>
//       <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
//         {/* Right Image with Play Button */}
//         <div className="flex-1 relative">
//           <img
//             src="/cleaning-kitchen.jpg" // Replace with actual image
//             alt="Cleaners working"
//             className="rounded-xl shadow-md w-full"
//           />
//           <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-blue-600 rounded-full p-4 shadow-lg hover:scale-105 transition">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path d="M8 5v14l11-7z" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Bottom Stats Row */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mt-16">
//         <div>
//           <h3 className="text-2xl font-bold text-[#2e6ef7]">1,200+</h3>
//           <p className="text-sm text-gray-600 mt-1">Homes Cleaned</p>
//         </div>
//         <div>
//           <h3 className="text-2xl font-bold text-[#2e6ef7]">98%</h3>
//           <p className="text-sm text-gray-600 mt-1">Customer Satisfaction</p>
//         </div>
//         <div>
//           <h3 className="text-2xl font-bold text-[#2e6ef7]">4.9/5</h3>
//           <p className="text-sm text-gray-600 mt-1">Average Rating</p>
//         </div>
//         <div>
//           <h3 className="text-2xl font-bold text-[#2e6ef7]">5+</h3>
//           <p className="text-sm text-gray-600 mt-1">Years of Experience</p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeatureHighlights;

import React, { useEffect, useRef, useState } from "react";

const useCountUp = (end, startFrom = 0, duration = 1000) => {
  const [count, setCount] = useState(startFrom);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = startFrom;
          const increment = (end - startFrom) / (duration / 20);

          const counter = setInterval(() => {
            start += increment;
            if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
              clearInterval(counter);
              setCount(end);
            } else {
              setCount(Math.round(start * 10) / 10);
            }
          }, 20);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, startFrom, duration]);

  return [count, ref];
};

const FeatureHighlights = () => {
  const [homesCount, homesRef] = useCountUp(1200);
  const [satisfaction, satisfactionRef] = useCountUp(98);
  const [rating, ratingRef] = useCountUp(4.9, 5);
  const [experience, experienceRef] = useCountUp(5);
  const [support, supportRef] = useCountUp(24);

  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          } else {
            entry.target.classList.remove("opacity-100", "translate-y-0");
            entry.target.classList.add("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      revealRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="bg-white text-[#15171f] py-16 px-6 md:px-20">
      <div
        className="bg-[#f87559] text-white text-sm font-semibold px-4 py-1 mb-5 rounded-full w-fit opacity-0 translate-y-10 transition-all duration-300"
        ref={addToRefs}
      >
        ABOUT US
      </div>

      <div
        className="flex gap-20 space-y-5 mb-5 justify-between flex-col md:flex-row opacity-0 translate-y-10 transition-all duration-300"
        ref={addToRefs}
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Trusted By Hundreds <br /> Of Happy Homes
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-md">
          We believe a clean home creates space for a better life. From standard upkeep to detailed deep cleaning, we handle every corner with care, precision, and eco-friendly solutions.
        </p>
      </div>

      <div
        className="max-w-xl mx-auto flex flex-col lg:flex-row items-center gap-12 opacity-0 translate-y-10 transition-all duration-300"
        ref={addToRefs}
      >
        <div className="flex-1 relative">
          <img
            src="/cleaning-kitchen.jpg"
            alt="Cleaners working"
            className="rounded-xl shadow-md w-full"
          />
          <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-[#f87559] rounded-full p-4 shadow-md hover:scale-105 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="flex justify-center py-20 px-4 md:px-8 opacity-0 translate-y-10 transition-all duration-300"
        ref={addToRefs}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-14 gap-y-5 text-center max-w-6xl w-full mx-auto">
          <div ref={homesRef} className="bg-[#000000b3] p-6 rounded-lg w-full">
            <h3 className="text-2xl font-bold text-[#fff]">
              {Math.round(homesCount)}+
            </h3>
            <p className="text-sm text-gray-300 mt-1">Homes Cleaned</p>
          </div>

          <div ref={satisfactionRef} className="bg-[#000000b3] p-6 rounded-lg w-full">
            <h3 className="text-2xl font-bold text-[#fff]">
              {Math.round(satisfaction)}%
            </h3>
            <p className="text-sm text-gray-300 mt-1">Customer Satisfaction</p>
          </div>

          <div ref={ratingRef} className="bg-[#000000b3] p-6 rounded-lg w-full">
            <h3 className="text-2xl font-bold text-[#fff]">
              {rating.toFixed(1)}/5
            </h3>
            <p className="text-sm text-gray-300 mt-1">Average Rating</p>
          </div>

          <div ref={supportRef} className="bg-[#000000b3] p-6 rounded-lg w-full">
            <h3 className="text-2xl font-bold text-[#fff]">
              {Math.round(support)}x7
            </h3>
            <p className="text-sm text-gray-300 mt-1">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;

