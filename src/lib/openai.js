import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-proj-odBrDWrlZ62j0CreWKnMT3BlbkFJOCJjCaS65jYkSQWFDMMM',
  dangerouslyAllowBrowser: true // Note: This is not recommended for production. Use a backend proxy instead.
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