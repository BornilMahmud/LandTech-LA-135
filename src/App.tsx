import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BangladeshInteractiveMap } from './components/BangladeshInteractiveMap';
import { HeroMapDossier } from './components/HeroMapDossier';
import { RegionQuickGrid } from './components/RegionQuickGrid';
import { LandCalculatorSection } from './components/LandCalculatorSection';
import { CadastralExplorerSection } from './components/CadastralExplorerSection';
import { SpatialFeaturesSection } from './components/SpatialFeaturesSection';
import { Footer } from './components/Footer';

// LandWise AI Core Platform Components
import { LandFinder } from './components/LandFinder';
import { PropertyComparison } from './components/PropertyComparison';
import { TourismExplorer } from './components/TourismExplorer';
import { AdvisorChat } from './components/AdvisorChat';
import { SuitabilityModal } from './components/SuitabilityModal';
import { ContestNoticeModal } from './components/ContestNoticeModal';

// Sample Datasets & Types
import { BANGLADESH_PARCELS } from './data/parcels';
import { BANGLADESH_DESTINATIONS } from './data/tourism';
import { BANGLADESH_ACCOMMODATIONS } from './data/accommodations';
import { LandParcel, SuitabilityPurpose, TourismDestination } from './types';
import {
  ALL_BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  DistrictData,
  DivisionData,
} from './data/bangladeshMapData';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export function App() {
  const [isBn, setIsBn] = useState<boolean>(false);
  const [theme, setTheme] = useState<"reference" | "emerald" | "atlas" | "midnight">("reference");
  const [activeSection, setActiveSection] = useState<string>("hero-map");

  // Selected Land Purpose for Deterministic Suitability Evaluation
  const [selectedPurpose, setSelectedPurpose] = useState<SuitabilityPurpose>('residential');

  // Compared Parcels (pre-seed with 2 properties for immediate demo availability)
  const [comparedParcelIds, setComparedParcelIds] = useState<string[]>([
    'bd-dhk-01',
    'bd-cxb-02'
  ]);

  // Selected Parcel for In-Depth AI Advisor / Map Focus
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(BANGLADESH_PARCELS[0]);

  // Selected Destination for Tourism Explorer
  const [selectedDestination, setSelectedDestination] = useState<TourismDestination>(
    BANGLADESH_DESTINATIONS[0]
  );

  // Suitability Evaluation Modal State
  const [dossierParcel, setDossierParcel] = useState<LandParcel | null>(null);

  // Contest Rule Notice & Provenance Modal
  const [isContestNoticeOpen, setIsContestNoticeOpen] = useState<boolean>(false);

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

  // Compare toggling logic (supports max 3 items)
  const handleToggleCompare = (parcel: LandParcel) => {
    setComparedParcelIds((prev) => {
      if (prev.includes(parcel.id)) {
        return prev.filter((id) => id !== parcel.id);
      }
      if (prev.length >= 3) {
        alert(
          isBn
            ? 'একসাথে সর্বোচ্চ ৩টি জমির প্লট তুলনা করা যাবে।'
            : 'You can compare a maximum of 3 properties simultaneously.'
        );
        return prev;
      }
      return [...prev, parcel.id];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setComparedParcelIds((prev) => prev.filter((pId) => pId !== id));
  };

  const handleClearCompare = () => {
    setComparedParcelIds([]);
  };

  // Map & Advisor Navigation Handlers
  const handleSelectOnMap = (parcel: LandParcel) => {
    setSelectedParcel(parcel);
    const normalizedDistrictName = parcel.district.toLowerCase();
    const matchedDistrict = ALL_BANGLADESH_DISTRICTS.find(
      (d) => d.name.toLowerCase() === normalizedDistrictName || d.id === normalizedDistrictName
    );
    if (matchedDistrict) {
      handleSelectDistrict(matchedDistrict);
    }
    setActiveSection('hero-map');
    const el = document.getElementById('hero-map');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectDestinationOnMap = (dest: TourismDestination) => {
    setSelectedDestination(dest);
    const normalizedDistrictName = dest.district.toLowerCase();
    const matchedDistrict = ALL_BANGLADESH_DISTRICTS.find(
      (d) => d.name.toLowerCase() === normalizedDistrictName || d.id === normalizedDistrictName
    );
    if (matchedDistrict) {
      handleSelectDistrict(matchedDistrict);
    }
    setActiveSection('hero-map');
    const el = document.getElementById('hero-map');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskAdvisorForParcel = (parcel: LandParcel) => {
    setSelectedParcel(parcel);
    setActiveSection('advisor');
    const el = document.getElementById('advisor');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskAdvisorForDestination = (dest: TourismDestination) => {
    setSelectedDestination(dest);
    setActiveSection('advisor');
    const el = document.getElementById('advisor');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter compared parcels from dataset
  const comparedParcels = BANGLADESH_PARCELS.filter((p) => comparedParcelIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* ── STICKY NAVIGATION BAR ── */}
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
        comparedCount={comparedParcels.length}
        selectedPurpose={selectedPurpose}
        setSelectedPurpose={setSelectedPurpose}
        onOpenContestModal={() => setIsContestNoticeOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main className="flex-1 flex flex-col space-y-12 sm:space-y-16">
        
        {/* ── 1. HERO BANGLADESH MAP EXPLORER ── */}
        <section id="hero-map" className="relative w-full pt-6 sm:pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
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
                ? "মানচিত্রের যেকোনো অংশ (জেলা বা বিভাগ) নির্বাচন করে তাৎক্ষণিক জমি মূল্যায়ন, ক্যাডাস্ট্রাল জরিপ স্ট্যাটাস ও পর্যটন স্পট বিশ্লেষণ করুন।"
                : "Select any district or division on the vector map to inspect real-time land valuation, cadastral zoning, infrastructure connectivity, and tourism destinations."}
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
                <ShieldCheck size={13} className="text-amber-400" />
                <span>{isBn ? "অফলাইন ডিটারমিনিস্টিক ইঞ্জিন" : "100% Offline Engine"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
                <Sparkles size={13} className="text-sky-400" />
                <span>{isBn ? "৫টি ব্যবহারের উপযোগীতা রেটিং" : "5 Use-Case Suitability"}</span>
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

        {/* ── 2. SMART LAND FINDER ── */}
        <section id="finder" className="w-full">
          <LandFinder
            parcels={BANGLADESH_PARCELS}
            selectedPurpose={selectedPurpose}
            setSelectedPurpose={setSelectedPurpose}
            language={isBn ? 'bn' : 'en'}
            comparedParcelIds={comparedParcelIds}
            onToggleCompare={handleToggleCompare}
            onOpenSuitabilityModal={(parcel) => setDossierParcel(parcel)}
            onSelectOnMap={handleSelectOnMap}
            onAskAdvisor={handleAskAdvisorForParcel}
          />
        </section>

        {/* ── 3. PROPERTY COMPARISON MATRIX ── */}
        <section id="compare" className="w-full">
          <PropertyComparison
            comparedParcels={comparedParcels}
            selectedPurpose={selectedPurpose}
            setSelectedPurpose={setSelectedPurpose}
            language={isBn ? 'bn' : 'en'}
            onRemoveCompare={handleRemoveCompare}
            onClearCompare={handleClearCompare}
            onGoToFinder={() => {
              setActiveSection('finder');
              const el = document.getElementById('finder');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenSuitabilityModal={(parcel) => setDossierParcel(parcel)}
            onAskAdvisor={handleAskAdvisorForParcel}
          />
        </section>

        {/* ── 4. TOURISM & VERIFIED ACCOMMODATIONS ── */}
        <section id="tourism" className="w-full">
          <TourismExplorer
            destinations={BANGLADESH_DESTINATIONS}
            accommodations={BANGLADESH_ACCOMMODATIONS}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
            language={isBn ? 'bn' : 'en'}
            onViewOnMap={handleSelectDestinationOnMap}
            onAskAdvisorForDestination={handleAskAdvisorForDestination}
          />
        </section>

        {/* ── 5. GROUNDED AI LAND ADVISOR ── */}
        <section id="advisor" className="w-full">
          <AdvisorChat
            selectedParcel={selectedParcel}
            comparedParcels={comparedParcels}
            selectedPurpose={selectedPurpose}
            selectedDestination={selectedDestination}
            language={isBn ? 'bn' : 'en'}
          />
        </section>

        {/* ── 6. QUICK DIVISION & REGION SELECTOR ── */}
        <div id="quick-grid">
          <RegionQuickGrid
            isBn={isBn}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleSelectDistrict}
            selectedDivision={selectedDivision}
            onSelectDivision={handleSelectDivision}
          />
        </div>

        {/* ── 7. CADASTRAL EXPLORER (MOUZA & PLOTS) ── */}
        <div id="cadastre">
          <CadastralExplorerSection
            isBn={isBn}
            selectedDistrict={selectedDistrict}
          />
        </div>

        {/* ── 8. BANGLADESHI LAND UNIT CONVERTER & VALUATION ── */}
        <div id="calculator">
          <LandCalculatorSection
            isBn={isBn}
            selectedDistrict={selectedDistrict}
          />
        </div>

        {/* ── 9. SPATIAL CAPABILITIES ── */}
        <SpatialFeaturesSection
          isBn={isBn}
        />

      </main>

      {/* ── FOOTER ── */}
      <Footer isBn={isBn} />

      {/* ── MODALS ── */}
      {/* 1. In-Depth Suitability Assessment Modal with Configurable Factor Sliders */}
      <SuitabilityModal
        parcel={dossierParcel}
        purpose={selectedPurpose}
        onPurposeChange={setSelectedPurpose}
        language={isBn ? 'bn' : 'en'}
        onClose={() => setDossierParcel(null)}
      />

      {/* 2. Hackathon Compliance, Provenance & 3-Minute Demo Plan Modal */}
      {isContestNoticeOpen && (
        <ContestNoticeModal
          language={isBn ? 'bn' : 'en'}
          onClose={() => setIsContestNoticeOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
