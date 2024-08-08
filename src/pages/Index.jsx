import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGarageNavigation = () => {
    setIsLoading(true);
    navigate("/garage");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 text-foreground p-4"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary text-center">
        Welcome to Auto Vision V2
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-muted-foreground text-center">
        Your smart automotive companion
      </p>
      {user ? (
        <div>
          <Button onClick={handleGarageNavigation} size="lg" className="text-lg" disabled={isLoading}>
            {isLoading ? "Loading..." : "Go to Garage"}
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
    </motion.div>
  );
};

export default Index;
