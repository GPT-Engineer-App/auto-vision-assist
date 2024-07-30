import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/integrations/supabase/auth";

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        toast.success("Logged in successfully");
      } else {
        const { error } = await signUp({ email, password, options: { data: { username } } });
        if (error) throw error;
        toast.success("Account created successfully");
      }
      navigate("/garage");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
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
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="pl-10 bg-black/50 border-[#ff6600] text-[#ff6600] placeholder-[#ff6600]/50 focus:border-[#ff6600] focus:ring-[#ff6600]"
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
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="pl-10 bg-black/50 border-[#ff6600] text-[#ff6600] placeholder-[#ff6600]/50 focus:border-[#ff6600] focus:ring-[#ff6600]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="pl-10 bg-black/50 border-[#ff6600] text-[#ff6600] placeholder-[#ff6600]/50 focus:border-[#ff6600] focus:ring-[#ff6600]"
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-[#ff6600] hover:bg-[#ff8533] text-black font-bold" disabled={loading}>
        {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
      </Button>
    </form>
  );
};

export default AuthForm;