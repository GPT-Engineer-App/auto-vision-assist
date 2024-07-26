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
    "Ford Motor Company": ["Ford", "Lincoln", "Mercury", "Mazda"],
  };

  const modelsByMakeAndYear = {
    Chevrolet: {
      "1996-2000": ["Camaro", "Corvette", "Impala", "Malibu", "Cavalier", "S-10", "Tahoe", "Suburban"],
      "2001-2010": ["TrailBlazer", "Aveo", "Cobalt", "HHR", "Silverado", "Equinox", "Colorado"],
      "2011-2023": ["Cruze", "Sonic", "Spark", "Volt", "Bolt EV", "Camaro", "Corvette", "Malibu", "Impala", "Trax", "Traverse", "Tahoe", "Suburban", "Silverado", "Colorado"],
    },
    GMC: {
      "1996-2000": ["Sierra", "Yukon", "Jimmy", "Sonoma", "Safari"],
      "2001-2010": ["Envoy", "Canyon", "Acadia", "Terrain"],
      "2011-2023": ["Sierra", "Yukon", "Acadia", "Terrain", "Savana"],
    },
    Buick: {
      "1996-2000": ["Century", "LeSabre", "Regal", "Park Avenue"],
      "2001-2010": ["Rendezvous", "LaCrosse", "Enclave"],
      "2011-2023": ["Verano", "Encore", "Envision", "LaCrosse", "Regal", "Enclave"],
    },
    Cadillac: {
      "1996-2000": ["DeVille", "Seville", "Eldorado", "Escalade"],
      "2001-2010": ["CTS", "SRX", "XLR", "DTS", "STS"],
      "2011-2023": ["ATS", "CTS", "CT6", "XT5", "XT6", "Escalade", "CT4", "CT5"],
    },
    Oldsmobile: {
      "1996-2000": ["Cutlass", "Alero", "Intrigue", "Bravada"],
      "2001-2004": ["Alero", "Silhouette", "Bravada"],
    },
    Pontiac: {
      "1996-2000": ["Grand Am", "Bonneville", "Firebird", "Sunfire"],
      "2001-2010": ["Grand Prix", "G6", "Torrent", "Vibe", "G8"],
    },
    Saturn: {
      "1996-2000": ["S-Series", "L-Series"],
      "2001-2010": ["Vue", "Ion", "Aura", "Outlook", "Sky"],
    },
    Ford: {
      "1996-2000": ["Mustang", "Taurus", "Explorer", "F-Series", "Ranger", "Escort", "Windstar"],
      "2001-2010": ["Focus", "Escape", "Fusion", "Edge", "Expedition", "Excursion", "Crown Victoria", "Transit Connect"],
      "2011-2023": ["Fiesta", "EcoSport", "Mustang", "Taurus", "Explorer", "F-Series", "Ranger", "Escape", "Fusion", "Edge", "Expedition", "Transit", "Mustang Mach-E"],
    },
    Lincoln: {
      "1996-2000": ["Town Car", "Navigator", "Continental"],
      "2001-2010": ["LS", "Aviator", "Zephyr", "MKZ", "Mark LT", "MKX"],
      "2011-2023": ["MKS", "MKT", "MKC", "Continental", "Navigator", "Nautilus", "Corsair", "Aviator"],
    },
    Mercury: {
      "1996-2000": ["Grand Marquis", "Sable", "Mountaineer"],
      "2001-2010": ["Mariner", "Milan", "Montego", "Monterey"],
      "2011": ["Grand Marquis", "Mariner", "Milan"],
    },
    Mazda: {
      "1996-2000": ["323", "Protege", "626", "MX-5 Miata", "MPV", "B-Series"],
      "2001-2010": ["Tribute", "RX-8", "Mazda6", "Mazda3", "CX-7", "CX-9"],
      "2011-2023": ["Mazda2", "Mazda5", "CX-3", "CX-30", "CX-5", "CX-9", "MX-5 Miata", "Mazda3", "Mazda6"],
    },
  };

  useEffect(() => {
    // Generate years from 1996 to 2023
    const yearList = Array.from({ length: 2023 - 1995 }, (_, i) => (2023 - i).toString());
    setYears(yearList);
  }, []);

  useEffect(() => {
    if (make && year) {
      const yearRange = getYearRange(parseInt(year));
      const availableModels = modelsByMakeAndYear[make]?.[yearRange] || [];
      setModels(availableModels);
    } else {
      setModels([]);
    }
  }, [make, year]);

  const getYearRange = (year) => {
    if (year >= 1996 && year <= 2000) return "1996-2000";
    if (year >= 2001 && year <= 2010) return "2001-2010";
    if (year >= 2011 && year <= 2023) return "2011-2023";
    return "";
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