"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LineChart } from "@/components/charts/line-chart";
import { MarketTable } from "@/components/dashboard/market-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { SentimentAnalysis } from "@/components/dashboard/sentiment-analysis";
import { AIPrediction } from "@/components/dashboard/ai-prediction";
import { Watchlist } from "@/components/dashboard/watchlist";
import { useMarketStore } from "@/store/market-store";
import { BarChart3, TrendingUp, DollarSign, ArrowUpDown, Brain, BarChartHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coin } from "@/services/coingecko-api";
import { Stock } from "@/services/stock-api";
import React from "react";

// Wrap the components that use useSearchParams in a separate client component
function DashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("markets");
  
  // Set active tab based on URL parameter
  useEffect(() => {
    if (tabParam && ["markets", "sentiment", "watchlist"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const {
    coins,
    stocks,
    globalData,
    loadingCoins,
    loadingStocks,
    loadingGlobalData,
    fetchTopCoins,
    fetchTopStocks,
    fetchGlobalData,
  } = useMarketStore();

  useEffect(() => {
    fetchTopCoins(10);
    fetchTopStocks();
    fetchGlobalData();
  }, [fetchTopCoins, fetchTopStocks, fetchGlobalData]);

  // Format data for price comparison chart
  const priceChartData = coins.slice(0, 5).map((coin) => ({
    name: coin.symbol.toUpperCase(),
    price: coin.current_price,
  }));

  // Create a simple trend data (for demonstration)
  const trendData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      name: date.toLocaleDateString(undefined, { weekday: 'short' }),
      price: 35000 + Math.random() * 5000, // Simulated Bitcoin price
    };
  });

  // Columns for the crypto table
  const cryptoColumns = [
    {
      key: "name",
      title: "Name",
      render: (coin: Record<string, unknown>) => {
        const coinData = coin as unknown as Coin;
        return (
          <div className="flex items-center">
            {coinData.image && (
              <img
                src={coinData.image}
                alt={coinData.name}
                className="w-6 h-6 mr-2 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{coinData.name}</div>
              <div className="text-xs text-muted-foreground">
                {coinData.symbol.toUpperCase()}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "current_price",
      title: "Price",
      render: (coin: Record<string, unknown>) => {
        const coinData = coin as unknown as Coin;
        return (
          <div className="text-right">
            ${coinData.current_price.toLocaleString()}
          </div>
        );
      },
    },
    {
      key: "price_change_percentage_24h",
      title: "24h Change",
      render: (coin: Record<string, unknown>) => {
        const coinData = coin as unknown as Coin;
        return (
          <div
            className={`text-right ${
              coinData.price_change_percentage_24h >= 0
                ? "text-emerald-500"
                : "text-red-500"
            }`}
          >
            {coinData.price_change_percentage_24h >= 0 ? "+" : ""}
            {coinData.price_change_percentage_24h?.toFixed(2)}%
          </div>
        );
      },
    },
  ];

  // Columns for the stocks table
  const stockColumns = [
    {
      key: "name",
      title: "Name",
      render: (stock: Record<string, unknown>) => {
        const stockData = stock as unknown as Stock;
        return (
          <div>
            <div className="font-medium">{stockData.name}</div>
            <div className="text-xs text-muted-foreground">
              {stockData.symbol.toUpperCase()}
            </div>
          </div>
        );
      },
    },
    {
      key: "price",
      title: "Price",
      render: (stock: Record<string, unknown>) => {
        const stockData = stock as unknown as Stock;
        return (
          <div className="text-right">${stockData.price.toLocaleString()}</div>
        );
      },
    },
    {
      key: "changePercent",
      title: "Change",
      render: (stock: Record<string, unknown>) => {
        const stockData = stock as unknown as Stock;
        return (
          <div
            className={`text-right ${
              stockData.changePercent >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {stockData.changePercent >= 0 ? "+" : ""}
            {stockData.changePercent.toFixed(2)}%
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Market Overview</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Market Cap"
          value={
            globalData
              ? `$${(
                  globalData.total_market_cap.usd / 1000000000000
                ).toFixed(2)}T`
              : "$0"
          }
          description="Total cryptocurrency market cap"
          icon={DollarSign}
          trend={globalData?.market_cap_change_percentage_24h_usd}
          loading={loadingGlobalData}
        />
        <StatCard
          title="24h Volume"
          value={
            globalData
              ? `$${(globalData.total_volume.usd / 1000000000).toFixed(2)}B`
              : "$0"
          }
          description="Total 24h trading volume"
          icon={ArrowUpDown}
          loading={loadingGlobalData}
        />
        <StatCard
          title="Active Cryptocurrencies"
          value={globalData?.active_cryptocurrencies.toLocaleString() || "0"}
          description="Number of active coins"
          icon={BarChart3}
          loading={loadingGlobalData}
        />
        <StatCard
          title="BTC Dominance"
          value={
            globalData
              ? `${globalData.market_cap_percentage.btc.toFixed(2)}%`
              : "0%"
          }
          description="Bitcoin's market share"
          icon={TrendingUp}
          loading={loadingGlobalData}
        />
      </div>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment & AI</TabsTrigger>
          <TabsTrigger value="watchlist">Your Watchlist</TabsTrigger>
        </TabsList>
        
        {/* Markets Tab */}
        <TabsContent value="markets" className="space-y-6">
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              title="Top Crypto Price Comparison"
              data={priceChartData}
              dataKey="price"
              xAxisDataKey="name"
              loading={loadingCoins}
              height={300}
            />
            <LineChart
              title="Bitcoin 7-Day Price Trend"
              data={trendData}
              dataKey="price"
              xAxisDataKey="name"
              loading={loadingCoins}
              height={300}
              stroke="#F7931A"
            />
          </div>

          {/* Tables row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketTable
              title="Top Cryptocurrencies"
              data={coins as unknown as Record<string, unknown>[]}
              columns={cryptoColumns}
              loading={loadingCoins}
            />
            <MarketTable
              title="Top Stocks"
              data={stocks as unknown as Record<string, unknown>[]}
              columns={stockColumns}
              loading={loadingStocks}
            />
          </div>
        </TabsContent>
        
        {/* Sentiment & AI Tab */}
        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <AIPrediction />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SentimentAnalysis 
              assetName="Cryptocurrency Market" 
              type="crypto" 
            />
            <SentimentAnalysis 
              assetName="Stock Market" 
              type="stocks" 
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">AI Insights:</span>
              <span className="text-sm ml-2">
                Market sentiment appears to be cautiously optimistic with moderate volatility expected in the coming week.
              </span>
            </div>
            <BarChartHorizontal className="w-5 h-5 text-primary" />
          </div>
        </TabsContent>
        
        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="space-y-6">
          <Watchlist />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Loading fallback component
function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </DashboardLayout>
  );
}
