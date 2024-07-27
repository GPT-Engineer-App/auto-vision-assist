import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/navbar"; // available: clean, navbar, sidebar
import { navItems } from "./nav-items";
import UserProfile from "./components/UserProfile";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const queryClient = new QueryClient();

const App = () => {
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Reset isPro when user signs out
      if (!currentUser) {
        setIsPro(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Layout user={user} isPro={isPro} />}>
              {navItems.map((item) => (
                <Route 
                  key={item.to} 
                  path={item.to} 
                  element={React.cloneElement(item.page, { isPro, setIsPro, user })}
                />
              ))}
              <Route path="/profile" element={<UserProfile isPro={isPro} setIsPro={setIsPro} user={user} />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;