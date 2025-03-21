"use client";

import { useState } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LineChartProps {
  title: string;
  data: any[];
  dataKey: string;
  xAxisDataKey?: string;
  color?: string;
  height?: number;
  timeRanges?: { label: string; value: string }[];
  onTimeRangeChange?: (range: string) => void;
  loading?: boolean;
  formatter?: (value: number) => string;
  stroke?: string;
}

export function LineChart({
  title,
  data,
  dataKey,
  xAxisDataKey = "name",
  color = "hsl(var(--primary))",
  height = 350,
  timeRanges,
  onTimeRangeChange,
  loading = false,
  formatter = (value) => `$${value.toLocaleString()}`,
  stroke = "#8884d8",
}: LineChartProps) {
  const [activeTimeRange, setActiveTimeRange] = useState(
    timeRanges?.[0]?.value || "7d"
  );

  const handleTimeRangeChange = (value: string) => {
    setActiveTimeRange(value);
    if (onTimeRangeChange) {
      onTimeRangeChange(value);
    }
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
            <RechartsLineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey={xAxisDataKey}
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatter}
              />
              <Tooltip
                formatter={formatter}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={stroke}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
