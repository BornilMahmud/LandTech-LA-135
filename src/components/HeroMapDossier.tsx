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
  onSelectDistrictById,
}) => {
  const [calcKatha, setCalcKatha] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'calculator'>('intelligence');
  const isLight = theme === "light";

  if (!selectedDistrict && !selectedDivision) {
    return (
      <div className={`w-full min-h-[380px] rounded-2xl p-8 flex flex-col items-center justify-center text-center border shadow-xs transition-colors ${
        isLight ? "bg-white border-[#E4E4E7] text-[#09090B]" : "bg-[#121215] border-[#27272A] text-[#FAFAFA]"
      }`}>
        <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] flex items-center justify-center text-[#09090B] dark:text-[#FAFAFA] mb-3">
          <i className="bx bx-map-pin text-2xl" aria-hidden="true" />
        </div>
        <h3 className={`font-heading font-bold text-base sm:text-lg ${isLight ? "text-[#09090B]" : "text-white"}`}>
          {isBn ? "মানচিত্রে যেকোনো এলাকা নির্বাচন করুন" : "Select Any Area on the Map"}
        </h3>
        <p className={`text-xs max-w-sm mt-1.5 leading-relaxed ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
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
    <div className={`w-full rounded-2xl border shadow-card p-5 sm:p-6 flex flex-col transition-all ${
      isLight ? "bg-white border-[#E4E4E7] text-[#09090B]" : "bg-[#121215] border-[#27272A] text-[#FAFAFA]"
    }`}>
      <div>
        
        {/* Top Header & Badges — BMS horizontal layout */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${isLight ? "border-[#E4E4E7]" : "border-[#27272A]"}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#52525B]" : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
              }`}>
                <span className="bms-live-dot"></span>
                {isBn ? "লাইভ ক্যাডাস্ট্রাল প্রোফাইল" : "Live Land Dossier"}
              </span>
              <span className={`text-xs font-medium ${isLight ? "text-[#71717A]" : "text-[#71717A]"}`}>
                {district?.divisionName || selectedDivision?.name}
              </span>
            </div>

            <h2 className={`text-xl sm:text-2xl font-heading font-extrabold mt-1.5 tracking-tight ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
              {district
                ? (isBn ? district.bnName : district.name)
                : (isBn ? selectedDivision?.bnName : selectedDivision?.name)}
            </h2>

            <p className={`text-xs mt-0.5 ${isLight ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>
              {district
                ? (isBn ? `${district.bnDivisionName} বিভাগীয় প্রশাসনিক অঞ্চল` : `${district.divisionName} Division Administrative Region`)
                : (isBn ? "বিভাগীয় সদর ও আঞ্চলিক তথ্য" : "Administrative Division Overview")}
            </p>
          </div>

          {/* Viability Pill — BMS Pill */}
          {landMeta && (
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#71717A] block tracking-wider">
                {isBn ? "ভূমি সূচক" : "Viability Index"}
              </span>
              <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-lg ${
                isLight ? "bg-[#09090B] text-white" : "bg-[#FAFAFA] text-[#09090B]"
              }`}>
                {landMeta.viabilityScore} / 100
              </span>
            </div>
          )}
        </div>

        {/* Tab switchers: BMS segmented control */}
        <div className={`flex items-center gap-1 my-4 p-1 rounded-xl border ${
          isLight ? "bg-[#F4F4F5] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'intelligence'
                ? isLight
                  ? 'bg-white text-[#09090B] shadow-xs border border-[#E4E4E7] font-semibold'
                  : 'bg-[#09090B] text-white shadow-xs border border-[#27272A] font-semibold'
                : isLight ? 'text-[#52525B] hover:text-[#09090B]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <i className="bx bx-analyse text-sm text-[#16A34A] dark:text-[#4ADE80]" aria-hidden="true" />
            <span>{isBn ? "আঞ্চলিক উপাত্ত" : "Spatial Metrics"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator'
                ? isLight
                  ? 'bg-white text-[#09090B] shadow-xs border border-[#E4E4E7] font-semibold'
                  : 'bg-[#09090B] text-white shadow-xs border border-[#27272A] font-semibold'
                : isLight ? 'text-[#52525B] hover:text-[#09090B]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <i className="bx bx-calculator text-sm text-[#2563EB] dark:text-[#60A5FA]" aria-hidden="true" />
            <span>{isBn ? "প্লট মূল্যায়ন" : "Valuation Calc"}</span>
          </button>
        </div>

        {/* TAB 1: INTELLIGENCE METRICS */}
        {activeTab === 'intelligence' && (
          <div className="space-y-3.5">
            {/* Stats grid — 4 cols on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className={`bms-pill-box p-3.5 ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-[#71717A]" : "text-[#71717A]"}`}>
                  {isBn ? "গড় মূল্য (প্রতি কাঠা)" : "Avg Rate / Katha"}
                </span>
                <span className="text-base font-black text-[#D97706] dark:text-[#FBBF24] block mt-0.5">
                  ৳{landMeta ? (landMeta.avgPricePerKathaBDT / 100000).toFixed(1) : 0}L
                </span>
                <span className="text-[10px] text-[#16A34A] dark:text-[#4ADE80] font-semibold flex items-center gap-1 mt-0.5">
                  <i className="bx bx-trending-up text-xs" aria-hidden="true" />
                  <span>+{landMeta?.growthRateYoY || 12}% YoY</span>
                </span>
              </div>

              <div className={`bms-pill-box p-3.5 ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-[#71717A]" : "text-[#71717A]"}`}>
                  {isBn ? "জরিপ ও ক্যাডাস্ট্রে" : "Cadastral Survey"}
                </span>
                <span className={`text-xs sm:text-sm font-bold block mt-0.5 truncate ${isLight ? "text-[#09090B]" : "text-white"}`}>
                  {landMeta?.cadastralSurvey || "Digital Verified"}
                </span>
                <span className={`text-[10px] font-medium block mt-0.5 ${isLight ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>
                  {isBn ? "ই-মিউটেশন সমর্থিত" : "e-Mutation Enabled"}
                </span>
              </div>

              <div className={`bms-pill-box p-3.5 ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-[#71717A]" : "text-[#71717A]"}`}>
                  {isBn ? "জোনিং শ্রেণিবিভাগ" : "Primary Zoning"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#2563EB] dark:text-[#60A5FA] block mt-0.5">
                  {landMeta?.zoning || "Mixed Commercial"}
                </span>
                <span className={`text-[10px] font-medium block mt-0.5 ${isLight ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>
                  {isBn ? "মাস্টারপ্ল্যান অনুবর্তী" : "Masterplan Compliant"}
                </span>
              </div>

              <div className={`bms-pill-box p-3.5 ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className={`text-[10px] block font-bold uppercase tracking-wider ${isLight ? "text-[#71717A]" : "text-[#71717A]"}`}>
                  {isBn ? "বন্যা ও পরিবেশ ঝুঁকি" : "Flood Vulnerability"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#16A34A] dark:text-[#4ADE80] block mt-0.5">
                  {landMeta?.floodRisk || "Minimal (Zone 1)"}
                </span>
                <span className={`text-[10px] font-medium block mt-0.5 ${isLight ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>
                  {isBn ? "উঁচু ভূপ্রকৃতি" : "Elevated Plain"}
                </span>
              </div>
            </div>

            {/* Key Infrastructure & Megaprojects */}
            <div className={`bms-pill-box p-4 text-xs ${
              isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1.5 ${
                isLight ? "text-[#52525B]" : "text-[#A1A1AA]"
              }`}>
                <i className="bx bx-buildings text-[#16A34A] dark:text-[#4ADE80] text-sm" aria-hidden="true" />
                <span>{isBn ? "প্রধান অবকাঠামো ও মেগা সংযোগ" : "Key Infrastructure Corridors"}</span>
              </span>
              <p className={`text-xs font-medium leading-relaxed ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
                {isBn ? landMeta?.bnKeyInfra : landMeta?.keyInfra}
              </p>
            </div>

            {/* Anomaly / Local Characteristic Alert */}
            {district && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                isLight 
                  ? "bg-[#FEFCE8] border-[#FEF08A] text-[#713F12]" 
                  : "bg-[#18181B] border-[#3F3F46] text-[#FDE047]"
              }`}>
                <i className="bx bx-info-circle text-base shrink-0 mt-0.5 text-[#D97706] dark:text-[#FBBF24]" aria-hidden="true" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">
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
            <div className={`bms-pill-box p-4 text-xs space-y-3.5 ${
              isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
            }`}>
              <div>
                <label className={`text-[10px] uppercase font-bold tracking-wider block mb-1.5 ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
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
                    className={`flex-1 rounded-lg px-3 py-2 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#09090B] dark:focus:ring-[#FAFAFA] shadow-xs ${
                      isLight ? "bg-white border border-[#E4E4E7] text-[#09090B]" : "bg-[#09090B] border border-[#27272A] text-white"
                    }`}
                  />
                  <span className={`text-xs font-semibold ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      calcKatha === k
                        ? "bg-[#09090B] dark:bg-[#FAFAFA] border-transparent text-white dark:text-[#09090B] shadow-xs"
                        : isLight
                        ? "bg-white border-[#E4E4E7] text-[#09090B] hover:bg-[#F4F4F5]"
                        : "bg-[#09090B] border-[#27272A] text-[#FAFAFA] hover:bg-[#18181B]"
                    }`}
                  >
                    {k} {isBn ? "কাঠা" : "Katha"}
                  </button>
                ))}
              </div>

              {/* Calculated Result Card */}
              <div className={`p-4 rounded-xl border ${
                isLight ? "bg-[#F0FDF4] border-[#BBF7D0]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className="text-[10px] text-[#16A34A] dark:text-[#4ADE80] uppercase font-bold tracking-wider block">
                  {isBn ? "আনুমানিক বাজার দর" : "Estimated Market Valuation"}
                </span>
                <span className={`text-2xl font-black block mt-0.5 ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
                  {formattedValuation}
                </span>
                <span className={`text-[10px] block mt-0.5 ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
                  {isBn
                    ? `প্রতি কাঠা গড় ৳${(unitRateBDT / 100000).toFixed(1)} লাখ হারে গণনাকৃত`
                    : `Based on ৳${(unitRateBDT / 100000).toFixed(1)} Lakh/Katha prevailing index`}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── ACTION BUTTONS — BMS Buttons ── */}
      <div className={`pt-4 mt-4 border-t flex flex-col sm:flex-row gap-2.5 ${isLight ? "border-[#E4E4E7]" : "border-[#27272A]"}`}>
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
