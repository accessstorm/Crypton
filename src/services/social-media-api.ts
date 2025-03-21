// Import sentiment analysis library
import Sentiment from 'sentiment';

// Types
export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'news';
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  sentiment: number; // -1 to 1 scale
}

export interface SocialMediaData {
  posts: SocialMediaPost[];
  overallSentiment: number; // Average sentiment score
  marketMood: 'very_bearish' | 'bearish' | 'neutral' | 'bullish' | 'very_bullish';
  volume: number; // Number of posts analyzed
  topMentions: string[]; // Top mentioned terms
}

// Initialize sentiment analyzer
const sentimentAnalyzer = new Sentiment();

// Mock data generator
const platforms = ['twitter', 'reddit', 'news'] as const;
const authors = [
  'CryptoExpert', 'StockTrader123', 'FinanceDaily', 
  'BlockchainGuru', 'WallStreetPro', 'TechInvestor',
  'MarketWatcher', 'CoinAnalyst', 'TradingView'
];

// Sample content templates
const contentTemplates = {
  positive: [
    "{asset} showing strong bullish signals today! Price target increased by analysts. #Investing #Bullish",
    "Just bought more {asset}! The technical indicators are incredibly strong. #HODL #ToTheMoon",
    "Breaking: {asset} announces new partnership that could revolutionize the market! Expect major gains.",
    "{asset} outperforming the market again today. This trend looks sustainable. #InvestmentOpportunity",
    "Analysts upgrade {asset} rating to 'Strong Buy' citing improved fundamentals and market position."
  ],
  neutral: [
    "{asset} trading sideways today. Watching key support levels at current price. #Trading #Markets",
    "Mixed signals for {asset} as volume decreases but price holds steady. Waiting for clearer direction.",
    "New report on {asset} suggests stable growth potential with moderate risk. Worth considering.",
    "{asset} meeting expectations this quarter. No surprises in the latest data release.",
    "Holding my position in {asset} for now. Market uncertainty keeping prices in a tight range."
  ],
  negative: [
    "{asset} breaking below key support levels. Could see further downside pressure. #Trading #Bearish",
    "Just sold my {asset} position. The risk-reward ratio no longer makes sense in this market.",
    "Concerning news for {asset} holders as company faces regulatory challenges. Proceed with caution.",
    "{asset} showing weakness against competitors. Market share declining according to new report.",
    "Technical analysis suggests {asset} in a clear downtrend. Lower targets expected in coming weeks."
  ]
};

const generateMockPost = (asset: string, index: number): SocialMediaPost => {
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];
  
  // Generate content based on random sentiment direction
  const sentimentDirection = Math.random();
  let contentPool: string[];
  
  if (sentimentDirection > 0.6) {
    contentPool = contentTemplates.positive;
  } else if (sentimentDirection > 0.3) {
    contentPool = contentTemplates.neutral;
  } else {
    contentPool = contentTemplates.negative;
  }
  
  // Select random content and replace {asset} with actual asset name
  const templateContent = contentPool[Math.floor(Math.random() * contentPool.length)];
  const content = templateContent.replace(/{asset}/g, asset);
  
  // Use sentiment library to analyze the content
  const sentimentResult = sentimentAnalyzer.analyze(content);
  
  // Convert sentiment score from AFINN (-5 to 5 scale) to our -1 to 1 scale
  // Add slight randomization for variety
  const normalizedScore = (sentimentResult.comparative / 5) + (Math.random() * 0.4 - 0.2);
  const sentiment = Math.max(-1, Math.min(1, normalizedScore)); // Clamp between -1 and 1
  
  // Random date in the last 24 hours
  const timestamp = new Date();
  timestamp.setHours(timestamp.getHours() - Math.random() * 24);
  
  return {
    id: `post_${index}_${Math.random().toString(36).substring(2, 10)}`,
    platform: platform as 'twitter' | 'reddit' | 'news',
    author,
    content,
    timestamp,
    likes: Math.floor(Math.random() * 1000),
    sentiment
  };
};

const calculateMarketMood = (sentiment: number): 'very_bearish' | 'bearish' | 'neutral' | 'bullish' | 'very_bullish' => {
  if (sentiment < -0.6) return 'very_bearish';
  if (sentiment < -0.2) return 'bearish';
  if (sentiment <= 0.2) return 'neutral';
  if (sentiment <= 0.6) return 'bullish';
  return 'very_bullish';
};

// Social media API service
class SocialMediaApi {
  async getSocialSentiment(asset: string): Promise<SocialMediaData> {
    // In a real implementation, this would call external APIs to fetch data
    // For now, we'll generate mock data but analyze it with a real sentiment library
    
    // Create 15-30 mock posts
    const postCount = 15 + Math.floor(Math.random() * 15);
    const posts: SocialMediaPost[] = [];
    
    for (let i = 0; i < postCount; i++) {
      posts.push(generateMockPost(asset, i));
    }
    
    // Calculate overall sentiment (weighted by likes)
    let sentimentSum = 0;
    let likesSum = 0;
    
    for (const post of posts) {
      sentimentSum += post.sentiment * (post.likes + 1); // +1 to avoid zero weight
      likesSum += (post.likes + 1);
    }
    
    const overallSentiment = sentimentSum / likesSum;
    
    // Extract common terms
    const content = posts.map(p => p.content).join(' ');
    const words = content.split(/\s+/);
    const wordCount: Record<string, number> = {};
    
    for (const word of words) {
      // Skip short words, hashtags, mentions, and common words
      if (word.length < 4 || /^[#@]/.test(word)) continue;
      
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord && !asset.toLowerCase().includes(cleanWord) && cleanWord !== 'asset') {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    }
    
    // Sort by frequency
    const topMentions = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    return {
      posts: posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      overallSentiment,
      marketMood: calculateMarketMood(overallSentiment),
      volume: posts.length,
      topMentions
    };
  }
}

export const socialMediaApi = new SocialMediaApi(); 