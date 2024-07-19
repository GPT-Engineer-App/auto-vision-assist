import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <div className="w-full max-w-md">
        <AuthForm isLogin={false} />
      </div>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;