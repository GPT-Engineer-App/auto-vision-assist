import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/navbar";
import { navItems } from "./nav-items";
import UserProfile from "./components/UserProfile";
import RangeFinder from "./pages/RangeFinder";
import { useAuth } from "./contexts/AuthContext";
import { useProStatus } from "./contexts/ProStatusContext";
import Index from "./pages/Index";

const AppRoutes = () => {
  const { user } = useAuth();
  const { isPro } = useProStatus();

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        {navItems.map((item) => (
          item.to !== "/" && (
            <Route 
              key={item.to} 
              path={item.to} 
              element={
                <ProtectedRoute>
                  {React.cloneElement(item.page, { isPro, user })}
                </ProtectedRoute>
              }
            />
          )
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
