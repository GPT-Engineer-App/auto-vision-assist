import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProStatusProvider } from "./contexts/ProStatusContext";
import Layout from "./layouts/navbar";
import { navItems } from "./nav-items";

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
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route element={<Layout />}>
                      {navItems.map((item) => (
                        <Route
                          key={item.to}
                          path={item.to}
                          element={item.page}
                        />
                      ))}
                    </Route>
                  </Routes>
                </Suspense>
              </Router>
            </TooltipProvider>
          </ProStatusProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
