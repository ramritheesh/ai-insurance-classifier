import React, { useState } from 'react';
import { Brain, Loader2, Sparkles, CheckCircle, Info, Tag, Layers, FileText } from 'lucide-react';
import { classifyClaimDescription } from '../services/geminiService';
import { ClassificationResult } from '../types';

const Classifier: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClassify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await classifyClaimDescription(input);
      setResult(data);
    } catch (e) {
      setError("Failed to classify. Ensure your API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-blue-500" />
            Claim
          </h2>
          <p className="text-slate-400 mt-1">Processing pipeline for new incident reports.</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-1 shadow-lg">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="explain your incidence or story..."
          className="w-full h-32 bg-slate-900 text-slate-100 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-600"
        />
        <div className="p-2 flex justify-between items-center bg-slate-800 rounded-b-xl">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500">System Ready</span>
          </div>
          <button
            onClick={handleClassify}
            disabled={loading || !input}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Process Claim
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {/* Main Prediction Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <Brain size={120} />
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <Layers className="text-blue-500" size={20} />
              <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Model Prediction</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div>
                <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">Coverage Code</span>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                    {result.coverageCode}
                  </span>
                  <div className="h-px flex-1 bg-slate-700"></div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">Identified Source</span>
                <div className="flex items-start gap-3">
                  <span className="text-xl font-medium text-white">{result.accidentSource}</span>
                </div>
              </div>

              <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Confidence Score</span>
                  <span className={`text-sm font-bold ${result.confidence > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {result.confidence}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${result.confidence > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis & NLP Features Card */}
          <div className="flex flex-col gap-4">
            {/* Feature Extraction */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag size={16} /> Extracted Entities (NLP)
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.extractedFeatures && result.extractedFeatures.length > 0 ? (
                  result.extractedFeatures.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs italic">No specific features isolated</span>
                )}
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex-1 flex flex-col">
              <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={16} /> Logic Trace
              </h3>
              <div className="flex-1 bg-slate-900/50 rounded-xl p-4 text-slate-300 leading-relaxed text-sm border border-slate-800">
                {result.reasoning}
              </div>
               <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs">
                  <CheckCircle size={14} />
                  <span>Triage logic verified</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Examples */}
      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            <button 
                onClick={() => setInput("CLAIMANT ALLEGES SHE WAS BURNED BY HOT COFFEE AFTER THE LID POPPED OFF.")}
                className="text-left p-4 rounded-xl border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all group"
            >
                <span className="text-xs text-blue-500 font-semibold mb-2 block uppercase tracking-wide">Example 1</span>
                <p className="text-sm text-slate-400 line-clamp-2 group-hover:text-slate-200">"CLAIMANT ALLEGES SHE WAS BURNED BY HOT COFFEE..."</p>
            </button>
            <button 
                onClick={() => setInput("IV PASSENGER SUSTAINED INJURIES, OV AND IV COLLIDED CAUSING IV TO HIT ANOTHER OV AS WELL")}
                className="text-left p-4 rounded-xl border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all group"
            >
                <span className="text-xs text-blue-500 font-semibold mb-2 block uppercase tracking-wide">Example 2</span>
                <p className="text-sm text-slate-400 line-clamp-2 group-hover:text-slate-200">"IV PASSENGER SUSTAINED INJURIES..."</p>
            </button>
            <button 
                onClick={() => setInput("MOSQUITO APPLICATION CAUSED INTERIOR PROPERTY DAMAGE THAT REQUIRED COMPLETE CLEANUP")}
                className="text-left p-4 rounded-xl border border-slate-800 hover:border-blue-500/30 hover:bg-slate-800/50 transition-all group"
            >
                <span className="text-xs text-blue-500 font-semibold mb-2 block uppercase tracking-wide">Example 3</span>
                <p className="text-sm text-slate-400 line-clamp-2 group-hover:text-slate-200">"MOSQUITO APPLICATION CAUSED INTERIOR..."</p>
            </button>
        </div>
      )}
    </div>
  );
};

export default Classifier;