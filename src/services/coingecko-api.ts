import axios from "axios";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// Types
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface GlobalData {
  active_cryptocurrencies: number;
  upcoming_icos: number;
  ongoing_icos: number;
  ended_icos: number;
  markets: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

// Mock data for fallback when API is unavailable
const MOCK_COINS: Coin[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 63581.12,
    market_cap: 1235879654321,
    market_cap_rank: 1,
    fully_diluted_valuation: 1335879654321,
    total_volume: 32659874521,
    high_24h: 64821.36,
    low_24h: 62953.84,
    price_change_24h: 521.36,
    price_change_percentage_24h: 0.85,
    market_cap_change_24h: 10254789652,
    market_cap_change_percentage_24h: 0.81,
    circulating_supply: 19412456,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 68789.63,
    ath_change_percentage: -7.24,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 93982.54,
    atl_date: "2013-07-06T00:00:00.000Z",
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: Array(168).fill(0).map(() => 63000 + Math.random() * 2000)
    },
    price_change_percentage_7d_in_currency: 3.45,
    price_change_percentage_30d_in_currency: 8.76,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3458.93,
    market_cap: 415687412563,
    market_cap_rank: 2,
    fully_diluted_valuation: 415687412563,
    total_volume: 17524893652,
    high_24h: 3512.25,
    low_24h: 3421.56,
    price_change_24h: 25.32,
    price_change_percentage_24h: 0.73,
    market_cap_change_24h: 3045871256,
    market_cap_change_percentage_24h: 0.74,
    circulating_supply: 120254786,
    total_supply: null,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -28.95,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 799328.44,
    atl_date: "2015-10-20T00:00:00.000Z",
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: Array(168).fill(0).map(() => 3400 + Math.random() * 200)
    },
    price_change_percentage_7d_in_currency: 2.31,
    price_change_percentage_30d_in_currency: 5.67,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.0,
    market_cap: 96574125863,
    market_cap_rank: 3,
    fully_diluted_valuation: 96574125863,
    total_volume: 64859741258,
    high_24h: 1.001,
    low_24h: 0.998,
    price_change_24h: 0.00001,
    price_change_percentage_24h: 0.001,
    market_cap_change_24h: 102458963,
    market_cap_change_percentage_24h: 0.11,
    circulating_supply: 96574125863,
    total_supply: 96574125863,
    max_supply: null,
    ath: 1.32,
    ath_change_percentage: -24.21,
    ath_date: "2018-07-24T00:00:00.000Z",
    atl: 0.572521,
    atl_change_percentage: 74.67,
    atl_date: "2015-03-02T00:00:00.000Z",
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: Array(168).fill(0).map(() => 0.998 + Math.random() * 0.004)
    },
    price_change_percentage_7d_in_currency: 0.01,
    price_change_percentage_30d_in_currency: 0.02,
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 608.24,
    market_cap: 94125874125,
    market_cap_rank: 4,
    fully_diluted_valuation: 94125874125,
    total_volume: 1245789563,
    high_24h: 612.45,
    low_24h: 601.23,
    price_change_24h: 5.23,
    price_change_percentage_24h: 0.87,
    market_cap_change_24h: 812457896,
    market_cap_change_percentage_24h: 0.87,
    circulating_supply: 154533651,
    total_supply: 154533651,
    max_supply: 200000000,
    ath: 686.31,
    ath_change_percentage: -11.42,
    ath_date: "2021-05-10T07:24:17.097Z",
    atl: 0.0398177,
    atl_change_percentage: 1527177.67,
    atl_date: "2017-10-19T00:00:00.000Z",
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: Array(168).fill(0).map(() => 600 + Math.random() * 20)
    },
    price_change_percentage_7d_in_currency: 1.23,
    price_change_percentage_30d_in_currency: 3.45,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 143.52,
    market_cap: 59745812563,
    market_cap_rank: 5,
    fully_diluted_valuation: 78541256325,
    total_volume: 2154789563,
    high_24h: 146.25,
    low_24h: 140.12,
    price_change_24h: 2.15,
    price_change_percentage_24h: 1.52,
    market_cap_change_24h: 891245786,
    market_cap_change_percentage_24h: 1.51,
    circulating_supply: 415874125,
    total_supply: 542145785,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -44.86,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.50428,
    atl_change_percentage: 28361.53,
    atl_date: "2020-05-11T19:35:23.449Z",
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: Array(168).fill(0).map(() => 140 + Math.random() * 10)
    },
    price_change_percentage_7d_in_currency: 5.67,
    price_change_percentage_30d_in_currency: 12.34,
  },
];

// Mock coin detail for fallback
const getMockCoinDetail = (id: string) => {
  const coin = MOCK_COINS.find(c => c.id === id);
  if (!coin) return null;
  
  return {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: {
      thumb: coin.image,
      small: coin.image,
      large: coin.image
    },
    market_data: {
      current_price: { usd: coin.current_price },
      market_cap: { usd: coin.market_cap },
      market_cap_rank: coin.market_cap_rank,
      total_volume: { usd: coin.total_volume },
      high_24h: { usd: coin.high_24h },
      low_24h: { usd: coin.low_24h },
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap_change_24h: coin.market_cap_change_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
    },
    last_updated: coin.last_updated
  };
};

