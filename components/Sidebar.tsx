import React from 'react';
import { LayoutDashboard, FileText, MessageSquareText, BookOpen, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: AppView.OVERVIEW, label: 'System Overview', icon: LayoutDashboard },
    { id: AppView.NEW_CLAIM, label: 'Claim', icon: FileText },
    { id: AppView.SCHEMA_RULES, label: 'Classification Rules', icon: BookOpen },
    { id: AppView.CHATBOT, label: 'AI Assistant', icon: MessageSquareText },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">INSURE-ML</h1>
          <p className="text-[10px] text-slate-400 font-mono">v3.0.0-BETA</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
             <h3 className="text-xs font-semibold text-slate-400 uppercase">Status</h3>
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-[10px] text-slate-500">
                <span>Model</span>
                <span className="text-slate-300">Online</span>
             </div>
             <div className="flex justify-between text-[10px] text-slate-500">
                <span>Latency</span>
                <span className="text-emerald-400">45ms</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;