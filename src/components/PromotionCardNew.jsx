import React from "react";

const PromotionCardNew = ({
  title,
  image,
  avatar = "https://placehold.co/50x50/cccccc/000000?text=👤",
  buttonText = "Book Now",

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

      <div className="bg-[#1a1a1a] group-hover:bg-[#e56d4f] p-4 sm:p-6 text-white flex flex-col justify-between h-20 sm:h-20 lg:h-20 transition-colors duration-300 rounded-3xl">
        <h2 className="text-base sm:text-lg font-semibold leading-snug">
          {title}
        </h2>

      </div>
    </div>
  );
};

export default PromotionCardNew;
