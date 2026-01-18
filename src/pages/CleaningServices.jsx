/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthPopupOpen, setAuthPopupOpen } from "../store/CartSlice";
import BannerSlider from "../components/BannerSlider";
import Navbar from "../components/Navbar";
import FooterWithCarousel from "../components/FooterWithCarousel";
import VendorSection from "../components/VendorSection";
import ServicePopup from "../components/ServicePopup";
import FilterSidebar from "../components/FilterSidebar";
import Portal from "../components/Portal";
import CartSidebar from "../components/CartSidebar";
import AuthPopup from "../components/AuthPopup";


import { loginUser } from "../store/userSlice";
import { services } from "../data/ProductData";
import { fetchProdDataDESC } from "../API";
import ReusableSearchAutocomplete from "../components/SearchBox";
import ReusableFilterOnDescriptionSearchAutocomplete from "../components/ReusableFilterOnDescriptionSearchAutocomplete";

const CleaningService = () => {
  const { parameter } = useParams();
  const [serviceName, BookingCity] = parameter.split("-");

  const dispatch = useDispatch();
  const isAuthPopupOpen = useSelector(selectIsAuthPopupOpen);

  const [showServices, setShowServices] = useState(false);
  const [allVendors, setAllVendors] = useState([]);
  const [InitialSpells, SetInitialSpells] = useState([]);

  const [filteredVendors, setFilteredVendors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [SearchedServiceName, setSearchedServiceName] = useState(serviceName);

  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: 500,
    maxPrice: 20000,
    serviceTypes: [],
    apartmentSize: [],
    BookingCity: BookingCity,
  });

  const toggleServicePopup = () => setShowServices(!showServices);
  const toggleFilterSidebar = () => setIsFilterOpen(!isFilterOpen);

  const callProductData = async () => {
    if (services.length <= 0) {
      const data2 = await fetchProdDataDESC();
      services.length = 0;
      if (data2.length > 0) {
        services.push(...data2[0].data);
        let serviceData = services.find((s) => s.ServiceName == serviceName);

        const Data = serviceData.data.filter(
          (Product) =>
            Product.location?.trim().toLowerCase().replace(/\s+/g, "") ===
            BookingCity.trim().toLowerCase().replace(/\s+/g, "")
        );

        const formattedServices = services.map((s, index) => ({
          id: index,
          name: s.ServiceName,
          data: s.data,
        }));
        setAllVendors(Data);
        setFilteredVendors(Data);
        SetInitialSpells(formattedServices);
      }
    } else {
      let serviceData = services.find((s) => s.ServiceName == serviceName);
      const Data = serviceData.data.filter(
        (Product) =>
          Product.location?.trim().toLowerCase().replace(/\s+/g, "") ===
          appliedFilters.BookingCity.trim().toLowerCase().replace(/\s+/g, "")
      );
      const formattedServices = services.map((s, index) => ({
        id: index,
        name: s.ServiceName,
        data: s.data,
      }));
      setAllVendors(Data);
      setFilteredVendors(Data);
      SetInitialSpells(formattedServices);
    }
  };

  useEffect(() => {
    callProductData();
  }, []);
  const callUpate = () => {
    let vendorsToFilter = allVendors;

    const activeBookingCities = appliedFilters.BookingCity || BookingCity;

    if (activeBookingCities) {
      vendorsToFilter = vendorsToFilter.filter(
        (vendor) =>
          vendor.location?.toLowerCase().replace(/\s/g, "") ===
          activeBookingCities.toLowerCase().replace(/\s/g, "")
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
            appliedFilters.minPrice !== 500 ||
            appliedFilters.maxPrice !== 20000
              ? filteredServices
              : vendor.services,
        };
      })
      .filter((vendor) => vendor.services.length > 0);

    setFilteredVendors(vendorsToFilter);
  };
  useEffect(() => {
    callUpate();
  }, [allVendors, appliedFilters]);

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const uniqueServiceTitles = Array.from(
    new Set(
      allVendors.flatMap((vendor) =>
        vendor.services.map((service) => service.title)
      )
    )
  );

  const uniqueApartmentSizes = Array.from(
    new Set(
      allVendors.flatMap((vendor) =>
        vendor.services.map((service) => service.description)
      )
    )
  );

  const noVendorsFound = allVendors.length === 0;
  const noVendorsAfterFilter =
    allVendors.length > 0 && filteredVendors.length === 0;
  const handleAppItemSelect = (selectedItem, SearchedServiceName) => {
    setAllVendors(selectedItem.data);
    setSearchedServiceName(SearchedServiceName);
  };
  const FilterOnDescription = (selectedItem) => {

    setFilteredVendors(selectedItem);
  };

  return (
    <div className="service-page relative">
      <BannerSlider />
      <Navbar
        toggleServicePopup={toggleServicePopup}
        showServices={showServices}
        toggleFilterSidebar={toggleFilterSidebar}
      />

      {showServices && (
        <ServicePopup services={services} onClose={toggleServicePopup} />
      )}

      {isFilterOpen && (
        <Portal>
          <div
            className={`fixed inset-y-0 right-0 z-[1002] w-80 max-w-full bg-white shadow-xl transition-transform duration-300 ${
              isFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <FilterSidebar
              onApplyFilters={handleApplyFilters}
              onClose={toggleFilterSidebar}
              minPrice={appliedFilters.minPrice}
              maxPrice={appliedFilters.maxPrice}
              serviceTypes={appliedFilters.serviceTypes}
              apartmentSize={appliedFilters.apartmentSize}
              selectedLocation={appliedFilters.BookingCity}
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
              const existingUsers =
                JSON.parse(localStorage.getItem("users")) || [];

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
                localStorage.setItem("users", JSON.stringify(updatedUsers));

             
              }

              // Also set authenticated user for current session
              setAuthenticated(true);
              dispatch(loginUser(userData));
            }}
          />
        </Portal>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className=" bg-gray-100 mb-6 p-1 sm:p-2 flex items-center justify-center">
          <div className="w-full max-w-lg flex flex-col gap-[10px] lg:flex-row lg:gap-[20px]">
            <ReusableSearchAutocomplete
              data={InitialSpells}
              onItemSelected={handleAppItemSelect}
              className="flex-1"
            />
            
            
            <ReusableFilterOnDescriptionSearchAutocomplete
              data={allVendors}
              onItemSelected={FilterOnDescription}
              className="flex-1"
            />
          </div>
        </div>
        <h1 className="text-3xl  font-bold text-center mb-3 capitalize">
          {SearchedServiceName.replace(/-/g, " ")} Services
        </h1>

        {noVendorsFound ? (
          <div className="text-center text-gray-700 text-xl p-8 bg-gray-100 rounded-xl">
            😔 No vendors found for this service.
          </div>
        ) : noVendorsAfterFilter ? (
          <div className="text-center text-gray-700 text-xl p-8 bg-gray-100 rounded-xl">
            😔 No services available in your selected location or matching your
            filters.
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <VendorSection
              key={vendor.vendorId}
              vendor={vendor}
              userLocation={BookingCity}
            />
          ))
        )}
      </div>
      <FooterWithCarousel />
    </div>
  );
};

export default CleaningService;
