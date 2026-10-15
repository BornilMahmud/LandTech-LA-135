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
  theme = "light",
}) => {
  const isLight = theme === "light";
  const topHubIds = ['dhaka', 'chattogram', 'sylhet', 'gazipur', 'coxsbazar', 'bogura', 'rajshahi', 'khulna'];
  const topHubs = ALL_BANGLADESH_DISTRICTS.filter((d) => topHubIds.includes(d.id));

  return (
    <section
      className={`w-full py-10 border-t transition-colors ${
        isLight ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#191817]" : "bg-[#141413] border-[#2B2A27] text-[#FAF9F5]"
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[11px] font-mono uppercase tracking-wider border mb-2 ${
              isLight ? "bg-[#F3EFE8] border-[#E8E3DA] text-[#706E6B]" : "bg-[#1E1E1C] border-[#2B2A27] text-[#9E9B95]"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B]"></span>
              {isBn ? "দ্রুত অঞ্চল নির্বাচন" : "Quick Spatial Navigation"}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? "৮টি প্রশাসনিক বিভাগ ও শীর্ষ অর্থনৈতিক কেন্দ্র" : "8 Administrative Divisions & Growth Corridors"}
            </h2>
            <p className="text-xs sm:text-sm mt-1 max-w-xl text-[#706E6B] dark:text-[#9E9B95]">
              {isBn
                ? "মানচিত্রের নির্দিষ্ট অংশে অবিলম্বে নেভিগেট করতে যেকোনো বিভাগ বা শীর্ষ বাণিজ্য কেন্দ্রে ক্লিক করুন।"
                : "Select any division or growth hub to immediately focus and filter the interactive geospatial canvas."}
            </p>
          </div>
        </div>

        {/* 8 Divisions Cards */}
        <div>
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-[#706E6B] dark:text-[#9E9B95] mb-2.5 flex items-center gap-2">
            <span>{isBn ? "বিভাগসমূহ" : "Administrative Divisions"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B]"></span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
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
                  className={`p-2.5 rounded-[4px] border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-[#191817] text-[#FAF9F5] dark:bg-[#FAF9F5] dark:text-[#191817] border-[#191817] dark:border-[#FAF9F5] shadow-subtle"
                      : isLight
                      ? "bg-white border-[#E8E3DA] text-[#191817] hover:border-[#D5CEC2] hover:bg-[#F3EFE8] shadow-xs"
                      : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5] hover:border-[#383632] hover:bg-[#242422]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono uppercase ${isSelected ? (isLight ? "text-[#EDE7DD]" : "text-[#706E6B]") : "text-[#9E9B95]"}`}>
                      {div.districtsCount} {isBn ? "জেলা" : "Districts"}
                    </span>
                    {isSelected && (
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${isLight ? "bg-white text-[#191817]" : "bg-[#191817] text-white"}`}>
                        <i className="bx bx-check" aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-serif font-semibold truncate">
                    {isBn ? div.bnName : div.name.replace(" Division", "")}
                  </h4>

                  <span className={`text-[10px] block mt-0.5 truncate font-mono ${isSelected ? (isLight ? "text-[#EDE7DD]" : "text-[#706E6B]") : "text-[#9E9B95]"}`}>
                    {isBn ? "সদর:" : "HQ:"} {ALL_BANGLADESH_DISTRICTS.find((d) => d.id === div.hubDistrictId)?.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top 8 Growth Hubs */}
        <div>
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-[#706E6B] dark:text-[#9E9B95] mb-2.5 flex items-center gap-2">
            <span>{isBn ? "শীর্ষ প্রবৃদ্ধি করিডোর" : "Top Land Valuation Corridors"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B]"></span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
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
                  className={`p-2.5 rounded-[4px] border text-left transition-all group ${
                    isSelected
                      ? "bg-[#FAF0EB] border-[#CC5A2B] text-[#191817] dark:bg-[#1E1E1C] dark:border-[#CC5A2B] dark:text-white shadow-xs"
                      : isLight
                      ? "bg-white border-[#E8E3DA] text-[#191817] hover:border-[#D5CEC2] hover:bg-[#F3EFE8] shadow-xs"
                      : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5] hover:border-[#383632] hover:bg-[#242422]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-[#9E9B95] truncate">
                      {dst.divisionName}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-[#CC5A2B]">
                      {meta.viabilityScore}
                    </span>
                  </div>

                  <h4 className="text-xs font-serif font-semibold truncate group-hover:text-[#CC5A2B] transition-colors">
                    {isBn ? dst.bnName : dst.name}
                  </h4>

                  <div className={`flex items-center justify-between mt-1.5 pt-1 border-t ${
                    isLight ? "border-[#E8E3DA]" : "border-[#2B2A27]"
                  }`}>
                    <span className="text-[11px] text-[#CC5A2B] font-bold font-mono">
                      ৳{(meta.avgPricePerKathaBDT / 100000).toFixed(1)}L
                    </span>
                    <span className="text-[9px] font-mono text-[#9E9B95]">
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
