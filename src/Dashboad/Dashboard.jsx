import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  doc,
  arrayRemove,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import SalesSection from "./salesSection";
import { firestore } from "../firebaseCon";
import TicketDashboard from "./TicketSystem";
import AuthDashboard from "./authData";
import DashboardContrller from "./DashboardController";
import DashboardLogin from "./loginDashboard";
import CouponManager from "./coupancord";
import HomeCarousalAssetController from "./HomeCarousalAssetController";
import SocialLinksManager from "./socialMedia";
import VandersSection from "./VandersSection";
import NotificationDashboard from "./Notificationcontroller";
import BannerManagement from "./BannerManagement";
import { GetVenderData } from "./GetVenderData";
import ServiceManager from "./ServiceManager";
import { cities } from "./utility";

import ExportSalesData from "./exportSalesData";
import DashboardNavigator from "./DashboardNavigator";
import BlockedDatesTable from "./blockDate";
import AddAppBanner from "./AddAppBanner";
import AdminChat from "../chat/AdminChat";
import ImageUploadPopup from "./ImageUploadPopup";
import WebsiteContentPage from "./WebsiteContentPage";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-plus"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-edit"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-trash-2"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-left"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const Dashboard = () => {
const location = useLocation();

const pathToTab = {
  "/Dashboard/users": "auth",
  "/Dashboard/ticket": "Ticket",
  "/Dashboard/sales": "sales",
  "/Dashboard/venders": "VandersSection",
  "/Dashboard/services": "services",
  "/Dashboard/chat-controller": "Chat-Controller",
  "/Dashboard/banner": "Banner",
  "/Dashboard/coupon-manager": "Coupon-Manager",
  "/Dashboard/website-content": "Website-Content",
  "/Dashboard/export-sales": "Export-Sales",
  "/Dashboard/notification": "Notification",
  "/Dashboard/dashboard-controller": "dashboard-controller",
};

const activeTab = pathToTab[location.pathname] || "auth";
  const [services, setServices] = useState([]);
  const [FDBservices, setFDBServices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tagAccess, setTagAccess] = useState([]);
  // ------------------------------------------------------------------
  const checkAuth = () => {
    const token = localStorage.getItem("urbanauraservicesdashauthToken");
    const dashtagAccess = localStorage.getItem(
      "urbanauraservicesdashtagAccess",
    );

    if (token) {
      setIsAuthenticated(true);
      setTagAccess(dashtagAccess ? dashtagAccess.split(",") : []);

      fetchServices();
    } else {
      setIsAuthenticated(false);
      setTagAccess([]);
    }
  };
  const LockedBox = ({ label }) => (
    <div className="w-full max-w-md h-64 flex flex-col items-center justify-center p-6 bg-blue-50 border border-gray-300 rounded-3xl shadow-2xl transition-all duration-500 hover:scale-105">
      {/* Custom SVG for the lock icon. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-16 h-16 text-rose-500 animate-pulse"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {/* Title with improved typography. */}
      <h2 className="text-3xl font-extrabold text-gray-900 mt-4 tracking-tight">
        {label}
      </h2>
      {/* Sub-label with refined text. */}
      <p className="text-gray-700 mt-2 text-sm font-medium text-center">
        Access Restricted
      </p>
    </div>
  );
  const handleLogout = () => {
    localStorage.removeItem("urbanauraservicesdashauthToken");
    localStorage.removeItem("urbanauraservicesdashtagAccess");
    window.location.reload();
  };

  const SaveSubmit = async (FDBservices, newService) => {
    try {
      if (FDBservices.length > 0) {
        // ✅ Document exists → update its 'data' array
        const docId = FDBservices[0].id;
        const docRef = doc(firestore, "homeCleaningServiceDB", docId);

        await updateDoc(docRef, {
          data: newService,
        });
      } else {
        // ❌ No document yet → create a new one
        await addDoc(collection(firestore, "homeCleaningServiceDB"), {
          data: newService, // Initialize array with first service
        });
      }
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };
  const DeleteService = async (id) => {
    try {
      await deleteDoc(doc(firestore, "homeCleaningServiceDB", id));
    } catch (err) {
      console.error(err);
    }
  };
  const EditServiceDB = async (newService) => {
    try {
      if (FDBservices.length > 0) {
        // ✅ Document exists → update its 'data' array
        const docId = FDBservices[0].id;
        const docRef = doc(firestore, "homeCleaningServiceDB", docId);

        await updateDoc(docRef, {
          data: newService,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const EditVendorDB = async (serviceId, vendorId, updatedVendor) => {
    try {
      if (FDBservices.length > 0) {
        const docId = FDBservices[0].id; // Firestore document ID
        const docRef = doc(firestore, "homeCleaningServiceDB", docId);

        // Step 1: Get current data
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          console.error("❌ Document does not exist");
          return;
        }

        const dataArray = docSnap.data().data; // Existing array from Firestore

        // Step 2: Find service and vendor
        const updatedDataArray = dataArray.map((service) => {
          if (service.id === serviceId) {
            const updatedVendors = service.data.map((vendor) =>
              vendor.vendorId === vendorId
                ? { ...vendor, ...updatedVendor }
                : vendor,
            );
            return { ...service, data: updatedVendors };
          }
          return service;
        });

        // Step 3: Save back updated array
        await updateDoc(docRef, {
          data: updatedDataArray,
        });
      } else {
        console.error("❌ No document in Firestore to update");
      }
    } catch (err) {
      console.error("Error updating vendor:", err);
    }
  };

  const fetchServices = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "homeCleaningServiceDB"),
    );
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Firestore document ID
      ...doc.data(), // Document data
    }));
    setFDBServices(data);
    if (data.length > 0) {
      setServices(data[0].data || []); // Use [0] only if you have one doc
    }
  };
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;
    checkAuth();
  }, []);
