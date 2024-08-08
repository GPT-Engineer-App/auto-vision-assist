import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const initializeBillingClient = async () => {
  await stripePromise;
  console.log('Billing client initialized');
};

export const purchaseQueryPack = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const stripe = await stripePromise;
  
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: import.meta.env.VITE_STRIPE_QUERY_PACK_PRICE_ID,
        userId: auth.currentUser.uid,
        productType: 'queryPack'
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();
    
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error in query pack purchase:', error);
    throw error;
  }
};

export const purchaseProVersion = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const stripe = await stripePromise;
  
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
        userId: auth.currentUser.uid,
        productType: 'proSubscription'
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const session = await response.json();
    
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error in Pro version purchase:', error);
    throw error;
  }
};

export const checkProPurchaseStatus = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.isPro || false;
};

export const checkQueryPackPurchaseStatus = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.queryCount || 0;
};

export const consumeQuery = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userRef, {
    queryCount: increment(-1)
  });
};
