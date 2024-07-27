import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { purchaseApp, purchaseSubscription, purchaseQueryPack, checkPurchaseStatus } from "@/lib/inAppPurchase";

const UserProfile = ({ isPro, setIsPro, user }) => {
  const [isProEnabled, setIsProEnabled] = useState(isPro);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsProEnabled(userData.isPro || false);
            setIsPro(userData.isPro || false);
          } else {
            // If the user document doesn't exist, create it
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              isPro: false,
              createdAt: new Date(),
            });
            setIsProEnabled(false);
            setIsPro(false);
          }
          // Check purchase status
          const status = await checkPurchaseStatus();
          setPurchaseStatus(status);
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

    fetchUserProfile();
  }, [user, setIsPro, isProEnabled]);

  const handlePurchaseApp = async () => {
    setLoading(true);
    try {
      const success = await purchaseApp();
      if (success) {
        toast.success("App purchased successfully!");
        const newStatus = await checkPurchaseStatus();
        setPurchaseStatus(newStatus);
      } else {
        toast.error("Failed to purchase app");
      }
    } catch (error) {
      console.error("Error purchasing app:", error);
      toast.error("Failed to purchase app");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSubscription = async (type) => {
    setLoading(true);
    try {
      const success = await purchaseSubscription(type);
      if (success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} subscription purchased successfully!`);
        const newStatus = await checkPurchaseStatus();
        setPurchaseStatus(newStatus);
      } else {
        toast.error("Failed to purchase subscription");
      }
    } catch (error) {
      console.error("Error purchasing subscription:", error);
      toast.error("Failed to purchase subscription");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseQueryPack = async (pack) => {
    setLoading(true);
    try {
      const success = await purchaseQueryPack(pack);
      if (success) {
        toast.success(`Query pack of ${pack} queries purchased successfully!`);
        const newStatus = await checkPurchaseStatus();
        setPurchaseStatus(newStatus);
      } else {
        toast.error("Failed to purchase query pack");
      }
    } catch (error) {
      console.error("Error purchasing query pack:", error);
      toast.error("Failed to purchase query pack");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Profile</h2>
      <p>Email: {user.email}</p>
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
      {purchaseStatus && (
        <div>
          <p>App Purchased: {purchaseStatus.isPurchased ? "Yes" : "No"}</p>
          <p>Subscription: {purchaseStatus.subscriptionType || "None"}</p>
          <p>Queries Remaining: {purchaseStatus.queryCount}</p>
          <p>Range Finder Queries: {purchaseStatus.rangefinderQueries}</p>
        </div>
      )}
      {!purchaseStatus?.isPurchased && (
        <Button onClick={handlePurchaseApp} disabled={loading}>
          Purchase App ($29.99)
        </Button>
      )}
      {purchaseStatus?.isPurchased && !purchaseStatus?.subscriptionType && (
        <>
          <Button onClick={() => handlePurchaseSubscription('monthly')} disabled={loading}>
            Purchase Monthly Subscription ($9.99)
          </Button>
          <Button onClick={() => handlePurchaseSubscription('yearly')} disabled={loading}>
            Purchase Yearly Subscription ($1,000)
          </Button>
        </>
      )}
      <div>
        <h3>Purchase Query Packs</h3>
        <Button onClick={() => handlePurchaseQueryPack('25')} disabled={loading}>
          25 Queries ($5)
        </Button>
        <Button onClick={() => handlePurchaseQueryPack('50')} disabled={loading}>
          50 Queries ($10)
        </Button>
        <Button onClick={() => handlePurchaseQueryPack('100')} disabled={loading}>
          100 Queries ($20)
        </Button>
        <Button onClick={() => handlePurchaseQueryPack('500')} disabled={loading}>
          500 Queries ($100)
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;