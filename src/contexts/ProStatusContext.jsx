import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';

const ProStatusContext = createContext();

export const useProStatus = () => useContext(ProStatusContext);

export const ProStatusProvider = ({ children }) => {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              setIsPro(doc.data().isPro || false);
            } else {
              setDoc(userRef, { isPro: false });
            }
            setLoading(false);
          }, (error) => {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data. Please check your connection.");
            setIsPro(false);
            setLoading(false);
          });
          return () => unsubscribeSnapshot();
        } catch (error) {
          console.error("Error setting up listener:", error);
          toast.error("Failed to set up data listener. Please try again.");
          setIsPro(false);
          setLoading(false);
        }
      } else {
        setIsPro(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProStatus = async (status) => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { isPro: status }, { merge: true });
      setIsPro(status);
    }
  };

  const value = {
    isPro,
    loading,
    updateProStatus
  };

  return (
    <ProStatusContext.Provider value={value}>
      {!loading && children}
    </ProStatusContext.Provider>
  );
};
