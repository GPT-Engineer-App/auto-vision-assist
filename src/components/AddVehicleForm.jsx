import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, addData } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchAllMakes, fetchModelsForMake, fetchEngineSizesForMakeAndModel } from "@/lib/vehicleApi";

const AddVehicleForm = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [bodyConfig, setBodyConfig] = useState("");
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [engines, setEngines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMakes().then(setMakes).catch(console.error);
  }, []);

  useEffect(() => {
    if (make) {
      fetchModelsForMake(make).then(setModels).catch(console.error);
      setModel("");
      setEngineSize("");
    }
  }, [make]);

  useEffect(() => {
    if (year && make && model) {
      fetchEngineSizesForMakeAndModel(year, make, model).then(setEngines).catch(console.error);
      setEngineSize("");
    }
  }, [year, make, model]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!auth.currentUser) {
      toast.error("You must be logged in to add a vehicle");
      setIsSubmitting(false);
      return;
    }

    try {
      const vehicleData = {
        userId: auth.currentUser.uid,
        year,
        make,
        model,
        engineSize,
        drivetrain,
        bodyConfig,
        createdAt: new Date(),
      };
      const docId = await addData("vehicles", vehicleData);
      console.log("Vehicle added with ID: ", docId);
      toast.success("Vehicle added successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Error adding vehicle: ", error);
      if (error.code === "permission-denied") {
        toast.error("Permission denied. Please make sure you're logged in and try again.");
      } else {
        toast.error("Error adding vehicle: " + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const years = Array.from({ length: 2024 - 1996 + 1 }, (_, i) => 2024 - i);

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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
      </Button>
    </form>
  );
};

export default AddVehicleForm;
