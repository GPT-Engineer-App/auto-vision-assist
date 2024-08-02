import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/navbar"; // available: clean, navbar, sidebar
import { navItems } from "./nav-items";
import UserProfile from "./components/UserProfile";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import RangeFinder from "./pages/RangeFinder";
import { ThemeProvider } from "@/components/theme-provider";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => {
  const [isPro, setIsPro] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsPro(userData.isPro || false);
          } else {
            console.log("No user document found. Creating a new one.");
            // Create a new user document if it doesn't exist
            await setDoc(userDocRef, {
              email: currentUser.email,
              isPro: false,
              createdAt: new Date()
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle the error gracefully, perhaps set a default state or show an error message
        }
      } else {
        setUser(null);
        setIsPro(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router>
            <AnimatePresence mode="wait">
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
                  <Route path="/range-finder/:dtc" element={<RangeFinder isPro={isPro} />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;