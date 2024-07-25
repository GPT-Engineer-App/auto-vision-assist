import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/navbar"; // available: clean, navbar, sidebar
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import AddVehicle from "./pages/AddVehicle";
import Garage from "./pages/Garage";
import DTCCodes from "./pages/DTCCodes";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendered"); // Add this line for debugging
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="signup" element={<Signup />} />
              <Route path="add-vehicle" element={<AddVehicle />} />
              <Route path="garage" element={<Garage />} />
              <Route path="dtc-codes" element={<DTCCodes />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;