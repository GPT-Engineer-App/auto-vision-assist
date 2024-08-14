import { toast } from "sonner";

const NHTSA_API_BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

const MANUFACTURERS = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Buick", "Cadillac", "Chevrolet",
  "Chrysler", "Daewoo", "Dodge", "Ferrari", "Fiat", "Ford", "GMC", "Honda", "Hummer", "Hyundai", "Infiniti",
  "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", "Mazda", "Mercedes-Benz",
  "Mercury", "Mini", "Mitsubishi", "Nissan", "Oldsmobile", "Plymouth", "Pontiac", "Porsche", "Ram", "Rolls-Royce",
  "Saab", "Saturn", "Scion", "Smart", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
].sort();

const handleApiResponse = async (response) => {
  if (!response.ok) {
    throw new Error('API request failed');
  }
  const data = await response.json();
  return data.Results;
};

export const fetchAllMakes = async () => {
  return MANUFACTURERS;
};

export const fetchModelsForMake = async (make, year) => {
  try {
    const response = await fetch(`${NHTSA_API_BASE_URL}/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`);
    const results = await handleApiResponse(response);
    return Array.from(new Set(results.map(model => model.Model_Name))).sort();
  } catch (error) {
    console.error('Error fetching models:', error);
    toast.error('Failed to fetch vehicle models. Please try again.');
    throw error;
  }
};

export const fetchEngineSizesForMakeAndModel = async (year, make, model) => {
  try {
    const response = await fetch(`${NHTSA_API_BASE_URL}/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`);
    const results = await handleApiResponse(response);
    const modelData = results.filter(m => m.Model_Name === model);
    const engineSizes = modelData.map(m => m.DisplacementL).filter(Boolean);
    return Array.from(new Set(engineSizes)).map(size => size.toFixed(1) + 'L').sort();
  } catch (error) {
    console.error('Error fetching engine sizes:', error);
    toast.error('Failed to fetch engine sizes. Please try again.');
    throw error;
  }
};

export const decodeVin = async (vin) => {
  try {
    const response = await fetch(`${NHTSA_API_BASE_URL}/vehicles/decodevin/${vin}?format=json`);
    const results = await handleApiResponse(response);
    const engineSize = results.find(item => item.Variable === 'Displacement (L)')?.Value;
    const drivetrain = results.find(item => item.Variable === 'Drive Type')?.Value;
    return {
      engineSize: engineSize ? `${engineSize}L` : null,
      drivetrain: drivetrain || null,
    };
  } catch (error) {
    console.error('Error decoding VIN:', error);
    toast.error('Failed to decode VIN. Please try again.');
    throw error;
  }
};