import React, { useState } from 'react';
import {
  DistrictData,
  DivisionData,
  BANGLADESH_DIVISIONS,
} from '../data/bangladeshMapData';
import { getDistrictLandData, DIVISION_LAND_DATA } from '../data/landtechData';
import {
  MapPin,
  TrendingUp,
  ShieldCheck,
  Building2,
  Trees,
  Calculator,
  Download,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HeroMapDossierProps {
  isBn: boolean;
  theme?: "light" | "reference" | "emerald" | "atlas" | "midnight";
  selectedDistrict: DistrictData | null;
  selectedDivision: DivisionData | null;
  onSelectDistrictById: (id: string) => void;
}

export const HeroMapDossier: React.FC<HeroMapDossierProps> = ({
  isBn,
  theme = "light",
  selectedDistrict,
  selectedDivision,
  onSelectDistrictById,
}) => {
  const [calcKatha, setCalcKatha] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'calculator'>('intelligence');
  const isLight = theme === "light";

  if (!selectedDistrict && !selectedDivision) {
    return (
      <div className={`w-full h-full min-h-[460px] rounded-2xl p-6 flex flex-col items-center justify-center text-center border shadow-xl ${
        isLight ? "bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50" : "glass-panel text-slate-100"
      }`}>
        <MapPin className="w-12 h-12 text-emerald-500 mb-3 animate-bounce" />
        <h3 className={`font-heading font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>
          {isBn ? "মানচিত্রে যেকোনো এলাকা নির্বাচন করুন" : "Select Any Area on the Map"}
        </h3>
        <p className={`text-xs max-w-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          {isBn
            ? "৬৪টি জেলা বা ৮টি বিভাগের যেকোনো অংশে ক্লিক করে তাৎক্ষণিক ক্যাডাস্ট্রাল ও জমি মূল্যের বিশ্লেষণ দেখুন।"
            : "Click on any of the 64 districts or 8 divisions to inspect live cadastral, zoning, and valuation intelligence."}
        </p>
      </div>
    );
  }

  // Active district metadata
  const district = selectedDistrict;
  const landMeta = district ? getDistrictLandData(district.id) : null;
  const divisionMeta = selectedDivision ? DIVISION_LAND_DATA[selectedDivision.id] : null;

  // Valuation calculation
  const unitRateBDT = landMeta ? landMeta.avgPricePerKathaBDT : 2500000;
  const totalValuationBDT = calcKatha * unitRateBDT;
  const formattedValuation =
    totalValuationBDT >= 10000000
      ? `৳${(totalValuationBDT / 10000000).toFixed(2)} ${isBn ? "কোটি" : "Crore"}`
      : `৳${(totalValuationBDT / 100000).toFixed(1)} ${isBn ? "লাখ" : "Lakh"}`;

  return (
    <div className={`w-full rounded-2xl border shadow-2xl p-4 sm:p-5 flex flex-col justify-between backdrop-blur-xl transition-colors ${
      isLight ? "bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50" : "glass-panel border-slate-700/80 text-slate-100"
    }`}>
      <div>
        
        {/* Top Header & Badges */}
        <div className={`flex items-start justify-between gap-2 pb-3.5 border-b ${isLight ? "border-slate-200" : "border-slate-800"}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                {isBn ? "লাইভ ক্যাডাস্ট্রাল প্রোফাইল" : "Live Land Dossier"}
              </span>
              <span className={`text-[10px] font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {district?.divisionName || selectedDivision?.name}
              </span>
            </div>

            <h2 className={`text-xl sm:text-2xl font-heading font-black mt-1 ${isLight ? "text-slate-900" : "text-white"}`}>
              {district
                ? (isBn ? district.bnName : district.name)
                : (isBn ? selectedDivision?.bnName : selectedDivision?.name)}
            </h2>

            <p className={`text-xs mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {district
                ? (isBn ? `${district.bnDivisionName} বিভাগীয় প্রশাসনিক অঞ্চল` : `${district.divisionName} Division Administrative Region`)
                : (isBn ? "বিভাগীয় সদর ও আঞ্চলিক তথ্য" : "Administrative Division Overview")}
            </p>
          </div>

          {/* Viability Pill */}
          {landMeta && (
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {isBn ? "ভূমি সূচক" : "Viability Index"}
              </span>
              <span className="inline-block mt-0.5 text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                {landMeta.viabilityScore} / 100
              </span>
            </div>
          )}
        </div>

        {/* Tab switchers: Intelligence vs Calculator */}
        <div className={`flex items-center gap-2 my-3 p-1 rounded-xl border ${
          isLight ? "bg-slate-100 border-slate-200" : "bg-slate-950/80 border-slate-800"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'intelligence'
                ? 'bg-emerald-600 text-white shadow'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            <span>{isBn ? "আঞ্চলিক উপাত্ত" : "Spatial Metrics"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-emerald-600 text-white shadow'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator size={13} />
            <span>{isBn ? "প্লট মূল্যায়ন" : "Valuation Calc"}</span>
          </button>
        </div>

        {/* TAB 1: INTELLIGENCE METRICS */}
        {activeTab === 'intelligence' && (
          <div className="space-y-3.5">
            {/* 4-Stat Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className={`p-3 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "গড় মূল্য (প্রতি কাঠা)" : "Avg Rate / Katha"}
                </span>
                <span className="text-base sm:text-lg font-black text-amber-500 block mt-0.5">
                  ৳{landMeta ? (landMeta.avgPricePerKathaBDT / 100000).toFixed(1) : 0}L
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp size={10} />
                  <span>+{landMeta?.growthRateYoY || 12}% YoY</span>
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "জরিপ ও ক্যাডাস্ট্রে" : "Cadastral Survey"}
                </span>
                <span className={`text-xs sm:text-sm font-bold block mt-0.5 truncate ${isLight ? "text-slate-900" : "text-white"}`}>
                  {landMeta?.cadastralSurvey || "Digital Verified"}
                </span>
                <span className={`text-[10px] font-medium block mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "ই-মিউটেশন সমর্থিত" : "e-Mutation Enabled"}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "জোনিং শ্রেণিবিভাগ" : "Primary Zoning"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 block mt-0.5">
                  {landMeta?.zoning || "Mixed Commercial"}
                </span>
                <span className={`text-[10px] font-medium block mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "মাস্টারপ্ল্যান অনুবর্তী" : "Masterplan Compliant"}
                </span>
              </div>

              <div className={`p-3 rounded-xl border ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "বন্যা ও পরিবেশ ঝুঁকি" : "Flood Vulnerability"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {landMeta?.floodRisk || "Minimal (Zone 1)"}
                </span>
                <span className={`text-[10px] font-medium block mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "উঁচু ভূপ্রকৃতি" : "Elevated Plain"}
                </span>
              </div>
            </div>

            {/* Key Infrastructure & Megaprojects */}
            <div className={`p-3 rounded-xl border text-xs ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-slate-800/90"
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5 ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}>
                <Building2 size={12} className="text-emerald-500" />
                <span>{isBn ? "প্রধান অবকাঠামো ও মেগা সংযোগ" : "Key Infrastructure Corridors"}</span>
              </span>
              <p className={`text-xs font-medium leading-relaxed ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                {isBn ? landMeta?.bnKeyInfra : landMeta?.keyInfra}
              </p>
            </div>

            {/* Anomaly / Local Characteristic Alert */}
            {district && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-800 dark:text-amber-200 leading-snug">
                  <span className="font-bold text-amber-600 dark:text-amber-300">
                    {isBn ? "আঞ্চলিক বৈশিষ্ট্য: " : "Regional Intelligence: "}
                  </span>
                  <span>{isBn ? district.bnAnomaly : district.anomaly}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLOT VALUATION CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-3.5">
            <div className={`p-3.5 rounded-xl border text-xs space-y-3 ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/70 border-slate-800"
            }`}>
              <div>
                <label className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn ? "জমির পরিমাণ (কাঠা):" : "Plot Size in Katha:"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    value={calcKatha}
                    onChange={(e) => setCalcKatha(Math.max(0.1, Number(e.target.value)))}
                    className={`flex-1 rounded-lg px-3 py-2 font-bold text-sm focus:outline-none focus:border-emerald-500 ${
                      isLight ? "bg-white border border-slate-300 text-slate-900" : "bg-slate-900 border border-slate-700 text-white"
                    }`}
                  />
                  <span className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    {isBn ? "কাঠা" : "Katha"}
                  </span>
                </div>
              </div>

              {/* Quick Size Presets */}
              <div className="flex items-center gap-1.5">
                {[3, 5, 10, 20].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCalcKatha(k)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                      calcKatha === k
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : isLight
                        ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {k} {isBn ? "কাঠা" : "Katha"}
                  </button>
                ))}
              </div>

              {/* Calculated Result Card */}
              <div className={`p-3 rounded-xl border ${
                isLight ? "bg-emerald-50/70 border-emerald-200" : "bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500/30"
              }`}>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider block">
                  {isBn ? "আনুমানিক বাজার দর" : "Estimated Market Valuation"}
                </span>
                <span className={`text-xl sm:text-2xl font-black block mt-1 ${isLight ? "text-slate-900" : "text-white"}`}>
                  {formattedValuation}
                </span>
                <span className={`text-[10px] block mt-0.5 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {isBn
                    ? `প্রতি কাঠা গড় ৳${(unitRateBDT / 100000).toFixed(1)} লাখ হারে গণনাকৃত`
                    : `Based on ৳${(unitRateBDT / 100000).toFixed(1)} Lakh/Katha prevailing index`}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className={`pt-3 border-t space-y-2 ${isLight ? "border-slate-200" : "border-slate-800"}`}>
        <a
          href="#district-dashboard"
          className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Building2 size={14} />
          <span>{isBn ? "৬৪ জেলা পূর্ণাঙ্গ ইন্টেলিজেন্স ড্যাশবোর্ড" : "Open 64-District Intelligence Dashboard"}</span>
          <ChevronRight size={14} />
        </a>

        <a
          href="#cadastral"
          className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
            isLight
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
          }`}
        >
          <FileText size={14} />
          <span>{isBn ? "ক্যাডাস্ট্রাল প্লট ও মৌজা দেখুন" : "Explore Cadastral Plots & Mouza"}</span>
        </a>
      </div>

    </div>
  );
};
