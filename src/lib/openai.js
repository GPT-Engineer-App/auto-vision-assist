import OpenAI from 'openai';
import { toast } from "sonner";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

let assistantId;

export const initializeAssistant = async () => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Auto Diagnostic Assistant",
      instructions: "You are an automotive diagnostic assistant. Provide concise and helpful responses to vehicle-related queries, symptoms, and DTC codes.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-turbo-preview"
    });
    assistantId = assistant.id;
    console.log("Assistant created with ID:", assistantId);
  } catch (error) {
    console.error("Error creating assistant:", error);
    toast.error("Failed to initialize diagnostic assistant. Please try again later.");
  }
};

export const generateDiagnosticResponse = async (prompt, retries = 3) => {
  if (!assistantId) {
    await initializeAssistant();
  }

  try {
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];

    if (lastMessage.role === "assistant") {
      return lastMessage.content[0].text.value.trim();
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
