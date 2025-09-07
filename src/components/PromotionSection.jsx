import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./promotion.css";
import PromotionCardNew from "./PromotionCardNew";

const promotions = [
  {
    title: "Let Your Home Shine Brighter Than Ever",
    subtitle: "Experience top-tier cleaning backed by trusted professionals.",
    buttonText: "Schedule a Free Consultation",
    image: "/img02.jpg",
    avatar: "/img02.jpg",
  },
  {
    title: "Get 20% Off Your First Cleaning!",
    subtitle: "Exclusive offer for new customers. Limited time only!",
    buttonText: "Claim Your Discount",
    image: "/img03.jpg",
    avatar: "/img03.jpg",
  },
  {
    title: "Free Fridge Cleaning with Kitchen Service",
    subtitle:
      "Book a deep kitchen clean and get fridge cleaning absolutely free!",
    buttonText: "Book Kitchen Clean",
    image: "/img04.jpg",
    avatar: "/img04.jpg",
  },
  {
    title: "10% Off Weekly Subscriptions",
    subtitle: "Subscribe to weekly cleaning and save every time.",
    buttonText: "Start Saving",
    image: "/img05.jpg",
    avatar: "/img05.jpg",
  },
  {
    title: "Window Cleaning - 15% Off Today!",
    subtitle: "Let sunlight in with spotless windows. One-day deal.",
    buttonText: "Shine Windows",
    image: "/img06.jpg",
    avatar: "/img06.jpg",
  },
  {
    title: "Combo: Bathroom + Carpet Cleaning @ 25% Off",
    subtitle: "Bundle and save more on essentials.",
    buttonText: "Book Combo",
    image: "/img07.jpg",
    avatar: "/img07.jpg",
  },
];

const PromotionSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-black rounded-[32px]">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        <div className="inline-block bg-[#fdeae6] text-[#f87559] text-xs font-semibold px-4 py-1 rounded-full mb-1 shadow">
          PROMOTION
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white">
          Get A Sparkling Clean Home <br className="hidden sm:block" /> At A
          Special Price!
        </h2>
        <p className="text-gray-400 text-center max-w-xl text-sm sm:text-base">
          Enjoy our limited-time offers on professional home cleaning services.
        </p>

        <div className="w-full mt-10 relative">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1} // default for very small screens
            pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
            breakpoints={{
              480: { slidesPerView: 1.2, spaceBetween: 16 },
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 2.5, spaceBetween: 28 },
              1280: { slidesPerView: 3, spaceBetween: 32 },
            }}
          >
            {promotions.map((promo, idx) => (
              <SwiperSlide key={idx}>
                <PromotionCardNew {...promo} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-swiper-pagination mt-6 flex justify-center gap-2"></div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
