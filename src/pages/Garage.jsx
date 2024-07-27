import { useState, useEffect, useCallback } from "react";
import { collection, query, getDocs, doc, deleteDoc, updateDoc, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProGarageView from "@/components/ProGarageView";
import { useNavigate } from "react-router-dom";
import DiagnosticChat from "@/components/DiagnosticChat";
import VehicleHistory from "@/components/VehicleHistory";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdPlaceholder from "@/components/AdPlaceholder";
import { purchaseProVersion } from "@/lib/inAppPurchase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import OpenSightView from "@/components/OpenSightView";

const Garage = ({ isPro, setIsPro, user }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showOpenSight, setShowOpenSight] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchVehicles = useCallback(async () => {
    if (!user) return [];
    const q = query(collection(db, "vehicles"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }, [user]);

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles', user?.uid],
    queryFn: fetchVehicles,
    enabled: !!user,
  });

  useEffect(() => {
    if (vehicles && vehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [vehicles, selectedVehicle]);

  const handleAddVehicle = () => {
    if (!isPro && vehicles && vehicles.length >= 1) {
      toast.error("Free users can only store one vehicle. Upgrade to Pro for unlimited vehicles!");
    } else if (isPro && vehicles && vehicles.length >= 3) {
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
      queryClient.invalidateQueries(['vehicles', user?.uid]);
      toast.success("Vehicle updated successfully");
      setEditingVehicle(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Error updating vehicle: " + error.message);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteDoc(doc(db, "vehicles", vehicleId));
        queryClient.invalidateQueries(['vehicles', user?.uid]);
        toast.success("Vehicle deleted successfully");
        if (selectedVehicle === vehicleId) {
          setSelectedVehicle(vehicles.length > 1 ? vehicles[0].id : null);
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        toast.error("Error deleting vehicle: " + error.message);
      }
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      const success = await purchaseProVersion();
      if (success) {
        await updateDoc(doc(db, "users", user.uid), { isPro: true });
        setIsPro(true);
        toast.success("Upgraded to Pro successfully!");
        queryClient.invalidateQueries(['vehicles', user?.uid]);
      } else {
        toast.error("Failed to upgrade to Pro. Please try again.");
      }
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
      toast.error("Failed to upgrade to Pro");
    }
  };

  const handleOpenSight = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    setShowOpenSight(true);
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;
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
    <div className="min-h-screen bg-cover bg-center p-4" style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("/images/garage-background.png")'}}>
      <div className="container mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Garage</h1>
        {!isPro && <AdPlaceholder />}
        {vehicles && vehicles.length === 0 ? (
          <p>No vehicles have been added yet.</p>
        ) : isPro ? (
          <ProGarageView vehicles={vehicles} onOpenSight={handleOpenSight} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.slice(0, 1).map((vehicle) => (
              <Card key={vehicle.id} className={selectedVehicle === vehicle.id ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Engine Size:</strong> {vehicle.engineSize}</p>
                  <p><strong>Drivetrain:</strong> {vehicle.drivetrain}</p>
                  <p><strong>Body Configuration:</strong> {vehicle.bodyConfig}</p>
                  <div className="flex justify-between mt-4">
                    <Button 
                      onClick={() => setSelectedVehicle(vehicle.id)} 
                      variant="outline" 
                    >
                      Select
                    </Button>
                    <Button 
                      onClick={() => handleEditVehicle(vehicle)} 
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeleteVehicle(vehicle.id)} 
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-6">
          <Button onClick={handleAddVehicle}>Add Vehicle</Button>
          {!isPro && (
            <Button variant="outline" className="ml-4" onClick={handleUpgradeToPro}>Upgrade to Pro</Button>
          )}
        </div>
        {selectedVehicle && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Diagnostic Chat</h2>
            <DiagnosticChat vehicleId={selectedVehicle} isPro={isPro} />
            {isPro && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-4">Vehicle History</h2>
                <VehicleHistory vehicleId={selectedVehicle} />
              </>
            )}
          </div>
        )}
      </div>
      <EditVehicleDialog
        vehicle={editingVehicle}
        onClose={() => setEditingVehicle(null)}
        onUpdate={handleUpdateVehicle}
      />
      {showOpenSight && (
        <OpenSightView
          vehicleId={selectedVehicle}
          onClose={() => setShowOpenSight(false)}
        />
      )}
    </div>
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
          <Button type="submit">Update Vehicle</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Garage;