import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Scale, 
  Building2, 
  Menu,
  X,
  FileCheck2,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  isBn: boolean;
  setIsBn: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme: "light" | "reference" | "emerald" | "atlas" | "midnight";
  setTheme: (t: "light" | "reference" | "emerald" | "atlas" | "midnight") => void;
  selectedDistrictName: string;
  onOpenQuickSelect: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isBn,
  setIsBn,
  theme,
  setTheme,
  selectedDistrictName,
  onOpenQuickSelect,
  activeSection,
  setActiveSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = theme === "light";

  const navItems = [
    { id: 'hero-map', labelEn: '64-District Map', labelBn: '৬৪ জেলা মানচিত্র', icon: <MapPin size={13} /> },
    { id: 'due-diligence', labelEn: 'Due-Diligence Audit', labelBn: 'দলিল ও স্বত্ব অডিট', icon: <FileCheck2 size={13} />, highlight: true },
    { id: 'district-dashboard', labelEn: 'Cadastral Intelligence', labelBn: 'ক্যাডাস্ট্রাল তথ্য', icon: <Building2 size={13} /> },
    { id: 'calculator', labelEn: 'Unit Calculator', labelBn: 'জমি পরিমাপক', icon: <Scale size={13} /> },
    { id: 'cadastre', labelEn: 'Mouza Cadastre', labelBn: 'মৌজা জরিপ', icon: <Compass size={13} /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-colors ${
      isLight ? "bg-white/95 border-b border-slate-200/90 shadow-sm text-slate-800" : "bg-slate-900/90 border-b border-slate-700/60 text-slate-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Meta */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? "bg-white" : "bg-slate-950"}`}>
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-heading font-black text-lg sm:text-xl tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                  LandWise<span className="text-emerald-600 dark:text-emerald-400 font-extrabold ml-1">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                  Due-Diligence
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {isBn ? "বাংলাদেশ ভূমি দলিল ও স্বত্ব যাচাই সহকারী" : "Bangladesh Land Due-Diligence Assistant"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                    item.highlight && !isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                      : isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{isBn ? item.labelBn : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Quick District, Lang & Theme */}
          <div className="flex items-center gap-2">
            
            {/* Quick District Selector Button */}
            <button
              onClick={onOpenQuickSelect}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isLight 
                  ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100" 
                  : "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <MapPin size={12} className="text-emerald-500" />
              <span className="max-w-[80px] truncate">{selectedDistrictName}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setIsBn((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {isBn ? "EN" : "বাং"}
            </button>

            {/* Theme Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(["light", "emerald", "midnight"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    theme === t
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                  activeSection === item.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{isBn ? item.labelBn : item.labelEn}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
