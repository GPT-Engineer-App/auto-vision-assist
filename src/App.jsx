import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import { ProStatusProvider } from "./contexts/ProStatusContext";
import Layout from "./layouts/navbar";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Garage from "./pages/Garage";
import AddVehicle from "./pages/AddVehicle";
import DTCCodes from "./pages/DTCCodes";
import RangeFinder from "./pages/RangeFinder";
import UserProfile from "./components/UserProfile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <ProStatusProvider>
            <TooltipProvider>
              <Toaster />
              <Router>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route element={<Layout />}>
                      <Route index element={<Index />} />
                      <Route path="/signup" element={<Signup isPro={isPro} setIsPro={setIsPro} />} />
                      <Route path="/garage" element={<Garage />} />
                      <Route path="/add-vehicle" element={<AddVehicle />} />
                      <Route path="/dtc-codes" element={<DTCCodes />} />
                      <Route path="/range-finder" element={<RangeFinder />} />
                      <Route path="/range-finder/:dtc" element={<RangeFinder />} />
                      <Route path="/profile" element={<UserProfile />} />
                    </Route>
                  </Routes>
                </AnimatePresence>
              </Router>
            </TooltipProvider>
          </ProStatusProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
