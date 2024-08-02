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
  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");
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
      const docRef = await addDoc(collection(db, "vehicles"), {
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
      console.log("Vehicle added with ID: ", docRef.id);
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

  const years = Array.from({ length: 2024 - 1900 + 1 }, (_, i) => 2024 - i);
  const drivetrains = ['FWD', 'RWD', 'AWD', '4WD'];
  const bodyConfigurations = ['Sedan', 'Coupe', 'Hatchback', 'SUV', 'Truck', 'Van'];
  const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Vehicle</h1>
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
              {drivetrains.map((dt) => (
                <SelectItem key={dt} value={dt}>{dt}</SelectItem>
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
              {bodyConfigurations.map((bc) => (
                <SelectItem key={bc} value={bc}>{bc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select value={fuelType} onValueChange={setFuelType} required>
            <SelectTrigger id="fuelType">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((ft) => (
                <SelectItem key={ft} value={ft}>{ft}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Enter vehicle mileage"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
        </Button>
      </form>
    </div>
  );
};

export default AddVehicle;