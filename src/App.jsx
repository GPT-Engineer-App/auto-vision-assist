import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/navbar";
import { navItems } from "./nav-items";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import RangeFinder from "./pages/RangeFinder";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatePresence } from "framer-motion";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => {
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsPro(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Layout user={user} isPro={isPro} />}>
                  {navItems.map((item) => (
                    <Route 
                      key={item.to} 
                      path={item.to} 
                      element={React.cloneElement(item.page, { isPro, setIsPro, user })}
                    />
                  ))}
                  <Route path="/range-finder/:dtc" element={<RangeFinder isPro={isPro} />} />
                  <Route path="/profile" element={<Profile />} />
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