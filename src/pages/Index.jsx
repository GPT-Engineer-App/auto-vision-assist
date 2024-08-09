import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Index = () => {
  useEffect(() => {
    const handleError = (error) => {
      console.error("Caught error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
          <Button onClick={handleGarageNavigation} size="lg" className="w-full text-lg" disabled={isLoading}>
            {isLoading ? "Loading..." : "Go to Garage"}
          </Button>
        ) : (
          <>
            <AuthForm isLogin={true} setIsLoading={setIsLoading} />
            <p className="mt-4 text-center text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" onClick={() => navigate("/signup")} className="p-0">
                Sign up
              </Button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
  } catch (error) {
    console.error("Error in Index component:", error);
    return <div>An unexpected error occurred. Please try refreshing the page.</div>;
  }
};

export default Index;
