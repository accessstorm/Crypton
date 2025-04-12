"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Send, RefreshCw, Settings, AlertCircle } from "lucide-react";
import { useMarketStore } from "@/store/market-store";
import { chatWithGemini, setGeminiApiKey } from "@/services/gemini-api";
import { Coin } from "@/services/coingecko-api";

// Define the type for our chat messages
interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function AIAgentPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("gemini");
  const [geminiApiKey, setGeminiKey] = useState("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [btcData, setBtcData] = useState<Coin | null>(null);

  const { coins, fetchTopCoins } = useMarketStore();

  // Fetch BTC data on page load
  useEffect(() => {
    fetchTopCoins(10);
  }, [fetchTopCoins]);

  // Get BTC data from the store
  useEffect(() => {
    if (coins && coins.length > 0) {
      const bitcoin = coins.find(coin => coin.id === "bitcoin");
      if (bitcoin) {
        setBtcData(bitcoin);
      }
    }
  }, [coins]);

  // Handle API key submission
  const handleSetApiKey = () => {
    if (geminiApiKey) {
      setGeminiApiKey(geminiApiKey);
      setIsApiKeySet(true);
      // Adding a welcome message
      setMessages([{
        role: "model",
        text: "Hi there! I'm your AI crypto assistant. Ask me anything about cryptocurrencies, like 'What's BTC doing today?' or 'Explain blockchain technology'"
      }]);
    }
  };

  // Handle query submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = { role: "user", text: query };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading state
    setQuery("");
    setLoading(true);
    
    try {
      // Prepare context data about Bitcoin if available
      let contextData = "";
      if (btcData) {
        contextData = `
Current Bitcoin Data:
- Price: $${btcData.current_price.toLocaleString()}
- 24h Change: ${btcData.price_change_percentage_24h.toFixed(2)}%
- Market Cap: $${(btcData.market_cap / 1000000000).toFixed(2)} billion
- 24h High: $${btcData.high_24h.toLocaleString()}
- 24h Low: $${btcData.low_24h.toLocaleString()}
- 24h Volume: $${(btcData.total_volume / 1000000000).toFixed(2)} billion
        `;
      }

      // Add context to the user query
      const augmentedQuery = `${userMessage.text}\n\n${contextData}`;
      
      // Get response from Gemini
      const response = await chatWithGemini(augmentedQuery, messages);
      
      // Add model response to chat
      setMessages(prev => [...prev, { role: "model", text: response }]);
    } catch (error) {
      console.error("Error querying AI:", error);
      setMessages(prev => [...prev, { 
        role: "model", 
        text: "Sorry, there was an error processing your request. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Crypto Assistant
        </h1>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="gemini">Google Gemini</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="gemini" className="w-full">
            {!isApiKeySet ? (
              <Card>
                <CardHeader>
                  <CardTitle>Set Up Google Gemini</CardTitle>
                  <CardDescription>
                    Enter your Gemini API key to use the AI assistant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        You need a Google Gemini API key to use this feature. Get one at{" "}
                        <a 
                          href="https://ai.google.dev/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          ai.google.dev
                        </a>
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          placeholder="Enter your Gemini API key"
                          value={geminiApiKey}
                          onChange={e => setGeminiKey(e.target.value)}
                        />
                        <Button onClick={handleSetApiKey}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 h-[600px] flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle>Chat with AI Assistant</CardTitle>
                    <CardDescription>
                      Ask anything about cryptocurrencies or market trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Brain className="h-12 w-12 mb-2 opacity-20" />
                          <p>Start a conversation with the AI assistant</p>
                        </div>
                      ) : (
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-lg px-4 py-2 overflow-hidden ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted dark:bg-muted/80"
                              }`}
                            >
                              {message.role === "model" ? (
                                <div 
                                  dangerouslySetInnerHTML={{ __html: message.text }} 
                                  className="break-words prose prose-sm max-w-full prose-code:break-words prose-pre:max-w-full prose-pre:whitespace-pre-wrap"
                                />
                              ) : (
                                <p className="break-words whitespace-pre-wrap">{message.text}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2 flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleSubmit} className="flex gap-2 mt-auto pt-2 border-t">
                      <Input
                        placeholder="Ask something about crypto, e.g. 'What's BTC doing today?'"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={loading}
                      />
                      <Button type="submit" disabled={loading}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="h-[600px] overflow-hidden flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle>Live BTC Data</CardTitle>
                    <CardDescription>
                      Real-time data fed to the AI assistant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {btcData ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {btcData.image && (
                              <img 
                                src={btcData.image} 
                                alt="Bitcoin" 
                                className="w-8 h-8"
                              />
                            )}
                            <div>
                              <p className="font-medium">Bitcoin</p>
                              <p className="text-xs text-muted-foreground">BTC</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => fetchTopCoins(10)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-2xl font-bold">
                            ${btcData.current_price.toLocaleString()}
                          </p>
                          <p className={`text-sm ${
                            btcData.price_change_percentage_24h >= 0 
                              ? "text-emerald-500" 
                              : "text-red-500"
                          }`}>
                            {btcData.price_change_percentage_24h >= 0 ? "+" : ""}
                            {btcData.price_change_percentage_24h.toFixed(2)}% (24h)
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted/30 p-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">24h High</p>
                            <p className="font-medium">${btcData.high_24h.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted/30 p-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">24h Low</p>
                            <p className="font-medium">${btcData.low_24h.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted/30 p-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">Market Cap</p>
                            <p className="font-medium">${(btcData.market_cap / 1000000000).toFixed(2)}B</p>
                          </div>
                          <div className="bg-muted/30 p-2 rounded-lg">
                            <p className="text-xs text-muted-foreground">24h Volume</p>
                            <p className="font-medium">${(btcData.total_volume / 1000000000).toFixed(2)}B</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-2">Market Supply</p>
                          <div className="grid grid-cols-2 gap-y-2">
                            <p className="text-xs text-muted-foreground">Circulating Supply</p>
                            <p className="text-xs text-right">{btcData.circulating_supply.toLocaleString()} BTC</p>
                            <p className="text-xs text-muted-foreground">Max Supply</p>
                            <p className="text-xs text-right">{btcData.max_supply ? btcData.max_supply.toLocaleString() : 'N/A'} BTC</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium mb-2">All Time Stats</p>
                          <div className="grid grid-cols-2 gap-y-2">
                            <p className="text-xs text-muted-foreground">All Time High</p>
                            <p className="text-xs text-right">${btcData.ath.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">From ATH</p>
                            <p className="text-xs text-right text-red-500">{btcData.ath_change_percentage.toFixed(2)}%</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-2 text-muted-foreground">
                        <RefreshCw className="h-8 w-8 animate-spin" />
                        <p>Loading Bitcoin data...</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Settings</CardTitle>
                <CardDescription>
                  Configure your AI assistant preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">API Keys</h3>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="Google Gemini API Key"
                      value={geminiApiKey}
                      onChange={e => setGeminiKey(e.target.value)}
                    />
                    <Button onClick={handleSetApiKey}>
                      Update
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can get a Gemini API key from{" "}
                    <a 
                      href="https://ai.google.dev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      ai.google.dev
                    </a>
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-medium">Local Fallback Options</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you prefer running AI locally, you can use open-source alternatives like llama.cpp or Ollama with models like Mistral or Phi. 
                    This feature will be implemented in a future update.
                  </p>
                  <Button variant="outline" disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Local Models
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 