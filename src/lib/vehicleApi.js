import { toast } from "sonner";

const MANUFACTURERS = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Buick", "Cadillac", "Chevrolet",
  "Chrysler", "Daewoo", "Dodge", "Ferrari", "Fiat", "Ford", "GMC", "Honda", "Hummer", "Hyundai", "Infiniti",
  "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", "Mazda", "Mercedes-Benz",
  "Mercury", "Mini", "Mitsubishi", "Nissan", "Oldsmobile", "Plymouth", "Pontiac", "Porsche", "Ram", "Rolls-Royce",
  "Saab", "Saturn", "Scion", "Smart", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
].sort();

const TRUCK_MODELS = {
  Dodge: {
    "Ram 1500": {
      "1996-2001": ["3.9L V6", "5.2L V8", "5.9L V8"],
      "2002-2008": ["3.7L V6", "4.7L V8", "5.7L V8", "5.9L I6 Turbo Diesel"],
      "2009-2018": ["3.7L V6", "4.7L V8", "5.7L V8"]
    },
    "Ram 2500": {
      "1996-2001": ["5.2L V8", "5.9L V8", "8.0L V10", "5.9L I6 Turbo Diesel"],
      "2002-2008": ["3.7L V6", "4.7L V8", "5.7L V8", "5.9L I6 Turbo Diesel"],
      "2009-2018": ["5.7L V8", "6.7L I6 Turbo Diesel"]
    },
    "Ram 3500": {
      "1996-2001": ["5.9L V8", "8.0L V10", "5.9L I6 Turbo Diesel"],
      "2002-2008": ["4.7L V8", "5.7L V8", "5.9L I6 Turbo Diesel"],
      "2009-2018": ["5.7L V8", "6.7L I6 Turbo Diesel"]
    },
    "Dakota": {
      "1996-2004": ["2.5L I4", "3.9L V6", "5.2L V8", "5.9L V8"],
      "2005-2011": ["3.7L V6", "4.7L V8", "5.7L V8"]
    }
  },
  Ford: {
    "F-150": {
      "1996-2023": ["4.2L V6", "4.6L V8", "5.4L V8", "3.5L V6 EcoBoost", "2.7L V6 EcoBoost", "5.0L V8"]
    },
    "F-250": {
      "1996-2003": ["4.6L V8", "5.4L V8", "6.8L V10", "7.3L V8 Power Stroke Diesel"],
      "2004-2008": ["4.6L V8", "5.4L V8", "6.8L V10", "6.0L V8 Power Stroke Diesel"],
      "2009-2023": ["4.6L V8", "5.4L V8", "6.8L V10", "6.7L V8 Power Stroke Diesel"]
    },
    "F-350": {
      "1996-2003": ["4.6L V8", "5.4L V8", "6.8L V10", "7.3L V8 Power Stroke Diesel"],
      "2004-2008": ["4.6L V8", "5.4L V8", "6.8L V10", "6.0L V8 Power Stroke Diesel"],
      "2009-2023": ["4.6L V8", "5.4L V8", "6.8L V10", "6.7L V8 Power Stroke Diesel"]
    },
    "Ranger": {
      "1996-2011": ["2.3L I4", "3.0L V6", "4.0L V6"],
      "2019-2023": ["2.3L I4 EcoBoost"]
    }
  },
  Ram: {
    "1500": {
      "2019-2023": ["3.6L V6", "5.7L V8", "5.7L V8 eTorque", "3.0L V6 Turbo Diesel"]
    },
    "2500": {
      "2019-2023": ["6.4L V8", "6.7L I6 Turbo Diesel"]
    },
    "3500": {
      "2019-2023": ["6.4L V8", "6.7L I6 Turbo Diesel"]
    }
  },
  Chevrolet: {
    "Silverado 1500": {
      "1996-2023": ["4.3L V6", "4.8L V8", "5.3L V8", "6.0L V8", "6.2L V8", "2.7L Turbo", "3.0L V6 Duramax Turbo Diesel"]
    },
    "Silverado 2500": {
      "1996-2023": ["5.3L V8", "6.0L V8", "6.6L V8 Duramax Turbo Diesel"]
    },
    "Silverado 3500": {
      "1996-2023": ["5.3L V8", "6.0L V8", "6.6L V8 Duramax Turbo Diesel"]
    },
    "S-10": {
      "1996-2004": ["2.2L I4", "4.3L V6"]
    },
    "Colorado": {
      "2004-2023": ["2.5L I4", "2.8L I4 Duramax Turbo Diesel", "3.6L V6"]
    }
  },
  GMC: {
    "Sierra 1500": {
      "1996-2023": ["4.3L V6", "4.8L V8", "5.3L V8", "6.0L V8", "6.2L V8", "2.7L Turbo", "3.0L V6 Duramax Turbo Diesel"]
    },
    "Sierra 2500": {
      "1996-2023": ["5.3L V8", "6.0L V8", "6.6L V8 Duramax Turbo Diesel"]
    },
    "Sierra 3500": {
      "1996-2023": ["5.3L V8", "6.0L V8", "6.6L V8 Duramax Turbo Diesel"]
    },
    "Sonoma": {
      "1996-2004": ["2.2L I4", "4.3L V6"]
    },
    "Canyon": {
      "2004-2023": ["2.5L I4", "2.8L I4 Duramax Turbo Diesel", "3.6L V6"]
    }
  }
};

export const fetchAllMakes = async () => {
  return MANUFACTURERS;
};

export const fetchModelsForMake = async (make, year) => {
  try {
    if (TRUCK_MODELS[make]) {
      return Object.keys(TRUCK_MODELS[make]);
    }
    
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`);
    const data = await response.json();
    return Array.from(new Set(data.Results.map(model => model.Model_Name))).sort();
  } catch (error) {
    console.error('Error fetching models:', error);
    toast.error('Failed to fetch vehicle models. Please try again.');
    throw error;
  }
};

export const fetchEngineSizesForMakeAndModel = async (year, make, model) => {
  try {
    if (TRUCK_MODELS[make] && TRUCK_MODELS[make][model]) {
      const yearRanges = Object.keys(TRUCK_MODELS[make][model]);
      const matchingRange = yearRanges.find(range => {
        const [start, end] = range.split('-');
        return year >= parseInt(start) && year <= (end ? parseInt(end) : 2023);
      });
      
      if (matchingRange) {
        return TRUCK_MODELS[make][model][matchingRange];
      }
    }
    
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`);
    const data = await response.json();
    const modelData = data.Results.filter(m => m.Model_Name === model);
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
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
    const data = await response.json();
    const results = data.Results;
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