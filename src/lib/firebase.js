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

export const fetchDTCByCode = async (code) => {
  try {
    const dtcRef = doc(db, 'dtcCodes', code.toUpperCase());
    const dtcDoc = await getDoc(dtcRef);
    if (dtcDoc.exists()) {
      return { id: dtcDoc.id, ...dtcDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching DTC by code:", error);
    throw new Error("Failed to fetch DTC information. Please try again.");
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
