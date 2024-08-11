import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProStatusProvider } from "./contexts/ProStatusContext";
import AppRoutes from "./AppRoutes";
import { Suspense, useEffect, useState } from "react";
import ErrorBoundary from './components/ErrorBoundary';
import { auth } from './lib/firebase';

const queryClient = new QueryClient();

const App = () => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setFirebaseInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  if (!firebaseInitialized) {
    return <div>Loading...</div>;
  }

const App = () => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setFirebaseInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  if (!firebaseInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <ProStatusProvider>
              <TooltipProvider>
                <Toaster />
                <ErrorBoundary>
                  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <AppRoutes />
                  </Suspense>
                </ErrorBoundary>
              </TooltipProvider>
            </ProStatusProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
