"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { chatWithGemini, setGeminiApiKey } from "@/services/gemini-api";

type Message = {
  role: "user" | "model";
  text: string;
  timestamp: Date;
};

interface ChatbotProps {
  initialApiKeySet?: boolean;
}

export function Chatbot({ initialApiKeySet = false }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(initialApiKeySet);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message if API key is set
  useEffect(() => {
    if (initialApiKeySet && messages.length === 0) {
      // Start with a system message
      setMessages([
        {
          role: "model",
          text: "Hello! I'm your Crypton assistant powered by Google Gemini. How can I help you with your crypto and stock investments today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialApiKeySet, messages.length]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmitApiKey = () => {
    if (apiKey.trim()) {
      setGeminiApiKey(apiKey.trim());
      setIsApiKeySet(true);
      setApiKey("");
      setError(null);
      // Add a welcome message
      setMessages([
        {
          role: "model",
          text: "Hello! I'm your Crypton assistant powered by Google Gemini. How can I help you with your crypto and stock investments today?",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const resetApiKey = () => {
    setIsApiKeySet(false);
    setApiKey("");
    localStorage.removeItem("gemini-api-key");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Clear any previous errors
    setError(null);
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      text: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Create a simplified history to avoid context length issues
      // Only include last 10 messages to prevent exceeding token limits
      const recentHistory = messages.slice(-10).map(({ role, text }) => ({ role, text }));
      
      // Add the current user message
      const history = [...recentHistory, { role: userMessage.role, text: userMessage.text }];
      
      // Get response from Gemini
      const response = await chatWithGemini(userMessage.text, history);
      
      // Check if it's an error response
      if (response.includes("error communicating with the AI")) {
        setError("There was an issue with the Gemini API. This might be due to quota limits or an invalid API key.");
      }
      
      // Add model response
      const modelMessage: Message = {
        role: "model",
        text: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error:", error);
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Sorry, there was an error processing your request. Please try again later or check your API key.",
          timestamp: new Date(),
        },
      ]);
      
      setError("There was a problem connecting to the AI service. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot toggle button */}
      <Button
        onClick={toggleChatbot}
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </Button>

      {/* Chatbot card */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-[350px] md:w-[400px] h-[500px] shadow-2xl border border-border/40 overflow-hidden bg-card/90 backdrop-blur-sm">
          <CardHeader className="border-b border-border/30 bg-muted/30 backdrop-blur-sm px-4 py-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-primary" />
                Crypton Assistant
                <div className="ml-2 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              {isApiKeySet && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={resetApiKey}
                  className="h-7 w-7"
                  title="Reset API Key"
                >
                  <Key className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(500px-57px)]">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!isApiKeySet ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Bot className="h-12 w-12 text-primary" />
                  <p className="text-center text-sm text-muted-foreground">
                    Please enter your Gemini API key to start chatting.
                  </p>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input 
                      type="password" 
                      placeholder="Paste your API key here" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSubmitApiKey}>Set</Button>
                  </div>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Get a free API key from Google AI Studio
                  </a>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                  <Bot className="h-12 w-12 text-primary" />
                  <p className="text-muted-foreground">
                    Ask me anything about cryptocurrencies, stocks, or market trends!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col max-w-[85%] rounded-lg p-3",
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                        : "mr-auto bg-muted rounded-bl-none"
                    )}
                  >
                    {message.role === "user" ? (
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                    ) : (
                      <div 
                        className="text-sm prose-sm prose-invert max-w-full"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      />
                    )}
                    <span
                      className={cn(
                        "text-xs mt-1",
                        message.role === "user"
                          ? "text-primary-foreground/70 self-end"
                          : "text-muted-foreground self-start"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex items-center space-x-2 max-w-[85%] mr-auto bg-muted rounded-lg rounded-bl-none p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            {isApiKeySet && (
              <>
                {error && (
                  <div className="px-4 py-2 bg-red-500/10 border-t border-b border-red-500/20 text-red-500 text-xs">
                    <div className="flex items-center">
                      <span>{error}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-auto"
                        onClick={() => setError(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="border-t border-border/30 p-4 bg-muted/30 backdrop-blur-sm flex items-end gap-2"
                >
                  <div className="relative flex-1 overflow-hidden rounded-lg border border-input bg-background">
                    <TextareaAutosize
                      ref={inputRef}
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={isLoading}
                      className="w-full resize-none bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-50"
                      maxRows={4}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isLoading || !input.trim()}
                    className="h-10 w-10 rounded-full bg-primary text-primary-foreground"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 