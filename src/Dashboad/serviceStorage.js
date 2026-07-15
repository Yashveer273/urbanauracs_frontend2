import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { firestore } from "../firebaseCon";

const SERVICE_STORAGE_COLLECTION = "homeCleaningServiceDB";
const MAX_DOC_SIZE_BYTES = 900_000;
const CHUNK_DOC_PREFIX = "service-data-chunk-";

const estimateBytes = (value) => {
  return new TextEncoder().encode(JSON.stringify(value)).length;
};

const buildServiceChunks = (services) => {
  const chunks = [];
  let currentChunk = [];

  services.forEach((service) => {
    const candidateChunk = [...currentChunk, service];
    const candidateBytes = estimateBytes({
      kind: "service-data-chunk",
      items: candidateChunk,
    });

    if (currentChunk.length === 0 || candidateBytes <= MAX_DOC_SIZE_BYTES) {
      currentChunk = candidateChunk;
      return;
    }

    chunks.push(currentChunk);
    currentChunk = [service];
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks.map((chunk, index) => ({
    id: `${CHUNK_DOC_PREFIX}${index}`,
    data: {
      kind: "service-data-chunk",
      chunkIndex: index,
      items: chunk,
    },
  }));
};

export const loadServicesFromFirestore = async () => {
  const snapshot = await getDocs(collection(firestore, SERVICE_STORAGE_COLLECTION));
  const chunkDocs = snapshot.docs
    .filter((docSnapshot) => docSnapshot.data()?.kind === "service-data-chunk")
    .map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }))
    .sort((a, b) => a.chunkIndex - b.chunkIndex);

  if (chunkDocs.length > 0) {
    const services = chunkDocs.flatMap((chunk) => chunk.items || []);
    return { services };
  }

  const legacyDoc = snapshot.docs.find((docSnapshot) => Array.isArray(docSnapshot.data()?.data));

  if (legacyDoc) {
    return { services: legacyDoc.data()?.data || [] };
  }

  return { services: [] };
};

export const persistServiceDataToFirestore = async (services) => {
  const snapshot = await getDocs(collection(firestore, SERVICE_STORAGE_COLLECTION));
  const batch = writeBatch(firestore);

  snapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  const chunkDocs = buildServiceChunks(services || []);

  chunkDocs.forEach((chunkDoc) => {
    batch.set(doc(firestore, SERVICE_STORAGE_COLLECTION, chunkDoc.id), chunkDoc.data);
  });

  await batch.commit();
  return chunkDocs.length;
};
