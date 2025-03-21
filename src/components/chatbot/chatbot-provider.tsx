"use client";

import { useState, useEffect } from "react";
import { Chatbot } from "@/components/chatbot/chatbot";
import { ApiKeyModal } from "@/components/chatbot/api-key-modal";
import { setGeminiApiKey } from "@/services/gemini-api";

export function ChatbotProvider() {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  useEffect(() => {
    // Check if API key is already set in localStorage
    const savedApiKey = localStorage.getItem("gemini-api-key");
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
      setIsApiKeySet(true);
    } else {
      // Show modal after a delay to allow the page to load first
      const timer = setTimeout(() => {
        setShowApiKeyModal(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string) => {
    // Save API key to localStorage
    localStorage.setItem("gemini-api-key", apiKey);
    setGeminiApiKey(apiKey);
    setIsApiKeySet(true);
  };

  return (
    <>
      <Chatbot initialApiKeySet={isApiKeySet} />
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSubmit={handleApiKeySubmit}
      />
    </>
  );
} 