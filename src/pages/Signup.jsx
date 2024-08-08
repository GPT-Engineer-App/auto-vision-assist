import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-md"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <AuthForm isLogin={false} setIsLoading={setIsLoading} />
      )}
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </motion.div>
  );
};

export default Signup;
