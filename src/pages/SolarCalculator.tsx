import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../App';
import ReactMarkdown from 'react-markdown';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Send, Loader2, Sparkles, Plus, Search, Monitor, ChevronDown, Mic, Zap, AreaChart, DollarSign, ShieldCheck, ArrowRight, Phone, TrendingUp, User, ArrowRightCircle, CheckCircle2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: any;
};

const SavingsChart = ({ yearlySavings, isDarkMode }: { yearlySavings: number, isDarkMode: boolean }) => {
  const data = Array.from({ length: 10 }, (_, i) => ({
    year: `Year ${i + 1}`,
    savings: (yearlySavings * (i + 1))
  }));

  return (
    <div className={`mt-4 p-4 sm:p-5 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-emerald-500" />
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>10-Year Savings Projection</h4>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
          <RechartsAreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }} style={{ outline: 'none' }}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#e2e8f0'} />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDarkMode ? '#a1a1aa' : '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} tick={{ fontSize: 10, fill: isDarkMode ? '#a1a1aa' : '#64748b' }} width={45} />
            <Tooltip 
              contentStyle={{ backgroundColor: isDarkMode ? '#18181b' : '#ffffff', borderColor: isDarkMode ? '#27272a' : '#e2e8f0', borderRadius: '8px' }}
              itemStyle={{ color: '#10b981', fontWeight: 500 }}
              labelStyle={{ color: isDarkMode ? '#a1a1aa' : '#64748b', marginBottom: '4px' }}
              formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Total Savings']}
            />
            <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const LeadCapture = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (submitted) {
    return (
      <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-sm font-medium">Thank you! Our solar expert will contact you shortly.</span>
      </div>
    );
  }

  return (
    <div className={`mt-4 p-4 sm:p-5 rounded-2xl border ${isDarkMode ? 'bg-[#050505] border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
      <h4 className={`text-[15px] font-semibold mb-1 ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>Would you like our team to contact you?</h4>
      <p className={`text-xs mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Get a free precise quotation.</p>
      
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3">
        <div className="relative">
          <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
          <input 
            type="text" 
            required 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:border-transparent ${
              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white focus:ring-goldi-blue' : 'bg-white border-slate-300 text-slate-900 focus:ring-goldi-blue'
            }`}
          />
        </div>
        <div className="relative">
          <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
          <input 
            type="tel" 
            required 
            placeholder="Phone Number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-1 focus:border-transparent ${
              isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white focus:ring-goldi-blue' : 'bg-white border-slate-300 text-slate-900 focus:ring-goldi-blue'
            }`}
          />
        </div>
        <button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-goldi-blue hover:bg-[#0A3B73] text-white text-sm font-medium transition-colors"
        >
          Request Callback <ArrowRightCircle className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export const SolarCalculator = () => {
  const [prompt, setPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => document.body.classList.contains('global-dark'));

  useEffect(() => {
    const handleEnabled = () => setIsDarkMode(true);
    const handleDisabled = () => setIsDarkMode(false);
    window.addEventListener('global-dark-enabled', handleEnabled);
    window.addEventListener('global-dark-disabled', handleDisabled);
    return () => {
      window.removeEventListener('global-dark-enabled', handleEnabled);
      window.removeEventListener('global-dark-disabled', handleDisabled);
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    
    (window as any).currentRecognition = recognition;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setPrompt(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };
  
  const stopListening = () => {
    if ((window as any).currentRecognition) {
      (window as any).currentRecognition.stop();
    }
    setIsListening(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isAiLoading]);

  const handleAiSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isAiLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
    setIsAiLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch("/api/solar-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content, messages: chatHistory }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(`Server returned a non-JSON response with status ${response.status}`);
      }
      
      if (!response.ok || data.error) {
        throw new Error(data.error || "An error occurred while processing.");
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || "Here is your solar prediction.",
        data: data
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message || "Sorry, I couldn't process your request right now.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiSubmit();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const hasMessages = messages.length > 0;

  return (
    <PageTransition>
      <div className={`flex flex-col h-screen font-sans selection:bg-slate-100 selection:text-slate-900 relative transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-zinc-100' : 'bg-white text-slate-900'}`}>
        <main className={`flex-1 relative z-10 overflow-y-auto px-4 sm:px-6 pt-24 md:pt-28 ${hasMessages ? 'pb-40' : 'flex items-center justify-center'}`}>
          <div className="max-w-3xl mx-auto w-full">
            
            {!hasMessages ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center -mt-32 w-full"
              >
                <motion.h1 
                  className={`text-4xl sm:text-5xl geist-pixel mb-10 tracking-tight flex items-center justify-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                >
                  <img src="/favicon.png" alt="Goldi Solar" className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm animate-[spin_4s_linear_infinite]" />
                  <span>
                    {getGreeting()}
                  </span>
                </motion.h1>
                
                <div className="w-full">
                  <div className="w-full relative group">
                    {/* Outer Glow */}
                    <div className="absolute -inset-[1.5px] rounded-[34px] opacity-100 transition-opacity duration-500 blur-[8px] overflow-hidden pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite]" />
                    </div>
                    
                    {/* Padding Wrapper for Sharp Border */}
                    <div className="relative w-full rounded-[34px] p-[1.5px] overflow-hidden z-10">
                      {/* The spinning gradient background */}
                      <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite] opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <form onSubmit={handleAiSubmit} className={`relative z-10 w-full rounded-[32.5px] transition-all duration-200 flex flex-row items-end px-2 py-2 ${
                        isDarkMode 
                          ? 'bg-zinc-900 border border-zinc-800' 
                          : 'bg-white shadow-sm'
                      }`}>
                        <textarea
                          ref={textareaRef}
                          value={prompt}
                          onChange={adjustTextareaHeight}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask Goldi AI"
                          className={`flex-1 bg-transparent px-4 py-3 focus:outline-none resize-none overflow-y-auto text-[15px] leading-relaxed self-center max-h-[150px] ${
                            isDarkMode ? 'text-zinc-100 placeholder-zinc-500' : 'text-slate-700 placeholder-slate-500'
                          }`}
                          disabled={isAiLoading}
                          rows={1}
                          style={{ height: "48px" }}
                        />
                        
                        <div className="flex items-center gap-1 shrink-0 mb-1.5">
                          <button 
                            type="button" 
                            onClick={toggleListening}
                            className={`p-2 rounded-full transition-colors flex ${
                              isListening 
                                ? 'text-red-500 bg-red-50' 
                                : isDarkMode 
                                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                            }`}
                          >
                            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                          </button>
                          <button
                            type="submit"
                            disabled={isAiLoading || !prompt.trim()}
                            className={`p-2 rounded-full transition-colors ${
                              prompt.trim() 
                                ? isDarkMode 
                                  ? 'bg-[#8CC63F] text-zinc-900 hover:bg-[#a4d955]' 
                                  : 'bg-[#0A3B73] text-white hover:bg-[#155AA8]' 
                                : isDarkMode 
                                  ? 'bg-zinc-800 text-zinc-600 disabled:opacity-50 disabled:bg-transparent' 
                                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:opacity-50 disabled:bg-transparent'
                            }`}
                          >
                            {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                     {[
                        "My bill is ₹3000", 
                        "Gujarat subsidy details", 
                        "Best solar panel for home"
                     ].map((suggestion, idx) => (
                       <button
                         key={idx}
                         onClick={() => setPrompt(suggestion)}
                         className={`px-4 py-2 rounded-full bg-transparent border text-[13px] transition-all ${
                           isDarkMode 
                             ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white' 
                             : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                         }`}
                       >
                         {suggestion}
                       </button>
                     ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-10">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'user' ? (
                      <div className={`px-5 py-3 rounded-[24px] max-w-[85%] text-[15px] font-normal leading-relaxed ${
                        isDarkMode 
                          ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/50' 
                          : 'bg-slate-100 text-slate-900'
                      }`}>
                        {msg.content}
                      </div>
                    ) : (
                      <div className="flex gap-4 w-full">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <img src="/favicon.png" alt="Goldi AI" className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex-grow flex-1 space-y-6 pt-1 min-w-0">
                          <div className={`text-[15px] font-normal leading-relaxed whitespace-pre-wrap ${
                            isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                          }`}>
                            <div className="markdown-body">
                              <ReactMarkdown
                                components={{
                                  strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-3" {...props} />,
                                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 my-3" {...props} />,
                                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                  p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                                  a: ({node, href, ...props}) => {
                                    const isTel = href?.startsWith('tel:');
                                    const isInternal = href?.startsWith('/');
                                    
                                    const baseClass = `inline-flex items-center justify-center gap-2 px-5 py-2.5 mt-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md ${
                                      isDarkMode 
                                        ? 'bg-[#8CC63F] text-zinc-900 hover:bg-[#a4d955] no-underline' 
                                        : 'bg-[#0A3B73] text-white hover:bg-[#155AA8] no-underline'
                                    }`;
                                    
                                    if (isInternal) {
                                      return (
                                        <Link to={href as string} className={baseClass}>
                                          {props.children}
                                          <ArrowRight className="w-4 h-4" />
                                        </Link>
                                      );
                                    }
                                    
                                    return (
                                      <a href={href} target={isTel ? "_top" : "_blank"} rel="noopener noreferrer" className={baseClass} {...props}>
                                        {isTel && <Phone className="w-4 h-4" />}
                                        {props.children}
                                      </a>
                                    );
                                  },
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                          
                          {msg.data && msg.data.recommendedKw && (
                            <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full">
                               <div className={`p-3 sm:p-4 rounded-xl flex flex-col justify-center border transition-colors duration-200 ${
                                 isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'
                               }`}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                   <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wider line-clamp-1 ${
                                     isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                                   }`}>System Size</span>
                                 </div>
                                 <span className={`text-lg sm:text-xl font-medium tracking-tight truncate ${
                                   isDarkMode ? 'text-white' : 'text-slate-900'
                                 }`}>{msg.data.recommendedKw} <span className={`text-xs sm:text-sm ${
                                   isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                                 }`}>kW</span></span>
                               </div>
                               
                               <div className={`p-3 sm:p-4 rounded-xl flex flex-col justify-center border transition-colors duration-200 ${
                                 isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'
                               }`}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <AreaChart className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                   <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wider line-clamp-1 ${
                                     isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                                   }`}>Roof Space</span>
                                 </div>
                                 <span className={`text-lg sm:text-xl font-medium tracking-tight truncate ${
                                   isDarkMode ? 'text-white' : 'text-slate-900'
                                 }`}>{msg.data.spaceRequiredSqFt} <span className={`text-xs sm:text-sm ${
                                   isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                                 }`}>sq ft</span></span>
                               </div>
                               
                               <div className={`p-3 sm:p-4 rounded-xl flex flex-col justify-center border transition-colors duration-200 ${
                                 isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'
                               }`}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                   <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wider line-clamp-1 ${
                                     isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                                   }`}>Savings/Yr</span>
                                 </div>
                                 <span className={`text-lg sm:text-xl font-medium tracking-tight truncate ${
                                   isDarkMode ? 'text-white' : 'text-slate-900'
                                 }`}>₹{msg.data.yearlySavings?.toLocaleString()}</span>
                               </div>
                               
                               <div className={`p-3 sm:p-4 rounded-xl flex flex-col justify-center border transition-colors duration-200 ${
                                 isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'
                               }`}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                   <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-wider line-clamp-1 ${
                                     isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                                   }`}>CO2 Red/Yr</span>
                                 </div>
                                 <span className={`text-lg sm:text-xl font-medium tracking-tight truncate ${
                                   isDarkMode ? 'text-white' : 'text-slate-900'
                                 }`}>{msg.data.co2ReductionTons?.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className={`text-xs sm:text-sm ${
                                   isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                                 }`}>Tons</span></span>
                               </div>
                            </div>
                            
                            {msg.data.yearlySavings && (
                              <SavingsChart yearlySavings={msg.data.yearlySavings} isDarkMode={isDarkMode} />
                            )}
                            {msg.data.recommendedKw && (
                              <LeadCapture isDarkMode={isDarkMode} />
                            )}
                          </>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isAiLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 w-full"
                  >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0">
                      <img src="/favicon.png" alt="Goldi AI" className="w-6 h-6 object-contain animate-spin" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
        </main>

        <AnimatePresence>
          {hasMessages && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`fixed bottom-0 left-0 w-full backdrop-blur-md pt-4 pb-6 px-4 sm:px-6 z-20 border-t transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-[#050505]/90 border-zinc-900 text-zinc-100' 
                  : 'bg-white/90 border-slate-100 text-slate-900'
              }`}
            >
              <div className="max-w-3xl mx-auto relative group">
                {/* Outer Glow */}
                <div className="absolute -inset-[1.5px] rounded-[34px] opacity-100 transition-opacity duration-500 blur-[8px] overflow-hidden pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite]" />
                </div>
                
                {/* Padding Wrapper for Sharp Border */}
                <div className="relative w-full rounded-[34px] p-[1.5px] overflow-hidden z-10">
                  {/* The spinning gradient background */}
                  <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite] opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <form onSubmit={handleAiSubmit} className={`relative z-10 w-full rounded-[32.5px] transition-all duration-200 flex flex-row items-end px-2 py-2 ${
                    isDarkMode 
                      ? 'bg-zinc-900 border border-zinc-800' 
                      : 'bg-white shadow-sm'
                  }`}>
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={adjustTextareaHeight}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask Goldi AI"
                      className={`flex-1 bg-transparent px-4 py-3 focus:outline-none resize-none overflow-y-auto text-[15px] leading-relaxed self-center max-h-[150px] ${
                        isDarkMode ? 'text-zinc-100 placeholder-zinc-500' : 'text-slate-700 placeholder-slate-500'
                      }`}
                      disabled={isAiLoading}
                      rows={1}
                      style={{ height: "48px" }}
                    />
                    <div className="flex items-center gap-1 shrink-0 mb-1.5">
                      <button 
                        type="button" 
                        onClick={toggleListening}
                        className={`p-2 rounded-full transition-colors flex ${
                          isListening 
                            ? 'text-red-500 bg-red-50' 
                            : isDarkMode 
                              ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                      </button>
                      <button
                        type="submit"
                        disabled={isAiLoading || !prompt.trim()}
                        className={`p-2 rounded-full transition-colors ${
                          prompt.trim() 
                            ? isDarkMode 
                              ? 'bg-[#8CC63F] text-zinc-900 hover:bg-[#a4d955]' 
                              : 'bg-[#0A3B73] text-white hover:bg-[#155AA8]' 
                            : isDarkMode 
                              ? 'bg-zinc-800 text-zinc-600 disabled:opacity-50 disabled:bg-transparent' 
                              : 'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:opacity-50 disabled:bg-transparent'
                        }`}
                      >
                        {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
