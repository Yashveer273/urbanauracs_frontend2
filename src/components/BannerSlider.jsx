import React from 'react';
import './BannerSlider.css';

import banner1 from '../assets/images/banner1.jpg';
import banner2 from '../assets/images/banner2.jpg';
import banner3 from '../assets/images/banner3.jpg';
import banner4 from '../assets/images/banner4.jpg';
import banner5 from '../assets/images/banner5.jpg';
import banner6 from '../assets/images/banner6.jpg';
import banner7 from '../assets/images/banner7.jpg';
import banner8 from '../assets/images/banner8.jpg';
import banner9 from '../assets/images/banner9.jpg';

const leftImages = [banner1, banner2, banner3, banner4];
const middleImages = [banner5, banner6, banner7];
const rightImages = [banner8, banner9, banner1];

const BannerSlider = () => {
  const columns = [
    { images: leftImages, direction: 'upward' },
    { images: middleImages, direction: 'downward' },
    { images: rightImages, direction: 'upward' }
  ];

  return (
    <div className="banner-container">
      <div className="banner-text ">
        <h1>EXPERIENCE CLEAN POWER THAT TRANSFORMS <br />YOUR HOME<br /> INTO A HAVEN</h1>
        <p>
          Trusted by families since <strong>2010</strong>, we deliver <strong>spotless precision</strong> <br />
          and<strong> calming comfort</strong><br />
          to every corner of your home—because a <strong><br /> clean space</strong> is a <strong>peaceful space</strong>.
        </p>

        <div className="banner-buttons">
          <button className="ticket-btn">Get Started</button>
          <button className="programming-btn">Book Now</button>
        </div>
      </div>

      <div className="banner-images">
        {columns.map((col, index) => (
          <div className={`image-column ${index === 0 ? 'left' : index === 2 ? 'right' : ''}`} key={index}>
            <div className={`scrolling-wrapper ${col.direction}`}>
              {[...col.images, ...col.images].map((src, i) => (
                <img src={src} alt={`banner-${index}-${i}`} key={`${index}-${i}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
