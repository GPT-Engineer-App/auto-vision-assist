// This is a mock implementation. Replace with actual API calls in production.

export const fetchAllMakes = async () => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Audi', 'BMW', 'Ford', 'Honda', 'Toyota']);
    }, 500);
  });
};

export const fetchModelsForMake = async (make) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const models = {
        Audi: ['A3', 'A4', 'Q5'],
        BMW: ['3 Series', '5 Series', 'X5'],
        Ford: ['Fiesta', 'Focus', 'Mustang'],
        Honda: ['Civic', 'Accord', 'CR-V'],
        Toyota: ['Corolla', 'Camry', 'RAV4'],
      };
      resolve(models[make] || []);
    }, 500);
  });
};

export const decodeVin = async (year, make, model) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        engines: ['2.0L I4', '2.5L I4', '3.0L V6'],
        drivetrains: ['FWD', 'RWD', 'AWD'],
      });
    }, 500);
  });
};