import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  doc,
  
  updateDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
 
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
import LockedBox from "./LockedBox";
import { createServiceCategoryInFirestore,updateServiceCategoryInFirestore,
  deleteServiceCategoryFromFirestore,addVendorToFirestore,updateVendorInFirestore,deleteVendorFromFirestore
 ,addVendorServiceToFirestore,updateVendorServiceInFirestore,deleteVendorServiceFromFirestore,
 updateHypePriceInFirestore} from "./serviceFirestore";
import {
  checkDashAuthToken,
  clearDashboardAuth,
} from "../dashboardApi";
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
  "/Dashboard/vendors": "VandersSection",
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
  

  
  const [checkingAuth, setCheckingAuth] =
    useState(true);

 

  /*
  |--------------------------------------------------------------------------
  | Check saved JWT with backend
  |--------------------------------------------------------------------------
  */

  const checkAuth = async () => {
    const token = localStorage.getItem(
      "urbanauraservicesdashauthToken",
    );

    /*
     * No token means automatic logout.
     */
    if (!token) {
      setIsAuthenticated(false);
      setTagAccess([]);
      setCheckingAuth(false);

      return false;
    }

    try {
      setCheckingAuth(true);

      /*
       * Backend checks:
       * - JWT signature
       * - JWT expiry
       * - Account exists
       * - Password has not changed
       */
      const response =
        await checkDashAuthToken();

      if (
        response.data?.success !== true ||
        response.data?.valid !== true
      ) {
        clearDashboardAuth();

        setIsAuthenticated(false);
        setTagAccess([]);

        return false;
      }

      const latestTagAccess =
        response.data?.user?.tagAccess || "";

      /*
       * Always update permission information
       * from the backend response.
       */
      localStorage.setItem(
        "urbanauraservicesdashtagAccess",
        latestTagAccess,
      );

      setTagAccess(
        String(latestTagAccess)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      );

      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error(
        "Dashboard authentication failed:",
        error,
      );

      /*
       * The Axios interceptor already removes
       * the token when backend returns:
       *
       * valid: false
       *
       * This is an additional safety cleanup.
       */
      clearDashboardAuth();

      setIsAuthenticated(false);
      setTagAccess([]);

      return false;
    } finally {
      setCheckingAuth(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Verify token when Dashboard opens
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const initializeDashboard =
      async () => {
        const authenticated =
          await checkAuth();

        if (authenticated) {
          await fetchServices();
        }
      };

    initializeDashboard();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Listen when any protected API removes token
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleInvalidAuthentication =
      () => {
        setIsAuthenticated(false);
        setTagAccess([]);
        setCheckingAuth(false);
      };

    window.addEventListener(
      "dashboard-auth-invalid",
      handleInvalidAuthentication,
    );

    return () => {
      window.removeEventListener(
        "dashboard-auth-invalid",
        handleInvalidAuthentication,
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Frontend logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    clearDashboardAuth();

    setIsAuthenticated(false);
    setTagAccess([]);
  };

  const FIRESTORE_MAX_DOC_SIZE_BYTES = 1_048_576;

  const getPayloadSizeInBytes = (payload) =>
    new TextEncoder().encode(JSON.stringify(payload)).length;

  const syncServicesToFirestore = async (nextServices) => {
    const normalizedServices = Array.isArray(nextServices) ? nextServices : [];
    const payload = { data: normalizedServices };
    const payloadSize = getPayloadSizeInBytes(payload);

    if (payloadSize > FIRESTORE_MAX_DOC_SIZE_BYTES) {
      throw new Error(
        `Service data is too large to save in Firestore. Current size is ${payloadSize} bytes, which exceeds the ${FIRESTORE_MAX_DOC_SIZE_BYTES} byte limit.`,
      );
    }

    const existingDoc = FDBservices[0];

    if (existingDoc?.id) {
      const docRef = doc(firestore, "homeCleaningServiceDB", existingDoc.id);
      await updateDoc(docRef, payload);
    } else {
      const newDocRef = await addDoc(collection(firestore, "homeCleaningServiceDB"), payload);
      setFDBServices([{ id: newDocRef.id, data: normalizedServices }]);
    }

    setServices(normalizedServices);
    setFDBServices(
      normalizedServices.map((service, index) => ({
        id: service.id || `service-${index}`,
        data: service.data || [],
      })),
    );

    return normalizedServices;
  };

  const SaveSubmit = async (FDBservices, newService) => {
    try {
      await syncServicesToFirestore(newService);
    } catch (err) {
      console.error("Error saving service:", err);
      throw err;
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
      await syncServicesToFirestore(newService);
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

const SERVICE_COLLECTION = "homeCleaningServiceDB";
const fetchServices = async () => {
  try {
    const categorySnapshot = await getDocs(
      collection(firestore, SERVICE_COLLECTION),
    );

    if (categorySnapshot.empty) {
      setFDBServices([]);
      setServices([]);
      return;
    }

    const categoryPromises = categorySnapshot.docs.map(
      async (categoryDoc) => {
        const categoryData = categoryDoc.data();

        if (!categoryData.ServiceName) {
          return null;
        }

        const vendorsSnapshot = await getDocs(
          collection(
            firestore,
            SERVICE_COLLECTION,
            categoryDoc.id,
            "vendors",
          ),
        );

        const vendorPromises = vendorsSnapshot.docs.map(
          async (vendorDoc) => {
            const vendorData = vendorDoc.data();

            const vendorServicesSnapshot = await getDocs(
              collection(
                firestore,
                SERVICE_COLLECTION,
                categoryDoc.id,
                "vendors",
                vendorDoc.id,
                "services",
              ),
            );

            const vendorServices =
              vendorServicesSnapshot.docs.map((serviceDoc) => ({
                id: serviceDoc.id,
                ...serviceDoc.data(),
              }));

            return {
              vendorId: vendorDoc.id,
              ...vendorData,
              services: vendorServices,
            };
          },
        );

        const vendors = await Promise.all(vendorPromises);

        return {
          id: categoryDoc.id,
          ServiceName: categoryData.ServiceName,
          data: vendors,
        };
      },
    );

    const categoryResults = await Promise.all(categoryPromises);

    const newStructureCategories = categoryResults.filter(Boolean);

    if (newStructureCategories.length > 0) {
      setServices(newStructureCategories);
      setFDBServices(newStructureCategories);
      return;
    }

    const oldDocuments = categorySnapshot.docs.map(
      (documentSnapshot) => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }),
    );

    const oldMainDocument = oldDocuments.find(
      (document) => Array.isArray(document.data),
    );

    const oldServices = oldMainDocument?.data || [];

    setFDBServices(oldDocuments);
    setServices(oldServices);
  } catch (error) {
    console.error("Error fetching services:", error);

    setFDBServices([]);
    setServices([]);
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
 const handleCreateService = async () => {
  const serviceName = newServiceName.trim();

  if (!serviceName) return;

  try {
    const createdService =
      await createServiceCategoryInFirestore({
        id: Date.now(),
        ServiceName: serviceName,
      });

    setServices((currentServices) => [
      ...currentServices,
      createdService,
    ]);

    setNewServiceName("");
  } catch (error) {
    console.error("Error creating service category:", error);
    alert(error.message || "Unable to create service category.");
  }
};

  // Handles deleting a top-level service.
 const handleDeleteService = async (categoryId) => {
  try {
    await deleteServiceCategoryFromFirestore(categoryId);

    setServices((currentServices) =>
      currentServices.filter(
        (service) =>
          String(service.id) !== String(categoryId),
      ),
    );

    if (
      String(selectedService?.id) === String(categoryId)
    ) {
      setSelectedService(null);
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    alert(error.message || "Unable to delete category.");
  }
};
  // Handles saving an edited top-level service name.
 const handleSaveEdit = async (categoryId, newName) => {
  const cleanName = String(newName || "").trim();

  if (!cleanName) {
    alert("Please enter the service category name.");
    return;
  }

  try {
    await updateServiceCategoryInFirestore(
      categoryId,
      cleanName,
    );

    setServices((currentServices) =>
      currentServices.map((service) =>
        String(service.id) === String(categoryId)
          ? {
              ...service,
              ServiceName: cleanName,
            }
          : service,
      ),
    );

    setSelectedService((currentService) => {
      if (
        !currentService ||
        String(currentService.id) !== String(categoryId)
      ) {
        return currentService;
      }

      return {
        ...currentService,
        ServiceName: cleanName,
      };
    });

    setEditingServiceId(null);
    setNewServiceName("");
  } catch (error) {
    console.error("Error renaming category:", error);
    alert(error.message || "Unable to rename category.");
  }
};

const handleHypePriceUpdate = async ({
  type,
  value,
  city,
  service,
  amount,
}) => {
  const {
    updatedServices,
    updatedPriceCount,
  } = await updateHypePriceInFirestore({
    services: services || [],
    type,
    value,
    city,
    service,
    amount,
  });

  setServices(updatedServices);
  setFDBServices(updatedServices);

  setSelectedService((current) => {
    if (!current) return current;

    return (
      updatedServices.find(
        (serviceCategory) =>
          String(serviceCategory.id) === String(current.id),
      ) || current
    );
  });

  return {
    updatedPriceCount,
  };
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
  const handleAddVendor = async (e) => {
  e.preventDefault();

  if (!vendorFormData.vendorName.trim()) {
    alert("Please select a vendor.");
    return;
  }

  if (!selectedService?.id) {
    alert("Service category is not selected.");
    return;
  }

  try {
    const createdVendor = await addVendorToFirestore(
      selectedService.id,
      {
        ...vendorFormData,
        vendorId: Date.now(),
      },
    );

    setServices((currentServices) =>
      currentServices.map((category) => {
        if (
          String(category.id) !==
          String(selectedService.id)
        ) {
          return category;
        }

        return {
          ...category,
          data: [...(category.data || []), createdVendor],
        };
      }),
    );

    setSelectedService((currentService) => {
      if (!currentService) return currentService;

      return {
        ...currentService,
        data: [
          ...(currentService.data || []),
          createdVendor,
        ],
      };
    });

    setShowVendorForm(false);

    setVendorFormData({
      vendorName: "",
      vendorImage: "",
      rating: "",
      reviews: "",
      location: "",
      vendorlocation: "",
      vendor_id: "",
    });
  } catch (error) {
    console.error("Error adding vendor:", error);
    alert(error.message || "Unable to add vendor.");
  }
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

  if (!selectedService?.id || !editingVendorId) {
    alert("Vendor details are incomplete.");
    return;
  }

  try {
    await updateVendorInFirestore(
      selectedService.id,
      editingVendorId,
      vendorFormData,
    );

    const updatedVendor = {
      ...selectedService.data.find(
        (vendor) =>
          String(vendor.vendorId) ===
          String(editingVendorId),
      ),
      ...vendorFormData,
      vendorId: editingVendorId,
      rating:
        Number(vendorFormData.rating) || 0,
      reviews: String(vendorFormData.reviews || ""),
    };

    setServices((currentServices) =>
      currentServices.map((category) => {
        if (
          String(category.id) !==
          String(selectedService.id)
        ) {
          return category;
        }

        return {
          ...category,
          data: (category.data || []).map((vendor) =>
            String(vendor.vendorId) ===
            String(editingVendorId)
              ? updatedVendor
              : vendor,
          ),
        };
      }),
    );

    setSelectedService((currentService) => ({
      ...currentService,
      data: (currentService.data || []).map((vendor) =>
        String(vendor.vendorId) ===
        String(editingVendorId)
          ? updatedVendor
          : vendor,
      ),
    }));

    setEditingVendorId(null);
    setShowVendorForm(false);

    setVendorFormData({
      vendorName: "",
      vendorImage: "",
      rating: "",
      reviews: "",
      location: "",
      vendorlocation: "",
      vendor_id: "",
    });
  } catch (error) {
    console.error("Error updating vendor:", error);
    alert(error.message || "Unable to update vendor.");
  }
};

  // Handles deleting a vendor from the selected top-level service.
  const handleDeleteVendor = async (vendorId) => {
  if (!selectedService?.id) return;

  try {
    await deleteVendorFromFirestore(
      selectedService.id,
      vendorId,
    );

    setServices((currentServices) =>
      currentServices.map((category) => {
        if (
          String(category.id) !==
          String(selectedService.id)
        ) {
          return category;
        }

        return {
          ...category,
          data: (category.data || []).filter(
            (vendor) =>
              String(vendor.vendorId) !==
              String(vendorId),
          ),
        };
      }),
    );

    setSelectedService((currentService) => ({
      ...currentService,
      data: (currentService.data || []).filter(
        (vendor) =>
          String(vendor.vendorId) !==
          String(vendorId),
      ),
    }));
  } catch (error) {
    console.error("Error deleting vendor:", error);
    alert(error.message || "Unable to delete vendor.");
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

  if (!serviceFormData.title.trim()) {
    alert("Please enter the service title.");
    return;
  }

  if (!selectedService?.id || !selectedVendor?.vendorId) {
    alert("Category or vendor is not selected.");
    return;
  }

  try {
    const createdService =
      await addVendorServiceToFirestore(
        selectedService.id,
        selectedVendor.vendorId,
        {
          ...serviceFormData,
          id: Date.now(),
        },
      );

    const updateVendorLocally = (vendor) => {
      if (
        String(vendor.vendorId) !==
        String(selectedVendor.vendorId)
      ) {
        return vendor;
      }

      return {
        ...vendor,
        services: [
          ...(vendor.services || []),
          createdService,
        ],
      };
    };

    setServices((currentServices) =>
      currentServices.map((category) => {
        if (
          String(category.id) !==
          String(selectedService.id)
        ) {
          return category;
        }

        return {
          ...category,
          data: (category.data || []).map(
            updateVendorLocally,
          ),
        };
      }),
    );

    setSelectedService((currentService) => ({
      ...currentService,
      data: (currentService.data || []).map(
        updateVendorLocally,
      ),
    }));

    setSelectedVendor((currentVendor) => ({
      ...currentVendor,
      services: [
        ...(currentVendor.services || []),
        createdService,
      ],
    }));

    setShowServiceForm(false);

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
  } catch (error) {
    console.error("Error adding vendor service:", error);
    alert(error.message || "Unable to add service.");
  }
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

  if (isEdtSubmitting) return;

  if (
    !selectedService?.id ||
    !selectedVendor?.vendorId ||
    !editingServiceIdInVendor
  ) {
    alert("Service information is incomplete.");
    return;
  }

  setIsEdtSubmitting(true);

  try {
    const updatedService =
      await updateVendorServiceInFirestore(
        selectedService.id,
        selectedVendor.vendorId,
        editingServiceIdInVendor,
        serviceFormData,
      );

    const updateVendorServicesLocally = (vendor) => {
      if (
        String(vendor.vendorId) !==
        String(selectedVendor.vendorId)
      ) {
        return vendor;
      }

      return {
        ...vendor,
        services: (vendor.services || []).map(
          (vendorService) =>
            String(vendorService.id) ===
            String(editingServiceIdInVendor)
              ? {
                  ...vendorService,
                  ...updatedService,
                }
              : vendorService,
        ),
      };
    };

    setServices((currentServices) =>
      currentServices.map((category) => {
        if (
          String(category.id) !==
          String(selectedService.id)
        ) {
          return category;
        }

        return {
          ...category,
          data: (category.data || []).map(
            updateVendorServicesLocally,
          ),
        };
      }),
    );

    setSelectedService((currentService) => ({
      ...currentService,
      data: (currentService.data || []).map(
        updateVendorServicesLocally,
      ),
    }));

    setSelectedVendor((currentVendor) => ({
      ...currentVendor,
      services: (currentVendor.services || []).map(
        (vendorService) =>
          String(vendorService.id) ===
          String(editingServiceIdInVendor)
            ? {
                ...vendorService,
                ...updatedService,
              }
            : vendorService,
      ),
    }));

    setEditingServiceIdInVendor(null);
    setShowServiceForm(false);

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
  } catch (error) {
    console.error("Error updating vendor service:", error);
    alert(error.message || "Unable to update service.");
  } finally {
    setIsEdtSubmitting(false);
  }
};

  // Handles deleting a service from a vendor.
 const handleDeleteVendorService = async (serviceId) => {
  if (!selectedService?.id || !selectedVendor?.vendorId) {
    return;
  }

  try {
    await deleteVendorServiceFromFirestore(
      selectedService.id,
      selectedVendor.vendorId,
      serviceId,
    );

    const removeServiceLocally = (vendor) => {
      if (
        String(vendor.vendorId) !==
        String(selectedVendor.vendorId)
      ) {
        return vendor;
      }

      return {
        ...vendor,
        services: (vendor.services || []).filter(
          (vendorService) =>
            String(vendorService.id) !==
            String(serviceId),
        ),
      };
    };

    setServices((currentServices) =>
      currentServices.map((category) => {
        if (
          String(category.id) !==
          String(selectedService.id)
        ) {
          return category;
        }

        return {
          ...category,
          data: (category.data || []).map(
            removeServiceLocally,
          ),
        };
      }),
    );

    setSelectedService((currentService) => ({
      ...currentService,
      data: (currentService.data || []).map(
        removeServiceLocally,
      ),
    }));

    setSelectedVendor((currentVendor) => ({
      ...currentVendor,
      services: (currentVendor.services || []).filter(
        (vendorService) =>
          String(vendorService.id) !==
          String(serviceId),
      ),
    }));
  } catch (error) {
    console.error("Error deleting vendor service:", error);
    alert(error.message || "Unable to delete service.");
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
                onHypePriceUpdate={handleHypePriceUpdate}
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
            {tagAccess.includes("Chat Box") ||
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
            {tagAccess.includes("Vendors Section") ||
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
                    src={service.serviceImage?.trim() || null}
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
        src={selectedVendorService.serviceImage?.trim() || null}
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
