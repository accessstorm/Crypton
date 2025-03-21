"use client";

import { useState, useEffect } from "react";

// Types
export interface SentimentData {
  score: number; // Score between -1 (extremely negative) and 1 (extremely positive)
  trend: "bullish" | "bearish" | "neutral";
  confidence: number; // Score between 0 and 1
  keywords: Array<{ word: string; sentiment: number }>;
}

// This is a mock function that simulates getting sentiment data
// In a real application, this would connect to a real sentiment analysis service or API
const getMockSentimentData = (assetName: string): Promise<SentimentData> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate random sentiment data
      const randomScore = Math.random() * 2 - 1; // Between -1 and 1
      const trend = randomScore > 0.3 
        ? "bullish" 
        : randomScore < -0.3
          ? "bearish"
          : "neutral";
      
      const confidence = 0.5 + Math.random() * 0.5; // Between 0.5 and 1
      
      // Generate some random keywords
      const keywords = [
        { word: "volatility", sentiment: Math.random() * 2 - 1 },
        { word: "earnings", sentiment: Math.random() * 2 - 1 },
        { word: "growth", sentiment: Math.random() * 2 - 1 },
        { word: "innovation", sentiment: Math.random() * 2 - 1 },
        { word: "regulation", sentiment: Math.random() * 2 - 1 },
      ].sort((a, b) => Math.abs(b.sentiment) - Math.abs(a.sentiment));
      
      resolve({
        score: randomScore,
        trend,
        confidence,
        keywords: keywords.slice(0, 3), // Take top 3 keywords
      });
    }, 800);
  });
};

/**
 * Hook to fetch and manage sentiment data for an asset
 */
export function useSentiment(assetName: string) {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchSentiment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getMockSentimentData(assetName);
      setSentimentData(data);
    } catch (err) {
      console.error("Failed to fetch sentiment data:", err);
      setError("Failed to load sentiment data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (assetName) {
      fetchSentiment();
    }
  }, [assetName]);
  
  return {
    sentimentData,
    loading,
    error,
    refresh: fetchSentiment,
  };
}
