
import React, { useState } from 'react';
import { MarketData } from '../types';

interface MarketFormProps {
  data: MarketData;
  onChange: (data: MarketData) => void;
  onAutoSubmit: () => void;
  onManualSubmit: () => void;
  isLoading: boolean;
}

const MarketForm: React.FC<MarketFormProps> = ({ data, onChange, onAutoSubmit, onManualSubmit, isLoading }) => {
  const [showManual, setShowManual] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: name.includes('Close') || name.includes('Current') ? parseFloat(value) || 0 : value
    });
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Prediction Engine
        </h2>
        <button 
          onClick={() => setShowManual(!showManual)}
          className="text-xs text-slate-400 hover:text-white underline transition-colors"
        >
          {showManual ? "Hide Manual Input" : "Use Manual Data"}
        </button>
      </div>
      
      {!showManual ? (
        <div className="space-y-4 text-center py-6 px-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 mb-6">
          <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-300">
            Smart Predict will automatically search the web for the latest Nifty and GIFT Nifty figures.
          </p>
          <button
            onClick={onAutoSubmit}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 active:scale-95 disabled:opacity-50`}
          >
            {isLoading ? "Researching Markets..." : "Smart Auto-Predict"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Previous Nifty Close</label>
            <input
              type="number"
              name="previousNiftyClose"
              value={data.previousNiftyClose || ''}
              onChange={handleChange}
              placeholder="e.g. 24120.00"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">GIFT Nifty Current</label>
            <input
              type="number"
              name="giftNiftyMorningCurrent"
              value={data.giftNiftyMorningCurrent || ''}
              onChange={handleChange}
              placeholder="e.g. 24250.00"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-400">Notes (Optional)</label>
            <textarea
              name="additionalNotes"
              value={data.additionalNotes}
              onChange={handleChange}
              placeholder="Global events, news, etc."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none h-20"
            />
          </div>

          <button
            onClick={onManualSubmit}
            disabled={isLoading || !data.previousNiftyClose || !data.giftNiftyMorningCurrent}
            className="md:col-span-2 w-full mt-2 py-4 rounded-xl font-bold bg-slate-700 hover:bg-slate-600 text-white transition-all disabled:opacity-50"
          >
            {isLoading ? "Predicting..." : "Predict with Manual Data"}
          </button>
        </div>
      )}
      
      <p className="text-[10px] text-slate-500 mt-4 text-center">
        Data typically refreshes between 6:30 AM and 9:15 AM IST.
      </p>
    </div>
  );
};

export default MarketForm;
