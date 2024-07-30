import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/integrations/supabase/auth";
import { useUser, useUpdateUser } from "@/integrations/supabase";

const UserProfile = () => {
  const { user } = useAuth();
  const { data: userData, isLoading, error } = useUser(user?.id);
  const updateUser = useUpdateUser();
  const [isProEnabled, setIsProEnabled] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsProEnabled(userData.is_pro);
    }
  }, [userData]);

  const handleProUpgrade = async () => {
    if (!user) {
      toast.error("You must be logged in to change your subscription");
      return;
    }

    try {
      await updateUser.mutateAsync({ id: user.id, is_pro: true });
      setIsProEnabled(true);
      toast.success("Upgraded to Pro successfully!");
    } catch (error) {
      console.error("Error updating pro status:", error);
      toast.error("Failed to update subscription status");
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading profile: {error.message}</div>;
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
      {!isProEnabled && (
        <Button onClick={handleProUpgrade} disabled={updateUser.isLoading}>
          Upgrade to Pro
        </Button>
      )}
    </div>
  );
};

export default UserProfile;