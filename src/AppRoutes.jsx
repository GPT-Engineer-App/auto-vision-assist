import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/navbar";
import { useAuth } from "./contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Signup = lazy(() => import("./pages/Signup"));
const AddVehicle = lazy(() => import("./pages/AddVehicle"));
const Garage = lazy(() => import("./pages/Garage"));
const DTCCodes = lazy(() => import("./pages/DTCCodes"));
const RangeFinder = lazy(() => import("./pages/RangeFinder"));
const UserProfile = lazy(() => import("./components/UserProfile"));

const AppRoutes = () => {
  const { user, loading } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
        <Route path="/garage" element={<ProtectedRoute><Garage /></ProtectedRoute>} />
        <Route path="/dtc-codes" element={<ProtectedRoute><DTCCodes /></ProtectedRoute>} />
        <Route path="/range-finder" element={<ProtectedRoute><RangeFinder /></ProtectedRoute>} />
        <Route path="/range-finder/:dtc" element={<ProtectedRoute><RangeFinder /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
