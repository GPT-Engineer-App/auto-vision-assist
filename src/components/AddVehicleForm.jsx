import { useState } from 'react';
import { Label, Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from './select-components';

const vehicleOptions = {
  drivetrain: [
    { value: 'FWD', label: 'Front-Wheel Drive' },
    { value: 'RWD', label: 'Rear-Wheel Drive' },
    { value: 'AWD', label: 'All-Wheel Drive' },
    { value: '4WD', label: 'Four-Wheel Drive' },
  ],
  bodyConfig: [
    { value: 'sedan', label: 'Sedan' },
    { value: 'coupe', label: 'Coupe' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
  ],
};

const SelectField = ({ id, value, onChange, options }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</Label>
    <Select value={value} onChange={onChange} required>
      <SelectTrigger id={id}>
        <SelectValue placeholder={`Select ${id}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const MyForm = () => {
  const [drivetrain, setDrivetrain] = useState('');
  const [bodyConfig, setBodyConfig] = useState('');

  return (
    <div>
      <SelectField id="drivetrain" value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)} options={vehicleOptions.drivetrain} />
      <SelectField id="bodyConfig" value={bodyConfig} onChange={(e) => setBodyConfig(e.target.value)} options={vehicleOptions.bodyConfig} />
    </div>
  );
};

export default MyForm;