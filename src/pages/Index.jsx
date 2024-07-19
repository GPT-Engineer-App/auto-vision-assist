import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

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
    <div className="relative flex flex-col min-h-screen bg-background justify-between overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-muted rounded-xl sm:min-h-screen" 
            style={{
              backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/sdxl10/b72f9abd-5a1e-4f9e-b281-bb88e55e4d29.png")',
            }}
          >
            <div className="flex p-4">
              <p className="text-white tracking-light text-[28px] font-bold leading-tight">Auto Vision V2</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="form-input w-full rounded-xl text-[#201109] border border-[#eed3c4] bg-[#faf3ef] focus:border-[#eed3c4] h-14 placeholder:text-[#ae6032] p-[15px] text-base font-normal leading-normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="form-input w-full rounded-xl text-[#201109] border border-[#eed3c4] bg-[#faf3ef] focus:border-[#eed3c4] h-14 placeholder:text-[#ae6032] p-[15px] text-base font-normal leading-normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-center">
              <div className="flex flex-col items-stretch w-full max-w-md space-y-3">
                <Button type="submit" className="flex items-center justify-center rounded-full h-12 px-5 bg-[#da560a] text-[#faf3ef] text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#c14d09]">
                  <span className="truncate">Login</span>
                </Button>
                <Link to="/signup">
                  <Button variant="secondary" className="flex items-center justify-center rounded-full h-12 px-5 bg-[#f5e5db] text-[#201109] text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#eed3c4]">
                    <span className="truncate">Sign Up</span>
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <footer className="border-t border-[#f5e5db] bg-muted p-4 text-center">
        {/* Footer content can be added here if needed */}
      </footer>
    </div>
  );
};

export default Index;