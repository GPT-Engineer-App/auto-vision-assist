import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const VehicleSelect = ({ label, value, onValueChange, options, placeholder }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={label}>
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value || option} value={option.value || option}>
              {option.label || option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VehicleSelect;