"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/layouts/navbar";
import { Sidebar } from "@/components/layouts/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    router.push(value);
  };
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-br from-background to-background/95">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-auto">
        <div className="relative max-w-7xl mx-auto backdrop-blur-sm bg-background/40 border border-border/30 rounded-2xl shadow-lg p-6 overflow-hidden">
          {/* Futuristic decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-purple-500/50"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1 bg-gradient-to-r from-blue-500/50 to-primary/20"></div>
          <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0"></div>
          <div className="absolute bottom-1/4 left-0 w-1 h-32 bg-gradient-to-b from-blue-500/0 via-blue-500/30 to-blue-500/0"></div>
          
          <Navbar />
          <div className="container mt-4 px-4 md:px-6">
            <Tabs
              defaultValue={pathname}
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="/dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="/crypto">Crypto</TabsTrigger>
                <TabsTrigger value="/stocks">Stocks</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="mt-6">{children}</div>
          </div>
          <footer className="border-t mt-auto py-4">
            <div className="container flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Crypton. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Powered by CoinGecko API
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
