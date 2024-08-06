import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">Welcome to Auto Vision V2</h1>
      <p className="text-xl mb-8">Your smart automotive companion</p>
      <Button onClick={() => navigate("/signup")}>Get Started</Button>
    </div>
  );
};

export default Index;
