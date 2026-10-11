import React, { useState } from 'react';
import { DistrictData } from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';
import { Calculator, ArrowRightLeft, Sparkles, MapPin, CheckCircle, Copy } from 'lucide-react';

interface LandCalculatorSectionProps {
  isBn: boolean;
  selectedDistrict: DistrictData | null;
}

export const LandCalculatorSection: React.FC<LandCalculatorSectionProps> = ({
  isBn,
  selectedDistrict,
}) => {
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
    <section id="calculator" className="w-full py-12 border-t border-slate-800 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {isBn ? "বাংলাদেশী ভূমি পরিমাপ ও মূল্যায়ন" : "Spatial Unit Conversion & Valuation"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
            {isBn ? "প্রচলিত ভূমি একক ক্যালকুলেটর" : "Traditional Land Units & Valuation Engine"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {isBn
              ? "শতাংশ, কাঠা, বিঘা, একর এবং বর্গফুটের সঠিক রূপান্তর ও নির্বাচিত জেলার বর্তমান বাজারমূল্য হিসাব করুন।"
              : "Instantly convert between Decimal, Katha, Bigha, Acre, and Sq Ft with live pricing tied to your selected region."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Panel */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calculator size={14} className="text-emerald-400" />
                <span>{isBn ? "পরিমাপ ইনপুট" : "Measurement Input"}</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-400">
                {selectedDistrict ? (isBn ? selectedDistrict.bnName : selectedDistrict.name) : "Dhaka"}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  {isBn ? "জমির পরিমাণ দিন" : "Enter Land Quantity"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={inputValue}
                    onChange={(e) => setInputValue(Math.max(0.01, Number(e.target.value)))}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-black text-lg focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={inputUnit}
                    onChange={(e) => setInputUnit(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
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
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>{isBn ? "নির্বাচিত এলাকার গড় দর:" : "Prevailing Area Rate:"}</span>
                  <span className="font-bold text-amber-400">
                    ৳{(ratePerKatha / 100000).toFixed(1)} {isBn ? "লাখ / কাঠা" : "Lakh / Katha"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400 mt-1">
                  <span>{isBn ? "প্রতি শতক / শতাংশ দর:" : "Rate per Decimal:"}</span>
                  <span className="font-medium text-slate-200">
                    ৳{(ratePerKatha / 1.653 / 100000).toFixed(1)} Lakh
                  </span>
                </div>
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? (isBn ? "কপি হয়েছে!" : "Copied to Clipboard!") : (isBn ? "সারসংক্ষেপ কপি করুন" : "Copy Conversion Summary")}</span>
              </button>
            </div>
          </div>

          {/* Right: Real-time Multi-Unit Conversion Grid */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Big Valuation Hero Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>{isBn ? "মোট আনুমানিক বাজারমূল্য" : "Total Market Valuation Forecast"}</span>
                </span>
                <span className="text-2xl sm:text-4xl font-heading font-black text-white block mt-1">
                  {formattedValuation}
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {selectedDistrict?.name || 'Dhaka'} {isBn ? "অঞ্চলের সাম্প্রতিক ভূমি রেজিস্ট্রি ডাটা অনুযায়ী" : "Sub-registry valuation index"}
                </span>
              </div>
              <div className="bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-500/20 text-center sm:text-right">
                <span className="text-[11px] text-slate-400 block font-bold uppercase">
                  {isBn ? "মোট কাঠা সমতুল্য" : "Total Katha"}
                </span>
                <span className="text-xl font-black text-emerald-300">
                  {kathaEquivalent.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Equivalent Units Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {isBn ? "শতাংশ / শতক" : "Decimal (শতক)"}
                </span>
                <span className="text-lg font-black text-white block mt-0.5">
                  {decimalEquivalent.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">1 Katha = 1.65 Dec</span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {isBn ? "বিঘা" : "Bigha (বিঘা)"}
                </span>
                <span className="text-lg font-black text-white block mt-0.5">
                  {bighaEquivalent.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-500">1 Bigha = 20 Katha</span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {isBn ? "একর" : "Acre (একর)"}
                </span>
                <span className="text-lg font-black text-white block mt-0.5">
                  {acreEquivalent.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-500">1 Acre = 100 Dec</span>
              </div>

              <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {isBn ? "বর্গফুট" : "Square Feet"}
                </span>
                <span className="text-lg font-black text-white block mt-0.5">
                  {sqftEquivalent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-slate-500">1 Katha = 720 Sq Ft</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
