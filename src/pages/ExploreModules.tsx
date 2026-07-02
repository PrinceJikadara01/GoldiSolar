import React from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, Sun } from "lucide-react";

export const ExploreModules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans selection:bg-goldi-green selection:text-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Explore Our <span className="text-goldi-green">Modules</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect high-efficiency solar module for your energy needs. Engineered for maximum power and reliability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Heloc Pro Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/heloc-pro')}
            className="group cursor-pointer relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 lg:p-12 overflow-hidden hover:border-goldi-green transition-colors duration-500 flex flex-col h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-goldi-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex-1">
              <div className="inline-block px-3 py-1 rounded-full bg-goldi-green/10 text-goldi-green text-sm font-medium mb-6">
                Premium Performance
              </div>
              <h2 className="text-4xl font-bold mb-4">Heloc <span className="text-goldi-green">Pro</span></h2>
              <p className="text-zinc-400 mb-8 text-lg">
                Our flagship N-Type TOPCon module. Delivering unprecedented power output and efficiency for maximum energy harvest.
              </p>

              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-goldi-green" />
                  <span className="text-zinc-300">Up to 710W Power Output</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-goldi-green" />
                  <span className="text-zinc-300">22.86% Maximum Efficiency</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-goldi-green" />
                  <span className="text-zinc-300">30-Year Performance Warranty</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-auto pt-8 border-t border-zinc-800 group-hover:border-goldi-green/30 transition-colors">
              <span className="font-semibold text-lg group-hover:text-goldi-green transition-colors">Explore Heloc Pro</span>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-goldi-green group-hover:text-black transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          {/* Heloc Plus Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/heloc-plus')}
            className="group cursor-pointer relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 lg:p-12 overflow-hidden hover:border-goldi-green transition-colors duration-500 flex flex-col h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-goldi-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex-1">
              <div className="inline-block px-3 py-1 rounded-full bg-goldi-green/10 text-goldi-green text-sm font-medium mb-6">
                Advanced Efficiency
              </div>
              <h2 className="text-4xl font-bold mb-4">Heloc <span className="text-goldi-green">Plus</span></h2>
              <p className="text-zinc-400 mb-8 text-lg">
                High-efficiency bifacial modules designed for optimal performance in diverse environmental conditions.
              </p>

              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-goldi-green" />
                  <span className="text-zinc-300">Up to 670W Power Output</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5 text-goldi-green" />
                  <span className="text-zinc-300">21.57% Maximum Efficiency</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-goldi-green" />
                  <span className="text-zinc-300">30-Year Performance Warranty</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-auto pt-8 border-t border-zinc-800 group-hover:border-goldi-green/30 transition-colors">
              <span className="font-semibold text-lg group-hover:text-goldi-green transition-colors">Explore Heloc Plus</span>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-goldi-green group-hover:text-black transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
