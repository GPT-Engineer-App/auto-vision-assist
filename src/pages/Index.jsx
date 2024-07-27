import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import HolographicCarBackground from "@/components/HolographicCarBackground";
import AuthForm from "@/components/AuthForm";
import { auth } from "@/lib/firebase";
import { Car, FileCode2, Wrench, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdPlaceholder from "@/components/AdPlaceholder";

const Index = ({ isPro }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleAddVehicle = () => {
    if (user) {
      navigate("/add-vehicle");
    } else {
      toast.error("Please log in to add a vehicle");
    }
  };

  const handleEnterSymptoms = () => {
    if (user) {
      navigate("/diagnostics");
    } else {
      toast.error("Please log in to enter symptoms or DTCs");
    }
  };

  const handleViewGarage = () => {
    if (user) {
      navigate("/garage");
    } else {
      toast.error("Please log in to view your garage");
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black">
      <HolographicCarBackground />
      <div className="flex-grow z-10 flex flex-col items-center justify-between p-4">
        <header className="w-full text-center mb-8">
          <h1 className="text-[#ff6600] text-3xl sm:text-4xl font-bold mb-2">Auto Vision V2</h1>
          <p className="text-gray-400">Welcome to your smart automotive companion</p>
        </header>

        <main className="w-full max-w-md">
          {user ? (
            <div className="space-y-4">
              <Button onClick={handleAddVehicle} className="w-full">
                <Car className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
              <Button onClick={handleEnterSymptoms} className="w-full">
                <FileCode2 className="mr-2 h-4 w-4" /> Enter Symptoms/DTCs
              </Button>
              <Button onClick={handleViewGarage} className="w-full">
                <Wrench className="mr-2 h-4 w-4" /> View Garage
              </Button>
            </div>
          ) : (
            <Card className="bg-black/50 border border-[#ff6600]">
              <CardHeader>
                <CardTitle className="text-[#ff6600]">
                  {isLogin ? "Log In" : "Sign Up"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AuthForm isLogin={isLogin} />
                <p className="mt-4 text-center text-gray-400">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-[#ff6600]">
                    {isLogin ? "Sign Up" : "Log In"}
                  </Button>
                </p>
              </CardContent>
            </Card>
          )}
        </main>

        <div className="w-full max-w-md mt-8">
          <Card className="bg-black/50 border border-[#ff6600]">
            <CardHeader>
              <CardTitle className="text-[#ff6600]">Latest Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Regular maintenance can extend your vehicle's lifespan and improve performance.</p>
            </CardContent>
          </Card>

          {!isPro && <AdPlaceholder />}

          {!isPro && (
            <Card className="mt-4 bg-black/50 border border-[#ff6600]">
              <CardHeader>
                <CardTitle className="text-[#ff6600]">Upgrade to Pro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Get unlimited diagnostics and ad-free experience!</p>
                <Button className="mt-2 w-full" onClick={() => toast.info("Redirecting to upgrade page...")}>
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <nav className="bg-black/80 border-t border-[#ff6600] p-2 z-20">
        <div className="flex justify-around">
          <Button variant="ghost" className="text-[#ff6600]" onClick={() => navigate("/")}>
            <Car className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="text-[#ff6600]" onClick={() => navigate("/garage")}>
            <Wrench className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="text-[#ff6600]" onClick={() => navigate("/diagnostics")}>
            <FileCode2 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" className="text-[#ff6600]" onClick={() => navigate("/settings")}>
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Index;