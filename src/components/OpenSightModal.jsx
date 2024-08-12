import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OpenSightModal = ({ vehicle, onClose }) => {
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setLoading(true);
      fetchDiagnosticData(vehicle)
        .then(data => {
          setDiagnosticData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching diagnostic data:", error);
          setLoading(false);
        });
    }
  }, [vehicle]);

  if (!vehicle) return null;

  return (
    <Dialog open={!!vehicle} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Open Sight Analysis: {vehicle.year} {vehicle.make} {vehicle.model}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="py-4">
            {diagnosticData && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Diagnostic Data Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={diagnosticData.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="engineTemp" stroke="#8884d8" name="Engine Temperature" />
                        <Line type="monotone" dataKey="oilPressure" stroke="#82ca9d" name="Oil Pressure" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Component Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={diagnosticData.componentHealth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="health" fill="#8884d8" name="Health Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const fetchDiagnosticData = async (vehicle) => {
  // Simulating an API call to fetch diagnostic data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        timeSeriesData: [
          { timestamp: '00:00', engineTemp: 180, oilPressure: 40 },
          { timestamp: '00:05', engineTemp: 185, oilPressure: 42 },
          { timestamp: '00:10', engineTemp: 190, oilPressure: 41 },
          { timestamp: '00:15', engineTemp: 195, oilPressure: 43 },
          { timestamp: '00:20', engineTemp: 200, oilPressure: 44 },
        ],
        componentHealth: [
          { name: 'Engine', health: 90 },
          { name: 'Transmission', health: 85 },
          { name: 'Brakes', health: 95 },
          { name: 'Suspension', health: 88 },
          { name: 'Electrical', health: 92 },
        ],
      });
    }, 2000);
  });
};

export default OpenSightModal;
