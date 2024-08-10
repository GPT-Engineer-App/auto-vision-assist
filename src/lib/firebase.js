import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, connectAuthEmulator } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Removed emulator connections

import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const fetchDTCByCode = async (code) => {
  try {
    const dtcRef = ref(storage, 'diagnostic_trouble_codes_rows.csv');
    const url = await getDownloadURL(dtcRef);
    const response = await fetch(url);
    const csvData = await response.text();
    const rows = csvData.split('\n').map(row => row.split(','));
    const dtc = rows.find(row => row[0] === code.toUpperCase());
    if (dtc) {
      return {
        code: dtc[0],
        description: dtc[1],
        possibleCauses: dtc[2],
        diagnosticAids: dtc[3],
        application: dtc[4]
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching DTC by code:", error);
    throw new Error("Failed to fetch DTC information. Please try again.");
  }
};

export const fetchAllDTCs = async () => {
  try {
    const dtcRef = ref(storage, 'diagnostic_trouble_codes_rows.csv');
    const url = await getDownloadURL(dtcRef);
    const response = await fetch(url);
    const csvData = await response.text();
    const rows = csvData.split('\n').map(row => row.split(','));
    return rows.slice(1).map(row => ({
      code: row[0],
      description: row[1],
      possibleCauses: row[2],
      diagnosticAids: row[3],
      application: row[4]
    }));
  } catch (error) {
    console.error("Error fetching all DTCs:", error);
    throw new Error("Failed to fetch DTC codes. Please try again.");
  }
};

export const searchDTCs = async (searchTerm) => {
  try {
    const allDTCs = await fetchAllDTCs();
    return allDTCs.filter(dtc => 
      dtc.code.includes(searchTerm.toUpperCase()) || 
      dtc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching DTCs:", error);
    throw new Error("Failed to search DTC codes. Please try again.");
  }
};

export const updateData = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error(`Failed to update ${collectionName}. Please try again.`);
  }
};

export const deleteData = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error(`Failed to delete from ${collectionName}. Please try again.`);
  }
};

export const getData = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw new Error(`Failed to fetch data from ${collectionName}. Please try again.`);
  }
};

export const fetchVehiclesForUser = async (userId) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    const q = query(vehiclesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching vehicles for user:", error);
    throw new Error("Failed to fetch vehicles. Please try again.");
  }
};

// Remove emulator connections for now
console.log("Running in production mode");
