import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBaMsvZCdwFLWgTUZsTZlScUzDNc_WvyCQ",
  authDomain: "auto-vision-pro-v2.firebaseapp.com",
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

if (import.meta.env.DEV) {
  // Use emulators in development mode
  // Uncomment these lines if you're using Firebase emulators
  // import { connectAuthEmulator } from "firebase/auth";
  // import { connectFirestoreEmulator } from "firebase/firestore";
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
}

export const addVehicle = async (vehicleData) => {
  if (!auth.currentUser) {
    throw new Error("User must be logged in to add a vehicle");
  }
  
  try {
    const docRef = await addDoc(collection(db, "vehicles"), {
      ...vehicleData,
      userId: auth.currentUser.uid,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle: ", error);
    throw error;
  }
};

export const getVehicles = async (userId) => {
  const q = query(collection(db, "vehicles"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  const vehicleRef = doc(db, "vehicles", vehicleId);
  await updateDoc(vehicleRef, vehicleData);
};

export const deleteVehicle = async (vehicleId) => {
  await deleteDoc(doc(db, "vehicles", vehicleId));
};

// ... (rest of the file remains unchanged)