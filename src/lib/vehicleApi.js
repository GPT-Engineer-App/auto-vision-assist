const apiUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles/';

const getVehicleOptions = async (endpoint, params = {}) => {
  const url = new URL(`${apiUrl}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  const response = await fetch(url);
  const data = await response.json();
  return data.Results;
};

export const getYears = () => getVehicleOptions('GetVehicleVariableValuesList/15?format=json');
export const getMakes = (year) => getVehicleOptions('GetMakesForVehicle', { year, format: 'json' });
export const getModels = (make, year) => getVehicleOptions('GetModelsForMakeYear', { make, year, format: 'json' });

// The rest of the existing code in vehicleApi.js remains unchanged