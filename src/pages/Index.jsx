import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Auto Vision V2</h1>
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-500 opacity-25 rounded-lg blur-md"></div>
            <div className="absolute inset-0 border border-orange-500 rounded-lg"></div>
            <div className="relative p-4 bg-gray-900 rounded-lg">
              <div className="bg-orange-500 rounded-lg h-64 w-full opacity-50 blur-md"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="text-white text-center">
                  <h2 className="text-xl font-semibold">Welcome to Auto Vision</h2>
                  <p>Your smart car management solution</p>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-700 text-white border-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-gray-700 text-white border-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-center space-x-4">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                Login
              </Button>
              <Link to="/signup">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </form>
          <div className="mt-8 text-white">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Vehicle Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Easily manage and track your vehicles</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Diagnostic Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Access advanced diagnostic features</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Maintenance Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Stay on top of your vehicle maintenance</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Performance Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Monitor and optimize your vehicle's performance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;