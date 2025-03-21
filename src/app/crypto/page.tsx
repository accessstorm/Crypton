"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { MarketTable } from "@/components/dashboard/market-table";
import { LineChart } from "@/components/charts/line-chart";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { useMarketStore } from "@/store/market-store";
import { useSentiment } from "@/hooks/use-sentiment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function CryptoPage() {
  const { coins, loadingCoins, fetchTopCoins, fetchCoinDetails, selectedCoin, selectedCoinChartData, loadingSelectedCoinData } = useMarketStore();
  const [selectedCoinId, setSelectedCoinId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { sentimentData, loading: loadingSentiment } = useSentiment(selectedCoin?.name || "Bitcoin");
  
  useEffect(() => {
    fetchTopCoins(20);
  }, [fetchTopCoins]);
  
  useEffect(() => {
    if (selectedCoinId) {
      fetchCoinDetails(selectedCoinId);
    }
  }, [selectedCoinId, fetchCoinDetails]);
  
  // Prepare crypto data for the table
  const cryptoColumns = [
    {
      key: "name",
      title: "Name",
      render: (coin: any) => (
        <div className="flex items-center">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-6 h-6 mr-2 rounded-full"
          />
          <div>
            <div className="font-medium">{coin.name}</div>
            <div className="text-muted-foreground text-xs">{coin.symbol.toUpperCase()}</div>
          </div>
        </div>
      ),
    },
    {
      key: "current_price",
      title: "Price",
      render: (coin: any) => (
        <div>${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      ),
    },
    {
      key: "price_change_percentage_24h",
      title: "24h %",
      render: (coin: any) => (
        <div
          className={
            coin.price_change_percentage_24h >= 0
              ? "text-emerald-500"
              : "text-red-500"
          }
        >
          {coin.price_change_percentage_24h >= 0 ? "+" : ""}
          {coin.price_change_percentage_24h?.toFixed(2)}%
        </div>
      ),
    },
    {
      key: "market_cap",
      title: "Market Cap",
      render: (coin: any) => (
        <div>${(coin.market_cap / 1000000000).toFixed(2)}B</div>
      ),
    },
    {
      key: "total_volume",
      title: "Volume (24h)",
      render: (coin: any) => (
        <div>${(coin.total_volume / 1000000).toFixed(2)}M</div>
      ),
    },
  ];
  
  // Handle row click to view coin details
  const handleCoinSelect = (coin: any) => {
    setSelectedCoinId(coin.id);
  };
  
  // Prepare data for candlestick chart
  const candlestickData = selectedCoinChartData ? 
    selectedCoinChartData.map((data, index, array) => {
      const prevPrice = index > 0 ? array[index - 1].price : data.price;
      const variation = data.price * 0.02; // 2% variation for the OHLC values
      
      return {
        date: data.date,
        open: prevPrice,
        close: data.price,
        high: Math.max(prevPrice, data.price) + Math.random() * variation,
        low: Math.min(prevPrice, data.price) - Math.random() * variation,
        volume: Math.floor(Math.random() * 1000000) + 100000,
      };
    }) : [];
  
  // Time range options for the charts
  const timeRanges = [
    { label: "7D", value: "7d" },
    { label: "14D", value: "14d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
  ];
  
  // Filter coins based on search query
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Cryptocurrency Market</h1>
        
        {/* Search input */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => fetchTopCoins(20)}>Refresh Data</Button>
        </div>
        
        {/* Coin details and charts */}
        {selectedCoin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {selectedCoin.image && typeof selectedCoin.image === 'object' && 'small' in selectedCoin.image && (
                    <img
                      src={selectedCoin.image.small as string}
                      alt={selectedCoin.name}
                      className="w-6 h-6 mr-2"
                    />
                  )}
                  {selectedCoin.name} ({selectedCoin.symbol?.toUpperCase()})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-xl font-bold">
                      ${selectedCoin.market_data?.current_price?.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                    <p className={`text-xl font-bold ${
                      selectedCoin.market_data?.price_change_percentage_24h >= 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}>
                      {selectedCoin.market_data?.price_change_percentage_24h >= 0 ? "+" : ""}
                      {selectedCoin.market_data?.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                    <p className="text-xl font-bold">
                      ${(selectedCoin.market_data?.market_cap?.usd / 1000000000).toFixed(2)}B
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                    <p className="text-xl font-bold">
                      ${(selectedCoin.market_data?.total_volume?.usd / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </div>
                
                {/* Sentiment Analysis */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">AI Sentiment Analysis</h3>
                  {loadingSentiment ? (
                    <div className="animate-pulse h-20 bg-muted rounded-md"></div>
                  ) : sentimentData ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Sentiment Score</span>
                        <span className={`font-medium ${
                          sentimentData.score > 0.3 ? "text-emerald-500" : 
                          sentimentData.score < -0.3 ? "text-red-500" : 
                          "text-yellow-500"
                        }`}>
                          {sentimentData.score > 0 ? "+" : ""}
                          {sentimentData.score.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Market Trend</span>
                        <span className={`font-medium ${
                          sentimentData.trend === "bullish" ? "text-emerald-500" : 
                          sentimentData.trend === "bearish" ? "text-red-500" : 
                          "text-yellow-500"
                        }`}>
                          {sentimentData.trend.charAt(0).toUpperCase() + sentimentData.trend.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Confidence</span>
                        <span className="font-medium">{(sentimentData.confidence * 100).toFixed(0)}%</span>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-xs text-muted-foreground">Key Factors:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {sentimentData.keywords.map((keyword, i) => (
                            <span 
                              key={i} 
                              className={`text-xs px-2 py-1 rounded-full ${
                                keyword.sentiment > 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : 
                                keyword.sentiment < 0 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : 
                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {keyword.word}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No sentiment data available</div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <CandlestickChart
              title={`${selectedCoin.name} Price Chart`}
              data={candlestickData}
              timeRanges={timeRanges}
              loading={loadingSelectedCoinData}
            />
          </div>
        )}
        
        {/* Price chart for the selected coin */}
        {selectedCoinChartData && (
          <LineChart
            title={`${selectedCoin?.name || "Coin"} Price History`}
            data={selectedCoinChartData}
            dataKey="price"
            xAxisDataKey="date"
            timeRanges={timeRanges}
            loading={loadingSelectedCoinData}
          />
        )}
        
        {/* Market table */}
        <MarketTable
          title="Top Cryptocurrencies"
          data={filteredCoins}
          columns={cryptoColumns}
          loading={loadingCoins}
          onRowClick={handleCoinSelect}
        />
      </div>
    </DashboardLayout>
  );
}
