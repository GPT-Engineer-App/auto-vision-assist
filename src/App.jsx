import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProStatusProvider } from "./contexts/ProStatusContext";
import AppRoutes from "./AppRoutes";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient();

const ErrorFallback = ({ error }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
      <pre className="text-red-500">{error.message}</pre>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <ProStatusProvider>
              <TooltipProvider>
                <Toaster />
                <Router>
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <AppRoutes />
                  </Suspense>
                </Router>
              </TooltipProvider>
            </ProStatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
