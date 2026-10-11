import React, { useState } from 'react';
import { 
  Compass, 
  Globe2, 
  Layers, 
  MapPin, 
  Sparkles, 
  Scale, 
  Search, 
  Bot, 
  Info, 
  ChevronDown, 
  Building2, 
  Home, 
  TreePine, 
  Activity, 
  Utensils,
  Menu,
  X
} from 'lucide-react';
import { SuitabilityPurpose } from '../types';

interface NavbarProps {
  isBn: boolean;
  setIsBn: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme: "light" | "reference" | "emerald" | "atlas" | "midnight";
  setTheme: (t: "light" | "reference" | "emerald" | "atlas" | "midnight") => void;
  selectedDistrictName: string;
  onOpenQuickSelect: () => void;
  comparedCount: number;
  selectedPurpose: SuitabilityPurpose;
  setSelectedPurpose: (p: SuitabilityPurpose) => void;
  onOpenContestModal: () => void;
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
  comparedCount,
  selectedPurpose,
  setSelectedPurpose,
  onOpenContestModal,
  activeSection,
  setActiveSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLight = theme === "light";

  const purposeLabels: Record<SuitabilityPurpose, { en: string; bn: string }> = {
    residential: { en: 'Residential', bn: 'আবাসিক' },
    hotel: { en: 'Hotel / Resort', bn: 'হোটেল / রিসোর্ট' },
    farm: { en: 'Farm / Agro', bn: 'কৃষি খামার' },
    hospital: { en: 'Hospital', bn: 'হাসপাতাল' },
    restaurant: { en: 'Restaurant', bn: 'রেস্তোরাঁ' },
  };

