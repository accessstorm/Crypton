"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
} from "recharts";

interface CandlestickChartProps {
  title: string;
  data: any[];
  height?: number;
  timeRanges?: { label: string; value: string }[];
  onTimeRangeChange?: (range: string) => void;
  loading?: boolean;
}

// Helper function to format prices as USD
const formatPrice = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function CandlestickChart({
  title,
  data,
  height = 350,
  timeRanges,
  onTimeRangeChange,
  loading = false,
}: CandlestickChartProps) {
  const [activeTimeRange, setActiveTimeRange] = useState(
    timeRanges?.[0]?.value || "7d"
  );

  // Format data for the candlestick chart
  const formattedData = data.map((item) => ({
    name: typeof item.date === 'string' ? new Date(item.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : item.date,
    low: item.low,
    high: item.high,
    open: item.open,
    close: item.close,
    color: item.close >= item.open ? "#22c55e" : "#ef4444",
    volume: item.volume,
  }));

  const handleTimeRangeChange = (value: string) => {
    setActiveTimeRange(value);
    if (onTimeRangeChange) {
      onTimeRangeChange(value);
    }
  };

  // Custom tooltip to display OHLC values
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">Open: {formatPrice(data.open)}</p>
          <p className="text-sm">High: {formatPrice(data.high)}</p>
          <p className="text-sm">Low: {formatPrice(data.low)}</p>
          <p className="text-sm">Close: {formatPrice(data.close)}</p>
          <p className="text-sm">Volume: {data.volume.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {timeRanges && (
          <Tabs
            value={activeTimeRange}
            className="w-auto"
            onValueChange={handleTimeRangeChange}
          >
            <TabsList className="grid grid-cols-4 h-8">
              {timeRanges.map((range) => (
                <TabsTrigger
                  key={range.value}
                  value={range.value}
                  className="text-xs px-2"
                >
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatPrice}
                domain={['auto', 'auto']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* High-Low Line */}
              <Bar
                dataKey="low"
                yAxisId="left"
                fill="transparent"
                stroke="transparent"
              />
              <Bar
                dataKey="high"
                yAxisId="left"
                fill="transparent"
                stroke="transparent"
              />
              
              {/* Candlestick Bars */}
              {formattedData.map((entry, index) => (
                <Bar
                  key={`candle-${index}`}
                  dataKey="close"
                  yAxisId="left"
                  fill={entry.color}
                  stroke={entry.color}
                  barSize={10}
                  data={[entry]}
                />
              ))}
              
              {/* Volume */}
              <Bar
                dataKey="volume"
                yAxisId="right"
                fill="rgba(100, 116, 139, 0.4)"
                opacity={0.5}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
