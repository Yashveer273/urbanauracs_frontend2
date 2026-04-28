import { Swiper, SwiperSlide } from "swiper/react";
import React, { useEffect, useState } from "react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchImages } from "../API";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


const SwiperNavButtons = () => {
  return (
    <>
      <button
        className="custom-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 
                   bg-black/40 hover:bg-black/60 text-white p-3 rounded-full 
                   transition duration-200"
      >
        <FaChevronLeft className="text-lg" />
      </button>

      <button
        className="custom-next absolute top-1/2 right-4 z-10 -translate-y-1/2 
                   bg-black/40 hover:bg-black/60 text-white p-3 rounded-full 
                   transition duration-200"
      >
        <FaChevronRight className="text-lg" />
      </button>
    </>
  );
};

export default function HeroBannerSlider() {
  let HeroBannerSliderImage = [];
  const [heroBannerImages, setHeroBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBannerImages = async () => {
      try {
        // First, check localStorage
        const stored = localStorage.getItem("urbanAuraServicesSliderImage");
        
        if (stored) {
          
          const data = JSON.parse(stored);
          setHeroBannerImages(data);
        } else {
          
          const apiData = await fetchImages();
          if (apiData && apiData.length > 0) {
            setHeroBannerImages(apiData);
            // Cache it in localStorage for future use
            localStorage.setItem(
              "urbanAuraServicesSliderImage",
              JSON.stringify(apiData)
            );
          } else {
            setHeroBannerImages([]);
          }
        }
      } catch (error) {
        console.error("Error loading banner images:", error);
        setHeroBannerImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadBannerImages();
  }, []);
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        className="rounded-2xl shadow-lg"
      >
        {heroBannerImages.length > 0 ? (
          heroBannerImages.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img.src}
                alt={"Banner image"}
                className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/800x400/e5e7eb/768393?text=Image+Not+Found";
                }}
              />
            </SwiperSlide>
          ))
        ) : loading ? (
          <SwiperSlide>
            <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gray-200 rounded-2xl">
              <p className="text-gray-500">Loading images...</p>
            </div>
          </SwiperSlide>
        ) : (
          <SwiperSlide>
            <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gray-200 rounded-2xl">
              <p className="text-gray-500">No images available</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <SwiperNavButtons />
    </div>
  );
}
