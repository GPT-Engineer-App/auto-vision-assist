import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, connectAuthEmulator, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { toast } from "sonner";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
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

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signOutUser = () => signOut(auth);

// Register User
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User registered:", user);
    return user;
  } catch (error) {
    console.error("Error registering user:", error.code, error.message);
    throw error;
  }
};

// Login User
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error signing in user:", error.code, error.message);
    throw error;
  }
};

// Logout User
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out user:", error);
    throw error;
  }
};

export { registerUser, loginUser, logoutUser };

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
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to fetch vehicles");
  }
  const vehiclesRef = collection(db, "vehicles");
  const q = query(vehiclesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
