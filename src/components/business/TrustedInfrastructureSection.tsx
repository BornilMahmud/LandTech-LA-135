import React, { useState, useMemo, useRef } from 'react';

interface TrustedInfrastructureSectionProps {
  isBn: boolean;
  theme: 'dark' | 'light';
}

export const STRATEGIC_PILLARS = [
  {
    id: 'gov',
    num: '01',
    labelEn: '1. Government Impact',
    labelBn: '১. সরকারি প্রয়োগ ও প্রশাসন',
    descEn: 'AC Land, Sub-Registry & Khatian Audit',
    descBn: 'সহকারী কমিশনার (ভূমি) ও বালাম ডিজিটাইজেশন',
    icon: 'bxs-landmark',
    tag: 'GovTech',
  },
  {
    id: 'business',
    num: '02',
    labelEn: '2. Commercial Markets',
    labelBn: '২. ব্যবসায়িক বাজার ও ক্লায়েন্ট',
    descEn: 'Banks, NBFI Mortgages & Developers',
    descBn: 'ব্যাংক মর্টগেজ ঝুঁকি ও ডেভেলপার ল্যান্ড অডিট',
    icon: 'bx-briefcase-alt-2',
    tag: 'B2B SaaS',
  },
  {
    id: 'revenue',
    num: '03',
    labelEn: '3. Revenue Model',
    labelBn: '৩. বাণিজ্যিক রাজস্ব প্যাকেজ',
    descEn: 'SaaS Tiers, Pay-Per-Query & API Packages',
    descBn: 'সাবস্ক্রিপশন, প্রতি কোয়েরি চার্জ ও এন্টারপ্রাইজ',
    icon: 'bx-dollar-circle',
    tag: 'Monetization',
  },
  {
    id: 'roi',
    num: '04',
    labelEn: '4. Impact & ROI Calculator',
    labelBn: '৪. কর্মক্ষমতা ও আরওআই ক্যালকুলেটর',
    descEn: 'Interactive Staff Time & Cost Savings',
    descBn: 'ইন্টারেক্টিভ সময় সাশ্রয় ও বিনিয়োগ ফেরত',
    icon: 'bx-calculator',
    tag: 'Interactive ROI',
  },
  {
    id: 'architecture',
    num: '05',
    labelEn: '5. Future Architecture',
    labelBn: '৫. প্রযুক্তিগত স্থাপত্য ও ঝুঁকি',
    descEn: 'Modular Microservices & Scalability Path',
    descBn: 'ক্লাউড মাইক্রোসার্ভিস, এআই পাইপলাইন ও ক্যাশিং',
    icon: 'bx-server',
    tag: 'Cloud & AI',
  },
  {
    id: 'pilot',
    num: '06',
    labelEn: '6. Pilot & Judge Pitch',
    labelBn: '৬. পাইলট পরিকল্পনা ও জাজ পিচ',
    descEn: '90-Day Upazila Pilot & Pitch Blueprint',
    descBn: '৯০ দিনের উপজেলা পাইলট ও হ্যাকাথন পিচ',
    icon: 'bx-target-lock',
    tag: 'Hackathon Win',
  },
  {
    id: 'trust',
    num: '07',
    labelEn: '7. Trust & Compliance',
    labelBn: '৭. সাইবার নিরাপত্তা ও আইন',
    descEn: 'Data Privacy, Audit Trails & Encryption',
    descBn: 'তথ্য নিরাপত্তা, অডিট ট্রেইল ও আইনগত সীমানা',
    icon: 'bx-lock-alt',
    tag: 'Security & Legal',
  },
] as const;

