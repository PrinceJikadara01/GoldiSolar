import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export const HelocPro = () => {
  const playerRef = useRef<any>(null);
  const videoSectionRef = useRef<HTMLElement>(null);
  const specsSectionRef = useRef<HTMLElement>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      videoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Load YouTube API script if not present
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        videoId: "qw2TzSCoqQw",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 0,
          start: 0,
          end: 14,
          loop: 0,
          modestbranding: 1,
          rel: 0,
          disablekb: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setPlaybackRate(0.5);
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsVideoVisible(true);
              event.target.setPlaybackRate(0.5);
            } else if (event.data === (window as any).YT.PlayerState.ENDED) {
              setIsVideoVisible(false);
              specsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          },
        },
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-24 font-sans selection:bg-goldi-green selection:text-black">
      {/* Hero Intro */}
      <section className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-goldi-green font-medium tracking-widest uppercase mb-8 md:mb-10"
        >
          Introducing
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 flex justify-center"
        >
          <h1 className="sr-only">Heloc Pro</h1>
          <div className="overflow-hidden h-14 md:h-[5.5rem] flex items-end">
            <img loading="lazy" 
              src="https://heloc.goldisolar.com/wp-content/uploads/2021/12/goldi_Heloc.webp" 
              alt="Heloc Pro Logo" 
              className="h-24 md:h-40 object-contain"
            />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-3xl text-zinc-400 max-w-3xl font-light"
        >
          Look at the brighter future. Engineering perfection in every cell.
        </motion.p>
      </section>

      {/* Video Presentation */}
      <section ref={videoSectionRef} className="relative w-full max-w-6xl mx-auto px-4 py-16 scroll-mt-24">
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-zinc-800 bg-black">
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] md:w-[115%] md:h-[120%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div id="youtube-player" className="w-full h-full"></div>
          </div>
          {/* Transparent overlay to block ALL touches and clicks on the video */}
          <div className="absolute inset-0 z-20 pointer-events-auto" />
          
          {/* Overlay to hide YouTube UI before playing and after ending */}
          <div 
            className={`absolute inset-0 bg-black z-10 transition-opacity duration-1000 pointer-events-none ${
              isVideoVisible ? 'opacity-0' : 'opacity-100'
            }`} 
          />
        </div>
      </section>

      {/* Specifications */}
      <section ref={specsSectionRef} className="py-32 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">
          Engineered for <br />
          <span className="text-goldi-green">Maximum Power</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SpecCard title="Max Power" value="550" unit="W" />
          <SpecCard title="Efficiency" value="20.91" unit="%" />
          <SpecCard title="Cells" value="144" unit="Half-cut Mono" />
          <SpecCard title="Warranty" value="12" unit="Years" />
        </div>

        <div className="mt-24 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
          <h3 className="text-2xl font-semibold mb-8 border-b border-zinc-800 pb-4">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <SpecRow label="Product Type" value="Monocrystalline Module" />
            <SpecRow label="Material" value="Aluminum Alloy Frame" />
            <SpecRow label="Operating Temperature" value="-40°C to +85°C" />
            <SpecRow label="Max System Voltage" value="1500V DC" />
            <SpecRow label="Dimensions" value="2279 × 1133 × 35 mm" />
            <SpecRow label="Weight" value="28 kg" />
          </div>
        </div>
      </section>
    </div>
  );
};

const SpecCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string;
  unit: string;
}) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex flex-col items-center text-center hover:border-goldi-green/50 transition-colors duration-500">
    <p className="text-zinc-400 text-sm uppercase tracking-wider mb-4">
      {title}
    </p>
    <div className="flex items-baseline gap-1">
      <span className="text-5xl md:text-6xl font-bold text-white">{value}</span>
      <span className="text-xl text-goldi-green font-medium">{unit}</span>
    </div>
  </div>
);

const SpecRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
    <span className="text-zinc-400">{label}</span>
    <span className="text-white font-medium text-right">{value}</span>
  </div>
);
