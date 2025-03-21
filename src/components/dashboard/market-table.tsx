"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MarketTableProps<T> {
  title: string;
  data: T[];
  columns: {
    key: string;
    title: string;
    render?: (item: T) => React.ReactNode;
  }[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export function MarketTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  loading = false,
  onRowClick,
}: MarketTableProps<T>) {
  return (
    <Card className="w-full overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm relative">
      {/* Futuristic glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
      
      <CardHeader className="border-b border-border/30 bg-muted/30 backdrop-blur-sm">
        <CardTitle className="text-xl font-semibold flex items-center">
          <div className="w-1 h-5 bg-primary rounded-full mr-2"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/30 backdrop-blur-sm">
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-medium text-foreground/80">
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-muted/20 transition-colors duration-150">
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length > 0 ? (
                // Actual data
                data.map((item, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      "hover:bg-muted/20 transition-all duration-200",
                      onRowClick ? "cursor-pointer hover:translate-x-1" : "",
                      index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                    )}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} className="py-3">
                        {column.render
                          ? column.render(item)
                          : item[column.key] as React.ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // No data
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-6 text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
