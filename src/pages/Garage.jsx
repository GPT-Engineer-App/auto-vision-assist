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
import { Tooltip } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const Garage = ({ isPro, setIsPro, user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "vehicles"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const vehicleData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVehicles(vehicleData);
      } catch (error) {
        toast.error("Error fetching vehicles: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
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
    setEditingVehicle(vehicle);
  };

  const handleUpdateVehicle = async (updatedVehicle) => {
    try {
      const vehicleRef = doc(db, "vehicles", updatedVehicle.id);
      await updateDoc(vehicleRef, updatedVehicle);
      setVehicles(vehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
      toast.success("Vehicle updated successfully");
      setEditingVehicle(null);
    } catch (error) {
      toast.error("Error updating vehicle: " + error.message);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteDoc(doc(db, "vehicles", vehicleId));
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      toast.error("Error deleting vehicle: " + error.message);
    }
  };

  const handleOpenSight = (vehicleId) => {
    // Implement the Open Sight functionality here
    toast.info("Open Sight functionality not implemented yet");
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
                  <div className="flex justify-between mt-4">
                    <Tooltip content="Edit vehicle details">
                      <Button onClick={() => handleEditVehicle(vehicle)} variant="outline">Edit</Button>
                    </Tooltip>
                    <AlertDialog>
                      <Tooltip content="Remove this vehicle from your garage">
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                      </Tooltip>
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
                    {isPro && (
                      <Tooltip content="Access advanced diagnostics for this vehicle">
                        <Button onClick={() => handleOpenSight(vehicle.id)}>Open Sight</Button>
                      </Tooltip>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6">
        <Tooltip content="Add a new vehicle to your garage">
          <Button onClick={handleAddVehicle}>Add Vehicle</Button>
        </Tooltip>
        {!isPro && vehicles.length >= 1 && (
          <Tooltip content="Upgrade to Pro for more features">
            <Button variant="outline" className="ml-4" onClick={() => setIsPro(true)}>Upgrade to Pro</Button>
          </Tooltip>
        )}
      </div>
      <EditVehicleDialog
        vehicle={editingVehicle}
        onClose={() => setEditingVehicle(null)}
        onUpdate={handleUpdateVehicle}
      />
      <Tooltip content="Need help? Click here for assistance">
        <Button variant="ghost" size="icon" className="fixed bottom-4 right-4">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </Tooltip>
    </motion.div>
  );
};

const EditVehicleDialog = ({ vehicle, onClose, onUpdate }) => {
  const [editedVehicle, setEditedVehicle] = useState(vehicle);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedVehicle);
  };

  if (!vehicle) return null;

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
                <SelectItem value="fwd">Front-Wheel Drive</SelectItem>
                <SelectItem value="rwd">Rear-Wheel Drive</SelectItem>
                <SelectItem value="awd">All-Wheel Drive</SelectItem>
                <SelectItem value="4wd">Four-Wheel Drive</SelectItem>
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
          <DialogFooter>
            <Button type="submit">Update Vehicle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Garage;