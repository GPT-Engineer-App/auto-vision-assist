import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";
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

  const toggleMenu = () => {
    // Implement the menu toggle functionality here
    console.log("Menu toggled");
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#faf3ef] justify-between overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <header className="flex justify-between items-center p-4 bg-[#faf3ef] border-b border-[#f5e5db]">
        <Button variant="ghost" className="text-[#ae6032]" aria-label="Menu" onClick={toggleMenu}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="text-[#201109] flex items-center">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>
          </svg>
        </div>
      </header>
      <div className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#faf3ef] rounded-xl sm:min-h-80" 
            style={{
              backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/sdxl10/b72f9abd-5a1e-4f9e-b281-bb88e55e4d29.png")'
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
      <footer className="border-t border-[#f5e5db] bg-[#faf3ef] p-4 text-center">
        {/* Footer content can be added here if needed */}
      </footer>
    </div>
  );
};

export default Index;