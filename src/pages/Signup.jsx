import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import CarWireframe from "@/components/CarWireframe";

const Signup = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black justify-between overflow-x-hidden">
      <CarWireframe />
      <div className="flex-grow z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-[#ff6600] text-3xl sm:text-4xl font-bold mb-2">Sign Up</h1>
            <p className="text-gray-400">Join Auto Vision V2 today</p>
          </div>
          <div className="bg-black/50 p-6 rounded-xl border border-[#ff6600]">
            <AuthForm isLogin={false} />
            <p className="mt-4 text-center text-gray-400">
              Already have an account?{" "}
              <Link to="/" className="text-[#ff6600] hover:underline">
                Log in
              </Link>
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

export default Signup;