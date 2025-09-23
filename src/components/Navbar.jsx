import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItemCount, toggleCart } from "../store/CartSlice";
import { Link } from "react-router-dom";

import AccountMenu from "./AccountMenu";
import {
  FaPhone,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaFilter,
  FaEnvelope,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ toggleFilterSidebar, onAboutClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const topBarRef = useRef(null);
  const [topBarHeight, setTopBarHeight] = useState(28);

  // Redux hooks for state management
  const dispatch = useDispatch();
  const links = useSelector((state) => state.socialLinks.links);
  // Replace 'socialLinks' with the slice name you used

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

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateTopBarHeight);

    updateTopBarHeight();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateTopBarHeight);
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
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span>Call: {links[0]?.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span> {links[0]?.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {/* <FaMapMarkerAlt/> <span> {links[0]?.address}</span> */}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <FaYoutube
                className="text-white transform rotate-90"
                href={links[0]?.youtube}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <FaInstagram
                className="text-white transform rotate-90"
                href={links[0]?.insta}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <FaFacebook
                className="text-white transform rotate-90"
                href={links[0]?.fb}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`main-navbar ${scrolled ? "fixed scrolled" : ""}`}
        style={{ top: scrolled ? 0 : `${topBarHeight}px` }}
      >
        <div className="navbar-header w-full md:w-auto">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <img
              src="/logo.jpg"
              alt="Clean Logo"
              width={50}
              height={50}
              className="rounded-full object-cover transition-transform duration-500 hover:rotate-180"
            />
            {/* Right actions */}
            <div className="flex items-center gap-4 md:hidden  ">
              {/* Search Icon */}
              <div
                className="top-search-icon cursor-pointer"
                onClick={toggleSearchBox}
              >
                <FaSearch />
              </div>

              {/* Filter + Cart */}
              <div className="flex items-center gap-2  ">
                <button
                  className="filter-btn flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={toggleFilterSidebar}
                >
                  <FaFilter /> Filter
                </button>

                <button
                  className="cart-btn relative group p-2 rounded hover:bg-gray-200"
                  onClick={() => dispatch(toggleCart())}
                >
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

          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`nav-links ${menuOpen ? "show" : ""}`}>
          <Link to="/">Home</Link>

          <button
            onClick={onAboutClick}
            className="bg-transparent border-none cursor-pointer"
          >
            About Us
          </button>
          <Link to="/contact">Contact</Link>
        </div>

        <div className={`nav-actions ${menuOpen ? "show" : ""}`}>
          <AccountMenu />
          {scrolled && (
            <div
              className="main-search-icon"
              onClick={toggleSearchBox}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <FaSearch />
            </div>
          )}

          <div
            className="filter-cart-actions"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <button className="filter-btn" onClick={toggleFilterSidebar}>
              <FaFilter /> Filter
            </button>

            <button
              className="cart-btn relative group"
              onClick={() => dispatch(toggleCart())}
            >
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
