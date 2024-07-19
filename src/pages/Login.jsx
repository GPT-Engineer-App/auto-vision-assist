import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
    <div
      className="relative flex size-full min-h-screen flex-col bg-background justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-muted @[480px]:rounded-xl min-h-80"
              style={{
                backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/sdxl10/b72f9abd-5a1e-4f9e-b281-bb88e55e4d29.png")',
              }}
            >
              <div className="flex p-4">
                <p className="text-white tracking-light text-[28px] font-bold leading-tight">Auto Vision V2</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex justify-center space-x-4 mt-4">
          <Link to="/" className="text-[#ae6032] hover:text-[#201109]">Home</Link>
          <Link to="/garage" className="text-[#ae6032] hover:text-[#201109]">Garage</Link>
          <Link to="/dtc-codes" className="text-[#ae6032] hover:text-[#201109]">DTC Codes</Link>
          <Link to="/add-vehicle" className="text-[#ae6032] hover:text-[#201109]">Add Vehicle</Link>
          <Link to="/login" className="text-[#ae6032] hover:text-[#201109]">Account</Link>
        </nav>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201109] focus:outline-0 focus:ring-0 border border-[#eed3c4] bg-[#faf3ef] focus:border-[#eed3c4] h-14 placeholder:text-[#ae6032] p-[15px] text-base font-normal leading-normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <input
                type="password"
                placeholder="Password"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#201109] focus:outline-0 focus:ring-0 border border-[#eed3c4] bg-[#faf3ef] focus:border-[#eed3c4] h-14 placeholder:text-[#ae6032] p-[15px] text-base font-normal leading-normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
              <button
                type="submit"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#da560a] text-[#faf3ef] text-base font-bold leading-normal tracking-[0.015em] w-full"
              >
                <span className="truncate">Login</span>
              </button>
              <Link
                to="/signup"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#f5e5db] text-[#201109] text-base font-bold leading-normal tracking-[0.015em] w-full"
              >
                <span className="truncate">Sign Up</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;