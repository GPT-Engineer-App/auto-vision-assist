import React from 'react';
import AuthForm from './AuthForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
      <AuthForm isLogin={false} />
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link to="/" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