useEffect(() => {
  setSelectedService(null);
  setShowVendorServicesPanel(false);
  setEditingVendorId(null);
  setSearchTerm("");
}, [activeTab]);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [newServiceName, setNewServiceName] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorFormData, setVendorFormData] = useState({
    vendorName: "",
    vendorImage: "",
    rating: "",
    reviews: "",
    location: "",
    vendorlocation: "",
    vendor_id: "",
  });
  const [editingVendorId, setEditingVendorId] = useState(null);

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorServicesPanel, setShowVendorServicesPanel] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    title: "",
    location: "",
    price: "",
    discount: "",
    originalPrice: "",
    description: "",
    serviceImage: "",
    rating: "",
    reviews: "",
    duration: "",
    inclusions: "",
    exclusions: "",
  });

  const [editingServiceIdInVendor, setEditingServiceIdInVendor] =
    useState(null);

  const [selectedVendorService, setSelectedVendorService] = useState(null);
  const [showServiceDetailsPanel, setShowServiceDetailsPanel] = useState(false);

  // Handles adding a new top-level service.
  const handleCreateService = () => {
    if (newServiceName.trim() === "") return;
    const newService = {
      id: Date.now(),
      ServiceName: newServiceName.trim(),
      data: [],
    };
    setServices([...services, newService]);
    setNewServiceName("");
  };

  // Handles deleting a top-level service.
  const handleDeleteService = async (id) => {
    try {
      // ✅ Find the service object to remove
      const serviceToDelete = services.find((service) => service.id === id);
      if (!serviceToDelete) return;

      // ✅ Firestore document reference
      const docId = FDBservices[0]?.id;
      if (!docId) {
        console.error("Firestore doc not found");
        return;
      }

      const docRef = doc(firestore, "homeCleaningServiceDB", docId);

      // ✅ Remove that specific object from the array in Firestore
      await updateDoc(docRef, {
        data: arrayRemove(serviceToDelete),
      });

      // ✅ Update React state
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  // Handles saving an edited top-level service name.
  const handleSaveEdit = async (id, newName) => {
    const docId = FDBservices[0]?.id;
    if (!docId || !editingServiceId) {
      console.error("Missing docId or editingServiceId");
      return;
    }
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, ServiceName: newName } : service,
      ),
    );
    try {
      const docRef = doc(firestore, "homeCleaningServiceDB", docId);

      // ✅ Fetch current document
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        console.error("Document not found");
        return;
      }

      const docData = snapshot.data();
      const currentArray = docData.data || []; // Your services array is under `data`

      // ✅ Update only matching service
      const updatedArray = currentArray.map((service) =>
        service.id === editingServiceId
          ? { ...service, ServiceName: newName }
          : service,
      );

      // ✅ Update Firestore
      await updateDoc(docRef, {
        data: updatedArray, // ✅ Replace only `data` array
      });
    } catch (err) {
      console.log(err);
    }
    setEditingServiceId(null);
  };

  // Handles opening the vendor details panel for a selected top-level service.
  const handleSelectService = (service) => {
    setSelectedService(service);
    setShowVendorServicesPanel(false);
    setEditingVendorId(null);
  };

  // Handles closing the vendor details panel.
  const handleClosePanel = () => {
    setSelectedService(null);
  };

  // Handles adding a new vendor to the selected top-level service.
  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!vendorFormData.vendorName.trim()) return;

    const newVendor = {
      ...vendorFormData,
      vendorId: Date.now(),
      services: [],
      rating: parseFloat(vendorFormData.rating) || 0,
      reviews: vendorFormData.reviews.toString(),
    };

    const updatedServices = services.map((service) => {
      if (service.id === selectedService.id) {
        return { ...service, data: [...service.data, newVendor] };
      }
      return service;
    });

    setServices(updatedServices);
    const updatedSelectedService = updatedServices.find(
      (s) => s.id === selectedService.id,
    );
    setSelectedService(updatedSelectedService);

    setShowVendorForm(false);
    setVendorFormData({
      vendorName: "",
      vendorImage: "",
      rating: "",
      reviews: "",
      location: "",
    });
  };

  // Handles editing an existing vendor.
  const handleEditVendor = (vendor) => {
    setEditingVendorId(vendor.vendorId);
    setVendorFormData({
      vendorName: vendor.vendorName,
      vendorImage: vendor.vendorImage,
      rating: vendor.rating,
      reviews: vendor.reviews,
      location: vendor.location,
    });
    setShowVendorForm(true);
  };

  // Handles updating a vendor's details.
  const handleUpdateVendor = async (e) => {
    e.preventDefault();

    const updatedServices = await Promise.all(
      services.map(async (service) => {
        if (service.id === selectedService.id) {
          const updatedData = await Promise.all(
            service.data.map(async (vendor) => {
              if (vendor.vendorId === editingVendorId) {
                const updatedVendor = {
                  ...vendor,
                  vendorName: vendorFormData.vendorName,
                  vendorImage: vendorFormData.vendorImage,
                  rating: parseFloat(vendorFormData.rating) || vendor.rating,
                  reviews: vendorFormData.reviews,
                  location: vendorFormData.location,
                };

                // ✅ Update in Firestore
                await EditVendorDB(service.id, vendor.vendorId, updatedVendor);

                return updatedVendor;
              }
              return vendor;
            }),
          );
          return { ...service, data: updatedData };
        }
        return service;
      }),
    );

    // ✅ Update local state with resolved data
    setServices(updatedServices);

    // ✅ Update selected service too
    const updatedSelectedService = updatedServices.find(
      (s) => s.id === selectedService.id,
    );
    setSelectedService(updatedSelectedService);

    // ✅ Reset form
    setEditingVendorId(null);
    setShowVendorForm(false);
    setVendorFormData({
      vendorName: "",
      vendorImage: "",
      rating: "",
      reviews: "",
      location: "",
    });
  };

  // Handles deleting a vendor from the selected top-level service.
  const handleDeleteVendor = async (vendorId) => {
    try {
      const docId = FDBservices[0]?.id; // Main Firestore doc ID
      if (!docId) {
        console.error("Firestore doc not found");
        return;
      }

      const docRef = doc(firestore, "homeCleaningServiceDB", docId);

      // ✅ Fetch current document
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        console.error("Document not found");
        return;
      }

      const docData = snapshot.data();
      const currentArray = docData.data || []; // Top-level `data` array of services

      // ✅ Create updated array: remove vendor from selected service
      const updatedArray = currentArray.map((service) => {
        if (service.id === selectedService.id) {
          // ✅ Remove vendor by ID using index (not filter)
          const vendors = [...service.data];
          const vendorIndex = vendors.findIndex((v) => v.vendorId === vendorId);
          if (vendorIndex !== -1) {
            vendors.splice(vendorIndex, 1);
          }
          return { ...service, data: vendors };
        }
        return service;
      });

      // ✅ Update Firestore
      await updateDoc(docRef, {
        data: updatedArray, // Replace only `data` array
      });

      // ✅ Update local state
      setServices(updatedArray);
      const updatedSelectedService = updatedArray.find(
        (s) => s.id === selectedService.id,
      );
      setSelectedService(updatedSelectedService);
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  // ----- Functions for Vendor Services -----
  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorServicesPanel(true);
  };

  const handleCloseVendorServicesPanel = () => {
    setSelectedVendor(null);
    setShowVendorServicesPanel(false);
  };

  // Handles adding a new service to the selected vendor.
  const handleAddServiceToVendor = async (e) => {
    e.preventDefault();
    if (!serviceFormData.title.trim()) return;

    const newService = {
      ...serviceFormData,
      id: Date.now(),
      price: parseFloat(serviceFormData.price) || 0,
      originalPrice: parseFloat(serviceFormData.originalPrice) || 0,
      rating: parseFloat(serviceFormData.rating) || 0,
      reviews: serviceFormData.reviews.toString(),
      inclusions: serviceFormData.inclusions
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
      exclusions: serviceFormData.exclusions
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    };

    const updatedServices = services.map((service) => {
      if (service.id === selectedService.id) {
        const updatedData = service.data.map((vendor) => {
          if (vendor.vendorId === selectedVendor.vendorId) {
            return { ...vendor, services: [...vendor.services, newService] };
          }
          return vendor;
        });
        return { ...service, data: updatedData };
      }
      return service;
    });

    setServices(updatedServices);
    await SaveSubmit(FDBservices, updatedServices);
    const updatedSelectedService = updatedServices.find(
      (s) => s.id === selectedService.id,
    );
    setSelectedService(updatedSelectedService);
    const updatedSelectedVendor = updatedSelectedService.data.find(
      (v) => v.vendorId === selectedVendor.vendorId,
    );
    setSelectedVendor(updatedSelectedVendor);

    setShowServiceForm(false);
    setServiceFormData({
      title: "",
      location: "",
      price: "",
      originalPrice: "",
      description: "",
      serviceImage: "",
      rating: "",
      reviews: "",
      duration: "",
      inclusions: "",
      exclusions: "",
    });
  };

  // Handles editing a service for a vendor.
  const handleEditVendorService = (service) => {
    setEditingServiceIdInVendor(service.id);
    setServiceFormData({
      ...service,
      inclusions: service.inclusions.join(", "),
      exclusions: service.exclusions.join(", "),
    });
    setShowServiceForm(true);
  };

  // Handles updating a service for a vendor.
  const [isEdtSubmitting, setIsEdtSubmitting] = useState(false);
  const handleUpdateVendorService = async (e) => {
    e.preventDefault();
    setIsEdtSubmitting(true);

    const updatedServices = services.map((service) => {
      if (service.id === selectedService.id) {
        const updatedData = service.data.map((vendor) => {
          if (vendor.vendorId === selectedVendor.vendorId) {
            const updatedVendorServices = vendor.services.map((vService) => {
              if (vService.id === editingServiceIdInVendor) {
                const updated = {
                  ...vService,
                  ...serviceFormData,
                  inclusions: serviceFormData.inclusions
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                  exclusions: serviceFormData.exclusions
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                };

                return updated;
              }

              return vService;
            });

            console.log("Updated vendor services:", updatedVendorServices);

            return {
              ...vendor,
              services: updatedVendorServices,
            };
          }

          return vendor;
        });

        return {
          ...service,
          data: updatedData,
        };
      }

      return service;
    });

    console.log("Final updatedServices:", updatedServices);
    console.dir(updatedServices, { depth: null });
    setServices(updatedServices);
    await EditServiceDB(updatedServices);
    const updatedSelectedService = updatedServices.find(
      (s) => s.id === selectedService.id,
    );
    setSelectedService(updatedSelectedService);
    const updatedSelectedVendor = updatedSelectedService.data.find(
      (v) => v.vendorId === selectedVendor.vendorId,
    );
    setSelectedVendor(updatedSelectedVendor);

    setEditingServiceIdInVendor(null);
    setShowServiceForm(false);
    setServiceFormData({
      title: "",
      location: "",
      price: "",
      originalPrice: "",
      description: "",
      serviceImage: "",
      rating: "",
      reviews: "",
      duration: "",
      inclusions: "",
      exclusions: "",
    });
    setIsEdtSubmitting(false);
  };

  // Handles deleting a service from a vendor.
  const handleDeleteVendorService = async (serviceId) => {
    try {
      const docId = FDBservices[0]?.id; // Firestore document ID
      if (!docId) {
        console.error("Firestore doc not found");
        return;
      }

      const docRef = doc(firestore, "homeCleaningServiceDB", docId);

      // ✅ Fetch current document
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        console.error("Document not found");
        return;
      }

      const docData = snapshot.data();
      const currentArray = docData.data || []; // Your main `data` array

      // ✅ Update nested structure: remove service from selected vendor
      const updatedArray = currentArray.map((service) => {
        if (service.id === selectedService.id) {
          const updatedVendors = service.data.map((vendor) => {
            if (vendor.vendorId === selectedVendor.vendorId) {
              // ✅ Remove the service by ID using splice (not filter)
              const vendorServices = [...vendor.services];
              const index = vendorServices.findIndex((s) => s.id === serviceId);
              if (index !== -1) vendorServices.splice(index, 1);
              return { ...vendor, services: vendorServices };
            }
            return vendor;
          });
          return { ...service, data: updatedVendors };
        }
        return service;
      });

      // ✅ Update Firestore
      await updateDoc(docRef, { data: updatedArray });

      // ✅ Update local state
      setServices(updatedArray);

      const updatedSelectedService = updatedArray.find(
        (s) => s.id === selectedService.id,
      );
      setSelectedService(updatedSelectedService);

      const updatedSelectedVendor = updatedSelectedService.data.find(
        (v) => v.vendorId === selectedVendor.vendorId,
      );
      setSelectedVendor(updatedSelectedVendor);
    } catch (error) {
      console.error("Error deleting vendor service:", error);
    }
  };

  const handleShowServiceDetails = (service) => {
    setSelectedVendorService(service);
    setShowServiceDetailsPanel(true);
  };

  const handleCloseServiceDetailsPanel = () => {
    setSelectedVendorService(null);
    setShowServiceDetailsPanel(false);
  };

  services.filter((service) =>
    service.ServiceName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const passVender = (selectedVendor) => {
    setVendorFormData({
      vendorName: selectedVendor.vendorName,
      vendorImage: selectedVendor.vendorImage,
      rating: selectedVendor.rating,
      reviews: selectedVendor.reviews,
      vendorlocation: selectedVendor.vendorLocation,
      vendor_id: selectedVendor._id,
      location: vendorFormData.location,
    });
  };
 

  const renderContent = () => {
    switch (activeTab) {
      case "auth":
        return (
          <div className="flex flex-col items-center h-full p-8">
            {tagAccess.includes("Users") || tagAccess.includes("Admin") ? (
              <AuthDashboard />
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Users"
              />
            )}
          </div>
        );

      case "services":
        return (
          <>
            {tagAccess.includes("Services") || tagAccess.includes("Admin") ? (
              <ServiceManager
                services={services}
                selectedService={selectedService}
                newServiceName={newServiceName}
                editingServiceId={editingServiceId}
                setNewServiceName={setNewServiceName}
                setEditingServiceId={setEditingServiceId}
                handleCreateService={handleCreateService}
                handleSelectService={handleSelectService}
                handleSaveEdit={handleSaveEdit}
                handleDeleteService={handleDeleteService}
                handleClosePanel={handleClosePanel}
                handleSelectVendor={handleSelectVendor}
                handleEditVendor={handleEditVendor}
                handleDeleteVendor={handleDeleteVendor}
              />
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Services"
              />
            )}
          </>
        );
      case "sales":
        return (
          <div className="w-full">
            {tagAccess.includes("Sales") || tagAccess.includes("Admin") ? (
              <SalesSection />
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Sales"
              />
            )}
          </div>
        );
      case "Ticket":
        return (
          <div className="">
            {tagAccess.includes("Ticket") || tagAccess.includes("Admin") ? (
              <TicketDashboard />
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Ticket"
              />
            )}
          </div>
        );
      case "Export-Sales":
        return (
          <div className="">
            {tagAccess.includes("Xl File Manager") ||
            tagAccess.includes("Admin") ? (
              <div className="flex">
                {/* This is the component we just coded */}
                <ExportSalesData />
              </div>
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Export Sales Data"
              />
            )}
          </div>
        );
      case "Notification":
        return (
          <div className="">
            {tagAccess.includes("Notification") ||
            tagAccess.includes("Admin") ? (
              <div className="flex">
                {/* This is the component we just coded */}
                <NotificationDashboard />
              </div>
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Notification Controller  "
              />
            )}
          </div>
        );
      case "Chat-Controller":
        return (
          <div className="">
            {tagAccess.includes("Chat Controller") ||
            tagAccess.includes("Admin") ? (
              <div className="flex">
                <AdminChat />
              </div>
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Chat Controller  "
              />
            )}
          </div>
        );
      case "Banner":
        return (
          <div className="">
            {tagAccess.includes("Banner") || tagAccess.includes("Admin") ? (
              <div className="flex">
                {/* This is the component we just coded */}
                <BannerManagement />
              </div>
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Banner Management"
              />
            )}
          </div>
        );
      case "Coupon-Manager":
        return (
          <div className="">
            {tagAccess.includes("Coupon Manager") ||
            tagAccess.includes("Admin") ? (
              <div className=" flex">
                <CouponManager />
              </div>
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Users"
              />
            )}
          </div>
        );
      case "Website-Content":
  return (
    <div className="">
      {tagAccess.includes("Website Content") ||
      tagAccess.includes("Admin") ? (
        <WebsiteContentPage />
      ) : (
        <LockedBox label="Website Content" />
      )}
    </div>
  );
      case "VandersSection":
        return (
          <div className="">
            {tagAccess.includes("Venders Section") ||
            tagAccess.includes("Admin") ? (
              <VandersSection />
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Users"
              />
            )}
          </div>
        );
      case "dashboard-controller":
        return (
          <div className="">
            {tagAccess.includes("Admin") ? (
              <DashboardContrller />
            ) : (
              <div className="flex justify-center items-center h-screen">
                <LockedBox label="Dashboard Controller" />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return isAuthenticated != true ? (
    <DashboardLogin />
  ) : (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen font-sans">
      {/* <ImageUploadPopup /> */}
     <DashboardNavigator handleLogout={handleLogout} />

      {/* --------------------------------------------------------------------------------------------------- */}
      <>
        {/* Main Content Area */}
        <main className="flex-1 w-full p-2 h-[100vh] overflow-auto">
          {renderContent()}
        </main>

        {activeTab === "services" &&
          selectedService &&
          !showVendorServicesPanel && (
            <button
              onClick={() => {
                setShowVendorForm(true);
                setEditingVendorId(null);
                setVendorFormData({
                  vendorName: "",
                  vendorImage: "",
                  rating: "",
                  reviews: "",
                  location: "",
                });
              }}
              className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-green-500 text-white text-3xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-200 z-50"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          )}

        {/* Modal Form for adding/editing a vendor */}
        {showVendorForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
            <form
              onSubmit={editingVendorId ? handleUpdateVendor : handleAddVendor}
              className="w-full max-w-180 rounded-2xl bg-white shadow-2xl"
            >
              <div className="border-b border-zinc-200 px-6 py-5">
                <h3 className="text-xl font-semibold text-zinc-900">
                  {editingVendorId ? "Edit Vendor" : "Add New Vendor"}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Select vendor and assign service location.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <GetVenderData passVender={passVender} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Vendor Name"
                    value={vendorFormData.vendorName}
                    onChange={(e) =>
                      setVendorFormData({
                        ...vendorFormData,
                        vendorName: e.target.value,
                      })
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 outline-none"
                  />

                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
  <input
    type="text"
    placeholder="Vendor Image URL"
    disabled
    value={vendorFormData.vendorImage}
    onChange={(e) =>
      setVendorFormData({
        ...vendorFormData,
        vendorImage: e.target.value,
      })
    }
    className="flex-1 w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 outline-none"
  />

  <ImageUploadPopup/>
</div>

                  <input
                    type="number"
                    step="0.1"
                    placeholder="Rating"
                    value={vendorFormData.rating}
                    disabled
                    onChange={(e) =>
                      setVendorFormData({
                        ...vendorFormData,
                        rating: e.target.value,
                      })
                    }
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Reviews"
                    disabled
                    value={vendorFormData.reviews}
                    onChange={(e) =>
                      setVendorFormData({
                        ...vendorFormData,
                        reviews: e.target.value,
                      })
                    }
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 outline-none"
                  />

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="vendorLocation"
                      className="mb-1 block text-sm font-medium text-zinc-700"
                    >
                      Vendor Location
                    </label>

                    <select
                      id="vendorLocation"
                      name="vendorLocation"
                      value={vendorFormData.location}
                      onChange={(e) =>
                        setVendorFormData({
                          ...vendorFormData,
                          location: e.target.value,
                        })
                      }
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                    >
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-zinc-200 px-6 py-4">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 active:scale-95"
                >
                  {editingVendorId ? "Save Vendor" : "Create Vendor"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVendorForm(false);
                    setEditingVendorId(null);
                    setVendorFormData({
                      vendorName: "",
                      vendorImage: "",
                      rating: "",
                      reviews: "",
                      location: "",
                    });
                  }}
                  className="flex-1 rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vendor Services Panel (Slide-in) */}
        <div
          className={`fixed inset-0 bg-gray-100 shadow-2xl p-8 transform transition-transform duration-500 ease-in-out z-50 overflow-y-auto ${
            showVendorServicesPanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleCloseVendorServicesPanel}
              className="text-gray-500 hover:text-gray-800 text-2xl font-bold p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <ChevronLeftIcon className="w-6 h-6 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 ml-auto">
              Services by {selectedVendor?.vendorName}
            </h2>
            <button
              onClick={() => {
                setShowServiceForm(true);
                setEditingServiceIdInVendor(null);
                setServiceFormData({
                  title: "",
                  location: "",
                  price: "",
                  discount: "",
                  originalPrice: "",
                  description: "",
                  serviceImage: "",
                  rating: "",
                  reviews: "",
                  duration: "",
                  inclusions: "",
                  exclusions: "",
                });
              }}
              className="w-14 h-14 bg-green-500 text-white text-3xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-200 ml-4"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>

          {selectedVendor && selectedVendor.services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedVendor.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col cursor-pointer transform hover:scale-105 transition-transform duration-200"
                  onClick={() => handleShowServiceDetails(service)}
                >
                  <img
                    src={service.serviceImage}
                    alt={service.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-700 truncate">
                    {service.title}
                  </h3>
                  <h3 className="text-xl font-semibold text-gray-700 truncate">
                    {service.description}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {selectedVendor.location}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-yellow-500 text-lg">★</span>
                    <span className="font-bold text-gray-700">
                      {service.rating}
                    </span>
                    <span className="text-gray-500">({service.reviews})</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditVendorService(service);
                      }}
                      className="flex-1 px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg shadow-sm hover:bg-yellow-500 transition-colors duration-200 flex items-center justify-center"
                    >
                      <EditIcon className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this service?",
                        );

                        if (confirmDelete) {
                          handleDeleteVendorService(service.id);
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                    >
                      <TrashIcon className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-10">
              No services available for this vendor. Click the add button to get
              started!
            </p>
          )}
        </div>

        {/* Modal Form for adding/editing a vendor's service */}
        {showServiceForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
            <form
              onSubmit={
                editingServiceIdInVendor
                  ? handleUpdateVendorService
                  : handleAddServiceToVendor
              }
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-6 py-5">
                <h3 className="text-xl font-semibold text-zinc-900">
                  {editingServiceIdInVendor
                    ? "Edit Service"
                    : "Add New Service"}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Update service pricing, media, duration and public details.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={serviceFormData.title}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        title: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  <input
                    type="number"
                    step="1"
                    placeholder="Original Price"
                    value={serviceFormData.originalPrice}
                    onChange={(e) => {
                      const originalPrice = parseFloat(e.target.value) || 0;
                      const discount =
                        parseFloat(serviceFormData.discount) || 0;
                      const price =
                        originalPrice - (originalPrice * discount) / 100;
                      setServiceFormData({
                        ...serviceFormData,
                        originalPrice,
                        price,
                      });
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  <input
                    type="number"
                    step="1"
                    placeholder="Discount %"
                    value={serviceFormData.discount}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0;
                      const originalPrice =
                        parseFloat(serviceFormData.originalPrice) || 0;
                      const price =
                        originalPrice - (originalPrice * discount) / 100;
                      setServiceFormData({
                        ...serviceFormData,
                        discount,
                        price,
                      });
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={serviceFormData.price}
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 outline-none"
                  />

                  <textarea
                    placeholder="Description"
                    value={serviceFormData.description}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="sm:col-span-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
  <input
    type="text"
    placeholder="Image URL"
    value={serviceFormData.serviceImage}
    onChange={(e) =>
      setServiceFormData({
        ...serviceFormData,
        serviceImage: e.target.value,
      })
    }
    className="flex-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
  />

  <ImageUploadPopup />
</div>

                  <input
                    type="number"
                    step="0.1"
                    placeholder="Rating"
                    value={serviceFormData.rating}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        rating: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  <input
                    type="text"
                    placeholder="Reviews"
                    value={serviceFormData.reviews}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        reviews: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  <input
                    type="text"
                    placeholder="Duration"
                    value={serviceFormData.duration}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        duration: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  <textarea
                    placeholder="Inclusions, comma separated"
                    value={serviceFormData.inclusions}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        inclusions: e.target.value,
                      })
                    }
                    rows="2"
                    className="sm:col-span-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />

                  <textarea
                    placeholder="Exclusions, comma separated"
                    value={serviceFormData.exclusions}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        exclusions: e.target.value,
                      })
                    }
                    rows="2"
                    className="sm:col-span-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 flex gap-3 border-t border-zinc-200 bg-white px-6 py-4">
                <button
                  type="submit"
                  disabled={editingServiceIdInVendor && isEdtSubmitting}
                  className={`flex-1 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition active:scale-95 ${
                    editingServiceIdInVendor && isEdtSubmitting
                      ? "cursor-not-allowed bg-zinc-300 text-white"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  {editingServiceIdInVendor ? (
                    isEdtSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </div>
                    ) : (
                      "Save Service"
                    )
                  ) : (
                    "Create Service"
                  )}
                </button>

                <button
                  type="button"
                  disabled={editingServiceIdInVendor && isEdtSubmitting}
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingServiceIdInVendor(null);
                  }}
                  className={`flex-1 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                    editingServiceIdInVendor && isEdtSubmitting
                      ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Service Details Panel (Slide-in) */}
       {selectedVendorService && (
  <div
    className={`fixed inset-0 bg-white transform transition-transform duration-500 ease-in-out z-50 overflow-y-auto ${
      showServiceDetailsPanel ? "translate-x-0" : "translate-x-full"
    }`}
  >
    {/* Header */}
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-zinc-200 px-5 sm:px-8 py-4 flex items-center justify-between">
      <button
        onClick={handleCloseServiceDetailsPanel}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition"
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Back
      </button>

      <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight">
        Service Details
      </h2>

      <div className="w-[86px]" />
    </div>

    {/* Hero Image */}
    <div className="w-full bg-zinc-100">
      <img
        src={selectedVendorService.serviceImage}
        alt={selectedVendorService.title}
        className="w-full h-[260px] sm:h-[360px] lg:h-[430px] object-cover"
      />
    </div>

    {/* Content */}
    <div className="w-full px-5 sm:px-8 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Info */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-zinc-200 pb-8">
          <div>
            <p className="text-sm font-medium text-zinc-500 mb-2">
              Vendor Service
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-950 tracking-tight">
              {selectedVendorService.title}
            </h1>

            <p className="mt-3 text-base text-zinc-500">
              {selectedVendorService.location}
            </p>

            <div className="inline-flex items-center gap-2 mt-5 rounded-full bg-zinc-100 px-4 py-2 text-sm">
              <span className="text-yellow-500 text-base">★</span>
              <span className="font-semibold text-zinc-900">
                {selectedVendorService.rating}
              </span>
              <span className="text-zinc-500">
                ({selectedVendorService.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="lg:text-right">
            <p className="text-sm font-medium text-zinc-500 mb-2">Price</p>

            <div className="flex lg:justify-end items-baseline gap-3">
              <span className="text-4xl font-bold text-zinc-950">
                ₹{selectedVendorService.price}
              </span>

              <span className="text-lg text-zinc-400 line-through">
                ₹{selectedVendorService.originalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="py-8 border-b border-zinc-200">
          <h3 className="text-xl font-semibold text-zinc-900 mb-3">
            Description
          </h3>

          <p className="text-zinc-600 leading-8 max-w-5xl">
            {selectedVendorService.description}
          </p>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-8">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500 mb-2">
              Duration
            </p>

            <h3 className="text-xl font-semibold text-zinc-900">
              {selectedVendorService.duration}
            </h3>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500 mb-4">
              Inclusions
            </p>

            <ul className="space-y-3 text-sm text-zinc-600">
              {selectedVendorService.inclusions?.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-zinc-500 mb-4">
              Exclusions
            </p>

            {selectedVendorService.exclusions?.length > 0 ? (
              <ul className="space-y-3 text-sm text-zinc-600">
                {selectedVendorService.exclusions.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500">
                      ×
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400">No exclusions added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </>
    </div>
  );
};

export default Dashboard;
