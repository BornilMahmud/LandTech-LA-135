import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BangladeshInteractiveMap } from './components/BangladeshInteractiveMap';
import { HeroMapDossier } from './components/HeroMapDossier';
import { RegionQuickGrid } from './components/RegionQuickGrid';
import { LandCalculatorSection } from './components/LandCalculatorSection';
import { CadastralExplorerSection } from './components/CadastralExplorerSection';
import { SpatialFeaturesSection } from './components/SpatialFeaturesSection';
import { Footer } from './components/Footer';
import {
  ALL_BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  DistrictData,
  DivisionData,
} from './data/bangladeshMapData';
import { Sparkles, MapPin, Layers, Compass, TrendingUp, CheckCircle2 } from 'lucide-react';

export function App() {
  const [isBn, setIsBn] = useState<boolean>(false);
  const [theme, setTheme] = useState<"reference" | "emerald" | "atlas" | "midnight">("reference");
  
  // Default selected: Dhaka district & Dhaka division
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(
    ALL_BANGLADESH_DISTRICTS.find((d) => d.id === "dhaka") || ALL_BANGLADESH_DISTRICTS[0]
  );
  const [selectedDivision, setSelectedDivision] = useState<DivisionData | null>(
    BANGLADESH_DIVISIONS.find((d) => d.id === "dhaka") || BANGLADESH_DIVISIONS[0]
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSelectDistrict = (district: DistrictData) => {
    setSelectedDistrict(district);
    const parentDiv = BANGLADESH_DIVISIONS.find((d) => d.id === district.divisionId);
    if (parentDiv) {
      setSelectedDivision(parentDiv);
    }
  };

  const handleSelectDivision = (division: DivisionData) => {
    setSelectedDivision(division);
  };

  const handleSelectDistrictById = (id: string) => {
    const dst = ALL_BANGLADESH_DISTRICTS.find((d) => d.id === id);
    if (dst) handleSelectDistrict(dst);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        isBn={isBn}
        setIsBn={setIsBn}
        theme={theme}
        setTheme={setTheme}
        selectedDistrictName={selectedDistrict ? (isBn ? selectedDistrict.bnName : selectedDistrict.name) : "Dhaka"}
        onOpenQuickSelect={() => {
          const el = document.getElementById('quick-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        
        {/* ── HERO SECTION WITH BANGLADESH MAP ── */}
        <section id="hero-map" className="relative w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>
                {isBn
                  ? "🇧🇩 ৬৪ জেলা • ৮ বিভাগ • পূর্ণাঙ্গ ইন্টারেক্টিভ ভেক্টর মানচিত্র"
                  : "🇧🇩 64 DISTRICTS • 8 DIVISIONS • INTERACTIVE VECTOR MAP"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-white leading-tight">
              {isBn ? (
                <>
                  বাংলাদেশের ইন্টারেক্টিভ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">ভৌগোলিক ও ভূমি মানচিত্র</span>
                </>
              ) : (
                <>
                  Interactive Bangladesh <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Spatial & Land Intelligence</span> Atlas
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {isBn
                ? "মানচিত্রের যেকোনো অংশ (জেলা বা বিভাগ) নির্বাচন করে তাৎক্ষণিক জমি মূল্যায়ন, ক্যাডাস্ট্রাল জরিপ স্ট্যাটাস ও অর্থনৈতিক করিডোর বিশ্লেষণ করুন।"
                : "Select any part or area (district or division) on the interactive map to inspect real-time land valuation, cadastral zoning, infrastructure megaprojects, and spatial data."}
            </p>

            {/* Quick KPI stats strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span><strong>64</strong> {isBn ? "জেলা ম্যাপড" : "Districts Mapped"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span><strong>8</strong> {isBn ? "প্রশাসনিক বিভাগ" : "Divisions"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={13} className="text-amber-400" />
                <span>{isBn ? "সরাসরি ইন্টারেক্টিভ সিলেকশন" : "Direct Click Selection"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={13} className="text-sky-400" />
                <span>{isBn ? "জুম ও প্যান সমর্থিত" : "Zoom & Pan Enabled"}</span>
              </div>
            </div>
          </div>

          {/* ── HERO MAP & DOSSIER DUAL LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
            
            {/* Left 7/12 Cols: Interactive Map */}
            <div className="lg:col-span-7 xl:col-span-8 w-full">
              <BangladeshInteractiveMap
                isBn={isBn}
                theme={theme}
                setTheme={setTheme}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={handleSelectDistrict}
                selectedDivision={selectedDivision}
                onSelectDivision={handleSelectDivision}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Right 5/12 Cols: Side Dossier Inspector */}
            <div className="lg:col-span-5 xl:col-span-4 w-full">
              <HeroMapDossier
                isBn={isBn}
                selectedDistrict={selectedDistrict}
                selectedDivision={selectedDivision}
                onSelectDistrictById={handleSelectDistrictById}
              />
            </div>

          </div>

        </section>

        {/* ── QUICK DIVISION & REGION SELECTOR ── */}
        <div id="quick-grid">
          <RegionQuickGrid
            isBn={isBn}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleSelectDistrict}
            selectedDivision={selectedDivision}
            onSelectDivision={handleSelectDivision}
          />
        </div>

        {/* ── CADASTRAL EXPLORER (MOUZA & PLOTS) ── */}
        <CadastralExplorerSection
          isBn={isBn}
          selectedDistrict={selectedDistrict}
        />

        {/* ── BANGLADESHI LAND UNIT CONVERTER & VALUATION ── */}
        <LandCalculatorSection
          isBn={isBn}
          selectedDistrict={selectedDistrict}
        />

        {/* ── SPATIAL CAPABILITIES ── */}
        <SpatialFeaturesSection
          isBn={isBn}
        />

      </main>

      {/* Footer */}
      <Footer isBn={isBn} />
    </div>
  );
}

export default App;
