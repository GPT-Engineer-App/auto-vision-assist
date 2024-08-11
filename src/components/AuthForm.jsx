import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check for generic login credentials in development environment
      if (import.meta.env.DEV && email === "dev@example.com" && password === "devpassword") {
        console.log("Logging in with generic credentials");
        toast.success("Logged in with generic credentials");
        navigate("/garage");
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully");
      }
      navigate("/garage");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-300">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
        {isLogin ? "Log In" : "Sign Up"}
      </Button>
      {import.meta.env.DEV && (
        <p className="text-sm text-gray-500 mt-2">
          Dev login: dev@example.com / devpassword
        </p>
      )}
    </form>
  );
};

export default AuthForm;