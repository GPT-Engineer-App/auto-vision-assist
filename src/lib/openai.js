import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-svcacct-kvxSkU8VQftq7oy5P2H2T3BlbkFJ587KLBO0rkDCGYU7g5qr',
  dangerouslyAllowBrowser: true // Note: This is not recommended for production. Use a backend proxy instead.
});

export const generateDiagnosticResponse = async (prompt, isPro) => {
  try {
    const systemMessage = isPro
      ? "You are an advanced automotive diagnostic assistant. Provide detailed explanations of cause and correction, including a brief description of the faulty component's operation and functionality. Also, include a skill level of repair using a scale: 1 (Easy), 2 (DIY), 3 (Parts Changer), 4 (VoTech, ATI Graduate), 5 (Professional Repair Only)."
      : "You are an automotive diagnostic assistant. Provide concise and helpful responses to vehicle-related queries, focusing on the most logical cause and correction for the symptoms and/or DTCs.";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      max_tokens: isPro ? 300 : 150
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate diagnostic response');
  }
};

export const generateOpenSightAnalysis = async (vehicleInfo, symptoms) => {
  try {
    const systemMessage = "You are an advanced automotive diagnostic system. Analyze the given vehicle information and symptoms to provide a detailed response listing likely faulty components with probability scores. If the score of the most logical fix is less than 75% and the second is less than 50%, provide up to three different components.";

    const prompt = `Vehicle Info: ${JSON.stringify(vehicleInfo)}
Symptoms: ${symptoms}

Provide a detailed analysis of likely faulty components with probability scores.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
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