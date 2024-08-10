import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error("Caught error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleGarageNavigation = () => {
    setIsLoading(true);
    navigate("/garage");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md p-6 bg-card rounded-lg shadow-md"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary text-center">
          Auto Vision V2
        </h1>
        <p className="text-xl mb-8 text-muted-foreground text-center">
          Your smart automotive companion
        </p>
        {user ? (
          <>
            <Button onClick={handleGarageNavigation} size="lg" className="w-full text-lg mb-4" disabled={isLoading}>
              {isLoading ? "Loading..." : "Go to Garage"}
            </Button>
            <div className="flex justify-between">
              <Link to="/add-vehicle" className="text-primary hover:underline">Add Vehicle</Link>
              <Link to="/dtc-codes" className="text-primary hover:underline">DTC Codes</Link>
              <Link to="/range-finder" className="text-primary hover:underline">Range Finder</Link>
            </div>
          </>
        ) : (
          <>
            <AuthForm isLogin={true} setIsLoading={setIsLoading} />
            <p className="mt-4 text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
