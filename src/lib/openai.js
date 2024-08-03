import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateDiagnosticResponse = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an advanced automotive diagnostic assistant with expertise in DTC codes, symptom analysis, and vehicle systems. Provide detailed and accurate responses to automotive queries." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate diagnostic response');
  }
};

export const generateOpenSightAnalysis = async (vehicleInfo) => {
  try {
    const prompt = `Perform an Open Sight analysis for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.engineSize} engine. Consider common issues, maintenance requirements, and potential upgrades for this vehicle.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an advanced automotive analysis system. Provide detailed insights and recommendations for vehicle maintenance and upgrades." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API for Open Sight analysis:', error);
    throw new Error('Failed to generate Open Sight analysis');
  }
};

export const generateRangeFinderAnalysis = async (dtc, vehicleInfo) => {
  try {
    const prompt = `Perform a Range Finder analysis for DTC ${dtc} on a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.engineSize} engine. Provide detailed information about the DTC, potential causes, diagnostic steps, and repair recommendations.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an advanced automotive diagnostic system specializing in DTC analysis. Provide comprehensive information and recommendations for addressing diagnostic trouble codes." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API for Range Finder analysis:', error);
    throw new Error('Failed to generate Range Finder analysis');
  }
};
