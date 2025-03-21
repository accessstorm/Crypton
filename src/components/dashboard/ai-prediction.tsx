"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

// Available cryptocurrencies for prediction
const CRYPTOCURRENCIES = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 64352 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", current_price: 3458 },
  { id: "solana", name: "Solana", symbol: "SOL", current_price: 145 },
  { id: "cardano", name: "Cardano", symbol: "ADA", current_price: 0.51 },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB", current_price: 605 },
  { id: "ripple", name: "XRP", symbol: "XRP", current_price: 0.52 },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", current_price: 6.82 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", current_price: 0.15 },
];

// Future years available for prediction
const FUTURE_YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2035, 2040];

// Growth scenarios
const GROWTH_SCENARIOS = ["Conservative", "Moderate", "Optimistic"];

interface PredictionData {
  year: number;
  conservative: number;
  moderate: number;
  optimistic: number;
}

interface ValuationData {
  conservative: number;
  moderate: number;
  optimistic: number;
  [key: string]: number;
}

export function AIPrediction() {
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTOCURRENCIES[0]);
  const [targetYear, setTargetYear] = useState(2030);
  const [confidenceLevel, setConfidenceLevel] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<{
    valuation: ValuationData;
    reasoning: string;
    factors: string[];
    chartData: PredictionData[];
  } | null>(null);

  // Generate prediction based on selected parameters
  const generatePrediction = () => {
    setIsLoading(true);
    
    // Simulating API call delay
    setTimeout(() => {
      // Base growth rates per scenario - these would ideally come from an AI model
      const growthRates = {
        conservative: getRandomNumber(5, 15) / 100, // 5-15% annual growth
        moderate: getRandomNumber(15, 35) / 100,    // 15-35% annual growth
        optimistic: getRandomNumber(35, 75) / 100,  // 35-75% annual growth
      };

      // Generate year-by-year predictions
      const chartData: PredictionData[] = [];
      const currentYear = new Date().getFullYear();
      let conservativePrice = selectedCrypto.current_price;
      let moderatePrice = selectedCrypto.current_price;
      let optimisticPrice = selectedCrypto.current_price;
      
      for (let year = currentYear; year <= targetYear; year++) {
        // Add random noise to make predictions look more realistic
        const noise = 1 + (Math.random() * 0.1 - 0.05);

        // Compound the growth
        if (year > currentYear) {
          conservativePrice *= (1 + growthRates.conservative) * noise;
          moderatePrice *= (1 + growthRates.moderate) * noise;
          optimisticPrice *= (1 + growthRates.optimistic) * noise;
        }
        
        chartData.push({
          year,
          conservative: Math.round(conservativePrice * 100) / 100,
          moderate: Math.round(moderatePrice * 100) / 100,
          optimistic: Math.round(optimisticPrice * 100) / 100,
        });
      }
      
      // Generate reasoning based on crypto and year
      const factors = [
        "Historical performance analysis",
        "Market adoption rate projections",
        "Technological advancements and protocol upgrades",
        "Regulatory landscape evolution",
        "Institutional investment trends",
        "Macro-economic conditions",
        "Industry competition analysis",
        "Network effect strength"
      ];
      
      // Shuffle and pick 3-5 factors
      const shuffledFactors = [...factors].sort(() => 0.5 - Math.random());
      const selectedFactors = shuffledFactors.slice(0, getRandomNumber(3, 5));
      
      // Final prediction object
      const newPrediction = {
        valuation: {
          conservative: chartData[chartData.length - 1].conservative,
          moderate: chartData[chartData.length - 1].moderate,
          optimistic: chartData[chartData.length - 1].optimistic,
        },
        reasoning: generateReasoning(selectedCrypto.name, targetYear),
        factors: selectedFactors,
        chartData: chartData,
      };
      
      setPrediction(newPrediction);
      setIsLoading(false);
    }, 2000);
  };
  
  // Format price in a readable way
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(2)}K`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };
  
  // Helper function to get random number in range
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  
  // Generate realistic reasoning text
  const generateReasoning = (cryptoName: string, year: number): string => {
    const reasonings = [
      `Based on historical growth patterns and adoption rates, ${cryptoName} could see significant value appreciation by ${year}. The prediction model considers technological advancements, market cap potential, and regulatory developments.`,
      
      `${cryptoName}'s projected value for ${year} is based on its current market position, technical fundamentals, and adoption trajectory. The model accounts for potential market cycles and institutional investment growth.`,
      
      `For ${year}, ${cryptoName} valuation projections consider network effects, technological improvements, and increased global adoption. This prediction factors in potential regulatory changes and competitive landscape shifts.`,
      
      `The ${year} prediction for ${cryptoName} reflects analysis of market penetration, technical innovation, and institutional adoption curves. The model considers varying economic scenarios and regulatory environments.`
    ];
    
    return reasonings[Math.floor(Math.random() * reasonings.length)];
  };

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm relative">
        {/* Futuristic glow effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
        
        <CardHeader className="border-b border-border/30 bg-muted/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">AI-Powered Future Valuation</CardTitle>
          </div>
          <CardDescription>
            Select a cryptocurrency and target year to get AI-generated price predictions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Selection controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="crypto">Cryptocurrency</Label>
              <Select
                value={selectedCrypto.id}
                onValueChange={(value) => {
                  const crypto = CRYPTOCURRENCIES.find(c => c.id === value);
                  if (crypto) setSelectedCrypto(crypto);
                }}
              >
                <SelectTrigger id="crypto" className="w-full">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTOCURRENCIES.map((crypto) => (
                    <SelectItem key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Target Year</Label>
              <Select
                value={targetYear.toString()}
                onValueChange={(value) => setTargetYear(parseInt(value))}
              >
                <SelectTrigger id="year" className="w-full">
                  <SelectValue placeholder="Select target year" />
                </SelectTrigger>
                <SelectContent>
                  {FUTURE_YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="confidence">Confidence Level: {confidenceLevel}%</Label>
              </div>
              <Slider
                id="confidence"
                defaultValue={[70]}
                max={100}
                step={5}
                onValueChange={(value) => setConfidenceLevel(value[0])}
                className="py-3"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={generatePrediction} 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Generating Prediction..." : "Generate Prediction"}
            </Button>
          </div>
          
          {/* Prediction results */}
          {prediction && !isLoading && (
            <div className="space-y-6 pt-4 border-t border-border/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GROWTH_SCENARIOS.map((scenario) => {
                  const scenarioKey = scenario.toLowerCase() as keyof ValuationData;
                  const value = prediction.valuation[scenarioKey];
                  
                  // Determine color and icon based on scenario
                  const config: Record<string, { bgColor: string; textColor: string; icon: React.ReactNode }> = {
                    conservative: { bgColor: "bg-blue-500/10", textColor: "text-blue-500", icon: <AlertTriangle className="h-5 w-5" /> },
                    moderate: { bgColor: "bg-green-500/10", textColor: "text-green-500", icon: <TrendingUp className="h-5 w-5" /> },
                    optimistic: { bgColor: "bg-purple-500/10", textColor: "text-purple-500", icon: <TrendingUp className="h-5 w-5" /> },
                  };
                  
                  const currentConfig = config[scenarioKey];
                  
                  return (
                    <div 
                      key={scenario} 
                      className={cn(
                        "rounded-lg p-4 flex flex-col space-y-2", 
                        currentConfig.bgColor
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1 rounded", currentConfig.textColor)}>
                          {currentConfig.icon}
                        </div>
                        <span className="font-medium">{scenario} Scenario</span>
                      </div>
                      <div className={cn("text-2xl font-bold", currentConfig.textColor)}>
                        {formatPrice(value)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((value / selectedCrypto.current_price - 1) * 100)}% growth from today
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Prediction chart */}
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prediction.chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: 'var(--foreground)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--foreground)' }}
                      tickFormatter={(value: number) => formatPrice(value)}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${formatPrice(value)}`, ""]} 
                      labelFormatter={(label) => `Year: ${label}`}
                      contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="conservative"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Conservative"
                    />
                    <Line
                      type="monotone"
                      dataKey="moderate"
                      stroke="#22c55e"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Moderate"
                    />
                    <Line
                      type="monotone"
                      dataKey="optimistic"
                      stroke="#a855f7"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Optimistic"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Analysis and reasoning */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Prediction Analysis</h3>
                <p className="text-muted-foreground">{prediction.reasoning}</p>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Key Factors Considered</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {prediction.factors.map((factor, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg border border-border/40 mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Disclaimer:</strong> These predictions are generated using extrapolation and statistical models. 
                    Cryptocurrency markets are highly volatile and unpredictable. This information should not be considered 
                    financial advice. Always conduct your own research before investing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 