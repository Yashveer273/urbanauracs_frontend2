
import React from 'react'; 
import AboutUs from './aboutUs';
import Navbar from './Navbar';
import FooterWithCarousel from './FooterWithCarousel';
export default function AboutUsPage() {
  return (
    <>
    <Navbar />
    <div className="bg-white mt-20">
      <AboutUs/>
      <div>
        <div className="text-center text-3xl mb-5 items-center justify-center font-bold">
         Urban Aura Services – Our Promise to You
        </div>
        <div className="mt-10">
          <ul className="list-disc list-inside space-y-2 mr-10 ml-10 mb-10 text-1xl">
            <li><span className="font-bold">Certified Experts:</span> Skilled professionals carefully screened for reliability and excellence.</li>
            <li><span className="font-bold">Cutting-Edge Resources:</span> Modern equipment and smart techniques for seamless service delivery.</li>
            <li><span className="font-bold">Customer Delight:</span> Your happiness is our ultimate measure of success.</li>
            <li><span className="font-bold">Eco-Conscious Solutions:</span> Green, safe, and sustainable products for a healthier environment.</li>
            <li><span className="font-bold">Uncompromised Standards:</span> Premium quality in every detail, no shortcuts taken.</li>
            <li><span className="font-bold">Well-Trained Team:</span> Courteous, efficient, and highly capable staff at your service.</li>
            <li><span className="font-bold">Smart Water Usage:</span> Innovative methods that save water while ensuring spotless results.</li>
            <li><span className="font-bold">Hassle-Free Scheduling:</span> Quick, intuitive booking designed around your convenience.</li>
            <li><span className="font-bold">Fair & Clear Pricing:</span> Honest charges with complete transparency, no hidden surprises.</li>
            <li><span className="font-bold">Always Available:</span> Dedicated support, 24/7, whenever you need us.</li>
          </ul>
        </div>

        </div>
      <FooterWithCarousel/>
    </div>
    </>
  );
}