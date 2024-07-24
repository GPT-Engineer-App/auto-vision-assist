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
    <div className="relative flex flex-col min-h-screen bg-black justify-between overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <HolographicCarBackground />
      <div className="flex-grow z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-end overflow-hidden rounded-xl sm:min-h-screen">
            <div className="flex p-4">
              <p className="text-[#ff6600] tracking-light text-[28px] font-bold leading-tight">Auto Vision V2</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="form-input w-full rounded-xl text-[#ff6600] border border-[#ff6600] bg-black/50 focus:border-[#ff6600] h-14 placeholder:text-[#ff6600] p-[15px] text-base font-normal leading-normal"
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
              className="form-input w-full rounded-xl text-[#ff6600] border border-[#ff6600] bg-black/50 focus:border-[#ff6600] h-14 placeholder:text-[#ff6600] p-[15px] text-base font-normal leading-normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="flex justify-center">
              <div className="flex flex-col items-stretch w-full max-w-md space-y-3">
                <Button type="submit" className="flex items-center justify-center rounded-full h-12 px-5 bg-[#ff6600] text-black text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#ff8533]">
                  <span className="truncate">Login</span>
                </Button>
                <Link to="/signup">
                  <Button variant="secondary" className="flex items-center justify-center rounded-full h-12 px-5 bg-black text-[#ff6600] border border-[#ff6600] text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#ff6600] hover:text-black">
                    <span className="truncate">Sign Up</span>
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <footer className="border-t border-[#ff6600] bg-black/50 p-4 text-center text-[#ff6600] z-10">
        {/* Footer content can be added here if needed */}
      </footer>
    </div>
  );
};

export default Index;