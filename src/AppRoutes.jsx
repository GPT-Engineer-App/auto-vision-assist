import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/navbar";
import { navItems } from "./nav-items";
import { useAuth } from "./contexts/AuthContext";
import { useProStatus } from "./contexts/ProStatusContext";

const Index = lazy(() => import("./pages/Index"));
const Signup = lazy(() => import("./pages/Signup"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const RangeFinder = lazy(() => import("./pages/RangeFinder"));

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { isPro } = useProStatus();

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        {navItems.map((item) => (
          <Route 
            key={item.to} 
            path={item.to} 
            element={
              item.to === "/" || item.to === "/signup" ? (
                item.page
              ) : (
                <ProtectedRoute>
                  {React.cloneElement(item.page, { isPro, user })}
                </ProtectedRoute>
              )
            }
          />
        ))}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/range-finder/:dtc" 
          element={
            <ProtectedRoute>
              <RangeFinder />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
