import AddVehicleForm from "@/components/AddVehicleForm";

const AddVehicle = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Vehicle</h1>
      <div className="w-full max-w-md">
        <AddVehicleForm />
      </div>
    </div>
  );
};

export default AddVehicle;