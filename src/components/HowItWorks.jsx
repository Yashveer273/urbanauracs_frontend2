// import react from "react";

// const HowItWorks = () => {
//     return(
//         <section classname="bg-white py-16 px-4 md:px-8 scroll-smooth">
//             <div className="bg-[#e6f1fb] text-[#2e6ef7] text-sm font-semibold px-4 py-1 mb-5 rounded-full w-fit mx-auto">
//              How It Works
//            </div>
//            <div classname="max-w-7xl mx-auto">
//             <div classname="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <h2>How We Can Help</h2>
//             </div>
//            </div>
//         </section>    
//     );
// };

// export default HowItWorks;
import React, { useEffect, useRef } from "react";

const steps = [
  {
    title: "Book Online",
    description:
      "Easily choose your preferred service and conveniently schedule it at a time that works best for you through our simple booking.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#f87559"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.5a4.5 4.5 0 019 0V13a5 5 0 11-10 0V8.5zM16 12h5"
        />
      </svg>
    ),
    active: true,
  },
  {
    title: "Customize Plan",
    description:
      "Customize your cleaning just the way you like it – choose the service type, schedule, and how often you need it.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#0f172a"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7h8M8 11h8M8 15h5M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    active: false,
  },
  {
    title: "Meet Your Cleaner",
    description:
      "Meet the professional who’ll care for your space – we’ll share their name and details before your appointment.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#0f172a"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.64 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    active: false,
  },
  {
    title: "Get Sparkling Results",
    description:
      "Enjoy a spotless home, cleaned with care. Our pros use eco-friendly products and proven methods for a deep.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#0f172a"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    active: false,
  },
];

const HowItWorks = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      },
      { threshold: 0.3 }
    );

    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <section className="py-16 px-6 md:px-20 bg-white">
      <div className="bg-gray-300 text-[#f87559] text-sm font-semibold px-4 py-1 mb-5 rounded-full w-fit mx-auto">
        HOW IT WORKS
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#0f172a] w-fit mx-auto">
        How We Can Help
      </h2>
      <p className="text-gray-600 mt-2 max-w-md w-fit mx-auto">
        Simple, seamless, and stress-free cleaning in 4 easy steps.
      </p>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="mt-10 flex">
            <div className="relative pr-6">
              <div className="absolute left-3 top-0 bottom-0 w-1 bg-gray-200 rounded-full" />
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start mb-8 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-1 h-full absolute left-0 ${
                        step.active ? "bg-[#f87559]" : ""
                      } rounded-full`}
                      style={{

                            top: "31px",
    bottom: "0px",
    left: "13px",

                       }}
                    />
                    <div
                      className={`z-10 flex items-center justify-center rounded-full border-2 ${
                        step.active
                          ? "border-[#f87559] bg-white"
                          : "border-gray-300 bg-white"
                      } w-8 h-8`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <div className="ml-8">
                    <h3 className="text-lg font-semibold text-[#0f172a]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div
            ref={imageRef}
            className="rounded-xl overflow-hidden shadow-lg opacity-0 translate-y-10 transition-all duration-700"
          >
            <img
              src="/img01.jpg"
              alt="Cleaner helping"
              className="w-full h-64 md:h-110 lg:h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
