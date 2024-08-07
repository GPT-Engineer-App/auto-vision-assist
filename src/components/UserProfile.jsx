import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { purchaseProVersion, checkProPurchaseStatus } from "@/lib/inAppPurchase";
import { savePreferences, loadPreferences } from "@/lib/userPreferences";
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ isPro, setIsPro, user }) => {
  const [isProEnabled, setIsProEnabled] = useState(isPro);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    language: 'en',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

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
        // Fetch user's vehicles
        await fetchUserVehicles();
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.code === 'permission-denied') {
          setError("Permission denied. Please make sure you're logged in.");
        } else {
          setError("Failed to load user profile. Please try again later.");
        }
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("User not authenticated. Please log in.");
    }
  };

  const fetchUserVehicles = async () => {
    try {
      const vehiclesRef = collection(db, "vehicles");
      const q = query(vehiclesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const vehicleData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVehicles(vehicleData);
    } catch (error) {
      console.error("Error fetching user vehicles:", error);
      toast.error("Failed to load user vehicles");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      loadUserPreferences();
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const loadUserPreferences = async () => {
    const savedPreferences = await loadPreferences();
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, [key]: value };
      savePreferences(newPreferences);
      return newPreferences;
    });
  };

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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), userData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
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
      {isEditing ? (
        <>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={userData?.username || ''}
            onChange={handleInputChange}
          />
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={userData?.email || ''}
            onChange={handleInputChange}
            disabled
          />
          <Button onClick={handleSaveProfile}>Save Profile</Button>
        </>
      ) : (
        <>
          <p>Username: {userData?.username || 'Not set'}</p>
          <p>Email: {userData?.email}</p>
          <Button onClick={handleEditProfile}>Edit Profile</Button>
        </>
      )}
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
      <h3 className="text-xl font-semibold mt-6 mb-4">Your Vehicles</h3>
      {vehicles.length > 0 ? (
        <ul className="list-disc pl-5">
          {vehicles.map(vehicle => (
            <li key={vehicle.id}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </li>
          ))}
        </ul>
      ) : (
        <p>No vehicles added yet.</p>
      )}
      <Button onClick={() => navigate("/add-vehicle")} className="mt-2">
        Add Vehicle
      </Button>
      <h3 className="text-xl font-semibold mt-6 mb-4">User Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark Mode</Label>
          <Switch
            id="darkMode"
            checked={preferences.darkMode}
            onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Notifications</Label>
          <Switch
            id="notifications"
            checked={preferences.notifications}
            onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            className="border rounded p-2"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
