import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import CarWireframe from "@/components/CarWireframe";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      // Redirect to home page or dashboard
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black justify-between overflow-x-hidden">
      <CarWireframe />
      <div className="flex-grow z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-[#ff6600] text-3xl sm:text-4xl font-bold mb-2">Log In</h1>
            <p className="text-gray-400">Welcome back to Auto Vision V2</p>
          </div>
          <form onSubmit={handleLogin} className="bg-black/50 p-6 rounded-xl border border-[#ff6600] space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#ff6600]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 text-white border-[#ff6600] focus:border-[#ff8533]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#ff6600]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 text-white border-[#ff6600] focus:border-[#ff8533]"
              />
            </div>
            <Button type="submit" className="w-full bg-[#ff6600] hover:bg-[#ff8533] text-white">
              Log In
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#ff6600] hover:underline">
                Sign up
              </Link>
            </p>
            <Link to="/forgot-password" className="text-[#ff6600] hover:underline block">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
      <footer className="border-t border-[#ff6600] bg-black/50 p-4 text-center text-[#ff6600] z-10">
        <p>&copy; 2024 Auto Vision V2. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;