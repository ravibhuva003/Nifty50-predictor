
import React from 'react';
import { PredictionResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Estimated 9:15 AM Opening</p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2">
              {prediction.predictedOpen.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
            <p className={`text-xl font-bold ${prediction.gapPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {prediction.gapPoints >= 0 ? '+' : ''}{prediction.gapPoints.toFixed(2)} Points
            </p>
          </div>

          <div className="h-40 w-40 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={confidenceData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-24 pointer-events-none">
              <span className="text-2xl font-bold text-white">{prediction.confidenceScore}%</span>
              <p className="text-[10px] text-slate-400 uppercase">Confidence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            AI Reasoning
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {prediction.reasoning}
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Sentiment Analysis
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {prediction.sentimentAnalysis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;
