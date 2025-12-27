import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import React from "react";

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
  return (
    <>
      {/* ================= SERVICES LIST ================= */}
      {!selectedService && (
        <div className="max-w-4xl mx-auto transition-opacity duration-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Service Categories
          </h2>

          <p className="text-gray-500 mb-6">
            Select a category from the side menu to view and manage vendors.
          </p>

          {/* Add Service */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleSelectService(service)}
                className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition"
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
                      handleDeleteService(service.id);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded"
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
        <div className="max-w-4xl mx-auto transition-opacity duration-500">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                        handleDeleteVendor(vendor.vendorId);
                      }}
                      className="flex-1 bg-red-500 text-white py-2 rounded"
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
