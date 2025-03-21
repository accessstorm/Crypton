"use client";

import { useState } from "react";
import { useMarketStore } from "@/store/market-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Trash2, 
  Star, 
  Search,
  Bell,
  BellOff,
  ChevronRight
} from "lucide-react";
import { Coin } from "@/services/coingecko-api";
import { Stock } from "@/services/stock-api";
import { useRouter } from "next/navigation";

export function Watchlist() {
  const { 
    watchlist, 
    removeFromWatchlist 
  } = useMarketStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [alertsEnabled, setAlertsEnabled] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  const toggleAlert = (id: string) => {
    setAlertsEnabled(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search for assets to add to watchlist
    console.log("Searching for:", searchQuery);
  };
  
  const navigateToAsset = (item: Coin | Stock) => {
    if ('symbol' in item && typeof item.symbol === 'string') {
      // It's a stock
      router.push(`/stocks?symbol=${item.symbol}`);
    } else if ('id' in item) {
      // It's a crypto
      router.push(`/crypto?id=${item.id}`);
    }
  };
  
  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-500" : "text-red-500";
  };
  
  // Helper to get price change for both crypto and stocks
  const getPriceChange = (item: Coin | Stock) => {
    if ('price_change_percentage_24h' in item) {
      // It's a crypto
      return item.price_change_percentage_24h || 0;
    } else if ('changePercent' in item) {
      // It's a stock
      return item.changePercent;
    }
    return 0;
  };
  
  // Helper to get current price for both crypto and stocks
  const getCurrentPrice = (item: Coin | Stock) => {
    if ('current_price' in item) {
      // It's a crypto
      return item.current_price;
    } else if ('price' in item) {
      // It's a stock
      return item.price;
    }
    return 0;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Your Watchlist
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {watchlist.length} assets
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search form to add new items */}
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <Input
            placeholder="Add stock or crypto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Search className="w-4 h-4 mr-1" />
            Add
          </Button>
        </form>
        
        {/* Watchlist items */}
        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Your watchlist is empty</p>
            <p className="text-sm mt-1">Add assets to track them here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {watchlist.map((item) => {
              const id = 'id' in item ? item.id : item.symbol;
              const name = 'name' in item && typeof item.name === 'string' ? item.name : 'Unknown';
              const symbol = 'symbol' in item && typeof item.symbol === 'string' ? item.symbol : '';
              const priceChange = getPriceChange(item);
              const currentPrice = getCurrentPrice(item);
              
              return (
                <div 
                  key={typeof id === 'string' ? id : String(id)} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  onClick={() => navigateToAsset(item)}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {'id' in item ? (
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold">
                          {symbol.substring(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xs font-bold">
                          {symbol.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      <p className={`text-xs ${getChangeColor(priceChange)}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAlert(id.toString());
                        }}
                      >
                        {alertsEnabled[id.toString()] ? (
                          <Bell className="w-4 h-4 text-primary" />
                        ) : (
                          <BellOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(id.toString());
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {watchlist.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground border-t pt-3">
            <p>Click on any asset to see detailed information</p>
            <p>Set alerts by clicking the bell icon</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 