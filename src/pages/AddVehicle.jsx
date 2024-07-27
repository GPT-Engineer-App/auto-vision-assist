import React, { useState, useEffect } from "react";
import AddVehicleForm from "@/components/AddVehicleForm";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

const AddVehicle = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        toast.error("You must be logged in to add a vehicle");
        navigate("/");
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center" style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("/images/add-vehicle-background.png")'}}>
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add a New Vehicle</h1>
        <div className="w-full max-w-md">
          <AddVehicleForm />
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;