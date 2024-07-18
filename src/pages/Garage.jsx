import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProGarageView from "@/components/ProGarageView";
import { useNavigate } from "react-router-dom";
import DiagnosticChat from "@/components/DiagnosticChat";
import VehicleHistory from "@/components/VehicleHistory";

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false); // In a real app, this would be fetched from the user's profile
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const q = query(collection(db, "vehicles"));
        const querySnapshot = await getDocs(q);
        const vehicleData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVehicles(vehicleData);
        if (vehicleData.length > 0) {
          setSelectedVehicle(vehicleData[0].id);
        }
      } catch (error) {
        toast.error("Error fetching vehicles: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleAddVehicle = () => {
    if (!isPro && vehicles.length >= 1) {
      toast.error("Free users can only store one vehicle. Upgrade to Pro to add more!");
    } else if (isPro && vehicles.length >= 3) {
      toast.error("Pro users can store up to three vehicles.");
    } else {
      navigate("/add-vehicle");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Garage</h1>
      {vehicles.length === 0 ? (
        <p>No vehicles have been added yet.</p>
      ) : isPro ? (
        <ProGarageView vehicles={vehicles} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className={selectedVehicle === vehicle.id ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Engine Size:</strong> {vehicle.engineSize}</p>
                <p><strong>Drivetrain:</strong> {vehicle.drivetrain}</p>
                <p><strong>Body Configuration:</strong> {vehicle.bodyConfig}</p>
                <Button 
                  onClick={() => setSelectedVehicle(vehicle.id)} 
                  variant="outline" 
                  className="mt-2"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-6">
        <Button onClick={handleAddVehicle}>Add Vehicle</Button>
        {!isPro && (
          <Button variant="outline" className="ml-4">Upgrade to Pro</Button>
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
  );
};

export default Garage;