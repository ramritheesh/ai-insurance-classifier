import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Classifier from './components/Classifier';
import Chatbot from './components/Chatbot';
import SchemaReference from './components/SchemaReference';
import LandingPage from './components/LandingPage';
import { AppView, ClaimRecord, User } from './types';
import { getInitialData } from './services/mockData';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.OVERVIEW);
  const [data, setData] = useState<ClaimRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load CSV data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const csvData = await getInitialData();
        setData(csvData);
      } catch (error) {
        console.error('Failed to load CSV data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Simple CSV parser for demo purposes
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // Assume simple CSV format: Description, Code, Source
        const lines = text.split('\n').slice(1); // Skip header
        const newRecords: ClaimRecord[] = lines.filter(l => l.trim()).map((line, idx) => {
          const cols = line.split(','); 
          return {
            id: `upl-${idx}`,
            description: cols[0] || 'No description',
            coverageCode: cols[1] || '??',
            accidentSource: cols[2] || 'Unknown'
          };
        });
        if (newRecords.length > 0) {
            setData(prev => [...newRecords, ...prev]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView(AppView.OVERVIEW);
  };

  const handleLogout = () => {
    setUser(null);
    setShowUserMenu(false);
    setCurrentView(AppView.LANDING);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading dataset...</p>
          </div>
        </div>
      );
    }
    
    switch (currentView) {
      case AppView.OVERVIEW:
        return <Overview data={data} />;
      case AppView.NEW_CLAIM:
        return <Classifier />;
      case AppView.SCHEMA_RULES:
        return <SchemaReference data={data} />;
      case AppView.CHATBOT:
        return <Chatbot dataset={data} />;
      default:
        return <Overview data={data} />;
    }
  };

  // Not Logged In
  if (!user) {
    return <LandingPage onLoginSuccess={handleLogin} />;
  }

  // Logged In Layout
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 animate-fade-in relative">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 h-screen overflow-hidden overflow-y-auto relative">
        {/* User Profile - Top Right Corner */}
        <div className="absolute top-6 right-8 z-30">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full pl-4 pr-2 py-1.5 transition-all shadow-lg"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900">
              {user.avatar}
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
             <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in z-40">
                <div className="px-4 py-3 border-b border-slate-800">
                   <p className="text-sm text-white font-medium">Signed in as</p>
                   <p className="text-xs text-slate-400 truncate">{user.name}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2 transition-colors"
                >
                   <LogOut size={14} />
                   Sign out
                </button>
             </div>
          )}
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;