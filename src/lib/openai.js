import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateDiagnosticResponse = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an automotive diagnostic assistant. Provide concise and helpful responses to vehicle-related queries." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate diagnostic response');
  }
};
