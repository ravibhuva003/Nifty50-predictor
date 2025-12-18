
import { GoogleGenAI, Type } from "@google/genai";
import { MarketData, PredictionResult, GroundingSource } from "../types";

export const predictNiftyOpening = async (data: MarketData, isAuto: boolean = false): Promise<PredictionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  
  if (isAuto) {
    prompt = `
      You are an expert algorithmic trading analyst and financial investigative journalist. 
      Your task is to provide an EXHAUSTIVE analysis for the Nifty 50 opening at 9:15 AM today.
      
      PHASE 1: TEMPORAL DATA BRIDGE (3:30 PM Yesterday - 9:00 AM Today)
      - Find Nifty 50 Prev Close and GIFT Nifty at 3:30 PM (to calculate static basis).
      - Reconstruct the overnight flow: US Market Close, GIFT Nifty Night Session, and GIFT Nifty Morning Session (Live).
      
      PHASE 2: EXHAUSTIVE NEWS & ORDERS SEARCH (CRITICAL)
      You MUST search multiple financial sources (NSE/BSE filings, Moneycontrol, Economic Times, Bloomberg, Reuters) for ALL news released after 3:30 PM yesterday:
      1. GOVERNMENT ORDERS: Search for ANY and ALL Indian government orders, contract wins, or policy changes. Look specifically at sectors like Defence, Railways, Infrastructure, Green Energy, and PSU banks. Do not limit to just 2 items; provide a comprehensive list of all major orders.
      2. CORPORATE ACTIONS: Major company-specific news for Nifty 50 components and large caps. Include contract wins, earnings beats/misses, M&A announcements, or regulatory approvals.
      3. MACRO NEWS: All relevant global (US CPI, Fed, BoJ) or domestic (RBI, SEBI) news affecting the broad market sentiment.

      PHASE 3: PREDICTION
      Calculate: Predicted Open = (GIFT Nifty Current) - (Market Basis) + (News Impact Delta).
      Calculate: Predicted Day High/Low based on Support/Resistance levels found via search.

      Return the response strictly in JSON format. Ensure the marketIntelligence sections are as populated as possible with real, found data.
    `;
  } else {
    prompt = `
      Manual Analysis for Nifty 50 Metrics:
      - Previous Nifty Close: ${data.previousNiftyClose}
      - Current GIFT Nifty: ${data.giftNiftyMorningCurrent}
      
      Calculate predicted Open, High, and Low for 9:15 AM. 
      Also, search for and categorize all news released overnight based on your general knowledge and real-time grounding.
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
          predictedOpen: { type: Type.NUMBER },
          predictedHigh: { type: Type.NUMBER },
          predictedLow: { type: Type.NUMBER },
          gapType: { type: Type.STRING },
          gapPoints: { type: Type.NUMBER },
          confidenceScore: { type: Type.NUMBER },
          reasoning: { type: Type.STRING, description: "Detailed bridge analysis" },
          sentimentAnalysis: { type: Type.STRING },
          autoFetchedData: {
            type: Type.OBJECT,
            properties: {
              niftyClose: { type: Type.STRING },
              giftNiftyNightSession: { type: Type.STRING },
              giftNiftyMorningSession: { type: Type.STRING },
              globalCues: { type: Type.STRING },
              marketBasis: { type: Type.STRING }
            },
            required: ["niftyClose", "giftNiftyNightSession", "giftNiftyMorningSession", "globalCues", "marketBasis"]
          },
          marketIntelligence: {
            type: Type.OBJECT,
            properties: {
              governmentOrders: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "impact", "description"]
                },
                description: "Exhaustive list of all found government contracts and orders."
              },
              corporateActions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "impact", "description"]
                },
                description: "Exhaustive list of corporate news, earnings, and M&A."
              },
              macroNews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "impact", "description"]
                },
                description: "All macro-economic events."
              }
            },
            required: ["governmentOrders", "corporateActions", "macroNews"]
          }
        },
        required: ["predictedOpen", "predictedHigh", "predictedLow", "gapType", "gapPoints", "confidenceScore", "reasoning", "sentimentAnalysis", "marketIntelligence"]
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
  
  return { ...result, sources: Array.from(new Set(sources.map(s => s.uri))).map(uri => sources.find(s => s.uri === uri)!) };
};
