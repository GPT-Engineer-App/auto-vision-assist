import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const generateResponse = async (messages, maxTokens = 500) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: maxTokens
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate response');
  }
};

export const generateDiagnosticResponse = async (prompt) => {
  const messages = [
    { role: "system", content: "You are an advanced automotive diagnostic assistant with expertise in DTC codes, symptom analysis, and vehicle systems. Provide detailed and accurate responses to automotive queries." },
    { role: "user", content: prompt }
  ];
  return generateResponse(messages, 300);
};

export const generateOpenSightAnalysis = async (vehicleInfo) => {
  const prompt = `Perform an Open Sight analysis for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.engineSize} engine. Consider common issues, maintenance requirements, and potential upgrades for this vehicle.`;
  const messages = [
    { role: "system", content: "You are an advanced automotive analysis system. Provide detailed insights and recommendations for vehicle maintenance and upgrades." },
    { role: "user", content: prompt }
  ];
  return generateResponse(messages);
};

export const generateRangeFinderAnalysis = async (dtc, vehicleInfo) => {
  const prompt = `Perform a Range Finder analysis for DTC ${dtc} on a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.engineSize} engine. Provide detailed information about the DTC, potential causes, diagnostic steps, and repair recommendations.`;
  const messages = [
    { role: "system", content: "You are an advanced automotive diagnostic system specializing in DTC analysis. Provide comprehensive information and recommendations for addressing diagnostic trouble codes." },
    { role: "user", content: prompt }
  ];
  return generateResponse(messages);
};

// Add more specialized functions as needed for different features
