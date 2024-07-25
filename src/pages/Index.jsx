import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import HolographicCarBackground from "@/components/HolographicCarBackground";
import AuthForm from "@/components/AuthForm";

const Index = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col min-h-screen bg-black justify-between overflow-x-hidden">
      <HolographicCarBackground />
      <div className="flex-grow z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-[#ff6600] text-3xl sm:text-4xl font-bold mb-2">Auto Vision V2</h1>
            <p className="text-gray-400">Your smart automotive companion</p>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-[#ff6600]">
            <AuthForm isLogin={isLogin} />
            <p className="mt-4 text-center text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-[#ff6600]">
                {isLogin ? "Sign Up" : "Log In"}
              </Button>
            </p>
          </div>
        </div>
      </div>
      <footer className="border-t border-[#ff6600] bg-black/50 p-4 text-center text-[#ff6600] z-10">
        <p>&copy; 2024 Auto Vision V2. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;