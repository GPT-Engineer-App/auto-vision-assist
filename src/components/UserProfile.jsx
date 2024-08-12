import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { purchaseProVersion, checkProPurchaseStatus, purchaseQueryPack, checkQueryPackPurchaseStatus, consumeQuery } from '@/lib/inAppPurchase';
import { savePreferences, loadPreferences } from '@/lib/userPreferences';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from "@/contexts/AuthContext";
import { useProStatus } from "@/contexts/ProStatusContext";
import { Loader2, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const UserProfile = () => {
  const { user } = useAuth();
  const { isPro, updateProStatus } = useProStatus();
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
  const [queryPacks, setQueryPacks] = useState(0);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData(userData);
          setIsProEnabled(userData.isPro || false);
          updateProStatus(userData.isPro || false);
          setQueryPacks(userData.queryPacks || 0);
        } else {
          // If the user document doesn't exist, create it
          const newUserData = {
            email: user.email,
            isPro: false,
            queryPacks: 0,
            createdAt: new Date(),
          };
          await setDoc(doc(db, "users", user.uid), newUserData);
          setUserData(newUserData);
          setIsProEnabled(false);
          updateProStatus(false);
          setQueryPacks(0);
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
        } else if (error.message.includes("client is offline")) {
          setError("Unable to connect to the server. Please check your internet connection and try again.");
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
      // Don't navigate away if the user is not authenticated
      // This allows the component to handle the unauthenticated state gracefully
      setError("Please log in to view your profile.");
    }
  }, [user]);

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

  const handleProUpgrade = async () => {
    if (!user) {
      toast.error("You must be logged in to change your subscription");
      return;
    }

    setLoading(true);
    try {
      const result = await purchaseProVersion();
      if (result.success) {
        toast.success("Redirecting to payment page...");
        // Redirect to the payment page or handle the next steps
        // window.location.href = result.paymentUrl; // Uncomment if you have a payment URL
      } else {
        throw new Error(result.error || "Failed to initiate upgrade process");
      }
    } catch (error) {
      console.error("Error initiating pro upgrade:", error);
      toast.error(error.message || "Failed to initiate upgrade process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQueryPackPurchase = async () => {
    if (!user) {
      toast.error("You must be logged in to purchase query packs");
      return;
    }

    setLoading(true);
    try {
      const result = await purchaseQueryPack();
      if (result.success) {
        toast.success("Query pack purchased successfully!");
        setQueryPacks(prev => prev + 10); // Assuming each pack gives 10 queries
      } else {
        throw new Error(result.error || "Failed to purchase query pack");
      }
    } catch (error) {
      console.error("Error purchasing query pack:", error);
      toast.error(error.message || "Failed to purchase query pack. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsumeQuery = async () => {
    if (!user) {
      toast.error("You must be logged in to use queries");
      return;
    }

    try {
      await consumeQuery();
      setQueryPacks(prev => prev - 1);
      toast.success("Query consumed successfully");
    } catch (error) {
      console.error("Error consuming query:", error);
      toast.error("Failed to consume query. Please try again.");
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

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error("You must be logged in to delete your account");
      return;
    }

    try {
      // Delete user's vehicles
      const vehiclesRef = collection(db, "vehicles");
      const q = query(vehiclesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete user document
      await deleteDoc(doc(db, "users", user.uid));

      // Delete user authentication
      await user.delete();

      toast.success("Your account has been deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-100 rounded-md">
              <p>{error}</p>
              <Button onClick={fetchUserProfile} className="mt-4">
                Retry
              </Button>
            </div>
          ) : !user ? (
            <div className="text-center p-4">
              <p>Please log in to view your profile.</p>
              <Button onClick={() => navigate("/")} className="mt-4">
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={userData?.username || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={userData?.email || ''}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>Save Profile</Button>
                </>
              ) : (
                <>
                  <p><strong>Username:</strong> {userData?.username || 'Not set'}</p>
                  <p><strong>Email:</strong> {userData?.email}</p>
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
              <div>
                <h3 className="text-xl font-semibold mt-6 mb-2">Query Packs</h3>
                <p>Current Query Packs: {queryPacks}</p>
                <Button onClick={handleQueryPackPurchase} disabled={loading} className="mt-2">
                  Purchase Query Pack
                </Button>
              </div>
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
                  <Input
                    id="language"
                    value="English"
                    disabled
                    className="w-32 text-right"
                  />
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount}>
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
