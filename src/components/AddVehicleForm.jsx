import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const API_BASE_URL = "https://vpic.nhtsa.dot.gov/api";

const AddVehicleForm = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [bodyConfig, setBodyConfig] = useState("");
  const [years, setYears] = useState([]);
  const [models, setModels] = useState([]);
  const [engines, setEngines] = useState([]);
  const [drivetrains, setDrivetrains] = useState([]);
  const navigate = useNavigate();

  const manufacturers = {
    "General Motors (GM)": ["Chevrolet", "GMC", "Buick", "Cadillac", "Oldsmobile", "Pontiac", "Saturn"],
    "Ford Motor Company": ["Ford", "Lincoln", "Mercury"],
    "Fiat Chrysler Automobiles (FCA)": ["Chrysler", "Dodge", "Jeep", "Ram", "Fiat", "Alfa Romeo", "Maserati"],
    "Toyota Motor Corporation": ["Toyota", "Lexus", "Scion"],
    "Honda Motor Co., Ltd.": ["Honda", "Acura"],
    "Nissan Motor Co., Ltd.": ["Nissan", "Infiniti"],
    "Hyundai Motor Company": ["Hyundai", "Kia"],
    "Volkswagen Group": ["Volkswagen", "Audi", "Porsche", "Bentley", "Lamborghini", "Bugatti", "SEAT", "Škoda"],
    "BMW Group": ["BMW", "Mini", "Rolls-Royce"],
    "Daimler AG": ["Mercedes-Benz", "Smart"],
    "Subaru Corporation": ["Subaru"],
    "Mazda Motor Corporation": ["Mazda"],
    "Mitsubishi Motors Corporation": ["Mitsubishi"],
    "Tesla, Inc.": ["Tesla"],
    "Other Notable Brands": ["Volvo", "Jaguar", "Land Rover", "Aston Martin", "Lotus", "Pagani", "Koenigsegg"]
  };

  useEffect(() => {
    // Generate years from 1996 to 2024
    const currentYear = new Date().getFullYear();
    const yearList = Array.from({ length: currentYear - 1995 }, (_, i) => (currentYear - i).toString());
    setYears(yearList);
  }, []);

  useEffect(() => {
    if (make) {
      fetchModels(make);
    }
  }, [make]);

  useEffect(() => {
    if (year && make && model) {
      fetchVehicleDetails(year, make, model);
    }
  }, [year, make, model]);

  const fetchModels = async (selectedMake) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/GetModelsForMake/${selectedMake}?format=json`);
      const data = await response.json();
      setModels(data.Results.map(model => model.Model_Name));
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Failed to fetch vehicle models");
    }
  };

  const fetchVehicleDetails = async (selectedYear, selectedMake, selectedModel) => {
    try {
      // Using a placeholder VIN for demonstration. In a real scenario, you'd need to determine an appropriate VIN.
      const placeholderVIN = "1GNALDEK9FZ108495";
      const response = await fetch(`${API_BASE_URL}/vehicles/DecodeVinExtended/${placeholderVIN}?format=json&modelyear=${selectedYear}`);
      const data = await response.json();
      
      // Extract engine and drivetrain information
      const engineOptions = data.Results.filter(item => item.Variable === "Engine Configuration" || item.Variable === "Displacement (L)");
      const drivetrainOptions = data.Results.filter(item => item.Variable === "Drive Type");
      
      setEngines(engineOptions.map(engine => engine.Value).filter(Boolean));
      setDrivetrains(drivetrainOptions.map(drivetrain => drivetrain.Value).filter(Boolean));
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      toast.error("Failed to fetch vehicle details");
    }
  };

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
            {Object.entries(manufacturers).map(([group, brands]) => (
              <SelectItem key={group} value={group} disabled>
                {group}
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select onValueChange={setModel} required>
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
        <Select onValueChange={setEngineSize} required>
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
        <Select onValueChange={setDrivetrain} required>
          <SelectTrigger id="drivetrain">
            <SelectValue placeholder="Select drivetrain" />
          </SelectTrigger>
          <SelectContent>
            {drivetrains.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
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