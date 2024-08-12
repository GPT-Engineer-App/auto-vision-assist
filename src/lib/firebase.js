import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error('Firebase API key is not set. Please check your environment variables.');
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Fetches DTC data from the database.
 * @returns {Promise<object[]>} A promise resolving to an array of DTC data objects.
 */
const fetchDTCData = async () => {
  try {
    // Assuming you have a 'dtc' collection in your Firestore database
    const dtcRef = db.collection('dtc');
    const querySnapshot = await dtcRef.get();
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching DTC data:", error);
    throw new Error("Failed to fetch DTC data. Please try again.");
  }
};

/**
 * Fetches a DTC by its code.
 * @param {string} code The DTC code to search for.
 * @returns {Promise<object|null>} A promise resolving to the DTC object or null if not found.
 */
export const fetchDTCByCode = async (code) => {
  try {
    const dtcData = await fetchDTCData();
    return dtcData.find(item => item.code.toUpperCase() === code.toUpperCase()) || null;
  } catch (error) {
    console.error("Error fetching DTC by code:", error);
    throw new Error("Failed to fetch DTC information. Please try again.");
  }
};

export const fetchAllDTCs = async () => {
  try {
    return await fetchDTCData();
  } catch (error) {
    console.error("Error fetching all DTCs:", error);
    throw new Error("Failed to fetch all DTC codes. Please try again.");
  }
};

export const searchDTCs = async (searchQuery) => {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, 
    where("code", ">=", searchQuery),
    where("code", "<=", searchQuery + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export const fetchVehiclesForUser = async (userId) => {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to fetch vehicles");
  }
  const vehiclesRef = collection(db, "vehicles");
  const q = query(vehiclesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateData = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

export const deleteData = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};
