import React from 'react';
import { BANGLADESH_DIVISIONS, ALL_BANGLADESH_DISTRICTS, DistrictData, DivisionData } from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';
import { MapPin, TrendingUp, ChevronRight, Check } from 'lucide-react';

interface RegionQuickGridProps {
  isBn: boolean;
  selectedDistrict: DistrictData | null;
  onSelectDistrict: (d: DistrictData) => void;
  selectedDivision: DivisionData | null;
  onSelectDivision: (div: DivisionData) => void;
}

export const RegionQuickGrid: React.FC<RegionQuickGridProps> = ({
  isBn,
  selectedDistrict,
  onSelectDistrict,
  selectedDivision,
  onSelectDivision,
}) => {
  // Highlighted Top Growth Centers
  const topHubIds = ['dhaka', 'chattogram', 'sylhet', 'gazipur', 'coxsbazar', 'bogura', 'rajshahi', 'khulna'];
  const topHubs = ALL_BANGLADESH_DISTRICTS.filter((d) => topHubIds.includes(d.id));

  return (
    <section className="w-full py-8 border-t border-slate-800/80 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isBn ? "দ্রুত অঞ্চল নির্বাচন" : "Quick Spatial Navigation"}
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white mt-1">
              {isBn ? "৮টি প্রশাসনিক বিভাগ ও শীর্ষ অর্থনৈতিক কেন্দ্র" : "8 Administrative Divisions & Growth Corridors"}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {isBn
                ? "মানচিত্রের নির্দিষ্ট অংশে অবিলম্বে নেভিগেট করতে যেকোনো বিভাগ বা শীর্ষ বাণিজ্য কেন্দ্রে ক্লিক করুন।"
                : "Select any division or growth hub to immediately focus and filter the interactive geospatial canvas."}
            </p>
          </div>
        </div>

        {/* 8 Divisions Horizontal Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span>{isBn ? "বিভাগসমূহ" : "Administrative Divisions"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {BANGLADESH_DIVISIONS.map((div) => {
              const isSelected = selectedDivision?.id === div.id;

              return (
                <button
                  key={div.id}
                  type="button"
                  onClick={() => {
                    onSelectDivision(div);
                    const capitalDistrict = ALL_BANGLADESH_DISTRICTS.find((d) => d.id === div.hubDistrictId);
                    if (capitalDistrict) onSelectDistrict(capitalDistrict);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {div.districtsCount} {isBn ? "জেলা" : "Districts"}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {isBn ? div.bnName : div.name.replace(" Division", "")}
                  </h4>

                  <span className="text-[10px] text-slate-400 block mt-1">
                    {isBn ? "সদর:" : "HQ:"} {ALL_BANGLADESH_DISTRICTS.find((d) => d.id === div.hubDistrictId)?.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top 8 Growth Hubs */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <span>{isBn ? "শীর্ষ প্রবৃদ্ধি করিডোর" : "Top Land Valuation Corridors"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {topHubs.map((dst) => {
              const isSelected = selectedDistrict?.id === dst.id;
              const meta = getDistrictLandData(dst.id);

              return (
                <button
                  key={dst.id}
                  type="button"
                  onClick={() => {
                    onSelectDistrict(dst);
                    const parentDiv = BANGLADESH_DIVISIONS.find((d) => d.id === dst.divisionId);
                    if (parentDiv) onSelectDivision(parentDiv);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all group ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {dst.divisionName}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">
                      {meta.viabilityScore}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {isBn ? dst.bnName : dst.name}
                  </h4>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80">
                    <span className="text-[10px] text-amber-400 font-bold">
                      ৳{(meta.avgPricePerKathaBDT / 100000).toFixed(1)}L
                    </span>
                    <span className="text-[9px] text-slate-500">
                      /katha
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
