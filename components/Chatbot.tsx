import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Eraser, MessageSquare, Database } from 'lucide-react';
import { chatWithDataset } from '../services/geminiService';
import { ClaimRecord, ChatMessage } from '../types';
import DatasetView from './DatasetView';

interface ChatbotProps {
  dataset: ClaimRecord[];
}

const Chatbot: React.FC<ChatbotProps> = ({ dataset }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dataset'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I have access to your dataset of ${dataset.length} claim records. Ask me anything about trends, specific claims, or coverage codes.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithDataset(userMsg.text, history, dataset);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I couldn't process that request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the AI service.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Assistant</h3>
            <p className="text-xs text-indigo-400">RAG Enabled • {dataset.length} Records</p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button 
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'chat' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <MessageSquare size={14} />
                Chat
            </button>
            <button 
                onClick={() => setActiveTab('dataset')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'dataset' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Database size={14} />
                Dataset Context
            </button>
        </div>
        
        {activeTab === 'chat' && (
            <button 
            onClick={() => setMessages([messages[0]])}
            className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
            title="Clear Chat"
            >
            <Eraser size={18} />
            </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* CHAT TAB */}
        {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/20"
                >
                    {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-4 rounded-2xl ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : 'bg-slate-700 text-slate-100 rounded-tl-sm'
                        }`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                            <span className="text-[10px] opacity-50 mt-2 block">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        </div>
                    </div>
                    ))}
                    {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Bot size={16} />
                            </div>
                            <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-slate-800 border-t border-slate-700">
                    <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about claim trends (e.g., 'What is the most frequent accident source?')"
                        className="w-full bg-slate-900 text-white placeholder-slate-500 border border-slate-700 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                    </div>
                </div>
            </div>
        )}

        {/* DATASET TAB */}
        {activeTab === 'dataset' && (
            <div className="h-full p-4">
                <DatasetView data={dataset} />
            </div>
        )}

      </div>
    </div>
  );
};

export default Chatbot;