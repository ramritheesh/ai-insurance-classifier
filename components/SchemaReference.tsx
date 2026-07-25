import React from 'react';
import { ClaimRecord } from '../types';
import { generateDatasetStats } from '../services/mockData';
import { BookOpen, AlertCircle, FileText } from 'lucide-react';

interface SchemaReferenceProps {
  data: ClaimRecord[];
}

const SchemaReference: React.FC<SchemaReferenceProps> = ({ data }) => {
  const datasetStats = generateDatasetStats(data);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-blue-500" />
          Classification Rules
        </h1>
        <p className="text-slate-400 text-lg">
          Detailed definitions of Coverage Codes and Accident Sources derived from the training set.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {datasetStats.schema.map((item) => (
          <div key={item.code} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold font-mono text-white bg-blue-600/20 border border-blue-500/50 px-3 py-1 rounded-lg">
                    {item.code}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-200">{item.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-200">{item.percentage}%</span>
                  <span className="text-xs text-slate-500 block uppercase tracking-wider">of Dataset</span>
                </div>
              </div>

              {/* Progress Bar for Percentage */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 mb-6">
                 <div 
                   className="bg-blue-500 h-1.5 rounded-full" 
                   style={{ width: `${item.percentage}%` }}
                 ></div>
              </div>

              <p className="text-slate-300 mb-4 leading-relaxed">
                {item.description}
              </p>

              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 group-hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  <FileText size={14} />
                  Training Example
                </div>
                <p className="text-slate-400 text-sm font-mono italic border-l-2 border-blue-500 pl-3">
                  "{item.example}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaReference;