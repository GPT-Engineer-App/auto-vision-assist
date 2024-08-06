import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Layout from "./layouts/navbar";
import { navItems } from "./nav-items";
import UserProfile from "./components/UserProfile";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import RangeFinder from "./pages/RangeFinder";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Reset isPro when user signs out
      if (!currentUser) {
        setIsPro(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route element={<Layout user={user} isPro={isPro} setIsPro={setIsPro} />}>
                  {navItems.map((item) => (
                    <Route 
                      key={item.to} 
                      path={item.to} 
                      element={
                        <ProtectedRoute>
                          {React.cloneElement(item.page, { isPro, setIsPro, user })}
                        </ProtectedRoute>
                      }
                    />
                  ))}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <UserProfile isPro={isPro} setIsPro={setIsPro} user={user} />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/range-finder/:dtc" 
                    element={
                      <ProtectedRoute>
                        <RangeFinder isPro={isPro} />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
              </Routes>
            </AnimatePresence>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