  const navItems = [
    { id: 'hero-map', labelEn: 'Vector Map', labelBn: 'ভেক্টর ম্যাপ', icon: <MapPin size={13} /> },
    { id: 'district-dashboard', labelEn: '64 Districts', labelBn: '৬৪ জেলা তথ্য', icon: <Building2 size={13} /> },
    { id: 'finder', labelEn: 'Land Finder', labelBn: 'ল্যান্ড ফাইন্ডার', icon: <Search size={13} /> },
    { id: 'compare', labelEn: 'Compare', labelBn: 'জমি তুলনা', icon: <Scale size={13} />, badge: comparedCount > 0 ? comparedCount : undefined },
    { id: 'tourism', labelEn: 'Tourism & Stays', labelBn: 'পর্যটন ও হোটেল', icon: <Compass size={13} /> },
    { id: 'advisor', labelEn: 'AI Advisor', labelBn: 'এআই উপদেষ্টা', icon: <Bot size={13} /> },
    { id: 'calculator', labelEn: 'Cadastre & Calc', labelBn: 'ক্যালকুলেটর', icon: <Sparkles size={13} /> },
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
                <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-heading font-black text-lg sm:text-xl tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                  LandWise<span className="text-emerald-600 dark:text-emerald-400 font-extrabold ml-1">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                  LA-135 GIS
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden sm:block ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {isBn ? "বাংলাদেশ ডিজিটাল ক্যাডাস্ট্রাল ও পর্যটন ইন্টেলিজেন্স" : "Bangladesh Land Intelligence & Tourism Platform"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden xl:flex items-center gap-1 p-1 rounded-xl border text-xs font-semibold ${
            isLight ? "bg-slate-100/90 border-slate-200" : "bg-slate-800/60 border-slate-700/50"
          }`}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20' 
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {item.icon}
                  <span>{isBn ? item.labelBn : item.labelEn}</span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Global Purpose Selector */}
            <div className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs ${
              isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-slate-800/90 border-slate-700 text-slate-200"
            }`}>
              <span className={`font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>{isBn ? 'উদ্দেশ্য:' : 'Purpose:'}</span>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value as SuitabilityPurpose)}
                className={`bg-transparent font-bold border-none focus:outline-none cursor-pointer pr-1 ${
                  isLight ? "text-emerald-700" : "text-emerald-300"
                }`}
                aria-label="Select development purpose"
              >
                <option value="residential" className={isLight ? "bg-white text-slate-800" : "bg-slate-900 text-white"}>{isBn ? 'আবাসিক' : 'Residential'}</option>
                <option value="hotel" className={isLight ? "bg-white text-slate-800" : "bg-slate-900 text-white"}>{isBn ? 'হোটেল' : 'Hotel / Resort'}</option>
                <option value="farm" className={isLight ? "bg-white text-slate-800" : "bg-slate-900 text-white"}>{isBn ? 'কৃষি' : 'Farm / Agro'}</option>
                <option value="hospital" className={isLight ? "bg-white text-slate-800" : "bg-slate-900 text-white"}>{isBn ? 'হাসপাতাল' : 'Hospital'}</option>
                <option value="restaurant" className={isLight ? "bg-white text-slate-800" : "bg-slate-900 text-white"}>{isBn ? 'রেস্তোরাঁ' : 'Restaurant'}</option>
              </select>
            </div>

            {/* Quick District Badge Button */}
            <button
              onClick={onOpenQuickSelect}
              type="button"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200"
              }`}
              title="Change active district"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className={`font-bold truncate max-w-[80px] ${isLight ? "text-emerald-700" : "text-emerald-300"}`}>{selectedDistrictName}</span>
              <ChevronDown size={12} className={isLight ? "text-slate-500" : "text-slate-400"} />
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setIsBn((prev) => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
              }`}
              aria-label="Toggle Language"
            >
              <Globe2 size={13} className="text-emerald-500" />
              <span>{isBn ? "বাংলা" : "EN"}</span>
            </button>

            {/* Theme Selector */}
            <div className="relative group hidden sm:block">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className={`appearance-none text-xs font-semibold px-2.5 py-1.5 pr-6 rounded-xl border cursor-pointer focus:outline-none transition-colors ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                }`}
                aria-label="Map Visual Style"
              >
                <option value="light">{isBn ? "☀️ হোয়াইট জিআইএস (ডিফল্ট)" : "☀️ Clean White GIS"}</option>
                <option value="reference">{isBn ? "ঐতিহ্যবাহী রঙের মানচিত্র" : "Atlas Theme"}</option>
                <option value="emerald">{isBn ? "এমারেল্ড জিআইএস থিম" : "Emerald GIS"}</option>
                <option value="midnight">{isBn ? "মিডনাইট সাইবার থিম" : "Midnight Cyber"}</option>
                <option value="atlas">{isBn ? "বিভাগভিত্তিক থিম" : "Division Colors"}</option>
              </select>
              <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${isLight ? "text-slate-500" : "text-slate-400"}`} />
            </div>

            {/* Contest Info Modal Button */}
            <button
              onClick={onOpenContestModal}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
              }`}
              title="Contest specifications, offline compliance, and 3-minute demo plan"
              aria-label="Contest Information"
            >
              <Info size={14} className="text-amber-500" />
              <span className="hidden sm:inline">{isBn ? "প্রতিযোগিতা তথ্য" : "Contest Info"}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-1.5 rounded-xl border ${
                isLight
                  ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={`xl:hidden py-3 border-t space-y-2 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold ${
                    activeSection === item.id
                      ? 'bg-emerald-600 text-white'
                      : isLight
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {item.icon}
                    <span>{isBn ? item.labelBn : item.labelEn}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border ${
              isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-slate-800/80 border-slate-700 text-slate-300"
            }`}>
              <span className={`font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {isBn ? 'মূল্যায়ন উদ্দেশ্য:' : 'Evaluation Purpose:'}
              </span>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value as SuitabilityPurpose)}
                className={`font-bold rounded px-2 py-1 border ${
                  isLight ? "bg-white text-emerald-700 border-slate-300" : "bg-slate-900 text-emerald-300 border-slate-700"
                }`}
              >
                <option value="residential">{isBn ? 'আবাসিক' : 'Residential'}</option>
                <option value="hotel">{isBn ? 'হোটেল' : 'Hotel / Resort'}</option>
                <option value="farm">{isBn ? 'কৃষি' : 'Farm / Agro'}</option>
                <option value="hospital">{isBn ? 'হাসপাতাল' : 'Hospital'}</option>
                <option value="restaurant">{isBn ? 'রেস্তোরাঁ' : 'Restaurant'}</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
