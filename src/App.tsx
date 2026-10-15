import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BangladeshInteractiveMap } from './components/BangladeshInteractiveMap';
import { HeroMapDossier } from './components/HeroMapDossier';
import { RegionQuickGrid } from './components/RegionQuickGrid';
import { LandCalculatorSection } from './components/LandCalculatorSection';
import { CadastralExplorerSection } from './components/CadastralExplorerSection';
import { DistrictIntelligenceDashboard } from './components/DistrictIntelligenceDashboard';
import { DueDiligenceWorkbench } from './components/duediligence/DueDiligenceWorkbench';
import { HowItWorksEducationalSection } from './components/education/HowItWorksEducationalSection';
import { TrustedInfrastructureSection } from './components/business/TrustedInfrastructureSection';
import { LandTech2026Suite } from './components/landtech/LandTech2026Suite';
import { Footer } from './components/Footer';
import { LandWiseChatbot } from './components/LandWiseChatbot';

// Geographic Datasets & Types
import {
  ALL_BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  DistrictData,
  DivisionData,
} from './data/bangladeshMapData';

export function App() {
  const [isBn, setIsBn] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme-mode");
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [theme]);

  const [activeSection, setActiveSection] = useState<string>("hero-map");

  // Default selected: Dhaka district & Dhaka division
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(
    ALL_BANGLADESH_DISTRICTS.find((d) => d.id === "dhaka") || ALL_BANGLADESH_DISTRICTS[0]
  );
  const [selectedDivision, setSelectedDivision] = useState<DivisionData | null>(
    BANGLADESH_DIVISIONS.find((d) => d.id === "dhaka") || BANGLADESH_DIVISIONS[0]
  );

  // Sync document title dynamically with language and active district
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (selectedDistrict) {
        document.title = isBn
          ? `${selectedDistrict.bnName} — ল্যান্ডওয়াইজ স্মার্ট ভূমি প্ল্যাটফর্ম`
          : `${selectedDistrict.name} — LandWise Land Intelligence`;
      } else {
        document.title = isBn
          ? "ল্যান্ডওয়াইজ — বাংলাদেশের স্মার্ট ভূমি ও ক্যাডাস্ট্রাল তথ্যচিত্র"
          : "LandWise — Bangladesh Land & Cadastral Intelligence";
      }
    }
  }, [isBn, selectedDistrict]);

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
    <div className={`min-h-screen flex flex-col selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-950 transition-colors duration-150 ${
      isLight ? "bg-[#FFFFFF] text-[#09090B]" : "bg-[#09090B] text-[#FAFAFA]"
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
        selectedDistrict={selectedDistrict}
        onSelectDistrict={handleSelectDistrict}
        districts={ALL_BANGLADESH_DISTRICTS}
        divisions={BANGLADESH_DIVISIONS}
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
        <section id="hero-map" className="relative w-full pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-[1180px] mx-auto space-y-6">
          {/* Hero Header */}
          <div className="text-center max-w-4xl mx-auto space-y-3.5">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-tight transition-all ${
              isLight 
                ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#52525B]" 
                : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
            }`}>
              <span className="bms-live-dot"></span>
              <span>
                {isBn
                  ? "৬৪ জেলা • জাতীয় ভূমি ও ক্যাডাস্ট্রাল মানচিত্র"
                  : "64 Districts • National Land & Cadastral Graph"}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-5xl font-heading font-extrabold tracking-tight leading-tight sm:whitespace-nowrap ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
              {isBn
                ? "বাংলাদেশের স্মার্ট ভূমি ও ক্যাডাস্ট্রাল তথ্যচিত্র"
                : "Bangladesh Land & Cadastral Intelligence"}
            </h1>

            <p className={`text-sm sm:text-[15px] max-w-2xl mx-auto leading-relaxed ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
              {isBn
                ? "৬৪ জেলার ক্যাডাস্ট্রাল মানচিত্র, তাৎক্ষণিক প্লট মূল্যায়ন, দাগ ও খতিয়ান রেকর্ড এবং মৌজা ভিত্তিক যাচাই প্ল্যাটফর্ম।"
                : "Interactive cadastral maps, instant land valuations, plot & khatian records, and spatial intelligence across all 64 districts."}
            </p>

            {/* Quick KPI stats cards — BMS Pill Box style */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2 text-xs">
              <div className={`bms-pill-box flex items-center gap-2 px-3.5 py-2 shadow-xs cursor-default ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B]" : "bg-[#18181B] border-[#27272A] text-[#FAFAFA]"
              }`}>
                <i className="bx bx-map-alt text-base text-[#16A34A] dark:text-[#4ADE80]" aria-hidden="true" />
                <span><strong className="font-bold">64</strong> {isBn ? "জেলা ম্যাপড" : "Districts Mapped"}</span>
              </div>

              <div className={`bms-pill-box flex items-center gap-2 px-3.5 py-2 shadow-xs cursor-default ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B]" : "bg-[#18181B] border-[#27272A] text-[#FAFAFA]"
              }`}>
                <i className="bx bx-grid-alt text-base text-[#2563EB] dark:text-[#60A5FA]" aria-hidden="true" />
                <span><strong className="font-bold">8</strong> {isBn ? "প্রশাসনিক বিভাগ" : "Divisions"}</span>
              </div>

              <div className={`bms-pill-box flex items-center gap-2 px-3.5 py-2 shadow-xs cursor-default ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B]" : "bg-[#18181B] border-[#27272A] text-[#FAFAFA]"
              }`}>
                <i className="bx bx-network-chart text-base text-[#16A34A] dark:text-[#4ADE80]" aria-hidden="true" />
                <span>{isBn ? "১০০% ক্লায়েন্ট সাইড ইঞ্জিন" : "100% Client Spatial Graph"}</span>
              </div>

              <div className={`bms-pill-box flex items-center gap-2 px-3.5 py-2 shadow-xs cursor-default ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B]" : "bg-[#18181B] border-[#27272A] text-[#FAFAFA]"
              }`}>
                <i className="bx bx-git-repo-forked text-base text-[#D97706] dark:text-[#FBBF24]" aria-hidden="true" />
                <span>{isBn ? "রেকর্ড ও স্বত্বলিপি ক্রস-অডিট" : "Records & Title Chain Graph"}</span>
              </div>
            </div>

            {/* Story Navigation CTA for Judges and First-Time Visitors */}
            <div className="pt-2 flex items-center justify-center">
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer"
              >
                <i className="bx bx-book-open text-sm" />
                <span>
                  {isBn
                    ? "১ মিনিটের গল্প: সমস্যা → সমাধান → ব্যবসায়িক মডেল (সম্পূর্ণ রূপরেখা) ↓"
                    : "The 1-Minute Story: Problem → Solution → Business Value ↓"}
                </span>
                <i className="bx bx-down-arrow-alt text-sm" />
              </a>
            </div>
          </div>

          {/* Interactive Map — full width */}
          <div className="w-full pt-4">
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

          {/* Dossier — full-width row below the map */}
          <div className="w-full">
            <HeroMapDossier
              isBn={isBn}
              theme={theme}
              selectedDistrict={selectedDistrict}
              selectedDivision={selectedDivision}
              onSelectDistrictById={handleSelectDistrictById}
            />
          </div>
        </section>

        {/* ── 3. VISITOR EDUCATION & HOW IT WORKS (END-TO-END TRUST JOURNEY) ── */}
        <section id="how-it-works" className="w-full">
          <HowItWorksEducationalSection
            isBn={isBn}
            theme={theme}
          />
        </section>

        {/* ── 4. NEW PRODUCT CORE: LANDWISE AI DUE-DILIGENCE WORKBENCH ── */}
        <section id="due-diligence" className="w-full">
          <DueDiligenceWorkbench
            isBn={isBn}
            theme={theme}
            selectedDistrictId={selectedDistrict?.id}
            onSelectDistrictById={handleSelectDistrictById}
          />
        </section>

        {/* ── 4. STRATEGIC VALUE & GOVTECH INFRASTRUCTURE: BUSINESS, REVENUE & ROI ── */}
        <section id="trusted-infrastructure" className="w-full">
          <TrustedInfrastructureSection
            isBn={isBn}
            theme={theme}
          />
        </section>

        {/* ── 5. LANDTECH 2026 INNOVATION HACKATHON TRACK SUITE (P1-P5 & TARGET SECTORS) ── */}
        <section id="landtech-track" className="w-full">
          <LandTech2026Suite
            isBn={isBn}
            theme={theme}
          />
        </section>

        {/* ── 5. FULL 64-DISTRICT CADASTRAL & ECONOMIC INTELLIGENCE DASHBOARD ── */}
        <section id="district-dashboard" className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <DistrictIntelligenceDashboard
            selectedDistrict={selectedDistrict}
            isBn={isBn}
            theme={theme}
          />
        </section>


        {/* ── 5. CADASTRAL EXPLORER (CS, SA, RS, BS SURVEYS & PORCHA RECORDS) ── */}
        <section id="cadastre" className="w-full">
          <CadastralExplorerSection
            isBn={isBn}
            selectedDistrict={selectedDistrict}
            theme={theme}
          />
        </section>

        {/* ── 6. BANGLADESHI LAND UNIT CONVERTER & REGIONAL VALUATION ── */}
        <section id="calculator" className="w-full">
          <LandCalculatorSection
            isBn={isBn}
            selectedDistrict={selectedDistrict}
            theme={theme}
          />
        </section>

        {/* ── 7. QUICK DIVISION & REGION SELECTOR GRID ── */}
        <div id="quick-grid" className="w-full">
          <RegionQuickGrid
            isBn={isBn}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleSelectDistrict}
            selectedDivision={selectedDivision}
            onSelectDivision={handleSelectDivision}
            theme={theme}
          />
        </div>

      </main>

      {/* ── FOOTER WITH OFFICIAL SOURCES & STATUTORY LEGAL DISCLAIMER ── */}
      <Footer isBn={isBn} theme={theme} />

      {/* ── FLOATING AI CHATBOT ── */}
      <LandWiseChatbot
        theme={theme}
        isBn={isBn}
        selectedDistrictName={selectedDistrict ? (isBn ? selectedDistrict.bnName : selectedDistrict.name) : undefined}
      />
    </div>
  );
}

export default App;
