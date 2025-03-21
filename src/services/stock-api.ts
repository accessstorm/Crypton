// Mock stock API service
// In a real application, this would use a real stock API like Alpha Vantage or IEX Cloud

// Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
}

export interface StockHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Sample mock data
const mockStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.72,
    change: 2.35,
    changePercent: 1.33,
    marketCap: 2750000000000,
    volume: 64500000,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 416.35,
    change: 3.78,
    changePercent: 0.92,
    marketCap: 3100000000000,
    volume: 22100000,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 152.11,
    change: -1.23,
    changePercent: -0.8,
    marketCap: 1900000000000,
    volume: 21600000,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 182.41,
    change: 0.95,
    changePercent: 0.52,
    marketCap: 1880000000000,
    volume: 32400000,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 175.35,
    change: -3.23,
    changePercent: -1.81,
    marketCap: 557000000000,
    volume: 95700000,
  },
  {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 490.28,
    change: 4.89,
    changePercent: 1.01,
    marketCap: 1250000000000,
    volume: 12600000,
  },
  {
    symbol: "NFLX",
    name: "Netflix, Inc.",
    price: 628.37,
    change: 7.64,
    changePercent: 1.23,
    marketCap: 274000000000,
    volume: 3800000,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 950.18,
    change: 23.45,
    changePercent: 2.53,
    marketCap: 2340000000000,
    volume: 48200000,
  },
];

// Generate random historical data for a stock
const generateHistoricalData = (
  basePrice: number,
  days: number
): StockHistoricalData[] => {
  const data: StockHistoricalData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random price variations
    const volatility = basePrice * 0.02; // 2% volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    const open = basePrice + randomChange;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    const close = low + Math.random() * (high - low);
    
    // Update the base price for the next day
    basePrice = close;
    
    data.push({
      date: date.toISOString().split("T")[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }
  
  return data;
};

// API Methods
export const stockApi = {
  // Get top stocks
  getTopStocks: async (): Promise<Stock[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Add some randomness to the prices
    return mockStocks.map(stock => ({
      ...stock,
      price: stock.price * (1 + (Math.random() - 0.5) * 0.01), // ±0.5% variation
      change: stock.change * (1 + (Math.random() - 0.5) * 0.1), // ±5% variation
      changePercent: stock.changePercent * (1 + (Math.random() - 0.5) * 0.1), // ±5% variation
    }));
  },
  
  // Get specific stock data
  getStock: async (symbol: string): Promise<Stock | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const stock = mockStocks.find(s => s.symbol === symbol);
    if (!stock) return null;
    
    // Add some randomness to the price
    return {
      ...stock,
      price: stock.price * (1 + (Math.random() - 0.5) * 0.01), // ±0.5% variation
      change: stock.change * (1 + (Math.random() - 0.5) * 0.1), // ±5% variation
      changePercent: stock.changePercent * (1 + (Math.random() - 0.5) * 0.1), // ±5% variation
    };
  },
  
  // Get historical data for a stock
  getStockHistoricalData: async (symbol: string, days = 30): Promise<StockHistoricalData[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));
    
    const stock = mockStocks.find(s => s.symbol === symbol);
    if (!stock) throw new Error(`Stock with symbol ${symbol} not found`);
    
    // Generate random historical data
    return generateHistoricalData(stock.price, days);
  },
  
  // Search for stocks
  searchStocks: async (query: string): Promise<Stock[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Filter stocks based on the query
    const lowerQuery = query.toLowerCase();
    return mockStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(lowerQuery) || 
      stock.name.toLowerCase().includes(lowerQuery)
    );
  },
};

export default stockApi;
