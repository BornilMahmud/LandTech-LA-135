import React from 'react';
import { Compass, Globe2, Layers, MapPin, Sparkles, Shield, ChevronDown } from 'lucide-react';

interface NavbarProps {
  isBn: boolean;
  setIsBn: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme: "reference" | "emerald" | "atlas" | "midnight";
  setTheme: (t: "reference" | "emerald" | "atlas" | "midnight") => void;
  selectedDistrictName: string;
  onOpenQuickSelect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isBn,
  setIsBn,
  theme,
  setTheme,
  selectedDistrictName,
  onOpenQuickSelect,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Meta */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg sm:text-xl text-white tracking-tight">
                  LandTech<span className="text-emerald-400 font-extrabold ml-1">LA-135</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  GIS SPATIAL V2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {isBn ? "বাংলাদেশ ডিজিটাল ক্যাডাস্ট্রাল ও ভূমি মানচিত্র প্ল্যাটফর্ম" : "Bangladesh Interactive Spatial & Cadastral Land Atlas"}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50 text-xs font-semibold">
            <a
              href="#hero-map"
              className="px-3 py-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-slate-700/60 transition-all flex items-center gap-1.5"
            >
              <MapPin size={13} />
              <span>{isBn ? "ইন্টারেক্টিভ মানচিত্র" : "Interactive Map"}</span>
            </a>
            <a
              href="#cadastral"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all flex items-center gap-1.5"
            >
              <Layers size={13} />
              <span>{isBn ? "ক্যাডাস্ট্রাল রেকর্ডস" : "Cadastral Parcels"}</span>
            </a>
            <a
              href="#calculator"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>{isBn ? "ভূমি মূল্যায়ন ক্যালকুলেটর" : "Valuation Calculator"}</span>
            </a>
            <a
              href="#features"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all flex items-center gap-1.5"
            >
              <Shield size={13} />
              <span>{isBn ? "বৈশিষ্ট্য ও প্রযুক্তি" : "GIS Engine"}</span>
            </a>
          </nav>

          {/* Right Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick District Badge Button */}
            <button
              onClick={onOpenQuickSelect}
              type="button"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all"
              title="Change active region"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">{isBn ? "সক্রিয় এলাকা:" : "Active:"}</span>
              <span className="font-bold text-emerald-300">{selectedDistrictName}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setIsBn((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700/80 transition-all active:scale-95"
              aria-label="Toggle Language"
            >
              <Globe2 size={13} className="text-emerald-400" />
              <span>{isBn ? "বাংলা" : "ENG"}</span>
            </button>

            {/* Theme Selector */}
            <div className="relative group">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="appearance-none bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 pr-6 rounded-xl border border-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400"
                aria-label="Map Visual Style"
              >
                <option value="reference">{isBn ? "ঐতিহ্যবাহী রঙের মানচিত্র" : "Authentic Atlas (Colors)"}</option>
                <option value="emerald">{isBn ? "এমারেল্ড জিআইএস থিম" : "Emerald GIS Dark"}</option>
                <option value="midnight">{isBn ? "মিডনাইট সাইবার থিম" : "Midnight Cyber Dark"}</option>
                <option value="atlas">{isBn ? "বিভাগভিত্তিক কালার থিম" : "Division Color Coding"}</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            {/* CTA Button */}
            <a
              href="#hero-map"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition-all transform active:scale-95"
            >
              <span>{isBn ? "অনুসন্ধান করুন" : "Explore Map"}</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
