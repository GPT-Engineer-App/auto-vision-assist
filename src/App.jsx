import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ProStatusProvider } from "./contexts/ProStatusContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <ProStatusProvider>
            <TooltipProvider>
              <Toaster />
              <Router>
                <AnimatePresence mode="wait">
                  <AppRoutes />
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
