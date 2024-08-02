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

// Initialize Firebase with the config
initializeApp(firebaseConfig);

export async function fetchDTCByCode(code) {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return querySnapshot.docs[0].data();
}

export async function searchDTCs(searchQuery) {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, 
    where("code", ">=", searchQuery),
    where("code", "<=", searchQuery + '\uf8ff')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => doc.data());
}

export async function fetchAllDTCs() {
  const dtcRef = collection(db, "dtc");
  const querySnapshot = await getDocs(dtcRef);

  return querySnapshot.docs.map(doc => doc.data());
}

export async function addDTC(dtc) {
  const docRef = await addDoc(collection(db, "dtc"), dtc);
  return docRef.id;
}

export async function updateDTC(code, updates) {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = doc(db, "dtc", querySnapshot.docs[0].id);
    await updateDoc(docRef, updates);
  }
}

export async function deleteDTC(code) {
  const dtcRef = collection(db, "dtc");
  const q = query(dtcRef, where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    await deleteDoc(doc(db, "dtc", querySnapshot.docs[0].id));
  }
}

export async function addVehicle(vehicle) {
  const docRef = await addDoc(collection(db, "vehicles"), vehicle);
  return docRef.id;
}

export async function fetchVehiclesForUser(userId) {
  const vehiclesRef = collection(db, "vehicles");
  const q = query(vehiclesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}