import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import CarWireframe from "@/components/CarWireframe";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      toast.success("Account created successfully");
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
            <h1 className="text-[#ff6600] text-3xl sm:text-4xl font-bold mb-2">Sign Up</h1>
            <p className="text-gray-400">Join Auto Vision V2 today</p>
          </div>
          <form onSubmit={handleSignup} className="bg-black/50 p-6 rounded-xl border border-[#ff6600] space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#ff6600]">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800 text-white border-[#ff6600] focus:border-[#ff8533]"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#ff6600]">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 text-white border-[#ff6600] focus:border-[#ff8533]"
              />
            </div>
            <Button type="submit" className="w-full bg-[#ff6600] hover:bg-[#ff8533] text-white">
              Sign Up
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#ff6600] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <footer className="border-t border-[#ff6600] bg-black/50 p-4 text-center text-[#ff6600] z-10">
        <p>&copy; 2024 Auto Vision V2. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Signup;