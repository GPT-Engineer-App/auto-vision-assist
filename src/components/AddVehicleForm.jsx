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
    "Toyota Motor Corporation": ["Toyota", "Lexus", "Scion"],
    "Honda Motor Co., Ltd.": ["Honda", "Acura"],
    "Nissan Motor Co., Ltd.": ["Nissan", "Infiniti"],
    "Hyundai Motor Company": ["Hyundai", "Kia"],
    "Volkswagen Group": ["Volkswagen", "Audi"],
    "Subaru Corporation": ["Subaru"],
    "Volvo Cars": ["Volvo"],
    "Jaguar Land Rover": ["Jaguar", "Land Rover"],
    "BMW Group": ["BMW", "Mini"],
    "Mercedes-Benz Group": ["Mercedes-Benz"],
    "Porsche AG": ["Porsche"],
    "Bentley Motors Limited": ["Bentley"],
    "Rolls-Royce Motor Cars": ["Rolls-Royce"],
    "Automobili Lamborghini S.p.A.": ["Lamborghini"],
    "Bugatti Automobiles S.A.S.": ["Bugatti"],
    "Aston Martin Lagonda Global Holdings plc": ["Aston Martin"],
    "Lotus Cars": ["Lotus"],
    "Pagani Automobili S.p.A.": ["Pagani"],
    "Koenigsegg Automotive AB": ["Koenigsegg"]
  };

  const modelsByMakeAndYear = {
    Toyota: {
      "1996-2000": ["Camry", "Corolla", "Celica", "Supra", "4Runner", "Tacoma", "Tundra", "Land Cruiser", "RAV4"],
      "2001-2010": ["Camry", "Corolla", "Matrix", "Prius", "Highlander", "4Runner", "Tacoma", "Tundra", "Sequoia", "FJ Cruiser", "Yaris", "Venza", "RAV4"],
      "2011-2023": ["Avalon", "Camry", "Corolla", "Prius", "Highlander", "Tacoma", "Tundra", "RAV4", "C-HR", "Mirai", "Supra", "GR Yaris", "GR86"],
    },
    Lexus: {
      "1996-2000": ["ES 300", "LS 400", "GS 300", "SC 400", "RX 300"],
      "2001-2010": ["IS 300", "GS 430", "LS 430", "SC 430", "RX 330", "LX 470", "ES 330", "IS 250"],
      "2011-2023": ["CT 200h", "ES 350", "GS 350", "LS 500", "IS 350", "RC", "RX 350", "LX 570", "NX", "UX", "LC 500"],
    },
    Scion: {
      "2003-2006": ["xA", "xB", "tC"],
      "2007-2010": ["xD", "tC", "iQ"],
      "2011-2016": ["FR-S", "iA", "iM"],
    },
    Honda: {
      "1996-2000": ["Accord", "Civic", "Prelude", "CR-V", "Odyssey", "Passport", "Insight"],
      "2001-2010": ["Accord", "Civic", "Element", "Fit", "Ridgeline", "S2000", "CR-Z", "Pilot", "CR-V", "Odyssey"],
      "2011-2023": ["Accord", "Civic", "CR-V", "Odyssey", "Pilot", "Ridgeline", "HR-V", "Clarity", "Insight", "Passport"],
    },
    Acura: {
      "1996-2000": ["Integra", "TL", "RL", "NSX"],
      "2001-2010": ["RSX", "TSX", "MDX", "RDX", "ZDX", "TL", "RL"],
      "2011-2023": ["ILX", "TLX", "RLX", "MDX", "RDX", "NSX"],
    },
    Nissan: {
      "1996-2000": ["Altima", "Maxima", "Sentra", "Pathfinder", "Frontier", "Xterra", "300ZX", "Skyline GT-R"],
      "2001-2010": ["Altima", "Maxima", "Sentra", "Pathfinder", "Frontier", "Murano", "Titan", "Quest", "Armada", "Versa", "Cube", "GT-R"],
      "2011-2023": ["Leaf", "Juke", "Rogue", "Pathfinder", "Frontier", "Xterra", "370Z", "GT-R", "Kicks", "Ariya", "Altima", "Maxima", "Sentra"],
    },
    Infiniti: {
      "1996-2000": ["I30", "Q45", "G20", "J30"],
      "2001-2010": ["G35", "M35", "FX35", "EX35", "QX56", "Q45", "M45"],
      "2011-2023": ["Q50", "Q60", "Q70", "QX60", "QX80", "QX50", "QX30", "QX55"],
    },
    Hyundai: {
      "1996-2000": ["Accent", "Elantra", "Sonata", "Tiburon"],
      "2001-2010": ["Santa Fe", "Tucson", "Azera", "Genesis", "Equus"],
      "2011-2023": ["Veloster", "Ioniq", "Kona", "Nexo", "Palisade", "Venue", "Sonata", "Elantra", "Tucson", "Santa Fe"],
    },
    Kia: {
      "1996-2000": ["Sephia", "Sportage", "Spectra"],
      "2001-2010": ["Optima", "Sorento", "Sedona", "Rio", "Amanti"],
      "2011-2023": ["Forte", "Soul", "Seltos", "Stinger", "Telluride", "Niro", "EV6", "K5", "Sorento", "Sportage"],
    },
    Volkswagen: {
      "1996-2000": ["Golf", "Jetta", "Passat", "Beetle", "Touareg"],
      "2001-2010": ["New Beetle", "Phaeton", "Tiguan", "Eos", "Routan"],
      "2011-2023": ["Golf", "Jetta", "Passat", "Arteon", "Atlas", "ID.4", "Tiguan", "Touareg"],
    },
    Audi: {
      "1996-2000": ["A4", "A6", "A8", "TT"],
      "2001-2010": ["A3", "A5", "Q7", "R8", "Q5"],
      "2011-2023": ["A1", "A3", "A4", "A6", "Q3", "Q8", "e-Tron", "RS Q8"],
    },
    Subaru: {
      "1996-2000": ["Impreza", "Legacy", "Forester", "Outback"],
      "2001-2010": ["Baja", "Tribeca", "WRX", "STI"],
      "2011-2023": ["BRZ", "Crosstrek", "Ascent", "Impreza", "Legacy", "Outback", "Forester"],
    },
    Volvo: {
      "1996-2000": ["850", "S70", "V70", "C70"],
      "2001-2010": ["S40", "S60", "XC90", "C30", "V50"],
      "2011-2023": ["S60", "V60", "XC60", "XC40", "XC90", "S90", "V90", "Polestar"],
    },
    Jaguar: {
      "1996-2000": ["XJ (X300, X308)", "XK8", "S-Type"],
      "2001-2010": ["XJ (X350, X358)", "XK (X100)", "XF", "X-Type"],
      "2011-2023": ["F-Type", "XJ (X351)", "XF (2nd gen)", "XE", "I-Pace", "F-Pace", "E-Pace"],
    },
    "Land Rover": {
      "1996-2000": ["Discovery (2nd gen)", "Range Rover (P38A)"],
      "2001-2010": ["Freelander", "Range Rover (L322)", "Discovery (3rd gen)", "Range Rover Sport"],
      "2011-2023": ["Evoque", "Discovery (4th gen)", "Range Rover (L405)", "Range Rover Sport (2nd gen)", "Velar"],
    },
    BMW: {
      "1996-2000": ["3 Series (E46)", "5 Series (E39)", "7 Series (E38)", "Z3", "M3"],
      "2001-2010": ["X5", "1 Series", "6 Series", "X3", "Z4", "M5"],
      "2011-2023": ["i3", "i8", "4 Series", "X6", "X4", "2 Series", "8 Series", "X7", "M8"],
    },
    Mini: {
      "2001-2010": ["Mini Hatch", "Mini Convertible", "Mini Clubman", "Mini Countryman"],
      "2011-2023": ["Mini Coupé", "Mini Roadster", "Mini Paceman", "Mini Clubman (2nd gen)", "Mini Countryman (2nd gen)"],
    },
    "Mercedes-Benz": {
      "1996-2000": ["C-Class (W202)", "E-Class (W210)", "S-Class (W220)", "SLK-Class"],
      "2001-2010": ["CLK-Class", "SLR McLaren", "M-Class", "R-Class", "CLS-Class"],
      "2011-2023": ["A-Class", "B-Class", "GLA-Class", "GLC-Class", "GLE-Class", "GLS-Class", "S-Class (W222)", "AMG GT"],
    },
    Porsche: {
      "1996-2000": ["911 (996)", "Boxster", "Carrera GT"],
      "2001-2010": ["Cayenne", "911 (997)", "Panamera"],
      "2011-2023": ["911 (991)", "Macan", "Cayman", "918 Spyder", "911 (992)", "Taycan"],
    },
    Bentley: {
      "1996-2000": ["Continental R", "Azure"],
      "2001-2010": ["Arnage", "Continental GT", "Flying Spur"],
      "2011-2023": ["Mulsanne", "Continental GT (2nd gen)", "Bentayga", "Continental GT (3rd gen)"],
    },
    "Rolls-Royce": {
      "1996-2000": ["Silver Seraph", "Corniche"],
      "2001-2010": ["Phantom (7th gen)", "Phantom Drophead Coupé", "Phantom Coupé"],
      "2011-2023": ["Ghost (2nd gen)", "Wraith", "Dawn", "Cullinan", "Phantom (8th gen)"],
    },
    Lamborghini: {
      "1996-2000": ["Diablo", "Murciélago"],
      "2001-2010": ["Gallardo", "Reventón", "Estoque"],
      "2011-2023": ["Aventador", "Huracán", "Urus"],
    },
    Bugatti: {
      "1996-2000": ["EB110"],
      "2001-2010": ["Veyron"],
      "2011-2023": ["Chiron", "Divo", "Centodieci"],
    },
    "Aston Martin": {
      "1996-2000": ["DB7", "Vantage"],
      "2001-2010": ["DB9", "V8 Vantage", "DBS", "One-77"],
      "2011-2023": ["Rapide", "Vanquish", "DB11", "Valkyrie", "DBX"],
    },
    Lotus: {
      "1996-2000": ["Elise", "Esprit"],
      "2001-2010": ["Exige", "Europa"],
      "2011-2023": ["Evora", "Evija"],
    },
    Pagani: {
      "1996-2000": ["Zonda C12"],
      "2001-2010": ["Zonda S", "Zonda F"],
      "2011-2023": ["Huayra", "Zonda Revolución", "Huayra Roadster", "Huayra BC"],
    },
    Koenigsegg: {
      "1996-2000": ["CC8S"],
      "2001-2010": ["CCR", "CCX"],
      "2011-2023": ["Agera", "One:1", "Regera"],
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