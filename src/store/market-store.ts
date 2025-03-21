import { create } from "zustand";
import { coinGeckoApi, Coin, GlobalData } from "@/services/coingecko-api";
import { stockApi, Stock, StockHistoricalData } from "@/services/stock-api";
import { socialMediaApi, SocialMediaData } from "@/services/social-media-api";

interface ChartDataPoint {
  date: string;
  price: number;
}

interface MarketState {
  // Cryptocurrency data
  coins: Coin[];
  loadingCoins: boolean;
  globalData: GlobalData | null;
  loadingGlobalData: boolean;
  selectedCoin: Coin | null;
  selectedCoinChartData: ChartDataPoint[] | null;
  loadingSelectedCoinData: boolean;
  
  // Stock market data
  stocks: Stock[];
  loadingStocks: boolean;
  selectedStock: Stock | null;
  selectedStockChartData: StockHistoricalData[] | null;
  loadingSelectedStockData: boolean;
  
  // Social media sentiment data
  socialSentiment: {
    crypto: SocialMediaData | null;
    stocks: SocialMediaData | null;
  };
  loadingSocialSentiment: boolean;
  
  // AI predictions
  aiPredictions: {
    forecast: {
      asset: string;
      direction: 'up' | 'down' | 'sideways';
      confidence: number;
      targetChange: number;
    } | null;
    riskAssessment: {
      volatilityScore: number;
      marketRisk: 'low' | 'medium' | 'high' | 'extreme';
      stabilityIndex: number;
    } | null;
  };
  loadingAiPredictions: boolean;
  
  // User watchlist
  watchlist: (Coin | Stock)[];
  
  // Actions
  fetchTopCoins: (limit?: number) => Promise<void>;
  fetchGlobalData: () => Promise<void>;
  fetchCoinDetails: (id: string) => Promise<void>;
  fetchTopStocks: () => Promise<void>;
  fetchStockDetails: (symbol: string) => Promise<void>;
  fetchSocialSentiment: (asset: string, type: 'crypto' | 'stocks') => Promise<void>;
  generateAiPredictions: (asset: string) => Promise<void>;
  addToWatchlist: (item: Coin | Stock) => void;
  removeFromWatchlist: (id: string) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  // Cryptocurrency data
  coins: [],
  loadingCoins: false,
  globalData: null,
  loadingGlobalData: false,
  selectedCoin: null,
  selectedCoinChartData: null,
  loadingSelectedCoinData: false,
  
  // Stock market data
  stocks: [],
  loadingStocks: false,
  selectedStock: null,
  selectedStockChartData: null,
  loadingSelectedStockData: false,
  
  // Social media sentiment data
  socialSentiment: {
    crypto: null,
    stocks: null
  },
  loadingSocialSentiment: false,
  
  // AI predictions
  aiPredictions: {
    forecast: null,
    riskAssessment: null
  },
  loadingAiPredictions: false,
  
  // User watchlist
  watchlist: [],
  
  // Actions
  fetchTopCoins: async (limit = 20) => {
    set({ loadingCoins: true });
    try {
      const coins = await coinGeckoApi.getTopCoins(limit);
      set({ coins, loadingCoins: false });
    } catch (error) {
      console.error("Failed to fetch top coins:", error);
      set({ loadingCoins: false });
    }
  },
  
  fetchGlobalData: async () => {
    set({ loadingGlobalData: true });
    try {
      const globalData = await coinGeckoApi.getGlobalData();
      set({ globalData, loadingGlobalData: false });
    } catch (error) {
      console.error("Failed to fetch global data:", error);
      set({ loadingGlobalData: false });
    }
  },
  
