

import {
  collection,
  doc,
  setDoc,
  updateDoc,
 
  getDocs,
  
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import { firestore } from "../firebaseCon";

export  const SERVICE_COLLECTION = "homeCleaningServiceDB";
const getStringId = (value) => String(value);





const BACKUP_COLLECTION = "updatedCleaningServiceDB";
const NEW_COLLECTION = "homeCleaningServiceDB";


export const migrateServiceDataPure = async (
  sourceCollection,
  destinationCollection,
  { onProgress } = {},
) => {
  try {
    if (!sourceCollection || !destinationCollection) {
      throw new Error(
        "Source and destination collection names are required.",
      );
    }

    if (sourceCollection === destinationCollection) {
      throw new Error(
        "Source and destination collections cannot be the same.",
      );
    }

    const sourceCategoriesSnapshot = await getDocs(
      collection(firestore, sourceCollection),
    );

    if (sourceCategoriesSnapshot.empty) {
      throw new Error(
        `No service categories found in ${sourceCollection}.`,
      );
    }

    let copiedCategories = 0;
    let copiedVendors = 0;
    let copiedServices = 0;

    for (const categoryDocument of sourceCategoriesSnapshot.docs) {
      const categoryId = categoryDocument.id;
      const categoryData = categoryDocument.data();

      const destinationCategoryRef = doc(
        firestore,
        destinationCollection,
        categoryId,
      );

      // Copy category exactly as stored.
      await setDoc(destinationCategoryRef, categoryData);

      copiedCategories += 1;

      const sourceVendorsSnapshot = await getDocs(
        collection(
          firestore,
          sourceCollection,
          categoryId,
          "vendors",
        ),
      );

      for (const vendorDocument of sourceVendorsSnapshot.docs) {
        const vendorId = vendorDocument.id;
        const vendorData = vendorDocument.data();

        const destinationVendorRef = doc(
          firestore,
          destinationCollection,
          categoryId,
          "vendors",
          vendorId,
        );

        // Copy vendor exactly as stored.
        await setDoc(destinationVendorRef, vendorData);

        copiedVendors += 1;

        const sourceServicesSnapshot = await getDocs(
          collection(
            firestore,
            sourceCollection,
            categoryId,
            "vendors",
            vendorId,
            "services",
          ),
        );

        // Firestore allows a maximum of 500 operations per batch.
        for (
          let startIndex = 0;
          startIndex < sourceServicesSnapshot.docs.length;
          startIndex += 400
        ) {
          const serviceChunk =
            sourceServicesSnapshot.docs.slice(
              startIndex,
              startIndex + 400,
            );

          const batch = writeBatch(firestore);

          serviceChunk.forEach((serviceDocument) => {
            const serviceId = serviceDocument.id;
            const serviceData = serviceDocument.data();

            const destinationServiceRef = doc(
              firestore,
              destinationCollection,
              categoryId,
              "vendors",
              vendorId,
              "services",
              serviceId,
            );

            // Copy service exactly as stored.
            batch.set(destinationServiceRef, serviceData);

            copiedServices += 1;
          });

          await batch.commit();
        }
      }

      onProgress?.({
        categoryId,
        categoryName:
          categoryData.ServiceName || "Unnamed Service",
        copiedCategories,
        totalCategories: sourceCategoriesSnapshot.size,
        copiedVendors,
        copiedServices,
      });
    }

    console.log(
      `Migration completed: ${copiedCategories} categories, ` +
        `${copiedVendors} vendors and ` +
        `${copiedServices} services copied.`,
    );

    return {
      success: true,
      sourceCollection,
      destinationCollection,
      copiedCategories,
      copiedVendors,
      copiedServices,
    };
  } catch (error) {
    console.error("Service migration error:", error);
    throw error;
  }
};
export const updateHypePriceInFirestore = async ({
  services,
  type,
  value,
  city,
  service,
  amount,
}) => {
  const batch = writeBatch(firestore);

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount === 0) {
    throw new Error("Please enter a valid amount.");
  }

  let updatedPriceCount = 0;

  const updatedServices = services.map((category) => {
    const shouldUpdateWholeService =
      type === "service" &&
      category.ServiceName === value;

    const shouldUpdateCityServiceCategory =
      type === "cityService" &&
      category.ServiceName === service;

    const updatedVendors = (category.data || []).map((vendor) => {
      const shouldUpdateCity =
        type === "city" &&
        (vendor.location === value ||
          vendor.vendorlocation === value);

      const shouldUpdateCityService =
        type === "cityService" &&
        shouldUpdateCityServiceCategory &&
        (vendor.location === city ||
          vendor.vendorlocation === city);

      if (
        !shouldUpdateWholeService &&
        !shouldUpdateCity &&
        !shouldUpdateCityService
      ) {
        return vendor;
      }

      const updatedVendorServices = (vendor.services || []).map((item) => {
        const newPrice =
          (Number(item.price) || 0) + numericAmount;

        batch.update(
          doc(
            firestore,
            SERVICE_COLLECTION,
            String(category.id),
            "vendors",
            String(vendor.vendorId),
            "services",
            String(item.id)
          ),
          {
            price: newPrice,
            updatedAt: serverTimestamp(),
          }
        );

        updatedPriceCount++;

        return {
          ...item,
          price: newPrice,
        };
      });

      return {
        ...vendor,
        services: updatedVendorServices,
      };
    });

    return {
      ...category,
      data: updatedVendors,
    };
  });

  if (updatedPriceCount === 0) {
    throw new Error("No matching services found.");
  }

  await batch.commit();

  return {
    updatedServices,
    updatedPriceCount,
  };
};

