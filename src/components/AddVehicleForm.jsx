import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://vpic.nhtsa.dot.gov/api";

const AddVehicleForm = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [bodyConfig, setBodyConfig] = useState("");
  const navigate = useNavigate();

  const years = Array.from({ length: 2023 - 1995 + 1 }, (_, i) => (2023 - i).toString());

  const { data: makes, isLoading: isLoadingMakes, error: makesError } = useQuery({
    queryKey: ['makes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/vehicles/GetAllMakes?format=json`);
      if (!response.ok) {
        throw new Error('Failed to fetch makes');
      }
      const data = await response.json();
      return data.Results.filter(make => 
        ["Toyota", "Lexus", "Scion", "Honda", "Acura", "Nissan", "Infiniti", "Hyundai", "Kia", "Volkswagen", "Audi", "Subaru", "Volvo", "Jaguar", "Land Rover", "BMW", "Mini", "Mercedes-Benz", "Porsche", "Bentley", "Rolls-Royce", "Lamborghini", "Bugatti", "Aston Martin", "Lotus", "Pagani", "Koenigsegg"].includes(make.Make_Name)
      );
    },
  });

  const { data: models, isLoading: isLoadingModels, error: modelsError } = useQuery({
    queryKey: ['models', make, year],
    queryFn: async () => {
      if (!make || !year) return [];
      const response = await fetch(`${API_BASE_URL}/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      return data.Results;
    },
    enabled: !!make && !!year,
  });

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

  if (isLoadingMakes) return <div>Loading makes...</div>;
  if (makesError) return <div>Error loading makes: {makesError.message}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Select onValueChange={setYear} required>
          <SelectTrigger id="year">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="make">Make</Label>
        <Select onValueChange={setMake} required>
          <SelectTrigger id="make">
            <SelectValue placeholder="Select make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map((make) => (
              <SelectItem key={make.Make_ID} value={make.Make_Name}>{make.Make_Name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select onValueChange={setModel} required disabled={!make || !year}>
          <SelectTrigger id="model">
            <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select model"} />
          </SelectTrigger>
          <SelectContent>
            {models && models.map((model) => (
              <SelectItem key={model.Model_ID} value={model.Model_Name}>{model.Model_Name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {modelsError && <p className="text-red-500">Error loading models: {modelsError.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="engineSize">Engine Size</Label>
        <Select onValueChange={setEngineSize} required>
          <SelectTrigger id="engineSize">
            <SelectValue placeholder="Select engine size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1.0L">1.0L</SelectItem>
            <SelectItem value="1.5L">1.5L</SelectItem>
            <SelectItem value="2.0L">2.0L</SelectItem>
            <SelectItem value="2.5L">2.5L</SelectItem>
            <SelectItem value="3.0L">3.0L</SelectItem>
            <SelectItem value="3.5L">3.5L</SelectItem>
            <SelectItem value="4.0L">4.0L</SelectItem>
            <SelectItem value="5.0L">5.0L</SelectItem>
            <SelectItem value="6.0L">6.0L</SelectItem>
            <SelectItem value="Electric">Electric</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="drivetrain">Drivetrain</Label>
        <Select onValueChange={setDrivetrain} required>
          <SelectTrigger id="drivetrain">
            <SelectValue placeholder="Select drivetrain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FWD">Front-Wheel Drive (FWD)</SelectItem>
            <SelectItem value="RWD">Rear-Wheel Drive (RWD)</SelectItem>
            <SelectItem value="AWD">All-Wheel Drive (AWD)</SelectItem>
            <SelectItem value="4WD">Four-Wheel Drive (4WD)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bodyConfig">Body Configuration</Label>
        <Select onValueChange={setBodyConfig} required>
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
  );
};

export default AddVehicleForm;