import React from "react";

const PromotionCardNew = ({
  title,
  image,
  avatar = "https://placehold.co/50x50/cccccc/000000?text=👤",
  buttonText = "Book Now",
  Text="Check out here"
}) => {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl w-full transition-all duration-300 group">
            <div className="relative h-52 sm:h-60 lg:h-64 overflow-hidden rounded-b-3xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x400/cccccc/000000?text=Image+Not+Found";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

<div className="absolute bottom-0 left-0 text-white rounded-tr-xl bg-black/60 h-18 px-2 flex items-center space-x-4">
  <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center border-4 border-white rounded-full">
    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden">
      <img
        src={avatar}
        alt="Avatar"
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/50x50/cccccc/000000?text=👤";
        }}
      />
    </div>
  </div>

  <div className="flex flex-col">
    <p className="text-sm sm:text-base font-semibold">{buttonText}</p>
  </div>
</div>
</div>

      <div className="bg-[#1a1a1a] group-hover:bg-[#e56d4f] p-4 sm:p-6 text-white flex flex-col justify-between h-36 sm:h-40 lg:h-44 transition-colors duration-300 rounded-3xl">
        <h2 className="text-base sm:text-lg font-semibold leading-snug">
          {title}
        </h2>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm sm:text-base font-semibold">{Text}</p>
          <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white text-[#e56d4f] rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCardNew;
