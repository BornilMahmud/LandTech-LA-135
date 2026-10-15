import React, { useState } from 'react';
import { DistrictData } from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';

interface CadastralExplorerSectionProps {
  isBn: boolean;
  selectedDistrict: DistrictData | null;
  theme?: "dark" | "light";
}

interface MockParcel {
  id: string;
  dagNumber: string;
  khatianNumber: string;
  mouza: string;
  bnMouza: string;
  landType: string;
  bnLandType: string;
  areaKatha: number;
  status: "Verified" | "Dispute-Free" | "Under Mutation";
  deedValueBDT: number;
}

export const CadastralExplorerSection: React.FC<CadastralExplorerSectionProps> = ({
  isBn,
  selectedDistrict,
  theme = "dark",
}) => {
  const isLight = theme === "light";
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchKhatian, setSearchKhatian] = useState<string>('');

  const districtName = selectedDistrict ? selectedDistrict.name : "Dhaka";
  const bnDistrictName = selectedDistrict ? selectedDistrict.bnName : "ঢাকা";
  const landMeta = selectedDistrict ? getDistrictLandData(selectedDistrict.id) : getDistrictLandData('dhaka');

  // Generate mock realistic cadastral parcels for this district
  const mockParcels: MockParcel[] = [
    {
      id: "P-101",
      dagNumber: "১০৮৪",
      khatianNumber: "২৯৪/ক",
      mouza: `${districtName} Central Mouza`,
      bnMouza: `${bnDistrictName} সদর মৌজা`,
      landType: "Commercial Viti",
      bnLandType: "বাণিজ্যিক ভিটি",
      areaKatha: 6.5,
      status: "Verified",
      deedValueBDT: 6.5 * landMeta.avgPricePerKathaBDT,
    },
    {
      id: "P-102",
      dagNumber: "৭৪২",
      khatianNumber: "১২০",
      mouza: "Green Valley Mouza",
      bnMouza: "সবুজ নগর মৌজা",
      landType: "Residential Homestead",
      bnLandType: "আবাসিক বাস্তু",
      areaKatha: 4.2,
      status: "Dispute-Free",
      deedValueBDT: 4.2 * landMeta.avgPricePerKathaBDT * 0.95,
    },
    {
      id: "P-103",
      dagNumber: "১৫২০",
      khatianNumber: "৫১৬/খ",
      mouza: "Industrial Corridor",
      bnMouza: "শিল্প করিডোর মৌজা",
      landType: "Industrial Plot",
      bnLandType: "শিল্প প্লট",
      areaKatha: 18.0,
      status: "Verified",
      deedValueBDT: 18.0 * landMeta.avgPricePerKathaBDT * 1.05,
    },
    {
      id: "P-104",
      dagNumber: "৩১২",
      khatianNumber: "৮৮",
      mouza: "Riverfront Agro",
      bnMouza: "নদী তীরবর্তী কৃষি মৌজা",
      landType: "Agricultural Nala",
      bnLandType: "কৃষি নালা/নাল",
      areaKatha: 32.0,
      status: "Under Mutation",
      deedValueBDT: 32.0 * landMeta.avgPricePerKathaBDT * 0.65,
    },
  ];

  const filteredParcels = mockParcels.filter((p) => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (searchKhatian && !p.dagNumber.includes(searchKhatian) && !p.khatianNumber.includes(searchKhatian)) return false;
    return true;
  });

  return (
    <section
      id="cadastral"
      className={`w-full py-16 border-t transition-colors ${
        isLight ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B]" : "bg-[#09090B] border-[#27272A] text-[#FAFAFA]"
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-2 ${
              isLight ? "bg-white border-[#E4E4E7] text-[#52525B]" : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
            }`}>
              <span className="bms-live-dot"></span>
              <span>{isBn ? "ডিজিটাল ক্যাডাস্ট্রে ও দাগ খতিয়ান" : "Digital Cadastre & Land Registry"}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-heading font-black mt-1 ${isLight ? "text-[#09090B]" : "text-white"}`}>
              {isBn
                ? `${bnDistrictName} জেলার ক্যাডাস্ট্রাল মৌজা ও প্লট রেকর্ডস`
                : `${districtName} Cadastral Parcels & Mouza Records`}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl leading-relaxed ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
              {isBn
                ? "সিএস, এসএ, আরএস এবং বিআরএস ডিজিটাল নকশার সাথে সমন্বিত স্বয়ংক্রিয় মিউটেশন ও স্বত্ব যাচাইকরণ।"
                : "Synchronized with Survey of Bangladesh (CS, SA, RS, BRS) cadastral sheets for automated title and spatial graph reconciliation."}
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <i className="bx bx-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[#71717A] text-sm" aria-hidden="true" />
              <input
                type="text"
                placeholder={isBn ? "দাগ বা খতিয়ান নম্বর..." : "Search Dag/Khatian #..."}
                value={searchKhatian}
                onChange={(e) => setSearchKhatian(e.target.value)}
                className={`rounded-xl pl-8 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-[#09090B] dark:focus:border-white ${
                  isLight
                    ? "bg-white border border-[#E4E4E7] text-[#09090B] placeholder-[#A1A1AA] shadow-xs"
                    : "bg-[#121215] border border-[#27272A] text-white placeholder-[#71717A]"
                }`}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:border-[#09090B] dark:focus:border-white ${
                isLight
                  ? "bg-white border border-[#E4E4E7] text-[#09090B] shadow-xs"
                  : "bg-[#121215] border border-[#27272A] text-white"
              }`}
            >
              <option value="all">{isBn ? "সকল স্ট্যাটাস" : "All Status"}</option>
              <option value="Verified">{isBn ? "যাচাইকৃত (Verified)" : "Verified"}</option>
              <option value="Dispute-Free">{isBn ? "বিরোধমুক্ত (Dispute-Free)" : "Dispute-Free"}</option>
              <option value="Under Mutation">{isBn ? "নামজারি প্রক্রিয়াধীন" : "Under Mutation"}</option>
            </select>
          </div>
        </div>

        {/* Parcels Table Card — BMS card */}
        <div className={`bms-card overflow-hidden ${
          isLight ? "bg-white border-[#E4E4E7]" : "bg-[#121215] border-[#27272A]"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase text-[10px] tracking-wider border-b ${
                isLight ? "bg-[#FAFAFA] text-[#71717A] border-[#E4E4E7]" : "bg-[#18181B] text-[#71717A] border-[#27272A]"
              }`}>
                <tr>
                  <th className="py-3 px-4">{isBn ? "প্লট / দাগ নং" : "Plot / Dag #"}</th>
                  <th className="py-3 px-4">{isBn ? "খতিয়ান নং" : "Khatian #"}</th>
                  <th className="py-3 px-4">{isBn ? "মৌজা ও এলাকা" : "Mouza & Area"}</th>
                  <th className="py-3 px-4">{isBn ? "জমির শ্রেণি" : "Classification"}</th>
                  <th className="py-3 px-4">{isBn ? "আয়তন" : "Size (Katha)"}</th>
                  <th className="py-3 px-4">{isBn ? "স্বত্ব স্থিতি" : "Title Status"}</th>
                  <th className="py-3 px-4 text-right">{isBn ? "আনুমানিক মূল্যায়ন" : "Valuation"}</th>
                  <th className="py-3 px-4 text-center">{isBn ? "অ্যাকশন" : "Action"}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-[#E4E4E7]" : "divide-[#27272A]"}`}>
                {filteredParcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    className={`transition-colors ${
                      isLight ? "hover:bg-[#FAFAFA]" : "hover:bg-[#18181B]/80"
                    }`}
                  >
                    <td className={`py-3.5 px-4 font-bold ${isLight ? "text-[#09090B]" : "text-white"}`}>
                      {parcel.dagNumber}
                    </td>
                    <td className={`py-3.5 px-4 font-semibold ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
                      {parcel.khatianNumber}
                    </td>
                    <td className={`py-3.5 px-4 ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
                      {isBn ? parcel.bnMouza : parcel.mouza}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isLight
                          ? "bg-[#F4F4F5] text-[#09090B] border-[#E4E4E7]"
                          : "bg-[#18181B] text-[#FAFAFA] border-[#27272A]"
                      }`}>
                        {isBn ? parcel.bnLandType : parcel.landType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#16A34A] dark:text-[#4ADE80]">
                      {parcel.areaKatha} {isBn ? "কাঠা" : "Katha"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        parcel.status === "Verified"
                          ? "bg-[#F0FDF4] text-[#16A34A] dark:bg-[#16A34A]/10 dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#16A34A]/25"
                          : parcel.status === "Dispute-Free"
                          ? "bg-[#EFF6FF] text-[#2563EB] dark:bg-[#2563EB]/10 dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#2563EB]/25"
                          : "bg-[#FEFCE8] text-[#CA8A04] dark:bg-[#D97706]/10 dark:text-[#FBBF24] border border-[#FEF08A] dark:border-[#D97706]/25"
                      }`}>
                        <i
                          className={`bx ${
                            parcel.status === "Verified"
                              ? "bx-check-circle"
                              : parcel.status === "Dispute-Free"
                              ? "bx-shield-quarter"
                              : "bx-time-five"
                          } text-xs`}
                          aria-hidden="true"
                        />
                        <span>{parcel.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#D97706] dark:text-[#FBBF24]">
                      ৳{(parcel.deedValueBDT / 10000000).toFixed(2)} {isBn ? "কোটি" : "Cr"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Inspecting Title Deed for Dag #${parcel.dagNumber}, Khatian #${parcel.khatianNumber} in ${districtName}. LandWise digital cadastral record is verified.`)}
                        className={`w-7 h-7 rounded-lg transition-all inline-flex items-center justify-center border ${
                          isLight
                            ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B] hover:bg-[#09090B] hover:text-white"
                            : "bg-[#18181B] border-[#27272A] text-white hover:bg-white hover:text-[#09090B]"
                        }`}
                        title="View Deed & Title Verification"
                      >
                        <i className="bx bx-link-external text-xs" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
