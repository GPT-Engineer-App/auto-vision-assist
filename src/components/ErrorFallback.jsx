import React from 'react';
import { Button } from "@/components/ui/button";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error("Error caught by ErrorBoundary:", error);
  
  return (
    <div role="alert" className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Oops! Something went wrong</h2>
      <pre className="text-red-600 bg-red-100 p-4 rounded mb-4 max-w-lg overflow-auto">
        {error.message}
      </pre>
      <Button onClick={resetErrorBoundary} className="bg-red-600 hover:bg-red-700 text-white">
        Try again
      </Button>
    </div>
  );
};

export default ErrorFallback;