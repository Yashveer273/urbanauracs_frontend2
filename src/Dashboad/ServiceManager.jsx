import {
  EditIcon,
  PlusIcon,
  TrashIcon,
  TrendingUpIcon,
  DatabaseBackup,
  Loader2,
} from "lucide-react";
import CityHypePopup from "./CityHypePopup";
import ServiceHypePopup from "./ServiceHypePopup";
import React, { useState } from "react";
import { migrateServiceDataPure } from "../API";

const ServiceManager = ({
  services,
  selectedService,
  newServiceName,
  editingServiceId,

  // setters
  setNewServiceName,
  setEditingServiceId,

  // handlers
  handleCreateService,
  handleSelectService,
  handleSaveEdit,
  handleDeleteService,
  handleClosePanel,
  handleSelectVendor,
  handleEditVendor,
  handleDeleteVendor,
}) => {
  console.log(
    "---------------------------------------------------------",
    services,
  );

  // States for City Hype
  const [isCityHypeOpen, setIsCityHypeOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Select City");

  // States for Service Hype
  const [isServiceHypeOpen, setIsServiceHypeOpen] = useState(false);
  const [selectedServiceHype, setSelectedServiceHype] =
    useState("Select Service");
  const [isMigrateinProcess, setisMigrateinProcess] = useState(false);
  // Handle Service Hype Update
  const handleServiceHypeUpdate = (data) => {
    console.log("Service Hype Update:", data);
    const { service, adjustmentAmount } = data;
    const amount = parseFloat(adjustmentAmount) || 0;

    if (amount === 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Update all vendors for the selected service
    services.forEach((svc) => {
      if (svc.ServiceName === service) {
        svc.data.forEach((vendor) => {
          vendor.services?.forEach((svc) => {
            svc.price = (parseFloat(svc.price) || 0) + amount;
          });
        });
      }
    });

    alert(`Successfully added ₹${amount} to all services in ${service}`);
    setIsServiceHypeOpen(false);
  };

  // Handle City Hype Update
  const handleCityHypeUpdate = (data) => {
    console.log("City Hype Update:", data);
    const { city, adjustmentAmount } = data;
    const amount = parseFloat(adjustmentAmount) || 0;

    if (amount === 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Update all vendors in the selected city
    services.forEach((svc) => {
      svc.data.forEach((vendor) => {
        if (vendor.location === city || vendor.vendorlocation === city) {
          vendor.services?.forEach((svc) => {
            svc.price = (parseFloat(svc.price) || 0) + amount;
          });
        }
      });
    });

    alert(`Successfully added ₹${amount} to all services in ${city}`);
    setIsCityHypeOpen(false);
  };
  return (
    <>
      {/* ================= SERVICES LIST ================= */}
      {!selectedService && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-500"> {/* Shivani */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">     {/* Shivani */}
            Service Categories
          </h2>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">   {/* Shivani */}
            <button
              onClick={() => setIsServiceHypeOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm"
            >
              <TrendingUpIcon size={18} />
              Hype by Service
            </button>

            <ServiceHypePopup
              isOpen={isServiceHypeOpen}
              onClose={() => setIsServiceHypeOpen(false)}
              selectedService={selectedServiceHype}
              onServiceClick={() => setSelectedServiceHype("")}
              onSubmit={handleServiceHypeUpdate}
              services={services.map((s) => s.ServiceName)}
            />
            <button
              onClick={() => setIsCityHypeOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 font-semibold rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors shadow-sm"
            >
              <TrendingUpIcon size={18} />
              Hype by City
            </button>

            {/* The Popup Call */}
            <CityHypePopup
              isOpen={isCityHypeOpen}
              onClose={() => setIsCityHypeOpen(false)}
              selectedCity={selectedCity}
              onCityClick={() => setSelectedCity("")}
              onSubmit={handleCityHypeUpdate}
              cities={[
                ...new Set(
                  services.flatMap((s) => s.data.map((v) => v.location)),
                ),
              ]}
            />
            <button
              onClick={async () => {
                if (isMigrateinProcess) {
                  return;
                } else {
                  setisMigrateinProcess(true);
                  await migrateServiceDataPure(
                    "homeCleaningServiceDB",
                    "updatedCleaningServiceDB",
                  );
                  alert("Data extended to new collection successfully.");
                }
                setisMigrateinProcess(false);
              }}
              className={`
        group flex items-center justify-center gap-3 px-6 py-2.5 
        rounded-xl font-bold text-[10px] uppercase tracking-[0.25em] 
        transition-all duration-300
        ${isMigrateinProcess 
          ? "bg-slate-900 text-slate-500 cursor-wait" 
          : "bg-black text-white hover:bg-slate-800 hover:ring-4 hover:ring-slate-900/10 active:scale-95 shadow-xl shadow-black/20"
        }
      `}
            >
              {isMigrateinProcess ? (
                <>
                  <Loader2 size={16} className="animate-spin text-indigo-500" />
                  <span>Backing up...</span>
                </>
              ) : (
                <>
                  <DatabaseBackup
                    size={16}
                    className="transition-transform group-hover:rotate-12"
                  />
                  <span>Save Service Backup</span>
                </>
              )}
            </button>
          </div>
          <p className="text-gray-500 mb-6">
            Select a category from the side menu to view and manage vendors.
          </p>

          {/* Add Service */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4">       {/* Shivani */}
              <input
                type="text"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new service name..."
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateService()}
              />

              <button
                onClick={handleCreateService}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                <PlusIcon className="inline-block mr-2" />
                Add New Service
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">           
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleSelectService(service)}
                className="bg-white p-4 md:p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition"     
              >    
                {editingServiceId === service.id ? (
                  <input
                    autoFocus
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleSaveEdit(service.id, newServiceName)
                    }
                    className="w-full p-2 border rounded mb-4"
                  />
                ) : (
                  <h3 className="text-xl font-semibold text-gray-700 mb-4 truncate">
                    {service.ServiceName}
                    {service.data.length === 0 && (
                      <span className="ml-2 text-xs bg-red-300 px-2 py-1 rounded-full">
                        Draft
                      </span>
                    )}
                  </h3>
                )}

                <div className="flex gap-2 mt-auto">
                  {editingServiceId === service.id ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(service.id, newServiceName);
                        }}
                        className="flex-1 bg-green-500 text-white py-2 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingServiceId(null);
                          setNewServiceName("");
                        }}
                        className="flex-1 bg-gray-400 text-white py-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingServiceId(service.id);
                        setNewServiceName(service.ServiceName);
                      }}
                      className="flex-1 bg-yellow-400 py-2 rounded"
                    >
                      <EditIcon className="mr-1 inline" />
                      Edit
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Standard browser confirmation dialog
                      const isConfirmed = window.confirm(
                        "Are you sure you want to delete this service?",
                      );

                      if (isConfirmed) {
                        handleDeleteService(service.id);
                      }
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    <TrashIcon className="mr-1 inline" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= VENDORS LIST ================= */}
      {selectedService && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 transition-opacity duration-500"> {/* Shivani */}
          <button
            onClick={handleClosePanel}
            className="mb-4 px-4 py-2 bg-gray-300 rounded"
          >
            ← Back
          </button>

          <h2 className="text-3xl font-bold mb-6">
            Vendors for {selectedService.ServiceName}
          </h2>

          {selectedService.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">     
              {selectedService.data.map((vendor) => (
                <div
                  key={vendor.vendorId}
                  onClick={() => handleSelectVendor(vendor)}
                  className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition"
                >
                  <img
                    src={
                      vendor.vendorImage?.trim()
                        ? vendor.vendorImage
                        : "https://via.placeholder.com/400x200"
                    }
                    alt={vendor.vendorName}
                    className="h-40 w-full object-cover rounded mb-4"
                  />

                  <h3 className="text-xl font-semibold truncate">
                    {vendor.vendorName}
                    {vendor.services.length === 0 && (
                      <span className="ml-2 text-xs bg-red-300 px-2 py-1 rounded-full">
                        Draft
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-gray-500 truncate">
                    {vendor.location}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-bold">{vendor.rating}</span>
                    <span className="text-gray-500">
                      ({vendor.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditVendor(vendor);
                      }}
                      className="flex-1 bg-yellow-400 py-2 rounded"
                    >
                      <EditIcon className="inline mr-1" />
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isConfirmed = window.confirm(
                          "Are you sure you want to delete this vendor?",
                        );

                        if (isConfirmed) {
                          handleDeleteVendor(vendor.vendorId);
                        }
                      }}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      <TrashIcon className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No vendors available for this service.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ServiceManager;