  fetchCoinDetails: async (id: string) => {
    set({ loadingSelectedCoinData: true });
    try {
      // Fetch detailed coin data
      const coinData = await coinGeckoApi.getCoin(id);
      
      // Fetch historical chart data
      const chartData = await coinGeckoApi.getCoinMarketChart(id, 30);
      
      // Process historical data for charts
      const processedChartData = chartData.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price,
      }));
      
      set({
        selectedCoin: coinData,
        selectedCoinChartData: processedChartData,
        loadingSelectedCoinData: false,
      });
      
      // Also fetch sentiment for this coin
      get().fetchSocialSentiment(coinData.name, 'crypto');
      
      // Generate AI predictions
      get().generateAiPredictions(coinData.name);
    } catch (error) {
      console.error(`Failed to fetch details for coin ${id}:`, error);
      set({ loadingSelectedCoinData: false });
    }
  },
  
  fetchTopStocks: async () => {
    set({ loadingStocks: true });
    try {
      const stocks = await stockApi.getTopStocks();
      set({ stocks, loadingStocks: false });
    } catch (error) {
      console.error("Failed to fetch top stocks:", error);
      set({ loadingStocks: false });
    }
  },
  
  fetchStockDetails: async (symbol: string) => {
    set({ loadingSelectedStockData: true });
    try {
      // Fetch stock data
      const stockData = await stockApi.getStock(symbol);
      
      // Fetch historical data
      const historicalData = await stockApi.getStockHistoricalData(symbol, 30);
      
      if (stockData) {
        set({
          selectedStock: stockData,
          selectedStockChartData: historicalData,
          loadingSelectedStockData: false,
        });
        
        // Also fetch sentiment for this stock
        get().fetchSocialSentiment(stockData.name, 'stocks');
        
        // Generate AI predictions
        get().generateAiPredictions(stockData.name);
      }
    } catch (error) {
      console.error(`Failed to fetch details for stock ${symbol}:`, error);
      set({ loadingSelectedStockData: false });
    }
  },
  
  fetchSocialSentiment: async (asset: string, type: 'crypto' | 'stocks') => {
    set({ loadingSocialSentiment: true });
    try {
      const sentimentData = await socialMediaApi.getSocialSentiment(asset);
      
      set(state => ({
        socialSentiment: {
          ...state.socialSentiment,
          [type]: sentimentData
        },
        loadingSocialSentiment: false
      }));
    } catch (error) {
      console.error(`Failed to fetch social sentiment for ${asset}:`, error);
      set({ loadingSocialSentiment: false });
    }
  },
  
  generateAiPredictions: async (asset: string) => {
    set({ loadingAiPredictions: true });
    try {
      // In a real app, this would call a machine learning model
      // For now, we'll generate mock AI predictions
      
      // Random direction with weighted probabilities
      const directions = ['up', 'down', 'sideways'] as const;
      const weights = [0.45, 0.35, 0.2]; // 45% up, 35% down, 20% sideways
      
      let directionIndex = 0;
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          directionIndex = i;
          break;
        }
      }
      
      const direction = directions[directionIndex];
      const confidence = 0.5 + Math.random() * 0.4; // 50-90% confidence
      const targetChange = direction === 'up' 
        ? (1 + Math.random() * 10).toFixed(2) 
        : direction === 'down' 
          ? (-1 - Math.random() * 10).toFixed(2)
          : (0.5 - Math.random()).toFixed(2);
      
      // Risk assessment 
      const volatilityScore = Math.random() * 100;
      let marketRisk: 'low' | 'medium' | 'high' | 'extreme';
      
      if (volatilityScore < 25) marketRisk = 'low';
      else if (volatilityScore < 50) marketRisk = 'medium';
      else if (volatilityScore < 75) marketRisk = 'high';
      else marketRisk = 'extreme';
      
      const stabilityIndex = Math.round((100 - volatilityScore) / 10) / 10;
      
      set({
        aiPredictions: {
          forecast: {
            asset,
            direction,
            confidence,
            targetChange: parseFloat(targetChange)
          },
          riskAssessment: {
            volatilityScore,
            marketRisk,
            stabilityIndex
          }
        },
        loadingAiPredictions: false
      });
    } catch (error) {
      console.error(`Failed to generate AI predictions for ${asset}:`, error);
      set({ loadingAiPredictions: false });
    }
  },
  
  addToWatchlist: (item: Coin | Stock) => {
    set(state => {
      // Check if item already exists in watchlist
      const exists = state.watchlist.some(
        watchlistItem => 'id' in watchlistItem && 'id' in item 
          ? watchlistItem.id === item.id 
          : 'symbol' in watchlistItem && 'symbol' in item
            ? watchlistItem.symbol === item.symbol
            : false
      );
      
      if (exists) return state;
      
      return {
        watchlist: [...state.watchlist, item]
      };
    });
  },
  
  removeFromWatchlist: (id: string) => {
    set(state => ({
      watchlist: state.watchlist.filter(item => 
        'id' in item ? item.id !== id : 'symbol' in item ? item.symbol !== id : false
      )
    }));
  }
}));
