import { Home, UserPlus, Car, Wrench, FileCode2, User, Compass } from "lucide-react";
import Index from "./pages/Index.jsx";
import Signup from "./components/Signup.jsx";
import AddVehicle from "./pages/AddVehicle.jsx";
import GaragePage from "./pages/Garage.jsx";
import DTCCodes from "./pages/DTCCodes.jsx";
import UserProfile from "./components/UserProfile.jsx";
import RangeFinder from "./pages/RangeFinder.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Sign Up",
    to: "/signup",
    icon: <UserPlus className="h-4 w-4" />,
    page: <Signup />,
  },
  {
    title: "Add Vehicle",
    to: "/add-vehicle",
    icon: <Car className="h-4 w-4" />,
    page: <AddVehicle />,
  },
  {
    title: "Garage",
    to: "/garage",
    icon: <Wrench className="h-4 w-4" />,
    page: <GaragePage />,
  },
  {
    title: "DTC Codes",
    to: "/dtc-codes",
    icon: <FileCode2 className="h-4 w-4" />,
    page: <DTCCodes />,
  },
  {
    title: "Range Finder",
    to: "/range-finder",
    icon: <Compass className="h-4 w-4" />,
    page: <RangeFinder />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <UserProfile />,
  },
];
