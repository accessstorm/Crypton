"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading = false,
  className,
}: StatCardProps) {
  // Determine trend style
  const trendClassName = trend
    ? trend > 0
      ? "text-emerald-500"
      : "text-red-500"
    : "";
  
  const trendValue = trend
    ? `${trend > 0 ? "+" : ""}${trend.toFixed(2)}%`
    : null;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-28 animate-pulse rounded bg-muted"></div>
        ) : (
          <div className="text-2xl font-bold">
            {value}
            {trendValue && (
              <span className={`ml-2 text-sm font-normal ${trendClassName}`}>
                {trendValue}
              </span>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
