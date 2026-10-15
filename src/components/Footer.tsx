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
        ? "bg-[#F3EFE8] border-[#E8E3DA] text-[#706E6B]" 
        : "bg-[#141413] border-[#2B2A27] text-[#9E9B95]"
    }`}>
      {/* ── TOP HIGHLIGHT & STATUS BANNER ── */}
      <div className={`border-b ${isLight ? "border-[#E8E3DA]" : "border-[#2B2A27]"}`}>
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 font-mono text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CC5A2B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CC5A2B]"></span>
            </span>
            <span className={`font-semibold ${isLight ? "text-[#191817]" : "text-[#FAF9F5]"}`}>
              {isBn ? "সিস্টেম সক্রিয়" : "Systems Operational"}
            </span>
            <span className="text-[#9E9B95]">•</span>
            <span className="hidden sm:inline">
              {isBn ? "৬৪টি জেলা ও ৮টি বিভাগ সিঙ্কড" : "64 Districts & 8 Administrative Divisions Synced"}
            </span>
            <span className="hidden md:inline text-[#9E9B95]">•</span>
            <span className="hidden md:inline text-[#CC5A2B] font-medium">
              {isBn ? "১০০% ক্লায়েন্ট-সাইড প্রাইভেসি" : "100% Client-Side Privacy"}
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border text-xs font-mono font-medium transition-all shadow-xs ${
              isLight
                ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#191817] hover:bg-white hover:border-[#D5CEC2]"
                : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5] hover:bg-[#2B2A27]"
            }`}
          >
            <span>{isBn ? "উপরে যান" : "Back to Top"}</span>
            <i className="bx bx-up-arrow-alt text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── MAIN MULTI-COLUMN ARCHITECTURE ── */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Identity (4 Cols) */}
          <div className="md:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className={`text-xl tracking-tight ${
                isLight ? "text-[#191817]" : "text-[#FAF9F5]"
              }`}>
                <span className="font-serif font-semibold">LandWise</span>
                <span className="text-[#CC5A2B] font-bold text-2xl leading-none">.</span>
              </span>
              <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase font-semibold border ${
                isLight 
                  ? "bg-[#FAF0EB] text-[#CC5A2B] border-[#F3D5C6]" 
                  : "bg-[#1E1E1C] text-[#CC5A2B] border-[#2B2A27]"
              }`}>
                Pro GIS
              </span>
            </div>

            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
              {isBn
                ? "বাংলাদেশের জমি ক্রেতা, পরিবার ও প্রবাসীদের জন্য আধুনিক ক্যাডাস্ট্রাল মানচিত্র ও কৃত্রিম বুদ্ধিমত্তা চালিত ভূমি রেকর্ড অডিট অবকাঠামো। নিরাপদ জমি লেনদেনের ডিজিটাল ভিত্তি।"
                : "Modern spatial intelligence and cadastral infrastructure for Bangladesh. Cross-examine deeds, land surveys, valuation indices, and title chains with zero remote data storage."}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-mono border ${
                isLight ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#706E6B]" : "bg-[#1E1E1C] border-[#2B2A27] text-[#9E9B95]"
              }`}>
                <i className="bx bx-shield-quarter text-[#CC5A2B] text-sm" aria-hidden="true" />
                <span>Zero Server Storage</span>
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-mono border ${
                isLight ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#706E6B]" : "bg-[#1E1E1C] border-[#2B2A27] text-[#9E9B95]"
              }`}>
                <i className="bx bx-network-chart text-[#CC5A2B] text-sm" aria-hidden="true" />
                <span>Vector GIS</span>
              </span>
            </div>
          </div>

          {/* Column 2: Platform Architecture (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-serif font-semibold uppercase tracking-wider ${
              isLight ? "text-[#191817]" : "text-[#FAF9F5]"
            }`}>
              {isBn ? "প্ল্যাটফর্ম সমাধান" : "Platform Modules"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#hero-map"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <i className="bx bx-map-alt text-xs text-[#9E9B95]" aria-hidden="true" />
                  <span>{isBn ? "৬৪ জেলার ইন্টারেক্টিভ মানচিত্র" : "64-District Vector Atlas"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#due-diligence"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <i className="bx bx-git-repo-forked text-xs text-[#9E9B95]" aria-hidden="true" />
                  <span>{isBn ? "রেকর্ড ও টাইটেল গ্রাফ" : "Title Chain & Spatial Graph"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#cadastre"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <i className="bx bx-compass text-xs text-[#9E9B95]" aria-hidden="true" />
                  <span>{isBn ? "ক্যাডাস্ট্রাল জরিপ (CS, SA, RS, BS)" : "Cadastral Surveys (CS/RS/BS)"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#calculator"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <i className="bx bx-calculator text-xs text-[#9E9B95]" aria-hidden="true" />
                  <span>{isBn ? "প্লট মূল্যায়ন ও রূপান্তর ক্যালকুলেটর" : "Valuation & Unit Converter"}</span>
                </a>
              </li>
              <li>
                <a
                  href="#district-dashboard"
                  className={`transition-colors flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <i className="bx bx-buildings text-xs text-[#9E9B95]" aria-hidden="true" />
                  <span>{isBn ? "মৌজা ও উপজেলা ইনটেলিজেন্স" : "Upazila & Mouza Intelligence"}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Government Grounded Sources (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className={`text-xs font-serif font-semibold uppercase tracking-wider ${
              isLight ? "text-[#191817]" : "text-[#FAF9F5]"
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
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <span>Bhumipedia (আইন ও বিধি)</span>
                  <i className="bx bx-link-external text-[11px] text-[#9E9B95]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://map.settlement.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <span>DLRS Settlement Maps</span>
                  <i className="bx bx-link-external text-[11px] text-[#9E9B95]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://eporcha.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <span>ePorcha (ডিজিটাল খতিয়ান)</span>
                  <i className="bx bx-link-external text-[11px] text-[#9E9B95]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://mutation.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <span>e-Mutation (ই-নামজারি)</span>
                  <i className="bx bx-link-external text-[11px] text-[#9E9B95]" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://map.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors inline-flex items-center gap-1.5 ${
                    isLight ? "text-[#706E6B] hover:text-[#CC5A2B]" : "text-[#9E9B95] hover:text-[#CC5A2B]"
                  }`}
                >
                  <span>Smart Bhumi Naksha</span>
                  <i className="bx bx-link-external text-[11px] text-[#9E9B95]" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Integrity & Security (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className={`text-xs font-serif font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? "text-[#191817]" : "text-[#FAF9F5]"
            }`}>
              <i className="bx bx-lock-alt text-[#CC5A2B]" aria-hidden="true" />
              <span>{isBn ? "আইনি নিশ্চয়তা" : "Legal Trust"}</span>
            </h4>
            <p className={`text-[11px] leading-relaxed ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
              {isBn
                ? "ল্যান্ডওয়াইজ তথ্য বিশ্লেষক প্ল্যাটফর্ম। যেকোনো চুক্তি বা বায়না সম্পাদনের পূর্বে সাব-রেজিস্ট্রি রেকর্ড তল্লাশি ও বিজ্ঞ আইনজীবীর মতামত নিন।"
                : "LandWise assists data cross-examination. Always retain a qualified Advocate and search Sub-Registry books before transactions."}
            </p>
          </div>

        </div>

        {/* ── BOTTOM ROW: COPYRIGHT, INTEGRITY & POLICIES ── */}
        <div className={`mt-10 pt-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[11px] ${
          isLight ? "border-[#E8E3DA] text-[#706E6B]" : "border-[#2B2A27] text-[#9E9B95]"
        }`}>
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} LandWise Inc.</span>
            <span>•</span>
            <span className="font-sans">
              {isBn ? "বাংলাদেশের ভূমি প্রযুক্তির উন্মুক্ত প্ল্যাটফর্ম" : "Engineered for Bangladesh Land Transparency"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#due-diligence"
              className={`transition-colors ${isLight ? "hover:text-[#CC5A2B]" : "hover:text-white"}`}
            >
              {isBn ? "যাচাই পদ্ধতি" : "Audit Standard"}
            </a>
            <span className="text-[#D5CEC2] dark:text-[#2B2A27]">/</span>
            <span className="text-[#CC5A2B] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CC5A2B]"></span>
              {isBn ? "ক্লায়েন্ট সাইড সুরক্ষিত" : "Zero Telemetry Leaks"}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
