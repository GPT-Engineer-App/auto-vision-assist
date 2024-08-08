import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthForm from "@/components/AuthForm";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 text-foreground">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
        Welcome to Auto Vision V2
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
        Your smart automotive companion
      </p>
      {user ? (
        <div>
          <Button onClick={() => navigate("/garage")} size="lg" className="text-lg">
            Go to Garage
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <AuthForm isLogin={true} />
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Button variant="link" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
