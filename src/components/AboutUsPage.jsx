
import React from 'react'; 
import AboutUs from './aboutUs';
import FooterWithCarousel from './FooterWithCarousel';
export default function AboutUsPage() {
  return (
    <div>
        <header className="header">
        <div className="dot"></div>
        <h1>About us</h1>
      </header>
      <AboutUs/>
      <FooterWithCarousel/>
    </div>
  );
}


