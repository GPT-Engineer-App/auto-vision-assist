import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db, signInWithGoogle } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("free");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isResettingPassword) {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent. Check your inbox.");
        setIsResettingPassword(false);
        setLoading(false);
        return;
      }

      if (!isLogin && !isStrongPassword(password)) {
        throw new Error("Password does not meet security standards");
      }

      const authFunction = isLogin
        ? () => signInWithEmailAndPassword(auth, email, password)
        : () => createUserWithEmailAndPassword(auth, email, password);

      const result = await authFunction();

      if (!isLogin) {
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
          username,
          email,
          userType,
          createdAt: serverTimestamp(),
        });
      }

      toast.success(isLogin ? "Logged in successfully" : "Account created successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message || "An error occurred during authentication. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isStrongPassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    
    return password.length >= minLength &&
           hasNumber.test(password) &&
           hasUpperCase.test(password) &&
           hasLowerCase.test(password) &&
           hasSpecialChar.test(password);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Logged in with Google successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  const togglePasswordReset = () => {
    setIsResettingPassword(!isResettingPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && !isResettingPassword && (
        <>
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
          <div className="space-y-2">
            <Label htmlFor="userType" className="text-gray-300">User Type</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free User</SelectItem>
                <SelectItem value="paid">Paid User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
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
      {!isResettingPassword && (
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
      )}
      <Button type="submit" className="w-full bg-[#ff6600] hover:bg-[#ff8533] text-black font-bold" disabled={loading}>
        {loading ? "Processing..." : isResettingPassword ? "Reset Password" : isLogin ? "Log In" : "Sign Up"}
      </Button>
      <Button type="button" variant="link" onClick={togglePasswordReset} className="w-full text-[#ff6600]">
        {isResettingPassword ? "Back to Login" : "Forgot Password?"}
      </Button>
      <div className="mt-4">
        <Button type="button" onClick={handleGoogleSignIn} className="w-full mb-2 bg-red-600 hover:bg-red-700 text-white">
          Sign in with Google
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
