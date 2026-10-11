import React, { useState } from 'react';
import { DistrictData } from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';
import { Layers, Search, ShieldCheck, FileCheck, CheckCircle2, AlertCircle, ExternalLink, Filter } from 'lucide-react';

interface CadastralExplorerSectionProps {
  isBn: boolean;
  selectedDistrict: DistrictData | null;
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
}) => {
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
    <section id="cadastral" className="w-full py-12 border-t border-slate-800 bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isBn ? "ডিজিটাল ক্যাডাস্ট্রে ও দাগ খতিয়ান" : "Digital Cadastre & Land Registry"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
              {isBn
                ? `${bnDistrictName} জেলার ক্যাডাস্ট্রাল মৌজা ও প্লট রেকর্ডস`
                : `${districtName} Cadastral Parcels & Mouza Records`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {isBn
                ? "সিএস, এসএ, আরএস এবং বিআরএস ডিজিটাল নকশার সাথে সমন্বিত স্বয়ংক্রিয় মিউটেশন ও স্বত্ব যাচাইকরণ।"
                : "Synchronized with Survey of Bangladesh (CS, SA, RS, BRS) cadastral sheets for automated title due diligence."}
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isBn ? "দাগ বা খতিয়ান নম্বর..." : "Search Dag/Khatian #..."}
                value={searchKhatian}
                onChange={(e) => setSearchKhatian(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">{isBn ? "সকল স্ট্যাটাস" : "All Status"}</option>
              <option value="Verified">{isBn ? "যাচাইকৃত (Verified)" : "Verified"}</option>
              <option value="Dispute-Free">{isBn ? "বিরোধমুক্ত (Dispute-Free)" : "Dispute-Free"}</option>
              <option value="Under Mutation">{isBn ? "নামজারি প্রক্রিয়াধীন" : "Under Mutation"}</option>
            </select>
          </div>
        </div>

        {/* Parcels Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800/80">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-black text-white">
                      {parcel.dagNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-300">
                      {parcel.khatianNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {isBn ? parcel.bnMouza : parcel.mouza}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {isBn ? parcel.bnLandType : parcel.landType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {parcel.areaKatha} {isBn ? "কাঠা" : "Katha"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        parcel.status === "Verified"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : parcel.status === "Dispute-Free"
                          ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}>
                        {parcel.status === "Verified" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                        <span>{parcel.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-amber-400">
                      ৳{(parcel.deedValueBDT / 10000000).toFixed(2)} {isBn ? "কোটি" : "Cr"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Inspecting Title Deed for Dag #${parcel.dagNumber}, Khatian #${parcel.khatianNumber} in ${districtName}. LandTech digital e-porcha record is verified.`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all inline-flex items-center justify-center"
                        title="View Deed & Title Verification"
                      >
                        <ExternalLink size={12} />
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
