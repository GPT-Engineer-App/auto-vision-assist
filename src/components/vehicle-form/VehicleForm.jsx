import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VehicleSelect from './VehicleSelect';
import { fetchAllMakes, fetchModelsForMake, fetchEngineSizesForMakeAndModel } from '@/lib/vehicleApi';

const drivetrains = ['FWD', 'RWD', 'AWD', '4WD'].map(value => ({ value, label: value }));
const bodyConfigurations = ['Sedan', 'Coupe', 'Hatchback', 'Convertible', 'Van', 'SUV', 'Truck']
  .map(value => ({ value: value.toLowerCase(), label: value }));
const fuelTypes = ['Gas', 'Diesel', 'Electric', 'Hybrid']
  .map(value => ({ value: value.toLowerCase(), label: value }));

const VehicleForm = ({ onSubmit, isLoading }) => {
  const [years] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  });
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [engineSizes, setEngineSizes] = useState([]);
  
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    engineSize: '',
    drivetrain: '',
    bodyConfig: '',
    fuelType: '',
    mileage: '',
  });

  useEffect(() => {
    fetchAllMakes().then(setMakes);
  }, []);

  useEffect(() => {
    if (formData.make && formData.year) {
      fetchModelsForMake(formData.make, formData.year).then(setModels);
    }
  }, [formData.make, formData.year]);

  useEffect(() => {
    if (formData.make && formData.model && formData.year) {
      fetchEngineSizesForMakeAndModel(formData.year, formData.make, formData.model)
        .then(setEngineSizes);
    }
  }, [formData.make, formData.model, formData.year]);

  const handleChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <VehicleSelect
        label="Year"
        value={formData.year}
        onValueChange={handleChange('year')}
        options={years}
      />
      <VehicleSelect
        label="Make"
        value={formData.make}
        onValueChange={handleChange('make')}
        options={makes}
      />
      <VehicleSelect
        label="Model"
        value={formData.model}
        onValueChange={handleChange('model')}
        options={models}
      />
      <VehicleSelect
        label="Engine Size"
        value={formData.engineSize}
        onValueChange={handleChange('engineSize')}
        options={engineSizes}
      />
      <VehicleSelect
        label="Drivetrain"
        value={formData.drivetrain}
        onValueChange={handleChange('drivetrain')}
        options={drivetrains}
      />
      <VehicleSelect
        label="Body Configuration"
        value={formData.bodyConfig}
        onValueChange={handleChange('bodyConfig')}
        options={bodyConfigurations}
      />
      <VehicleSelect
        label="Fuel Type"
        value={formData.fuelType}
        onValueChange={handleChange('fuelType')}
        options={fuelTypes}
      />
      <div className="space-y-2">
        <Label htmlFor="mileage">Mileage</Label>
        <Input
          id="mileage"
          type="number"
          value={formData.mileage}
          onChange={(e) => handleChange('mileage')(e.target.value)}
          placeholder="Enter vehicle mileage"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary/90 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Adding Vehicle..." : "Add Vehicle"}
      </button>
    </form>
  );
};

export default VehicleForm;