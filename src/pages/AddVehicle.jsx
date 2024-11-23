import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import VehicleForm from "@/components/vehicle-form/VehicleForm";

const AddVehicle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to add a vehicle");
      return;
    }

    setIsLoading(true);
    try {
      const vehiclesRef = collection(db, "vehicles");
      await addDoc(vehiclesRef, {
        userId: auth.currentUser.uid,
        ...formData,
        createdAt: new Date(),
      });
      toast.success("Vehicle added successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      if (error.code === "permission-denied") {
        toast.error("Permission denied. Please make sure you're logged in and try again.");
      } else {
        toast.error("Error adding vehicle: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6">Add a New Vehicle</h1>
      <VehicleForm onSubmit={handleSubmit} isLoading={isLoading} />
    </motion.div>
  );
};

export default AddVehicle;