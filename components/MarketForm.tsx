
import React from 'react';
import { MarketData } from '../types';

interface MarketFormProps {
  data: MarketData;
  onChange: (data: MarketData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const MarketForm: React.FC<MarketFormProps> = ({ data, onChange, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: name.includes('Close') || name.includes('Current') ? parseFloat(value) || 0 : value
    });
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Market Data Input
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Previous Nifty Close</label>
          <input
            type="number"
            name="previousNiftyClose"
            value={data.previousNiftyClose || ''}
            onChange={handleChange}
            placeholder="e.g. 22147.50"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Global Sentiment</label>
          <select
            name="globalSentiment"
            value={data.globalSentiment}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="Bullish">Bullish</option>
            <option value="Neutral">Neutral</option>
            <option value="Bearish">Bearish</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">GIFT Nifty Night Close</label>
          <input
            type="number"
            name="giftNiftyNightClose"
            value={data.giftNiftyNightClose || ''}
            onChange={handleChange}
            placeholder="e.g. 22250.00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">GIFT Nifty Morning Current</label>
          <input
            type="number"
            name="giftNiftyMorningCurrent"
            value={data.giftNiftyMorningCurrent || ''}
            onChange={handleChange}
            placeholder="e.g. 22285.00"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-400">Notes (Optional)</label>
          <textarea
            name="additionalNotes"
            value={data.additionalNotes}
            onChange={handleChange}
            placeholder="Mention US market performance, news, or crude oil impact..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
          />
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading || !data.previousNiftyClose || !data.giftNiftyMorningCurrent}
        className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
          isLoading 
          ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 active:scale-95'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Market Clues...
          </>
        ) : (
          'Predict Opening Point'
        )}
      </button>
    </div>
  );
};

export default MarketForm;
