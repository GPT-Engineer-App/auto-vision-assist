import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProStatusProvider } from "./contexts/ProStatusContext";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/navbar";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import AddVehicle from "./pages/AddVehicle";
import Garage from "./pages/Garage";
import DTCCodes from "./pages/DTCCodes";
import RangeFinder from "./pages/RangeFinder";
import UserProfile from "./components/UserProfile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <ProStatusProvider>
              <TooltipProvider>
                <Toaster />
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/add-vehicle" element={<AddVehicle />} />
                    <Route path="/garage" element={<Garage />} />
                    <Route path="/dtc-codes" element={<DTCCodes />} />
                    <Route path="/range-finder" element={<RangeFinder />} />
                    <Route path="/range-finder/:dtc" element={<RangeFinder />} />
                    <Route path="/profile" element={<UserProfile />} />
                  </Route>
                </Routes>
              </TooltipProvider>
            </ProStatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
