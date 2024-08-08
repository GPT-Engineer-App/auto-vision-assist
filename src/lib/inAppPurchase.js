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
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userRef, {
    queryCount: increment(20)
  });
  console.log('Query pack purchased: 20 queries added');
  return true;
};

export const purchaseProVersion = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const stripe = await stripePromise;
  
  // Create a Checkout Session on your server
  const response = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId: 'price_1234567890', // Replace with your actual Stripe Price ID for Pro version
      userId: auth.currentUser.uid,
    }),
  });
  
  const session = await response.json();
  
  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });
  
  if (result.error) {
    console.error('Error in checkout:', result.error);
    throw new Error('Failed to initiate checkout');
  }
  
  // The actual update of the user's pro status should be done on the server
  // after receiving a webhook from Stripe confirming the payment
  return true;
};

export const checkProPurchaseStatus = async () => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.isPro || false;
};
