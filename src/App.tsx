import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BangladeshInteractiveMap } from './components/BangladeshInteractiveMap';
import { HeroMapDossier } from './components/HeroMapDossier';
import { RegionQuickGrid } from './components/RegionQuickGrid';
import { LandCalculatorSection } from './components/LandCalculatorSection';
import { CadastralExplorerSection } from './components/CadastralExplorerSection';
import { DistrictIntelligenceDashboard } from './components/DistrictIntelligenceDashboard';
import { DueDiligenceWorkbench } from './components/duediligence/DueDiligenceWorkbench';
import { Footer } from './components/Footer';

// Geographic Datasets & Types
import {
  ALL_BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  DistrictData,
  DivisionData,
} from './data/bangladeshMapData';
import { CheckCircle2, ShieldCheck, Sparkles, FileCheck2, Scale } from 'lucide-react';

export function App() {
  const [isBn, setIsBn] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "reference" | "emerald" | "atlas" | "midnight">("light");
  const [activeSection, setActiveSection] = useState<string>("hero-map");

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

  const isLight = theme === "light";

  return (
    <div className={`min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-150 ${
      isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"
    }`}>
      {/* ── 1. STICKY TOP NAVIGATION BAR ── */}
      <Navbar
        isBn={isBn}
        setIsBn={setIsBn}
        theme={theme}
        setTheme={setTheme}
        selectedDistrictName={
          selectedDistrict ? (isBn ? selectedDistrict.bnName : selectedDistrict.name) : "Dhaka"
        }
        onOpenQuickSelect={() => {
          const el = document.getElementById('quick-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-1 flex flex-col space-y-16 sm:space-y-20 pb-16">
        
        {/* ── 2. PRESERVED BANGLADESH 64-DISTRICT INTERACTIVE VECTOR MAP OVERVIEW ── */}
        <section id="hero-map" className="relative w-full pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>
                {isBn
                  ? "🇧🇩 ৬৪ জেলা • ৮ বিভাগ • পূর্ণাঙ্গ ইন্টারেক্টিভ ভেক্টর মানচিত্র"
                  : "🇧🇩 64 DISTRICTS • 8 DIVISIONS • INTERACTIVE VECTOR MAP"}
              </span>
            </div>

            <h1 className={`text-3xl sm:text-5xl font-heading font-black tracking-tight leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
              {isBn ? (
                <>
                  বাংলাদেশের ইন্টারেক্টিভ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300">ভৌগোলিক ও ভূমি মানচিত্র</span>
                </>
              ) : (
                <>
                  Interactive Bangladesh <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300">Spatial & Land Intelligence</span> Atlas
                </>
              )}
            </h1>

            <p className={`text-xs sm:text-sm font-medium max-w-2xl mx-auto leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              {isBn
                ? "মানচিত্রের যেকোনো অংশ (জেলা বা বিভাগ) নির্বাচন করে তাৎক্ষণিক জমি মূল্যায়ন, ক্যাডাস্ট্রাল জরিপ স্ট্যাটাস ও মৌজা ভিত্তিক আইনি বিশ্লেষণ অন্বেষণ করুন।"
                : "Select any district or division on the vector map to inspect real-time land valuation, cadastral survey progress, infrastructure connectivity, and mouza intelligence."}
            </p>

            {/* Quick KPI stats strip */}
            <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/60 border-slate-800"}`}>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span><strong>64</strong> {isBn ? "জেলা ম্যাপড" : "Districts Mapped"}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/60 border-slate-800"}`}>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span><strong>8</strong> {isBn ? "প্রশাসনিক বিভাগ" : "Divisions"}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/60 border-slate-800"}`}>
                <ShieldCheck size={13} className="text-amber-500" />
                <span>{isBn ? "অফলাইন ডিটারমিনিস্টিক ইঞ্জিন" : "100% Offline Engine"}</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isLight ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/60 border-slate-800"}`}>
                <FileCheck2 size={13} className="text-sky-500" />
                <span>{isBn ? "ডিউ-ডিলিজেন্স ক্রস-অডিট" : "Due-Diligence Cross-Audit"}</span>
              </div>
            </div>
          </div>

          {/* Interactive Map & Side Dossier Layout */}
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
                theme={theme}
                selectedDistrict={selectedDistrict}
                selectedDivision={selectedDivision}
                onSelectDistrictById={handleSelectDistrictById}
              />
            </div>
          </div>
        </section>

        {/* ── 3. NEW PRODUCT CORE: LANDWISE AI DUE-DILIGENCE WORKBENCH ── */}
        <section id="due-diligence" className="w-full">
          <DueDiligenceWorkbench
            isBn={isBn}
            selectedDistrictId={selectedDistrict?.id}
            onSelectDistrictById={handleSelectDistrictById}
          />
        </section>

        {/* ── 4. FULL 64-DISTRICT CADASTRAL & ECONOMIC INTELLIGENCE DASHBOARD ── */}
        <section id="district-dashboard" className="w-full">
          <DistrictIntelligenceDashboard
            selectedDistrict={selectedDistrict}
            isBn={isBn}
            theme={theme}
          />
        </section>

        {/* ── 5. CADASTRAL EXPLORER (CS, SA, RS, BS SURVEYS & PORCHA RECORDS) ── */}
        <section id="cadastre" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CadastralExplorerSection
            isBn={isBn}
            selectedDistrict={selectedDistrict}
          />
        </section>

        {/* ── 6. BANGLADESHI LAND UNIT CONVERTER & REGIONAL VALUATION ── */}
        <section id="calculator" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LandCalculatorSection
            isBn={isBn}
            selectedDistrict={selectedDistrict}
          />
        </section>

        {/* ── 7. QUICK DIVISION & REGION SELECTOR GRID ── */}
        <div id="quick-grid" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegionQuickGrid
            isBn={isBn}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleSelectDistrict}
            selectedDivision={selectedDivision}
            onSelectDivision={handleSelectDivision}
          />
        </div>

      </main>

      {/* ── FOOTER WITH OFFICIAL SOURCES & STATUTORY LEGAL DISCLAIMER ── */}
      <Footer isBn={isBn} />
    </div>
  );
}

export default App;
