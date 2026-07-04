import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../App';
import { Send, Loader2, Sparkles, Plus, Search, Monitor, ChevronDown, Mic, Zap, AreaChart, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: any;
};

export const SolarCalculator = () => {
  const [prompt, setPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      const response = await fetch("/api/solar-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content }),
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
      <div className="flex flex-col h-screen bg-white font-sans selection:bg-slate-100 selection:text-slate-900 relative">
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
                  className="text-4xl sm:text-5xl geist-pixel mb-10 tracking-tight flex items-center justify-center gap-4 text-slate-900"
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
                    <div className="absolute -inset-[1.5px] rounded-[34px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-[8px] overflow-hidden pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite]" />
                    </div>
                    
                    {/* Padding Wrapper for Sharp Border */}
                    <div className="relative w-full rounded-[34px] p-[1.5px] overflow-hidden z-10">
                      {/* The spinning gradient background */}
                      <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <form onSubmit={handleAiSubmit} className="relative z-10 w-full rounded-[32.5px] bg-slate-100 group-focus-within:bg-white transition-all duration-200 flex flex-row items-end px-2 py-2">
                        <textarea
                          ref={textareaRef}
                          value={prompt}
                          onChange={adjustTextareaHeight}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask Goldi Solar"
                          className="flex-1 bg-transparent px-4 py-3 text-slate-700 placeholder-slate-500 focus:outline-none resize-none overflow-y-auto text-[15px] leading-relaxed self-center max-h-[150px]"
                          disabled={isAiLoading}
                          rows={1}
                          style={{ height: "48px" }}
                        />
                        
                        <div className="flex items-center gap-1 shrink-0 mb-1.5">
                          <button 
                            type="button" 
                            onClick={toggleListening}
                            className={`p-2 rounded-full transition-colors flex ${isListening ? 'text-red-500 bg-red-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                          >
                            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                          </button>
                          <button
                            type="submit"
                            disabled={isAiLoading || !prompt.trim()}
                            className={`p-2 rounded-full transition-colors ${
                              prompt.trim() 
                                ? 'bg-[#0A3B73] text-white hover:bg-[#155AA8]' 
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
                        "My bill is ₹4500 in Mumbai", 
                        "I have a 1000 sq ft roof in Delhi", 
                        "What size solar for a ₹2000 bill?"
                     ].map((suggestion, idx) => (
                       <button
                         key={idx}
                         onClick={() => setPrompt(suggestion)}
                         className="px-4 py-2 rounded-full bg-transparent border border-slate-200 text-[13px] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
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
                      <div className="bg-slate-100 text-slate-900 px-5 py-3 rounded-[24px] max-w-[85%] text-[15px] font-normal leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="flex gap-4 w-full">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <img src="/favicon.png" alt="Goldi AI" className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex-1 space-y-6 pt-1 min-w-0">
                          <div className="text-[15px] text-slate-900 font-normal leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </div>
                          
                          {msg.data && msg.data.recommendedKw && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 w-full">
                               <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-xl flex flex-col justify-center">
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                   <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider line-clamp-1">System Size</span>
                                 </div>
                                 <span className="text-lg sm:text-xl font-medium text-slate-900 tracking-tight truncate">{msg.data.recommendedKw} <span className="text-xs sm:text-sm text-slate-500">kW</span></span>
                               </div>
                               
                               <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-xl flex flex-col justify-center">
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <AreaChart className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                   <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider line-clamp-1">Roof Space</span>
                                 </div>
                                 <span className="text-lg sm:text-xl font-medium text-slate-900 tracking-tight truncate">{msg.data.spaceRequiredSqFt} <span className="text-xs sm:text-sm text-slate-500">sq ft</span></span>
                               </div>
                               
                               <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-xl flex flex-col justify-center">
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                   <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider line-clamp-1">Savings/Yr</span>
                                 </div>
                                 <span className="text-lg sm:text-xl font-medium text-slate-900 tracking-tight truncate">₹{msg.data.yearlySavings?.toLocaleString()}</span>
                               </div>
                               
                               <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-xl flex flex-col justify-center">
                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                   <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                   <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider line-clamp-1">CO2 Red/Yr</span>
                                 </div>
                                 <span className="text-lg sm:text-xl font-medium text-slate-900 tracking-tight truncate">{msg.data.co2ReductionTons?.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-xs sm:text-sm text-slate-500">Tons</span></span>
                               </div>
                            </div>
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
              className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md pt-4 pb-6 px-4 sm:px-6 z-20 border-t border-slate-100"
            >
              <div className="max-w-3xl mx-auto relative group">
                {/* Outer Glow */}
                <div className="absolute -inset-[1.5px] rounded-[34px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-[8px] overflow-hidden pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite]" />
                </div>
                
                {/* Padding Wrapper for Sharp Border */}
                <div className="relative w-full rounded-[34px] p-[1.5px] overflow-hidden z-10">
                  {/* The spinning gradient background */}
                  <div className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#4285F4,#EA4335,#FBBC05,#34A853,#4285F4)] animate-[spin_4s_linear_infinite] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <form onSubmit={handleAiSubmit} className="relative z-10 w-full rounded-[32.5px] bg-slate-100 group-focus-within:bg-white transition-all duration-200 flex flex-row items-end px-2 py-2">
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={adjustTextareaHeight}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask Goldi Solar"
                      className="flex-1 bg-transparent px-4 py-3 text-slate-700 placeholder-slate-500 focus:outline-none resize-none overflow-y-auto text-[15px] leading-relaxed self-center max-h-[150px]"
                      disabled={isAiLoading}
                      rows={1}
                      style={{ height: "48px" }}
                    />
                    <div className="flex items-center gap-1 shrink-0 mb-1.5">
                      <button 
                        type="button" 
                        onClick={toggleListening}
                        className={`p-2 rounded-full transition-colors flex ${isListening ? 'text-red-500 bg-red-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                      >
                        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                      </button>
                      <button
                        type="submit"
                        disabled={isAiLoading || !prompt.trim()}
                        className={`p-2 rounded-full transition-colors ${
                          prompt.trim() 
                            ? 'bg-[#0A3B73] text-white hover:bg-[#155AA8]' 
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
