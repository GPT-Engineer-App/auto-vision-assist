import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/navbar";
import { navItems } from "./nav-items";
import { useAuth } from "./contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Signup = lazy(() => import("./pages/Signup"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const RangeFinder = lazy(() => import("./pages/RangeFinder"));

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Suspense fallback={<div>Loading...</div>}><Index /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<div>Loading...</div>}><Signup /></Suspense>} />
        {navItems.map((item) => (
          <Route 
            key={item.to} 
            path={item.to} 
            element={
              item.to === "/" || item.to === "/signup" ? (
                <Suspense fallback={<div>Loading...</div>}>{item.page}</Suspense>
              ) : (
                <ProtectedRoute>
                  <Suspense fallback={<div>Loading...</div>}>{item.page}</Suspense>
                </ProtectedRoute>
              )
            }
          />
        ))}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}><UserProfile /></Suspense>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/range-finder/:dtc" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}><RangeFinder /></Suspense>
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
