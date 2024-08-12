import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaMsvZCdwFLWgTUZsTZlScUzDNc_WvyCQ",
  authDomain: "auto-vision-pro-v2.firebaseapp.com",
  databaseURL: "https://auto-vision-pro-v2-default-rtdb.firebaseio.com",
  projectId: "auto-vision-pro-v2",
  storageBucket: "auto-vision-pro-v2.appspot.com",
  messagingSenderId: "933665969916",
  appId: "1:933665969916:web:8278f8ecb9326848102979",
  measurementId: "G-Q7MN5WQ8QE"
};

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