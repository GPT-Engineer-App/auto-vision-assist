import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const OpenSightModal = ({ vehicle, onClose }) => {
  const [faultyComponents, setFaultyComponents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setLoading(true);
      // Simulating an API call to fetch faulty components
      setTimeout(() => {
        const mockFaultyComponents = [
          { name: "Alternator", probability: 0.8 },
          { name: "Battery", probability: 0.6 },
          { name: "Starter Motor", probability: 0.4 },
          { name: "Fuel Pump", probability: 0.3 },
          { name: "Spark Plugs", probability: 0.2 },
        ];
        setFaultyComponents(mockFaultyComponents);
        setLoading(false);
      }, 2000);
    }
  }, [vehicle]);

  if (!vehicle) return null;

  return (
    <Dialog open={!!vehicle} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Open Sight Analysis: {vehicle.year} {vehicle.make} {vehicle.model}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-2">Likely Faulty Components:</h3>
            <ul className="space-y-2">
              {faultyComponents.map((component, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{component.name}</span>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                    {(component.probability * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
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