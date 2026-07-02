import React, { useEffect, useRef } from "react";
import { useScroll, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export const ModuleShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    let ticking = false;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const video = videoRef.current;
          if (video && video.readyState >= 2) {
            const vidDuration = video.duration;
            if (vidDuration > 0 && isFinite(vidDuration)) {
              try {
                video.currentTime = latest * vidDuration;
              } catch (e) {
                console.error("Error setting video current time", e);
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className="bg-[#050505] text-white min-h-screen w-full flex-1 flex flex-col font-sans selection:bg-goldi-blue selection:text-black">
      
      {/* HERO SECTION */}
      <div className="min-h-[100svh] w-full flex flex-col items-center justify-center relative bg-[#050505]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight mb-6">Solar, Perfected.</h1>
          <p className="text-lg sm:text-xl md:text-3xl text-gray-400 max-w-3xl mx-auto font-light px-2">
            Discover the anatomy of our most advanced modules yet. Engineered for uncompromising performance.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-sm text-gray-500 uppercase tracking-widest font-medium">Scroll to explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gray-500 to-transparent"></div>
        </motion.div>
      </div>

      {/* 
        This container is 400vh tall to allow for plenty of scrolling, 
        but not so much that it feels stuck.
      */}
      <div ref={containerRef} className="relative h-[400vh] w-full block">
        <div className="sticky top-0 h-[100svh] w-full flex items-center md:items-start justify-center md:pt-[14vh] overflow-hidden bg-[#050505]">
          
          {/* VIDEO ELEMENT */}
          <video
            ref={videoRef}
            src="/panel-video.mp4" 
            className="w-full md:w-[95%] max-w-7xl h-auto object-contain pointer-events-none transform origin-center md:origin-top scale-100"
            muted
            playsInline
            preload="auto"
          />

        </div>
      </div>
      
      {/* Spacer to show scroll continues */}
      <div className="h-[100svh] bg-[#050505] flex items-center justify-center border-t border-zinc-900 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-goldi-green/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Ready to <span className="text-goldi-green">upgrade?</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Experience the next generation of solar technology. Discover modules built for maximum efficiency and durability.
            </p>
            <button 
              onClick={() => navigate("/explore-modules")}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-goldi-green text-black rounded-full font-semibold overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(140,198,63,0.3)] hover:shadow-[0_0_60px_rgba(140,198,63,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Modules
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
