import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldAlert,
  Layers,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';
import { LandParcel, SuitabilityPurpose, Language } from '../types';
import { calculateSuitability, PURPOSE_FACTOR_DEFINITIONS } from '../utils/suitability';
import { formatBdt, formatArea } from '../utils/formatters';
import { TRANSLATIONS } from '../locales/translations';

interface SuitabilityModalProps {
  parcel: LandParcel | null;
  purpose: SuitabilityPurpose;
  onPurposeChange: (purpose: SuitabilityPurpose) => void;
  language: Language;
  onClose: () => void;
}

export const SuitabilityModal: React.FC<SuitabilityModalProps> = ({
  parcel,
  purpose,
  onPurposeChange,
  language,
  onClose,
}) => {
  if (!parcel) return null;

  const t = TRANSLATIONS[language];
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({});
  const [showWeightSliders, setShowWeightSliders] = useState(false);

  const factorDefs = PURPOSE_FACTOR_DEFINITIONS[purpose] || PURPOSE_FACTOR_DEFINITIONS.residential;
  const result = calculateSuitability(parcel, purpose, customWeights);

  const handleWeightChange = (factorId: string, val: number) => {
    setCustomWeights(prev => ({ ...prev, [factorId]: val }));
  };

  const handleResetWeights = () => {
    setCustomWeights({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        role="dialog"
        aria-labelledby="suitability-modal-title"
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="suitability-modal-title" className="text-base sm:text-lg font-black text-white leading-tight">
                {t.suitability.title}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? parcel.titleBn : parcel.titleEn} • {parcel.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Purpose Switcher inside Modal */}
            <select
              value={purpose}
              onChange={(e) => {
                onPurposeChange(e.target.value as SuitabilityPurpose);
                setCustomWeights({});
              }}
              className="bg-slate-800 text-brand-300 font-bold text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="residential">{t.purposes.residential}</option>
              <option value="hotel">{t.purposes.hotel}</option>
              <option value="farm">{t.purposes.farm}</option>
              <option value="hospital">{t.purposes.hospital}</option>
              <option value="restaurant">{t.purposes.restaurant}</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Score Banner */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t.suitability.purposeSelected.replace('{purpose}', t.purposes[purpose])}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white tracking-tight">
                  {result.overallScore}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  result.overallScore >= 80 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : result.overallScore >= 60 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {language === 'bn' ? result.confidenceLabelBn : result.confidenceLabelEn}
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                {formatArea(parcel.areaKatha, language)} • {formatBdt(parcel.priceBdt, language)}
              </p>
            </div>

            {/* Coverage Meter */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs min-w-[200px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span>{t.suitability.dataCoverage}:</span>
                <span className="text-brand-400 font-bold">{result.dataCoveragePct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-brand-500 h-full rounded-full"
                  style={{ width: `${result.dataCoveragePct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                {language === 'bn' ? 'যাচাইকৃত ফিল্ড ডেটার অনুপাত' : 'Verified field attribute coverage'}
              </span>
            </div>
          </div>

          {/* Toggle Weight Sliders Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>{t.suitability.factorBreakdown}</span>
            </h3>

            <button
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-400" />
              <span>{showWeightSliders ? (language === 'bn' ? 'স্লাইডার লুকান' : 'Hide Weight Sliders') : t.suitability.weightCustomizer}</span>
            </button>
          </div>

          {/* Weight Sliders Drawer */}
          {showWeightSliders && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-300 font-bold">
                  {language === 'bn' ? 'উপাদান গুরুত্ব সমন্বয় (Weights %)' : 'Customize Factor Weights (%)'}
                </span>
                <button
                  onClick={handleResetWeights}
                  className="flex items-center gap-1 text-[11px] text-brand-400 hover:text-brand-300 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.suitability.resetWeights}</span>
                </button>
              </div>

              <div className="space-y-3">
                {factorDefs.map((def) => {
                  const currentWeight = customWeights[def.id] !== undefined ? customWeights[def.id] : def.defaultWeight;
                  return (
                    <div key={def.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          {language === 'bn' ? def.nameBn : def.nameEn}
                        </span>
                        <span className="text-brand-400 font-bold">{currentWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        step={5}
                        value={currentWeight}
                        onChange={(e) => handleWeightChange(def.id, Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Factor Items List */}
          <div className="space-y-3">
            {result.factors.map((factor) => (
              <div 
                key={factor.id} 
                className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {language === 'bn' ? factor.nameBn : factor.nameEn}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      Weight: {factor.weight}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 text-xs font-black">
                    <span className={`${
                      factor.rawScore >= 80 ? 'text-emerald-400' : factor.rawScore >= 60 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {factor.rawScore}/100
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (+{factor.weightedPoints} pts)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      factor.rawScore >= 80 ? 'bg-emerald-500' : factor.rawScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${factor.rawScore}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'bn' ? factor.explanationBn : factor.explanationEn}
                </p>
              </div>
            ))}
          </div>

          {/* Strengths & Limitations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.suitability.strengths}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.strengthsEn.map((str, idx) => (
                  <li key={idx} className="leading-snug">
                    • {language === 'bn' ? result.strengthsBn[idx] : str}
                  </li>
                ))}
                {result.strengthsEn.length === 0 && (
                  <li className="text-slate-400 text-xs italic">
                    {language === 'bn' ? 'কোনো বিশেষ সুবিধা রেকর্ড করা হয়নি।' : 'No primary strength outliers detected.'}
                  </li>
                )}
              </ul>
            </div>

            {/* Limitations / Risks */}
            <div className="bg-red-950/20 p-4 rounded-xl border border-red-500/20 space-y-2">
              <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{t.suitability.limitations}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.limitationsEn.map((lim, idx) => (
                  <li key={idx} className="leading-snug">
                    • {language === 'bn' ? result.limitationsBn[idx] : lim}
                  </li>
                ))}
                {result.limitationsEn.length === 0 && (
                  <li className="text-slate-400 text-xs italic">
                    {language === 'bn' ? 'কোনো বড় সীমাবদ্ধতা নেই।' : 'No critical limitations found in verified attributes.'}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Missing Factors Notice Box */}
          {result.missingFactors.length > 0 && (
            <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/30 text-amber-300 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>{t.suitability.missingFactors}</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                {result.missingFactors.join('; ')}
              </p>
            </div>
          )}

          {/* Scientific Methodology Disclaimer */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <p>{t.suitability.methodologyNote}</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            {t.suitability.close}
          </button>
        </div>
      </div>
    </div>
  );
};
