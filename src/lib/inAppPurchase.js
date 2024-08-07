import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const initializeBillingClient = async () => {
  console.log('Billing client initialized');
};

export const purchaseQueryPack = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userRef, {
    queryCount: increment(20)
  });
  console.log('Query pack purchased: 20 queries added');
  return true;
};

export const purchaseProVersion = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userRef, {
    isPro: true
  });
  console.log('Pro version purchased');
  return true;
};

export const checkProPurchaseStatus = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.isPro || false;
};
