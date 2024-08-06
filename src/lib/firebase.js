import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { toast } from "sonner";

const firebaseConfig = {
  apiKey: "AIzaSyBaMsvZCdwFLWgTUZsTZlScUzDNc_WvyCQ",
  authDomain: "auto-vision-pro-v2.firebaseapp.com",
  databaseURL: "https://auto-vision-pro-v2-default-rtdb.firebaseio.com",
  projectId: "auto-vision-pro-v2",
  storageBucket: "auto-vision-pro-v2.appspot.com",
  messagingSenderId: "933665969916",
  appId: "1:933665969916:web:e17792bd261905ea102979",
  measurementId: "G-DTT5BB21FZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);

if (import.meta.env.DEV) {
  // Use emulators in development mode
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Connected to Firebase emulators");
  } catch (error) {
    console.error("Failed to connect to Firebase emulators:", error);
  }
}

/**
 * @typedef {Object} DTC
 * @property {string} code - The DTC code
 * @property {string} description - Description of the DTC
 * @property {string} possible_causes - Possible causes of the DTC
 * @property {string} diagnostic_aids - Diagnostic aids for the DTC
 * @property {string} application - Application of the DTC
 */

/**
 * Fetches a DTC by its code
 * @param {string} code - The DTC code to fetch
 * @returns {Promise<DTC|null>} The DTC object or null if not found
 */
const API_RATE_LIMIT = 100; // Requests per minute
const API_RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
let apiCallCount = 0;
let apiCallResetTime = Date.now() + API_RATE_WINDOW;

function checkRateLimit() {
  const now = Date.now();
  if (now > apiCallResetTime) {
    apiCallCount = 0;
    apiCallResetTime = now + API_RATE_WINDOW;
  }
  if (apiCallCount >= API_RATE_LIMIT) {
    throw new Error("API rate limit exceeded. Please try again later.");
  }
  apiCallCount++;
}

export async function fetchDTCByCode(code) {
  try {
    checkRateLimit();
    const dtcDoc = await getDocs(doc(db, "dtcCodes", code));
    if (dtcDoc.exists()) {
      return dtcDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching DTC data:", error);
    toast.error(error.message || "Failed to fetch DTC data. Please try again.");
    throw error;
  }
}

/**
 * Searches DTCs by a query string
 * @param {string} searchQuery - The search query
 * @returns {Promise<DTC[]>} An array of matching DTCs
 */
export async function searchDTCs(searchQuery) {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, 
    where("code", ">=", searchQuery),
    where("code", "<=", searchQuery + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data());
}

/**
 * Fetches all DTCs
 * @returns {Promise<DTC[]>} An array of all DTCs
 */
export async function fetchAllDTCs() {
  const dtcRef = collection(db, "dtc");
  const querySnapshot = await getDocs(dtcRef);

  return querySnapshot.docs.map(doc => doc.data());
}

/**
 * Adds a new DTC to the database
 * @param {DTC} dtc - The DTC object to add
 * @returns {Promise<string>} The ID of the newly added DTC
 */
export async function addDTC(dtc) {
  const docRef = await addDoc(collection(db, "dtc"), dtc);
  return docRef.id;
}

/**
 * Updates an existing DTC in the database
 * @param {string} code - The code of the DTC to update
 * @param {Partial<DTC>} updates - The fields to update
 * @returns {Promise<void>}
 */
export async function updateDTC(code, updates) {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = doc(db, "dtc", querySnapshot.docs[0].id);
    await updateDoc(docRef, updates);
  }
}

/**
 * Deletes a DTC from the database
 * @param {string} code - The code of the DTC to delete
 * @returns {Promise<void>}
 */
export async function deleteDTC(code) {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    await deleteDoc(doc(db, "dtc", querySnapshot.docs[0].id));
  }
}

/**
 * Adds a new vehicle to the database
 * @param {Object} vehicle - The vehicle object to add
 * @returns {Promise<string>} The ID of the newly added vehicle
 */
export async function addVehicle(vehicle) {
  const docRef = await addDoc(collection(db, "vehicles"), vehicle);
  return docRef.id;
}

/**
 * Fetches all vehicles for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object[]>} An array of vehicle objects
 */
export async function fetchVehiclesForUser(userId) {
  const vehiclesRef = collection(db, "vehicles");
  const q = query(vehiclesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
