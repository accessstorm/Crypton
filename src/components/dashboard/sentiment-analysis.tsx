"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketStore } from "@/store/market-store";
import { 
  TrendingUp, 
  TrendingDown, 
  Gauge, 
  Twitter, 
  MessageSquare,
  Newspaper,
  Clock
} from "lucide-react";
import { SocialMediaPost } from "@/services/social-media-api";
import { formatDistanceToNow } from "date-fns";

interface SentimentAnalysisProps {
  assetName: string;
  type: 'crypto' | 'stocks';
}

export function SentimentAnalysis({ assetName, type }: SentimentAnalysisProps) {
  const { 
    socialSentiment, 
    loadingSocialSentiment, 
    fetchSocialSentiment 
  } = useMarketStore();
  
  useEffect(() => {
    if (assetName) {
      fetchSocialSentiment(assetName, type);
    }
  }, [assetName, type, fetchSocialSentiment]);
  
  const sentimentData = type === 'crypto' 
    ? socialSentiment.crypto
    : socialSentiment.stocks;
  
  const getSentimentColor = (score: number) => {
    if (score > 0.6) return "text-emerald-500";
    if (score > 0.2) return "text-emerald-400";
    if (score > -0.2) return "text-yellow-500";
    if (score > -0.6) return "text-orange-500";
    return "text-red-500";
  };
  
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'very_bullish':
      case 'bullish':
        return <TrendingUp className="w-6 h-6 text-emerald-500" />;
      case 'very_bearish':
      case 'bearish':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <Gauge className="w-6 h-6 text-yellow-500" />;
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'reddit':
        return <MessageSquare className="w-4 h-4" />;
      case 'news':
        return <Newspaper className="w-4 h-4" />;
      default:
        return null;
    }
  };
  
  const getMoodText = (mood: string) => {
    return mood.replace('_', ' ').charAt(0).toUpperCase() + mood.replace('_', ' ').slice(1);
  };
  
  const SentimentProgressBar = ({ value }: { value: number }) => {
    // Convert -1 to 1 scale to 0-100% for the progress bar
    const percentage = ((value + 1) / 2) * 100;
    
    return (
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
        <div 
          className={`h-full ${
            value > 0.3 ? "bg-emerald-500" : 
            value > -0.3 ? "bg-yellow-500" : 
            "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  
  const SocialPost = ({ post }: { post: SocialMediaPost }) => {
    return (
      <div className="p-3 border dark:border-gray-800 rounded-lg mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getPlatformIcon(post.platform)}
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {formatDistanceToNow(post.timestamp, { addSuffix: true })}
          </div>
        </div>
        <p className="text-sm mb-2">{post.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-muted-foreground">
            <span className={getSentimentColor(post.sentiment)}>
              Sentiment: {post.sentiment.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {post.likes} likes
          </div>
        </div>
      </div>
    );
  };
  
  if (loadingSocialSentiment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-1/3 bg-muted rounded"></div>
            <div className="h-12 w-full bg-muted rounded"></div>
            <div className="h-24 w-full bg-muted rounded"></div>
            <div className="h-40 w-full bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!sentimentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">No sentiment data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              {getMoodIcon(sentimentData.marketMood)}
              Market Mood: {getMoodText(sentimentData.marketMood)}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Based on {sentimentData.volume} social media posts and news articles
            </p>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bearish</span>
                <span className={`text-sm font-medium ${getSentimentColor(sentimentData.overallSentiment)}`}>
                  {sentimentData.overallSentiment.toFixed(2)}
                </span>
                <span className="text-sm">Bullish</span>
              </div>
              <SentimentProgressBar value={sentimentData.overallSentiment} />
            </div>
            
            {/* Key mentions */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Trending Topics</h4>
              <div className="flex flex-wrap gap-2">
                {sentimentData.topMentions.map((mention, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-primary/10 rounded-full"
                  >
                    #{mention}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent posts */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Posts</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {sentimentData.posts.slice(0, 5).map((post) => (
              <SocialPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 