import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchAllMakes, fetchModelsForMake, fetchEngineSizesForMakeAndModel } from "@/lib/vehicleApi";

const AddVehicle = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [bodyConfig, setBodyConfig] = useState("");
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [engines, setEngines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMakes().then(setMakes).catch(error => {
      console.error("Failed to fetch makes:", error);
      toast.error("Failed to load vehicle makes. Please try again.");
    });
  }, []);

  useEffect(() => {
    if (make) {
      fetchModelsForMake(make).then(setModels).catch(error => {
        console.error("Failed to fetch models:", error);
        toast.error("Failed to load models for the selected make. Please try again.");
      });
      setModel("");
      setEngineSize("");
    }
  }, [make]);

  useEffect(() => {
    if (year && make && model) {
      fetchEngineSizesForMakeAndModel(year, make, model).then(setEngines).catch(error => {
        console.error("Failed to fetch engine sizes:", error);
        toast.error("Failed to load engine sizes. Please try again.");
      });
      setEngineSize("");
    }
  }, [year, make, model]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error("You must be logged in to add a vehicle");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "vehicles"), {
        userId: auth.currentUser.uid,
        year,
        make,
        model,
        engineSize,
        drivetrain,
        bodyConfig,
        createdAt: new Date(),
      });
      toast.success("Vehicle added successfully");
      navigate("/garage");
    } catch (error) {
      toast.error("Error adding vehicle: " + error.message);
    }
  };

  const years = Array.from({ length: 2024 - 1996 + 1 }, (_, i) => 2024 - i);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center" style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("/images/add-vehicle-background.png")'}}>
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a New Vehicle</h1>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={year} onValueChange={setYear} required>
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Select value={make} onValueChange={setMake} required>
              <SelectTrigger id="make">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel} required>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="engineSize">Engine Size</Label>
            <Select value={engineSize} onValueChange={setEngineSize} required>
              <SelectTrigger id="engineSize">
                <SelectValue placeholder="Select engine size" />
              </SelectTrigger>
              <SelectContent>
                {engines.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="drivetrain">Drivetrain</Label>
            <Select value={drivetrain} onValueChange={setDrivetrain} required>
              <SelectTrigger id="drivetrain">
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
            <Select value={bodyConfig} onValueChange={setBodyConfig} required>
              <SelectTrigger id="bodyConfig">
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
          <Button type="submit" className="w-full">Add Vehicle</Button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;
