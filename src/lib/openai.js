import OpenAI from 'openai';
import { toast } from "sonner";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

class RateLimiter {
  constructor(limit, window) {
    this.limit = limit;
    this.window = window;
    this.tokens = [];
  }

  async waitForToken() {
    const now = Date.now();
    this.tokens = this.tokens.filter(t => now - t < this.window);
    if (this.tokens.length >= this.limit) {
      const oldestToken = this.tokens[0];
      const msToWait = this.window - (now - oldestToken);
      await new Promise(resolve => setTimeout(resolve, msToWait));
      return this.waitForToken();
    }
    this.tokens.push(now);
  }
}

const rateLimiter = new RateLimiter(50, 60 * 1000); // 50 requests per minute

export const generateDiagnosticResponse = async (prompt, retries = 3) => {
  try {
    await rateLimiter.waitForToken();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an automotive diagnostic assistant. Provide concise and helpful responses to vehicle-related queries." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      throw new Error("No response generated");
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    }

    if (error.message.includes("rate limit") || error.response?.status === 429) {
      if (retries > 0) {
        const delay = Math.pow(2, 4 - retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateDiagnosticResponse(prompt, retries - 1);
      } else {
        toast.error("Rate limit exceeded. Please try again later.");
      }
    } else if (error.response?.status === 401) {
      toast.error("Authentication error. Please check your API key.");
    } else if (error.response?.status >= 500) {
      toast.error("OpenAI service is currently unavailable. Please try again later.");
    } else {
      toast.error("Failed to generate diagnostic response. Please try again.");
    }
    throw error;
  }
};

export const validateOpenAIKey = async () => {
  try {
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('Error validating OpenAI API key:', error);
    return false;
  }
};
