import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '@/lib/firebaseOperations';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AuthForm = ({ isLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(data.email, data.password);
        toast.success("Logged in successfully");
      } else {
        await signUpWithEmail(data.email, data.password);
        toast.success("Account created successfully");
      }
      navigate('/garage');
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Logged in with Google successfully");
      navigate('/garage');
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
