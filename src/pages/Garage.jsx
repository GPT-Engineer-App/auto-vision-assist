import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Garage = ({ isPro, setIsPro, user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleData, setVehicleData] = useState({
    year: '',
    make: '',
    model: '',
    engineSize: '',
    drivetrain: '',
    bodyConfig: '',
    mileage: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "vehicles"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const vehicleList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVehicles(vehicleList);
      } catch (error) {
        toast.error("Error fetching vehicles: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  const handleChange = (name, value) => {
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add a vehicle");
      return;
    }

    try {
      if (vehicleData.id) {
        const vehicleRef = doc(db, "vehicles", vehicleData.id);
        await updateDoc(vehicleRef, vehicleData);
        toast.success("Vehicle updated successfully");
      } else {
        await addDoc(collection(db, "vehicles"), {
          ...vehicleData,
          userId: user.uid,
          createdAt: new Date(),
        });
        toast.success("Vehicle added successfully");
      }
      setVehicleData({
        year: '',
        make: '',
        model: '',
        engineSize: '',
        drivetrain: '',
        bodyConfig: '',
        mileage: ''
      });
      // Refresh the vehicles list
      const q = query(collection(db, "vehicles"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const updatedVehicles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVehicles(updatedVehicles);
    } catch (error) {
      toast.error("Error saving vehicle: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "vehicles", id));
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      toast.error("Error deleting vehicle: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{vehicleData.id ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="year"
              value={vehicleData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              placeholder="Year"
            />
            <Input
              name="make"
              value={vehicleData.make}
              onChange={(e) => handleChange('make', e.target.value)}
              placeholder="Make"
            />
            <Input
              name="model"
              value={vehicleData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="Model"
            />
            <Input
              name="engineSize"
              value={vehicleData.engineSize}
              onChange={(e) => handleChange('engineSize', e.target.value)}
              placeholder="Engine Size"
            />
            <Select
              name="drivetrain"
              value={vehicleData.drivetrain}
              onValueChange={(value) => handleChange('drivetrain', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Drivetrain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RWD">RWD</SelectItem>
                <SelectItem value="FWD">FWD</SelectItem>
                <SelectItem value="AWD">AWD</SelectItem>
                <SelectItem value="4WD">Four Wheel Drive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              name="bodyConfig"
              value={vehicleData.bodyConfig}
              onValueChange={(value) => handleChange('bodyConfig', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Body Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="Coupe">Coupe</SelectItem>
                <SelectItem value="Convertible">Convertible</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="mileage"
              value={vehicleData.mileage}
              onChange={(e) => handleChange('mileage', e.target.value)}
              placeholder="Mileage"
            />
            <Button type="submit">{vehicleData.id ? 'Update Vehicle' : 'Add Vehicle'}</Button>
          </form>
        </CardContent>
      </Card>
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Engine:</strong> {vehicle.engineSize}</p>
                  <p><strong>Drivetrain:</strong> {vehicle.drivetrain}</p>
                  <p><strong>Body:</strong> {vehicle.bodyConfig}</p>
                  <p><strong>Mileage:</strong> {vehicle.mileage}</p>
                  <div className="flex justify-between mt-4">
                    <Button onClick={() => setVehicleData(vehicle)} variant="outline">Edit</Button>
                    <Button onClick={() => handleDelete(vehicle.id)} variant="destructive">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Garage;