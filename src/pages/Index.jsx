import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import HolographicCarBackground from "@/components/HolographicCarBackground";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black justify-between overflow-x-hidden">
      <HolographicCarBackground />
      <div className="flex-grow z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-[#ff6600] text-3xl sm:text-4xl font-bold mb-2">Auto Vision V2</h1>
            <p className="text-gray-400">Your smart automotive companion</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl text-[#ff6600] border border-[#ff6600] bg-black/50 focus:border-[#ff6600] h-12 placeholder:text-[#ff6600]/70 p-4 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="w-full rounded-xl text-[#ff6600] border border-[#ff6600] bg-black/50 focus:border-[#ff6600] h-12 placeholder:text-[#ff6600]/70 p-4 text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full rounded-full h-12 bg-[#ff6600] text-black text-base font-bold hover:bg-[#ff8533]">
              Login
            </Button>
            <Link to="/signup">
              <Button variant="outline" className="w-full rounded-full h-12 bg-transparent text-[#ff6600] border border-[#ff6600] text-base font-bold hover:bg-[#ff6600] hover:text-black">
                Sign Up
              </Button>
            </Link>
          </form>
        </div>
      </div>
      <footer className="border-t border-[#ff6600] bg-black/50 p-4 text-center text-[#ff6600] z-10">
        <p>&copy; 2024 Auto Vision V2. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;