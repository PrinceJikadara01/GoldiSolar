import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import {
  Battery,
  Globe,
  Zap,
  ArrowRight,
  Cpu,
  Shield,
  Factory,
  Hexagon,
  Menu,
  X,
  Leaf,
  Sun,
  BarChart3,
  Building2,
  Users,
  SunMedium,
  Home as HomeIcon,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Award,
  Target,
  Eye,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Download,
  Calculator,
  ChevronDown,
  Moon,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
const SolarCalculator = lazy(() => import("./pages/SolarCalculator").then(module => ({ default: module.SolarCalculator })));
const HelocPro = lazy(() => import("./pages/HelocPro").then(module => ({ default: module.HelocPro })));
const HelocPlus = lazy(() => import("./pages/HelocPlus").then(module => ({ default: module.HelocPlus })));
const ModuleShowcase = lazy(() => import("./pages/ModuleShowcase").then(module => ({ default: module.ModuleShowcase })));
const ExploreModules = lazy(() => import("./pages/ExploreModules").then(module => ({ default: module.ExploreModules })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const GlobalPresenceGlobe = lazy(() => import('./components/GlobalPresenceGlobe'));

const LazyGlobeComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      {isVisible ? (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500">Loading map...</div>}>
          <GlobalPresenceGlobe />
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-500"></div>
      )}
    </div>
  );
};

// --- Shared Components ---

const ThemeToggle = ({ isDarkMode, toggleDarkMode, className = "" }: { isDarkMode: boolean, toggleDarkMode: () => void, className?: string }) => {
  return (
    <button 
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-zinc-800 text-yellow-400 hover:bg-zinc-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} ${className}`}
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const [isGlobalDark, setIsGlobalDark] = useState(() => {
    const path = window.location.pathname;
    return document.body.classList.contains('global-dark') || path === '/' || ['/heloc-pro', '/heloc-plus', '/module-anatomy', '/explore-modules'].includes(path);
  });
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDarkMode = isGlobalDark || ['/heloc-pro', '/heloc-plus', '/module-anatomy', '/explore-modules'].includes(location.pathname);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleGlobalDark = () => setIsGlobalDark(true);
    const handleGlobalLight = () => setIsGlobalDark(false);
    window.addEventListener('global-dark-enabled', handleGlobalDark);
    window.addEventListener('global-dark-disabled', handleGlobalLight);
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('global-dark-enabled', handleGlobalDark);
      window.removeEventListener('global-dark-disabled', handleGlobalLight);
    }
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { 
      name: "Modules", 
      dropdown: [
        { name: "Explore Modules", path: "/explore-modules" },
        { name: "Anatomy of a Module", path: "/module-anatomy" },
      ]
    },
    { name: "EPC Solutions", path: "/epc" },
    { name: "Goldi AI", path: "/goldi-ai" },
    { name: "About Us", path: "/about" },
  ];

  const toggleDarkMode = () => {
    if (document.body.classList.contains('global-dark')) {
      document.body.classList.remove('global-dark');
      window.dispatchEvent(new Event('global-dark-disabled'));
      setIsGlobalDark(false);
    } else {
      document.body.classList.add('global-dark');
      window.dispatchEvent(new Event('global-dark-enabled'));
      setIsGlobalDark(true);
    }
  };

  const getNavBgClass = () => {
    if (!scrolled && !isHomePage) {
       return isDarkMode ? "bg-[#050505] py-8 md:py-10" : "bg-white py-8 md:py-10";
    }
    if (!isHomePage || scrolled) {
       return isDarkMode 
         ? "bg-[#050505] border-b border-zinc-800 py-6 md:py-8 shadow-lg" 
         : "bg-white border-b border-slate-200 py-6 md:py-8 shadow-lg";
    }
    return "bg-transparent py-8 md:py-10";
  };

  const textColorClass = isDarkMode ? "text-zinc-300 hover:text-white" : "text-slate-600 hover:text-goldi-blue";
  const activeTextColorClass = isDarkMode ? "text-white" : "text-goldi-blue";
  const logoFilterStyle = isDarkMode ? { filter: 'brightness(0) invert(1)' } : {};
  const dropdownBgClass = isDarkMode ? "bg-zinc-900 border border-zinc-800" : "bg-white border border-slate-100";
  const dropdownTextClass = isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-white" : "text-slate-700 hover:bg-slate-50 hover:text-goldi-blue";
  const btnClass = isDarkMode 
    ? "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
    : "bg-goldi-blue/10 text-goldi-blue border border-goldi-blue/30 hover:bg-goldi-blue hover:text-white shadow-[0_0_15px_rgba(140,198,63,0.1)] hover:shadow-[0_0_20px_rgba(140,198,63,0.3)]";

  if (location.pathname === "/goldi-ai") {
    return (
      <header ref={menuRef}>
        <div className="fixed top-6 right-6 z-[100] flex items-center justify-end">
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`mr-4 overflow-hidden border shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full h-14 flex items-center ${isDarkMode ? "bg-[#1f1f1f] border-[#333]" : "bg-white/90 backdrop-blur-md border-slate-200"}`}
              >
                <div className="flex items-center gap-6 px-6 max-w-[75vw] sm:max-w-none overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path || "/explore-modules"}
                      className={`text-sm font-medium whitespace-nowrap transition-colors ${location.pathname === (link.path || "/explore-modules") ? activeTextColorClass : textColorClass}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <button aria-label="Toggle Dark Mode" onClick={toggleDarkMode} className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${isDarkMode ? "bg-zinc-800 text-yellow-400" : "bg-slate-100 text-slate-600"}`}>
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`w-14 h-14 relative shrink-0 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.05)] flex items-center justify-center transition-all duration-500 z-[101] border overflow-hidden group ${isDarkMode ? "bg-white border-white hover:bg-slate-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "bg-white backdrop-blur-md border-slate-200 hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"}`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDarkMode ? "bg-gradient-to-tr from-slate-200 to-transparent" : "bg-gradient-to-tr from-slate-100 to-transparent"}`} />
            
            <div className="flex flex-col items-end justify-center gap-[5px] relative z-10 w-6 h-[19px]">
              <motion.span 
                 animate={mobileMenuOpen ? { rotate: 45, y: 7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }} 
                 transition={{ duration: 0.3, ease: "easeInOut" }}
                 className={`h-[2px] rounded-full origin-center transition-colors bg-slate-900`} 
              />
              <motion.span 
                 animate={mobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }} 
                 transition={{ duration: 0.3, ease: "easeInOut" }}
                 className={`h-[2px] w-[75%] rounded-full transition-colors bg-slate-900`} 
              />
              <motion.span 
                 animate={mobileMenuOpen ? { rotate: -45, y: -7, width: "100%" } : { rotate: 0, y: 0, width: "50%" }} 
                 transition={{ duration: 0.3, ease: "easeInOut" }}
                 className={`h-[2px] rounded-full origin-center transition-colors bg-slate-900`} 
              />
            </div>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header ref={menuRef}>
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${getNavBgClass()}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between md:justify-end relative">
        {/* Glowing Sun/Moon Placeholder */}
        <div id="sun-placeholder" className="absolute top-[10px] left-[40px] md:top-[30px] lg:top-[70px] md:left-[50px] lg:left-[-10px] w-0 h-0 z-0 pointer-events-none" />

        {/* Center Logo */}
        <div className="absolute left-1/2 lg:left-[40%] -translate-x-1/2 z-10">
          <Link
            to="/"
            aria-label="Go to Home"
            className={`flex items-center group transition-all duration-500 origin-center ${!isHomePage || scrolled ? "translate-y-0 scale-90" : "translate-y-[10px] md:translate-y-[20px] scale-100"}`}
          >
            <img 
              src="/goldi-logo.svg"
              alt="Goldi Solar Logo"
              width="200"
              height="64"
              className={`h-14 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105 relative z-10 drop-shadow-sm`}
              style={logoFilterStyle}
            />
          </Link>
        </div>

        {/* Placeholder for mobile/tablet flex alignment to keep hamburger on right */}
        <div className="w-6 h-6 lg:hidden"></div>

        <div className="hidden lg:flex items-center gap-6 text-[13px] font-medium mr-6 translate-x-16">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.name} className="relative group py-1">
                  <span className={`flex items-center cursor-pointer tracking-wide ${textColorClass}`}>
                    {link.name}
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                    <span className={`absolute left-0 bottom-0 w-full h-[2px] ${isDarkMode ? "bg-white" : "bg-goldi-blue"} transform origin-left transition-transform duration-300 ease-out scale-x-0 group-hover:scale-x-100`} />
                  </span>
                  <div className={`absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                    <div className={`shadow-xl rounded-xl overflow-hidden ${dropdownBgClass}`}>
                      {link.dropdown.map((sublink) => (
                        <Link
                          key={sublink.name}
                          to={sublink.path}
                          className={`block px-4 py-3 text-[11px] font-semibold tracking-wide transition-colors ${isDarkMode ? "text-[#8CC63F] hover:bg-zinc-800 hover:text-white" : "text-goldi-blue hover:bg-slate-50 hover:text-goldi-dark"}`}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
              </div>
            ) : (
              <Link
                key={link.name}
                to={link.path!}
                className={`relative py-1 group transition-colors tracking-wide ${location.pathname === link.path ? activeTextColorClass : textColorClass}`}
              >
                {link.name}
                <span
                  className={`absolute left-0 bottom-0 w-full h-[2px] ${isDarkMode ? "bg-white" : "bg-goldi-blue"} transform origin-left transition-transform duration-300 ease-out ${location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            )
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4 translate-x-16">
          <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Link
            to="/contact"
            className={`px-5 py-2 rounded-full border transition-all duration-300 font-medium text-[13px] ${btnClass}`}
          >
            Contact Us
          </Link>
        </div>

        <button
          aria-label="Toggle Navigation Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden w-12 h-12 relative shrink-0 rounded-full flex items-center justify-center transition-all duration-500 z-20 border overflow-hidden group ${isDarkMode ? "bg-white border-white hover:bg-slate-100 shadow-[0_4px_20px_rgba(255,255,255,0.2)]" : "bg-white/50 backdrop-blur-md border-slate-200 hover:border-slate-300 shadow-[0_4px_20px_rgb(0,0,0,0.05)]"}`}
        >
          <div className="flex flex-col items-end justify-center gap-[5px] relative z-10 w-5 h-[17px]">
            <motion.span 
               animate={mobileMenuOpen ? { rotate: 45, y: 7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }} 
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className={`h-[2px] rounded-full origin-center transition-colors bg-slate-900`} 
            />
            <motion.span 
               animate={mobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }} 
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className={`h-[2px] w-[75%] rounded-full transition-colors bg-slate-900`} 
            />
            <motion.span 
               animate={mobileMenuOpen ? { rotate: -45, y: -7, width: "100%" } : { rotate: 0, y: 0, width: "50%" }} 
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className={`h-[2px] rounded-full origin-center transition-colors bg-slate-900`} 
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, x: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`absolute top-full right-4 mt-4 w-[280px] lg:hidden flex flex-col gap-4 p-5 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border overflow-hidden origin-top-right ${isDarkMode ? "bg-zinc-900/95 backdrop-blur-xl border-zinc-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)]" : "bg-white/95 backdrop-blur-xl border-slate-200"}`}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.name} className="flex flex-col gap-1 mt-2 first:mt-0">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-zinc-500" : "text-slate-600"}`}>{link.name}</span>
                    <div className="flex flex-col">
                      {link.dropdown.map((sublink) => (
                        <Link
                          key={sublink.name}
                          to={sublink.path}
                          className={`text-[12px] font-semibold tracking-wide transition-all px-3 py-2.5 rounded-xl flex items-center ${isDarkMode ? "text-[#8CC63F] hover:text-white hover:bg-zinc-800" : "text-goldi-blue hover:text-goldi-dark hover:bg-slate-50"}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path!}
                    className={`text-sm font-medium transition-all px-3 py-2.5 rounded-xl flex items-center ${isDarkMode ? "text-zinc-200 hover:text-white hover:bg-zinc-800" : "text-slate-800 hover:text-goldi-blue hover:bg-slate-50"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
            
            <div className={`pt-4 mt-2 border-t flex flex-col gap-3 ${isDarkMode ? "border-zinc-800/80" : "border-slate-100"}`}>
              <div className={`p-1 flex items-center rounded-xl ${isDarkMode ? "bg-zinc-800/60" : "bg-slate-100"}`}>
                <button
                  onClick={() => { if (isDarkMode) toggleDarkMode(); }}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all ${!isDarkMode ? "bg-white text-goldi-blue shadow-sm" : "text-zinc-400 hover:text-white"}`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all ${isDarkMode ? "bg-zinc-700 text-yellow-400 shadow-sm" : "text-slate-600 hover:text-slate-600"}`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
              </div>
              <Link
                to="/contact"
                className={`w-full py-2.5 text-center rounded-xl font-bold text-xs tracking-wide transition-all ${isDarkMode ? "bg-white text-zinc-900 hover:bg-zinc-100" : "bg-goldi-blue text-white hover:bg-goldi-blue-dark shadow-sm hover:shadow"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </header>
  );
};

const Footer = () => {
  const location = useLocation();
  const [isGlobalDark, setIsGlobalDark] = useState(() => {
    const path = window.location.pathname;
    return document.body.classList.contains('global-dark') || path === '/' || ['/heloc-pro', '/heloc-plus', '/module-anatomy', '/explore-modules'].includes(path);
  });
  
  useEffect(() => {
    const handleGlobalDark = () => setIsGlobalDark(true);
    const handleGlobalLight = () => setIsGlobalDark(false);
    window.addEventListener('global-dark-enabled', handleGlobalDark);
    window.addEventListener('global-dark-disabled', handleGlobalLight);
    return () => {
      window.removeEventListener('global-dark-enabled', handleGlobalDark);
      window.removeEventListener('global-dark-disabled', handleGlobalLight);
    }
  }, []);

  if (location.pathname === '/goldi-ai') return null;

  const isDarkMode = isGlobalDark || ['/heloc-pro', '/heloc-plus', '/module-anatomy', '/explore-modules'].includes(location.pathname);

  const bgClass = isDarkMode ? 'bg-[#050505] border-zinc-800' : 'bg-white border-slate-200';
  const textTitleClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const textClass = isDarkMode ? 'text-zinc-400' : 'text-slate-600';
  const textHoverClass = isDarkMode ? 'hover:text-goldi-green' : 'hover:text-goldi-blue';
  const iconColor = isDarkMode ? 'text-goldi-green' : 'text-goldi-blue';
  const iconBg = isDarkMode ? 'bg-zinc-900 text-zinc-400 hover:bg-goldi-green hover:text-black' : 'bg-slate-100 text-slate-600 hover:bg-goldi-blue hover:text-white';
  const borderClass = isDarkMode ? 'border-zinc-800' : 'border-slate-200';
  const copyRightClass = isDarkMode ? 'text-zinc-500' : 'text-slate-600';
  const policyHoverClass = isDarkMode ? 'hover:text-goldi-green' : 'hover:text-slate-600';
  const logoFilterStyle = isDarkMode ? { filter: 'brightness(0) invert(1)' } : {};

  return (
    <footer className={`border-t relative z-10 pt-16 pb-8 transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center mb-6">
              <img loading="lazy"
                src="/goldi-logo.svg"
                alt="Goldi Solar Logo"
                width="200"
                height="80"
                className={`h-20 w-auto`}
                style={logoFilterStyle}
              />
            </div>
          </div>

          <div>
            <h4 className={`font-display font-semibold mb-4 ${textTitleClass}`}>
              Products
            </h4>
            <ul className={`space-y-3 text-sm ${textClass}`}>
              <li>
                <Link
                  to="/heloc-pro"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Heloc Pro
                </Link>
              </li>
              <li>
                <Link
                  to="/heloc-plus"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Heloc Plus
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-display font-semibold mb-4 ${textTitleClass}`}>
              About Goldi Solar
            </h4>
            <ul className={`space-y-3 text-sm ${textClass}`}>
              <li>
                <Link
                  to="/about"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Company
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Newsroom
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-display font-semibold mb-4 ${textTitleClass}`}>
              Quick Links
            </h4>
            <ul className={`space-y-3 text-sm ${textClass}`}>
              <li>
                <Link
                  to="/epc"
                  className={`transition-colors ${textHoverClass}`}
                >
                  EPC Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/heloc-pro"
                  className={`transition-colors ${textHoverClass}`}
                >
                  Downloads
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`font-display font-semibold mb-4 ${textTitleClass}`}>
              Contact
            </h4>
            <ul className={`space-y-3 text-sm mb-6 ${textClass}`}>
              <li className="flex items-center gap-2">
                <Phone className={`w-4 h-4 ${iconColor}`} />
                <span>1800-833-5511</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className={`w-4 h-4 ${iconColor}`} />
                <span>info@goldisolar.com</span>
              </li>
            </ul>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/goldisolar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Goldi Solar on Facebook"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${iconBg}`}
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/goldisolar/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Goldi Solar on Instagram"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${iconBg}`}
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/goldisolar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Goldi Solar on X (Twitter)"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${iconBg}`}
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/goldi-solar-private-limited/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Goldi Solar on LinkedIn"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${iconBg}`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${borderClass} ${copyRightClass}`}>
          <p>
            &copy; {new Date().getFullYear()} Goldi Solar. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className={`transition-colors ${policyHoverClass}`}>
              Privacy Policy
            </a>
            <a href="#" className={`transition-colors ${policyHoverClass}`}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [75, 55]), {
    damping: 30,
    stiffness: 100,
  });
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, -50]), {
    damping: 30,
    stiffness: 100,
  });

  const containerRef = React.useRef<HTMLElement>(null);
  const rectRef = React.useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      rectRef.current = null;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rectRef.current && containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
    if (!rectRef.current) return;
    
    const rect = rectRef.current;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <PageTransition>
      <section
        ref={containerRef}
        className="relative pt-40 sm:pt-48 md:pt-64 pb-20 px-6 min-h-[85vh] md:min-h-screen flex flex-col justify-end md:justify-center overflow-hidden group"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Realistic Animated Solar Panel Background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Background Gradients (Behind Panel) */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 via-transparent to-slate-50 z-0" />

          {/* Ambient glow behind panel */}
          <div className="absolute right-[5%] top-[30%] w-[600px] h-[600px] bg-goldi-blue-light/30 rounded-full blur-[100px] opacity-60 z-0 transition-opacity duration-500 group-hover:opacity-80" />

          {/* 3D Solar Panel */}
          <div
            className="absolute right-[5%] sm:right-[-5%] md:right-[-5%] lg:right-[5%] top-[7%] sm:top-[12%] md:top-[5%] lg:top-[2%] w-[340px] sm:w-[450px] md:w-[600px] lg:w-[850px] h-[230px] sm:h-[300px] md:h-[450px] lg:h-[650px] opacity-100 z-10 pointer-events-none"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              initial={{ rotateX: 65, rotateZ: -40, y: 150 }}
              animate={{ y: 0 }}
              style={{ rotateX, rotateZ, transformStyle: "preserve-3d" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full transform-gpu"
            >
              <div
                className="w-full h-full grid grid-cols-5 grid-rows-4 gap-[2px] md:gap-1 p-2 md:p-3 bg-[#e2e8f0] border-2 border-goldi-blue/40 rounded-2xl md:rounded-3xl shadow-[0_40px_80px_rgba(10,59,115,0.3)] relative transform-gpu overflow-hidden animate-float-y"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Gentle Sunlight Sweep Animation */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-[300px] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[35deg] z-20 pointer-events-none animate-sunlight"
                  style={{ willChange: "transform" }}
                />

                {/* Energy Particles Flowing Up */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={`particle-${i}`}
                    className="absolute w-2 h-2 rounded-full bg-goldi-green shadow-[0_0_15px_#8CC63F] z-30 pointer-events-none"
                    style={{
                      left: `${(i * 7) % 100}%`,
                      bottom: "-10px",
                      animation: `particle-up ${2 + (i % 3)}s linear ${i % 4}s infinite`,
                      willChange: "transform, opacity",
                    }}
                  />
                ))}

                {/* Solar Cells */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-goldi-blue to-goldi-blue-dark border border-goldi-blue-light/50 rounded-md md:rounded-xl relative overflow-hidden shadow-inner flex flex-col justify-evenly"
                  >
                    {/* Grid lines (Busbars) */}
                    <div className="absolute inset-y-0 left-[25%] w-[1.5px] bg-white/40"></div>
                    <div className="absolute inset-y-0 left-[50%] w-[1.5px] bg-white/40"></div>
                    <div className="absolute inset-y-0 right-[25%] w-[1.5px] bg-white/40"></div>

                    {/* Horizontal fingers */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 8%, white 8%, white calc(8% + 1px))" }} />

                    {/* Glass Reflection static */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40 pointer-events-none" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-20 w-full mt-48 sm:mt-12 md:mt-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-goldi-blue/10 border border-goldi-blue/20 text-goldi-blue text-sm font-medium mb-3 md:mb-6 backdrop-blur-sm">
                <Leaf className="w-4 h-4" />
                <span>Sustainable Energy for Tomorrow</span>
              </div>

              <h1 className="sr-only">Powering the Future of Energy</h1>
              <h1 aria-hidden="true"
                className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-3 md:mb-6 text-slate-900 tracking-tight animate-fade-in-up"
              >
                Powering the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A3B73] to-[#8CC63F] inline-block pb-2">
                  Future of Energy
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mb-4 md:mb-10 leading-relaxed">
                Accelerating the global transition to sustainable power with
                India&apos;s most advanced photovoltaic modules and comprehensive EPC
                infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-2 lg:mt-0 relative z-20 lg:pr-12 lg:pb-12">
              <Link
                to="/explore-modules"
                className="btn-primary shadow-lg shadow-goldi-blue/20"
              >
                Explore Modules <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/epc"
                className="btn-secondary bg-white/50 backdrop-blur-sm border-white/50"
              >
                View EPC Projects
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4 mt-20 md:mt-24 text-center max-w-7xl mx-auto w-full">
            {[
              { label: "Capacity", value: "15.2 GW", icon: HomeIcon },
              {
                label: "of Rich Industry\nExperience",
                value: "15 Years",
                icon: Factory,
              },
              { label: "Global exports", value: "20+ Countries", icon: Globe },
              { label: "skilled professionals", value: "8000+", icon: Users },
              { label: "EPC Customers", value: "25100+", icon: SunMedium },
              { label: "30MW", value: "IPP", icon: Zap },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-start p-2 group hover:-translate-y-1 transition-transform duration-300"
              >
                <stat.icon className="w-12 h-12 text-[#0A3B73] mb-4 stroke-[1.2] group-hover:text-goldi-green transition-colors" />
                <span className="font-display text-xl md:text-2xl font-bold text-[#0A3B73] mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-slate-500 whitespace-pre-line">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Solutions Bento Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Core <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-slate-600 max-w-2xl text-lg">
              Engineered for maximum output, durability, and seamless
              integration across residential, commercial, and utility-scale
              deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel glass-panel-hover p-8 md:col-span-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-goldi-blue/20 rounded-full blur-[80px] group-hover:bg-goldi-blue/30 transition-all duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[320px]">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-goldi-blue/20 border border-goldi-blue/30 flex items-center justify-center mb-6">
                    <Battery className="w-6 h-6 text-goldi-blue" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                    Heloc Series
                  </h3>
                  <p className="text-slate-600 max-w-md">
                    High-efficiency N-Type TOPCon and Mono PERC modules.
                    Delivering unprecedented power output with lower degradation
                    rates and exceptional low-light performance.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    to="/heloc-pro"
                    aria-label="View HELOC Pro Specifications"
                    className="inline-flex items-center gap-2 text-goldi-blue font-medium hover:text-goldi-blue-light transition-colors"
                  >
                    View Specifications <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-panel glass-panel-hover p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-goldi-blue/10 border border-goldi-blue/20 flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-goldi-blue" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                  EPC Services
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  End-to-end solar engineering, procurement, and construction
                  for utility-scale projects globally.
                </p>
                <Link
                  to="/epc"
                  aria-label="Explore our EPC solutions"
                  className="inline-flex items-center gap-2 text-goldi-blue text-sm font-medium hover:text-emerald-500"
                >
                  Explore EPC Solutions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="glass-panel glass-panel-hover p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-goldi-blue-light/10 border border-goldi-blue-light/20 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6 text-goldi-blue-light" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                  IPP Solutions
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Independent Power Producer structuring. Financing, developing,
                  and operating renewable assets.
                </p>
                <Link
                  to="/contact"
                  aria-label="Explore IPP solutions"
                  className="inline-flex items-center gap-2 text-goldi-blue-light text-sm font-medium hover:text-cyan-400"
                >
                  Explore IPP <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="glass-panel glass-panel-hover p-8 md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  Quality & Certifications
                </h3>
                <p className="text-slate-600 max-w-lg">
                  Our modules undergo rigorous testing and meet all major
                  international standards (ALMM, BIS, IEC, UL) ensuring decades
                  of reliable performance.
                </p>
              </div>
              <Link
                to="/about"
                className="shrink-0 px-6 py-3 rounded-full bg-slate-50 border border-slate-300 text-slate-900 font-medium hover:bg-slate-100 transition-colors"
              >
                Read our Vision
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};


const EPC = () => (
  <PageTransition>
    <div className="pt-40 sm:pt-48 pb-20 px-6 min-h-screen max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          EPC <span className="text-gradient">Solutions</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Goldi Solar is a leading EPC (Engineering, Procurement, and
          Construction) provider, executing end-to-end solar infrastructure
          projects globally with unmatched precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          {
            title: "Utility Scale & IPP",
            desc: "Large-scale ground-mounted solar farms engineered for grid connection, maximizing yield and ROI for Independent Power Producers.",
            icon: SunMedium,
          },
          {
            title: "Commercial & Industrial",
            desc: "Customized rooftop and ground solutions enabling businesses to achieve energy independence and meet ESG sustainability goals.",
            icon: Building2,
          },
          {
            title: "Agricultural & Residential",
            desc: "Empowering farmers with solar water pumps and residential communities with reliable rooftop systems.",
            icon: HomeIcon,
          },
        ].map((srv, i) => (
          <div
            key={i}
            className="glass-panel p-8 group hover:-translate-y-2 transition-shadow transition-transform duration-300 border border-slate-100 hover:border-goldi-blue/30 hover:shadow-xl hover:shadow-goldi-blue/5"
          >
            <div className="w-14 h-14 bg-goldi-blue/10 rounded-2xl flex items-center justify-center mb-6 text-goldi-blue group-hover:scale-110 transition-transform duration-300">
              <srv.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">
              {srv.title}
            </h3>
            <p className="text-slate-600 leading-relaxed">{srv.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center font-display">
          Our End-to-End Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Site Analysis & Design",
              desc: "Feasibility studies, shadow analysis, and optimized engineering designs.",
            },
            {
              step: "02",
              title: "Procurement",
              desc: "Sourcing Tier-1 BOM components ensuring maximum reliability.",
            },
            {
              step: "03",
              title: "Construction",
              desc: "Flawless execution by expert project managers adhering to strict timelines.",
            },
            {
              step: "04",
              title: "O&M",
              desc: "24/7 monitoring and maintenance for lifetime optimal performance.",
            },
          ].map((proc, i) => (
            <div
              key={i}
              className="relative p-6 bg-slate-50 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="text-5xl font-bold text-slate-100 absolute top-4 right-6 pointer-events-none">
                {proc.step}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-3 relative z-10">
                {proc.title}
              </h4>
              <p className="text-slate-600 text-sm relative z-10 leading-relaxed">
                {proc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PageTransition>
);

const About = () => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current) {
        // Calculate the element's position relative to the top of the document
        const elementTop = globeRef.current.getBoundingClientRect().top + window.scrollY;
        
        // This is the gap (in pixels) between the top of the screen and the top of the globe box.
        // You can tell me to increase or decrease this value! (e.g. "make it 200" or "make it 50")
        const topOffsetPx = 110;
        
        window.scrollTo({
          top: elementTop - topOffsetPx,
          behavior: "smooth"
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <div className="pt-32 sm:pt-36 pb-20 px-6 min-h-screen max-w-7xl mx-auto">
        {/* Global Presence Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              About <span className="text-gradient">Goldi Solar</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">
              Global Presence
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Our high-efficiency modules are illuminating businesses and homes in
              over 20 countries worldwide.
            </p>
          </div>

          <div ref={globeRef} className="w-full h-[500px] md:h-[600px] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-slate-800 flex items-center justify-center">
            <div className="absolute inset-0 z-10">
              <LazyGlobeComponent />
            </div>
          </div>

        {/* Legend outside */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <span className="text-xs font-medium text-slate-600">
                International Projects
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
              <span className="text-xs font-medium text-slate-600">
                Channel Partners
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-xs font-medium text-slate-600">
                Dealers
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-medium text-slate-600">
                Channel Partners / Dealers
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16 text-center">
        <h1 className="font-display text-gradient text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Goldi Solar
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          India&apos;s most quality-conscious solar brand. We are driven by a vision
          to create a sustainable future and make clean energy accessible to
          all.
        </p>
      </div>

      <div className="glass-panel p-8 md:p-12 mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-goldi-blue/10 border border-goldi-blue/20 text-goldi-blue text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>A Legacy of Quality</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-display">
              Transforming Tomorrow&apos;s Energy
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed text-lg">
              Goldi Solar is India&apos;s largest Solar PV module manufacturing
              company with annual capacity of 15.2 GW. Since inception in 2011,
              the company has been supplying world-class high efficiency modules
              in India and various geographies across the globe. Recently, the
              company recorded the largest and highest manufacturing expansion
              in India&apos;s renewable industry for Solar PV Modules from 3 GW to
              15.2 GW in the last 14 months.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed text-lg">
              Consistent with its manufacturing excellence and Quality-first
              commitment, the company has built a one-of-its-kind AI-powered
              state-of-the-art manufacturing facilities in Gujarat, India,
              namely Pipodara, Navsari, Kosamba and Nana Borsara.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed text-lg">
              Additionally, to fully support the backward integration of Solar
              PV Modules, the company is set to establish largest expansion in
              cell manufacturing facility by 2026.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              Goldi Solar is committed to driving sustainability through
              innovative solar solutions. Our mission aligns with India&apos;s goal
              of decarbonization, self-reliant (Atma-nirbhar) in solar
              manufacturing and achieving Net Zero emissions before 2070.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-4xl font-bold text-goldi-blue mb-1">
                  15.2 GW
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Manufacturing Capacity
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-4xl font-bold text-goldi-blue mb-1">
                  20+
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Countries Exported
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-goldi-dark rounded-2xl p-8 text-white relative overflow-hidden group">
              <Target className="w-10 h-10 text-goldi-blue mb-4 relative z-10" />
              <h3 className="text-2xl font-bold mb-3 relative z-10">
                Our Mission
              </h3>
              <p className="text-slate-300 relative z-10">
                Establish ourselves as the market leader for sustainable solar
                solutions, driving India to achieve its net zero target before
                2070.
              </p>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-goldi-blue rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
              <Eye className="w-10 h-10 text-goldi-blue mb-4 relative z-10" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">
                Our Vision
              </h3>
              <p className="text-slate-600 relative z-10">
                To empower the world with clean, renewable and accessible
                energy, ensuring a brighter future for generations ahead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageTransition>
  );
};

const Contact = () => (
  <PageTransition>
    <div className="pt-40 sm:pt-48 pb-20 px-6 min-h-screen max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Ready to transition to solar? Whether you&apos;re looking for modules, EPC
          services, or partnerships, our experts are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 font-display">
              Corporate Office
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-goldi-blue shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Corporate Office
                  </h4>
                  <p className="text-slate-600 text-sm mt-1">
                    1009, 10th floor, Infinity tower,
                    <br />
                    Beside Ayurvedic College,
                    <br />
                    Near Railway Station,
                    <br />
                    Surat, Gujarat 395003
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-goldi-blue shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Toll Free</h4>
                  <p className="text-slate-600 text-sm mt-1">1800-833-5511</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-goldi-blue shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Email Us</h4>
                  <p className="text-slate-600 text-sm mt-1">
                    info@goldisolar.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form
            className="glass-panel p-8 md:p-10 flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">
              Send us a Message
            </h3>
            <p className="text-slate-500 mb-4">
              Fill out the form below and we will get back to you shortly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-goldi-blue focus:ring-1 focus:ring-goldi-blue transition-all"
                  placeholder="John"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-goldi-blue focus:ring-1 focus:ring-goldi-blue transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-goldi-blue focus:ring-1 focus:ring-goldi-blue transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Inquiry Type
              </label>
              <div className="relative">
                <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-goldi-blue focus:ring-1 focus:ring-goldi-blue transition-all [&>option]:bg-white">
                  <option>Solar Modules Inquiry</option>
                  <option>EPC Services</option>
                  <option>Franchise / Partnership</option>
                  <option>Careers</option>
                  <option>Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                rows={5}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 focus:outline-none focus:border-goldi-blue focus:ring-1 focus:ring-goldi-blue transition-all resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="btn-primary justify-center mt-2 py-4 text-lg"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  </PageTransition>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const CustomCursor = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { damping: 25, stiffness: 200, mass: 0.8 });
  const smoothY = useSpring(cursorY, { damping: 25, stiffness: 200, mass: 0.8 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [introPhase, setIntroPhase] = useState<'moon' | 'sun'>('moon');
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0, scale: 0.8 });
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAlwaysDark = ['/heloc-pro', '/heloc-plus', '/module-anatomy', '/explore-modules'].includes(location.pathname);
  const isDarkMode = isAlwaysDark || (isHomePage && introPhase === 'moon' && !hasInteracted);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHomePage && !hasInteracted && introPhase === 'moon') {
      timer = setTimeout(() => {
        setIntroPhase('sun');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isHomePage, hasInteracted, introPhase]);

  useEffect(() => {
    const updateInitialPos = () => {
      requestAnimationFrame(() => {
        const el = document.getElementById('sun-placeholder');
        if (el) {
          const rect = el.getBoundingClientRect();
          const newPos = { 
            x: rect.left, 
            y: rect.top,
            scale: window.innerWidth >= 1024 ? 0.8 : window.innerWidth >= 768 ? 0.5 : 0.3
          };
          setInitialPos(newPos);
          if (!hasInteracted) {
            cursorX.set(newPos.x);
            cursorY.set(newPos.y);
          }
        }
      });
    };
    
    updateInitialPos();
    const to = setTimeout(updateInitialPos, 100);
    window.addEventListener('resize', updateInitialPos);
    return () => {
      clearTimeout(to);
      window.removeEventListener('resize', updateInitialPos);
    };
  }, [location.pathname, isHomePage, isDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('global-dark');
      window.dispatchEvent(new Event('global-dark-enabled'));
    } else {
      document.body.classList.remove('global-dark');
      window.dispatchEvent(new Event('global-dark-disabled'));
    }
  }, [isDarkMode]);

  useEffect(() => {
    const updatePosition = (e: MouseEvent | TouchEvent) => {
      if (!hasInteracted) setHasInteracted(true);
      if ('touches' in e) {
        cursorX.set(e.touches[0].clientX);
        cursorY.set(e.touches[0].clientY);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
      if (!isVisible) setIsVisible(true);
    };
    
    const updateHoverState = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("touchmove", updatePosition);
    window.addEventListener("touchstart", updatePosition);
    window.addEventListener("mouseover", updateHoverState);
    window.addEventListener("touchstart", updateHoverState);
    window.addEventListener("touchmove", updateHoverState);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("touchmove", updatePosition);
      window.removeEventListener("touchstart", updatePosition);
      window.removeEventListener("mouseover", updateHoverState);
      window.removeEventListener("touchstart", updateHoverState);
      window.removeEventListener("touchmove", updateHoverState);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, hasInteracted]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center w-0 h-0"
      style={{ x: smoothX, y: smoothY }}
      animate={{ opacity: isVisible || !hasInteracted ? 1 : 0 }}
    >
        <AnimatePresence mode="wait">
        {!hasInteracted && isHomePage && (
          <motion.div
            key="big-orb"
            initial={{ y: -200, scale: 0.2, opacity: 0 }}
            animate={{
              y: 0,
              scale: initialPos.scale,
              opacity: scrolled ? 0 : 1,
            }}
            exit={{ opacity: 0, scale: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
            className="absolute flex items-center justify-center w-[240px] h-[240px]"
          >
            {/* Moon Container */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: introPhase === 'moon' ? 1 : 0, scale: introPhase === 'moon' ? 1 : 0.8 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {/* Moon glow */}
              <div
                className="absolute inset-[0px] bg-slate-300/30 rounded-full blur-[40px] animate-pulse-scale"
              />
              <div
                className="absolute inset-[20px] bg-slate-200/40 rounded-full blur-[20px] animate-pulse-scale-sm"
              />

              {/* Moon core */}
              <div className="absolute w-[180px] h-[180px] rounded-full shadow-[0_0_80px_rgba(200,220,255,0.5)] overflow-hidden flex items-center justify-center bg-[#020205]">
                <img 
                  src="https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=360&q=80" 
                  alt="Moon"
                  width="180"
                  height="180"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover mix-blend-screen opacity-100 scale-[1.9] translate-x-[3px]"
                  style={{ filter: 'contrast(1.2) brightness(1.1)' }}
                />
                {/* Atmospheric realistic 3D shading overlay */}
                <div className="absolute inset-0 rounded-full shadow-[inset_-25px_-25px_50px_rgba(0,0,0,0.9),inset_10px_10px_30px_rgba(255,255,255,0.2)] z-10 pointer-events-none mix-blend-multiply" />
              </div>
            </motion.div>

            {/* Sun Container */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: introPhase === 'sun' ? 1 : 0, scale: introPhase === 'sun' ? 1 : 0.8 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {/* Sun Rays */}
              <div
                className="absolute w-[300px] h-[300px] opacity-30 z-0 pointer-events-none animate-spin-slow"
                style={{
                  background: 'repeating-conic-gradient(from 0deg, transparent 0deg 8deg, rgba(253,224,71,0.5) 8deg 16deg)',
                  maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)',
                  WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 65%)'
                }}
              />

              {/* Sun glow */}
              <div
                className="absolute w-[280px] h-[280px] bg-yellow-400/60 rounded-full blur-[60px] animate-pulse-scale"
              />
              <div
                className="absolute w-[200px] h-[200px] bg-amber-300/80 rounded-full blur-[40px] animate-pulse-scale-sm"
              />
  
              {/* Sun core */}
              <div 
                className="absolute w-[140px] h-[140px] rounded-full z-10 blur-[4px]"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,1) 40%, rgba(253,224,71,1) 85%, rgba(245,158,11,0) 100%)',
                  boxShadow: '0 0 100px 30px rgba(253,224,71,0.6)'
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasInteracted && (
          <motion.div
            key="small-cursor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute flex items-center justify-center"
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div 
              className={`absolute transition-all duration-300 rounded-full flex items-center justify-center
                ${isHovering 
                  ? 'w-14 h-14 border-[2px] border-amber-400 bg-transparent shadow-[0_0_20px_4px_rgba(251,191,36,0.6)]' 
                  : 'w-4 h-4 bg-[#ffffff] shadow-[0_0_15px_rgba(253,224,71,1)]'
                }`}
            >
              {/* Inner core for hover state */}
              <div 
                className={`rounded-full transition-all duration-300 bg-[#ffffff]
                  ${isHovering ? 'w-2 h-2 opacity-100 shadow-[0_0_10px_rgba(255,255,255,1)]' : 'w-0 h-0 opacity-0'}
                `} 
              />
            </div>

            {/* Ambient pulse for non-hover state */}
            {!isHovering && (
              <motion.div 
                className="absolute inset-0 bg-yellow-300 rounded-full blur-[8px] opacity-60 w-4 h-4"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Outer glowing pulse for hover state */}
            {isHovering && (
              <motion.div 
                className="absolute rounded-full border-[2px] border-amber-400/80 blur-[2px]"
                style={{ width: '56px', height: '56px', left: '-28px', top: '-28px' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function App() {
  const [isGlobalDark, setIsGlobalDark] = useState(() => {
    const path = window.location.pathname;
    return document.body.classList.contains('global-dark') || path === '/' || ['/heloc-pro', '/heloc-plus', '/module-anatomy', '/explore-modules'].includes(path);
  });
  
  useEffect(() => {
    const handleGlobalDark = () => setIsGlobalDark(true);
    const handleGlobalLight = () => setIsGlobalDark(false);
    window.addEventListener('global-dark-enabled', handleGlobalDark);
    window.addEventListener('global-dark-disabled', handleGlobalLight);

    return () => {
      window.removeEventListener('global-dark-enabled', handleGlobalDark);
      window.removeEventListener('global-dark-disabled', handleGlobalLight);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />
      <div className={`min-h-screen flex flex-col relative w-full max-w-full font-sans md:cursor-none transition-colors duration-500 ${isGlobalDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
        {/* Ambient background glows */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-goldi-blue/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-goldi-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <Navbar />
        <main className="flex-grow flex flex-col relative w-full h-full">
          <AnimatePresence mode="wait">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white text-goldi-blue"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/epc" element={<EPC />} />
                <Route path="/goldi-ai" element={<SolarCalculator />} />
                <Route path="/heloc-pro" element={<HelocPro />} />
                <Route path="/heloc-plus" element={<HelocPlus />} />
                <Route path="/module-anatomy" element={<ModuleShowcase />} />
                <Route path="/explore-modules" element={<ExploreModules />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <Footer />

      </div>
    </Router>
  );
}
