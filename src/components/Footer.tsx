import React from 'react';

interface FooterProps {
  isBn: boolean;
  theme?: "dark" | "light";
}

export const Footer: React.FC<FooterProps> = ({ isBn, theme = "light" }) => {
  const isLight = theme === "light";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`w-full border-t transition-colors ${
      isLight 
        ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#52525B]" 
        : "bg-[#09090B] border-[#27272A] text-[#A1A1AA]"
    }`}>
      {/* ── TOP HIGHLIGHT & STATUS BANNER ── */}
      <div className={`border-b ${isLight ? "border-[#E4E4E7]/80" : "border-[#27272A]/80"}`}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className={`font-semibold ${isLight ? "text-[#09090B]" : "text-[#FAFAFA]"}`}>
              {isBn ? "সিস্টেম সক্রিয়" : "Systems Operational"}
            </span>
            <span className="text-[#71717A]">•</span>
            <span className="hidden sm:inline">
              {isBn ? "৬৪টি জেলা ও ৮টি বিভাগ সিঙ্কড" : "64 Districts & 8 Administrative Divisions Synced"}
            </span>
            <span className="hidden md:inline text-[#71717A]">•</span>
            <span className="hidden md:inline text-emerald-600 dark:text-emerald-400 font-medium">
              {isBn ? "১০০% ক্লায়েন্ট-সাইড প্রাইভেসি" : "100% Client-Side Privacy"}
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all shadow-xs ${
              isLight
                ? "bg-white border-[#E4E4E7] text-[#09090B] hover:bg-zinc-100 hover:border-zinc-300"
                : "bg-[#18181B] border-[#27272A] text-[#FAFAFA] hover:bg-[#202025] hover:border-zinc-700"
            }`}
          >
            <span>{isBn ? "উপরে যান" : "Back to Top"}</span>
            <i className="bx bx-up-arrow-alt text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── MAIN BIG-TECH MULTI-COLUMN ARCHITECTURE ── */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`font-heading font-black text-xl tracking-tight ${
                isLight ? "text-[#09090B]" : "text-[#FAFAFA]"
              }`}>
                LandWise<span className="text-[#16A34A] dark:text-[#4ADE80] font-black text-2xl leading-none">.</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                isLight 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
              }`}>
                Pro GIS
              </span>
            </div>

            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? "text-[#52525B]" : "text-[#A1A1AA]"}`}>
              {isBn
                ? "বাংলাদেশের জমি ক্রেতা, পরিবার ও প্রবাসীদের জন্য আধুনিক ক্যাডাস্ট্রাল মানচিত্র ও কৃত্রিম বুদ্ধিমত্তা চালিত ভূমি রেকর্ড অডিট অবকাঠামো। নিরাপদ জমি লেনদেনের ডিজিটাল ভিত্তি।"
                : "Modern spatial intelligence and cadastral infrastructure for Bangladesh. Cross-examine deeds, land surveys, valuation indices, and title chains with zero remote data storage."}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                isLight ? "bg-white border-[#E4E4E7] text-[#52525B]" : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
              }`}>
                <i className="bx bx-shield-quarter text-emerald-600 dark:text-emerald-400 text-sm" aria-hidden="true" />
                <span>Zero Server Storage</span>
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                isLight ? "bg-white border-[#E4E4E7] text-[#52525B]" : "bg-[#18181B] border-[#27272A] text-[#A1A1AA]"
              }`}>
                <i className="bx bx-network-chart text-blue-600 dark:text-blue-400 text-sm" aria-hidden="true" />
                <span>Vector GIS</span>
              </span>
            </div>
          </div>

          {/* Column 2: Platform Architecture (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider font-heading ${
              isLight ? "text-[#09090B]" : "text-[#FAFAFA]"
            }`}>
              {isBn ? "প্ল্যাটফর্ম সমাধান" : "Platform Modules"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#hero-map"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <i className="bx bx-map-alt text-xs text-[#71717A]" aria-hidden="true" />
                  <span>{isBn ? "৬৪ জেলার ইন্টারেক্টিভ মানচিত্র" : "64-District Vector Atlas"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#due-diligence"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <i className="bx bx-git-repo-forked text-xs text-[#71717A]" aria-hidden="true" />
                  <span>{isBn ? "রেকর্ড ও টাইটেল গ্রাফ" : "Title Chain & Spatial Graph"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#cadastre"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <i className="bx bx-compass text-xs text-[#71717A]" aria-hidden="true" />
                  <span>{isBn ? "ক্যাডাস্ট্রাল জরিপ (CS, SA, RS, BS)" : "Cadastral Surveys (CS/RS/BS)"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#calculator"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <i className="bx bx-calculator text-xs text-[#71717A]" aria-hidden="true" />
                  <span>{isBn ? "প্লট মূল্যায়ন ও রূপান্তর ক্যালকুলেটর" : "Valuation & Unit Converter"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#district-dashboard"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <i className="bx bx-buildings text-xs text-[#71717A]" aria-hidden="true" />
                  <span>{isBn ? "মৌজা ও উপজেলা ইনটেলিজেন্স" : "Upazila & Mouza Intelligence"}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Government Grounded Sources (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider font-heading ${
              isLight ? "text-[#09090B]" : "text-[#FAFAFA]"
            }`}>
              {isBn ? "সরকারি তথ্যসূত্র পোর্টাল" : "Official Data Portals"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://bhumipedia.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <span>Bhumipedia (আইন ও বিধি)</span>
                  <i className="bx bx-link-external text-[11px] text-[#71717A]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://map.settlement.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <span>DLRS Settlement Maps</span>
                  <i className="bx bx-link-external text-[11px] text-[#71717A]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://eporcha.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <span>ePorcha (ডিজিটাল খতিয়ান)</span>
                  <i className="bx bx-link-external text-[11px] text-[#71717A]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://mutation.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <span>e-Mutation (ই-নামজারি)</span>
                  <i className="bx bx-link-external text-[11px] text-[#71717A]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://map.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#52525B] hover:text-[#09090B]" : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  <span>Smart Bhumi Naksha</span>
                  <i className="bx bx-link-external text-[11px] text-[#71717A]" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Integrity & Security (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider font-heading flex items-center gap-1.5 ${
              isLight ? "text-[#09090B]" : "text-[#FAFAFA]"
            }`}>
              <i className="bx bx-lock-alt text-amber-500" aria-hidden="true" />
              <span>{isBn ? "আইনি নিশ্চয়তা" : "Legal Trust"}</span>
            </h4>
            <p className={`text-[11px] leading-relaxed ${isLight ? "text-[#71717A]" : "text-[#71717A]"}`}>
              {isBn
                ? "ল্যান্ডওয়াইজ তথ্য বিশ্লেষক প্ল্যাটফর্ম। যেকোনো চুক্তি বা বায়না সম্পাদনের পূর্বে সাব-রেজিস্ট্রি রেকর্ড তল্লাশি ও বিজ্ঞ আইনজীবীর মতামত নিন।"
                : "LandWise assists data cross-examination. Always retain a qualified Advocate and search Sub-Registry books before transactions."}
            </p>
          </div>

        </div>

        {/* ── BOTTOM ROW: COPYRIGHT, INTEGRITY & POLICIES ── */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
          isLight ? "border-[#E4E4E7] text-[#71717A]" : "border-[#27272A] text-[#71717A]"
        }`}>
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} LandWise Inc.</span>
            <span>•</span>
            <span className="font-medium">
              {isBn ? "বাংলাদেশের ভূমি প্রযুক্তির উন্মুক্ত প্ল্যাটফর্ম" : "Engineered for Bangladesh Land Transparency"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="#due-diligence"
              className={`transition-colors ${isLight ? "hover:text-[#09090B]" : "hover:text-white"}`}
            >
              {isBn ? "যাচাই পদ্ধতি" : "Audit Standard"}
            </a>
            <span className="text-[#D4D4D8] dark:text-zinc-800">/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {isBn ? "ক্লায়েন্ট সাইড সুরক্ষিত" : "Zero Telemetry Leaks"}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
