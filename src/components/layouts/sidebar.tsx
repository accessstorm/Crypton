"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  BarChart3, 
  Bitcoin, 
  TrendingUp, 
  Menu, 
  X, 
  Home,
  Settings,
  BookOpen,
  Brain,
  Star,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

// Loading placeholder for navigation items
function NavigationSkeleton() {
  return (
    <div className="space-y-2 px-4 py-6">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="h-12 bg-muted/20 animate-pulse rounded-xl"></div>
      ))}
    </div>
  );
}

// Navigation component that uses useSearchParams
function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Crypto",
      href: "/crypto",
      icon: <Bitcoin className="h-5 w-5" />,
    },
    {
      name: "Stocks",
      href: "/stocks",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      name: "Market Sentiment",
      href: "/dashboard?tab=sentiment",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "AI Predictions",
      href: "/dashboard?tab=sentiment",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      name: "Your Watchlist",
      href: "/dashboard?tab=watchlist",
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Documentation",
      href: "/docs",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];
  
  return (
    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
      {navItems.map((item) => {
        // Special case for tabs within dashboard
        const isActive = item.href.includes("?tab=")
          ? pathname === "/dashboard" && searchParams.get("tab") === item.href.split("=")[1]
          : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-sidebar-accent/30 relative overflow-hidden",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                : "text-sidebar-foreground hover:translate-x-1"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            )}
            <div className={cn(
              "transition-transform duration-200",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {item.icon}
            </div>
            <span className={cn(
              "font-medium",
              isActive ? "" : "group-hover:translate-x-1 transition-transform duration-200"
            )}>
              {item.name}
            </span>
            {isActive && (
              <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-sidebar/95 to-sidebar border-r border-sidebar-border/30 backdrop-blur-md transition-transform duration-300 ease-in-out md:translate-x-0 shadow-xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-sidebar-border/50 bg-sidebar-accent/5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative">
                <BarChart3 className="h-7 w-7 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-sidebar-foreground tracking-wide">
                CRYPT<span className="text-primary">ON</span>
              </span>
            </Link>
          </div>

          <Suspense fallback={<NavigationSkeleton />}>
            <Navigation />
          </Suspense>

          <div className="p-4 border-t border-sidebar-border/30 bg-sidebar-accent/5">
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all duration-200 hover:translate-x-1 group"
            >
              <Settings className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
