import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Garage Manager</h1>
      <p className="text-xl mb-8">Manage your vehicles with ease and style.</p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/login">Log In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;