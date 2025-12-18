
export interface MarketData {
  previousNiftyClose: number;
  giftNiftyNightClose: number;
  giftNiftyMorningCurrent: number;
  globalSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  additionalNotes?: string;
}

export interface PredictionResult {
  predictedOpen: number;
  gapType: 'Gap Up' | 'Gap Down' | 'Flat';
  gapPoints: number;
  confidenceScore: number;
  reasoning: string;
  sentimentAnalysis: string;
}

export enum PredictionStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
