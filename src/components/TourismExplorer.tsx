import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Car, 
  AlertCircle, 
  Star, 
  CheckCircle2, 
  Hotel,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { TourismDestination, Accommodation, Language } from '../types';
import { BANGLADESH_DESTINATIONS } from '../data/tourism';
import { BANGLADESH_ACCOMMODATIONS } from '../data/accommodations';
import { TRANSLATIONS } from '../locales/translations';

interface TourismExplorerProps {
  destinations: TourismDestination[];
  accommodations: Accommodation[];
  selectedDestination: TourismDestination;
  setSelectedDestination: (dest: TourismDestination) => void;
  language: Language;
  onViewOnMap: (dest: TourismDestination) => void;
  onAskAdvisorForDestination: (dest: TourismDestination) => void;
}

export const TourismExplorer: React.FC<TourismExplorerProps> = ({
  destinations,
  accommodations,
  selectedDestination,
  setSelectedDestination,
  language,
  onViewOnMap,
  onAskAdvisorForDestination,
}) => {
  const t = TRANSLATIONS[language];

  // Accommodations for the selected destination
  const destAccommodations = accommodations.filter(
    acc => acc.destinationId === selectedDestination.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.tourism.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.tourism.subtitle}
          </p>
        </div>

        {/* View on Map Button */}
        <button
          onClick={() => onViewOnMap(selectedDestination)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'bn' ? 'ম্যাপে দেখুন' : 'Explore on Map'}</span>
        </button>
      </div>

      {/* Destination Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {destinations.map((dest) => {
          const isSelected = dest.id === selectedDestination.id;
          return (
            <button
              key={dest.id}
              onClick={() => setSelectedDestination(dest)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>{language === 'bn' ? dest.nameBn : dest.nameEn}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                isSelected ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-400'
              }`}>
                {dest.division}
              </span>
            </button>
          );
        })}
      </div>

      {/* Destination Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl min-h-[320px] flex flex-col justify-end p-6 sm:p-8">
        <img 
          src={selectedDestination.imageUrl} 
          alt={selectedDestination.nameEn}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{selectedDestination.district}, {selectedDestination.division}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {language === 'bn' ? selectedDestination.nameBn : selectedDestination.nameEn}
          </h2>

          <p className="text-sm sm:text-base text-amber-300 font-semibold">
            {language === 'bn' ? selectedDestination.taglineBn : selectedDestination.taglineEn}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {language === 'bn' ? selectedDestination.overviewBn : selectedDestination.overviewEn}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onAskAdvisorForDestination(selectedDestination)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition"
            >
              {language === 'bn' ? 'এই গন্তব্যের এআই ট্যুর গাইড' : 'Ask AI Itinerary Guide'}
            </button>
          </div>
        </div>
      </div>

      {/* Practical Travel Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best Season */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Calendar className="w-4 h-4" />
            <span>{t.tourism.bestSeason}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            {language === 'bn' 
              ? selectedDestination.practicalInfo.bestSeasonBn 
              : selectedDestination.practicalInfo.bestSeasonEn}
          </p>
        </div>

        {/* Suggested Duration */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-400">
            <Clock className="w-4 h-4" />
            <span>{t.tourism.duration}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            {language === 'bn' 
              ? selectedDestination.practicalInfo.suggestedDurationBn 
              : selectedDestination.practicalInfo.suggestedDurationEn}
          </p>
          <span className="text-[10px] text-slate-400 block italic">
            {language === 'bn' ? '(পরামর্শমূলক রূপরেখা)' : '(Guidance recommendation)'}
          </span>
        </div>

        {/* How to Reach */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Car className="w-4 h-4" />
            <span>{t.tourism.howToReach}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            {language === 'bn' 
              ? selectedDestination.practicalInfo.howToReachBn 
              : selectedDestination.practicalInfo.howToReachEn}
          </p>
        </div>
      </div>

      {/* Travel Advisory Warning */}
      <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-amber-300 block">{t.tourism.guidanceNotice}</span>
          <p className="text-slate-300 leading-relaxed">
            {language === 'bn' 
              ? selectedDestination.practicalInfo.guidanceNoticeBn 
              : selectedDestination.practicalInfo.guidanceNoticeEn}
          </p>
        </div>
      </div>

      {/* Key Attractions Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white">
          {t.tourism.attractionsHeader}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedDestination.attractions.map((attraction, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {attraction.type}
                </span>
                <span className="text-xs font-semibold text-slate-400">#0{idx + 1}</span>
              </div>

              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? attraction.nameBn : attraction.nameEn}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'bn' ? attraction.descriptionBn : attraction.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Accommodations & Booking Engine Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Hotel className="w-5 h-5 text-brand-400" />
              <span>{t.tourism.accommodationsHeader}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {t.tourism.verifiedDisclaimer}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {destAccommodations.map((hotel) => (
            <div 
              key={hotel.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-950">
                  <img 
                    src={hotel.imageUrl} 
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold bg-slate-900/90 text-white px-2 py-0.5 rounded-full border border-slate-700">
                      {hotel.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/90 text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border border-slate-700">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-white">
                      {hotel.name}
                    </h4>
                    <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                      {hotel.priceRangeBdt}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities.slice(0, 4).map((amenity, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {language === 'bn' ? hotel.disclaimerBn : hotel.disclaimerEn}
                  </p>
                </div>
              </div>

              {/* Verified Booking Links */}
              <div className="p-4 pt-0 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'bn' ? 'যাচাইকৃত বুকিং প্ল্যাটফর্ম:' : 'Verified Booking Providers:'}
                </span>

                <div className="flex flex-col gap-1.5">
                  {hotel.verifiedExternalLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.tourism.bookExternal.replace('{provider}', link.provider)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span>{link.badge}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400 text-right pt-1">
                  Last verified: {hotel.lastVerified}
                </div>
              </div>
            </div>
          ))}

          {destAccommodations.length === 0 && (
            <div className="col-span-full p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              {language === 'bn' ? 'এই গন্তব্যের জন্য শীঘ্রই আরও হোটেল তালিকা আসছে।' : 'Additional resort listings for this destination are currently being verified.'}
            </div>
          )}
        </div>
      </div>

      {/* Data Sources and Disclosures Footer */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Info className="w-4 h-4 text-brand-400" />
          <span>{t.tourism.dataLimitations}</span>
        </div>
        <p className="leading-relaxed">
          {language === 'bn' ? selectedDestination.limitationsNoticeBn : selectedDestination.limitationsNoticeEn}
        </p>
        <p className="text-[11px] text-slate-400">
          Attribution: {selectedDestination.dataSources.join(', ')}.
        </p>
      </div>
    </div>
  );
};
