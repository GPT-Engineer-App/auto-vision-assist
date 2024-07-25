import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const UserProfile = ({ isPro, setIsPro }) => {
  const [isProEnabled, setIsProEnabled] = useState(isPro);

  const handleProToggle = (checked) => {
    if (checked) {
      // Implement the logic for upgrading to Pro
      toast.success("Upgraded to Pro successfully!");
      setIsPro(true);
    } else {
      // Implement the logic for downgrading from Pro
      toast.success("Downgraded from Pro successfully!");
      setIsPro(false);
    }
    setIsProEnabled(checked);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Profile</h2>
      <div className="flex items-center space-x-2">
        <Switch
          id="pro-mode"
          checked={isProEnabled}
          onCheckedChange={handleProToggle}
        />
        <Label htmlFor="pro-mode">Pro Mode</Label>
      </div>
      <p>
        {isProEnabled
          ? "You are currently on the Pro plan. Enjoy unlimited features!"
          : "Upgrade to Pro for unlimited features and no ads."}
      </p>
      {!isProEnabled && (
        <Button onClick={() => handleProToggle(true)}>Upgrade to Pro</Button>
      )}
    </div>
  );
};

export default UserProfile;