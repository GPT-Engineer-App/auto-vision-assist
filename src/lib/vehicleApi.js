import { toast } from "sonner";

const NHTSA_API_BASE_URL = 'https://vpic.nhtsa.dot.gov/api';

const handleApiResponse = async (response) => {
  if (!response.ok) {
    throw new Error('API request failed');
  }
  const data = await response.json();
  return data.Results;
};

export const fetchAllMakes = async () => {
  try {
    const response = await fetch(`${NHTSA_API_BASE_URL}/vehicles/getallmakes?format=json`);
    const results = await handleApiResponse(response);
    return results.map(make => make.Make_Name);
  } catch (error) {
    console.error('Error fetching makes:', error);
    toast.error('Failed to fetch vehicle makes. Please try again.');
    throw error;
  }
};

export const fetchModelsForMake = async (make, year) => {
  try {
    const response = await fetch(`${NHTSA_API_BASE_URL}/vehicles/getmodelsformakeyear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`);
    const results = await handleApiResponse(response);
    return results.map(model => model.Model_Name);
  } catch (error) {
    console.error('Error fetching models:', error);
    toast.error('Failed to fetch vehicle models. Please try again.');
    throw error;
  }
};

export const fetchEngineSizesForMakeAndModel = async (year, make, model) => {
  try {
    const response = await fetch(`${NHTSA_API_BASE_URL}/vehicles/getmodelsformakeyear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`);
    const results = await handleApiResponse(response);
    const modelData = results.find(m => m.Model_Name === model);
    return modelData ? [modelData.Engine] : [];
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
    const engineSize = results.find(item => item.Variable === 'Engine Model')?.Value;
    const drivetrain = results.find(item => item.Variable === 'Drive Type')?.Value;
    return {
      engines: engineSize ? [engineSize] : [],
      drivetrains: drivetrain ? [drivetrain] : [],
    };
  } catch (error) {
    console.error('Error decoding VIN:', error);
    toast.error('Failed to decode VIN. Please try again.');
    throw error;
  }
};
