import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchAllMakes, fetchModelsForMake, fetchEngineSizesForMakeAndModel } from "@/lib/vehicleApi";

const AddVehicle = () => {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [modelCategory, setModelCategory] = useState("");
  const [modelVariant, setModelVariant] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [drivetrain, setDrivetrain] = useState("");
  const [bodyConfig, setBodyConfig] = useState("");
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [modelCategories, setModelCategories] = useState([]);
  const [modelVariants, setModelVariants] = useState([]);
  const [engineSizes, setEngineSizes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    populateYears();
    fetchAllMakes().then(setMakes).catch(console.error);
  }, []);

  const populateYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsList = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
    setYears(yearsList);
  };

  useEffect(() => {
    if (year && make) {
      fetchModelsForMake(make).then(models => {
        const categories = [...new Set(models.map(model => model.split(' ')[0]))];
        setModelCategories(categories);
      }).catch(console.error);
    }
  }, [year, make]);

  useEffect(() => {
    if (year && make && modelCategory) {
      fetchModelsForMake(make).then(models => {
        const variants = models.filter(model => model.startsWith(modelCategory));
        setModelVariants(variants);
      }).catch(console.error);
    }
  }, [year, make, modelCategory]);

  useEffect(() => {
    if (year && make && modelVariant) {
      fetchEngineSizesForMakeAndModel(year, make, modelVariant).then(setEngineSizes).catch(console.error);
    }
  }, [year, make, modelVariant]);

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
        model: modelVariant,
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Select value={year} onValueChange={setYear}>
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
          <Select value={make} onValueChange={setMake}>
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
          <Label htmlFor="modelCategory">Model Category</Label>
          <Select value={modelCategory} onValueChange={setModelCategory}>
            <SelectTrigger id="modelCategory">
              <SelectValue placeholder="Select model category" />
            </SelectTrigger>
            <SelectContent>
              {modelCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="modelVariant">Model Variant</Label>
          <Select value={modelVariant} onValueChange={setModelVariant}>
            <SelectTrigger id="modelVariant">
              <SelectValue placeholder="Select model variant" />
            </SelectTrigger>
            <SelectContent>
              {modelVariants.map((variant) => (
                <SelectItem key={variant} value={variant}>{variant}</SelectItem>
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
              {['FWD', 'RWD', 'AWD', '4WD'].map((dt) => (
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
              {['Sedan', 'Coupe', 'Hatchback', 'SUV', 'Truck', 'Van'].map((bc) => (
                <SelectItem key={bc} value={bc}>{bc}</SelectItem>
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