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

export const generateDiagnosticResponse = async (prompt) => {
  try {
    await rateLimiter.waitForToken();
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
