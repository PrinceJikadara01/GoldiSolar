import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageTransition } from "../App";
import { 
  KeyRound, 
  FileText, 
  Globe, 
  Sparkles, 
  Save, 
  Plus, 
  LogOut, 
  Check, 
  Loader2, 
  Lock, 
  AlertCircle, 
  Eye, 
  Download,
  BookOpen,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export const AdminDashboard = () => {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Editor State
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [isFetchingKb, setIsFetchingKb] = useState(false);
  const [isSavingKb, setIsSavingKb] = useState(false);
  const [kbMessage, setKbMessage] = useState({ type: "", text: "" });

  // Scraper State
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeMode, setScrapeMode] = useState<"single" | "entire">("entire");
  const [maxPages, setMaxPages] = useState<number>(8);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");
  const [scrapedResult, setScrapedResult] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(() => document.body.classList.contains("global-dark"));

  useEffect(() => {
    const handleEnabled = () => setIsDarkMode(true);
    const handleDisabled = () => setIsDarkMode(false);
    window.addEventListener("global-dark-enabled", handleEnabled);
    window.addEventListener("global-dark-disabled", handleDisabled);
    return () => {
      window.removeEventListener("global-dark-enabled", handleEnabled);
      window.removeEventListener("global-dark-disabled", handleDisabled);
    };
  }, []);

  // Check if password already stored
  useEffect(() => {
    const storedPass = localStorage.getItem("goldi_admin_pass");
    if (storedPass) {
      verifyStoredPassword(storedPass);
    }
  }, []);

  const verifyStoredPassword = async (pass: string) => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (res.ok) {
        setIsAuthorized(true);
        setPassword(pass);
        fetchKnowledgeBase(pass);
      } else {
        localStorage.removeItem("goldi_admin_pass");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthorized(true);
        localStorage.setItem("goldi_admin_pass", password.trim());
        fetchKnowledgeBase(password.trim());
      } else {
        setAuthError(data.error || "Invalid password. Try again.");
      }
    } catch (err) {
      setAuthError("Failed to connect to server.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPassword("");
    localStorage.removeItem("goldi_admin_pass");
    setKnowledgeBase("");
    setScrapedResult("");
    setScrapeUrl("");
  };

  const fetchKnowledgeBase = async (pass: string) => {
    setIsFetchingKb(true);
    setKbMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/get-knowledge", {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": pass,
          "X-Admin-Password": pass
        }
      });
      const data = await res.json();
      if (res.ok) {
        setKnowledgeBase(data.content || "");
      } else {
        setKbMessage({ type: "error", text: data.error || "Failed to load knowledge base." });
      }
    } catch (err) {
      setKbMessage({ type: "error", text: "Error loading knowledge base." });
    } finally {
      setIsFetchingKb(false);
    }
  };

  const handleSaveKnowledge = async () => {
    setIsSavingKb(true);
    setKbMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/save-knowledge", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": password,
          "X-Admin-Password": password
        },
        body: JSON.stringify({ content: knowledgeBase })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setKbMessage({ type: "success", text: "Knowledge base saved and updated successfully!" });
        // Clear message after 4s
        setTimeout(() => setKbMessage({ type: "", text: "" }), 4000);
      } else {
        setKbMessage({ type: "error", text: data.error || "Failed to save changes." });
      }
    } catch (err) {
      setKbMessage({ type: "error", text: "Error connecting to server." });
    } finally {
      setIsSavingKb(false);
    }
  };

  const handleScrapeWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim()) return;

    setIsScraping(true);
    setScrapeError("");
    setScrapedResult("");

    try {
      const res = await fetch("/api/admin/scrape-website", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": password,
          "X-Admin-Password": password
        },
        body: JSON.stringify({ 
          url: scrapeUrl.trim(),
          scrapeMode,
          maxPages
        })
      });

      const data = await res.json();
      if (res.ok) {
        setScrapedResult(data.extractedContent || "No data extracted.");
      } else {
        setScrapeError(data.error || "Failed to scrape the website. Ensure URL is correct and public.");
      }
    } catch (err) {
      setScrapeError("Could not connect to scraper endpoint.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleAppendScraped = () => {
    if (!scrapedResult) return;
    const separator = knowledgeBase.trim() ? "\n\n" : "";
    setKnowledgeBase(prev => prev + separator + scrapedResult);
    setScrapedResult("");
    setKbMessage({ type: "success", text: "Scraped facts appended to active editor! Press 'Save' below to publish." });
    setTimeout(() => setKbMessage({ type: "", text: "" }), 4000);
  };

  const handleDownloadKb = () => {
    const element = document.createElement("a");
    const file = new Blob([knowledgeBase], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "goldi_solar_knowledge.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setKbMessage({ type: "success", text: "goldi_solar_knowledge.txt downloaded! You can paste this in your IDE file to keep it permanently." });
    setTimeout(() => setKbMessage({ type: "", text: "" }), 6000);
  };

  if (!isAuthorized) {
    return (
      <PageTransition>
        <div className={`min-h-screen flex items-center justify-center px-6 py-24 transition-colors duration-500 ${isDarkMode ? "bg-[#050505] text-zinc-100" : "bg-slate-50 text-slate-900"}`}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-goldi-blue/10 rounded-full blur-[100px] opacity-40" />
            <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-goldi-green/10 rounded-full blur-[100px] opacity-30" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-md p-8 rounded-3xl border shadow-xl relative z-10 ${isDarkMode ? "bg-zinc-900/50 backdrop-blur-md border-zinc-800" : "bg-white border-slate-200"}`}
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-goldi-blue/10 border border-goldi-blue/20 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-goldi-blue" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight mb-2">Goldi AI Admin Panel</h1>
              <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                Enter password to configure knowledge base & scrape guidelines.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Admin Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-goldi-blue transition-all ${
                      isDarkMode 
                        ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500" 
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || !password}
                className="w-full py-3.5 rounded-2xl bg-[#0A3B73] text-white hover:bg-[#155AA8] transition-all font-bold text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Unlock Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={`min-h-screen pt-32 pb-24 px-6 transition-colors duration-500 ${isDarkMode ? "bg-[#050505] text-zinc-100" : "bg-slate-50 text-slate-900"}`}>
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-zinc-800/20">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-goldi-blue/10 border border-goldi-blue/20 text-goldi-blue text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Active Model: Llama 3.1 8B Instruct</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">AI Control Center</h1>
              <p className={`text-sm mt-1 ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                Train, tune, and optimize your Goldi Solar Assistant dynamically by editing the active knowledge base.
              </p>
            </div>

            <button 
              onClick={handleLogout}
              className={`px-5 py-2.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isDarkMode 
                  ? "border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-300" 
                  : "border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Lock Dashboard</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Scraper / Web Link Module */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Website Fact Scraper</h3>
                    <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                      Paste any web link. Our AI will automatically read and extract facts.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleScrapeWebsite} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={scrapeUrl}
                      onChange={(e) => setScrapeUrl(e.target.value)}
                      placeholder="e.g. www.goldisolar.com"
                      className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-goldi-blue transition-all ${
                        isDarkMode 
                          ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500" 
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setScrapeMode("single")}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        scrapeMode === "single"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                          : isDarkMode
                            ? "bg-zinc-800/40 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Single Page
                    </button>
                    <button
                      type="button"
                      onClick={() => setScrapeMode("entire")}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        scrapeMode === "entire"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                          : isDarkMode
                            ? "bg-zinc-800/40 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Entire Website
                    </button>
                  </div>

                  {scrapeMode === "entire" && (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-zinc-800/10 bg-zinc-500/5">
                      <span className="text-xs font-medium text-slate-400">Max Pages to Crawl</span>
                      <select
                        value={maxPages}
                        onChange={(e) => setMaxPages(Number(e.target.value))}
                        className={`px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-goldi-blue ${
                          isDarkMode
                            ? "bg-zinc-800 border-zinc-700 text-white"
                            : "bg-white border-slate-200 text-slate-800"
                        }`}
                      >
                        <option value={3}>3 pages</option>
                        <option value={5}>5 pages</option>
                        <option value={8}>8 pages (Recommended)</option>
                        <option value={12}>12 pages</option>
                        <option value={15}>15 pages (Deep Crawl)</option>
                      </select>
                    </div>
                  )}

                  {scrapeError && (
                    <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                      {scrapeError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isScraping || !scrapeUrl.trim()}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all font-semibold text-xs tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isScraping ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI is reading website text...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Scrape & Extract Facts</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Scraped Results Preview */}
              <AnimatePresence>
                {scrapedResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-6 rounded-3xl border shadow-sm flex-grow ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-emerald-500" />
                        <h4 className="font-display font-bold text-sm">Extracted Facts Ready</h4>
                      </div>
                      <button 
                        onClick={handleAppendScraped}
                        className="px-3.5 py-1.5 rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Append to Editor</span>
                      </button>
                    </div>

                    <div className={`p-4 rounded-2xl border h-[300px] overflow-y-auto font-mono text-xs leading-relaxed ${
                      isDarkMode 
                        ? "bg-zinc-950 border-zinc-800 text-zinc-300" 
                        : "bg-slate-50 border-slate-100 text-slate-700"
                    }`}>
                      {scrapedResult}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Knowledge Base Editor */}
            <div className="lg:col-span-7">
              <div className={`p-6 rounded-3xl border shadow-sm h-full flex flex-col ${isDarkMode ? "bg-zinc-900/30 border-zinc-800" : "bg-white border-slate-200"}`}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-goldi-blue/10 border border-goldi-blue/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-goldi-blue" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg">Knowledge Base Guidelines</h3>
                      <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                        Edit the facts that train the bot instantly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadKb}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isDarkMode 
                          ? "border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-emerald-400" 
                          : "border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-emerald-600"
                      }`}
                      title="Download goldi_solar_knowledge.txt"
                    >
                      <Download className="w-4.5 h-4.5" />
                    </button>

                    <button
                      onClick={() => fetchKnowledgeBase(password)}
                      disabled={isFetchingKb}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isDarkMode 
                          ? "border-zinc-800 hover:bg-zinc-900 text-zinc-400" 
                          : "border-slate-200 hover:bg-slate-100 text-slate-500"
                      }`}
                      title="Refresh current file"
                    >
                      <RefreshCw className={`w-4 h-4 ${isFetchingKb ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-[400px] relative mb-6">
                  {isFetchingKb ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-goldi-blue mb-2" />
                      <span className="text-xs text-slate-400">Loading knowledge base file...</span>
                    </div>
                  ) : (
                    <textarea
                      value={knowledgeBase}
                      onChange={(e) => setKnowledgeBase(e.target.value)}
                      placeholder="# Enter your company guidelines, product specs, policies, or contact details here..."
                      className={`w-full h-full min-h-[400px] p-5 rounded-2xl border font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-goldi-blue transition-all ${
                        isDarkMode 
                          ? "bg-zinc-950 border-zinc-800 text-zinc-300 focus:bg-zinc-900" 
                          : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                      }`}
                    />
                  )}
                </div>

                {kbMessage.text && (
                  <div className={`p-4 rounded-2xl border mb-4 text-xs flex items-center gap-2 ${
                    kbMessage.type === "success" 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-red-500/10 border-red-500/20 text-red-500"
                  }`}>
                    {kbMessage.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{kbMessage.text}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={handleSaveKnowledge}
                    disabled={isSavingKb || isFetchingKb}
                    className="px-6 py-3 rounded-2xl bg-[#0A3B73] hover:bg-[#155AA8] text-white font-bold text-xs tracking-wide flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-goldi-blue/10"
                  >
                    {isSavingKb ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Publish Guidelines</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
};
