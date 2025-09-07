// import React, { useEffect, useState, useRef } from 'react';
// import {
//   FaPhone,
//   FaShoppingCart,
//   FaSearch,
//   FaBars,
//   FaTimes
// } from 'react-icons/fa';
// import './Navbar.css';

// const Navbar = ({ toggleServicePopup, showServices }) => {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showSearchBox, setShowSearchBox] = useState(false);
//   const topBarRef = useRef(null);
//   const [topBarHeight, setTopBarHeight] = useState(28);

//   const toggleMenu = () => setMenuOpen(!menuOpen);
//   const toggleSearchBox = () => setShowSearchBox(!showSearchBox);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };

//     const updateTopBarHeight = () => {
//       if (topBarRef.current) {
//         setTopBarHeight(topBarRef.current.offsetHeight);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     window.addEventListener('resize', updateTopBarHeight);

//     updateTopBarHeight(); 

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       window.removeEventListener('resize', updateTopBarHeight);
//     };
//   }, []);

//   return (
//     <div className="navbar-wrapper">
      
//       {showSearchBox && (
//         <div className="search-overlay search-overlay-active">
//           <input
//             type="text"
//             placeholder="Search for vendors, services etc..."
//             className="search-overlay-input"
//           />
//           <button className="search-overlay-close" onClick={toggleSearchBox}>
//             <FaTimes />
//           </button>
//         </div>
//       )}

     
//       {!scrolled && (
//         <div className="top-bar" ref={topBarRef}>
//           <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//               <FaPhone className="text-white transform rotate-90" />
//               <span>Performance Hall: 123 456 7890</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//               <FaPhone className="text-white transform rotate-90" />
//               <span>Exhibition Center: 123 456 7890</span>
//             </div>
//           </div>
//           <div className="right-top">
//             <div className="top-search-icon" onClick={toggleSearchBox}>
//               <FaSearch />
//             </div>
//           </div>
//         </div>
//       )}

   
//       <div
//         className={`main-navbar ${scrolled ? 'fixed scrolled' : ''}`}
//         style={{ top: scrolled ? 0 : `${topBarHeight}px` }}
//       >
//         <div className="navbar-header">
//           <div className="logo">Clean</div>
//           <button className="hamburger" onClick={toggleMenu}>
//             {menuOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
//           <a href="/">Home</a>
//           <a href="/blog">Blog</a>
//           <a href="/about">About Us</a>
//           <a href="/contact">Contact</a>
//         </div>

//         <div className={`nav-actions ${menuOpen ? 'show' : ''}`}>
//           {/* <span
//   className="nav-link service-link"
//   onClick={toggleServicePopup}
//   style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
// >
//   {showServices ? (
//     <span style={{ color: '#f87559', display: 'flex', alignItems: 'center', gap: '6px' }}>
//       <FaTimes /> Close
//     </span>
//   ) : (
//     <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//       <FaBars /> Service
//     </span>
//   )}
// </span> */}

// {scrolled && (
//   <div
//     className="main-search-icon"
//     onClick={toggleSearchBox}
//     style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
//   >
//     <FaSearch />
//     <span style={{ fontSize: '14px' }}></span>
//   </div>
// )}


//           <button className="ticket-btn">
//             <FaShoppingCart /> Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemCount, toggleCart } from '../store/CartSlice';
import { Link } from 'react-router-dom';
import AccountMenu from "./AccountMenu";
import {
  FaPhone,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaFilter
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ toggleFilterSidebar, onAboutClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const topBarRef = useRef(null);
  const [topBarHeight, setTopBarHeight] = useState(28);

  // Redux hooks for state management
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearchBox = () => setShowSearchBox(!showSearchBox);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const updateTopBarHeight = () => {
      if (topBarRef.current) {
        setTopBarHeight(topBarRef.current.offsetHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateTopBarHeight);

    updateTopBarHeight();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTopBarHeight);
    };
  }, []);

  return (
    <div className="navbar-wrapper">
      {showSearchBox && (
        <div className="search-overlay search-overlay-active">
          <input
            type="text"
            placeholder="Search for vendors, services etc..."
            className="search-overlay-input"
          />
          <button className="search-overlay-close" onClick={toggleSearchBox}>
            <FaTimes />
          </button>
        </div>
      )}

      {!scrolled && (
        <div className="top-bar" ref={topBarRef}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaPhone className="text-white transform rotate-90" />
              <span>Performance Hall: 123 456 7890</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaPhone className="text-white transform rotate-90" />
              <span>Exhibition Center: 123 456 7890</span>
            </div>
          </div>
          <div className="right-top">
            <div className="top-search-icon" onClick={toggleSearchBox}>
              <FaSearch />
            </div>
          </div>
        </div>
      )}

      <div
        className={`main-navbar ${scrolled ? 'fixed scrolled' : ''}`}
        style={{ top: scrolled ? 0 : `${topBarHeight}px` }}
      >
        <div className="navbar-header">
          <div className="logo">Clean</div>
          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`nav-links ${menuOpen ? 'show' : ''}`}>
  <Link to="/">Home</Link>
  <Link to="/blog">Blog</Link>
  <button onClick={onAboutClick} className="bg-transparent border-none cursor-pointer">
    About Us
  </button>
  <Link to="/contact">Contact</Link>
</div>


        <div className={`nav-actions ${menuOpen ? 'show' : ''}`}>
          <AccountMenu/>
          {scrolled && (
            <div
              className="main-search-icon"
              onClick={toggleSearchBox}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <FaSearch />
            </div>
          )}

          <div className="filter-cart-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="filter-btn" onClick={toggleFilterSidebar}>
              <FaFilter /> Filter
            </button>
            
           <button className="cart-btn relative group" onClick={() => dispatch(toggleCart())}>
              <FaShoppingCart className="group-hover:text-[#fff] group-hover:bg-[#f87559]" /> 
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f87559] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-[#fff] group-hover:text-[#f87559]">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;