
import React, { useState } from 'react';
import MarketForm from './components/MarketForm';
import PredictionDisplay from './components/PredictionDisplay';
import { MarketData, PredictionResult, PredictionStatus } from './types';
import { predictNiftyOpening } from './services/geminiService';

const App: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    previousNiftyClose: 0,
    giftNiftyNightClose: 0,
    giftNiftyMorningCurrent: 0,
    globalSentiment: 'Neutral',
    additionalNotes: ''
  });

  const [status, setStatus] = useState<PredictionStatus>(PredictionStatus.IDLE);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (isAuto: boolean = false) => {
    setStatus(PredictionStatus.LOADING);
    setError(null);
    try {
      const result = await predictNiftyOpening(marketData, isAuto);
      setPrediction(result);
      setStatus(PredictionStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Prediction failed. The market data might be unavailable or formatted incorrectly.');
      setStatus(PredictionStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Nifty<span className="text-indigo-500">Pulse</span> AI
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Indicators Active
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">AI Market Intelligence</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Automatically scan global indices and GIFT Nifty movements using Google Search grounding. Get high-probability opening estimates at the click of a button.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <MarketForm 
              data={marketData} 
              onChange={setMarketData} 
              onAutoSubmit={() => handlePredict(true)}
              onManualSubmit={() => handlePredict(false)}
              isLoading={status === PredictionStatus.LOADING}
            />
            
            {error && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {status === PredictionStatus.IDLE && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">Automated Prediction Ready</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">
                  Click "Smart Auto-Predict" to let the AI fetch the latest data from the web for you.
                </p>
              </div>
            )}

            {status === PredictionStatus.LOADING && (
              <div className="h-full min-h-[400px] bg-slate-800/30 rounded-2xl flex flex-col items-center justify-center p-10 animate-pulse border border-indigo-500/20">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-indigo-400 font-medium text-lg">AI is searching market data...</p>
                <p className="text-slate-500 text-sm mt-2 text-center max-w-xs">
                  Reviewing Nifty close, GIFT Nifty current, and US market sessions...
                </p>
              </div>
            )}

            {status === PredictionStatus.SUCCESS && prediction && (
              <PredictionDisplay prediction={prediction} />
            )}
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-6 pb-12">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Financial Disclosure</h4>
            <p className="text-[11px] text-slate-500 max-w-3xl leading-relaxed">
              This application uses Gemini 3 Pro with web search capabilities. "Auto-Predict" results are derived from third-party data sources found on the internet. Trading involves significant risk. Always cross-verify data with your broker or official exchange terminals before executing trades.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
