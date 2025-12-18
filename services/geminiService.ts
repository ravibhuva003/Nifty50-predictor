
import { GoogleGenAI, Type } from "@google/genai";
import { MarketData, PredictionResult, GroundingSource } from "../types";

export const predictNiftyOpening = async (data: MarketData, isAuto: boolean = false): Promise<PredictionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  
  if (isAuto) {
    prompt = `
      Perform professional financial research and predict the Nifty 50 metrics for the current/next session:
      
      STEP 1: Search for the following real-time data:
      - Latest closing price of Nifty 50 on NSE.
      - Current price of GIFT Nifty.
      - Closing performance of US Markets (Dow Jones Industrial Average and Nasdaq).
      - Recent support and resistance levels for Nifty 50 from analyst reports.
      
      STEP 2: Based on the searched data, perform a professional analysis to provide:
      1. Predicted 9:15 AM Opening Point.
      2. Predicted Day High Point.
      3. Predicted Day Low Point.
      
      Logic:
      - Use GIFT Nifty for the opening.
      - Use recent volatility (ATR), support/resistance levels, and global sentiment to estimate the High and Low.
      
      Return the response strictly in JSON format.
    `;
  } else {
    prompt = `
      As a professional financial analyst, predict Nifty 50 metrics based on these inputs:
      - Previous Day Nifty 50 Close: ${data.previousNiftyClose}
      - GIFT Nifty Session: ${data.giftNiftyMorningCurrent}
      - Global Market Sentiment: ${data.globalSentiment}
      - Additional Context: ${data.additionalNotes || 'None'}
      
      Provide:
      1. Predicted 9:15 AM Opening Point.
      2. Predicted Day High Point.
      3. Predicted Day Low Point.
      
      Return the response strictly in JSON format.
    `;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictedOpen: { type: Type.NUMBER, description: "Calculated opening price for Nifty 50" },
          predictedHigh: { type: Type.NUMBER, description: "Expected maximum price reached during the day" },
          predictedLow: { type: Type.NUMBER, description: "Expected minimum price reached during the day" },
          gapType: { type: Type.STRING, description: "Type of opening (Gap Up/Gap Down/Flat)" },
          gapPoints: { type: Type.NUMBER, description: "Points delta from previous close" },
          confidenceScore: { type: Type.NUMBER, description: "Reliability score from 0-100" },
          reasoning: { type: Type.STRING, description: "Step by step calculation explanation for Open, High, and Low" },
          sentimentAnalysis: { type: Type.STRING, description: "Brief analysis of global clues" },
          autoFetchedData: {
            type: Type.OBJECT,
            properties: {
              niftyClose: { type: Type.STRING, description: "The Nifty close price found" },
              giftNifty: { type: Type.STRING, description: "The GIFT Nifty price found" },
              usMarkets: { type: Type.STRING, description: "US market summary found" }
            },
            required: ["niftyClose", "giftNifty", "usMarkets"]
          }
        },
        required: ["predictedOpen", "predictedHigh", "predictedLow", "gapType", "gapPoints", "confidenceScore", "reasoning", "sentimentAnalysis"]
      }
    }
  });

  const result = JSON.parse(response.text);
  
  const sources: GroundingSource[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri) {
        sources.push({
          title: chunk.web.title || 'Market Source',
          uri: chunk.web.uri
        });
      }
    });
  }
  
  const uniqueSources = Array.from(new Set(sources.map(s => s.uri)))
    .map(uri => sources.find(s => s.uri === uri)!);

  return { ...result, sources: uniqueSources };
};
