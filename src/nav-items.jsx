import { Car, Wrench, FileCode2, Compass } from "lucide-react";
import AddVehicle from "./pages/AddVehicle";
import GaragePage from "./pages/Garage";
import DTCCodes from "./pages/DTCCodes";
import RangeFinder from "./pages/RangeFinder";

export const navItems = [
  {
    title: "Garage",
    to: "/",
    icon: <Wrench className="h-4 w-4" />,
    page: <GaragePage />,
  },
  {
    title: "Add Vehicle",
    to: "/add-vehicle",
    icon: <Car className="h-4 w-4" />,
    page: <AddVehicle />,
  },
  {
    title: "DTC Codes",
    to: "/dtc-codes",
    icon: <FileCode2 className="h-4 w-4" />,
    page: <DTCCodes />,
  },
  {
    title: "Range Finder",
    to: "/range-finder/:dtc",
    icon: <Compass className="h-4 w-4" />,
    page: <RangeFinder />,
  },
];