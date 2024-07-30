import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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