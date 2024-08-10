import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { signInWithGoogle } from "@/lib/firebaseOperations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const AuthForm = ({ isLogin, setIsLoading }) => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
      userType: "free"
    }
  });
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

  const handleSubmit = async (data) => {
    setLoading(true);
    setIsLoading(true);
    setNetworkError(false);
    try {
      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network and try again.");
      }

      if (isResettingPassword) {
        await sendPasswordResetEmail(auth, data.email);
        toast.success("Password reset email sent. Check your inbox.");
        setIsResettingPassword(false);
        return;
      }

      if (!isLogin && !isStrongPassword(data.password)) {
        throw new Error("Password does not meet security standards");
      }

      const authFunction = isLogin
        ? () => signInWithEmailAndPassword(auth, data.email, data.password)
        : () => createUserWithEmailAndPassword(auth, data.email, data.password);

      const result = await authFunction();

      if (!isLogin) {
        const user = result.user;
        await setDoc(doc(db, "users", user.uid), {
          username: data.username,
          email: data.email,
          userType: data.userType,
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
      setIsLoading(false);
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
      setIsLoading(true);
      await signInWithGoogle();
      toast.success("Logged in with Google successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordReset = () => {
    setIsResettingPassword(!isResettingPassword);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
        <CardDescription>
          {isLogin ? "Enter your credentials to access your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {networkError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Network Error</AlertTitle>
            <AlertDescription>
              Unable to connect to the server. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!isLogin && (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choose a username"
                        {...field}
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {!isLogin && (
              <FormField
                name="userType"
                render={() => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={loading}>
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
