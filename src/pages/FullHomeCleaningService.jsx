/* eslint-disable no-unused-vars */


import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthPopupOpen, setAuthPopupOpen } from '../store/CartSlice'; 
import BannerSlider from '../components/BannerSlider';
import Navbar from '../components/Navbar';
import FooterWithCarousel from '../components/FooterWithCarousel';
import VendorSection from '../components/VendorSection';
import ServicePopup from '../components/ServicePopup';
import FilterSidebar from '../components/FilterSidebar';
import Portal from '../components/Portal';
import CartSidebar from '../components/CartSidebar'; 
import AuthPopup from '../components/AuthPopup';
import AccountMenu from '../components/AccountMenu';

import fullHomeVendors from '../data/fullHomeVendors.json';
import acRepairVendors from '../data/AcRepair.json';
import commercialCleaning from '../data/CommercialCleaning.json';

const services = [
  { title: 'Full Home Cleaning', image: '/images/home_cleaning copy.jpg', link: '/services/full-home-cleaning' },
  { title: 'AC Repair Service', image: '/images/ac_repair.jpg', link: '/services/ac-repair' },
];


const FullHomeCleaningService = () => {
  const { serviceName } = useParams();
  const location = useLocation();
  const userLocation = location.state?.location;

  const dispatch = useDispatch(); 
  const isAuthPopupOpen = useSelector(selectIsAuthPopupOpen);

  const [showServices, setShowServices] = useState(false);
  const [allVendors, setAllVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: 400,
    maxPrice: 5000,
    serviceTypes: [],
    apartmentSize: [],
    location: '',
  });

  const toggleServicePopup = () => setShowServices(!showServices);
  const toggleFilterSidebar = () => setIsFilterOpen(!isFilterOpen);

  const serviceDataMap = {
    'full-home-cleaning': fullHomeVendors,
    'ac-repair': acRepairVendors,
    'commercial-cleaning': commercialCleaning,
  };

  useEffect(() => {
    const vendors = serviceDataMap[serviceName] || [];
    setAllVendors(vendors);
    setAppliedFilters({
      minPrice: 400,
      maxPrice: 5000,
      serviceTypes: [],
      apartmentSize: [],
      location: '',
    });
  }, [serviceName]);

  useEffect(() => {
  let vendorsToFilter = allVendors;

  // 🔹 Location override: filter by appliedFilters.location if set, else fallback to userLocation
  const activeLocation = appliedFilters.location || userLocation;

  if (activeLocation) {
    vendorsToFilter = vendorsToFilter.filter(
      (vendor) =>
        vendor.location?.toLowerCase().replace(/\s/g, '') ===
        activeLocation.toLowerCase().replace(/\s/g, '')
    );
  }

  vendorsToFilter = vendorsToFilter
    .map((vendor) => {
      const filteredServices = vendor.services.filter((service) => {
        const priceMatch =
          service.price >= appliedFilters.minPrice &&
          service.price <= appliedFilters.maxPrice;

        const serviceTypeMatch =
          appliedFilters.serviceTypes.length === 0 ||
          appliedFilters.serviceTypes.includes(service.title);

        const apartmentSizeMatch =
          appliedFilters.apartmentSize.length === 0 ||
          appliedFilters.apartmentSize.includes(service.description);

        return priceMatch && serviceTypeMatch && apartmentSizeMatch;
      });

      return {
        ...vendor,
        services:
          appliedFilters.serviceTypes.length ||
          appliedFilters.apartmentSize.length ||
          appliedFilters.minPrice !== 400 ||
          appliedFilters.maxPrice !== 5000
            ? filteredServices
            : vendor.services,
      };
    })
    .filter((vendor) => vendor.services.length > 0);

  setFilteredVendors(vendorsToFilter);
}, [allVendors, userLocation, appliedFilters]);


  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const uniqueServiceTitles = Array.from(
    new Set(allVendors.flatMap((vendor) => vendor.services.map((service) => service.title)))
  );

  const uniqueApartmentSizes = Array.from(
    new Set(allVendors.flatMap((vendor) => vendor.services.map((service) => service.description)))
  );

  const noVendorsFound = allVendors.length === 0;
  const noVendorsAfterFilter = allVendors.length > 0 && filteredVendors.length === 0;

  return (
    <div className="service-page relative">
      <BannerSlider/>
      <Navbar
        toggleServicePopup={toggleServicePopup}
        showServices={showServices}
        toggleFilterSidebar={toggleFilterSidebar}
      />

      {showServices && <ServicePopup services={services} onClose={toggleServicePopup} />}

      {isFilterOpen && (
        <Portal>
          <div
            className={`fixed inset-y-0 right-0 z-[1002] w-80 max-w-full bg-white shadow-xl transition-transform duration-300 ${
              isFilterOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <FilterSidebar
              onApplyFilters={handleApplyFilters}
              onClose={toggleFilterSidebar}
              minPrice={appliedFilters.minPrice}
              maxPrice={appliedFilters.maxPrice}
              serviceTypes={appliedFilters.serviceTypes}
              apartmentSize={appliedFilters.apartmentSize}
              selectedLocation={appliedFilters.location}
              allServiceTypes={uniqueServiceTitles}
              allApartmentSizes={uniqueApartmentSizes}
            />
          </div>
        </Portal>
      )}

      <CartSidebar /> 
      {isAuthPopupOpen && (
  <Portal>
    <AuthPopup
      onClose={() => dispatch(setAuthPopupOpen(false))}
      onAuthSuccess={(userData) => {
        // Retrieve existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Check for duplicates by mobile number
        const duplicateUser = existingUsers.find(
          (user) => user.mobile === userData.mobile
        );

        if (duplicateUser) {
          console.warn(
            `User with mobile ${userData.mobile} already exists in localStorage`
          );
        } else {
          // Add the new user
          const updatedUsers = [...existingUsers, userData];

          // Save back to localStorage
          localStorage.setItem('users', JSON.stringify(updatedUsers));

          // Log the newly added user
          console.log('User added to localStorage:', userData);
        }

        // Also set authenticated user for current session
        setAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }}
    />
  </Portal>
)}


      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8 capitalize">
          {serviceName.replace(/-/g, ' ')} Services
        </h1>

        {noVendorsFound ? (
          <div className="text-center text-gray-700 text-xl p-8 bg-gray-100 rounded-xl">
            😔 No vendors found for this service.
          </div>
        ) : noVendorsAfterFilter ? (
          <div className="text-center text-gray-700 text-xl p-8 bg-gray-100 rounded-xl">
            😔 No services available in your selected location or matching your filters.
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <VendorSection key={vendor.vendorId} vendor={vendor} selectedLocation={userLocation} />
          ))
        )}
      </div>

      <FooterWithCarousel />
    </div>
  );
};

export default FullHomeCleaningService;
