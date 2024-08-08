import { Home, UserPlus, Car, Wrench, FileCode2, User, Compass } from "lucide-react";
import { lazy } from "react";

const Index = lazy(() => import("./pages/Index.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const AddVehicle = lazy(() => import("./pages/AddVehicle.jsx"));
const GaragePage = lazy(() => import("./pages/Garage.jsx"));
const DTCCodes = lazy(() => import("./pages/DTCCodes.jsx"));
const UserProfile = lazy(() => import("./components/UserProfile.jsx"));
const RangeFinder = lazy(() => import("./pages/RangeFinder.jsx"));

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
