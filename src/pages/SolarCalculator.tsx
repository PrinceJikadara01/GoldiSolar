import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { PageTransition } from '../App';
import { Leaf, DollarSign, Sun, ShieldCheck, Edit2 } from 'lucide-react';

export const SolarCalculator = () => {
  const [bill, setBill] = useState<number>(3000);
  const inputRef = useRef<HTMLInputElement>(null);

  // Constants
  const PANEL_CAPACITY_W = 540; // 540W per panel
  const PANEL_COST = 15000; // rough cost per panel in INR
  const UNITS_PER_KW_PER_MONTH = 120; // rough estimate
  const COST_PER_UNIT = 8; // average INR per unit

  // Derived values
  const monthlyUnitsConsumed = bill / COST_PER_UNIT;
  const kwNeeded = monthlyUnitsConsumed / UNITS_PER_KW_PER_MONTH;
  const rawPanelsNeeded = Math.ceil((kwNeeded * 1000) / PANEL_CAPACITY_W);
  
  // Actual mathematical panels for ROI calculation
  const panelsNeeded = Math.max(1, rawPanelsNeeded);
  
  // Cap at 20 panels for visual grid (10x2), scaling down so it fills up smoothly up to ₹25,000
  const visualPanelsNeeded = Math.min(20, Math.ceil(panelsNeeded / 2.5));

  const yearlySavings = bill * 12;
  const treesSaved = Math.round(panelsNeeded * 1.5);
  const totalCost = panelsNeeded * PANEL_COST;
  const roiYears = (totalCost / yearlySavings).toFixed(1);

  // Generate panels array for the roof
  const renderPanels = () => {
    const panels = [];
    for (let i = 0; i < 20; i++) {
      const isActive = i < visualPanelsNeeded;
      panels.push(
        <motion.div
          key={i}
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0.05,
            scale: isActive ? 1 : 0.95,
            y: isActive ? -2 : 0, // Lift slightly off roof
            z: isActive ? 2 : 0,
          }}
          transition={{ duration: 0.4, delay: isActive ? i * 0.03 : 0 }}
          className={`relative w-full h-full rounded-[1px] overflow-hidden ${isActive ? 'shadow-[0_2px_4px_rgba(0,0,0,0.5)] border border-slate-400/80' : 'border border-slate-700/30'}`}
          style={{
            background: isActive 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' 
              : '#1e293b',
          }}
        >
          {/* Solar Panel Grid Lines */}
          {isActive && (
            <>
              {/* Vertical line */}
              <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                <div className="w-[1px] h-full bg-white/20"></div>
              </div>
              {/* Horizontal lines */}
              <div className="absolute inset-0 flex flex-col justify-evenly pointer-events-none">
                <div className="h-[1px] w-full bg-white/20"></div>
                <div className="h-[1px] w-full bg-white/20"></div>
                <div className="h-[1px] w-full bg-white/20"></div>
              </div>
              {/* Glare effect */}
              <div className="absolute top-0 left-[-50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" style={{ transform: 'rotate(30deg)' }}></div>
            </>
          )}
        </motion.div>
      );
    }
    return panels;
  };

  return (
    <PageTransition>
      <section className="pt-40 sm:pt-48 pb-20 px-6 min-h-[90vh] bg-slate-50 flex flex-col items-center overflow-hidden">
        <div className="text-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-goldi-green/10 text-goldi-green text-sm font-medium mb-6"
          >
            <Sun className="w-4 h-4" />
            Live ROI Calculator
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            See Your <span className="text-goldi-green">Savings</span> Grow
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Adjust your monthly electricity bill to instantly see how many solar panels you need, and the impact it will have on your wallet and the environment.
          </p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* 3D House Container */}
          <div className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-slate-100/50 rounded-3xl border border-slate-200 overflow-visible" style={{ perspective: '1500px' }}>
            {/* Ambient sun glow behind house */}
            <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-goldi-green/20 rounded-full blur-[60px]" />

            <div className="scale-[0.55] sm:scale-75 md:scale-100" style={{ transformStyle: 'preserve-3d' }}>
              <motion.div 
                className="relative w-[320px] h-[240px] transform-gpu origin-center"
                initial={{ rotateX: -15, rotateY: -35 }}
                animate={{ rotateX: -15, rotateY: -35 }}
                whileHover={{ rotateY: -25, rotateX: -10 }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
              {/* Ground Shadow */}
              <div className="absolute bottom-[-80px] left-[-40px] w-[400px] h-[360px] bg-black/20 blur-[30px] rounded-full pointer-events-none" style={{ transform: 'rotateX(90deg) translateZ(-120px)' }} />

              {/* Front Wall */}
              <div className="absolute bottom-0 w-[320px] h-[140px] bg-[#f8fafc] border-x border-[#e2e8f0]" style={{ transform: 'translateZ(120px)' }}>
                {/* Modern Wood Panel Section */}
                <div className="absolute bottom-0 left-[30px] w-[100px] h-[140px] bg-gradient-to-b from-[#8B5A2B] to-[#5c3a18] shadow-lg flex justify-center">
                  {/* Door */}
                  <div className="absolute bottom-0 w-[55px] h-[95px] bg-[#1a1005] rounded-t-sm border border-black/50">
                    <div className="absolute top-1/2 right-2 w-1.5 h-10 bg-slate-300 rounded-sm"></div>
                  </div>
                </div>
                {/* Modern Floor-to-Ceiling Windows */}
                <div className="absolute bottom-[20px] right-[30px] w-[140px] h-[100px] bg-[#0f172a] border-[6px] border-[#334155] shadow-[0_5px_15px_rgba(0,0,0,0.2)] flex overflow-hidden">
                   <div className="w-1/3 h-full border-r-4 border-[#1e293b]"></div>
                   <div className="w-1/3 h-full border-r-4 border-[#1e293b]"></div>
                   {/* Glass reflection */}
                   <div className="absolute top-[-20px] left-[-30px] w-[200px] h-[40px] bg-white/5 rotate-45 pointer-events-none"></div>
                   <div className="absolute top-[40px] left-[-30px] w-[200px] h-[15px] bg-white/5 rotate-45 pointer-events-none"></div>
                </div>
                {/* Exterior Lights */}
                <div className="absolute bottom-[100px] left-[145px] w-[4px] h-[8px] bg-slate-300 rounded-sm shadow-[0_5px_15px_rgba(255,255,255,0.8)]">
                  <div className="absolute top-[8px] left-[-10px] w-[24px] h-[40px] bg-yellow-100/30 blur-[10px]"></div>
                </div>
                <div className="absolute bottom-[100px] left-[15px] w-[4px] h-[8px] bg-slate-300 rounded-sm shadow-[0_5px_15px_rgba(255,255,255,0.8)]">
                  <div className="absolute top-[8px] left-[-10px] w-[24px] h-[40px] bg-yellow-100/30 blur-[10px]"></div>
                </div>
              </div>
              
              {/* Back Wall */}
              <div className="absolute bottom-0 w-[320px] h-[140px] bg-[#e2e8f0]" style={{ transform: 'rotateY(180deg) translateZ(120px)' }} />
              
              {/* Left Wall */}
              <div className="absolute bottom-0 left-[40px] w-[240px] h-[140px] bg-[#f1f5f9] border-x border-[#cbd5e1]" style={{ transform: 'rotateY(-90deg) translateZ(160px)' }}>
                 {/* Long horizontal window */}
                 <div className="absolute top-[40px] left-[50px] w-[140px] h-[35px] bg-[#0f172a] border-[4px] border-[#334155] shadow-[inset_0_0_10px_rgba(0,0,0,1)] flex overflow-hidden">
                   <div className="absolute top-[-10px] left-[-20px] w-[180px] h-[15px] bg-white/5 rotate-45 pointer-events-none"></div>
                 </div>
              </div>
              
              {/* Right Wall */}
              <div className="absolute bottom-0 left-[40px] w-[240px] h-[140px] bg-[#e2e8f0]" style={{ transform: 'rotateY(90deg) translateZ(160px)' }} />

              {/* Roof Front (The one with panels) */}
              <div className="absolute bottom-[140px] left-[-10px] w-[340px] h-[170px] bg-[#1e293b] origin-bottom shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)] border-b-[6px] border-[#0f172a] overflow-hidden" style={{ transform: 'translateZ(125px) rotateX(40deg)' }}>
                 {/* Solar Panels Grid Layout */}
                 <div className="w-full h-full p-4 pt-8 pb-6 grid grid-cols-10 grid-rows-2 gap-[4px] transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
                   {renderPanels()}
                 </div>
              </div>

              {/* Roof Back */}
              <div className="absolute bottom-[140px] left-[-10px] w-[340px] h-[170px] bg-[#0f172a] origin-bottom shadow-[inset_0_5px_15px_rgba(0,0,0,0.6)] border-b-[4px] border-[#020617]" style={{ transform: 'rotateY(180deg) translateZ(125px) rotateX(40deg)' }} />

              {/* Left Gable */}
              <div className="absolute bottom-[140px] left-[40px] w-[240px] h-[100px] bg-[#f1f5f9]" style={{ transform: 'rotateY(-90deg) translateZ(160px)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
              </div>
              
              {/* Right Gable */}
              <div className="absolute bottom-[140px] left-[40px] w-[240px] h-[100px] bg-[#e2e8f0]" style={{ transform: 'rotateY(90deg) translateZ(160px)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              
            </motion.div>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="flex flex-col gap-8 relative z-10">
            {/* Slider Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-goldi-blue via-goldi-green to-goldi-blue" />
              
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-6 gap-4 sm:gap-0">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Monthly Electricity Bill</p>
                  <div className="flex items-center group">
                    <span className="text-4xl font-bold text-slate-900 tracking-tight">₹</span>
                    <input
                      ref={inputRef}
                      type="number"
                      value={bill || ''}
                      onChange={(e) => setBill(Number(e.target.value))}
                      className="text-4xl font-bold text-slate-900 tracking-tight bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-goldi-green focus:outline-none w-40 p-0 ml-1 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Edit2 
                      className="w-5 h-5 text-slate-300 ml-2 cursor-pointer hover:text-goldi-green transition-colors opacity-0 group-hover:opacity-100 focus-within:opacity-100" 
                      onClick={() => inputRef.current?.focus()}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => inputRef.current?.focus()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-sm font-medium transition-colors border border-slate-200"
                >
                  <Edit2 className="w-4 h-4" />
                  Enter Manually
                </button>
              </div>

              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-goldi-green focus:outline-none focus:ring-2 focus:ring-goldi-green/50"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>₹1,000</span>
                <span>₹25,000+</span>
              </div>
            </div>

            {/* Glowing Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Yearly Savings */}
              <motion.div 
                key={yearlySavings}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 p-6 rounded-3xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-goldi-green/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <DollarSign className="w-8 h-8 text-goldi-green mb-4 relative z-10" />
                <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Yearly Savings</p>
                <h4 className="text-3xl font-bold text-white relative z-10 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]">
                  ₹{(yearlySavings).toLocaleString()}
                </h4>
              </motion.div>

              {/* Trees Saved */}
              <motion.div 
                key={treesSaved}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 p-6 rounded-3xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Leaf className="w-8 h-8 text-emerald-400 mb-4 relative z-10" />
                <p className="text-slate-400 text-sm font-medium mb-1 relative z-10">Trees Saved / Yr</p>
                <h4 className="text-3xl font-bold text-white relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  {treesSaved}
                </h4>
              </motion.div>

              {/* System Size */}
              <motion.div className="bg-white p-6 rounded-3xl border border-slate-100 col-span-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-goldi-blue/5 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-goldi-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Recommended System</p>
                    <p className="text-lg font-bold text-slate-900">{kwNeeded.toFixed(1)} kW</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Est. ROI</p>
                  <p className="text-lg font-bold text-goldi-green">{roiYears} Years</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </PageTransition>
  );
};
