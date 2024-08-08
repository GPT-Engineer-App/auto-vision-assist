import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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
export const analytics = import.meta.env.DEV ? null : getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const fetchDTCByCode = async (code) => {
  try {
    const dtcRef = doc(db, "dtcCodes", code.toUpperCase());
    const dtcSnap = await getDoc(dtcRef);
    if (dtcSnap.exists()) {
      return { id: dtcSnap.id, ...dtcSnap.data() };
    } else {
      const querySnapshot = await getDocs(
        query(collection(db, "dtcCodes"), where("code", "==", code.toUpperCase()))
      );
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    }
  } catch (error) {
    console.error("Error fetching DTC by code:", error);
    throw new Error("Failed to fetch DTC information. Please try again.");
  }
};

export const fetchAllDTCs = async () => {
  try {
    const dtcRef = collection(db, "dtcCodes");
    const querySnapshot = await getDocs(dtcRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all DTCs:", error);
    throw new Error("Failed to fetch DTC codes. Please try again.");
  }
};

export const searchDTCs = async (searchTerm) => {
  try {
    const dtcRef = collection(db, "dtcCodes");
    const q = query(dtcRef, 
      where("code", ">=", searchTerm.toUpperCase()),
      where("code", "<=", searchTerm.toUpperCase() + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

if (import.meta.env.DEV) {
  // Use emulators in development mode
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("Connected to Firebase emulators");
}
