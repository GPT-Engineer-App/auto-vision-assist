import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { generateOpenSightAnalysis } from "@/lib/openai";

const OpenSightModal = ({ vehicle, onClose }) => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setLoading(true);
      generateOpenSightAnalysis(vehicle)
        .then((result) => {
          setAnalysis(result);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error generating Open Sight analysis:", error);
          setAnalysis("Failed to generate analysis. Please try again.");
          setLoading(false);
        });
    }
  }, [vehicle]);

  if (!vehicle) return null;

  return (
    <Dialog open={!!vehicle} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <VisuallyHidden>
          <DialogTitle>Open Sight Analysis</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <h2 className="text-lg font-semibold">Open Sight Analysis: {vehicle.year} {vehicle.make} {vehicle.model}</h2>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="py-4">
            <p className="whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenSightModal;
