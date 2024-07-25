import { Home, UserPlus, Car, Wrench, FileCode2 } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Sign Up",
    to: "/signup",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    title: "Add Vehicle",
    to: "/add-vehicle",
    icon: <Car className="h-4 w-4" />,
  },
  {
    title: "Garage",
    to: "/garage",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    title: "DTC Codes",
    to: "/dtc-codes",
    icon: <FileCode2 className="h-4 w-4" />,
  },
];