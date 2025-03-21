"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketStore } from "@/store/market-store";
import { 
  TrendingUp, 
  TrendingDown, 
  Gauge, 
  Brain
} from "lucide-react";

interface AiPredictionsProps {
  assetName: string;
}

export function AiPredictions({ assetName }: AiPredictionsProps) {
  const { 
    aiPredictions, 
    loadingAiPredictions, 
    generateAiPredictions 
  } = useMarketStore();
  
  useEffect(() => {
    if (assetName) {
      generateAiPredictions(assetName);
    }
  }, [assetName, generateAiPredictions]);
  
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Gauge className="w-5 h-5 text-yellow-500" />;
    }
  };
  
  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return "text-emerald-500";
      case 'down':
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return "text-emerald-500";
      case 'medium':
        return "text-yellow-500";
      case 'high':
        return "text-orange-500";
      case 'extreme':
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };
  
  const ConfidenceMeter = ({ value }: { value: number }) => {
    const percentage = value * 100;
    
    return (
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2 mb-1">
        <div 
          className={`h-full ${
            value > 0.7 ? "bg-emerald-500" : 
            value > 0.4 ? "bg-yellow-500" : 
            "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  
  const VolatilityMeter = ({ value }: { value: number }) => {
    const percentage = value;
    
    return (
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2 mb-1">
        <div 
          className={`h-full ${
            value < 30 ? "bg-emerald-500" : 
            value < 60 ? "bg-yellow-500" : 
            "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  
  if (loadingAiPredictions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-1/3 bg-muted rounded"></div>
            <div className="h-12 w-full bg-muted rounded"></div>
            <div className="h-24 w-full bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!aiPredictions.forecast || !aiPredictions.riskAssessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">No prediction data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const { forecast, riskAssessment } = aiPredictions;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Market Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Forecast */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Price Forecast</h3>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Predicted Direction:</span>
              <div className="flex items-center">
                {getDirectionIcon(forecast.direction)}
                <span className={`ml-1 ${getDirectionColor(forecast.direction)}`}>
                  {forecast.direction === 'up' ? 'Upward' : 
                   forecast.direction === 'down' ? 'Downward' : 'Sideways'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Potential Change:</span>
              <span className={getDirectionColor(forecast.direction)}>
                {forecast.targetChange > 0 ? '+' : ''}
                {forecast.targetChange}%
              </span>
            </div>
            
            <div className="mb-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm">{(forecast.confidence * 100).toFixed(0)}%</span>
              </div>
              <ConfidenceMeter value={forecast.confidence} />
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Forecast based on historical data patterns and market sentiment
            </div>
          </div>
        </div>
        
        {/* Risk Assessment */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Risk Assessment</h3>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Market Risk:</span>
              <span className={getRiskColor(riskAssessment.marketRisk)}>
                {riskAssessment.marketRisk.charAt(0).toUpperCase() + riskAssessment.marketRisk.slice(1)}
              </span>
            </div>
            
            <div className="mb-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Volatility Score</span>
                <span className="text-sm">{riskAssessment.volatilityScore.toFixed(0)}/100</span>
              </div>
              <VolatilityMeter value={riskAssessment.volatilityScore} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">Stability Index:</span>
              <span>{riskAssessment.stabilityIndex.toFixed(1)}/10</span>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Analysis based on current market conditions and historical volatility
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground border-t pt-3 italic">
          Note: These predictions are for informational purposes only and should not be considered as financial advice.
        </div>
      </CardContent>
    </Card>
  );
} 