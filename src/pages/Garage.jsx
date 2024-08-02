import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, deleteDoc, updateDoc, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import OpenSightModal from "@/components/OpenSightModal";

const Garage = ({ isPro, setIsPro, user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [openSightVehicle, setOpenSightVehicle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log("User not authenticated, skipping data fetch");
        setLoading(false);
        return;
      }
      try {
        console.log("Fetching data for user:", user.uid);

        // Fetch user profile
        const userProfileQuery = query(collection(db, "users"), where("userId", "==", user.uid));
        const userProfileSnapshot = await getDocs(userProfileQuery);
        if (!userProfileSnapshot.empty) {
          const userProfileData = userProfileSnapshot.docs[0].data();
          console.log("User profile data:", userProfileData);
          setUserProfile(userProfileData);
        } else {
          console.error("User profile not found");
          toast.error("User profile not found. Please try again later.");
        }

        // Fetch vehicles
        const vehiclesQuery = query(collection(db, "vehicles"), where("userId", "==", user.uid));
        const vehiclesSnapshot = await getDocs(vehiclesQuery);
        const vehicleData = vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched vehicles:", vehicleData);
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddVehicle = () => {
    if (!isPro && vehicles.length >= 1) {
      toast.error("Free users can only store one vehicle. Upgrade to Pro to add more!");
    } else if (isPro && vehicles.length >= 3) {
      toast.error("Pro users can store up to three vehicles.");
    } else {
      navigate("/add-vehicle");
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle({ ...vehicle });
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    try {
      const { id, ...vehicleData } = updatedVehicle;
      const vehicleRef = doc(db, "vehicles", id);
      await updateDoc(vehicleRef, vehicleData);
      setVehicles(vehicles.map(v => v.id === id ? updatedVehicle : v));
      toast.success("Vehicle updated successfully");
      setEditingVehicle(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Error updating vehicle: " + error.message);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, "vehicles", vehicleId));
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Error deleting vehicle: " + error.message);
    }
  };

  const handleOpenSight = (vehicle) => {
    if (isPro) {
      setOpenSightVehicle(vehicle);
    } else {
      toast.error("Open Sight is a Pro feature. Please upgrade to access this functionality.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p>Please log in to view your garage.</p>
        <Button onClick={() => navigate("/")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">My Garage</h1>
      {userProfile && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {userProfile.username || userProfile.email}</h2>
          <p>Membership: {isPro ? "Pro" : "Free"}</p>
        </div>
      )}
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={vehicle.image || "/images/default-car.png"} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover mb-4 rounded" />
                  <p><strong>Engine:</strong> {vehicle.engineSize}</p>
                  <p><strong>Drivetrain:</strong> {vehicle.drivetrain}</p>
                  <p><strong>Body:</strong> {vehicle.bodyConfig}</p>
                  <p><strong>Mileage:</strong> {vehicle.mileage?.toLocaleString() || 'N/A'} miles</p>
                  <div className="flex justify-between mt-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleEditVehicle(vehicle)} variant="outline">Edit</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit vehicle details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <AlertDialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove this vehicle from your garage</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your vehicle from your garage.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={() => handleOpenSight(vehicle)} disabled={!isPro}>Open Sight</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isPro ? "Access advanced diagnostics for this vehicle" : "Upgrade to Pro to access Open Sight"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleAddVehicle}>Add Vehicle</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new vehicle to your garage</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!isPro && vehicles.length >= 1 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="ml-4" onClick={() => setIsPro(true)}>Upgrade to Pro</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upgrade to Pro for more features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <EditVehicleDialog
        vehicle={editingVehicle}
        onClose={() => setEditingVehicle(null)}
        onUpdate={handleUpdateVehicle}
      />
      <OpenSightModal
        vehicle={openSightVehicle}
        onClose={() => setOpenSightVehicle(null)}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed bottom-4 right-4">
              <HelpCircle className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Need help? Click here for assistance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

const EditVehicleDialog = ({ vehicle, onClose, onUpdate }) => {
  const [editedVehicle, setEditedVehicle] = useState(null);

  useEffect(() => {
    if (vehicle) {
      setEditedVehicle({ ...vehicle });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedVehicle);
  };

  if (!editedVehicle) return null;

  return (
    <Dialog open={!!vehicle} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={editedVehicle.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              name="make"
              type="text"
              value={editedVehicle.make}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              type="text"
              value={editedVehicle.model}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="engineSize">Engine Size</Label>
            <Input
              id="engineSize"
              name="engineSize"
              type="text"
              value={editedVehicle.engineSize}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="drivetrain">Drivetrain</Label>
            <Select name="drivetrain" onValueChange={(value) => handleChange({ target: { name: 'drivetrain', value } })} value={editedVehicle.drivetrain}>
              <SelectTrigger>
                <SelectValue placeholder="Select drivetrain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FWD">Front-Wheel Drive</SelectItem>
                <SelectItem value="RWD">Rear-Wheel Drive</SelectItem>
                <SelectItem value="AWD">All-Wheel Drive</SelectItem>
                <SelectItem value="4WD">Four-Wheel Drive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyConfig">Body Configuration</Label>
            <Select name="bodyConfig" onValueChange={(value) => handleChange({ target: { name: 'bodyConfig', value } })} value={editedVehicle.bodyConfig}>
              <SelectTrigger>
                <SelectValue placeholder="Select body configuration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="coupe">Coupe</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select name="fuelType" onValueChange={(value) => handleChange({ target: { name: 'fuelType', value } })} value={editedVehicle.fuelType}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Gas</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              name="mileage"
              type="text"
              value={editedVehicle.mileage?.toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                if (/^\d*$/.test(value)) {
                  handleChange({ target: { name: 'mileage', value: parseInt(value, 10) || 0 } });
                }
              }}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Update Vehicle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Garage;