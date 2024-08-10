import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (email, password) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        isPro: false,
        queryCount: 5 // Starting with 5 free queries
      });
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 bg-card rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Sign Up</h1>
        <AuthForm isLogin={false} setIsLoading={setIsLoading} onSubmit={handleSignup} />
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <p className="mt-4 text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
