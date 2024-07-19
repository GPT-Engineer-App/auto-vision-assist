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
      className="relative flex size-full min-h-screen flex-col bg-[#faf3ef] justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-[#faf3ef] @[480px]:rounded-xl min-h-80"
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
      <div>
        <div className="flex gap-2 border-t border-[#f5e5db] bg-[#faf3ef] px-4 pb-3 pt-2">
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#ae6032]" to="/">
            <div className="text-[#ae6032] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
              </svg>
            </div>
            <p className="text-[#ae6032] text-xs font-medium leading-normal tracking-[0.015em]">Home</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#ae6032]" to="/garage">
            <div className="text-[#ae6032] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
              </svg>
            </div>
            <p className="text-[#ae6032] text-xs font-medium leading-normal tracking-[0.015em]">Garage</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#ae6032]" to="/dtc-codes">
            <div className="text-[#ae6032] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M116,176a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h28A8,8,0,0,1,116,176Zm60-8H148a8,8,0,0,0,0,16h28a8,8,0,0,0,0-16Zm72,48a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H32V88a8,8,0,0,1,12.8-6.4L96,120V88a8,8,0,0,1,12.8-6.4l38.74,29.05L159.1,29.74A16.08,16.08,0,0,1,174.94,16h18.12A16.08,16.08,0,0,1,208.9,29.74l15,105.13s.08.78.08,1.13v72h16A8,8,0,0,1,248,216Zm-85.86-94.4,8.53,6.4h36.11L193.06,32H174.94ZM48,208H208V144H168a8,8,0,0,1-4.8-1.6l-14.4-10.8,0,0L112,104v32a8,8,0,0,1-12.8,6.4L48,104Z"></path>
              </svg>
            </div>
            <p className="text-[#ae6032] text-xs font-medium leading-normal tracking-[0.015em]">DTC Codes</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#ae6032]" to="/add-vehicle">
            <div className="text-[#ae6032] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,85.34,128,32V208H48ZM112,112v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm-32,0v16a8,8,0,0,1-16,0V112a8,8,0,1,1,16,0Zm0,56v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Zm32,0v16a8,8,0,0,1-16,0V168a8,8,0,0,1,16,0Z"></path>
              </svg>
            </div>
            <p className="text-[#ae6032] text-xs font-medium leading-normal tracking-[0.015em]">Add Vehicle</p>
          </Link>
          <Link className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-[#201109]" to="/login">
            <div className="text-[#201109] flex h-8 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>
              </svg>
            </div>
            <p className="text-[#201109] text-xs font-medium leading-normal tracking-[0.015em]">Account</p>
          </Link>
        </div>
        <div className="h-5 bg-[#faf3ef]"></div>
      </div>
    </div>
  );
};

export default Login;