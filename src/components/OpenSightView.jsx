import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateOpenSightAnalysis } from "@/lib/openai";
import { toast } from "sonner";
import ProbabilityGauge from "./ProbabilityGauge";

const OpenSightView = ({ vehicleId, onClose }) => {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      const docRef = doc(db, "vehicles", vehicleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Vehicle not found");
      }
    },
  });

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter symptoms before analyzing.");
      return;
    }

    try {
      const result = await generateOpenSightAnalysis(vehicle, symptoms);
      const parsedResult = parseAnalysisResult(result);
      setAnalysis(parsedResult);
    } catch (error) {
      console.error("Error generating Open Sight analysis:", error);
      toast.error("Failed to generate analysis. Please try again.");
    }
  };

  const parseAnalysisResult = (result) => {
    // This is a simple parser. You might need to adjust it based on the actual format of the OpenAI response.
    const components = result.match(/(\w+(\s+\w+)*): (\d+)%/g) || [];
    return components.map(component => {
      const [name, probability] = component.split(': ');
      return { name, probability: parseInt(probability) };
    });
  };

  if (isLoading) return <div>Loading vehicle information...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Open Sight Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Vehicle Information</h3>
            <p>{vehicle.year} {vehicle.make} {vehicle.model}</p>
            <p>Engine: {vehicle.engineSize}</p>
            <p>Drivetrain: {vehicle.drivetrain}</p>
          </div>
          <div>
            <h3 className="font-semibold">Enter Symptoms</h3>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe the symptoms or issues you're experiencing..."
              rows={4}
            />
          </div>
          <Button onClick={handleAnalyze}>Analyze</Button>
          {analysis && (
            <div>
              <h3 className="font-semibold">Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.map((component, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <h4 className="font-medium">{component.name}</h4>
                    <ProbabilityGauge probability={component.probability} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenSightView;