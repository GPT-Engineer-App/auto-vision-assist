import { Home, LogIn, UserPlus, Car, Wrench, FileCode2, Activity } from "lucide-react";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AddVehicle from "./pages/AddVehicle.jsx";
import GaragePage from "./pages/Garage.jsx";
import DTCCodes from "./pages/DTCCodes.jsx";
import WireframeCar from "./WireframeCar";  // Import the WireframeCar component

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Log In",
    to: "/login",
    icon: <LogIn className="h-4 w-4" />,
    page: <Login />,
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
    title: "Wireframe Car",
    to: "/wireframe-car",
    icon: <Activity className="h-4 w-4" />, // Use any suitable icon from lucide-react
    page: <WireframeCar />,  // Add the WireframeCar component as the page
  },
];
