
import React from 'react';
import { PredictionResult, NewsItem } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PredictionDisplayProps {
  prediction: PredictionResult | null;
}

const NewsBlock: React.FC<{ title: string; items: NewsItem[]; icon: React.ReactNode; colorClass: string; borderColor: string }> = ({ title, items, icon, colorClass, borderColor }) => {
  if (items.length === 0) return null;
  return (
    <div className={`bg-slate-800/40 border-l-4 ${borderColor} p-6 rounded-r-2xl rounded-l-none`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xs font-bold ${colorClass} uppercase tracking-widest flex items-center gap-2`}>
          {icon}
          {title}
        </h3>
        <span className="bg-slate-900 text-[10px] text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
          {items.length} {items.length === 1 ? 'Update' : 'Updates'} Found
        </span>
      </div>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx} className="group border-b border-slate-700/50 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start gap-3 mb-2">
              <span className={`mt-1 shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                item.impact === 'Positive' ? 'bg-emerald-500/20 text-emerald-400' :
                item.impact === 'Negative' ? 'bg-rose-500/20 text-rose-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {item.impact}
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      {/* 1. Main Dashboard Card */}
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

          <div className="h-28 w-28 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={confidenceData} innerRadius={35} outerRadius={48} paddingAngle={5} dataKey="value" stroke="none">
                  {confidenceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-16 pointer-events-none">
              <span className="text-lg font-bold text-white">{prediction.confidenceScore}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-700/50">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Expected High</p>
            <p className="text-2xl font-black text-white">{formatPrice(prediction.predictedHigh)}</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-1">Expected Low</p>
            <p className="text-2xl font-black text-white">{formatPrice(prediction.predictedLow)}</p>
          </div>
        </div>
      </div>

      {/* 2. Market Intelligence Hub (Exhaustive News) */}
      <div className="space-y-6">
        <h2 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em] px-1 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-indigo-500"></span>
          Institutional Intelligence Hub
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          <NewsBlock 
            title="Indian Government Orders & Contract Wins" 
            items={prediction.marketIntelligence.governmentOrders} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            colorClass="text-amber-400"
            borderColor="border-amber-500"
          />
          
          <NewsBlock 
            title="Major Corporate Actions & Earnings" 
            items={prediction.marketIntelligence.corporateActions} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            colorClass="text-indigo-400"
            borderColor="border-indigo-500"
          />

          <NewsBlock 
            title="Macro-Economic Global Updates" 
            items={prediction.marketIntelligence.macroNews} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>}
            colorClass="text-sky-400"
            borderColor="border-sky-500"
          />
        </div>
      </div>

      {/* 3. Reconstructed Market Timeline */}
      {prediction.autoFetchedData && (
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Market Analysis Timeline (3:30 PM - 9:00 AM)
          </h3>
          
          <div className="relative border-l-2 border-slate-800 ml-3 space-y-8">
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-slate-800 border-2 border-indigo-500 rounded-full"></div>
              <p className="text-[10px] text-indigo-400 font-bold">3:30 PM (Prev Close)</p>
              <p className="text-sm text-white font-medium">Nifty: {prediction.autoFetchedData.niftyClose}</p>
              <p className="text-[10px] text-slate-500">Basis: {prediction.autoFetchedData.marketBasis}</p>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-slate-800 border-2 border-indigo-500 rounded-full"></div>
              <p className="text-[10px] text-indigo-400 font-bold">Overnight Sentiment Flow</p>
              <p className="text-sm text-white font-medium">GIFT Night: {prediction.autoFetchedData.giftNiftyNightSession}</p>
              <p className="text-[10px] text-slate-500">Global Action: {prediction.autoFetchedData.globalCues}</p>
            </div>

            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-indigo-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] text-indigo-400 font-bold">Final 9:00 AM Status</p>
              <p className="text-sm text-white font-bold">GIFT Morning: {prediction.autoFetchedData.giftNiftyMorningSession}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Deep Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-indigo-400 font-bold mb-3 text-xs uppercase tracking-widest">Temporal Logic</h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {prediction.reasoning}
          </p>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-indigo-400 font-bold mb-3 text-xs uppercase tracking-widest">Sentiment & Trends</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {prediction.sentimentAnalysis}
          </p>
        </div>
      </div>

      {/* Grounding Sources */}
      {prediction.sources && prediction.sources.length > 0 && (
        <div className="pt-2">
          <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Institutional Sources (NSE, Moneycontrol, Bloomberg)</h4>
          <div className="flex flex-wrap gap-2">
            {prediction.sources.map((source, idx) => (
              <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 text-indigo-400 px-2 py-1 rounded transition-colors">
                {source.title.length > 40 ? source.title.substring(0, 40) + '...' : source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;
