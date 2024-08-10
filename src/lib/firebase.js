import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const fetchUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile. Please try again.");
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile. Please try again.");
  }
};

export const fetchUserVehicles = async (userId) => {
  try {
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user vehicles:", error);
    throw new Error("Failed to fetch user vehicles. Please try again.");
  }
};

export const addVehicle = async (vehicleData) => {
  try {
    const vehiclesRef = collection(db, 'vehicles');
    const docRef = await addDoc(vehiclesRef, vehicleData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw new Error("Failed to add vehicle. Please try again.");
  }
};

export const updateVehicle = async (vehicleId, data) => {
  try {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, data);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw new Error("Failed to update vehicle. Please try again.");
  }
};

export const deleteVehicle = async (vehicleId) => {
  try {
    await deleteDoc(doc(db, 'vehicles', vehicleId));
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw new Error("Failed to delete vehicle. Please try again.");
  }
};

export const fetchAppData = async (userId) => {
  try {
    const appDataRef = doc(db, 'appData', userId);
    const appDataDoc = await getDoc(appDataRef);
    if (appDataDoc.exists()) {
      return appDataDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching app data:", error);
    throw new Error("Failed to fetch app data. Please try again.");
  }
};

export const fetchAllDTCs = async () => {
  try {
    const dtcRef = collection(db, 'dtcCodes');
    const querySnapshot = await getDocs(dtcRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all DTCs:", error);
    throw new Error("Failed to fetch DTC codes. Please try again.");
  }
};

export const searchDTCs = async (searchTerm) => {
  try {
    const dtcRef = collection(db, 'dtcCodes');
    const q = query(
      dtcRef,
      where('code', '>=', searchTerm.toUpperCase()),
      where('code', '<=', searchTerm.toUpperCase() + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error searching DTCs:", error);
    throw new Error("Failed to search DTC codes. Please try again.");
  }
};

// Remove the fetchDTCData and parseCSV functions as they're no longer needed

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
