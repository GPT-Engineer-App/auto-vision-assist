import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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
export const analytics = import.meta.env.DEV ? null : getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const fetchDTCByCode = async (code) => {
  const dtcRef = doc(db, "dtcCodes", code);
  const dtcSnap = await getDoc(dtcRef);
  return dtcSnap.exists() ? dtcSnap.data() : null;
};

export const fetchAllDTCs = async () => {
  const dtcRef = collection(db, "dtcCodes");
  const querySnapshot = await getDocs(dtcRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const searchDTCs = async (searchTerm) => {
  const dtcRef = collection(db, "dtcCodes");
  const q = query(dtcRef, 
    where("code", ">=", searchTerm.toUpperCase()),
    where("code", "<=", searchTerm.toUpperCase() + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateData = async (collectionName, docId, data) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

export const deleteData = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};

export const getData = async (collectionName, docId) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const fetchVehiclesForUser = async (userId) => {
  const vehiclesRef = collection(db, "vehicles");
  const q = query(vehiclesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

if (import.meta.env.DEV) {
  // Use emulators in development mode
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  console.log("Connected to Firebase emulators");
}
