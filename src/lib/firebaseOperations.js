import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "./firebase";
import { toast } from "sonner";

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signOutUser = () => signOut(auth);

// CRUD operations for Firestore
export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

export const updateData = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteData = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log("Document deleted successfully");
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

// DTC operations
export async function fetchDTCByCode(code) {
  try {
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
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to fetch vehicles");
  }
  const vehiclesRef = collection(db, "vehicles");
  const q = query(vehiclesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
