import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80 text-foreground"
    >
      <motion.h1 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="text-4xl md:text-6xl font-bold mb-4 text-primary"
      >
        Welcome to Auto Vision V2
      </motion.h1>
      <motion.p 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl md:text-2xl mb-8 text-muted-foreground"
      >
        Your smart automotive companion
      </motion.p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
      >
        <Button onClick={() => navigate("/signup")} size="lg" className="text-lg">
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Index;
