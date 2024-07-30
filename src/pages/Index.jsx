import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import HolographicCarBackground from "@/components/HolographicCarBackground";
import AuthForm from "@/components/AuthForm";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/garage");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="relative flex flex-col min-h-screen bg-background justify-between overflow-x-hidden">
      {/* Render the HolographicCarBackground component */}
      <HolographicCarBackground />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-card p-6 rounded-xl border border-border shadow-lg"
      >
        <AuthForm isLogin={isLogin} />
        <p className="mt-4 text-center text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-primary">
            {isLogin ? "Sign Up" : "Log In"}
          </Button>
        </p>
      </motion.div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute bottom-4 right-4">
              <HelpCircle className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Need help? Click here for assistance</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Render the footer */}
      <footer className="text-center text-muted-foreground">
        {/* Footer content goes here */}
      </footer>
    </div>
  );
};

export default Index;
