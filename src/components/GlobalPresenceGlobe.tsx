import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

export const GlobalPresenceGlobe = () => {
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  type LocationData = {
    lat: number;
    lng: number;
    name: string;
    size?: number;
    dotSize?: number;
    color?: string;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeEl.current) {
        const controls = globeEl.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.5;
        controls.enableZoom = true;
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [dimensions]);

  const gData = [
    // Global Presence Points
    { lat: 56.1304, lng: -106.3468, name: "Canada" },
    { lat: 37.0902, lng: -95.7129, name: "USA" },
    { lat: 18.2208, lng: -66.5901, name: "Puerto Rico" },
    { lat: 4.5709, lng: -74.2973, name: "Colombia" },
    { lat: 51.1657, lng: 10.4515, name: "Germany" },
    { lat: 46.2276, lng: 2.2137, name: "France" },
    { lat: 41.8719, lng: 12.5674, name: "Italy" },
    { lat: 45.1, lng: 15.2, name: "Croatia" },
    { lat: 17.5707, lng: -3.9962, name: "Mali" },
    { lat: 38.9637, lng: 35.2433, name: "Turkey" },
    { lat: 47.5162, lng: 14.5501, name: "Austria" },
    { lat: 56.2639, lng: 9.5018, name: "Denmark" },
    { lat: -13.2543, lng: 34.3015, name: "Malawi" },
    { lat: 1.3521, lng: 103.8198, name: "Singapore" },
    
    // India Presence Points (Green: #22c55e, Orange: #f97316, White: #ffffff)
    // Green (Channel Partners / Dealers)
    { lat: 21.1702, lng: 72.8311, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 22.3039, lng: 70.8022, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 18.5204, lng: 73.8567, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 15.3647, lng: 75.1240, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 10.8505, lng: 76.2711, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 11.0168, lng: 76.9558, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 26.8467, lng: 80.9462, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 25.5941, lng: 85.1376, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 22.5726, lng: 88.3639, name: "", color: "#22c55e", dotSize: 0.5 },
    { lat: 22.7196, lng: 75.8577, name: "", color: "#22c55e", dotSize: 0.5 },
    // Orange (Channel Partners)
    { lat: 23.0225, lng: 72.5714, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 26.9124, lng: 75.7873, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 28.6139, lng: 77.2090, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 19.8762, lng: 75.3433, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 21.1458, lng: 79.0882, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 17.3850, lng: 78.4867, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 12.9716, lng: 77.5946, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 13.0827, lng: 80.2707, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 26.1445, lng: 91.7362, name: "", color: "#f97316", dotSize: 0.5 },
    { lat: 23.2599, lng: 77.4126, name: "", color: "#f97316", dotSize: 0.5 },
    // White (Dealers)
    { lat: 30.9010, lng: 75.8573, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 27.1767, lng: 78.0081, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 25.3176, lng: 82.9739, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 30.3165, lng: 78.0322, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 26.2124, lng: 78.1772, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 23.1815, lng: 79.9864, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 21.2514, lng: 81.6296, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 20.2961, lng: 85.8245, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 17.6868, lng: 83.2185, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 16.5062, lng: 80.6480, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 12.8700, lng: 74.8800, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 9.9252, lng: 78.1198, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 24.1724, lng: 72.4346, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 23.2420, lng: 69.6669, name: "", color: "#ffffff", dotSize: 0.4 },
    { lat: 24.5854, lng: 73.6815, name: "", color: "#ffffff", dotSize: 0.4 }
  ];

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      {dimensions.width > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="rgba(0,0,0,1)"
          labelsData={gData}
          labelLat={(d) => (d as LocationData).lat}
          labelLng={(d) => (d as LocationData).lng}
          labelText={(d) => (d as LocationData).name}
          labelSize={(d) => (d as LocationData).size || 1.5}
          labelDotRadius={(d) => (d as LocationData).dotSize || ((d as LocationData).size ? 1.2 : 0.8)}
          labelDotOrientation={() => 'right'}
          labelColor={(d) => (d as LocationData).color || '#facc15'}
          labelResolution={2}
          labelAltitude={0.01}
          atmosphereColor="#fbbf24"
          atmosphereAltitude={0.15}
        />
      )}
    </div>
  );
};

export default GlobalPresenceGlobe;
