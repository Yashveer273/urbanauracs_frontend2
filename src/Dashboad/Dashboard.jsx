import React, { useState, useEffect } from "react";

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
import { User } from "lucide-react";
import { GetVenderData } from "./GetVenderData";
import ServiceManager from "./ServiceManager";
import { cities } from "./utility";

import ExportSalesData from "./exportSalesData";
const HomeIcon = () => (
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
    className="lucide lucide-home"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const Package2Icon = () => (
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
    className="lucide lucide-package-2"
  >
    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.79 1.1L21 9" />
    <line x1="12" x2="12" y1="12" y2="17" />
    <path d="M12 18h.01" />
  </svg>
);
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
const SearchIcon = () => (
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
    className="lucide lucide-search"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const LogOutIcon = () => (
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
    className="lucide lucide-log-out"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
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
const ChevronRightIcon = () => (
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
    className="lucide lucude-chevron-right"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const DollarSignIcon = () => (
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
    className="lucide lucide-dollar-sign"
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const FileTextIcon = () => (
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
    className="lucide lucide-file-text"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);
const SettingsIcon = () => (
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
    className="lucide lucide-settings"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.122a2 2 0 0 1-1.583 1.939l-1.6.32a2 2 0 0 0-1.742 2.373l-.066.265a2 2 0 0 1-1.637 1.838l-.265.066a2 2 0 0 0-2.373 1.742l-.32 1.6A2 2 0 0 1 2 12.22v.44a2 2 0 0 0 2 2h.122a2 2 0 0 1 1.939 1.583l.32 1.6a2 2 0 0 0 2.373 1.742l.265-.066a2 2 0 0 1 1.838-1.637l.066-.265a2 2 0 0 0 1.742-2.373l1.6-.32A2 2 0 0 1 22 12.22v-.44a2 2 0 0 0-2-2h-.122a2 2 0 0 1-1.939-1.583l-.32-1.6a2 2 0 0 0-2.373-1.742l-.265.066a2 2 0 0 1-1.838 1.637l-.066.265A2 2 0 0 0 12.22 2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const LayoutDashboardIcon = () => (
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
    className="lucide lucide-layout-dashboard"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [FDBservices, setFDBServices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tagAccess, setTagAccess] = useState([]);
  // ------------------------------------------------------------------
  const checkAuth = () => {
    const token = localStorage.getItem("urbanauraservicesdashauthToken");
    const dashtagAccess = localStorage.getItem(
      "urbanauraservicesdashtagAccess"
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
    console.log(newService);
    try {
      if (FDBservices.length > 0) {
        // ✅ Document exists → update its 'data' array
        const docId = FDBservices[0].id;
        const docRef = doc(firestore, "homeCleaningServiceDB", docId);

        await updateDoc(docRef, {
          data: newService,
        });

        console.log("Service added to existing document!");
      } else {
        // ❌ No document yet → create a new one
        await addDoc(collection(firestore, "homeCleaningServiceDB"), {
          data: newService, // Initialize array with first service
        });

        console.log("New document created with service!");
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

        console.log("Service added to existing document!");
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
                : vendor
            );
            return { ...service, data: updatedVendors };
          }
          return service;
        });

        // Step 3: Save back updated array
        await updateDoc(docRef, {
          data: updatedDataArray,
        });

        console.log("✅ Vendor updated successfully in Firestore!");
      } else {
        console.error("❌ No document in Firestore to update");
      }
    } catch (err) {
      console.error("Error updating vendor:", err);
    }
  };

  const fetchServices = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "homeCleaningServiceDB")
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

  useEffect(() => {
    checkAuth();
  }, []);

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

      console.log("Service deleted successfully");
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
        service.id === id ? { ...service, ServiceName: newName } : service
      )
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
          : service
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
      (s) => s.id === selectedService.id
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
            })
          );
          return { ...service, data: updatedData };
        }
        return service;
      })
    );

    // ✅ Update local state with resolved data
    setServices(updatedServices);

    // ✅ Update selected service too
    const updatedSelectedService = updatedServices.find(
      (s) => s.id === selectedService.id
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

    console.log("Vendor updated successfully!", updatedServices);
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
        (s) => s.id === selectedService.id
      );
      setSelectedService(updatedSelectedService);

      console.log("Vendor removed successfully");
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
      (s) => s.id === selectedService.id
    );
    setSelectedService(updatedSelectedService);
    const updatedSelectedVendor = updatedSelectedService.data.find(
      (v) => v.vendorId === selectedVendor.vendorId
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
  const handleUpdateVendorService = async (e) => {
    e.preventDefault();

    const updatedServices = services.map((service) => {
      if (service.id === selectedService.id) {
        const updatedData = service.data.map((vendor) => {
          if (vendor.vendorId === selectedVendor.vendorId) {
            const updatedVendorServices = vendor.services.map((vService) => {
              if (vService.id === editingServiceIdInVendor) {
                return {
                  ...vService,
                  ...serviceFormData,
                  inclusions: serviceFormData.inclusions
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item),
                  exclusions: serviceFormData.exclusions
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item),
                };
              }
              return vService;
            });
            return { ...vendor, services: updatedVendorServices };
          }
          return vendor;
        });
        return { ...service, data: updatedData };
      }
      return service;
    });

    setServices(updatedServices);
    await EditServiceDB(updatedServices);
    const updatedSelectedService = updatedServices.find(
      (s) => s.id === selectedService.id
    );
    setSelectedService(updatedSelectedService);
    const updatedSelectedVendor = updatedSelectedService.data.find(
      (v) => v.vendorId === selectedVendor.vendorId
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
        (s) => s.id === selectedService.id
      );
      setSelectedService(updatedSelectedService);

      const updatedSelectedVendor = updatedSelectedService.data.find(
        (v) => v.vendorId === selectedVendor.vendorId
      );
      setSelectedVendor(updatedSelectedVendor);

      console.log("Vendor service deleted successfully");
    } catch (error) {
      console.error("Error deleting vendor service:", error);
    }
  };

  // Handles showing the detailed view of a service.
  const handleShowServiceDetails = (service) => {
    setSelectedVendorService(service);
    setShowServiceDetailsPanel(true);
  };

  // Handles closing the detailed service view.
  const handleCloseServiceDetailsPanel = () => {
    setSelectedVendorService(null);
    setShowServiceDetailsPanel(false);
  };

  services.filter((service) =>
    service.ServiceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const passVender = (selectedVendor) => {
    console.log(selectedVendor);

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
  // --------------------------------------------------------------------------------------
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setSelectedService(null);
    setShowVendorServicesPanel(false);
    setEditingVendorId(null);
    setSearchTerm("");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "auth":
        return (
          <div className="flex flex-col items-center justify-center h-full p-8">
            {/* <AuthDashboard /> */}
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
          <div className="flex flex-col items-center justify-center h-full p-8">
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
              <div className=" flex">
                <HomeCarousalAssetController />
                <SocialLinksManager />
              </div>
            ) : (
              <LockedBox
                className="flex justify-center items-center h-screen"
                label="Users"
              />
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
    <div className="flex bg-gray-100 min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <Package2Icon className="w-8 h-8 mr-2 text-indigo-600" />
            Dashboard
          </h1>

          <nav>
            <ul>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("auth")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "auth"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <LayoutDashboardIcon className="w-5 h-5 mr-3" />
                  Users
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("services")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "services"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Package2Icon className="w-5 h-5 mr-3" />
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("Export-Sales")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "Export-Sales"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FileTextIcon className="w-5 h-5 mr-3" />
                  Export Sales Data
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("VandersSection")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "VandersSection"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Vanders Section
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("sales")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "sales"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <DollarSignIcon className="w-5 h-5 mr-3" />
                  Sales
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("Coupon-Manager")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "Coupon-Manager"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FileTextIcon className="w-5 h-5 mr-3" />
                  Coupon Manager
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("Website-Content")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "HomeCarousalAssetController"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FileTextIcon className="w-5 h-5 mr-3" />
                  Website Content
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("Ticket")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "Ticket"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FileTextIcon className="w-5 h-5 mr-3" />
                  Ticket
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  onClick={() => handleTabClick("dashboard-controller")}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    activeTab === "dashboard-controller"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <SettingsIcon className="w-5 h-5 mr-3" />
                  Dashboard Controller
                </a>
              </li>
            </ul>
            <button
              onClick={handleLogout}
              className="
    flex items-center px-5 py-2 bg-red-500 text-white font-semibold rounded-lg
    shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
  "
            >
              <LogOutIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
          </nav>
        </div>
      </aside>
      {/* --------------------------------------------------------------------------------------------------- */}
      <>
        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>

        {/* Floating Action Button for adding a vendor */}

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
              className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 text-white text-3xl font-bold rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-200 z-50"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          )}

        {/* Modal Form for adding/editing a vendor */}
        {showVendorForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={editingVendorId ? handleUpdateVendor : handleAddVendor}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg"
            >
              <h3 className="text-xl font-semibold mb-4">
                {editingVendorId ? "Edit Vendor" : "Add New Vendor"}
              </h3>
              <GetVenderData passVender={passVender} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  disabled={true}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Vendor Image URL"
                  disabled={true}
                  value={vendorFormData.vendorImage}
                  onChange={(e) =>
                    setVendorFormData({
                      ...vendorFormData,
                      vendorImage: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="number"
                  step="0.1"
                  placeholder="Rating (e.g., 4.9)"
                  value={vendorFormData.rating}
                  disabled={true}
                  onChange={(e) =>
                    setVendorFormData({
                      ...vendorFormData,
                      rating: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Reviews (e.g., 245+)"
                  disabled={true}
                  value={vendorFormData.reviews}
                  onChange={(e) =>
                    setVendorFormData({
                      ...vendorFormData,
                      reviews: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

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
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150 max-h-40 overflow-y-auto"
                >
                  <option value="">-- Select City --</option>
                  {cities.map((city, index) => (
                    <option
                      key={index}
                      value={city}
                      className="bg-blue-900 text-white" // navy blue background + white text
                    >
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
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
                  className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-200"
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

                        // Add confirmation dialog
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this service?"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <form
              onSubmit={
                editingServiceIdInVendor
                  ? handleUpdateVendorService
                  : handleAddServiceToVendor
              }
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-xl font-semibold mb-4">
                {editingServiceIdInVendor ? "Edit Service" : "Add New Service"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
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
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Location */}

                {/* Original Price */}
                <input
                  type="number"
                  step="1"
                  placeholder="Original Price"
                  value={serviceFormData.originalPrice}
                  onChange={(e) => {
                    const originalPrice = parseFloat(e.target.value) || 0;
                    const discount = parseFloat(serviceFormData.discount) || 0;
                    const price =
                      originalPrice - (originalPrice * discount) / 100;
                    setServiceFormData({
                      ...serviceFormData,
                      originalPrice,
                      price,
                    });
                  }}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Discount (%) */}
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
                    setServiceFormData({ ...serviceFormData, discount, price });
                  }}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Auto-calculated Price (Read-only) */}
                <input
                  type="number"
                  placeholder="Price"
                  value={serviceFormData.price}
                  readOnly
                  className="p-3 border rounded-lg bg-gray-100 text-gray-500 focus:outline-none"
                />

                {/* Description */}
                <textarea
                  placeholder="Description"
                  value={serviceFormData.description}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      description: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg col-span-1 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                ></textarea>

                {/* Image URL */}
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
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Rating */}
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
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Reviews */}
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
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Duration */}
                <input
                  type="text"
                  placeholder="Duration (e.g., 45 mins)"
                  value={serviceFormData.duration}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      duration: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Inclusions */}
                <textarea
                  placeholder="Inclusions (comma separated)"
                  value={serviceFormData.inclusions}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      inclusions: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg col-span-1 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="2"
                ></textarea>

                {/* Exclusions */}
                <textarea
                  placeholder="Exclusions (comma separated)"
                  value={serviceFormData.exclusions}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      exclusions: e.target.value,
                    })
                  }
                  className="p-3 border rounded-lg col-span-1 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="2"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
                >
                  {editingServiceIdInVendor ? "Save Service" : "Create Service"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingServiceIdInVendor(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-200"
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
            className={`fixed inset-0 bg-gray-100 shadow-2xl p-8 transform transition-transform duration-500 ease-in-out z-50 overflow-y-auto ${
              showServiceDetailsPanel ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handleCloseServiceDetailsPanel}
                  className="text-gray-500 hover:text-gray-800 text-3xl font-bold p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 flex items-center"
                >
                  <ChevronLeftIcon className="w-6 h-6 mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <h2 className="text-3xl font-bold text-gray-800 ml-auto">
                  Service Details
                </h2>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={selectedVendorService.serviceImage}
                  alt={selectedVendorService.title}
                  className="w-full h-80 object-cover"
                />
                <div className="p-8">
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    {selectedVendorService.title}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {selectedVendorService.location}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-indigo-600">
                        ₹{selectedVendorService.price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{selectedVendorService.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500 text-2xl">★</span>
                      <span className="font-bold text-gray-700 text-lg">
                        {selectedVendorService.rating}
                      </span>
                      <span className="text-gray-500">
                        ({selectedVendorService.reviews})
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedVendorService.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Duration
                      </h3>
                      <p className="text-gray-600">
                        {selectedVendorService.duration}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Inclusions
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {selectedVendorService.inclusions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    {selectedVendorService.exclusions &&
                      selectedVendorService.exclusions.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Exclusions
                          </h3>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {selectedVendorService.exclusions.map(
                              (item, index) => (
                                <li key={index}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
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
