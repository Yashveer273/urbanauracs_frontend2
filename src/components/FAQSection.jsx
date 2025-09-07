// import React, { useState } from "react";

// const faqs = [
//   {
//     question: "Do I need to be home during the cleaning?",
//     answer:
//       "No, as long as we have access, you can carry on with your day.",
//   },
//   {
//     question: "Are your cleaning products safe for pets and kids?",
//     answer:
//       "Yes. We use eco-friendly, non-toxic products that are safe for children and animals.",
//   },
//   {
//     question: "What happens if I’m not satisfied with the cleaning?",
//     answer:
//       "We offer a satisfaction guarantee—just reach out within the specified window and we’ll make it right.",
//   },
//   {
//     question: "Can I schedule recurring services?",
//     answer:
//       "Absolutely. You can set up weekly, biweekly, or monthly recurring cleanings based on your needs.",
//   },
//   {
//     question: "Is there a cancellation fee?",
//     answer:
//       "Cancellations made within the allowed window are free; late cancellations may incur a small fee.",
//   },
// ];

// const FAQSection = () => {
//   const [openIndex, setOpenIndex] = useState(0); 

//   return (
//     <section className="py-16 px-6 md:px-20 bg-white rounded-[32px]">
//       <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
//         <div className="inline-block bg-[#e6f1fb] text-[#2563EB] text-xs font-semibold px-4 py-1 rounded-full mb-1 shadow">
//           FAQ
//         </div>
//         <h2 className="text-3xl font-bold text-center">
//           Got Questions?
//         </h2>
//         <p className="text-gray-600 text-center">
//           We’ve got answers to your most common cleaning concerns.
//         </p>

//         <div className="mt-10 w-full space-y-3">
//           {faqs.map((f, idx) => {
//             const isOpen = openIndex === idx;
//             return (
//               <div
//                 key={idx}
//                 className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
//               >
//                 <button
//                   onClick={() =>
//                     setOpenIndex(isOpen ? -1 : idx)
//                   }
//                   className="w-full flex justify-between items-center px-6 py-4 text-left"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`w-1.5 h-8 rounded-r-full ${
//                         isOpen ? "bg-[#2563EB]" : "bg-transparent"
//                       }`}
//                     />
//                     <div>
//                       <h3 className="text-base font-semibold">
//                         {f.question}
//                       </h3>
//                     </div>
//                   </div>
//                   <div className="flex-shrink-0">
//                     {isOpen ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-gray-600"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M20 12H4"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-gray-600"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M12 4v16m8-8H4"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                 </button>
//                 {isOpen && (
//                   <div className="px-6 pb-6">
//                     <p className="text-sm text-gray-600">
//                       {f.answer}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
// {/* 
//       <div className="mt-16 bg-[#1f64f0] relative rounded-2xl overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#2668f4] to-[#1f64f0]/90 opacity-95" />
//         <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-8 py-16 px-6 md:px-12 relative">
//           <div className="flex-1 text-center lg:text-left text-white z-10">
//             <div className="text-4xl font-bold leading-tight">
//               Ready For A Cleaner, <br /> Happier Home?
//             </div>
//             <p className="mt-2 text-base max-w-md mx-auto lg:mx-0">
//               Book today and discover why families trust Qlinest for spotless living.
//             </p>
//             <div className="mt-6">
//               <button className="bg-yellow-400 text-[#1f2d3a] font-semibold px-6 py-3 rounded-full shadow hover:brightness-105 transition">
//                 Book Your First Cleaning
//               </button>
//             </div>
//           </div>
//           <div className="flex-1 flex justify-center gap-6 z-10">
//             <div className="w-32 h-32 md:w-44 md:h-44 rounded-xl overflow-hidden">
//               <img
//                 src="/images/cleaner-smiling-left.jpg"
//                 alt="Cleaner left"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="w-32 h-32 md:w-44 md:h-44 rounded-xl overflow-hidden">
//               <img
//                 src="/images/cleaner-smiling-right.jpg"
//                 alt="Cleaner right"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </div> */}
//     </section>
//   );
// };

// export default FAQSection;

import React, { useState } from "react";
const faqs = [
  {
    question: "Do I need to be home during the cleaning?",
    answer: "No, as long as we have access, you can carry on with your day.",
  },
  {
    question: "Are your cleaning products safe for pets and kids?",
    answer:
      "Yes. We use eco-friendly, non-toxic products that are safe for children and animals.",
  },
  {
    question: "What happens if I’m not satisfied with the cleaning?",
    answer:
      "We offer a satisfaction guarantee—just reach out within the specified window and we’ll make it right.",
  },
  {
    question: "Can I schedule recurring services?",
    answer:
      "Absolutely. You can set up weekly, biweekly, or monthly recurring cleanings based on your needs.",
  },
  {
    question: "Is there a cancellation fee?",
    answer:
      "Cancellations made within the allowed window are free; late cancellations may incur a small fee.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 px-6 md:px-20 bg-white rounded-[32px] mb-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <div className="inline-block bg-[#fdeae6] text-[#f87559] text-xs font-semibold px-4 py-1 rounded-full mb-1 shadow">
          FAQ
        </div>

        <h2 className="text-3xl font-bold text-center">Got Questions?</h2>
        <p className="text-gray-600 text-center">
          We’ve got answers to your most common cleaning concerns.
        </p>

        {/* FAQs */}
        <div className="mt-10 w-full space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-8 rounded-r-full ${
                        isOpen ? "bg-[#f87559]" : "bg-transparent"
                      }`}
                    />
                    <div>
                      <h3 className="text-base font-semibold">{f.question}</h3>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-sm text-gray-600">{f.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
