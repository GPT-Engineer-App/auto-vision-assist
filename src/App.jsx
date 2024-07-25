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
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";

// Create a new QueryClient instance with cache clearing options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
    },
  },
});

const App = () => {
  console.log("App component rendered"); // Add this line for debugging

  // Clear the query cache on component mount
  React.useEffect(() => {
    queryClient.clear();
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index key={Date.now()} />} />
                <Route path="signup" element={<Signup key={Date.now()} />} />
                <Route path="add-vehicle" element={<AddVehicle key={Date.now()} />} />
                <Route path="garage" element={<Garage key={Date.now()} />} />
                <Route path="dtc-codes" element={<DTCCodes key={Date.now()} />} />
              </Route>
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;