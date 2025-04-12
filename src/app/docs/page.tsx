"use client";

import { Suspense } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  ExternalLink, 
  Server, 
  Code2, 
  BookOpen,
  Brain,
  BarChart4,
  Star,
  MessageSquare,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Docs content component
function DocsContent() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground mt-2">
              Learn about Crypton&apos;s features, technologies, and implementation details
            </p>
          </div>
          <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>View GitHub Repository</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="bg-primary/5">Next.js 15</Badge>
          <Badge variant="outline" className="bg-primary/5">TypeScript</Badge>
          <Badge variant="outline" className="bg-primary/5">Tailwind CSS</Badge>
          <Badge variant="outline" className="bg-primary/5">Shadcn UI</Badge>
          <Badge variant="outline" className="bg-primary/5">Recharts</Badge>
          <Badge variant="outline" className="bg-primary/5">Zustand</Badge>
          <Badge variant="outline" className="bg-primary/5">Sentiment Analysis</Badge>
          <Badge variant="outline" className="bg-primary/5">TensorFlow.js</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
          <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
          <TabsTrigger value="features" className="py-2">Features</TabsTrigger>
          <TabsTrigger value="frontend" className="py-2">Frontend</TabsTrigger>
          <TabsTrigger value="apis" className="py-2">APIs</TabsTrigger>
          <TabsTrigger value="state" className="py-2">State Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <CardTitle>Crypton - AI-Powered Financial Dashboard</CardTitle>
              </div>
              <CardDescription>
                A comprehensive financial dashboard for tracking cryptocurrencies and stocks with AI-driven insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">
                Crypton is a modern financial dashboard built with Next.js, TypeScript, and Shadcn UI. 
                It provides real-time data visualization for cryptocurrencies and stocks, 
                along with AI-powered sentiment analysis and market predictions.
              </p>
              
              <Alert className="bg-primary/5 border border-primary/20">
                <Brain className="h-4 w-4 text-primary" />
                <AlertTitle>New Feature: AI Crypto Assistant</AlertTitle>
                <AlertDescription>
                  Our new AI Crypto Assistant powered by Google Gemini Pro provides intelligent analysis of cryptocurrency markets with real-time BTC data integration.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-muted/30 border border-muted">
                <div className="flex items-center gap-1">
                  <div className="bg-black rounded-full p-1">
                    <div className="bg-white rounded-full w-2 h-2"></div>
                  </div>
                </div>
                <AlertTitle>Improved Theme Toggle</AlertTitle>
                <AlertDescription>
                  Enhanced dark/light theme switching with persistent preferences and optimized styling throughout the application.
                </AlertDescription>
              </Alert>
              
              <Alert>
                <RefreshCw className="h-4 w-4" />
                <AlertTitle>Real-time updates</AlertTitle>
                <AlertDescription>
                  Crypton fetches and processes market data to provide up-to-date information on cryptocurrencies and stocks.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Market Data</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Real-time cryptocurrency and stock market data with interactive charts and price tracking
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Sentiment Analysis</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Social media and news sentiment analysis to gauge market mood and trends
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">AI Predictions</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Machine learning models to forecast price movements and assess market risks
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Personalized Watchlists</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Track your favorite assets with custom watchlists and price alerts
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex flex-wrap gap-4">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" /> View API Docs
              </Button>
              <Button variant="outline" className="gap-2">
                <Code2 className="h-4 w-4" /> Code Examples
              </Button>
              <Button className="gap-2 ml-auto">
                <TrendingUp className="h-4 w-4" /> Getting Started
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <CardTitle>Sentiment Analysis</CardTitle>
                </div>
                <CardDescription>
                  Understand market sentiment through social media data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Our sentiment analysis engine processes social media and news data to provide insight into market sentiment and trends.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                    <span>Social media data aggregation from Twitter, Reddit, and news sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                    <span>Natural language processing to analyze sentiment in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                    <span>Market mood indicators showing bullish/bearish trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-1" />
                    <span>Trending topics and keywords visualization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <CardTitle>AI-Powered Predictions</CardTitle>
                </div>
                <CardDescription>
                  Machine learning models for market forecasting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Leverage the power of TensorFlow.js for price predictions and risk assessment directly in your browser.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                    <span>Trend forecasting based on historical price patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                    <span>Market volatility and risk assessment metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                    <span>Confidence indicators for prediction reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-purple-500 mt-1" />
                    <span>Client-side ML processing for data privacy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-500" />
                  <CardTitle>AI Crypto Assistant</CardTitle>
                </div>
                <CardDescription>
                  Intelligent chat assistant for crypto analysis and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Interact with our AI assistant powered by Google Gemini Pro to get real-time crypto analysis and educational content.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-1" />
                    <span>Ask questions about cryptocurrencies in natural language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-1" />
                    <span>Real-time Bitcoin data integration for up-to-date insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-1" />
                    <span>Contextual responses with educational content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-1" />
                    <span>Open-source fallback options with local models (coming soon)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <CardTitle>Customizable Watchlists</CardTitle>
                </div>
                <CardDescription>
                  Track your favorite assets in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Create personalized watchlists to monitor the assets that matter most to you.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mt-1" />
                    <span>Add any cryptocurrency or stock to your watchlist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mt-1" />
                    <span>Set up price alerts with email notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mt-1" />
                    <span>Side-by-side asset comparison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 mt-1" />
                    <span>Quick access to detailed asset information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-green-500" />
                  <CardTitle>Advanced Data Visualization</CardTitle>
                </div>
                <CardDescription>
                  Interactive charts and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Explore market data through intuitive, interactive charts and visualizations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    <span>Price charts with multiple timeframe options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    <span>Market overview dashboards with key metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    <span>Candlestick and line charts for technical analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                    <span>Responsive design that works on any device</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="frontend" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <CardTitle>Frontend Technologies</CardTitle>
              </div>
              <CardDescription>
                The core technologies powering Crypton&apos;s user interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">Next.js</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Next.js is a React framework that enables server-side rendering, 
                      static site generation, and API routes. We use Next.js App Router 
                      for efficient page routing and data fetching.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Version used: Next.js 15.2.3 with Turbopack
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">TypeScript</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      TypeScript adds static typing to JavaScript, improving code quality 
                      and developer experience. All components and utilities in Crypton 
                      are written in TypeScript.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Benefits include: Better type safety, improved IDE support, and early error detection.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">Shadcn UI</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Shadcn UI is a collection of reusable components built with Radix UI 
                      and Tailwind CSS. It provides accessible, customizable UI components 
                      with a clean design.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Components used: Cards, Tabs, Buttons, Alerts, Accordions, and more.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">Recharts</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Recharts is a composable charting library built on React components. 
                      It&apos;s used for creating responsive and interactive charts for price 
                      data visualization.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Chart types: Line charts, area charts, bar charts, and candlestick charts.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">TensorFlow.js</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      TensorFlow.js is a library for machine learning in JavaScript. 
                      It&apos;s used in Crypton for client-side AI price predictions and 
                      risk assessment.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Features: In-browser ML models, real-time predictions, and offline capabilities.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium">Tailwind CSS</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Tailwind CSS is a utility-first CSS framework that allows for rapid 
                      UI development. It powers all the styling in Crypton with flexible, 
                      responsive design patterns.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Features: Dark mode support, responsive utilities, and custom design system.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apis" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle>APIs and Data Sources</CardTitle>
              </div>
              <CardDescription>
                External APIs and data services powering Crypton&apos;s insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-lg font-medium">Google Gemini API</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Google Gemini API powers the AI Crypto Assistant feature, providing intelligent 
                      responses to user queries about cryptocurrency markets, blockchain technology, 
                      and investment strategies.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Integration features: Natural language understanding, markdown-formatted responses, 
                      contextual awareness with live BTC data, and graceful fallbacks.
                    </p>
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium">Implementation Details:</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Uses the latest gemini-1.5-pro model with fallback to gemini-1.0-pro</li>
                        <li>• Implements a chat interface with user-friendly markdown rendering</li>
                        <li>• Provides system context with real-time BTC data for accurate responses</li>
                        <li>• Supports both light and dark mode themes</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-lg font-medium">CoinGecko API</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      CoinGecko provides cryptocurrency data including prices, market caps, 
                      volume, and more. Crypton uses CoinGecko API for all cryptocurrency data.
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm font-medium">Endpoints used:</p>
                      <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-muted-foreground">
                        <li>Global market data</li>
                        <li>Cryptocurrency listings</li>
                        <li>Historical price data</li>
                        <li>Market charts</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-lg font-medium">Mock Stock API</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      For demonstration purposes, Crypton uses a mock API for stock market data. 
                      In a production environment, this could be replaced with a real stock 
                      market API like Alpha Vantage, Yahoo Finance, or IEX Cloud.
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm font-medium">Simulated data:</p>
                      <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-muted-foreground">
                        <li>Top stocks listings</li>
                        <li>Historical stock prices</li>
                        <li>Market indicators</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-lg font-medium">Sentiment Analysis</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Crypton uses the Sentiment npm package to analyze social media content
                      and news articles for market sentiment assessment.
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm font-medium">Features:</p>
                      <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-muted-foreground">
                        <li>Social media sentiment scoring</li>
                        <li>Keyword extraction</li>
                        <li>Market mood indicators</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-11">
                  <AccordionTrigger className="text-lg font-medium">TensorFlow.js Models</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>
                      Crypton implements TensorFlow.js for client-side machine learning
                      to provide price predictions and risk assessment metrics.
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm font-medium">Capabilities:</p>
                      <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-muted-foreground">
                        <li>Price movement forecasting</li>
                        <li>Volatility assessment</li>
                        <li>Market risk evaluation</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="state" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                <CardTitle>State Management</CardTitle>
              </div>
              <CardDescription>
                How data is managed throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Zustand</h3>
                </div>
                <p>
                  Zustand is a small, fast, and scalable state management solution. 
                  Crypton uses Zustand for global state management, particularly for 
                  storing market data that needs to be accessed across components.
                </p>
                
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">Store Structure:</p>
                  <pre className="mt-2 text-sm overflow-auto p-2 bg-gray-100 dark:bg-gray-900 rounded">
                    <code>{`interface MarketState {
  // Cryptocurrency data
  coins: Coin[];
  globalData: GlobalData | null;
  selectedCoin: Coin | null;
  
  // Stock market data
  stocks: Stock[];
  selectedStock: Stock | null;
  
  // Social sentiment data
  socialSentiment: {
    crypto: SocialMediaData | null;
    stocks: SocialMediaData | null;
  };
  
  // AI predictions
  aiPredictions: {
    forecast: { ... } | null;
    riskAssessment: { ... } | null;
  };
  
  // User watchlist
  watchlist: (Coin | Stock)[];
  
  // Loading states & actions
  // ...
}`}</code>
                  </pre>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Custom React Hooks</h3>
                </div>
                <p>
                  Custom React hooks are used throughout Crypton to encapsulate and 
                  reuse stateful logic. These hooks provide a clean interface for 
                  accessing and manipulating application state.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-md">
                    <h4 className="font-medium text-primary">useSentiment</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fetches and manages sentiment analysis data for a specific asset
                    </p>
                    <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-900 rounded">
                      <code>{`function useSentiment(assetName: string) {
  // State and logic for sentiment analysis
  return {
    sentimentData,
    loading,
    error,
    refresh
  };
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h4 className="font-medium text-primary">useMarketStore</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Provides access to the global market data store
                    </p>
                    <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-900 rounded">
                      <code>{`const {
    coins,
    stocks,
    globalData,
    socialSentiment,
    aiPredictions,
    watchlist,
    // Actions
    fetchTopCoins,
    fetchSocialSentiment,
    addToWatchlist,
    // ...
  } = useMarketStore();`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Loading component for the docs page
function DocsLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<DocsLoading />}>
        <DocsContent />
      </Suspense>
    </DashboardLayout>
  );
}
