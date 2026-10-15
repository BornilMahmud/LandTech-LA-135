import React, { useState } from 'react';
import { DistrictData } from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';

interface LandCalculatorSectionProps {
  isBn: boolean;
  selectedDistrict: DistrictData | null;
  theme?: "dark" | "light";
}

export const LandCalculatorSection: React.FC<LandCalculatorSectionProps> = ({
  isBn,
  selectedDistrict,
  theme = "dark",
}) => {
  const isLight = theme === "light";
  const [inputValue, setInputValue] = useState<number>(5);
  const [inputUnit, setInputUnit] = useState<'katha' | 'decimal' | 'bigha' | 'sqft' | 'acre'>('katha');
  const [copied, setCopied] = useState(false);

  const landMeta = selectedDistrict ? getDistrictLandData(selectedDistrict.id) : null;
  const ratePerKatha = landMeta ? landMeta.avgPricePerKathaBDT : 3000000;

  // Convert input value to Katha first
  const convertToKatha = (val: number, unit: string): number => {
    switch (unit) {
      case 'katha':
        return val;
      case 'decimal':
        return val / 1.653; // 1 Katha = 1.653 Decimal approximately
      case 'bigha':
        return val * 20; // 1 Bigha = 20 Katha
      case 'acre':
        return val * 60.5; // 1 Acre = 60.5 Katha
      case 'sqft':
        return val / 720; // 1 Katha = 720 sq ft
      default:
        return val;
    }
  };

  const kathaEquivalent = convertToKatha(inputValue, inputUnit);
  const decimalEquivalent = kathaEquivalent * 1.653;
  const bighaEquivalent = kathaEquivalent / 20;
  const sqftEquivalent = kathaEquivalent * 720;
  const acreEquivalent = kathaEquivalent / 60.5;
  const totalValuationBDT = kathaEquivalent * ratePerKatha;

  const formattedValuation =
    totalValuationBDT >= 10000000
      ? `৳${(totalValuationBDT / 10000000).toFixed(2)} ${isBn ? "কোটি" : "Crore"}`
      : `৳${(totalValuationBDT / 100000).toFixed(1)} ${isBn ? "লাখ" : "Lakh"}`;

  const handleCopySummary = () => {
    const text = `${inputValue} ${inputUnit.toUpperCase()} in ${selectedDistrict?.name || 'Bangladesh'} = ${kathaEquivalent.toFixed(2)} Katha = ${decimalEquivalent.toFixed(2)} Decimal = ${sqftEquivalent.toFixed(0)} Sq.Ft | Est. Value: ${formattedValuation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="calculator"
      className={`w-full py-16 border-t transition-colors ${
        isLight ? "bg-white border-[#E4E4E7] text-[#09090B]" : "bg-[#09090B] border-[#27272A] text-[#FAFAFA]"
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isLight ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#52525B]" : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
          }`}>
            <span className="bms-live-dot"></span>
            <span>{isBn ? "বাংলাদেশী ভূমি পরিমাপ ও মূল্যায়ন" : "Spatial Unit Conversion & Valuation"}</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-heading font-black tracking-tight ${isLight ? "text-[#09090B]" : "text-white"}`}>
            {isBn ? "প্রচলিত ভূমি একক ক্যালকুলেটর" : "Traditional Land Units & Valuation Engine"}
          </h2>
          <p className={`text-xs sm:text-[14px] leading-relaxed ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
            {isBn
              ? "শতাংশ, কাঠা, বিঘা, একর এবং বর্গফুটের সঠিক রূপান্তর ও নির্বাচিত জেলার বর্তমান বাজারমূল্য হিসাব করুন।"
              : "Instantly convert between Decimal, Katha, Bigha, Acre, and Sq Ft with live pricing tied to your selected region."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Panel — BMS Card */}
          <div className={`lg:col-span-5 bms-card p-6 ${
            isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#121215] border-[#27272A]"
          }`}>
            <div className={`flex items-center justify-between pb-3.5 border-b mb-4 ${
              isLight ? "border-[#E4E4E7]" : "border-[#27272A]"
            }`}>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${
                isLight ? "text-[#09090B]" : "text-white"
              }`}>
                <i className="bx bx-calculator text-[#16A34A] dark:text-[#4ADE80] text-sm" aria-hidden="true" />
                <span>{isBn ? "পরিমাপ ইনপুট" : "Measurement Input"}</span>
              </span>
              <span className="text-[11px] font-bold text-[#16A34A] dark:text-[#4ADE80]">
                {selectedDistrict ? (isBn ? selectedDistrict.bnName : selectedDistrict.name) : "Dhaka"}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${
                  isLight ? "text-[#52525B]" : "text-[#A1A1AA]"
                }`}>
                  {isBn ? "জমির পরিমাণ দিন" : "Enter Land Quantity"}
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={inputValue}
                    onChange={(e) => setInputValue(Math.max(0.01, Number(e.target.value)))}
                    className={`flex-1 rounded-xl px-3.5 py-2 font-black text-base transition-colors focus:outline-none focus:border-[#09090B] dark:focus:border-white ${
                      isLight
                        ? "bg-white border border-[#E4E4E7] text-[#09090B] shadow-xs"
                        : "bg-[#18181B] border border-[#27272A] text-white"
                    }`}
                  />
                  <select
                    value={inputUnit}
                    onChange={(e) => setInputUnit(e.target.value as any)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors focus:outline-none focus:border-[#09090B] dark:focus:border-white ${
                      isLight
                        ? "bg-white border border-[#E4E4E7] text-[#09090B] shadow-xs"
                        : "bg-[#18181B] border border-[#27272A] text-white"
                    }`}
                  >
                    <option value="katha">{isBn ? "কাঠা (Katha)" : "Katha (কাঠা)"}</option>
                    <option value="decimal">{isBn ? "শতাংশ / শতক (Decimal)" : "Decimal (শতাংশ)"}</option>
                    <option value="bigha">{isBn ? "বিঘা (Bigha)" : "Bigha (বিঘা)"}</option>
                    <option value="acre">{isBn ? "একর (Acre)" : "Acre (একর)"}</option>
                    <option value="sqft">{isBn ? "বর্গফুট (Sq Ft)" : "Sq. Ft (বর্গফুট)"}</option>
                  </select>
                </div>
              </div>

              {/* Active District Rate Notice */}
              <div className={`rounded-xl p-3.5 border text-xs ${
                isLight
                  ? "bg-white border-[#E4E4E7] text-[#52525B]"
                  : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
              }`}>
                <div className="flex justify-between items-center">
                  <span>{isBn ? "নির্বাচিত এলাকার গড় দর:" : "Prevailing Area Rate:"}</span>
                  <span className="font-bold text-[#D97706] dark:text-[#FBBF24]">
                    ৳{(ratePerKatha / 100000).toFixed(1)} {isBn ? "লাখ / কাঠা" : "Lakh / Katha"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-dashed border-[#E4E4E7] dark:border-[#27272A]">
                  <span>{isBn ? "প্রতি শতক / শতাংশ দর:" : "Rate per Decimal:"}</span>
                  <span className={`font-semibold ${isLight ? "text-[#09090B]" : "text-white"}`}>
                    ৳{(ratePerKatha / 1.653 / 100000).toFixed(1)} Lakh
                  </span>
                </div>
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full btn-bms-secondary py-2.5 rounded-xl text-xs font-semibold"
              >
                <i className={`bx ${copied ? "bx-check text-[#16A34A] dark:text-[#4ADE80]" : "bx-copy"} text-sm`} aria-hidden="true" />
                <span>{copied ? (isBn ? "কপি হয়েছে!" : "Copied to Clipboard!") : (isBn ? "সারসংক্ষেপ কপি করুন" : "Copy Conversion Summary")}</span>
              </button>
            </div>
          </div>

          {/* Right: Real-time Multi-Unit Conversion Grid */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Big Valuation Hero Banner — BMS Fintech Card Aesthetic */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#18181B] to-[#09090B] border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] text-white relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4ADE80] flex items-center gap-1.5">
                  <i className="bx bx-sparkles text-sm" aria-hidden="true" />
                  <span>{isBn ? "মোট আনুমানিক বাজারমূল্য" : "Total Market Valuation Forecast"}</span>
                </span>
                <span className="text-2xl sm:text-4xl font-heading font-black block mt-1 tracking-tight text-white">
                  {formattedValuation}
                </span>
                <span className="text-xs mt-1 block text-[#A1A1AA]">
                  {selectedDistrict?.name || 'Dhaka'} {isBn ? "অঞ্চলের সাম্প্রতিক ভূমি রেজিস্ট্রি ডাটা অনুযায়ী" : "Sub-registry prevailing index"}
                </span>
              </div>
              <div className="relative z-10 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-left sm:text-right">
                <span className="text-[11px] block font-bold uppercase text-[#A1A1AA]">
                  {isBn ? "মোট কাঠা সমতুল্য" : "Total Katha"}
                </span>
                <span className="text-xl font-black text-[#4ADE80]">
                  {kathaEquivalent.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Equivalent Units Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className={`bms-pill-box p-3.5 border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className="text-[10px] text-[#71717A] uppercase font-bold block">
                  {isBn ? "শতাংশ / শতক" : "Decimal (শতক)"}
                </span>
                <span className={`text-lg font-black block mt-0.5 ${isLight ? "text-[#09090B]" : "text-white"}`}>
                  {decimalEquivalent.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#71717A]">1 Katha ≈ 1.65 Dec</span>
              </div>

              <div className={`bms-pill-box p-3.5 border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className="text-[10px] text-[#71717A] uppercase font-bold block">
                  {isBn ? "বিঘা" : "Bigha (বিঘা)"}
                </span>
                <span className={`text-lg font-black block mt-0.5 ${isLight ? "text-[#09090B]" : "text-white"}`}>
                  {bighaEquivalent.toFixed(3)}
                </span>
                <span className="text-[10px] text-[#71717A]">1 Bigha = 20 Katha</span>
              </div>

              <div className={`bms-pill-box p-3.5 border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className="text-[10px] text-[#71717A] uppercase font-bold block">
                  {isBn ? "একর" : "Acre (একর)"}
                </span>
                <span className={`text-lg font-black block mt-0.5 ${isLight ? "text-[#09090B]" : "text-white"}`}>
                  {acreEquivalent.toFixed(3)}
                </span>
                <span className="text-[10px] text-[#71717A]">1 Acre = 100 Dec</span>
              </div>

              <div className={`bms-pill-box p-3.5 border ${
                isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
              }`}>
                <span className="text-[10px] text-[#71717A] uppercase font-bold block">
                  {isBn ? "বর্গফুট" : "Square Feet"}
                </span>
                <span className={`text-lg font-black block mt-0.5 ${isLight ? "text-[#09090B]" : "text-white"}`}>
                  {sqftEquivalent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-[#71717A]">1 Katha = 720 Sq Ft</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