export const TrustedInfrastructureSection: React.FC<TrustedInfrastructureSectionProps> = ({
  isBn,
  theme,
}) => {
  const isLight = theme === 'light';

  // Active view tab for the section
  const [activeTab, setActiveTab] = useState<'gov' | 'business' | 'revenue' | 'roi' | 'architecture' | 'pilot' | 'trust'>('gov');
  const contentBoxRef = useRef<HTMLDivElement | null>(null);

  const currentPillarIndex = STRATEGIC_PILLARS.findIndex((p) => p.id === activeTab);
  const currentPillar = STRATEGIC_PILLARS[currentPillarIndex] || STRATEGIC_PILLARS[0];

  // ─────────────────────────────────────────────────────────────
  // INTERACTIVE ROI SCENARIO CALCULATOR STATE
  // ─────────────────────────────────────────────────────────────
  const [monthlyApps, setMonthlyApps] = useState<number>(50); // Monthly applications
  const [baselineHours, setBaselineHours] = useState<number>(18); // Staff hours per file manually
  const [timeReductionPct, setTimeReductionPct] = useState<number>(70); // % time reduction with LandWise
  const [hourlyCostBdt, setHourlyCostBdt] = useState<number>(650); // Hourly cost of officer / legal paralegal in BDT
  const [monthlyPlatformCostBdt, setMonthlyPlatformCostBdt] = useState<number>(45000); // LandWise monthly subscription in BDT

  // Dynamic ROI Calculations
  const roiCalculations = useMemo(() => {
    const totalBaselineHoursMonthly = monthlyApps * baselineHours;
    const hoursSavedMonthly = Math.round(totalBaselineHoursMonthly * (timeReductionPct / 100));
    const grossSavingsMonthlyBdt = hoursSavedMonthly * hourlyCostBdt;
    const netSavingsMonthlyBdt = grossSavingsMonthlyBdt - monthlyPlatformCostBdt;
    const annualizedNetSavingsBdt = netSavingsMonthlyBdt * 12;
    const roiPercentage = monthlyPlatformCostBdt > 0 
      ? Math.round((netSavingsMonthlyBdt / monthlyPlatformCostBdt) * 100) 
      : 0;

    return {
      totalBaselineHoursMonthly,
      hoursSavedMonthly,
      grossSavingsMonthlyBdt,
      netSavingsMonthlyBdt,
      annualizedNetSavingsBdt,
      roiPercentage,
    };
  }, [monthlyApps, baselineHours, timeReductionPct, hourlyCostBdt, monthlyPlatformCostBdt]);

  return (
    <section id="trusted-infrastructure" className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* ── SECTION HEADER & VALUE PROPOSITION ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0EB] dark:bg-[#1E1E1C] border border-[#F3D5C6] dark:border-[#2B2A27] text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <i className="bx bx-buildings text-[#CC5A2B] text-sm" aria-hidden="true" />
          <span>
            {isBn
              ? 'ব্যবসায়িক মূল্যায়ন, সরকারি রূপরেখা ও রাজস্ব কৌশল'
              : 'GOVTECH IMPACT, BUSINESS VALUE & COMMERCIAL VIABILITY'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-semibold tracking-tight text-[#191817] dark:text-[#FAF9F5] leading-tight">
          {isBn ? (
            <>
              বিক্ষিপ্ত রেকর্ড থেকে <span className="text-[#CC5A2B]">বিশ্বস্ত জাতীয় ডিজিটাল অবকাঠামো</span>
            </>
          ) : (
            <>
              From Land Records to <span className="text-[#CC5A2B]">Trusted Digital Infrastructure</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#706E6B] dark:text-[#9E9B95] max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'কীভাবে ল্যান্ডওয়াইজ প্ল্যাটফর্ম প্রাচীন বালাম বই ও হস্তনির্মিত খতিয়ানের ত্রুটি কাটিয়ে সরকার, ব্যাংক, রিয়েল এস্টেট ও নাগরিকদের জন্য একটি নির্ভরযোগ্য, সাশ্রয়ী ও রাজস্বমুখী প্রাতিষ্ঠানিক সমাধান গড়ে তোলে।'
            : 'How LandWise transitions manual record-room bottlenecks, fragmented deeds, and title fraud into high-throughput, evidence-grounded digital infrastructure for government agencies, financial institutions, developers, and citizens.'}
        </p>

        {/* Strategic Pillar Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="px-3 py-1 rounded-[4px] border bg-zinc-50 dark:bg-[#18181B] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300 font-medium">
            🏛️ {isBn ? 'সহকারী কমিশনার (ভূমি) ও সাব-রেজিস্ট্রি সহায়ক' : 'AC Land & Sub-Registry Co-Pilot'}
          </span>
          <span className="px-3 py-1 rounded-[4px] border bg-zinc-50 dark:bg-[#18181B] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300 font-medium">
            🏦 {isBn ? 'ব্যাংক মর্টগেজ ঝুঁকি হ্রাস' : 'Bank Mortgage Risk Mitigation'}
          </span>
          <span className="px-3 py-1 rounded-[4px] border bg-zinc-50 dark:bg-[#18181B] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300 font-medium">
            ⚖️ {isBn ? 'আইনগত সিদ্ধান্ত সহায়তা (অফিসিয়াল বিকল্প নয়)' : 'Decision-Support (Not Statutory Title Proof)'}
          </span>
          <span className="px-3 py-1 rounded-[4px] border bg-zinc-50 dark:bg-[#18181B] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300 font-medium">
            📈 {isBn ? '৮৫%+ স্থূল লাভ মার্জিন' : '85%+ Gross SaaS Margin'}
          </span>
        </div>
      </div>

      {/* ── 2-COLUMN SPLIT: 7 POINTS ON LEFT + DOWNWARD SCROLLING DETAILS BOX ON RIGHT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        
        {/* ── LEFT SIDE: 7 POINTS VERTICAL SELECTION RAIL ── */}
        <aside className="lg:col-span-4 xl:col-span-4 space-y-2 lg:sticky lg:top-24">
          <div className="flex items-center justify-between px-2 py-1 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <i className="bx bx-list-check text-sm text-[#CC5A2B]" />
              <span>{isBn ? "৭টি কৌশলগত স্তম্ভ" : "7 Strategic Pillars"}</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF0EB] dark:bg-[#1E1E1C] text-[#CC5A2B] border border-[#CC5A2B]/20">
              {currentPillarIndex + 1} / {STRATEGIC_PILLARS.length}
            </span>
          </div>

          <div className="space-y-2">
            {STRATEGIC_PILLARS.map((pillar) => {
              const isActive = activeTab === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(pillar.id as any);
                    contentBoxRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3 sm:p-3.5 rounded-[4px] border transition-all flex items-start gap-3 cursor-pointer group relative overflow-hidden ${
                    isActive
                      ? isLight
                        ? "bg-white border-[#CC5A2B] shadow-md text-zinc-950 ring-1 ring-[#CC5A2B]/20"
                        : "bg-[#18181D] border-[#CC5A2B]/60 shadow-lg text-white ring-1 ring-[#CC5A2B]/30"
                      : isLight
                      ? "bg-zinc-50/90 hover:bg-white border-zinc-200/90 hover:border-zinc-300 text-zinc-700"
                      : "bg-[#131317] hover:bg-[#18181D] border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {/* Left Active Accent Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#CC5A2B] rounded-r" />
                  )}

                  {/* Icon Badge */}
                  <div
                    className={`w-9 h-9 rounded-[4px] flex items-center justify-center shrink-0 border text-base transition-colors ${
                      isActive
                        ? "bg-[#FAF0EB] dark:bg-[#2B2A27] text-[#CC5A2B] border-[#F3D5C6] dark:border-[#383632] shadow-xs"
                        : isLight
                        ? "bg-white border-zinc-200 text-zinc-600 group-hover:text-[#CC5A2B] group-hover:border-[#CC5A2B]/40"
                        : "bg-zinc-800/80 border-zinc-700 text-zinc-300 group-hover:text-[#CC5A2B] group-hover:border-zinc-600"
                    }`}
                  >
                    <i className={`bx ${pillar.icon}`} aria-hidden="true" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#CC5A2B]">
                        {pillar.num}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-[#FAF0EB] text-[#CC5A2B] border border-[#F3D5C6] dark:bg-[#2B2A27] dark:text-[#D4A373] dark:border-[#383632]"
                            : isLight
                            ? "bg-zinc-200/70 text-zinc-600"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {pillar.tag}
                      </span>
                    </div>
                    <h4
                      className={`text-xs sm:text-[13px] font-bold leading-tight truncate ${
                        isActive
                          ? "text-[#191817] dark:text-[#FAF9F5]"
                          : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {isBn ? pillar.labelBn : pillar.labelEn}
                    </h4>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-1">
                      {isBn ? pillar.descBn : pillar.descEn}
                    </p>
                  </div>

                  <i
                    className={`bx bx-chevron-right text-lg shrink-0 self-center transition-transform ${
                      isActive
                        ? "text-[#CC5A2B] translate-x-0.5"
                        : "text-zinc-300 dark:text-zinc-600 group-hover:translate-x-0.5"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── RIGHT SIDE: SCROLLING DETAILS BOX (DOWNWARD SCROLL) ── */}
        <div className="lg:col-span-8 xl:col-span-8 rounded-[6px] border border-[#E8E3DA] dark:border-[#2B2A27] bg-white dark:bg-[#111114] shadow-sm overflow-hidden flex flex-col">
          {/* Header of Details Box */}
          <div
            className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
              isLight ? "bg-zinc-50/80 border-zinc-200" : "bg-[#15151A] border-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-[4px] bg-[#FAF0EB] dark:bg-[#1E1E1C] border border-[#CC5A2B]/20 text-[#CC5A2B] flex items-center justify-center shrink-0 text-xl shadow-2xs">
                <i className={`bx ${currentPillar.icon}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC5A2B] font-mono">
                    {isBn ? `পয়েন্ট ${currentPillar.num} / ০৭` : `Point ${currentPillar.num} of 07`}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[#706E6B] dark:text-[#9E9B95] font-medium">
                    {currentPillar.tag}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-serif font-semibold text-[#191817] dark:text-[#FAF9F5] truncate">
                  {isBn ? currentPillar.labelBn : currentPillar.labelEn}
                </h3>
              </div>
            </div>

            {/* Quick Prev / Next Navigator */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={currentPillarIndex === 0}
                onClick={() => {
                  const prev = STRATEGIC_PILLARS[currentPillarIndex - 1];
                  if (prev) {
                    setActiveTab(prev.id as any);
                    contentBoxRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`p-1.5 px-2.5 rounded-[4px] text-xs font-semibold border flex items-center gap-1 transition ${
                  currentPillarIndex === 0
                    ? "opacity-35 cursor-not-allowed bg-transparent border-transparent text-zinc-400"
                    : isLight
                    ? "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700 shadow-2xs"
                    : "bg-[#18181D] hover:bg-zinc-800 border-zinc-700 text-zinc-200"
                }`}
                title="Previous Strategic Point"
              >
                <i className="bx bx-chevron-left text-sm" />
                <span className="hidden sm:inline">{isBn ? "পূর্ববর্তী" : "Prev"}</span>
              </button>

              <button
                type="button"
                disabled={currentPillarIndex === STRATEGIC_PILLARS.length - 1}
                onClick={() => {
                  const next = STRATEGIC_PILLARS[currentPillarIndex + 1];
                  if (next) {
                    setActiveTab(next.id as any);
                    contentBoxRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`p-1.5 px-2.5 rounded-[4px] text-xs font-semibold border flex items-center gap-1 transition ${
                  currentPillarIndex === STRATEGIC_PILLARS.length - 1
                    ? "opacity-35 cursor-not-allowed bg-transparent border-transparent text-zinc-400"
                    : "bg-[#CC5A2B] hover:bg-[#B54E24] text-white border-[#CC5A2B] shadow-2xs font-bold"
                }`}
                title="Next Strategic Point"
              >
                <span className="hidden sm:inline">{isBn ? "পরবর্তী" : "Next"}</span>
                <i className="bx bx-chevron-right text-sm" />
              </button>
            </div>
          </div>

          {/* Scrollable Body: Scrolling Downwards with scrollbar-thin */}
          <div
            ref={contentBoxRef}
            className="p-4 sm:p-6 lg:p-7 overflow-y-auto max-h-[720px] lg:max-h-[820px] scrollbar-thin space-y-6"
          >

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: GOVERNMENT APPLICATIONS & IMPACT
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'gov' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Institutional Role Callout */}
          <div className="p-4 sm:p-5 rounded-[6px] bg-zinc-50 dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-[4px] bg-[#FAF0EB] dark:bg-[#1E1E1C] text-[#CC5A2B] border border-[#CC5A2B]/20 shrink-0 mt-0.5">
                <i className="bx bx-shield-quarter text-xl" />
              </span>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
                  {isBn
                    ? 'সরকারি কর্মকর্তা সহায়তা বনাম আইনি অনুমোদন সীমানা (Assistive AI vs Authoritative Sign-Off)'
                    : 'Clear Operational Boundary: Decision-Support Assistant vs Authoritative Statutory Decision'}
                </h3>
                <p className="text-xs sm:text-sm text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                  {isBn
                    ? 'ল্যান্ডওয়াইজ কোনো অবস্থাতেই সহকারী কমিশনার (ভূমি) বা সাব-রেজিস্ট্রারের বিধিবদ্ধ ক্ষমতা প্রতিস্থাপন করে না। এটি কর্মকর্তাদের জন্য একটি কৃত্রিম বুদ্ধিমত্তা চালিত স্ক্রিনিং কো-পাইলট হিসেবে কাজ করে, যা দলিল, আরএস পর্চা ও দাখিলার গাণিতিক অসঙ্গতি এবং ওয়ারিশান বিচ্ছিন্নতা সেকেন্ডের মধ্যে চিহ্নিত করে কর্মকর্তাদের সিদ্ধান্তের সামনে উপস্থাপন করে।'
                    : 'LandWise never assumes statutory administrative authority or replaces the discretion of Assistant Commissioners (Land), Sub-Registrars, or DLRS Surveyors. It serves as an assistive triage co-pilot—pre-scanning mathematical share divisions, khatian lineage integrity, and duplicate registration alerts so human officers can process legitimate citizen requests faster with complete documentary certainty.'}
                </p>
              </div>
            </div>
          </div>

          {/* 8 Practical GovTech Institutional Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            
            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-[#FAF0EB] dark:bg-[#1E1E1C] border border-[#F3D5C6] dark:border-[#2B2A27] flex items-center justify-center text-[#CC5A2B] font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'ডিজিটাল রেকর্ড সংরক্ষণ ও তাৎক্ষণিক অনুসন্ধান' : 'Digital Record Search & Retrieval'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'সিএস, এসএ, আরএস ও বিএস মৌজা ম্যাপ এবং বালাম বইয়ের জটিল খতিয়ান তাৎক্ষণিকভাবে দাগ নম্বর, মৌজা ও মালিকের নামে সার্চযোগ্য ডেটাসেটে রূপান্তর।'
                  : 'Instant indexed search across CS, SA, RS, and City survey porchas by Mouza J.L., Dag number, or ancestral owner names, eliminating physical record-room searches.'}
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'দলিল ও খতিয়ান স্বয়ংক্রিয় ক্রস-ভেরিফিকেশন' : 'Deed vs Khatian Cross-Reconciliation'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'সাব-রেজিস্ট্রি অফিসে সাফ-কবলা দলিল দাখিল করার সময় প্রস্তাবিত জমির হিস্যা আরএস খতিয়ানের মোট পরিমাণের চেয়ে বেশি কিনা তা তাৎক্ষণিক যাচাই।'
                  : 'Automated 12-field reconciliation verifying whether the draft deed stated land area exceeds the recorded share in the underlying RS Khatian before deed execution.'}
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'ই-নামজারি ওয়ার্কফ্লোতে সহকারী স্ক্রিনিং' : 'e-Mutation Workflow Acceleration'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'উপজেলা ভূমি অফিসে নামজারি রেজিস্টার ৯ ও ডিসিআর যাচাইকালে বিক্রেতার মালিকানা সূত্রে ধারাবাহিকতার বিচ্ছিন্নতা স্বয়ংক্রিয়ভাবে সনাক্ত।'
                  : 'Automated lineage validation during Upazila Land Office e-Mutation hearings, flagging missing succession certificates or unmutated ancestral links.'}
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-700 dark:text-rose-400 font-bold text-sm">
                4
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'দ্বৈত বিক্রি ও জালিয়াতি প্রতিরোধ' : 'Double-Selling & Fraud Red Flag Detection'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'একই দাগ নম্বরে একাধিক অনিবন্ধিত হস্তান্তরের দাবি, ভুয়া দলিল নম্বর বা কর বকেয়া থাকা সম্পত্তির ঝুঁকি চিহ্নিতকরণ।'
                  : 'Algorithmic conflict detection alerting officers to overlapping deed claims on the same Dag or transactions using deceased owner names without probate.'}
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-400 font-bold text-sm">
                5
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'ঐতিহাসিক বালাম বই ডিজিটাইজেশন' : 'Historical Archive OCR & Indexing'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'ক্ষয়িষ্ণু প্রাচীন কাগজ ও হাতে লেখা বাংলা হস্তলিপি থেকে উচ্চ নির্ভুলতার ওসিআর এর মাধ্যমে স্ট্রাকচার্ড ডিজিটাল ডেটাবেজ রূপান্তর।'
                  : 'Domain-tuned OCR pipelines converting brittle handwritten Bengali survey volumes into high-fidelity structured JSON and relational records.'}
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">
                6
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'নাগরিক সেবা স্বচ্ছতা ও আবেদন ট্র্যাকিং' : 'Citizen Land Transparency Portal'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'সাধারণ জমি ক্রেতারা লেনদেনের পূর্বে নিজেরাই দলিলের প্রাথমিক সঙ্গতি স্ক্রিনিং রিপোর্ট ডাউনলোড করে আইনি সেবা গ্রহণ করতে পারে।'
                  : 'Citizen-facing executive dossiers empowering land buyers to inspect preliminary consistency before disbursing life savings, reducing land disputes.'}
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold text-sm">
                7
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'অডিট ট্রেইল ও প্রশাসনিক জবাবদিহিতা' : 'Audit Trails & Anti-Corruption Telemetry'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'প্রতিটি যাচাইকৃত দলিলের জন্য ক্রিপ্টোগ্রাফিক হ্যাশ (SHA-256) ও টাইমস্ট্যাম্প সংরক্ষণ, যা দুর্নীতি ও নথি পরিবর্তনের সুযোগ রোধ করে।'
                  : 'Tamper-evident cryptographic hashes and immutable audit logs capturing every verification request for departmental integrity reviews.'}
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="w-8 h-8 rounded-[4px] bg-[#FAF0EB] dark:bg-[#1E1E1C] border border-[#F3D5C6] dark:border-[#2B2A27] flex items-center justify-center text-[#CC5A2B] font-bold text-sm">
                8
              </div>
              <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                {isBn ? 'সরকারি পোর্টাল ও অনুমোদিত সিস্টেম ইন্টারঅপারেবিলিটি' : 'Interoperability with Gov Portals'}
              </h4>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                {isBn
                  ? 'ভূমি মন্ত্রণালয়ের ই-পর্চা (eporcha.gov.bd), ই-নামজারি ও এলডি ট্যাক্স ডাটাবেজের সাথে স্ট্যান্ডার্ড সুরক্ষিত এপিআই ইন্টিগ্রেশন।'
                  : 'Architected to interface securely with authorized Ministry of Land endpoints (ePorcha, Land Development Tax, DLRS Settlement map).'}
              </p>
            </div>

          </div>

          {/* Workflow Division Matrix (Human vs AI) */}
          <div className="p-5 rounded-[6px] border border-[#E8E3DA] dark:border-[#2B2A27] bg-white dark:bg-[#121215] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              {isBn ? 'দায়িত্ব বণ্টন: এআই সিদ্ধান্ত সহায়তা বনাম সরকারি কর্মকর্তার বিধিবদ্ধ কর্তৃত্ব' : 'Institutional Responsibility Matrix: AI Co-Pilot vs Authorized Government Officer'}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#E8E3DA] dark:border-[#2B2A27]">
                <thead className="bg-zinc-50 dark:bg-[#18181B] font-bold text-zinc-900 dark:text-zinc-200">
                  <tr>
                    <th className="p-3 border-b border-[#E8E3DA] dark:border-[#2B2A27]">Workflow Stage</th>
                    <th className="p-3 border-b border-[#E8E3DA] dark:border-[#2B2A27]">LandWise AI Assistant Role</th>
                    <th className="p-3 border-b border-[#E8E3DA] dark:border-[#2B2A27]">Mandatory Government Authority Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">Document Intake & OCR</td>
                    <td className="p-3">Auto-extracts Dag, Khatian, Owner names, Stated Area, and J.L. numbers with confidence scores.</td>
                    <td className="p-3 text-zinc-500">Record room clerk validates scanned physical document authenticity.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">Title Lineage Reconciliation</td>
                    <td className="p-3">Calculates inheritance shares, matches Dag progression (CS to RS), flags area deficits.</td>
                    <td className="p-3 text-zinc-500">Kanungo / Assistant Commissioner (Land) reviews legal merits of succession.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">Encumbrance & Fraud Check</td>
                    <td className="p-3">Cross-checks database for duplicate deeds, government khash land buffers, and tax payment status.</td>
                    <td className="p-3 text-zinc-500">Sub-Registrar conducts formal Index-II 12-year register search and biometric validation.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">Final Title Certification</td>
                    <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold">Strictly out of scope (Assistive screening only).</td>
                    <td className="p-3 font-bold text-[#CC5A2B]">Exclusive legal domain of Sub-Registrar and AC (Land) with authorized government seal.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: COMMERCIAL BUSINESS APPLICATIONS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'business' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? 'বাণিজ্যিক খাতের চাহিদা ও প্রোপটেক সমাধান' : 'B2B Market Demand & Commercial Applications'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'রিয়েল এস্টেট, বাণিজ্যিক ব্যাংক ও করপোরেট প্রতিষ্ঠানগুলো কেন এই প্ল্যাটফর্ম ব্যবহার করবে এবং সাবস্ক্রিপশন ফি প্রদান করবে।'
                : 'Why real estate developers, banks, legal firms, and surveyors need automated pre-purchase title screening.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Real Estate Developers */}
            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-[#FAF0EB] dark:bg-[#1E1E1C] text-[#CC5A2B] font-bold text-base">
                  <i className="bx bx-buildings" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Real Estate
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5]">Real Estate & Housing Developers</h4>
              <div className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <p><strong>Problem:</strong> Developers risk crores in preliminary token money on parcels with broken inheritance chains or disputed Dag borders.</p>
                <p><strong>LandWise Solution:</strong> Instant title lineage screening, mutation confirmation, and spatial road frontage verification before committing earnest money.</p>
                <p className="text-[#CC5A2B] font-semibold pt-1">
                  <strong>Why They Pay:</strong> Prevents multi-crore legal freezes; speeds up land aggregation by 75%.
                </p>
              </div>
            </div>

            {/* Commercial Banks & NBFIs */}
            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold text-base">
                  <i className="bx bxs-bank" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                  Financial
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5]">Banks & Financial Institutions</h4>
              <div className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <p><strong>Problem:</strong> 30-day turnaround on home loan and industrial mortgage verification; risk of accepting forged deeds as collateral.</p>
                <p><strong>LandWise Solution:</strong> 60-second preliminary collateral screening matching mortgage applicant deed numbers with AC Land mutation records.</p>
                <p className="text-teal-700 dark:text-teal-400 font-semibold pt-1">
                  <strong>Why They Pay:</strong> Drops mortgage processing turnaround from 3 weeks to 3 days, reducing Non-Performing Loan (NPL) exposure.
                </p>
              </div>
            </div>

            {/* Legal Firms & Property Advocates */}
            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-base">
                  <i className="bx bx-briefcase" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                  Legal
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5]">Property Lawyers & Legal Consultants</h4>
              <div className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <p><strong>Problem:</strong> Junior paralegals spend 20+ billable hours manually transcribing handwritten porchas and calculating fractional hissyas.</p>
                <p><strong>LandWise Solution:</strong> Automated chronological title succession visualizer and evidence-grounded preliminary red flag report generator.</p>
                <p className="text-indigo-700 dark:text-indigo-400 font-semibold pt-1">
                  <strong>Why They Pay:</strong> Allows legal firms to take on 4x more client title scrutiny matters without increasing headcount.
                </p>
              </div>
            </div>

            {/* Land Surveyors & Property Consultants */}
            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold text-base">
                  <i className="bx bx-compass" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                  Cadastral
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5]">Surveyors & Cadastral Amins</h4>
              <div className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <p><strong>Problem:</strong> Physical boundary demarcation frequently conflicts with unregistered deeds or government khash land borders.</p>
                <p><strong>LandWise Solution:</strong> Digital Mouza GIS layer alignment, statutory road access width appraisal, and environmental flood buffer checks.</p>
                <p className="text-sky-700 dark:text-sky-400 font-semibold pt-1">
                  <strong>Why They Pay:</strong> Eliminates abortive field measurement trips and boundary demarcation disputes.
                </p>
              </div>
            </div>

            {/* Industrial & Commercial Enterprises */}
            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-base">
                  <i className="bx bxs-factory" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Enterprise
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5]">Industrial Enterprises & SEZs</h4>
              <div className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <p><strong>Problem:</strong> Aggregating 50+ contiguous rural plots for a factory; 1 defective plot can paralyze a 100-Crore industrial project.</p>
                <p><strong>LandWise Solution:</strong> Batch document reconciliation engine verifying land continuity, zoning classifications, and acquisition notices.</p>
                <p className="text-amber-700 dark:text-amber-400 font-semibold pt-1">
                  <strong>Why They Pay:</strong> Risk-managed corporate due diligence for Board of Directors and institutional investment committees.
                </p>
              </div>
            </div>

            {/* PropTech Portals & Marketplaces */}
            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-[4px] bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold text-base">
                  <i className="bx bx-store-alt" />
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                  Marketplaces
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5]">Property Marketplaces & Portals</h4>
              <div className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <p><strong>Problem:</strong> Buyer skepticism regarding property listings on portals due to fears of ghost plots and fake title sellers.</p>
                <p><strong>LandWise Solution:</strong> "LandWise Verified Document Badge" API embedded directly into online marketplace property cards.</p>
                <p className="text-purple-700 dark:text-purple-400 font-semibold pt-1">
                  <strong>Why They Pay:</strong> Boosts listing inquiries by 3x by establishing verified buyer trust.
                </p>
              </div>
            </div>

          </div>

          <div className="p-4 rounded-[4px] bg-zinc-100 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] text-[11px] text-[#706E6B] dark:text-[#9E9B95] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
              <i className="bx bx-info-circle text-sm text-[#CC5A2B]" />
              <span>Commercial Boundary Notice:</span>
            </span>
            <span>Commercial customers use LandWise as a preliminary automated filter. Formal legal opinions from licensed Advocates remain standard prior to disbursing investment funds.</span>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: HOW WE MAKE MONEY (REVENUE MODEL & PACKAGES)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'revenue' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? 'বাণিজ্যিক প্যাকেজ ও আর্থিক মডেল' : 'Commercial Packages & Revenue Architecture'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'স্বচ্ছ ইউনিট ইকোনমিক্স ও স্পষ্ট ব্যবসায়িক অনুমান (সকল মূল্য দৃষ্টান্তমূলক অনুমান, চূড়ান্ত চুক্তিভেদে পরিবর্তনশীল)'
                : 'Transparent unit economics and commercial packages. (Illustrative estimates based on market benchmarks).'}
            </p>
          </div>

          {/* 3 Commercial Pricing Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            {/* Starter Package */}
            <div className="p-6 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-zinc-500">Starter Tier</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300">
                    Boutique Law Firms
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#191817] dark:text-[#FAF9F5]">৳ 15,000</div>
                  <div className="text-[11px] text-zinc-500">per month (billed annually or monthly)</div>
                </div>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-2 text-[#706E6B] dark:text-[#9E9B95]">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span><strong>25 Document Reconciliations</strong> / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>12-Field Statutory Audit Matrix</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>Official Executive PDF Export</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>2 Authorized Legal Team Seats</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-[11px]">
                <div className="text-zinc-500"><strong>Customer ROI:</strong> Saves ~40 paralegal search hours (valued at &gt;৳25,000).</div>
                <div className="text-zinc-400"><strong>Direct Service Cost:</strong> ~৳3,200/mo (OCR tokens &amp; cloud server).</div>
              </div>
            </div>

            {/* Professional Package */}
            <div className="p-6 rounded-[6px] border-2 border-[#CC5A2B] bg-[#FAF0EB]/40 dark:bg-[#1E1E1C] space-y-4 flex flex-col justify-between shadow-md relative">
              <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#CC5A2B] text-white shadow-xs">
                Most Popular
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#CC5A2B] dark:text-[#E89E78]">Professional Tier</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF0EB] text-[#CC5A2B] border border-[#F3D5C6] dark:bg-[#2B2A27] dark:text-[#D4A373] dark:border-[#383632]">
                    Developers &amp; Banks
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#191817] dark:text-[#FAF9F5]">৳ 65,000</div>
                  <div className="text-[11px] text-zinc-500">per month (recommended commercial pilot)</div>
                </div>
                <div className="border-t border-[#E8E3DA] dark:border-[#2B2A27] pt-3 space-y-2 text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span><strong>150 Document Reconciliations</strong> / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>Full Chain-of-Title Visualizer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>Spatial &amp; Environmental Hazard Matrix</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>10 User Seats &amp; Priority Help Desk</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E3DA] dark:border-[#2B2A27] space-y-1.5 text-[11px]">
                <div className="text-[#706E6B] dark:text-[#9E9B95]"><strong>Customer ROI:</strong> Prevents a single faulty earnest money deposit (worth lakhs) while cutting mortgage verification by 70%.</div>
                <div className="text-zinc-400"><strong>Direct Service Cost:</strong> ~৳13,500/mo (OCR compute, storage &amp; bandwidth).</div>
              </div>
            </div>

            {/* Enterprise / GovTech Tier */}
            <div className="p-6 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-zinc-500">Enterprise / GovTech</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300">
                    Institutions &amp; SEZs
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-black text-[#191817] dark:text-[#FAF9F5]">৳ 2,25,000+</div>
                  <div className="text-[11px] text-zinc-500">custom SLA contract or annual deployment</div>
                </div>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-2 text-[#706E6B] dark:text-[#9E9B95]">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span><strong>Unlimited Volume Scrutiny</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>Dedicated Private Cloud or On-Premises Host</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>Custom Core-Banking / Gov API Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-check text-[#CC5A2B] text-sm font-bold" />
                    <span>Role-Based Access Control &amp; 99.9% SLA</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 text-[11px]">
                <div className="text-zinc-500"><strong>Customer ROI:</strong> Safeguards 100+ Crore BDT industrial land portfolios.</div>
                <div className="text-zinc-400"><strong>Direct Service Cost:</strong> ~৳45,000/mo (High availability &amp; dedicated support).</div>
              </div>
            </div>

          </div>

          {/* Unit Economics & Break-Even Scenario Box */}
          <div className="p-6 rounded-[6px] border border-[#E8E3DA] dark:border-[#2B2A27] bg-zinc-50 dark:bg-[#121215] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <i className="bx bx-pie-chart-alt-2 text-[#CC5A2B] text-base" />
              <span>Unit Economics &amp; Break-Even Feasibility (Illustrative Financial Projection)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Unit Economics per Verification</span>
                <div className="text-xl font-black text-[#191817] dark:text-[#FAF9F5]">৳ 515 Net Margin (86%)</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  B2B average revenue per document check: ৳600. Direct cloud compute &amp; OCR inference cost: ~৳85.
                </p>
              </div>

              <div className="p-4 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Fixed Operating Overhead</span>
                <div className="text-xl font-black text-[#191817] dark:text-[#FAF9F5]">৳ 4,50,000 / month</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Assumes 3 Full-Stack/AI Engineers, 1 Legal Domain Analyst, Server Cluster, and Security Audits.
                </p>
              </div>

              <div className="p-4 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Break-Even Threshold</span>
                <div className="text-xl font-black text-[#CC5A2B]">10–11 Professional Accounts</div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Break-even achievable with only 11 active mid-tier developers or 800 transaction-based corporate verifications.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 italic">
              *Disclaimer: Financial metrics and pricing tiers represent illustrative engineering and product models for the LandTech Hackathon evaluation. Actual commercial contracts will depend on procurement requirements, data volume, and pilot deployment agreements.
            </p>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: MEASURE THE IMPACT & INTERACTIVE ROI CALCULATOR
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'roi' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? 'কর্মক্ষমতা মূল্যায়ন ও ইন্টারেক্টিভ আরওআই ক্যালকুলেটর' : 'Workflow Efficiency Comparison & Interactive ROI Calculator'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'আপনার প্রতিষ্ঠানের মাসিক ফাইলের সংখ্যা ও শ্রম ব্যয় অনুযায়ী বাস্তবসম্মত সময় ও আর্থিক সাশ্রয় হিসাব করুন।'
                : 'Adjust the operational parameters below to model real-world time savings, staff hour reductions, and financial return.'}
            </p>
          </div>

          {/* Side-by-Side Workflow Comparison Table */}
          <div className="overflow-x-auto border border-[#E8E3DA] dark:border-[#2B2A27] rounded-[6px] bg-white dark:bg-[#121215]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-50 dark:bg-[#18181B] font-bold text-zinc-900 dark:text-zinc-200 border-b border-[#E8E3DA] dark:border-[#2B2A27]">
                <tr>
                  <th className="p-3.5">Performance Dimension</th>
                  <th className="p-3.5 text-rose-700 dark:text-rose-400">Conventional Manual Review</th>
                  <th className="p-3.5 text-[#CC5A2B]">LandWise AI-Assisted Review</th>
                  <th className="p-3.5 text-[#191817] dark:text-[#FAF9F5]">Operational Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr>
                  <td className="p-3.5 font-bold text-[#191817] dark:text-[#FAF9F5]">Average Turnaround Time</td>
                  <td className="p-3.5 text-[#706E6B] dark:text-[#9E9B95]">14 to 30 Business Days</td>
                  <td className="p-3.5 font-bold text-[#CC5A2B]">Under 24 to 48 Hours</td>
                  <td className="p-3.5 font-semibold text-[#CC5A2B]">85%+ Cycle Time Drop</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#191817] dark:text-[#FAF9F5]">Staff Labor per Application</td>
                  <td className="p-3.5 text-[#706E6B] dark:text-[#9E9B95]">16 to 24 Hours (Paralegal + Amin)</td>
                  <td className="p-3.5 font-bold text-[#CC5A2B]">3 to 5 Hours (Review &amp; Validate)</td>
                  <td className="p-3.5 font-semibold text-[#CC5A2B]">70% to 75% Labor Saved</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#191817] dark:text-[#FAF9F5]">Internal Cost per File</td>
                  <td className="p-3.5 text-[#706E6B] dark:text-[#9E9B95]">৳ 10,000 – ৳ 16,000 (Time &amp; travel)</td>
                  <td className="p-3.5 font-bold text-[#CC5A2B]">৳ 2,000 – ৳ 3,500 (Platform + verification)</td>
                  <td className="p-3.5 font-semibold text-[#CC5A2B]">~65% Processing Cost Reduction</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#191817] dark:text-[#FAF9F5]">Historical Archive Retrieval</td>
                  <td className="p-3.5 text-[#706E6B] dark:text-[#9E9B95]">3 to 7 Days in District Record Rooms</td>
                  <td className="p-3.5 font-bold text-[#CC5A2B]">Under 15 Seconds (Digitized index)</td>
                  <td className="p-3.5 font-semibold text-[#CC5A2B]">Immediate Search Access</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#191817] dark:text-[#FAF9F5]">Area Math &amp; Dag Consistency</td>
                  <td className="p-3.5 text-[#706E6B] dark:text-[#9E9B95]">Manual calculation prone to fatigue</td>
                  <td className="p-3.5 font-bold text-[#CC5A2B]">Algorithmic 100% share verification</td>
                  <td className="p-3.5 font-semibold text-[#CC5A2B]">Zero Mathematical Slip-ups</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#191817] dark:text-[#FAF9F5]">Auditability &amp; Traceability</td>
                  <td className="p-3.5 text-[#706E6B] dark:text-[#9E9B95]">Loose paper notes &amp; ledger files</td>
                  <td className="p-3.5 font-bold text-[#CC5A2B]">Cryptographic SHA-256 audit log</td>
                  <td className="p-3.5 font-semibold text-[#CC5A2B]">Permanent Chain Integrity</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive Calculator Workbench */}
          <div className="p-6 rounded-[6px] border border-[#E8E3DA] dark:border-[#2B2A27] bg-zinc-50 dark:bg-[#121215] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E3DA] dark:border-[#2B2A27] pb-4">
              <div>
                <h4 className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5] flex items-center gap-2">
                  <i className="bx bx-slider-alt text-[#CC5A2B] text-lg" />
                  <span>Interactive Scenario Calculator (Model Your Savings)</span>
                </h4>
                <p className="text-xs text-zinc-500">Adjust the parameters to estimate your organization's exact monthly return.</p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#FAF0EB] text-[#CC5A2B] border border-[#F3D5C6] dark:bg-[#2B2A27] dark:text-[#D4A373] dark:border-[#383632]">
                Editable Model
              </span>
            </div>

            {/* Input Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              
              {/* Slider 1: Monthly Applications */}
              <div className="space-y-2 p-3.5 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">Monthly Land Files Processed</label>
                  <span className="font-mono font-bold text-[#CC5A2B]">{monthlyApps} files</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={monthlyApps}
                  onChange={(e) => setMonthlyApps(Number(e.target.value))}
                  className="w-full accent-[#CC5A2B] cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block">Deed, mortgage, or mutation files per month.</span>
              </div>

              {/* Slider 2: Baseline Hours */}
              <div className="space-y-2 p-3.5 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">Manual Hours per File (Baseline)</label>
                  <span className="font-mono font-bold text-[#CC5A2B]">{baselineHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="40"
                  step="1"
                  value={baselineHours}
                  onChange={(e) => setBaselineHours(Number(e.target.value))}
                  className="w-full accent-[#CC5A2B] cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block">Paralegal, clerk, and amin search hours.</span>
              </div>

              {/* Slider 3: Time Reduction % */}
              <div className="space-y-2 p-3.5 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">Expected Time Reduction</label>
                  <span className="font-mono font-bold text-[#CC5A2B]">{timeReductionPct}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="5"
                  value={timeReductionPct}
                  onChange={(e) => setTimeReductionPct(Number(e.target.value))}
                  className="w-full accent-[#CC5A2B] cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block">Conservative pilot expectation: 60% – 75%.</span>
              </div>

              {/* Slider 4: Hourly Staff Cost */}
              <div className="space-y-2 p-3.5 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">Avg Staff Cost / Hour (BDT)</label>
                  <span className="font-mono font-bold text-[#CC5A2B]">৳ {hourlyCostBdt}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2000"
                  step="50"
                  value={hourlyCostBdt}
                  onChange={(e) => setHourlyCostBdt(Number(e.target.value))}
                  className="w-full accent-[#CC5A2B] cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block">Blended hourly rate of staff &amp; legal reviewers.</span>
              </div>

              {/* Slider 5: Monthly Platform Cost */}
              <div className="space-y-2 p-3.5 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-zinc-800 dark:text-zinc-200">Monthly Platform Cost (BDT)</label>
                  <span className="font-mono font-bold text-[#CC5A2B]">৳ {monthlyPlatformCostBdt.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="225000"
                  step="5000"
                  value={monthlyPlatformCostBdt}
                  onChange={(e) => setMonthlyPlatformCostBdt(Number(e.target.value))}
                  className="w-full accent-[#CC5A2B] cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block">Subscription tier cost in BDT.</span>
              </div>

              {/* Quick Reset */}
              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Reset Benchmark</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Return parameters to standard medium-enterprise baseline.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMonthlyApps(50);
                    setBaselineHours(18);
                    setTimeReductionPct(70);
                    setHourlyCostBdt(650);
                    setMonthlyPlatformCostBdt(45000);
                  }}
                  className="mt-2 py-1.5 px-3 rounded-[4px] text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

            </div>

            {/* Real-time Computed KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] text-center">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Monthly Hours Saved</span>
                <span className="text-2xl font-black text-[#CC5A2B] block mt-1">
                  {roiCalculations.hoursSavedMonthly.toLocaleString('en-IN')} hrs
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Staff labor freed up</span>
              </div>

              <div className="p-4 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] text-center">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Gross Labor Savings</span>
                <span className="text-2xl font-black text-[#191817] dark:text-[#FAF9F5] block mt-1">
                  ৳ {roiCalculations.grossSavingsMonthlyBdt.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Valued at standard rate</span>
              </div>

              <div className="p-4 rounded-[4px] bg-[#FAF0EB] dark:bg-[#1E1E1C] border border-[#F3D5C6] dark:border-[#2B2A27] text-center">
                <span className="text-[10px] font-bold uppercase text-[#CC5A2B] dark:text-[#E89E78] block">Net Monthly Value</span>
                <span className="text-2xl font-black text-[#CC5A2B] dark:text-[#E89E78] block mt-1">
                  ৳ {roiCalculations.netSavingsMonthlyBdt.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">After subscription cost</span>
              </div>

              <div className="p-4 rounded-[4px] bg-white dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] text-center">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Estimated ROI</span>
                <span className="text-2xl font-black text-[#CC5A2B] block mt-1">
                  {roiCalculations.roiPercentage}%
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block">Return on tech spend</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 text-center italic">
              Note: Time and financial savings projections are modeled estimates for pilot feasibility planning. Fraud prevention and document reliability are independent metrics evaluated during supervised pilot verification.
            </p>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: FUTURE-PROOF ARCHITECTURE & RISK MITIGATION
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'architecture' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? 'দীর্ঘমেয়াদী প্রযুক্তিগত রূপরেখা ও বাস্তবমুখী দর্শন' : 'Built for the Future of Land Administration'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'হাইপ ও অযাচিত বাজওয়ার্ড এড়িয়ে কীভাবে বাস্তবমুখী প্রযুক্তিগত সমাধান ও সাইবার ঝুঁকি মোকাবেলা করা হয়েছে।'
                : 'A pragmatic GovTech philosophy: selecting proven technologies over speculative trends with clear risk mitigations.'}
            </p>
          </div>

          {/* Architectural Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                <i className="bx bx-text text-[#CC5A2B] text-base" />
                <span>Specialized Bangla Land OCR</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Trained specifically on historical Bengali cursive numeral forms (১, ২, ৪, ৮), fractional anna-ganda units, and non-standard layout alignments found across CS, SA, and RS formats.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                <i className="bx bx-git-repo-forked text-teal-600 text-base" />
                <span>Cadastral Entity Resolution Graph</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Connects fragmented Khatians, inheritance deeds, and mutation cases into a directional graph, tracing ownership from colonial records to modern e-Mutation IDs.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                <i className="bx bx-user-check text-indigo-600 text-base" />
                <span>Human-in-the-Loop Confidence Gates</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Any OCR extraction scoring below an 85% statistical confidence threshold is automatically routed to an authorized officer verification queue before record ingestion.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                <i className="bx bx-fingerprint text-purple-600 text-base" />
                <span>Tamper-Evident SHA-256 Hashes</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Cryptographic document hashing creates an indelible digital fingerprint for each audited file, ensuring that even a single character altered in a deed is caught immediately.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                <i className="bx bx-cloud text-sky-600 text-base" />
                <span>Deployment Sovereignty (Cloud &amp; On-Prem)</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Supports sovereign deployment on the Bangladesh Computer Council (BCC) National Data Center, air-gapped District Record Rooms, or multi-tenant commercial cloud.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                <i className="bx bx-map-pin text-amber-600 text-base" />
                <span>Spatial Cadastral GIS Integration</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Interoperable with DLRS certified polygon shapefiles, verifying statutory road frontage, river erosion buffers, and proximity to state-owned khash reserves.
              </p>
            </div>

          </div>

          {/* Pragmatic GovTech Philosophy (Why Not Blockchain for everything?) */}
          <div className="p-5 rounded-[6px] border border-[#E8E3DA] dark:border-[#2B2A27] bg-zinc-50 dark:bg-[#121215] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Pragmatic GovTech Engineering: Justifying Technologies vs Avoiding Buzzwords
            </h4>
            <p className="text-xs text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
              In public land administration, adopting speculative distributed ledger tokens or unproven decentralized schemes introduces severe legal, throughput, and governance bottlenecks. LandWise relies on proven enterprise relational databases (PostgreSQL/PostGIS) paired with deterministic cryptographic state hashing (SHA-256) and RESTful API microservices. This delivers sub-second query performance, full legal compliance with the Evidence Act, and seamless backward-compatibility with Bangladesh's existing e-Mutation and DLRS infrastructure.
            </p>
          </div>

          {/* Risk & Mitigation Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Comprehensive Technology &amp; Operational Risk Mitigation Matrix
            </h4>
            <div className="overflow-x-auto border border-[#E8E3DA] dark:border-[#2B2A27] rounded-[4px] bg-white dark:bg-[#121215]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-zinc-50 dark:bg-[#18181B] font-bold text-zinc-900 dark:text-zinc-200 border-b border-[#E8E3DA] dark:border-[#2B2A27]">
                  <tr>
                    <th className="p-3">Risk Factor</th>
                    <th className="p-3">Potential Severity</th>
                    <th className="p-3">Specific Mitigation Strategy in LandWise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">OCR Errors on Brittle / Water-Damaged Porchas</td>
                    <td className="p-3 text-amber-700 dark:text-amber-400 font-bold">High</td>
                    <td className="p-3">Automated contrast enhancement pre-processing + mandatory human-in-the-loop validation queue for extractions below 85% confidence.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">Statutory &amp; Regulatory Shifts (e.g. Land Crime Act 2023)</td>
                    <td className="p-3 text-amber-700 dark:text-amber-400 font-bold">Medium</td>
                    <td className="p-3">Decoupled statutory rules engine with versioned compliance rulepacks, allowing instant legal logic updates without rewriting core microservices.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">Cybersecurity &amp; Unauthorized Data Access</td>
                    <td className="p-3 text-rose-700 dark:text-rose-400 font-bold">Critical</td>
                    <td className="p-3">End-to-end TLS 1.3 in transit, AES-256 encryption at rest, strict Role-Based Access Control (RBAC), and sovereign data residency inside Bangladesh.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#191817] dark:text-[#FAF9F5]">Vendor Lock-In for Government Departments</td>
                    <td className="p-3 text-[#706E6B] dark:text-[#9E9B95] font-bold">Medium</td>
                    <td className="p-3">Open-standard data formats (GeoJSON, standard SQL, exportable JSON/Markdown dossiers) ensuring complete data portability for government agencies.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 6: PILOT FRAMEWORK & HACKATHON JUDGE PITCH
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'pilot' && (
        <div className="space-y-8 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? 'পাইলট রূপরেখা ও বিচারকমণ্ডলীর ১০টি প্রশ্নের উত্তর' : 'Supervised Pilot Proposal & Hackathon Judge Executive Summary'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'বাস্তবসম্মত ৩-পর্যায়ের রোডম্যাপ এবং বাণিজ্যিক ও সরকারি সম্ভাব্যতা যাচাই।'
                : 'Actionable 3-stage deployment path and direct answers to the critical hackathon questions.'}
            </p>
          </div>

          {/* 3-Stage Go-To-Market Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-[#CC5A2B]">Stage 1</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  CURRENT STATUS
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#191817] dark:text-[#FAF9F5]">Working Functional Prototype</h4>
              <ul className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <li>• Client-side Cadastral Graph for all 64 districts.</li>
                <li>• 12-Field cross-verification matrix (Deed vs Khatian vs Mutation).</li>
                <li>• Interactive Dag share calculator &amp; spatial hazard scanner.</li>
                <li>• Professional executive dossier PDF export.</li>
              </ul>
            </div>

            <div className="p-5 rounded-[6px] border-2 border-[#CC5A2B] bg-[#FAF0EB]/40 dark:bg-[#1E1E1C] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-[#CC5A2B] dark:text-[#E89E78]">Stage 2</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#CC5A2B] text-white">
                  NEXT 3–6 MONTHS
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#191817] dark:text-[#FAF9F5]">Supervised Institutional Pilot</h4>
              <ul className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
                <li>• Supervised trial with 2 pilot Upazila Land Offices (e.g. Savar &amp; Patiya).</li>
                <li>• Test 150 historical anonymized deeds against official records.</li>
                <li>• Measure F1-score on discrepancy detection with AC Land officers.</li>
                <li>• Private pilot with 2 commercial real estate developers.</li>
              </ul>
            </div>

            <div className="p-5 rounded-[6px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-zinc-500">Stage 3</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300">
                  MONTHS 6–18
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#191817] dark:text-[#FAF9F5]">Commercial SaaS &amp; Gov Licensing</h4>
              <ul className="space-y-1.5 text-[#706E6B] dark:text-[#9E9B95]">
                <li>• Formal cybersecurity penetration testing &amp; ISO 27001 audit.</li>
                <li>• Official Ministry of Land procurement / GovTech SLA agreement.</li>
                <li>• B2B mortgage verification API integration with commercial banks.</li>
                <li>• National expansion across divisional hubs.</li>
              </ul>
            </div>
          </div>

          {/* 10 Core Hackathon Judge Questions Answered Rapidly */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <i className="bx bx-help-circle text-[#CC5A2B] text-base" />
              <span>Executive Briefing: The 10 Critical Hackathon Questions Answered</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              
              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">1. What real problem does this solve?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">Fragmented, handwritten, paper-heavy land records in Bangladesh lead to fraudulent double-selling, Dag area deficits, and multi-year legal disputes that paralyze property markets.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">2. Who needs it?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">Assistant Commissioners (Land), Sub-Registrars, real estate developers, commercial bank credit teams, property advocates, and citizens purchasing land.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">3. Who pays for it?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">Real estate developers and commercial banks (monthly B2B subscriptions); legal firms and property consultants (SaaS tiers); government offices via GovTech maintenance contracts.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">4. Why would they pay?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">It prevents multi-crore legal hold-ups on property deals, shrinks mortgage document processing from 3 weeks to 3 days, and frees up 70% of staff search hours.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">5. How does it save time and money?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">Replaces weeks of manual record-room searches with an instant 12-field cross-reconciliation graph, reducing labor costs from ৳12,000+ per file to under ৳3,000.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">6. How can the government adopt it?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">As a non-intrusive decision-support co-pilot for AC Land mutation hearings and Sub-Registry verification without altering the statutory authority of officers.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">7. What makes it scalable?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">Client-first and containerized microservices architecture with cloud/on-prem flexibility, capable of indexing all 64 districts with zero hardware re-investment.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">8. What makes it difficult to replace?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">Deep domain specialization in Bangladesh cadastral nuances: CS/SA/RS survey succession, Bengali anna-ganda fractional hissyas, and the Land Crime Act 2023 legal rules engine.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">9. How will its impact be measured?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">Quantitative metrics: Reduction in turnaround time (days), percentage of undetected area discrepancies caught prior to deed registration, and staff hours saved.</p>
              </div>

              <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#121215] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <div className="font-bold text-[#191817] dark:text-[#FAF9F5]">10. What needs to happen before real-world deployment?</div>
                <p className="text-[#706E6B] dark:text-[#9E9B95]">A controlled, supervised 6-week pilot with 100 historical anonymized cases at a designated Upazila, followed by independent security audits and Ministry of Land API agreements.</p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 7: TRUST, PRIVACY & LEGAL COMPLIANCE
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'trust' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? 'তথ্য নিরাপত্তা, প্রাইভেসী ও আইনি সম্মতি' : 'Trust, Cybersecurity & Statutory Legal Compliance'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'সংবেদনশীল জমির স্বত্ব ও আর্থিক নথিপত্রের জন্য বিশ্বমানের নিরাপত্তা প্রটোকল।'
                : 'Robust data governance, encryption standards, and alignment with Bangladesh land statutes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            
            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#191817] dark:text-[#FAF9F5]">
                <i className="bx bx-lock-alt text-[#CC5A2B] text-base" />
                <span>End-to-End Encryption</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                All document uploads and extracted metadata are secured using AES-256 at rest and TLS 1.3 in transit.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#191817] dark:text-[#FAF9F5]">
                <i className="bx bx-user-pin text-teal-600 text-base" />
                <span>Role-Based Access Control</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Strict multi-tenant privilege separation ensuring client land records are isolated from other accounts.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#191817] dark:text-[#FAF9F5]">
                <i className="bx bx-history text-indigo-600 text-base" />
                <span>Immutable Audit Trails</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Every screening request generates a cryptographically signed SHA-256 hash log preventing tampering.
              </p>
            </div>

            <div className="p-4 rounded-[4px] border bg-white dark:bg-[#121215] border-[#E8E3DA] dark:border-[#2B2A27] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#191817] dark:text-[#FAF9F5]">
                <i className="bx bx-trash text-purple-600 text-base" />
                <span>Data Minimization</span>
              </div>
              <p className="text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                Uploaded document files are processed transiently; extracted data retention is governed by client policy.
              </p>
            </div>

          </div>

          {/* Bangladesh Legal Statutes Alignment */}
          <div className="p-5 rounded-[6px] border border-[#E8E3DA] dark:border-[#2B2A27] bg-white dark:bg-[#121215] space-y-3 text-xs">
            <h4 className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm flex items-center gap-2">
              <i className="bx bx-book-bookmark text-[#CC5A2B] text-base" />
              <span>Alignment with Statutory Bangladesh Land &amp; Cyber Laws</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#706E6B] dark:text-[#9E9B95]">
              <div className="p-3 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <strong className="text-[#191817] dark:text-[#FAF9F5] block">Registration Act 1908 (Section 17 &amp; 49):</strong>
                <span>Supports strict pre-verification of compulsorily registrable deeds and volume reference indexing.</span>
              </div>
              <div className="p-3 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <strong className="text-[#191817] dark:text-[#FAF9F5] block">State Acquisition and Tenancy Act 1950 (Section 143/144):</strong>
                <span>Ensures mutation lineage consistency and valid updating of Record of Rights (Porcha).</span>
              </div>
              <div className="p-3 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <strong className="text-[#191817] dark:text-[#FAF9F5] block">Land Crime Prevention and Redress Act 2023:</strong>
                <span>Identifies illegal multi-selling, fraudulent deed fabrication, and land grabbing patterns.</span>
              </div>
              <div className="p-3 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-1">
                <strong className="text-[#191817] dark:text-[#FAF9F5] block">Cyber Security Act 2023 &amp; National Data Protection Rules:</strong>
                <span>Upholds national sovereign data boundaries, privacy rights, and encrypted public record transit.</span>
              </div>
            </div>
          </div>

          {/* Mandatory Statutory Legal Disclaimer */}
          <div className="p-4 rounded-[4px] bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
              <i className="bx bx-award text-amber-600 text-base" aria-hidden="true" />
              <span>Mandatory Statutory Pre-Purchase Verification Disclaimer:</span>
            </div>
            <p>
              LandWise is an assistive pre-purchase title &amp; spatial verification screening engine. It does not certify official title ownership, declare criminal fraud, or substitute for formal searches at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms. Prospective purchasers must engage a qualified Advocate / Legal Professional prior to executing contracts or disbursing funds.
            </p>
          </div>

        </div>
      )}

          </div>
        </div>
      </div>

    </section>
  );
};
