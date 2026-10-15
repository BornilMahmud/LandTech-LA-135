import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Hospital, 
  Compass, 
  Navigation, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Layers, 
  Clock, 
  Info, 
  Trees, 
  Activity, 
  Utensils, 
  Car, 
  Train, 
  Ship, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { getDistrictIntelligence, DistrictIntelligenceRecord } from '../data/districtIntelligence';
import { DistrictData } from '../data/bangladeshMapData';
import { formatBdt } from '../utils/formatters';

interface DistrictIntelligenceDashboardProps {
  selectedDistrict: DistrictData | null;
  isBn: boolean;
  theme: "dark" | "light";
  onSelectUpazila?: (upazilaName: string) => void;
  onNavigateToFinder?: (districtName: string) => void;
  onNavigateToTourism?: (destinationName?: string) => void;
  onAskAdvisor?: (topic: string) => void;
}

export const DistrictIntelligenceDashboard: React.FC<DistrictIntelligenceDashboardProps> = ({
  selectedDistrict,
  isBn,
  theme,
  onSelectUpazila,
  onNavigateToFinder,
  onNavigateToTourism,
  onAskAdvisor,
}) => {
  const isLight = theme === "light";
  
  // District intelligence data
  const districtId = selectedDistrict?.id || 'dhaka';
  const intel: DistrictIntelligenceRecord = useMemo(() => {
    return getDistrictIntelligence(districtId);
  }, [districtId]);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<
    'admin' | 'education' | 'healthcare' | 'infra' | 'tourism' | 'land'
  >('admin');

  // Filter states
  const [upazilaSearch, setUpazilaSearch] = useState('');
  const [eduCategory, setEduCategory] = useState<'All' | 'University' | 'College' | 'School' | 'Technical'>('All');
  const [eduSearch, setEduSearch] = useState('');
  const [healthSearch, setHealthSearch] = useState('');

  // Filtered Upazilas
  const filteredUpazilas = useMemo(() => {
    if (!upazilaSearch.trim()) return intel.upazilas;
    const q = upazilaSearch.toLowerCase();
    return intel.upazilas.filter((u, idx) => 
      u.toLowerCase().includes(q) || (intel.bnUpazilas[idx] && intel.bnUpazilas[idx].includes(q))
    );
  }, [intel, upazilaSearch]);

  // Filtered Education
  const filteredInstitutions = useMemo(() => {
    return intel.sampleInstitutions.filter((inst) => {
      const matchCat = eduCategory === 'All' || inst.category === eduCategory;
      const matchSearch = !eduSearch.trim() || 
        inst.name.toLowerCase().includes(eduSearch.toLowerCase()) || 
        inst.bnName.includes(eduSearch) ||
        inst.upazila.toLowerCase().includes(eduSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [intel, eduCategory, eduSearch]);

  // Filtered Hospitals
  const filteredHospitals = useMemo(() => {
    if (!healthSearch.trim()) return intel.sampleHospitals;
    const q = healthSearch.toLowerCase();
    return intel.sampleHospitals.filter((h) => 
      h.name.toLowerCase().includes(q) || 
      h.bnName.includes(q) || 
      h.upazila.toLowerCase().includes(q)
    );
  }, [intel, healthSearch]);

  const tabs = [
    { id: 'admin', labelEn: 'Administrative & Upazilas', labelBn: 'প্রশাসনিক ও উপজেলা', icon: <i className="bx bx-buildings text-sm" aria-hidden="true" />, count: intel.upazilasCount },
    { id: 'education', labelEn: 'Education Directory', labelBn: 'শিক্ষা প্রতিষ্ঠান', icon: <i className="bx bx-book-reader text-sm" aria-hidden="true" />, count: intel.schoolsCount + intel.collegesCount + intel.universitiesCount },
    { id: 'healthcare', labelEn: 'Healthcare & Clinics', labelBn: 'চিকিৎসা সেবা', icon: <i className="bx bx-plus-medical text-sm" aria-hidden="true" />, count: intel.hospitalsCount + intel.clinicsCount },
    { id: 'infra', labelEn: 'Infrastructure & Transit', labelBn: 'যোগাযোগ ও অবকাঠামো', icon: <i className="bx bx-navigation text-sm" aria-hidden="true" />, count: intel.highways.length + intel.railwayStations.length },
    { id: 'tourism', labelEn: 'Tourism & Heritage', labelBn: 'পর্যটন ও দর্শনীয় স্থান', icon: <i className="bx bx-compass text-sm" aria-hidden="true" />, count: intel.attractionsCount },
    { id: 'land', labelEn: 'Land for Sale & Zoning', labelBn: 'জমি বিক্রয় ও মূল্যায়ন', icon: <i className="bx bx-trending-up text-sm" aria-hidden="true" />, count: intel.landListingsCount },
  ];

  return (
    <div className={`w-full rounded-2xl transition-all border ${
      isLight 
        ? 'bg-white border-zinc-200 shadow-sm text-zinc-800' 
        : 'bg-[#121215] border-zinc-800 shadow-2xl text-zinc-100'
    } p-4 sm:p-6 lg:p-8 space-y-6`}>

      {/* ── 1. DASHBOARD HEADER & QUICK STATS BANNER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{isBn ? `${intel.bnDivisionName} বিভাগ` : `${intel.divisionName} Division`}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <i className="bx bx-shield-quarter text-xs" aria-hidden="true" />
              <span>{isBn ? "বিবিএস ২০২২ আদমশুমারি যাচাইকৃত" : "BBS 2022 Census Verified"}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <i className="bx bx-bar-chart-alt-2 text-xs" aria-hidden="true" />
              <span>{intel.dataCoveragePercent}% {isBn ? "উপাত্ত কভারেজ" : "Data Coverage"}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-zinc-950 dark:text-white">
            {isBn ? intel.bnName : intel.name} {isBn ? "জেলা গোয়েন্দা তথ্যকোষ" : "District Comprehensive Intelligence"}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {isBn
              ? `${intel.bnName} জেলার মোট ${intel.upazilasCount}টি উপজেলা, ${intel.pourashavasCount}টি পৌরসভা, শিক্ষা ও স্বাস্থ্য প্রতিষ্ঠানের বিশদ জিআইএস উপাত্ত তালিকা।`
              : `Comprehensive spatial directory of ${intel.upazilasCount} upazilas, ${intel.pourashavasCount} municipalities, institutions, healthcare hubs, and land feasibility in ${intel.name} District.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateToFinder && onNavigateToFinder(intel.name)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all flex items-center gap-2"
          >
            <i className="bx bx-trending-up text-sm" aria-hidden="true" />
            <span>{isBn ? "এই জেলার জমি দেখুন" : "Find Land in District"}</span>
          </button>

          <button
            type="button"
            onClick={() => onAskAdvisor && onAskAdvisor(`Provide an intelligence and spatial record briefing for ${intel.name} District.`)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-2 ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300 shadow-xs'
                : 'bg-[#18181B] hover:bg-zinc-800 text-zinc-200 border-zinc-800'
            }`}
          >
            <i className="bx bx-sparkles text-sm text-amber-500" aria-hidden="true" />
            <span>{isBn ? "এআই উপদেষ্টাকে জিজ্ঞাসা করুন" : "Ask AI Advisor"}</span>
          </button>
        </div>
      </div>

      {/* ── 2. KEY STATS METRICS STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider">
            {isBn ? "জনসংখ্যা" : "Population"}
          </span>
          <span className="text-base sm:text-lg font-black text-zinc-950 dark:text-white block mt-0.5">
            {intel.population}
          </span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            {intel.density}
          </span>
        </div>

        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider">
            {isBn ? "আয়তন" : "Total Area"}
          </span>
          <span className="text-base sm:text-lg font-black text-zinc-950 dark:text-white block mt-0.5">
            {intel.areaSqKm} km²
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
            {intel.upazilasCount} {isBn ? "উপজেলা" : "Upazilas"}
          </span>
        </div>

        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider">
            {isBn ? "গড় মূল্য (কাঠা)" : "Avg Rate / Katha"}
          </span>
          <span className="text-base sm:text-lg font-black text-amber-500 dark:text-amber-400 block mt-0.5">
            ৳{(intel.avgPricePerKathaBDT / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            ≈ ৳{(intel.avgPricePerDecimalBDT / 100000).toFixed(1)}L / Dec
          </span>
        </div>

        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider">
            {isBn ? "শিক্ষা প্রতিষ্ঠান" : "Education Units"}
          </span>
          <span className="text-base sm:text-lg font-black text-sky-600 dark:text-sky-400 block mt-0.5">
            {(intel.schoolsCount + intel.collegesCount).toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            {intel.universitiesCount} {isBn ? "বিশ্ববিদ্যালয়" : "Universities"}
          </span>
        </div>

        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider">
            {isBn ? "হাসপাতাল ও ক্লিনিক" : "Healthcare Hubs"}
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {(intel.hospitalsCount + intel.clinicsCount).toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            {intel.diagnosticCentersCount} {isBn ? "ডায়াগনস্টিক" : "Diagnostics"}
          </span>
        </div>

        <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
          <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider">
            {isBn ? "আবাসিক মান সূচক" : "Residential Fit"}
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {intel.suitabilityScores.residential} / 100
          </span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">
            {isBn ? "বাণিজ্যিক:" : "Commercial:"} {intel.suitabilityScores.commercial}/100
          </span>
        </div>
      </div>

      {/* ── 3. DASHBOARD TAB NAVIGATION ── */}
      <div className={`flex items-center gap-1.5 overflow-x-auto pb-2 border-b scrollbar-thin ${
        isLight ? 'border-zinc-200' : 'border-zinc-800'
      }`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : isLight
                  ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  : 'text-zinc-400 hover:text-white hover:bg-[#18181B]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{isBn ? tab.labelBn : tab.labelEn}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                isActive 
                  ? 'bg-emerald-700 text-white' 
                  : isLight 
                  ? 'bg-zinc-200 text-zinc-700' 
                  : 'bg-[#18181B] text-zinc-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. TAB CONTENTS ── */}

      {/* TAB 1: ADMINISTRATIVE & UPAZILAS */}
      {activeTab === 'admin' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-heading font-black text-zinc-950 dark:text-white flex items-center gap-2">
                <Building2 className="text-emerald-500" size={18} />
                <span>{isBn ? `${intel.bnName} জেলার উপজেলা তালিকা (${intel.upazilasCount}টি)` : `Upazilas of ${intel.name} District (${intel.upazilasCount})`}</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isBn 
                  ? "যেকোনো উপজেলায় ক্লিক করে স্থানীয় ক্যাডাস্ট্রাল ও জমি তথ্য পর্যালোচনা করুন।"
                  : "Click any upazila to focus on localized boundaries, mouzas, and land listings."}
              </p>
            </div>

            {/* Upazila Search Box */}
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={upazilaSearch}
                onChange={(e) => setUpazilaSearch(e.target.value)}
                placeholder={isBn ? "উপজেলা অনুসন্ধান করুন..." : "Filter upazilas..."}
                className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isLight 
                    ? 'bg-zinc-100 border border-zinc-300 text-zinc-950 placeholder-zinc-400' 
                    : 'bg-[#09090B] border border-zinc-800 text-white placeholder-zinc-500'
                }`}
              />
            </div>
          </div>

          {/* Upazila Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {filteredUpazilas.map((upazila, idx) => {
              const bnName = intel.bnUpazilas[intel.upazilas.indexOf(upazila)] || upazila;
              return (
                <div
                  key={idx}
                  onClick={() => onSelectUpazila && onSelectUpazila(upazila)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                    isLight 
                      ? 'bg-zinc-50/80 hover:bg-emerald-50/60 border-zinc-200 hover:border-emerald-400 shadow-sm' 
                      : 'bg-[#18181B] hover:bg-emerald-950/30 border-zinc-800 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold text-zinc-400">
                      #{idx + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60 group-hover:opacity-100"></span>
                  </div>

                  <div className="mt-2">
                    <span className="font-heading font-bold text-xs sm:text-sm text-zinc-950 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {isBn ? bnName : upazila}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                      {isBn ? upazila : bnName}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                    <span>{isBn ? "ক্যাডাস্ট্রাল ডাটা" : "Inspect"}</span>
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Administrative Hierarchy Explainer Card */}
          <div className={`p-4 rounded-xl border text-xs ${
            isLight ? 'bg-emerald-50/40 border-emerald-200 text-zinc-700' : 'bg-emerald-950/20 border-emerald-500/30 text-zinc-300'
          }`}>
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
              <Info size={14} />
              <span>{isBn ? "বাংলাদেশ ভূমি ও প্রশাসনিক স্তর বিন্যাস" : "Bangladesh Land & Administrative Hierarchy"}</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
              {isBn
                ? "প্রশাসনিক ধাপ: বিভাগ → জেলা → উপজেলা → পৌরসভা/ইউনিয়ন পরিষদ → মৌজা (ক্যাডাস্ট্রাল মানচিত্র ইউনিট) → খতিয়ান (মালিকানার রেকর্ড) → দাগ নম্বর (প্লট)।"
                : "Hierarchy: Division → District → Upazila → Pourashava/Union Parishad → Mouza (cadastral sheet unit) → Khatian (record of rights) → Dag Number (individual plot boundary)."}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: EDUCATION INTELLIGENCE */}
      {activeTab === 'education' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'University', 'College', 'School', 'Technical'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEduCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    eduCategory === cat
                      ? 'bg-sky-600 text-white shadow-sm'
                      : isLight
                      ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      : 'bg-[#18181B] hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {cat === 'All' ? (isBn ? 'সকল প্রতিষ্ঠান' : 'All Institutions') : cat}
                </button>
              ))}
            </div>

            {/* Institution Search */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={eduSearch}
                onChange={(e) => setEduSearch(e.target.value)}
                placeholder={isBn ? "প্রতিষ্ঠানের নাম খুঁজুন..." : "Search institutions..."}
                className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isLight 
                    ? 'bg-zinc-100 border border-zinc-300 text-zinc-950 placeholder-zinc-400' 
                    : 'bg-[#09090B] border border-zinc-800 text-white placeholder-zinc-500'
                }`}
              />
            </div>
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredInstitutions.map((inst) => (
              <div
                key={inst.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-200 hover:border-sky-400 shadow-sm' 
                    : 'bg-[#18181B] border-zinc-800 hover:border-sky-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      {inst.category}
                    </span>
                    {inst.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 size={11} />
                        <span>{isBn ? "যাচাইকৃত" : "Verified"}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-heading font-bold text-sm text-zinc-950 dark:text-white leading-snug">
                    {isBn ? inst.bnName : inst.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isBn ? inst.name : inst.bnName}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-zinc-400 shrink-0" />
                      <span className="truncate">{inst.address} ({inst.upazila})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                  {inst.website ? (
                    <a
                      href={inst.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold hover:underline"
                    >
                      <span>{isBn ? "অফিসিয়াল ওয়েবসাইট" : "Official Website"}</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-zinc-400 text-[10px]">{isBn ? "ওয়েবসাইট সংরক্ষিত" : "Institutional Record"}</span>
                  )}
                  <span className="text-[10px] text-zinc-400">BANBEIS Ref</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HEALTHCARE INTELLIGENCE */}
      {activeTab === 'healthcare' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-heading font-black text-zinc-950 dark:text-white flex items-center gap-2">
                <Hospital className="text-red-500" size={18} />
                <span>{isBn ? `${intel.bnName} জেলার হাসপাতাল ও স্বাস্থ্য কেন্দ্র` : `Healthcare & Hospitals in ${intel.name}`}</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isBn 
                  ? "জরুরি চিকিৎসা সেবা, বেড সংখ্যা ও অবস্থান সংক্রান্ত তথ্য।"
                  : "Verified medical colleges, district sadar hospitals, and upazila health complexes."}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={healthSearch}
                onChange={(e) => setHealthSearch(e.target.value)}
                placeholder={isBn ? "হাসপাতাল খুঁজুন..." : "Filter healthcare..."}
                className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isLight 
                    ? 'bg-zinc-100 border border-zinc-300 text-zinc-950 placeholder-zinc-400' 
                    : 'bg-[#09090B] border border-zinc-800 text-white placeholder-zinc-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isLight 
                    ? 'bg-zinc-50 border-zinc-200 hover:border-red-400 shadow-sm' 
                    : 'bg-[#18181B] border-zinc-800 hover:border-red-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                      {hosp.category}
                    </span>
                    {hosp.emergencyServices && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        <span>24/7 Emergency</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-heading font-bold text-sm text-zinc-950 dark:text-white leading-snug">
                    {isBn ? hosp.bnName : hosp.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isBn ? hosp.name : hosp.bnName}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">{isBn ? "শয্যা সংখ্যা:" : "Bed Capacity:"}</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{hosp.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-zinc-400 shrink-0" />
                      <span className="truncate">{hosp.address}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    DGHS Health Bulletin Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => onAskAdvisor && onAskAdvisor(`What is the nearest emergency hospital to land parcels in ${hosp.upazila}, ${intel.name}?`)}
                    className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline"
                  >
                    {isBn ? "দূরত্ব বিশ্লেষণ" : "Analyze Distance"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INFRASTRUCTURE & TRANSIT */}
      {activeTab === 'infra' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base sm:text-lg font-heading font-black text-zinc-950 dark:text-white flex items-center gap-2">
              <Navigation className="text-sky-500" size={18} />
              <span>{isBn ? `${intel.bnName} জেলার প্রধান সংযোগ ও অবকাঠামো` : `Infrastructure & Major Transit in ${intel.name}`}</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {isBn ? "জাতীয় মহাসড়ক, রেল স্টেশন, নদী বন্দর ও অর্থনৈতিক অঞ্চল নেটওয়ার্ক।" : "National highways, railways, river ports, and BEZA industrial economic zones."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Highways */}
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs mb-3">
                <Car size={15} />
                <span>{isBn ? "জাতীয় ও আঞ্চলিক মহাসড়ক" : "National Highway Corridors"}</span>
              </div>
              <ul className="space-y-2 text-xs">
                {intel.highways.map((hw, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
                    <span>{hw}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Railways & Stations */}
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-3">
                <Train size={15} />
                <span>{isBn ? "রেলপথ ও জংশন" : "Railway Access & Stations"}</span>
              </div>
              <ul className="space-y-2 text-xs">
                {intel.railwayStations.map((st, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ports & Terminals */}
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'}`}>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs mb-3">
                <Ship size={15} />
                <span>{isBn ? "নদী বন্দর ও বাস টার্মিনাল" : "River Ports & Bus Terminals"}</span>
              </div>
              <ul className="space-y-2 text-xs">
                {[...intel.portsAndFerries, ...intel.busTerminals].map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TOURISM & HERITAGE */}
      {activeTab === 'tourism' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-heading font-black text-zinc-950 dark:text-white flex items-center gap-2">
                <Compass className="text-amber-500" size={18} />
                <span>{isBn ? `${intel.bnName} জেলার পর্যটন আকর্ষণ ও নিদর্শন` : `Tourist Attractions in ${intel.name}`}</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isBn ? "প্রাকৃতিক, প্রত্নতাত্ত্বিক ও সাংস্কৃতিক ঐতিহ্যবাহী দর্শনীয় স্থান।" : "Curated natural landmarks, heritage sites, and seasonal travel guidance."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTourism && onNavigateToTourism(intel.name)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow transition-all flex items-center gap-2"
            >
              <Compass size={14} />
              <span>{isBn ? "পর্যটন মডিউল খুলুন" : "Open Tourism Explorer"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {intel.sampleAttractions.map((attr) => (
              <div
                key={attr.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {attr.category}
                    </span>
                    <span className="text-[10px] text-zinc-400">{attr.upazila}</span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-zinc-950 dark:text-white">
                    {isBn ? attr.bnName : attr.name}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {attr.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 text-[11px] flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Clock size={11} className="text-amber-500" />
                    <span>{attr.bestSeason}</span>
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {intel.hotelsCount} {isBn ? "হোটেল উপলব্ধ" : "Stays Nearby"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LAND FOR SALE & SUITABILITY */}
      {activeTab === 'land' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-heading font-black text-zinc-950 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={18} />
                <span>{isBn ? `${intel.bnName} জেলার ভূমি মূল্যায়ন ও উপযোগীতা বিশ্লেষণ` : `Land Valuation & Suitability Scores in ${intel.name}`}</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isBn ? "বিভিন্ন উদ্দেশ্যে জমি ব্যবহারের ডিটারমিনিস্টিক স্কোর ও ক্যাডাস্ট্রাল জরিপ স্ট্যাটাস।" : "Deterministic suitability scores across 6 use cases with cadastral metadata."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToFinder && onNavigateToFinder(intel.name)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all flex items-center gap-2"
            >
              <TrendingUp size={14} />
              <span>{isBn ? "স্মার্ট ল্যান্ড ফাইন্ডারে খুঁজুন" : "Browse Land Listings"}</span>
            </button>
          </div>

          {/* 6 Suitability Profile Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { key: 'residential', labelEn: 'Residential', labelBn: 'আবাসিক', score: intel.suitabilityScores.residential, color: 'text-emerald-500' },
              { key: 'commercial', labelEn: 'Commercial', labelBn: 'বাণিজ্যিক', score: intel.suitabilityScores.commercial, color: 'text-sky-500' },
              { key: 'hotel', labelEn: 'Hotel / Resort', labelBn: 'হোটেল/রিসোর্ট', score: intel.suitabilityScores.hotel, color: 'text-amber-500' },
              { key: 'farm', labelEn: 'Farm / Agro', labelBn: 'কৃষি খামার', score: intel.suitabilityScores.farm, color: 'text-lime-500' },
              { key: 'hospital', labelEn: 'Hospital', labelBn: 'হাসপাতাল', score: intel.suitabilityScores.hospital, color: 'text-red-500' },
              { key: 'restaurant', labelEn: 'Restaurant', labelBn: 'রেস্তোরাঁ', score: intel.suitabilityScores.restaurant, color: 'text-purple-500' },
            ].map((prof) => (
              <div key={prof.key} className={`p-3.5 rounded-xl border text-center ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#18181B] border-zinc-800'
              }`}>
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 block">
                  {isBn ? prof.labelBn : prof.labelEn}
                </span>
                <span className={`text-xl sm:text-2xl font-black ${prof.color} block mt-1`}>
                  {prof.score}<span className="text-xs text-zinc-400 font-normal">/100</span>
                </span>
                <div className="w-full bg-zinc-200 dark:bg-[#18181B] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${prof.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Land Meta Breakdown */}
          <div className={`p-4 rounded-xl border space-y-2 text-xs ${
            isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-700' : 'bg-[#18181B] border-zinc-800 text-zinc-300'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-zinc-400 block font-semibold">{isBn ? "ক্যাডাস্ট্রাল জরিপ অবস্থা:" : "Cadastral Survey Type:"}</span>
                <span className="font-bold text-zinc-950 dark:text-white mt-0.5 block">{intel.cadastralSurveyStatus}</span>
              </div>
              <div>
                <span className="text-zinc-400 block font-semibold">{isBn ? "বন্যা ঝুঁকি জোন:" : "Flood Vulnerability:"}</span>
                <span className="font-bold text-amber-500 mt-0.5 block">{intel.floodRiskZone}</span>
              </div>
              <div>
                <span className="text-zinc-400 block font-semibold">{isBn ? "বিজ্ঞাপিত জমি প্লট সংখ্যা:" : "Available Listings:"}</span>
                <span className="font-bold text-emerald-500 mt-0.5 block">{intel.landListingsCount} listings found</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. DATA PROVENANCE & FRESHNESS FOOTER ── */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span><strong>Official Source:</strong> {intel.sourceProvenance.adminSource}</span>
        </div>
        <div>
          <span><strong>Freshness:</strong> {intel.sourceProvenance.lastUpdated}</span>
        </div>
      </div>

    </div>
  );
};
