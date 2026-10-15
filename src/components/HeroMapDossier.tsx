import React, { useState } from 'react';
import {
  DistrictData,
  DivisionData,
  BANGLADESH_DIVISIONS,
} from '../data/bangladeshMapData';
import { getDistrictLandData, DIVISION_LAND_DATA } from '../data/landtechData';

interface HeroMapDossierProps {
  isBn: boolean;
  theme?: "dark" | "light";
  selectedDistrict: DistrictData | null;
  selectedDivision: DivisionData | null;
  onSelectDistrictById: (id: string) => void;
}

export const HeroMapDossier: React.FC<HeroMapDossierProps> = ({
  isBn,
  theme = "light",
  selectedDistrict,
  selectedDivision,
}) => {
  const [calcKatha, setCalcKatha] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'calculator'>('intelligence');
  const isLight = theme === "light";

  if (!selectedDistrict && !selectedDivision) {
    return (
      <div className={`w-full min-h-[380px] rounded-[6px] p-8 flex flex-col items-center justify-center text-center border shadow-subtle transition-colors ${
        isLight ? "bg-white border-[#E8E3DA] text-[#191817]" : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5]"
      }`}>
        <div className="w-10 h-10 rounded-[4px] bg-[#F3EFE8] dark:bg-[#141413] border border-[#E8E3DA] dark:border-[#2B2A27] flex items-center justify-center text-[#CC5A2B] mb-3">
          <i className="bx bx-map-pin text-xl" aria-hidden="true" />
        </div>
        <h3 className={`font-serif text-lg sm:text-xl font-semibold ${isLight ? "text-[#191817]" : "text-white"}`}>
          {isBn ? "মানচিত্রে যেকোনো এলাকা নির্বাচন করুন" : "Select Any Area on the Map"}
        </h3>
        <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
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

  // Valuation calculation
  const unitRateBDT = landMeta ? landMeta.avgPricePerKathaBDT : 2500000;
  const totalValuationBDT = calcKatha * unitRateBDT;
  const formattedValuation =
    totalValuationBDT >= 10000000
      ? `৳${(totalValuationBDT / 10000000).toFixed(2)} ${isBn ? "কোটি" : "Crore"}`
      : `৳${(totalValuationBDT / 100000).toFixed(1)} ${isBn ? "লাখ" : "Lakh"}`;

  return (
    <div className={`w-full rounded-[6px] border shadow-subtle p-5 sm:p-6 flex flex-col transition-all ${
      isLight ? "bg-white border-[#E8E3DA] text-[#191817]" : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5]"
    }`}>
      <div>
        
        {/* Top Header & Badges */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${isLight ? "border-[#E8E3DA]" : "border-[#2B2A27]"}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono border ${
                isLight ? "bg-[#F3EFE8] border-[#E8E3DA] text-[#706E6B]" : "bg-[#141413] border-[#2B2A27] text-[#9E9B95]"
              }`}>
                <span className="bms-live-dot"></span>
                {isBn ? "লাইভ ক্যাডাস্ট্রাল প্রোফাইল" : "Live Land Dossier"}
              </span>
              <span className={`text-xs font-mono ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                {district?.divisionName || selectedDivision?.name}
              </span>
            </div>

            <h2 className={`text-xl sm:text-2xl font-serif font-semibold mt-1.5 tracking-tight ${isLight ? "text-[#191817]" : "text-[#FAF9F5]"}`}>
              {district
                ? (isBn ? district.bnName : district.name)
                : (isBn ? selectedDivision?.bnName : selectedDivision?.name)}
            </h2>

            <p className={`text-xs mt-0.5 ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
              {district
                ? (isBn ? `${district.bnDivisionName} বিভাগীয় প্রশাসনিক অঞ্চল` : `${district.divisionName} Division Administrative Region`)
                : (isBn ? "বিভাগীয় সদর ও আঞ্চলিক তথ্য" : "Administrative Division Overview")}
            </p>
          </div>

          {/* Viability Pill */}
          {landMeta && (
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-mono font-bold text-[#706E6B] dark:text-[#9E9B95] block tracking-wider">
                {isBn ? "ভূমি সূচক" : "Viability Index"}
              </span>
              <span className={`inline-block mt-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-[4px] ${
                isLight ? "bg-[#191817] text-[#FAF9F5]" : "bg-[#FAF9F5] text-[#191817]"
              }`}>
                {landMeta.viabilityScore} / 100
              </span>
            </div>
          )}
        </div>

        {/* Tab switchers: Editorial Segmented Control */}
        <div className={`flex items-center gap-1 my-4 p-1 rounded-[4px] border ${
          isLight ? "bg-[#F3EFE8] border-[#E8E3DA]" : "bg-[#141413] border-[#2B2A27]"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`flex-1 py-1 rounded-[3px] text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'intelligence'
                ? isLight
                  ? 'bg-[#FAF9F5] text-[#191817] shadow-xs border border-[#E8E3DA] font-semibold'
                  : 'bg-[#1E1E1C] text-[#FAF9F5] shadow-xs border border-[#2B2A27] font-semibold'
                : isLight ? 'text-[#706E6B] hover:text-[#191817]' : 'text-[#9E9B95] hover:text-white'
            }`}
          >
            <i className="bx bx-analyse text-sm text-[#CC5A2B]" aria-hidden="true" />
            <span>{isBn ? "আঞ্চলিক উপাত্ত" : "Spatial Metrics"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-1 rounded-[3px] text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator'
                ? isLight
                  ? 'bg-[#FAF9F5] text-[#191817] shadow-xs border border-[#E8E3DA] font-semibold'
                  : 'bg-[#1E1E1C] text-[#FAF9F5] shadow-xs border border-[#2B2A27] font-semibold'
                : isLight ? 'text-[#706E6B] hover:text-[#191817]' : 'text-[#9E9B95] hover:text-white'
            }`}
          >
            <i className="bx bx-calculator text-sm text-[#CC5A2B]" aria-hidden="true" />
            <span>{isBn ? "প্লট মূল্যায়ন" : "Valuation Calc"}</span>
          </button>
        </div>

        {/* TAB 1: INTELLIGENCE METRICS */}
        {activeTab === 'intelligence' && (
          <div className="space-y-3">
            {/* Stats grid — 4 cols on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className={`p-3 rounded-[4px] border ${
                isLight ? "bg-[#FAF9F5] border-[#E8E3DA]" : "bg-[#141413] border-[#2B2A27]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                  {isBn ? "গড় মূল্য (প্রতি কাঠা)" : "Avg Rate / Katha"}
                </span>
                <span className="text-base font-mono font-bold text-[#CC5A2B] block mt-0.5">
                  ৳{landMeta ? (landMeta.avgPricePerKathaBDT / 100000).toFixed(1) : 0}L
                </span>
                <span className="text-[10px] text-[#3D5A4C] dark:text-[#4ADE80] font-mono font-medium flex items-center gap-1 mt-0.5">
                  <i className="bx bx-trending-up text-xs" aria-hidden="true" />
                  <span>+{landMeta?.growthRateYoY || 12}% YoY</span>
                </span>
              </div>

              <div className={`p-3 rounded-[4px] border ${
                isLight ? "bg-[#FAF9F5] border-[#E8E3DA]" : "bg-[#141413] border-[#2B2A27]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                  {isBn ? "জরিপ ও ক্যাডাস্ট্রে" : "Cadastral Survey"}
                </span>
                <span className={`text-xs sm:text-sm font-semibold block mt-0.5 truncate ${isLight ? "text-[#191817]" : "text-white"}`}>
                  {landMeta?.cadastralSurvey || "Digital Verified"}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                  {isBn ? "ই-মিউটেশন সমর্থিত" : "e-Mutation Enabled"}
                </span>
              </div>

              <div className={`p-3 rounded-[4px] border ${
                isLight ? "bg-[#FAF9F5] border-[#E8E3DA]" : "bg-[#141413] border-[#2B2A27]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                  {isBn ? "জোনিং শ্রেণিবিভাগ" : "Primary Zoning"}
                </span>
                <span className={`text-xs sm:text-sm font-semibold block mt-0.5 ${isLight ? "text-[#191817]" : "text-white"}`}>
                  {landMeta?.zoning || "Mixed Commercial"}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                  {isBn ? "মাস্টারপ্ল্যান অনুবর্তী" : "Masterplan Compliant"}
                </span>
              </div>

              <div className={`p-3 rounded-[4px] border ${
                isLight ? "bg-[#FAF9F5] border-[#E8E3DA]" : "bg-[#141413] border-[#2B2A27]"
              }`}>
                <span className={`text-[10px] block font-mono font-medium uppercase tracking-wider ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                  {isBn ? "বন্যা ও পরিবেশ ঝুঁকি" : "Flood Vulnerability"}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#3D5A4C] dark:text-[#4ADE80] block mt-0.5">
                  {landMeta?.floodRisk || "Minimal (Zone 1)"}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                  {isBn ? "উঁচু ভূপ্রকৃতি" : "Elevated Plain"}
                </span>
              </div>
            </div>

            {/* Key Infrastructure & Megaprojects */}
            <div className={`p-3.5 rounded-[4px] border text-xs ${
              isLight ? "bg-[#FAF9F5] border-[#E8E3DA]" : "bg-[#141413] border-[#2B2A27]"
            }`}>
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1.5 ${
                isLight ? "text-[#706E6B]" : "text-[#9E9B95]"
              }`}>
                <i className="bx bx-buildings text-[#CC5A2B] text-sm" aria-hidden="true" />
                <span>{isBn ? "প্রধান অবকাঠামো ও মেগা সংযোগ" : "Key Infrastructure Corridors"}</span>
              </span>
              <p className={`text-xs font-normal leading-relaxed ${isLight ? "text-[#191817]" : "text-[#FAF9F5]"}`}>
                {isBn ? landMeta?.bnKeyInfra : landMeta?.keyInfra}
              </p>
            </div>

            {/* Anomaly / Local Characteristic Alert */}
            {district && (
              <div className={`p-3 rounded-[4px] text-xs flex items-start gap-2.5 border ${
                isLight 
                  ? "bg-[#FAF0EB] border-[#F3D5C6] text-[#CC5A2B]" 
                  : "bg-[#1E1E1C] border-[#383632] text-[#FAF9F5]"
              }`}>
                <i className="bx bx-info-circle text-base shrink-0 mt-0.5 text-[#CC5A2B]" aria-hidden="true" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-semibold">
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
          <div className="space-y-3">
            <div className={`p-4 rounded-[4px] border text-xs space-y-3 ${
              isLight ? "bg-[#FAF9F5] border-[#E8E3DA]" : "bg-[#141413] border-[#2B2A27]"
            }`}>
              <div>
                <label className={`text-[10px] uppercase font-mono font-medium tracking-wider block mb-1.5 ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
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
                    className={`flex-1 rounded-[4px] px-3 py-1.5 font-mono font-semibold text-sm focus:outline-none focus:border-[#CC5A2B] focus:ring-1 focus:ring-[#CC5A2B]/20 border ${
                      isLight ? "bg-white border-[#E8E3DA] text-[#191817]" : "bg-[#1E1E1C] border-[#2B2A27] text-white"
                    }`}
                  />
                  <span className={`text-xs font-medium ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
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
                    className={`px-3 py-1 rounded-[4px] text-xs font-mono font-medium border transition-all ${
                      calcKatha === k
                        ? "bg-[#191817] dark:bg-[#FAF9F5] border-transparent text-[#FAF9F5] dark:text-[#191817] shadow-xs"
                        : isLight
                        ? "bg-white border-[#E8E3DA] text-[#191817] hover:bg-[#F3EFE8]"
                        : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5] hover:bg-[#2B2A27]"
                    }`}
                  >
                    {k} {isBn ? "কাঠা" : "Katha"}
                  </button>
                ))}
              </div>

              {/* Calculated Result Card */}
              <div className={`p-4 rounded-[4px] border ${
                isLight ? "bg-[#FAF0EB] border-[#F3D5C6]" : "bg-[#1E1E1C] border-[#2B2A27]"
              }`}>
                <span className="text-[10px] text-[#CC5A2B] uppercase font-mono font-medium tracking-wider block">
                  {isBn ? "আনুমানিক বাজার দর" : "Estimated Market Valuation"}
                </span>
                <span className={`text-2xl font-serif font-semibold block mt-0.5 ${isLight ? "text-[#191817]" : "text-[#FAF9F5]"}`}>
                  {formattedValuation}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
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
      <div className={`pt-4 mt-4 border-t flex flex-col sm:flex-row gap-2.5 ${isLight ? "border-[#E8E3DA]" : "border-[#2B2A27]"}`}>
        <a
          href="#district-dashboard"
          className="flex-1 btn-bms-primary text-xs"
        >
          <i className="bx bx-analyse text-sm" aria-hidden="true" />
          <span>{isBn ? "৬৪ জেলা ইনটেলিজেন্স ড্যাশবোর্ড" : "Open 64-District Dashboard"}</span>
          <i className="bx bx-chevron-right text-sm" aria-hidden="true" />
        </a>

        <a
          href="#cadastre"
          className="flex-1 btn-bms-secondary text-xs"
        >
          <i className="bx bx-compass text-sm" aria-hidden="true" />
          <span>{isBn ? "ক্যাডাস্ট্রাল প্লট ও মৌজা দেখুন" : "Explore Cadastral Plots & Mouza"}</span>
        </a>
      </div>

    </div>
  );
};
