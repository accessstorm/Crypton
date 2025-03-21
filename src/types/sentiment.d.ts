declare module 'sentiment' {
  export interface SentimentResult {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }

  export default class Sentiment {
    analyze(text: string, options?: any): SentimentResult;
  }
} 