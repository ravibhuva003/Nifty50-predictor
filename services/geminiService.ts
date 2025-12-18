
import { GoogleGenAI, Type } from "@google/genai";
import { MarketData, PredictionResult } from "../types";

export const predictNiftyOpening = async (data: MarketData): Promise<PredictionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a professional financial analyst specialized in Indian Equities (NSE), predict the Nifty 50 opening price at 9:15 AM IST.
    
    Data Provided:
    - Previous Day Nifty 50 Close: ${data.previousNiftyClose}
    - GIFT Nifty Session 1 (Overnight/Night) Close: ${data.giftNiftyNightClose}
    - GIFT Nifty Session 2 (Early Morning 6:30 AM - 9:00 AM) Current: ${data.giftNiftyMorningCurrent}
    - Global Market Sentiment: ${data.globalSentiment}
    - Additional Context: ${data.additionalNotes || 'None'}
    
    Logic to consider:
    1. GIFT Nifty is the primary leading indicator for Nifty 50.
    2. The opening usually tracks the delta between the previous day's Nifty close and the current GIFT Nifty level, adjusted for the basis (premium/discount).
    3. Sentiment significantly impacts whether the open sustains or reverts.
    
    Return the response strictly in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictedOpen: { type: Type.NUMBER, description: "Calculated opening price for Nifty 50" },
          gapType: { type: Type.STRING, description: "Type of opening (Gap Up/Gap Down/Flat)" },
          gapPoints: { type: Type.NUMBER, description: "Points delta from previous close" },
          confidenceScore: { type: Type.NUMBER, description: "Reliability score from 0-100" },
          reasoning: { type: Type.STRING, description: "Step by step calculation explanation" },
          sentimentAnalysis: { type: Type.STRING, description: "Brief analysis of global clues" }
        },
        required: ["predictedOpen", "gapType", "gapPoints", "confidenceScore", "reasoning", "sentimentAnalysis"]
      }
    }
  });

  return JSON.parse(response.text);
};
