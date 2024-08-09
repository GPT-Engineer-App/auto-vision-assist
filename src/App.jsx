import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProStatusProvider } from "./contexts/ProStatusContext";
import AppRoutes from "./AppRoutes";
import { Suspense } from "react";

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
                <Suspense fallback={<div>Loading...</div>}>
                  <AppRoutes />
                </Suspense>
              </TooltipProvider>
            </ProStatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
