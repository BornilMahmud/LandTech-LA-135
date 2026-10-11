import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  MapPin, 
  Scale, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Eye
} from 'lucide-react';
import { LandParcel, SuitabilityPurpose, Language, FilterState } from '../types';
import { calculateSuitability } from '../utils/suitability';
import { formatBdt, formatArea } from '../utils/formatters';
import { TRANSLATIONS } from '../locales/translations';

interface LandFinderProps {
  parcels: LandParcel[];
  selectedPurpose: SuitabilityPurpose;
  setSelectedPurpose: (purpose: SuitabilityPurpose) => void;
  language: Language;
  comparedParcelIds: string[];
  onToggleCompare: (parcel: LandParcel) => void;
  onOpenSuitabilityModal: (parcel: LandParcel) => void;
  onSelectOnMap: (parcel: LandParcel) => void;
  onAskAdvisor: (parcel: LandParcel) => void;
}

export const LandFinder: React.FC<LandFinderProps> = ({
  parcels,
  selectedPurpose,
  setSelectedPurpose,
  language,
  comparedParcelIds,
  onToggleCompare,
  onOpenSuitabilityModal,
  onSelectOnMap,
  onAskAdvisor,
}) => {
  const t = TRANSLATIONS[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedZoning, setSelectedZoning] = useState('All');
  const [selectedFlood, setSelectedFlood] = useState('All');
  const [maxBudget, setMaxBudget] = useState(150000000); // 15 Crore
  const [minKatha, setMinKatha] = useState(0);
  const [sortBy, setSortBy] = useState<'suitability' | 'priceAsc' | 'priceDesc' | 'areaDesc'>('suitability');

  // Divisions and Districts in dataset
  const divisions = useMemo(() => ['All', ...new Set(parcels.map(p => p.division))], [parcels]);
  const districts = useMemo(() => {
    if (selectedDivision === 'All') return ['All', ...new Set(parcels.map(p => p.district))];
    return ['All', ...new Set(parcels.filter(p => p.division === selectedDivision).map(p => p.district))];
  }, [parcels, selectedDivision]);

  // Filtering & Sorting
  const filteredParcels = useMemo(() => {
    return parcels.filter(parcel => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          parcel.titleEn.toLowerCase().includes(q) ||
          parcel.titleBn.toLowerCase().includes(q) ||
          parcel.district.toLowerCase().includes(q) ||
          parcel.mouza.toLowerCase().includes(q) ||
          parcel.zoning.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedDivision !== 'All' && parcel.division !== selectedDivision) return false;
      if (selectedDistrict !== 'All' && parcel.district !== selectedDistrict) return false;
      if (selectedZoning !== 'All' && parcel.zoning !== selectedZoning) return false;
      if (selectedFlood !== 'All' && parcel.floodRisk !== selectedFlood) return false;
      if (parcel.priceBdt > maxBudget) return false;
      if (parcel.areaKatha < minKatha) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'suitability') {
        const sA = calculateSuitability(a, selectedPurpose).overallScore;
        const sB = calculateSuitability(b, selectedPurpose).overallScore;
        return sB - sA;
      }
      if (sortBy === 'priceAsc') return a.priceBdt - b.priceBdt;
      if (sortBy === 'priceDesc') return b.priceBdt - a.priceBdt;
      if (sortBy === 'areaDesc') return b.areaKatha - a.areaKatha;
      return 0;
    });
  }, [parcels, searchQuery, selectedDivision, selectedDistrict, selectedZoning, selectedFlood, maxBudget, minKatha, sortBy, selectedPurpose]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDivision('All');
    setSelectedDistrict('All');
    setSelectedZoning('All');
    setSelectedFlood('All');
    setMaxBudget(150000000);
    setMinKatha(0);
    setSortBy('suitability');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.nav.finder}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {language === 'bn' 
              ? 'বাজেট, অবস্থান, আয়তন ও উদ্দেশ্যের ভিত্তিতে সঠিক জমি খুঁজুন' 
              : 'Discover verified sample land parcels with deterministic suitability scoring.'}
          </p>
        </div>

        {/* Intended Purpose Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 pl-2">
            {t.filters.targetPurpose}
          </span>
          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value as SuitabilityPurpose)}
            className="bg-brand-600/20 text-brand-300 font-bold text-xs rounded-lg px-3 py-1.5 border border-brand-500/30 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="residential">{t.purposes.residential}</option>
            <option value="hotel">{t.purposes.hotel}</option>
            <option value="farm">{t.purposes.farm}</option>
            <option value="hospital">{t.purposes.hospital}</option>
            <option value="restaurant">{t.purposes.restaurant}</option>
          </select>
        </div>
      </div>

      {/* Comprehensive Filter Controls */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'bn' ? 'অনুসন্ধান' : 'Search Term'}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.filters.searchPlaceholder}
                className="w-full bg-slate-950 text-xs text-white pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Division Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'bn' ? 'বিভাগ' : 'Division'}
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setSelectedDistrict('All');
              }}
              className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {divisions.map(d => (
                <option key={d} value={d}>
                  {d === 'All' ? t.filters.allDivisions : d}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'bn' ? 'জেলা' : 'District'}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {districts.map(d => (
                <option key={d} value={d}>
                  {d === 'All' ? t.filters.allDistricts : d}
                </option>
              ))}
            </select>
          </div>

          {/* Zoning Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'bn' ? 'জোনিং ক্যাটাগরি' : 'Zoning Category'}
            </label>
            <select
              value={selectedZoning}
              onChange={(e) => setSelectedZoning(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="All">{t.filters.allZoning}</option>
              <option value="Residential">Residential (আবাসিক)</option>
              <option value="Commercial">Commercial (বাণিজ্যিক)</option>
              <option value="Eco-Tourism">Eco-Tourism (ইকো-ট্যুরিজম)</option>
              <option value="Agricultural">Agricultural (কৃষি)</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row: Sliders & Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          {/* Max Budget Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span>{t.filters.priceRange}:</span>
              <span className="text-emerald-400 font-extrabold">{formatBdt(maxBudget, language)}</span>
            </div>
            <input
              type="range"
              min={10000000}
              max={150000000}
              step={5000000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          {/* Min Plot Size Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
              <span>{t.filters.areaRange}:</span>
              <span className="text-white font-extrabold">{minKatha} Katha+</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={5}
              value={minKatha}
              onChange={(e) => setMinKatha(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          {/* Sort By & Reset */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                {language === 'bn' ? 'সাজানোর ক্রম' : 'Sort Listings'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-brand-500 cursor-pointer"
              >
                <option value="suitability">{language === 'bn' ? 'উপযুক্ততা স্কোর (সর্বোচ্চ)' : 'Suitability Score (Highest)'}</option>
                <option value="priceAsc">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="priceDesc">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="areaDesc">{language === 'bn' ? 'জমির পরিমাপ (বৃহত্তম)' : 'Plot Area (Largest)'}</option>
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results Count & Data Badge */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            {t.filters.showingResults.replace('{count}', filteredParcels.length.toString())}
          </span>
          <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {language === 'bn' ? 'নমুনা মূল্যায়ন রেকর্ড' : 'Sample Benchmark Dataset'}
          </span>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredParcels.map((parcel) => {
          const suitability = calculateSuitability(parcel, selectedPurpose);
          const isCompared = comparedParcelIds.includes(parcel.id);

          return (
            <div 
              key={parcel.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 overflow-hidden shadow-lg transition duration-200 flex flex-col group"
            >
              {/* Photo & Top Badges */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img 
                  src={parcel.imageUrl} 
                  alt={parcel.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-slate-900/90 text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                    {parcel.zoning}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                    {t.propertyCard.sampleBadge}
                  </span>
                </div>

                {/* Suitability Score Chip */}
                <div className="absolute top-2.5 right-2.5">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-lg border ${
                    suitability.overallScore >= 80 
                      ? 'bg-emerald-500 text-slate-950 border-white' 
                      : suitability.overallScore >= 60 
                      ? 'bg-amber-500 text-slate-950 border-white' 
                      : 'bg-red-500 text-white border-white'
                  }`}>
                    <span>{suitability.overallScore}</span>
                    <span className="text-[10px] opacity-80">/100</span>
                  </div>
                </div>

                {/* Bottom title inside image overlay */}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="font-extrabold text-base text-white leading-snug">
                    {language === 'bn' ? parcel.titleBn : parcel.titleEn}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-300 mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                    <span>{parcel.mouza}, {parcel.district}</span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                {/* Financial & Size Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'bn' ? 'মূল্য' : 'Price'}</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {formatBdt(parcel.priceBdt, language)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {formatBdt(parcel.pricePerKatha, language)}/{t.propertyCard.perKatha}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{language === 'bn' ? 'আয়তন' : 'Area'}</span>
                    <span className="text-sm font-extrabold text-white">
                      {formatArea(parcel.areaKatha, language)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {parcel.areaSqFt.toLocaleString()} Sq Ft
                    </span>
                  </div>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  <div className="p-1.5 bg-slate-950/40 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">{t.propertyCard.roadWidth}</span>
                    <span className="font-bold text-slate-200">{parcel.roadWidthFt} ft</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/40 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">{t.propertyCard.elevation}</span>
                    <span className="font-bold text-slate-200">{parcel.elevationMeters}m</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/40 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">{t.propertyCard.floodRisk}</span>
                    <span className={`font-bold ${parcel.floodRisk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {parcel.floodRisk}
                    </span>
                  </div>
                </div>

                {/* Legal and Data Notice */}
                <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-0.5">
                    {parcel.legalStatus}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ref: {parcel.csRsReference}
                  </span>
                </div>

                {/* Primary Card Actions */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  {/* Suitability Dossier Trigger */}
                  <button
                    onClick={() => onOpenSuitabilityModal(parcel)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.propertyCard.calculateSuitability} ({suitability.overallScore}/100)</span>
                  </button>

                  {/* Secondary Actions Row */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onSelectOnMap(parcel)}
                      className="py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition"
                    >
                      <MapPin className="w-3 h-3 text-brand-400" />
                      <span>{language === 'bn' ? 'ম্যাপ' : 'Map'}</span>
                    </button>

                    <button
                      onClick={() => onToggleCompare(parcel)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border flex items-center justify-center gap-1 transition ${
                        isCompared
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <Scale className="w-3 h-3" />
                      <span>{isCompared ? t.propertyCard.removeFromCompare : t.propertyCard.addToCompare}</span>
                    </button>

                    <button
                      onClick={() => onAskAdvisor(parcel)}
                      className="py-1.5 px-2 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 flex items-center justify-center gap-1 transition"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{language === 'bn' ? 'এআই' : 'Ask AI'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredParcels.length === 0 && (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
          <Filter className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {language === 'bn' ? 'কোনো প্লট পাওয়া যায়নি' : 'No parcels matched your filter criteria'}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {language === 'bn' ? 'ফিল্টার শিথিল করে পুনরায় অনুসন্ধান করুন।' : 'Try expanding your budget range or selecting All Divisions.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 text-white shadow"
          >
            {t.filters.resetFilters}
          </button>
        </div>
      )}
    </div>
  );
};
