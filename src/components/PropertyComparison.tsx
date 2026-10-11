import React from 'react';
import { 
  Scale, 
  Trophy, 
  Sparkles, 
  Trash2, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  Home, 
  TreePine, 
  Activity, 
  Utensils,
  ArrowRight
} from 'lucide-react';
import { LandParcel, SuitabilityPurpose, Language } from '../types';
import { calculateSuitability } from '../utils/suitability';
import { formatBdt, formatArea } from '../utils/formatters';
import { TRANSLATIONS } from '../locales/translations';

interface PropertyComparisonProps {
  comparedParcels: LandParcel[];
  selectedPurpose: SuitabilityPurpose;
  setSelectedPurpose: (purpose: SuitabilityPurpose) => void;
  language: Language;
  onRemoveCompare: (id: string) => void;
  onClearCompare: () => void;
  onGoToFinder: () => void;
  onOpenSuitabilityModal: (parcel: LandParcel) => void;
  onAskAdvisor: (parcel: LandParcel) => void;
}

export const PropertyComparison: React.FC<PropertyComparisonProps> = ({
  comparedParcels,
  selectedPurpose,
  setSelectedPurpose,
  language,
  onRemoveCompare,
  onClearCompare,
  onGoToFinder,
  onOpenSuitabilityModal,
  onAskAdvisor,
}) => {
  const t = TRANSLATIONS[language];

  // Evaluate suitability and rank dynamically based on selectedPurpose
  const evaluatedList = comparedParcels.map(parcel => ({
    parcel,
    suitability: calculateSuitability(parcel, selectedPurpose)
  })).sort((a, b) => b.suitability.overallScore - a.suitability.overallScore);

  const winner = evaluatedList.length > 0 ? evaluatedList[0] : null;

  if (comparedParcels.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          {t.comparison.emptyTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
          {t.comparison.emptyDesc}
        </p>
        <button
          onClick={onGoToFinder}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-lg shadow-brand-500/20"
        >
          <span>{t.comparison.exploreLands}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Purpose Recalculator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.comparison.title}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {t.comparison.subtitle}
          </p>
        </div>

        {/* Dynamic Purpose Switcher */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-300 pl-2">
            {t.comparison.selectPurpose}
          </span>
          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value as SuitabilityPurpose)}
            className="bg-brand-600 text-white font-black text-xs rounded-lg px-3 py-1.5 border border-brand-500 shadow focus:outline-none cursor-pointer"
          >
            <option value="residential">{t.purposes.residential}</option>
            <option value="hotel">{t.purposes.hotel}</option>
            <option value="farm">{t.purposes.farm}</option>
            <option value="hospital">{t.purposes.hospital}</option>
            <option value="restaurant">{t.purposes.restaurant}</option>
          </select>

          <button
            onClick={onClearCompare}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {t.comparison.clearAll}
          </button>
        </div>
      </div>

      {/* Top Winner Recommendation Banner */}
      {winner && evaluatedList.length >= 2 && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                  {t.comparison.winnerBadge}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  ({t.purposes[selectedPurpose]})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {language === 'bn' ? winner.parcel.titleBn : winner.parcel.titleEn}
              </h2>
              <p className="text-xs text-slate-300">
                {t.comparison.winnerWhy.replace('{purpose}', t.purposes[selectedPurpose])}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-emerald-400">
              {winner.suitability.overallScore}/100
            </span>
          </div>
        </div>
      )}

      {/* Side-by-Side Cards Matrix */}
      <div className={`grid grid-cols-1 ${evaluatedList.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-5`}>
        {evaluatedList.map(({ parcel, suitability }, index) => {
          const isRank1 = index === 0;

          return (
            <div
              key={parcel.id}
              className={`bg-slate-900 rounded-2xl border overflow-hidden shadow-xl flex flex-col relative transition ${
                isRank1 ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-800'
              }`}
            >
              {/* Top Rank Badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg ${
                  isRank1 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                }`}>
                  #{index + 1} {isRank1 ? t.comparison.winnerBadge : ''}
                </span>
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemoveCompare(parcel.id)}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-slate-900/80 hover:bg-red-500/80 text-slate-300 hover:text-white transition shadow"
                title="Remove from comparison"
                aria-label="Remove property from comparison"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Photo */}
              <div className="relative aspect-video bg-slate-950">
                <img
                  src={parcel.imageUrl}
                  alt={parcel.titleEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="font-extrabold text-base text-white leading-snug">
                    {language === 'bn' ? parcel.titleBn : parcel.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {parcel.mouza}, {parcel.district}
                  </p>
                </div>
              </div>

              {/* Comparison Metrics Table */}
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                {/* Suitability Score Header */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">{t.suitability.scoreOutOf100}:</span>
                    <span className="font-black text-base text-emerald-400">{suitability.overallScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        suitability.overallScore >= 80 ? 'bg-emerald-500' : suitability.overallScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${suitability.overallScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {language === 'bn' ? suitability.confidenceLabelBn : suitability.confidenceLabelEn} ({suitability.dataCoveragePct}% data coverage)
                  </span>
                </div>

                {/* Structured Metrics Rows */}
                <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                  {/* Pricing */}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{language === 'bn' ? 'মোট মূল্য' : 'Total Price'}:</span>
                    <span className="font-extrabold text-emerald-400">{formatBdt(parcel.priceBdt, language)}</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{language === 'bn' ? 'প্রতি কাঠা' : 'Rate/Katha'}:</span>
                    <span className="font-bold text-slate-200">{formatBdt(parcel.pricePerKatha, language)}</span>
                  </div>

                  {/* Area */}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{language === 'bn' ? 'জমির পরিমাপ' : 'Plot Area'}:</span>
                    <span className="font-bold text-white">{formatArea(parcel.areaKatha, language)}</span>
                  </div>

                  {/* Road Width */}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{t.propertyCard.roadWidth}:</span>
                    <span className="font-bold text-slate-200">{parcel.roadWidthFt} ft</span>
                  </div>

                  {/* Elevation & Flood */}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{t.propertyCard.floodRisk}:</span>
                    <span className={`font-bold ${parcel.floodRisk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {parcel.floodRisk} ({parcel.elevationMeters}m MSL)
                    </span>
                  </div>

                  {/* Soil Type */}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{t.propertyCard.soil}:</span>
                    <span className="font-bold text-slate-200">{parcel.soilType}</span>
                  </div>

                  {/* Zoning */}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{t.propertyCard.zoning}:</span>
                    <span className="font-bold text-brand-400">{parcel.zoning}</span>
                  </div>

                  {/* Highway Dist */}
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400 font-medium">{language === 'bn' ? 'মহাসড়ক দূরত্ব' : 'Highway Dist'}:</span>
                    <span className="font-bold text-slate-200">{parcel.nearbyFacilities.highwayDistKm} km</span>
                  </div>
                </div>

                {/* Strengths & Limitations Summaries */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-1">
                      ✓ {t.suitability.strengths}:
                    </span>
                    <ul className="space-y-1">
                      {suitability.strengthsEn.slice(0, 2).map((s, i) => (
                        <li key={i} className="text-[11px] text-slate-300 line-clamp-1">
                          • {language === 'bn' ? suitability.strengthsBn[i] : s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {parcel.missingAttributes.length > 0 && (
                    <div className="text-[11px] bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-amber-300">
                      <span className="font-bold block mb-0.5">⚠️ {t.suitability.missingFactors}:</span>
                      <span className="text-[10px] text-amber-200/80">{parcel.missingAttributes.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => onOpenSuitabilityModal(parcel)}
                    className="py-2 px-3 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700"
                  >
                    {language === 'bn' ? 'সম্পূর্ণ স্কোর' : 'Dossier'}
                  </button>
                  <button
                    onClick={() => onAskAdvisor(parcel)}
                    className="py-2 px-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'এআই' : 'Ask AI'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {comparedParcels.length < 3 && (
        <div className="p-4 bg-slate-900/60 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>{language === 'bn' ? 'আরও জমি যোগ করতে চান?' : 'Want to compare more parcels?'}</span>
          <button
            onClick={onGoToFinder}
            className="text-brand-400 hover:text-brand-300 font-bold underline"
          >
            {language === 'bn' ? 'ল্যান্ড ফাইন্ডার থেকে জমি নির্বাচন করুন' : 'Select from Smart Land Finder'}
          </button>
        </div>
      )}
    </div>
  );
};
