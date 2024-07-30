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
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [engines, setEngines] = useState([]);
  const [drivetrains, setDrivetrains] = useState([]);
  const [bodyConfigurations, setBodyConfigurations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    populateYears();
    populateMakes();
  }, []);

  const populateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
    setYears(years);
  };

  const populateMakes = async () => {
    try {
      const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json');
      const data = await response.json();
      setMakes(data.Results.map(make => ({ value: make.Make_ID, label: make.Make_Name })));
    } catch (error) {
      console.error('Error fetching makes:', error);
      toast.error('Failed to load vehicle makes');
    }
  };

  const populateModels = async (makeId, year) => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
      const data = await response.json();
      setModels(data.Results.map(model => ({ value: model.Model_ID, label: model.Model_Name })));
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load vehicle models');
    }
  };

  const populateDetails = async (vin) => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`);
      const data = await response.json();
      const results = data.Results[0];
      
      setEngines([{ value: results.EngineSize, label: results.EngineSize }]);
      setDrivetrains([{ value: results.DriveType, label: results.DriveType }]);
      setBodyConfigurations([{ value: results.BodyClass, label: results.BodyClass }]);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      toast.error('Failed to load vehicle details');
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

  const handleModelChange = (selectedModel) => {
    setModel(selectedModel);
    // For demonstration purposes, we're using a static VIN. In a real application, you'd need to determine the VIN based on the selected year, make, and model.
    const demoVin = '5UXWX7C5*BA';
    populateDetails(demoVin);
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
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={handleModelChange}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
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
              {engines.map((e) => (
                <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
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
              {drivetrains.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
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
              {bodyConfigurations.map((b) => (
                <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Add Vehicle</Button>
      </form>
    </div>
  );
};

export default AddVehicle;