// Mock chart data
const getMockChartData = (id: string, days: number): CoinMarketChart => {
  const dataPoints = days * 24; // hourly data points
  const now = Date.now();
  const millisecondsPerHour = 60 * 60 * 1000;
  
  const basePriceMap: Record<string, number> = {
    bitcoin: 63000,
    ethereum: 3400,
    tether: 1,
    binancecoin: 600,
    solana: 140,
  };
  
  const volatilityMap: Record<string, number> = {
    bitcoin: 2000,
    ethereum: 200,
    tether: 0.004,
    binancecoin: 20,
    solana: 10,
  };
  
  const basePrice = basePriceMap[id] || 100;
  const volatility = volatilityMap[id] || 5;
  
  const prices: [number, number][] = Array(dataPoints).fill(0).map((_, i) => {
    const timestamp = now - (dataPoints - i) * millisecondsPerHour;
    const price = basePrice + (Math.random() - 0.5) * 2 * volatility;
    return [timestamp, price];
  });
  
  return {
    prices,
    market_caps: prices.map(([timestamp, price]) => [timestamp, price * 1000000]),
    total_volumes: prices.map(([timestamp]) => [timestamp, Math.random() * 10000000000])
  };
};

// API Methods
export const coinGeckoApi = {
  // Get top coins by market cap
  getTopCoins: async (limit = 20, sparkline = true, timeChange = "7d"): Promise<Coin[]> => {
    try {
      console.log(`Fetching top ${limit} coins from CoinGecko API...`);
      const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: limit,
          page: 1,
          sparkline,
          price_change_percentage: timeChange,
        },
      });
      console.log(`Successfully fetched ${response.data.length} coins`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching top coins:", error.message);
      console.log("Falling back to mock data due to API error");
      
      // Return mock data as fallback
      return MOCK_COINS.slice(0, limit);
    }
  },

  // Get specific coin data
  getCoin: async (id: string): Promise<any> => {
    try {
      console.log(`Fetching data for coin ${id} from CoinGecko API...`);
      const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
        },
      });
      console.log(`Successfully fetched data for ${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching coin ${id}:`, error.message);
      console.log(`Falling back to mock data for ${id} due to API error`);
      
      // Return mock data as fallback
      const mockCoin = getMockCoinDetail(id);
      if (!mockCoin) {
        throw new Error(`Coin ${id} not found in mock data`);
      }
      return mockCoin;
    }
  },

  // Get market chart data for a specific coin
  getCoinMarketChart: async (
    id: string,
    days = 7,
    interval = "hourly"
  ): Promise<CoinMarketChart> => {
    try {
      console.log(`Fetching market chart for ${id} (${days} days) from CoinGecko API...`);
      const response = await axios.get(
        `${COINGECKO_API_URL}/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days,
            interval,
          },
        }
      );
      console.log(`Successfully fetched market chart for ${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching market chart for ${id}:`, error.message);
      console.log(`Falling back to mock chart data for ${id} due to API error`);
      
      // Return mock chart data as fallback
      return getMockChartData(id, days);
    }
  },

  // Get global crypto market data
  getGlobalData: async (): Promise<GlobalData> => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    
    const tryFetchGlobalData = async (): Promise<GlobalData> => {
      try {
        console.log("Fetching global market data from CoinGecko API...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await axios.get(`${COINGECKO_API_URL}/global`, {
          signal: controller.signal,
          // Add cache-busting parameter to avoid stale responses
          params: { _t: Date.now() },
        });
        
        clearTimeout(timeoutId);
        console.log("Successfully fetched global market data");
        return response.data.data;
      } catch (error: any) {
        const isNetworkError = error.message === 'Network Error' || 
                               error.name === 'AbortError' || 
                               error.code === 'ECONNABORTED';
        
        if (isNetworkError && retryCount < maxRetries) {
          retryCount++;
          console.log(`Network error, retrying (${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
          return tryFetchGlobalData();
        }
        
        console.error("Error fetching global data:", error.message);
        console.log("Falling back to mock global data");
        
        // Return mock global data as fallback
        return {
          active_cryptocurrencies: 10000,
          upcoming_icos: 0,
          ongoing_icos: 50,
          ended_icos: 3375,
          markets: 700,
          total_market_cap: { usd: 2400000000000 },
          total_volume: { usd: 110000000000 },
          market_cap_percentage: {
            btc: 51.7,
            eth: 17.3,
            usdt: 4.1,
            bnb: 3.9,
            sol: 2.5
          },
          market_cap_change_percentage_24h_usd: 1.2,
          updated_at: Date.now()
        };
      }
    };
    
    return tryFetchGlobalData();
  },

  // Search for coins
  searchCoins: async (query: string): Promise<any> => {
    try {
      console.log(`Searching for coins matching "${query}" using CoinGecko API...`);
      const response = await axios.get(`${COINGECKO_API_URL}/search`, {
        params: {
          query,
        },
      });
      console.log(`Found ${response.data.coins?.length || 0} coins matching "${query}"`);
      return response.data;
    } catch (error: any) {
      console.error(`Error searching for ${query}:`, error.message);
      
      // Return mock search results as fallback
      const filteredCoins = MOCK_COINS.filter(
        coin => coin.name.toLowerCase().includes(query.toLowerCase()) || 
                coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        coins: filteredCoins.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          market_cap_rank: coin.market_cap_rank,
          thumb: coin.image,
          large: coin.image
        }))
      };
    }
  },
};

export default coinGeckoApi;
