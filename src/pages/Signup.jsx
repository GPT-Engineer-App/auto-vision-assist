import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import CarWireframe from "@/components/CarWireframe";

const Signup = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-black justify-between overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <CarWireframe />
      <div className="flex-grow z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-end overflow-hidden rounded-xl sm:min-h-screen">
            <div className="flex p-4">
              <p className="text-[#ff6600] tracking-light text-[28px] font-bold leading-tight">Auto Vision V2</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#ff6600]">Sign Up</h1>
            <div className="w-full max-w-md mx-auto">
              <AuthForm isLogin={false} />
            </div>
            <p className="mt-4 text-center text-[#ff6600]">
              Already have an account?{" "}
              <Link to="/" className="text-[#ff6600] hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <footer className="border-t border-[#ff6600] bg-black/50 p-4 text-center text-[#ff6600] z-10">
        {/* Footer content can be added here if needed */}
      </footer>
    </div>
  );
};

export default Signup;