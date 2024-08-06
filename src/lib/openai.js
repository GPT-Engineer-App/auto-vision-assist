import OpenAI from 'openai';
import { toast } from "sonner";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const API_RATE_LIMIT = 50; // Requests per minute
const API_RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
let apiCallCount = 0;
let apiCallResetTime = Date.now() + API_RATE_WINDOW;

function checkRateLimit() {
  const now = Date.now();
  if (now > apiCallResetTime) {
    apiCallCount = 0;
    apiCallResetTime = now + API_RATE_WINDOW;
  }
  if (apiCallCount >= API_RATE_LIMIT) {
    throw new Error("API rate limit exceeded. Please try again later.");
  }
  apiCallCount++;
}

export const generateDiagnosticResponse = async (prompt) => {
  try {
    checkRateLimit();
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
    if (error.message.includes("rate limit")) {
      toast.error("Rate limit exceeded. Please try again later.");
    } else {
      toast.error("Failed to generate diagnostic response. Please try again.");
    }
    throw error;
  }
};
