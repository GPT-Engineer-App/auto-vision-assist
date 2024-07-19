import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <Card className="w-full max-w-md bg-gray-800 border-orange-500">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-orange-500">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthForm isLogin={true} />
          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-500 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;