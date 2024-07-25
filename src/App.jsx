import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/navbar"; // available: clean, navbar, sidebar
import { navItems } from "./nav-items";
import UserProfile from "./components/UserProfile";

const queryClient = new QueryClient();

const App = () => {
  const [isPro, setIsPro] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {navItems.map((item) => (
                <Route 
                  key={item.to} 
                  path={item.to} 
                  element={React.cloneElement(item.page, { isPro, setIsPro })}
                />
              ))}
              <Route path="/profile" element={<UserProfile isPro={isPro} setIsPro={setIsPro} />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;