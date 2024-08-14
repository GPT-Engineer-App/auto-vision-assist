import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, updateData, deleteData, fetchVehiclesForUser } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { generateDiagnosticResponse } from "@/lib/openai";

import { useAuth } from "@/contexts/AuthContext";
import { useProStatus } from "@/contexts/ProStatusContext";

const Garage = () => {
  const { user } = useAuth();
  const { isPro } = useProStatus();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [symptomInputs, setSymptomInputs] = useState({});
  const [analysisResults, setAnalysisResults] = useState({});

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles', user?.uid],
    queryFn: () => fetchVehiclesForUser(user.uid),
    enabled: !!user,
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: (vehicleId) => deleteData("vehicles", vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles', user?.uid]);
      toast.success("Vehicle deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting vehicle:", error);
      toast.error("Error deleting vehicle: " + error.message);
    },
  });

  const handleAddVehicle = () => {
    if (!isPro && vehicles?.length >= 1) {
      toast.error("Free users can only store one vehicle. Upgrade to Pro to add more!");
    } else if (isPro && vehicles?.length >= 3) {
      toast.error("Pro users can store up to three vehicles.");
    } else {
      navigate("/add-vehicle");
    }
  };

  const handleDeleteVehicle = (vehicleId) => {
    deleteVehicleMutation.mutate(vehicleId);
  };

  const handleSymptomChange = (vehicleId, value) => {
    setSymptomInputs(prev => ({ ...prev, [vehicleId]: value }));
  };

  const handleAnalyze = async (vehicleId) => {
    const symptom = symptomInputs[vehicleId];
    if (!symptom) {
      toast.error("Please enter a symptom or DTC code");
      return;
    }

    try {
      const response = await generateDiagnosticResponse(symptom);
      setAnalysisResults(prev => ({ ...prev, [vehicleId]: response }));
      toast.success("Analysis complete");
    } catch (error) {
      console.error("Error analyzing symptom:", error);
      toast.error("Error analyzing symptom: " + error.message);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8">Error: {error.message}</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p>Please log in to view your garage.</p>
        <Button onClick={() => navigate("/")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">My Garage</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles?.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader>
              <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Mileage:</strong> {vehicle.mileage?.toLocaleString() || 'N/A'} miles</p>
              <Input
                className="mt-2"
                placeholder="Enter symptom or DTC code"
                value={symptomInputs[vehicle.id] || ''}
                onChange={(e) => handleSymptomChange(vehicle.id, e.target.value)}
              />
              {analysisResults[vehicle.id] && (
                <div className="mt-2 p-2 bg-secondary rounded">
                  <strong>Analysis:</strong> {analysisResults[vehicle.id]}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleAnalyze(vehicle.id)}>Analyze</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your vehicle from your garage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Button onClick={handleAddVehicle}>Add Vehicle</Button>
        {!isPro && vehicles?.length >= 1 && (
          <Button variant="outline" className="ml-4" onClick={() => navigate("/upgrade")}>Upgrade to Pro</Button>
        )}
      </div>
    </motion.div>
  );
};

export default Garage;