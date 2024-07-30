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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow z-10 flex items-center justify-center"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-primary text-3xl sm:text-4xl font-bold mb-2">Auto Vision V2</h1>
            <p className="text-muted-foreground">Your smart automotive companion</p>
          </div>
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
        </div>
      </motion.div>
      {/* Render the footer */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="border-t border-border bg-background/50 p-4 text-center text-muted-foreground z-10"
      >
        <p>&copy; 2024 Auto Vision V2. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default Index;
