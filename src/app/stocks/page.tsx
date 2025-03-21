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

export default function StocksPage() {
  const { 
    stocks, 
    loadingStocks, 
    fetchTopStocks, 
    fetchStockDetails, 
    selectedStock, 
    selectedStockChartData, 
    loadingSelectedStockData 
  } = useMarketStore();
  
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const { sentimentData, loading: loadingSentiment } = useSentiment(selectedStock?.name || "Apple Inc.");
  
  useEffect(() => {
    fetchTopStocks();
  }, [fetchTopStocks]);
  
  useEffect(() => {
    if (selectedStockSymbol) {
      fetchStockDetails(selectedStockSymbol);
    }
  }, [selectedStockSymbol, fetchStockDetails]);
  
  // Prepare stock data for the table
  const stockColumns = [
    {
      key: "name",
      title: "Name",
      render: (stock: any) => (
        <div>
          <div className="font-medium">{stock.name}</div>
          <div className="text-muted-foreground text-xs">{stock.symbol}</div>
        </div>
      ),
    },
    {
      key: "price",
      title: "Price",
      render: (stock: any) => (
        <div>${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      ),
    },
    {
      key: "changePercent",
      title: "Change %",
      render: (stock: any) => (
        <div
          className={
            stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"
          }
        >
          {stock.changePercent >= 0 ? "+" : ""}
          {stock.changePercent.toFixed(2)}%
        </div>
      ),
    },
    {
      key: "marketCap",
      title: "Market Cap",
      render: (stock: any) => (
        <div>${(stock.marketCap / 1000000000).toFixed(2)}B</div>
      ),
    },
    {
      key: "volume",
      title: "Volume",
      render: (stock: any) => (
        <div>{stock.volume.toLocaleString()}</div>
      ),
    },
  ];
  
  // Handle row click to view stock details
  const handleStockSelect = (stock: any) => {
    setSelectedStockSymbol(stock.symbol);
  };
  
  // Prepare line chart data for selected stock
  const lineChartData = selectedStockChartData
    ? selectedStockChartData.map((data) => ({
        date: data.date,
        price: data.close,
      }))
    : [];
  
  // Time range options for the charts
  const timeRanges = [
    { label: "7D", value: "7d" },
    { label: "14D", value: "14d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
  ];
  
  // Filter stocks based on search query
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Stock Market</h1>
        
        {/* Search input */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search stocks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => fetchTopStocks()}>Refresh Data</Button>
        </div>
        
        {/* Stock details and charts */}
        {selectedStock && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedStock.name} ({selectedStock.symbol})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-xl font-bold">
                      ${selectedStock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Change</p>
                    <p className={`text-xl font-bold ${
                      selectedStock.changePercent >= 0
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}>
                      {selectedStock.changePercent >= 0 ? "+" : ""}
                      {selectedStock.changePercent.toFixed(2)}% (${selectedStock.change.toFixed(2)})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                    <p className="text-xl font-bold">
                      ${(selectedStock.marketCap / 1000000000).toFixed(2)}B
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Volume</p>
                    <p className="text-xl font-bold">
                      {selectedStock.volume.toLocaleString()}
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
              title={`${selectedStock.name} Price Chart`}
              data={selectedStockChartData || []}
              timeRanges={timeRanges}
              loading={loadingSelectedStockData}
            />
          </div>
        )}
        
        {/* Price chart for the selected stock */}
        {selectedStockChartData && (
          <LineChart
            title={`${selectedStock?.name || "Stock"} Price History`}
            data={lineChartData}
            dataKey="price"
            xAxisDataKey="date"
            timeRanges={timeRanges}
            loading={loadingSelectedStockData}
            stroke="#0ea5e9"
          />
        )}
        
        {/* Market table */}
        <MarketTable
          title="Top Stocks"
          data={filteredStocks}
          columns={stockColumns}
          loading={loadingStocks}
          onRowClick={handleStockSelect}
        />
      </div>
    </DashboardLayout>
  );
}
