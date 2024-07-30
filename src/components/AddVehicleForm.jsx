import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  fetchYears,
  fetchAllMakes,
  fetchModelsForMake,
  fetchEngineSizes,
  fetchDrivetrains,
  fetchBodyConfigurations
} from "@/lib/vehicleApi";

const AddVehicleForm = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [bodyConfig, setBodyConfig] = useState("");
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [engineSizes, setEngineSizes] = useState([]);
  const [drivetrains, setDrivetrains] = useState([]);
  const [bodyConfigs, setBodyConfigs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setYears(fetchYears());
      const fetchedMakes = await fetchAllMakes();
      setMakes(fetchedMakes);
      setEngineSizes(await fetchEngineSizes());
      setDrivetrains(await fetchDrivetrains());
      setBodyConfigs(await fetchBodyConfigurations());
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (make) {
      fetchModelsForMake(make).then(setModels).catch(console.error);
      setModel("");
      setEngineSize("");
    }
  }, [make]);

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
      console.log("Vehicle added with ID: ", docRef.id);
      toast.success("Vehicle added successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Error adding vehicle: ", error);
      toast.error("Error adding vehicle: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Select value={year} onValueChange={setYear} required>
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
            {engineSizes.map((e) => (
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
            {drivetrains.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
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
            {bodyConfigs.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Add Vehicle</Button>
    </form>
  );
};

export default AddVehicleForm;