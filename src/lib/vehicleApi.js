import axios from 'axios';

const API_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

export const fetchAllMakes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetAllMakes?format=json`);
    return response.data.Results.map(make => make.Make_Name);
  } catch (error) {
    console.error('Error fetching makes:', error);
    return [];
  }
};

export const fetchModelsForMake = async (make) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/GetModelsForMake/${make}?format=json`);
    return response.data.Results.map(model => model.Model_Name);
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

export const fetchYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 1995; i--) {
    years.push(i.toString());
  }
  return years;
};

// Note: The NHTSA API doesn't provide endpoints for engine sizes, drivetrains, and body configurations.
// For this example, we'll use mock data. In a real application, you'd need to find an appropriate API or data source.

export const fetchEngineSizes = async () => {
  // Mock data
  return ['1.4L', '1.6L', '2.0L', '2.5L', '3.0L', '3.5L', '4.0L', '5.0L'];
};

export const fetchDrivetrains = async () => {
  // Mock data
  return ['FWD', 'RWD', 'AWD', '4WD'];
};

export const fetchBodyConfigurations = async () => {
  // Mock data
  return ['Sedan', 'Coupe', 'SUV', 'Truck', 'Van', 'Hatchback'];
};