const createSafeId = (value, fallbackPrefix) => {
  if (value !== undefined && value !== null && String(value).trim()) {
    return String(value);
  }

  return `${fallbackPrefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

const removeUndefinedFields = (value) => {
  if (Array.isArray(value)) {
    return value.map(removeUndefinedFields);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, fieldValue]) => fieldValue !== undefined)
        .map(([key, fieldValue]) => [
          key,
          removeUndefinedFields(fieldValue),
        ]),
    );
  }

  return value;
};

/**
 * Reads old backup JSON from updatedCleaningServiceDB
 * and converts it to the new Firestore structure.
 *
 * Old structure:
 * {
 *   data: [
 *     {
 *       id,
 *       ServiceName,
 *       data: [
 *         {
 *           vendorId,
 *           services: [...]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * New structure:
 * homeCleaningServiceDB/categoryId
 *   vendors/vendorId
 *     services/serviceId
 */
export const migrateBackupToNewServiceStructure = async ({
  onProgress,
} = {}) => {
  const backupSnapshot = await getDocs(
    collection(firestore, BACKUP_COLLECTION),
  );

  if (backupSnapshot.empty) {
    throw new Error(
      `No backup document found in ${BACKUP_COLLECTION}.`,
    );
  }

  const backupDocuments = backupSnapshot.docs.map((documentSnapshot) => ({
    firestoreDocumentId: documentSnapshot.id,
    ...documentSnapshot.data(),
  }));

  const backupDocument = backupDocuments.find((item) =>
    Array.isArray(item.data),
  );

  if (!backupDocument) {
    throw new Error(
      `No document containing a data array was found in ${BACKUP_COLLECTION}.`,
    );
  }

  const oldCategories = backupDocument.data;

  if (!Array.isArray(oldCategories) || oldCategories.length === 0) {
    throw new Error("The backup service array is empty.");
  }

  let migratedCategories = 0;
  let migratedVendors = 0;
  let migratedServices = 0;

  for (
    let categoryIndex = 0;
    categoryIndex < oldCategories.length;
    categoryIndex++
  ) {
    const oldCategory = oldCategories[categoryIndex];

    const categoryId = createSafeId(
      oldCategory.id,
      `category-${categoryIndex}`,
    );

    const categoryRef = doc(
      firestore,
      NEW_COLLECTION,
      categoryId,
    );

    await setDoc(
      categoryRef,
      removeUndefinedFields({
        id: categoryId,
        ServiceName: String(
          oldCategory.ServiceName || "Unnamed Service",
        ).trim(),
        createdAt: oldCategory.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
        migratedFrom: BACKUP_COLLECTION,
        backupDocumentId: backupDocument.firestoreDocumentId,
      }),
      {
        merge: true,
      },
    );

    migratedCategories++;

    const oldVendors = Array.isArray(oldCategory.data)
      ? oldCategory.data
      : [];

    for (
      let vendorIndex = 0;
      vendorIndex < oldVendors.length;
      vendorIndex++
    ) {
      const oldVendor = oldVendors[vendorIndex];

      const vendorId = createSafeId(
        oldVendor.vendorId || oldVendor.id,
        `vendor-${categoryIndex}-${vendorIndex}`,
      );

      const vendorRef = doc(
        firestore,
        NEW_COLLECTION,
        categoryId,
        "vendors",
        vendorId,
      );

      const {
        services: oldVendorServices = [],
        ...vendorFields
      } = oldVendor;

      await setDoc(
        vendorRef,
        removeUndefinedFields({
          ...vendorFields,
          vendorId,
          rating: Number(oldVendor.rating) || 0,
          reviews: String(oldVendor.reviews || ""),
          vendorName: String(oldVendor.vendorName || "").trim(),
          vendorImage: String(oldVendor.vendorImage || "").trim(),
          location: String(oldVendor.location || "").trim(),
          vendorlocation: String(
            oldVendor.vendorlocation ||
              oldVendor.location ||
              "",
          ).trim(),
          createdAt: oldVendor.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
        {
          merge: true,
        },
      );

      migratedVendors++;

      const vendorServices = Array.isArray(oldVendorServices)
        ? oldVendorServices
        : [];

      // Firestore batch maximum is 500 operations.
      // 400 is used here as a safe batch size.
      for (
        let startIndex = 0;
        startIndex < vendorServices.length;
        startIndex += 400
      ) {
        const serviceChunk = vendorServices.slice(
          startIndex,
          startIndex + 400,
        );

        const batch = writeBatch(firestore);

        serviceChunk.forEach((oldService, chunkIndex) => {
          const actualServiceIndex = startIndex + chunkIndex;

          const serviceId = createSafeId(
            oldService.id,
            `service-${categoryIndex}-${vendorIndex}-${actualServiceIndex}`,
          );

          const serviceRef = doc(
            firestore,
            NEW_COLLECTION,
            categoryId,
            "vendors",
            vendorId,
            "services",
            serviceId,
          );

          const cleanService = removeUndefinedFields({
            ...oldService,
            id: serviceId,

            title: String(oldService.title || "").trim(),
            location: String(oldService.location || "").trim(),

            price: Number(oldService.price) || 0,
            discount: Number(oldService.discount) || 0,
            originalPrice:
              Number(oldService.originalPrice) || 0,

            description: String(
              oldService.description || "",
            ).trim(),

            serviceImage: String(
              oldService.serviceImage || "",
            ).trim(),

            rating: Number(oldService.rating) || 0,
            reviews: String(oldService.reviews || ""),
            duration: String(oldService.duration || "").trim(),

            inclusions: Array.isArray(oldService.inclusions)
              ? oldService.inclusions
              : [],

            exclusions: Array.isArray(oldService.exclusions)
              ? oldService.exclusions
              : [],

            createdAt:
              oldService.createdAt || serverTimestamp(),

            updatedAt: serverTimestamp(),
          });

          batch.set(serviceRef, cleanService, {
            merge: true,
          });

          migratedServices++;
        });

        await batch.commit();
      }
    }

    onProgress?.({
      currentCategory: categoryIndex + 1,
      totalCategories: oldCategories.length,
      categoryName: oldCategory.ServiceName,
      migratedCategories,
      migratedVendors,
      migratedServices,
    });
  }

  return {
    success: true,
    sourceCollection: BACKUP_COLLECTION,
    destinationCollection: NEW_COLLECTION,
    backupDocumentId: backupDocument.firestoreDocumentId,
    migratedCategories,
    migratedVendors,
    migratedServices,
  };
};



export const updateServiceCategoryInFirestore = async (
  categoryId,
  newName,
) => {
  const categoryRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
  );

  await updateDoc(categoryRef, {
    ServiceName: newName.trim(),
    updatedAt: serverTimestamp(),
  });
};
    export const deleteVendorFromFirestore = async (
  categoryId,
  vendorId,
) => {
  const vendorRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
    "vendors",
    getStringId(vendorId),
  );

  const servicesSnapshot = await getDocs(
    collection(vendorRef, "services"),
  );

  const batch = writeBatch(firestore);

  servicesSnapshot.docs.forEach((serviceDoc) => {
    batch.delete(serviceDoc.ref);
  });

  batch.delete(vendorRef);

  await batch.commit();
};


    export const createServiceCategoryInFirestore = async (serviceCategory) => {
  const categoryId = getStringId(
    serviceCategory.id || Date.now(),
  );

  const categoryRef = doc(
    firestore,
    SERVICE_COLLECTION,
    categoryId,
  );

  await setDoc(categoryRef, {
    id: categoryId,
    ServiceName: serviceCategory.ServiceName.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: categoryId,
    ServiceName: serviceCategory.ServiceName.trim(),
    data: [],
  };
};

    export  const deleteServiceCategoryFromFirestore = async (categoryId) => {
  const categoryRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
  );

  const vendorsRef = collection(categoryRef, "vendors");
  const vendorsSnapshot = await getDocs(vendorsRef);

  for (const vendorDoc of vendorsSnapshot.docs) {
    const vendorRef = vendorDoc.ref;

    const vendorServicesSnapshot = await getDocs(
      collection(vendorRef, "services"),
    );

    const batch = writeBatch(firestore);

    vendorServicesSnapshot.docs.forEach((serviceDoc) => {
      batch.delete(serviceDoc.ref);
    });

    batch.delete(vendorRef);

    await batch.commit();
  }

  await deleteDoc(categoryRef);
};

    export  const addVendorToFirestore = async (categoryId, vendorData) => {
  const vendorId = getStringId(
    vendorData.vendorId || Date.now(),
  );

  const vendorRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
    "vendors",
    vendorId,
  );

  const cleanVendor = {
    vendorId,
    vendorName: String(vendorData.vendorName || "").trim(),
    vendorImage: String(vendorData.vendorImage || "").trim(),
    rating: Number(vendorData.rating) || 0,
    reviews: String(vendorData.reviews || ""),
    location: String(vendorData.location || "").trim(),
    vendorlocation: String(
      vendorData.vendorlocation || vendorData.location || "",
    ).trim(),
    vendor_id: String(vendorData.vendor_id || ""),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(vendorRef, cleanVendor);

  return {
    ...cleanVendor,
    createdAt: null,
    updatedAt: null,
    services: [],
  };
};

  export   const updateVendorInFirestore = async (
  categoryId,
  vendorId,
  vendorData,
) => {
  const vendorRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
    "vendors",
    getStringId(vendorId),
  );

  await updateDoc(vendorRef, {
    vendorName: String(vendorData.vendorName || "").trim(),
    vendorImage: String(vendorData.vendorImage || "").trim(),
    rating: Number(vendorData.rating) || 0,
    reviews: String(vendorData.reviews || ""),
    location: String(vendorData.location || "").trim(),
    vendorlocation: String(
      vendorData.vendorlocation || vendorData.location || "",
    ).trim(),
    updatedAt: serverTimestamp(),
  });
};
  export  const normalizeVendorService = (serviceData, existingId = null) => {
  const serviceImage = String(
    serviceData.serviceImage || "",
  ).trim();

  if (
    serviceImage.startsWith("data:image") ||
    serviceImage.startsWith("blob:")
  ) {
    throw new Error(
      "Base64 and blob images cannot be stored. Please use an internet image URL.",
    );
  }

  return {
    id: getStringId(existingId || serviceData.id || Date.now()),

    title: String(serviceData.title || "").trim(),
    location: String(serviceData.location || "").trim(),

    price: Number(serviceData.price) || 0,
    discount: Number(serviceData.discount) || 0,
    originalPrice: Number(serviceData.originalPrice) || 0,

    description: String(serviceData.description || "").trim(),
    serviceImage,

    rating: Number(serviceData.rating) || 0,
    reviews: String(serviceData.reviews || ""),
    duration: String(serviceData.duration || "").trim(),

    inclusions: Array.isArray(serviceData.inclusions)
      ? serviceData.inclusions
      : String(serviceData.inclusions || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

    exclusions: Array.isArray(serviceData.exclusions)
      ? serviceData.exclusions
      : String(serviceData.exclusions || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
  };
};

  export   const addVendorServiceToFirestore = async (
  categoryId,
  vendorId,
  serviceData,
) => {
  const cleanService = normalizeVendorService(serviceData);

  const serviceRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
    "vendors",
    getStringId(vendorId),
    "services",
    cleanService.id,
  );

  await setDoc(serviceRef, {
    ...cleanService,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return cleanService;
};

  export const updateVendorServiceInFirestore = async (
  categoryId,
  vendorId,
  serviceId,
  serviceData,
) => {
  const cleanService = normalizeVendorService(
    serviceData,
    serviceId,
  );

  const serviceRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
    "vendors",
    getStringId(vendorId),
    "services",
    getStringId(serviceId),
  );

  await updateDoc(serviceRef, {
    title: cleanService.title,
    location: cleanService.location,

    price: cleanService.price,
    discount: cleanService.discount,
    originalPrice: cleanService.originalPrice,

    description: cleanService.description,
    serviceImage: cleanService.serviceImage,

    rating: cleanService.rating,
    reviews: cleanService.reviews,
    duration: cleanService.duration,

    inclusions: cleanService.inclusions,
    exclusions: cleanService.exclusions,

    updatedAt: serverTimestamp(),
  });

  return cleanService;
};


export const updateVendorServiceImageInFirestore = async ({
  categoryId,
  vendorId,
  serviceId,
  imageUrl,
}) => {
  const cleanUrl = String(imageUrl || "").trim();

  if (!cleanUrl) {
    throw new Error("Please enter an image URL.");
  }

  if (
    cleanUrl.startsWith("data:image") ||
    cleanUrl.startsWith("blob:")
  ) {
    throw new Error(
      "Please use an HTTP or HTTPS image URL.",
    );
  }

  const serviceRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
    "vendors",
    getStringId(vendorId),
    "services",
    getStringId(serviceId),
  );

  await updateDoc(serviceRef, {
    serviceImage: cleanUrl,
    updatedAt: serverTimestamp(),
  });
};

   export const deleteVendorServiceFromFirestore = async (
  categoryId,
  vendorId,
  serviceId,
) => {
  const serviceRef = doc(
    firestore,
    SERVICE_COLLECTION,
    getStringId(categoryId),
    "vendors",
    getStringId(vendorId),
    "services",
    getStringId(serviceId),
  );

  await deleteDoc(serviceRef);
};