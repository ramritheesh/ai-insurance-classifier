import React, { useMemo } from 'react';
import { ClaimRecord } from '../types';
import { generateDatasetStats } from '../services/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, Legend } from 'recharts';
import { Activity, FileText, CheckCircle2, BrainCircuit, AlertTriangle, Server, GitBranch, Database, Microscope } from 'lucide-react';

interface OverviewProps {
  data: ClaimRecord[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MODEL_COMPARISON_DATA = [
  { name: 'Naive Bayes', accuracy: 68, f1: 62 },
  { name: 'SVM', accuracy: 74, f1: 69 },
  { name: 'Random Forest', accuracy: 79, f1: 75 },
  { name: 'INSURE-ML (Deep Learning)', accuracy: 94, f1: 92 },
];

const Overview: React.FC<OverviewProps> = ({ data }) => {
  const stats = useMemo(() => {
    const coverageCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    data.forEach(item => {
      coverageCounts[item.coverageCode] = (coverageCounts[item.coverageCode] || 0) + 1;
      const simpleSource = item.accidentSource.split(' ')[0]; 
      sourceCounts[simpleSource] = (sourceCounts[simpleSource] || 0) + 1;
    });

    const coverageData = Object.keys(coverageCounts).map(key => ({
      name: key,
      value: coverageCounts[key]
    })).sort((a, b) => b.value - a.value);

    const sourceData = Object.keys(sourceCounts).map(key => ({
      name: key,
      value: sourceCounts[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5); 

    return { coverageData, sourceData, total: data.length };
  }, [data]);

  // Calculate dataset stats from actual data
  const datasetStats = useMemo(() => generateDatasetStats(data), [data]);
  
  // Transform dataset stats for Area Chart
  const areaData = datasetStats.schema.map(s => ({ name: s.code, value: s.count }));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header / Intro */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex justify-between items-end mb-4">
             <div>
                <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
                <p className="text-slate-400 text-lg">
                Automated insurance claim classification using Generative AI.
                </p>
             </div>
             <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-mono text-slate-300">v3.0 LIVE</span>
             </div>
        </div>
      </div>

      {/* Project Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Database className="text-blue-500" size={24} />
            <h3 className="text-slate-200 font-semibold">Dataset Size</h3>
          </div>
          <p className="text-3xl font-bold text-white">{datasetStats.total.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">Total records processed</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
           <div className="flex items-center gap-3 mb-2">
            <Microscope className="text-violet-500" size={24} />
            <h3 className="text-slate-200 font-semibold">Validation Split</h3>
          </div>
          <p className="text-3xl font-bold text-white">{datasetStats.validationSplit}</p>
          <p className="text-sm text-slate-500 mt-1">Held-out for testing</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
           <div className="flex items-center gap-3 mb-2">
            <BrainCircuit className="text-emerald-500" size={24} />
            <h3 className="text-slate-200 font-semibold">Architecture</h3>
          </div>
          <p className="text-xl font-bold text-white">{datasetStats.modelName}</p>
          <p className="text-sm text-slate-500 mt-1">Few-Shot Learning</p>
        </div>
      </div>

      {/* SaaS Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Live Sample Size</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
              <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                <Activity size={10} /> Monitoring Active
              </span>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
              <FileText size={20} />
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Precision Rate</p>
              <h3 className="text-2xl font-bold text-white mt-1">94.2%</h3>
              <span className="text-xs text-slate-500 mt-1">Vs. 68% Traditional ML</span>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Automated Triage</p>
              <h3 className="text-2xl font-bold text-white mt-1">89.5%</h3>
              <span className="text-xs text-slate-500 mt-1">No human review needed</span>
            </div>
            <div className="bg-violet-500/10 p-2 rounded-lg text-violet-400">
              <BrainCircuit size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <GitBranch className="text-slate-400" size={20} />
                    Technical Approach
                </h2>
                <ul className="space-y-3 text-slate-300">
                    <li className="flex gap-3">
                        <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
                        <span><strong>Deep Learning vs. Traditional ML:</strong> While Naive Bayes achieved ~68% accuracy, the Deep Learning approach pushed accuracy to ~94% by capturing semantic context.</span>
                    </li>
                    <li className="flex gap-3">
                        <CheckCircle2 className="text-blue-500 shrink-0" size={20} />
                        <span><strong>Handling Imbalance:</strong> The system uses prompt engineering to pay special attention to minority classes (like Code 'AN' or 'GD') which often get ignored.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h4 className="text-white font-medium">Performance Benchmarking</h4>
                        <p className="text-xs text-slate-400 mt-1">INSURE-ML vs. Baseline Classifiers</p>
                    </div>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MODEL_COMPARISON_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} width={120} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            cursor={{ fill: '#334155', opacity: 0.4 }}
                        />
                        <Bar dataKey="accuracy" name="Accuracy %" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
      </section>

      {/* Class Imbalance Visualization */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h4 className="text-white font-medium">Dataset Class Imbalance</h4>
                  <p className="text-xs text-slate-400 mt-1">Distribution across 190,452 records</p>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                  <AlertTriangle className="text-amber-500" size={12} />
                  <span className="text-[10px] text-amber-500 font-bold">HIGH IMBALANCE</span>
              </div>
          </div>
          <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                      <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>

       {/* Live Data Analysis */}
       <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-6">Live Batch Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.coverageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                   {stats.coverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;