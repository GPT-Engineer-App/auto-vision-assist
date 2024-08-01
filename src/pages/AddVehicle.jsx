import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AddVehicle = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [bodyConfig, setBodyConfig] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [engineSizes, setEngineSizes] = useState([]);
  const navigate = useNavigate();

  const predefinedMakes = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac",
    "Chevrolet", "Chrysler", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda",
    "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus",
    "Lincoln", "Lotus", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi",
    "Nissan", "Porsche", "Ram", "Rolls-Royce", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
  ];

  const drivetrains = ['FWD', 'RWD', 'AWD', '4WD'];
  const bodyConfigurations = ['Sedan', 'Coupe', 'Hatchback', 'Convertible', 'Van', 'SUV', 'Truck'];

  useEffect(() => {
    populateYears();
    setMakes(predefinedMakes);
    populateEngineSizes();
  }, []);

  const populateYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsList = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
    setYears(yearsList);
  };

  const populateEngineSizes = () => {
    const sizes = [];
    for (let size = 1.0; size <= 12.0; size += 0.1) {
      sizes.push(size.toFixed(1) + 'L');
    }
    setEngineSizes(sizes);
  };

  const populateModels = async (selectedMake, selectedYear) => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${selectedMake}/modelyear/${selectedYear}?format=json`);
      const data = await response.json();
      const modelsList = data.Results.map(model => model.Model_Name);
      setModels(Array.from(new Set(modelsList)));
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load models');
    }
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
    if (make) {
      populateModels(make, selectedYear);
    }
  };

  const handleMakeChange = (selectedMake) => {
    setMake(selectedMake);
    if (year) {
      populateModels(selectedMake, year);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error("You must be logged in to add a vehicle");
      return;
    }

    try {
      const vehiclesRef = collection(db, "vehicles");
      await addDoc(vehiclesRef, {
        userId: auth.currentUser.uid,
        year,
        make,
        model,
        engineSize,
        drivetrain,
        bodyConfig,
        fuelType,
        mileage: Number(mileage),
        createdAt: new Date(),
      });
      toast.success("Vehicle added successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      if (error.code === "permission-denied") {
        toast.error("Permission denied. Please make sure you're logged in and try again.");
      } else {
        toast.error("Error adding vehicle: " + error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Select value={year} onValueChange={handleYearChange}>
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
        <div>
          <Label htmlFor="make">Make</Label>
          <Select value={make} onValueChange={handleMakeChange}>
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
        <div>
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={setModel}>
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
        <div>
          <Label htmlFor="engineSize">Engine Size</Label>
          <Select value={engineSize} onValueChange={setEngineSize}>
            <SelectTrigger id="engineSize">
              <SelectValue placeholder="Select engine size" />
            </SelectTrigger>
            <SelectContent>
              {engineSizes.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="drivetrain">Drivetrain</Label>
          <Select value={drivetrain} onValueChange={setDrivetrain}>
            <SelectTrigger id="drivetrain">
              <SelectValue placeholder="Select drivetrain" />
            </SelectTrigger>
            <SelectContent>
              {drivetrains.map((dt) => (
                <SelectItem key={dt} value={dt}>{dt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bodyConfig">Body Configuration</Label>
          <Select value={bodyConfig} onValueChange={setBodyConfig}>
            <SelectTrigger id="bodyConfig">
              <SelectValue placeholder="Select body configuration" />
            </SelectTrigger>
            <SelectContent>
              {bodyConfigurations.map((bc) => (
                <SelectItem key={bc} value={bc}>{bc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select value={fuelType} onValueChange={setFuelType}>
            <SelectTrigger id="fuelType">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Enter vehicle mileage"
          />
        </div>
        <Button type="submit">Add Vehicle</Button>
      </form>
    </div>
  );
};

export default AddVehicle;
