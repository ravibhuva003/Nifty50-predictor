
import React from 'react';
import { PredictionResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction }) => {
  if (!prediction) return null;

  const confidenceData = [
    { name: 'Confidence', value: prediction.confidenceScore },
    { name: 'Risk', value: 100 - prediction.confidenceScore },
  ];

  const COLORS = ['#6366f1', '#1e293b'];

  const formatPrice = (val: number) => val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Primary Prediction Card */}
      <div className="bg-slate-800/80 p-8 rounded-2xl border-2 border-indigo-500/30 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                prediction.gapType === 'Gap Up' ? 'bg-emerald-500/20 text-emerald-400' : 
                prediction.gapType === 'Gap Down' ? 'bg-rose-500/20 text-rose-400' : 
                'bg-slate-500/20 text-slate-400'
            }`}>
                {prediction.gapType}
            </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">9:15 AM Opening Prediction</p>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2">
              {formatPrice(prediction.predictedOpen)}
            </h1>
            <p className={`text-xl font-bold ${prediction.gapPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {prediction.gapPoints >= 0 ? '+' : ''}{prediction.gapPoints.toFixed(2)} Points
            </p>
          </div>

          <div className="h-32 w-32 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  innerRadius={40}
                  outerRadius={55}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-20 pointer-events-none">
              <span className="text-xl font-bold text-white">{prediction.confidenceScore}%</span>
              <p className="text-[8px] text-slate-400 uppercase">Confidence</p>
            </div>
          </div>
        </div>

        {/* High / Low Section */}
        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-700/50">
          <div className="text-center md:text-left p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Predicted Day High
            </p>
            <p className="text-2xl font-black text-white">{formatPrice(prediction.predictedHigh)}</p>
          </div>
          <div className="text-center md:text-left p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Predicted Day Low
            </p>
            <p className="text-2xl font-black text-white">{formatPrice(prediction.predictedLow)}</p>
          </div>
        </div>
      </div>

      {/* AI Fetched Data Summary */}
      {prediction.autoFetchedData && (
        <div className="bg-indigo-900/20 border border-indigo-500/20 p-5 rounded-xl">
           <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Found Market Figures
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase">Nifty Close</p>
                <p className="text-white font-bold">{prediction.autoFetchedData.niftyClose}</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase">GIFT Nifty</p>
                <p className="text-white font-bold">{prediction.autoFetchedData.giftNifty}</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase">US Performance</p>
                <p className="text-white font-bold truncate">{prediction.autoFetchedData.usMarkets}</p>
              </div>
           </div>
        </div>
      )}

      {/* Reasoning & Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-indigo-400 font-bold mb-3 text-sm">Reasoning Engine (Open/High/Low)</h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {prediction.reasoning}
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-indigo-400 font-bold mb-3 text-sm">Sentiment Analysis</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {prediction.sentimentAnalysis}
          </p>
        </div>
      </div>

      {/* Sources */}
      {prediction.sources && prediction.sources.length > 0 && (
        <div className="pt-2">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Research Sources</h4>
          <div className="flex flex-wrap gap-2">
            {prediction.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-400 px-2 py-1 rounded transition-colors"
              >
                {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;
