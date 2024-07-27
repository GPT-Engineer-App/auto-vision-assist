import React, { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/navbar"; // available: clean, navbar, sidebar
import { navItems } from "./nav-items";
import UserProfile from "./components/UserProfile";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import RangeFinder from "./pages/RangeFinder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuthStateChange = useCallback((currentUser) => {
    console.log("Auth state changed:", currentUser ? "User logged in" : "User logged out");
    setUser(currentUser);
    if (!currentUser) {
      setIsPro(false);
    }
  }, []);

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, [handleAuthStateChange]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("App visibility restored, refreshing query cache");
        queryClient.invalidateQueries();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
              <Route path="/range-finder/:dtc" element={<RangeFinder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;