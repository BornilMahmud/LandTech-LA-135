import React from 'react';
import { EnvironmentalAndSpatialRisk } from '../../types/dueDiligence';
import {
  Compass,
  Waves,
  AlertTriangle,
  Building2,
  TreePine,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Car
} from 'lucide-react';

interface EnvironmentalRiskCardProps {
  spatialRisk: EnvironmentalAndSpatialRisk;
  mouzaName: string;
  districtName: string;
  isBn: boolean;
}

export const EnvironmentalRiskCard: React.FC<EnvironmentalRiskCardProps> = ({
  spatialRisk,
  mouzaName,
  districtName,
  isBn,
}) => {
  const getFloodBadge = () => {
    switch (spatialRisk.floodRiskLevel) {
      case 'severe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <Waves size={13} />
            <span>{isBn ? 'মারাত্মক প্লাবন ঝুঁকি (Severe)' : 'Severe Flood Zone'}</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Waves size={13} />
            <span>{isBn ? 'উচ্চ প্লাবন ঝুঁকি' : 'High Flood Risk'}</span>
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            <Waves size={13} />
            <span>{isBn ? 'মাঝারি প্লাবন সম্ভাবনা' : 'Moderate Runoff'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={13} />
            <span>{isBn ? 'নিরাপদ উচ্চভূমি (Low Risk)' : 'Low Flood Risk'}</span>
          </span>
        );
    }
  };

  const getZoningBadge = () => {
    switch (spatialRisk.zoningClassification) {
      case 'residential':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Building2 size={13} />
            <span>{isBn ? 'আবাসিক জোনিং (Residential)' : 'Residential Zoned'}</span>
          </span>
        );
      case 'commercial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Building2 size={13} />
            <span>{isBn ? 'বাণিজ্যিক জোনিং' : 'Commercial Zoned'}</span>
          </span>
        );
      case 'agricultural':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <TreePine size={13} />
            <span>{isBn ? 'কৃষি জমি (সংরক্ষিত)' : 'Agricultural (Protected)'}</span>
          </span>
        );
      case 'wetland_chalan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <Waves size={13} />
            <span>{isBn ? 'জলাভূমি / নাল জমি (Wetland)' : 'Wetland / Waterway'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            {spatialRisk.zoningClassification}
          </span>
        );
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
            <Compass className="text-emerald-500" size={18} />
            <span>
              {isBn
                ? 'পরিবেশগত, ভৌগোলিক ও জোনিং ঝুঁকি সূচক'
                : 'Environmental, Cadastral & Zoning Risk Profile'}
            </span>
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
            {isBn
              ? `স্মার্ট ভূমি নকশা (map.land.gov.bd) এবং হাইড্রোলজিক্যাল স্যাটেলাইট উপাত্তের ভিত্তিতে ${mouzaName}, ${districtName}-এর ভূ-প্রাকৃতিক বিশ্লেষণ`
              : `Grounded in Smart Bhumi Naksha (map.land.gov.bd) and geospatial hydrological markers for ${mouzaName}, ${districtName}`}
          </p>
        </div>

        <a
          href="https://map.land.gov.bd/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-100 transition-colors shrink-0"
        >
          <span>{isBn ? 'স্মার্ট ভূমি নকশা পোর্টাল' : 'Smart Bhumi Naksha'}</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Grid of Key Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Flood Hazard & Elevation */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Waves size={15} className="text-sky-500" />
              {isBn ? 'বন্যা ও প্লাবন প্রবণতা' : 'Flood Hazard & Elevation'}
            </span>
            {getFloodBadge()}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {isBn ? spatialRisk.floodRiskDescriptionBn : spatialRisk.floodRiskDescriptionEn}
          </p>
        </div>

        {/* Card 2: Riverbank Erosion (নদী ভাঙন) */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-500" />
              {isBn ? 'নদী ভাঙন ঝুঁকি' : 'Riverbank Erosion Risk'}
            </span>
            {spatialRisk.riverErosionRisk === 'high_alert' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                <ShieldAlert size={12} />
                {isBn ? 'উচ্চ ভাঙন ঝুঁকি' : 'High Alert'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={12} />
                {isBn ? 'ভাঙনমুক্ত' : 'Stable Bank'}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {isBn ? spatialRisk.riverErosionDescriptionBn : spatialRisk.riverErosionDescriptionEn}
          </p>
        </div>

        {/* Card 3: Digital Zoning & Land Classification */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Building2 size={15} className="text-indigo-500" />
              {isBn ? 'ভূমি জোনিং ও অনুমতি' : 'Digital Land Zoning Classification'}
            </span>
            {getZoningBadge()}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {isBn ? spatialRisk.zoningPermitStatusBn : spatialRisk.zoningPermitStatusEn}
          </p>
          {spatialRisk.isZoningConversionRequired && (
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              ⚠️ {isBn ? 'শ্রেণি পরিবর্তন (ভূমি সংস্কার আইন ২০২৩) অনুমোদন ব্যতীত বাণিজ্যিক নির্মাণ নিষিদ্ধ।' : 'Land conversion clearance required prior to non-agricultural construction.'}
            </div>
          )}
        </div>

        {/* Card 4: Road Frontage & Accessibility */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Car size={15} className="text-emerald-500" />
              {isBn ? 'রাস্তার সংযোগ ও হালট' : 'Road Access & Frontage'}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
              {spatialRisk.roadAccessWidthFeet} {isBn ? 'ফুট প্রশস্ত' : 'Feet Wide'}
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {isBn ? spatialRisk.roadAccessDescriptionBn : spatialRisk.roadAccessDescriptionEn}
          </p>
        </div>

      </div>

      {/* Government Khash & Setback Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-zinc-950 dark:text-zinc-100">
          <MapPin size={13} className="text-amber-500" />
          <span>{isBn ? 'সরকারি খাস জমি ও অধিগ্রহণ স্ট্যাটাস:' : 'Government Khash & Acquisition Setback Status:'}</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-300">
          {isBn ? spatialRisk.khashOrGovernmentProximityBn : spatialRisk.khashOrGovernmentProximityEn}
        </p>
      </div>
    </div>
  );
};
