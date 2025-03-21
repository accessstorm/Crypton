import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from 'marked';

// Initialize the Gemini API with your API key
// The actual API key will be provided by the user and set later
let apiKey = "";

export const setGeminiApiKey = (key: string) => {
  apiKey = key;
};

// Configure marked options
marked.setOptions({
  breaks: true,        // Convert line breaks to <br>
  gfm: true,           // Use GitHub flavored markdown
});

// Helper function to process markdown formatting
const processMarkdown = (text: string): string => {
  try {
    // Process text through marked library
    const htmlContent = marked.parse(text) as string;
    
    // Apply custom styles to the HTML
    return htmlContent
      // Style links
      .replace(/<a /g, '<a class="text-primary hover:underline" target="_blank" rel="noopener noreferrer" ')
      // Style lists
      .replace(/<ul>/g, '<ul class="list-disc pl-5 my-2">')
      .replace(/<ol>/g, '<ol class="list-decimal pl-5 my-2">')
      // Style code blocks
      .replace(/<pre><code>/g, '<pre class="bg-muted/30 p-2 rounded-md text-xs my-2 overflow-x-auto"><code class="font-mono">')
      // Style inline code
      .replace(/<code>/g, '<code class="font-mono bg-muted/20 px-1 rounded text-xs">')
      // Style table
      .replace(/<table>/g, '<table class="border-collapse w-full text-xs my-2">')
      .replace(/<th>/g, '<th class="border border-border/30 p-1 bg-muted/30">')
      .replace(/<td>/g, '<td class="border border-border/30 p-1">');
  } catch (error) {
    console.error("Error processing markdown:", error);
    // Fallback to basic formatting if marked fails
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  }
};

export const chatWithGemini = async (
  prompt: string,
  history: { role: "user" | "model"; text: string }[]
): Promise<string> => {
  try {
    if (!apiKey) {
      return "API key is not set. Please set your Gemini API key first.";
    }

    // Create a GoogleGenerativeAI instance with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try with the latest known model name for Gemini
    const modelName = "gemini-1.5-pro";
    
    console.log(`Attempting to use model: ${modelName}`);
    
    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });
    
    // Format chat history in the expected format
    const formattedHistory = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));
    
    // System instructions for the assistant
    const systemInstruction = `You are a helpful assistant for a cryptocurrency and financial dashboard app called Crypton. 
Help the user with their questions about cryptocurrency, stocks, trading, and investment strategies.
Be concise and informative. 

You can use markdown formatting:
- Use **bold** for emphasis
- Use *italic* for definitions
- Use \`code\` for technical terms or code
- Use bullet points or numbered lists for steps or features
- Use tables to organize data when appropriate

Keep your responses well-structured but concise.`;

    // Attempt to use the chat API
    try {
      const chat = model.startChat({
        history: formattedHistory,
      });
      
      const result = await chat.sendMessage(`${systemInstruction}\n\nUser query: ${prompt}`);
      const text = result.response.text();
      return processMarkdown(text);
    } catch (chatError) {
      console.log("Chat API failed, trying direct content generation:", chatError);
      
      // Fallback to direct content generation if chat fails
      const fullPrompt = `${systemInstruction}
      
Previous conversation:
${history.map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.text}`).join("\n")}

User: ${prompt}
Assistant:`;
      
      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      return processMarkdown(text);
    }
  } catch (primaryError) {
    console.error("Primary approach failed:", primaryError);
    
    // Try alternative model as fallback
    try {
      console.log("Trying alternative model...");
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Try with a different model name
      const fallbackModel = genAI.getGenerativeModel({ 
        model: "gemini-1.0-pro", // Older model name as fallback
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });
      
      // Simplified prompt without history
      const simplePrompt = `You are a helpful cryptocurrency assistant for an app called Crypton. 
Please answer this question concisely: ${prompt}

Use markdown formatting like **bold**, *italic*, \`code\`, and bullet points when helpful.`;
      
      const result = await fallbackModel.generateContent(simplePrompt);
      const text = result.response.text();
      
      return processMarkdown(text);
    } catch (fallbackError) {
      console.error("All approaches failed:", fallbackError);
      
      // Return detailed error message to help troubleshoot
      return `Sorry, I couldn't connect to the Google AI service. 

This could be due to one of these issues:
1. The API key might be invalid or have insufficient permissions
2. The model names have changed (tried "gemini-1.5-pro" and "gemini-1.0-pro")
3. You may need to update the "@google/generative-ai" package
4. There might be network connectivity issues

Error details: ${primaryError instanceof Error ? primaryError.message : String(primaryError)}`;
    }
  }
};