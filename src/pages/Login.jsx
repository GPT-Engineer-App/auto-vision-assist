import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-orange-500">Log In</h1>
      <div className="w-full max-w-md">
        <AuthForm isLogin={true} />
      </div>
      <p className="mt-4 text-gray-300">
        Don't have an account?{" "}
        <Link to="/signup" className="text-orange-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;