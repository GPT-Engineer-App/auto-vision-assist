import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserProfile = ({ isPro, setIsPro, user }) => {
  const [isProEnabled, setIsProEnabled] = useState(isPro);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsProEnabled(userData.isPro || false);
            setIsPro(userData.isPro || false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to load user profile");
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [user, setIsPro]);

  const handleProToggle = async (checked) => {
    if (!user) {
      toast.error("You must be logged in to change your subscription");
      return;
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), { isPro: checked }, { merge: true });
      setIsProEnabled(checked);
      setIsPro(checked);
      toast.success(checked ? "Upgraded to Pro successfully!" : "Downgraded from Pro successfully!");
    } catch (error) {
      console.error("Error updating pro status:", error);
      toast.error("Failed to update subscription status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
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
          onCheckedChange={handleProToggle}
          disabled={loading}
        />
        <Label htmlFor="pro-mode">Pro Mode</Label>
      </div>
      <p>
        {isProEnabled
          ? "You are currently on the Pro plan. Enjoy unlimited features!"
          : "Upgrade to Pro for unlimited features and no ads."}
      </p>
      {!isProEnabled && (
        <Button onClick={() => handleProToggle(true)} disabled={loading}>
          Upgrade to Pro
        </Button>
      )}
    </div>
  );
};

export default UserProfile;