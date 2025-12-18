
export interface MarketData {
  previousNiftyClose?: number;
  giftNiftyNightClose?: number;
  giftNiftyMorningCurrent?: number;
  globalSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  additionalNotes?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface PredictionResult {
  predictedOpen: number;
  predictedHigh: number;
  predictedLow: number;
  gapType: 'Gap Up' | 'Gap Down' | 'Flat';
  gapPoints: number;
  confidenceScore: number;
  reasoning: string;
  sentimentAnalysis: string;
  autoFetchedData?: {
    niftyClose: string;
    giftNifty: string;
    usMarkets: string;
  };
  sources?: GroundingSource[];
}

export enum PredictionStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
