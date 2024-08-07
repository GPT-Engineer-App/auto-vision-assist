import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db, signInWithGoogle } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("free");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [networkError, setNetworkError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkNetworkConnection = () => {
      setNetworkError(!navigator.onLine);
    };

    window.addEventListener('online', checkNetworkConnection);
    window.addEventListener('offline', checkNetworkConnection);

    return () => {
      window.removeEventListener('online', checkNetworkConnection);
      window.removeEventListener('offline', checkNetworkConnection);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNetworkError(false);
    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network and try again.");
      }

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
      if (error.code === "auth/network-request-failed") {
        setNetworkError(true);
        toast.error("Network error. Please check your internet connection and try again.");
      } else {
        toast.error(error.message || "An error occurred during authentication. Please try again.");
      }
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
    <>
      {networkError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Network Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the server. Please check your internet connection and try again.
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (form content) */}
      </form>
    </>
  );
};

export default AuthForm;
```
