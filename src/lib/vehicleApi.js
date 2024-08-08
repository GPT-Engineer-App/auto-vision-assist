// This file now contains a more comprehensive list of North American vehicle makes and models

const northAmericanMakes = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 
  'Dodge', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 
  'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini', 
  'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

const modelsByMake = {
  'Acura': ['ILX', 'TLX', 'RDX', 'MDX', 'NSX'],
  'Alfa Romeo': ['Giulia', 'Stelvio'],
  'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'e-tron'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'i3', 'i8'],
  'Buick': ['Enclave', 'Encore', 'Envision', 'Regal'],
  'Cadillac': ['CT4', 'CT5', 'XT4', 'XT5', 'Escalade'],
  'Chevrolet': ['Malibu', 'Equinox', 'Traverse', 'Silverado', 'Corvette', 'Camaro', 'Bolt'],
  'Chrysler': ['300', 'Pacifica'],
  'Dodge': ['Challenger', 'Charger', 'Durango'],
  'Fiat': ['500', '500X'],
  'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Bronco'],
  'Genesis': ['G70', 'G80', 'G90', 'GV80'],
  'GMC': ['Sierra', 'Terrain', 'Acadia', 'Yukon'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60'],
  'Jaguar': ['XE', 'XF', 'F-PACE', 'I-PACE'],
  'Jeep': ['Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator'],
  'Kia': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride'],
  'Land Rover': ['Range Rover', 'Discovery', 'Defender'],
  'Lexus': ['IS', 'ES', 'RX', 'NX', 'GX'],
  'Lincoln': ['Corsair', 'Nautilus', 'Aviator', 'Navigator'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  'Mini': ['Cooper', 'Countryman'],
  'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Mirage'],
  'Nissan': ['Altima', 'Maxima', 'Rogue', 'Murano', 'Leaf'],
  'Porsche': ['911', 'Panamera', 'Cayenne', 'Macan'],
  'Ram': ['1500', '2500', '3500', 'ProMaster'],
  'Subaru': ['Impreza', 'Outback', 'Forester', 'Ascent'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius'],
  'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas'],
  'Volvo': ['S60', 'XC40', 'XC60', 'XC90']
};

const engineSizesByMakeAndModel = {
  'Ford': {
    'F-150': ['2.7L V6', '3.3L V6', '3.5L V6', '5.0L V8'],
    'Mustang': ['2.3L I4', '5.0L V8'],
    'Explorer': ['2.3L I4', '3.0L V6', '3.3L V6'],
  },
  'Toyota': {
    'Camry': ['2.5L I4', '3.5L V6'],
    'RAV4': ['2.5L I4'],
    'Highlander': ['2.7L I4', '3.5L V6'],
  },
  'Honda': {
    'Civic': ['1.5L I4', '2.0L I4'],
    'Accord': ['1.5L I4', '2.0L I4'],
    'CR-V': ['1.5L I4', '2.0L I4'],
  },
  // Add more makes and models as needed
};

export const fetchAllMakes = async () => {
  try {
    const response = await fetch('https://api.example.com/makes');
    if (!response.ok) {
      throw new Error('Failed to fetch makes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching makes:', error);
    throw new Error('Failed to fetch vehicle makes. Please check your internet connection and try again.');
  }
};

export const fetchModelsForMake = async (make) => {
  try {
    const response = await fetch(`https://api.example.com/models?make=${encodeURIComponent(make)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    throw new Error('Failed to fetch vehicle models. Please check your internet connection and try again.');
  }
};

export const fetchEngineSizesForMakeAndModel = async (year, make, model) => {
  try {
    const response = await fetch(`https://api.example.com/engines?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch engine sizes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching engine sizes:', error);
    throw new Error('Failed to fetch engine sizes. Please check your internet connection and try again.');
  }
};

export const decodeVin = async (year, make, model) => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        engines: ['2.0L I4', '2.5L I4', '3.0L V6', '3.5L V6', '5.0L V8'],
        drivetrains: ['FWD', 'RWD', 'AWD', '4WD'],
      });
    }, 500);
  });
};
