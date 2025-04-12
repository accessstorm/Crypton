"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  BarChart3, 
  Bitcoin, 
  TrendingUp, 
  ChevronRight, 
  Star,
  Brain,
  SunMoon,
  ArrowRight,
  CheckCircle2,
  MoveRight,
  Sparkles
} from "lucide-react";

// Animation components
const FadeIn = ({ 
  children, 
  delay = 0, 
  className = "", 
  ...props 
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string; 
  [key: string]: unknown
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: ReactNode; 
  title: string; 
  description: string; 
  delay?: number 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:-translate-y-1"
    >
      <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const FloatingElement = ({ 
  children, 
  className = "", 
  xOffset = [-10, 10], 
  yOffset = [-10, 10], 
  duration = 4 
}: { 
  children: ReactNode; 
  className?: string; 
  xOffset?: number[]; 
  yOffset?: number[]; 
  duration?: number 
}) => (
  <motion.div
    className={className}
    animate={{ 
      x: xOffset, 
      y: yOffset,
    }}
    transition={{ 
      repeat: Infinity, 
      repeatType: "reverse", 
      duration,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  // Track scroll position for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 20;
      if (show !== isScrolled) {
        setIsScrolled(show);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-background/90">
      {/* Floating elements in background */}
      <FloatingElement className="absolute top-[20%] left-[10%] blur-sm opacity-20">
        <div className="w-32 h-32 rounded-full bg-primary/20"></div>
      </FloatingElement>
      <FloatingElement className="absolute top-[40%] right-[15%] blur-sm opacity-10" xOffset={[-15, 15]} yOffset={[-5, 5]}>
        <div className="w-52 h-52 rounded-full bg-blue-500/10"></div>
      </FloatingElement>
      <FloatingElement className="absolute bottom-[20%] left-[20%] blur-sm opacity-15" duration={6}>
        <div className="w-40 h-40 rounded-full bg-purple-500/15"></div>
      </FloatingElement>
      
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold tracking-wide">
              CRYPT<span className="text-primary">ON</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm hover:text-primary transition-colors">Features</Link>
            <Link href="#ai-agent" className="text-sm hover:text-primary transition-colors">AI Assistant</Link>
            <Link href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link href="/docs" className="text-sm hover:text-primary transition-colors">Docs</Link>
          </nav>
          
          <Link href="/dashboard" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-5 py-2.5 flex items-center gap-2 transition-all hover:gap-3">
            Dashboard <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 md:pt-40 pb-20 md:pb-32 px-4 relative">
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 -z-10 flex items-center justify-center"
        >
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-primary/20 via-purple-500/10 to-blue-500/20 blur-3xl opacity-50"></div>
        </motion.div>
        
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-3 py-1 text-sm font-medium rounded-full border border-primary/30 bg-primary/5 inline-flex items-center gap-1 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Next-Generation Crypto Dashboard</span>
              </span>
            </motion.div>
            
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight mb-6">
                AI-Powered Crypto & Stock
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"> Analytics Dashboard</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Track cryptocurrencies and stocks with real-time data, AI predictions, and market sentiment analysis in one powerful dashboard.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/dashboard"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-8 py-3.5 text-center inline-flex items-center justify-center gap-2 transition-all hover:gap-3"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/docs"
                className="bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg px-8 py-3.5 text-center"
              >
                View Documentation
              </Link>
            </FadeIn>
          </div>
        </div>
        
        {/* Dashboard Preview */}
        <FadeIn delay={0.5} className="mt-16 max-w-6xl mx-auto relative">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative rounded-xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/20 backdrop-blur-sm z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Link 
                href="/dashboard" 
                className="bg-background/90 backdrop-blur-md hover:bg-background text-foreground font-medium rounded-lg px-6 py-2.5 inline-flex items-center gap-2"
              >
                View Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="h-[500px] relative">
              <div className="bg-background/80 backdrop-blur-md w-full h-8 flex items-center px-4 gap-2 absolute top-0 left-0 z-20 border-b border-border/30">
                <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                <div className="flex-1 text-xs text-center text-muted-foreground">Crypton Dashboard</div>
              </div>
              <img
                src="https://placehold.co/1200x800/2a2a2a/FFFFFF/png?text=Crypton+Dashboard+Preview"
                alt="Crypton Dashboard Preview"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>
        </FadeIn>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 bg-gradient-to-b from-background via-background/95 to-background relative">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <FadeIn>
              <span className="px-3 py-1 text-sm font-medium rounded-full border border-primary/30 bg-primary/5 inline-flex items-center gap-1 mb-4">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>Powerful Features</span>
              </span>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">All-in-one Crypto Intelligence Platform</h2>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <p className="text-muted-foreground">
                Crypton combines real-time data, AI predictions, and market sentiment analysis to give you the complete picture of the cryptocurrency market.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Bitcoin className="h-6 w-6 text-primary" />}
              title="Real-time Crypto Data"
              description="Track prices, market caps, and volumes for thousands of cryptocurrencies with up-to-the-minute data."
              delay={0.2}
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
              title="Stock Market Tracking"
              description="Monitor stock prices and performance metrics from major exchanges around the world."
              delay={0.3}
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-primary" />}
              title="AI Crypto Assistant"
              description="Chat with our intelligent assistant to get real-time analysis and educational content about cryptocurrency markets."
              delay={0.4}
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-primary" />}
              title="Advanced Analytics"
              description="Visualize market trends with interactive charts and detailed performance metrics."
              delay={0.5}
            />
            <FeatureCard
              icon={<Star className="h-6 w-6 text-primary" />}
              title="Custom Watchlists"
              description="Create personalized watchlists to track your favorite assets and receive price alerts."
              delay={0.6}
            />
            <FeatureCard
              icon={<SunMoon className="h-6 w-6 text-primary" />}
              title="Dark & Light Themes"
              description="Switch between dark and light modes for comfortable viewing in any environment."
              delay={0.7}
            />
          </div>
        </div>
      </section>
      
      {/* AI Agent Section */}
      <section id="ai-agent" className="py-20 md:py-32 px-4 relative overflow-hidden">
        <FloatingElement className="absolute top-[20%] right-[10%] blur-sm opacity-10" duration={5}>
          <div className="w-40 h-40 rounded-full bg-indigo-500/15"></div>
        </FloatingElement>
        
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <FadeIn>
                <span className="px-3 py-1 text-sm font-medium rounded-full border border-primary/30 bg-primary/5 inline-flex items-center gap-1 mb-4">
                  <Brain className="h-3.5 w-3.5 text-primary" />
                  <span>AI-Powered Assistant</span>
                </span>
              </FadeIn>
              
              <FadeIn delay={0.1}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Smart Insights with Our AI Crypto Assistant</h2>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <p className="text-muted-foreground mb-8">
                  Our AI assistant powered by Google Gemini Pro analyzes real-time market data to provide you with intelligent insights and educational content about cryptocurrency markets.
                </p>
              </FadeIn>
              
              <div className="space-y-4">
                <FadeIn delay={0.3} className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Natural Language Queries</h3>
                    <p className="text-sm text-muted-foreground">Ask questions like &quot;What&apos;s BTC doing today?&quot; and get detailed answers.</p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.4} className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-time Data Integration</h3>
                    <p className="text-sm text-muted-foreground">AI responses include the latest Bitcoin data for accurate insights.</p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.5} className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Educational Content</h3>
                    <p className="text-sm text-muted-foreground">Learn about blockchain technology and crypto concepts from our AI.</p>
                  </div>
                </FadeIn>
              </div>
              
              <FadeIn delay={0.6} className="mt-8">
                <Link
                  href="/dashboard/ai-agent"
                  className="bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg px-6 py-3 inline-flex items-center gap-2 transition-all hover:gap-3"
                >
                  Try AI Assistant <MoveRight className="h-4 w-4" />
                </Link>
              </FadeIn>
            </div>
            
            <FadeIn delay={0.2} className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-background/90 to-background/50 rounded-xl overflow-hidden border border-border/30 shadow-xl">
                <div className="border-b border-border/30 p-4 flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">AI Crypto Assistant</h3>
                </div>
                <div className="p-4 h-[400px] overflow-y-auto space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                      <p>What&apos;s BTC doing today?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 max-w-[80%] space-y-2">
                      <p>Bitcoin (BTC) is currently trading at <span className="font-medium">$65,421</span> with a 24-hour change of <span className="text-emerald-500">+2.8%</span>.</p>
                      <p>Key metrics today:</p>
                      <ul className="list-disc pl-5 text-sm">
                        <li>24h Volume: $28.9 billion</li>
                        <li>Market Cap: $1.28 trillion</li>
                        <li>Dominance: 53.2%</li>
                      </ul>
                      <p>Overall market sentiment is bullish with strong institutional buying pressure.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                      <p>Explain blockchain technology</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                      <p>Blockchain is a distributed, immutable ledger technology that records transactions across multiple computers. Key features include:</p>
                      <ul className="list-disc pl-5 text-sm mt-2">
                        <li><span className="font-medium">Decentralization:</span> No single authority controls the network</li>
                        <li><span className="font-medium">Transparency:</span> All transactions are publicly visible</li>
                        <li><span className="font-medium">Immutability:</span> Once recorded, data cannot be altered</li>
                        <li><span className="font-medium">Security:</span> Cryptographic techniques ensure data integrity</li>
                      </ul>
                      <p className="mt-2">This technology underpins cryptocurrencies like Bitcoin and has applications beyond finance in supply chain, healthcare, and more.</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border/30 p-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask something about crypto..."
                    className="flex-1 bg-background/50 border border-border/50 rounded-lg px-4 py-2 text-sm"
                    disabled
                  />
                  <button className="bg-primary text-primary-foreground rounded-lg p-2" disabled>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/0"></div>
        
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-purple-500/50"></div>
            <div className="absolute bottom-0 right-0 w-1/3 h-1 bg-gradient-to-r from-blue-500/50 to-primary/20"></div>
            
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Tracking Your Crypto Portfolio Today</h2>
              </FadeIn>
              
              <FadeIn delay={0.1}>
                <p className="text-muted-foreground mb-8">
                  Join thousands of traders and investors who use Crypton to make informed decisions in the cryptocurrency and stock markets.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-8 py-3.5 text-center flex items-center justify-center gap-2 transition-all hover:gap-3"
                >
                  Launch Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg px-8 py-3.5 text-center"
                >
                  View Documentation
                </Link>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border/30 bg-background/50 backdrop-blur-sm py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold tracking-wide">
                CRYPT<span className="text-primary">ON</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link href="#ai-agent" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Assistant</Link>
            </div>
          </div>
          
          <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Crypton. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by Next.js, Shadcn UI, and CoinGecko API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
