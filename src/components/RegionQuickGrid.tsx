import React from 'react';
import { BANGLADESH_DIVISIONS, ALL_BANGLADESH_DISTRICTS, DistrictData, DivisionData } from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';

interface RegionQuickGridProps {
  isBn: boolean;
  selectedDistrict: DistrictData | null;
  onSelectDistrict: (d: DistrictData) => void;
  selectedDivision: DivisionData | null;
  onSelectDivision: (div: DivisionData) => void;
  theme?: "dark" | "light";
}

export const RegionQuickGrid: React.FC<RegionQuickGridProps> = ({
  isBn,
  selectedDistrict,
  onSelectDistrict,
  selectedDivision,
  onSelectDivision,
  theme = "dark",
}) => {
  const isLight = theme === "light";
  // Highlighted Top Growth Centers
  const topHubIds = ['dhaka', 'chattogram', 'sylhet', 'gazipur', 'coxsbazar', 'bogura', 'rajshahi', 'khulna'];
  const topHubs = ALL_BANGLADESH_DISTRICTS.filter((d) => topHubIds.includes(d.id));

  return (
    <section
      className={`w-full py-12 border-t transition-colors ${
        isLight ? "bg-[#FAFAFA] border-zinc-200 text-zinc-900" : "bg-[#09090B] border-zinc-800 text-zinc-100"
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {isBn ? "দ্রুত অঞ্চল নির্বাচন" : "Quick Spatial Navigation"}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {isBn ? "৮টি প্রশাসনিক বিভাগ ও শীর্ষ অর্থনৈতিক কেন্দ্র" : "8 Administrative Divisions & Growth Corridors"}
            </h2>
            <p className="text-xs sm:text-sm mt-1 max-w-xl text-zinc-600 dark:text-zinc-400">
              {isBn
                ? "মানচিত্রের নির্দিষ্ট অংশে অবিলম্বে নেভিগেট করতে যেকোনো বিভাগ বা শীর্ষ বাণিজ্য কেন্দ্রে ক্লিক করুন।"
                : "Select any division or growth hub to immediately focus and filter the interactive geospatial canvas."}
            </p>
          </div>
        </div>

        {/* 8 Divisions Horizontal Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
            <span>{isBn ? "বিভাগসমূহ" : "Administrative Divisions"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md transform -translate-y-0.5"
                      : isLight
                      ? "bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 shadow-xs"
                      : "bg-[#121215] border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-[#18181B]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-semibold uppercase ${isSelected ? (isLight ? "text-zinc-300" : "text-zinc-600") : "text-zinc-400"}`}>
                      {div.districtsCount} {isBn ? "জেলা" : "Districts"}
                    </span>
                    {isSelected && (
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isLight ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"}`}>
                        <i className="bx bx-check" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold truncate">
                    {isBn ? div.bnName : div.name.replace(" Division", "")}
                  </h4>

                  <span className={`text-[10px] block mt-1 truncate ${isSelected ? (isLight ? "text-zinc-300" : "text-zinc-600") : "text-zinc-400"}`}>
                    {isBn ? "সদর:" : "HQ:"} {ALL_BANGLADESH_DISTRICTS.find((d) => d.id === div.hubDistrictId)?.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top 8 Growth Hubs */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
            <span>{isBn ? "শীর্ষ প্রবৃদ্ধি করিডোর" : "Top Land Valuation Corridors"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
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
                      ? "bg-amber-500/10 border-amber-500 text-zinc-950 dark:text-white shadow-sm ring-1 ring-amber-500/50"
                      : isLight
                      ? "bg-white border-zinc-200/90 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 shadow-xs"
                      : "bg-[#121215] border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-[#18181B]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-zinc-400 truncate">
                      {dst.divisionName}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {meta.viabilityScore}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {isBn ? dst.bnName : dst.name}
                  </h4>

                  <div className={`flex items-center justify-between mt-2 pt-1.5 border-t ${
                    isLight ? "border-zinc-100" : "border-zinc-800/80"
                  }`}>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold font-mono">
                      ৳{(meta.avgPricePerKathaBDT / 100000).toFixed(1)}L
                    </span>
                    <span className="text-[9px] text-zinc-400">
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

