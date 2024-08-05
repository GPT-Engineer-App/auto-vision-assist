import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { purchaseProVersion, checkProPurchaseStatus } from "@/lib/inAppPurchase";

const UserProfile = ({ isPro, setIsPro, user }) => {
  const [isProEnabled, setIsProEnabled] = useState(isPro);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserProfile = async () => {
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
          setIsProEnabled(userData.isPro || false);
          setIsPro(userData.isPro || false);
        } else {
          // If the user document doesn't exist, create it
          const newUserData = {
            email: user.email,
            isPro: false,
            createdAt: new Date(),
          };
          await setDoc(doc(db, "users", user.uid), newUserData);
          setUserData(newUserData);
          setIsProEnabled(false);
          setIsPro(false);
        }
        // Check if the user has purchased Pro version
        const hasPurchasedPro = await checkProPurchaseStatus();
        if (hasPurchasedPro && !isProEnabled) {
          await handleProUpgrade(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile. Please try again later.");
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("User not authenticated. Please log in.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user, setIsPro, isProEnabled]);

  const handleProUpgrade = async (isPurchased = false) => {
    if (!user) {
      toast.error("You must be logged in to change your subscription");
      return;
    }

    setLoading(true);
    try {
      if (!isPurchased) {
        // Initiate the purchase process
        const success = await purchaseProVersion();
        if (!success) {
          toast.error("Pro version purchase failed");
          setLoading(false);
          return;
        }
      }

      // Update user's pro status in Firestore
      await setDoc(doc(db, "users", user.uid), { isPro: true }, { merge: true });
      setIsProEnabled(true);
      setIsPro(true);
      toast.success("Upgraded to Pro successfully!");
    } catch (error) {
      console.error("Error updating pro status:", error);
      toast.error("Failed to update subscription status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 rounded-md">
      <p>{error}</p>
      <Button onClick={fetchUserProfile} className="mt-4">
        Retry
      </Button>
    </div>;
  }

  if (!user) {
    return <div className="text-center p-4">
      <p>Please log in to view your profile.</p>
      <Button onClick={() => navigate("/")} className="mt-4">
        Go to Login
      </Button>
    </div>;
  }

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-bold">User Profile</h2>
      <p>Email: {userData?.email}</p>
      <div className="flex items-center space-x-2">
        <Switch
          id="pro-mode"
          checked={isProEnabled}
          onCheckedChange={() => {}}
          disabled={true}
        />
        <Label htmlFor="pro-mode">Pro Mode</Label>
      </div>
      <p>
        {isProEnabled
          ? "You are currently on the Pro plan. Enjoy unlimited features!"
          : "Upgrade to Pro for unlimited features and no ads."}
      </p>
      {!isProEnabled && (
        <Button onClick={() => handleProUpgrade()} disabled={loading}>
          Upgrade to Pro
        </Button>
      )}
    </div>
  );
};

export default UserProfile;
