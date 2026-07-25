import React from 'react';
import { ClaimRecord } from '../types';
import { FileDown, Upload, Search } from 'lucide-react';

interface DatasetViewProps {
  data: ClaimRecord[];
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatasetView: React.FC<DatasetViewProps> = ({ data, onUpload }) => {
  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Dataset Viewer</h2>
          <p className="text-slate-400">Managing {data.length.toLocaleString()} records.</p>
        </div>
        <div className="flex gap-3">
          {onUpload && (
            <label className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload size={16} />
              <span className="text-sm font-medium">Upload CSV</span>
              <input type="file" accept=".csv" onChange={onUpload} className="hidden" />
            </label>
          )}
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
            <FileDown size={16} />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      <div className="flex items-center bg-slate-800 p-2 rounded-lg border border-slate-700">
        <Search className="text-slate-500 ml-2" size={20} />
        <input 
            type="text" 
            placeholder="Search descriptions..." 
            className="bg-transparent border-none text-white focus:outline-none w-full ml-3 placeholder:text-slate-600" 
        />
      </div>

      <div className="flex-1 overflow-auto border border-slate-700 rounded-xl bg-slate-800/50">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900 text-slate-200 uppercase font-medium sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4 w-1/2">Claim Description</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Accident Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                <td className="px-6 py-4 text-white line-clamp-2 leading-relaxed max-w-md" title={row.description}>
                  {row.description}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-mono border border-slate-600">
                    {row.coverageCode}
                  </span>
                </td>
                <td className="px-6 py-4">{row.accidentSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetView;