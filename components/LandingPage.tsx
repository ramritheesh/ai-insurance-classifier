import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, BrainCircuit, Database, Zap, Lock, Loader2, X, UserPlus } from 'lucide-react';
import { login, register } from '../services/authService';
import { User } from '../types';

interface LandingPageProps {
  onLoginSuccess: (user: User) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // For registration
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let user;
      if (isRegistering) {
        if (!email || !username || !password) throw new Error("All fields required");
        user = await register(username, email, password);
      } else {
        user = await login(username, password);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication Failed');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setUsername('');
    setPassword('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">INSURE-ML</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-slate-400 text-sm font-medium hidden md:block">
             Student Project / 2025
           </div>
           {!showAuth && (
             <button 
              onClick={() => { setShowAuth(true); setIsRegistering(true); }}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-full border border-slate-700 transition-colors"
             >
               Register
             </button>
           )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto mt-10">
        {!showAuth ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium tracking-wide">TRAINED ON 190K+ RECORDS</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 leading-tight">
              Next-Gen Insurance <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500">Classification System</span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
              Leveraging Deep Learning and Large Language Models to automate claim triage. 
              Instantly predict Coverage Codes and Accident Sources from unstructured text with human-level reasoning.
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => { setShowAuth(true); setIsRegistering(false); }}
                className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
              >
                Login to System
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => { setShowAuth(true); setIsRegistering(true); }}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all border border-slate-700"
              >
                Create Account
              </button>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors hover:bg-slate-800/50 group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BrainCircuit className="text-blue-400 w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Zero-Shot Learning</h3>
                <p className="text-sm text-slate-400">Utilizes Gemini 2.5 Flash to classify claims without extensive retraining.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors hover:bg-slate-800/50 group">
                <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Database className="text-violet-400 w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">190k Dataset</h3>
                <p className="text-sm text-slate-400">Benchmarked against a massive real-world dataset for maximum robustness.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors hover:bg-slate-800/50 group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-emerald-400 w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Instant Triage</h3>
                <p className="text-sm text-slate-400">Reduces manual review time by automating extraction.</p>
              </div>
            </div>
          </div>
        ) : (
          // Auth Form Component
          <div className="w-full max-w-md animate-slide-up">
             <div className={`bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative ${shake ? 'animate-shake' : ''}`}>
                <button 
                  onClick={() => setShowAuth(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col items-center mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg ${isRegistering ? 'bg-emerald-600 shadow-emerald-900/50' : 'bg-blue-600 shadow-blue-900/50'}`}>
                    {isRegistering ? <UserPlus className="text-white w-6 h-6" /> : <Lock className="text-white w-6 h-6" />}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {isRegistering ? 'Join the research platform' : 'Enter your credentials to access the model'}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">User ID</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="e.g. student1"
                      required
                    />
                  </div>
                  
                  {isRegistering && (
                    <div className="animate-fade-in">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="student@university.edu"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20 flex items-center justify-center">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg ${isRegistering ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'}`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (isRegistering ? 'Register' : 'Access Dashboard')}
                  </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-800 pt-4">
                   <p className="text-xs text-slate-500">
                     {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                     <button onClick={toggleMode} className="text-blue-400 hover:text-blue-300 ml-2 font-medium focus:outline-none">
                       {isRegistering ? 'Login' : 'Register'}
                     </button>
                   </p>
                </div>
             </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm">
        <p>© 2025 INSURE-ML Project. 4th Year Computer Science.</p>
      </footer>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;