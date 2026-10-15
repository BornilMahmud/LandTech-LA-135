import React, { useState, useMemo } from 'react';
import {
  SAMPLE_KHATIAN_SCANS,
  SAMPLE_CRYPTO_DEEDS,
  SAMPLE_FRAUD_CONFLICTS,
  EMUTATION_PIPELINE_STAGES,
  TARGET_SECTOR_ROLES,
  SampleKhatianScan,
  CryptographicDeedSample,
  DoubleSellingConflictCase,
} from '../../data/landtechHackathonData';

interface LandTech2026SuiteProps {
  isBn: boolean;
  theme: 'dark' | 'light';
}

// Simple deterministic SHA-256 helper for client-side cryptographic deed hashing demonstration
async function generateSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const LandTech2026Suite: React.FC<LandTech2026SuiteProps> = ({ isBn, theme }) => {
  const isLight = theme === 'light';

  // Active Problem Track Tab
  const [activeTab, setActiveTab] = useState<'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'sectors'>('p1');

  // ─────────────────────────────────────────────────────────────
  // P1: DIGITIZER STATE
  // ─────────────────────────────────────────────────────────────
  const [selectedKhatianId, setSelectedKhatianId] = useState<string>(SAMPLE_KHATIAN_SCANS[0].id);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<SampleKhatianScan>(SAMPLE_KHATIAN_SCANS[0]);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const handleSimulateOcr = (khatian: SampleKhatianScan) => {
    setSelectedKhatianId(khatian.id);
    setIsOcrProcessing(true);
    setTimeout(() => {
      setExtractedData(khatian);
      setIsOcrProcessing(false);
    }, 600);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // ─────────────────────────────────────────────────────────────
  // P2: CRYPTO VERIFIER STATE
  // ─────────────────────────────────────────────────────────────
  const [selectedCryptoDeed, setSelectedCryptoDeed] = useState<CryptographicDeedSample>(SAMPLE_CRYPTO_DEEDS[0]);
  const [deedFormArea, setDeedFormArea] = useState<number>(SAMPLE_CRYPTO_DEEDS[0].areaDecimals);
  const [deedFormDag, setDeedFormDag] = useState<string>(SAMPLE_CRYPTO_DEEDS[0].dagNo);
  const [computedHash, setComputedHash] = useState<string>(SAMPLE_CRYPTO_DEEDS[0].genesisHash);
  const [isHashMismatch, setIsHashMismatch] = useState<boolean>(false);

  const handleRecomputeHash = async (area: number, dag: string) => {
    setDeedFormArea(area);
    setDeedFormDag(dag);
    const payload = `${selectedCryptoDeed.deedNo}|${selectedCryptoDeed.deedYear}|${selectedCryptoDeed.sellerNid}|${selectedCryptoDeed.buyerNid}|${dag}|${area}`;
    const newHash = await generateSha256(payload);
    setComputedHash(newHash);
    setIsHashMismatch(newHash !== selectedCryptoDeed.genesisHash);
  };

  const handleSelectCryptoDeed = (deed: CryptographicDeedSample) => {
    setSelectedCryptoDeed(deed);
    setDeedFormArea(deed.areaDecimals);
    setDeedFormDag(deed.dagNo);
    setComputedHash(deed.genesisHash);
    setIsHashMismatch(deed.isTampered);
  };

  // ─────────────────────────────────────────────────────────────
  // P3: DOUBLE-SELLING / FRAUD STATE
  // ─────────────────────────────────────────────────────────────
  const [selectedFraudCaseId, setSelectedFraudCaseId] = useState<string>(SAMPLE_FRAUD_CONFLICTS[0].id);
  const activeFraudCase = useMemo(() => {
    return SAMPLE_FRAUD_CONFLICTS.find((c) => c.id === selectedFraudCaseId) || SAMPLE_FRAUD_CONFLICTS[0];
  }, [selectedFraudCaseId]);

  // ─────────────────────────────────────────────────────────────
  // P4: SMART E-MUTATION STATE
  // ─────────────────────────────────────────────────────────────
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('EM-2024-910243');
  const totalGovFee = EMUTATION_PIPELINE_STAGES.reduce((acc, curr) => acc + curr.statutoryFeeBDT, 0);

  // ─────────────────────────────────────────────────────────────
  // P5: CHECK BEFORE YOU BUY STATE
  // ─────────────────────────────────────────────────────────────
  const [citizenChecklist, setCitizenChecklist] = useState({
    titleChainContinuity: true,
    sellerMutationCompleted: true,
    taxClearanceUpdated: true,
    khasOrAcquisitionFree: true,
    courtCaseFree: true,
    boundaryPhysicalMatch: false,
  });

  const passedChecksCount = Object.values(citizenChecklist).filter(Boolean).length;
  const feasibilityPercentage = Math.round((passedChecksCount / 6) * 100);

  const getFeasibilityVerdict = () => {
    if (feasibilityPercentage === 100) {
      return {
        labelEn: 'Green Signal — Low Risk Pre-Purchase',
        labelBn: 'সবুজ সংকেত — ঝুঁকিমুক্ত ও ক্রয়যোগ্য',
        badgeClass: 'bg-emerald-500/15 text-[#CC5A2B] border-emerald-500/30',
        icon: 'bx-check-shield',
      };
    }
    if (feasibilityPercentage >= 65) {
      return {
        labelEn: 'Amber Warning — Require Sub-Registry Search',
        labelBn: 'হলুদ সতর্কতা — সাব-রেজিস্ট্রি তল্লাশি আবশ্যক',
        badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        icon: 'bx-error-circle',
      };
    }
    return {
      labelEn: 'Red Flag — High Risk / Do Not Pay',
      labelBn: 'লাল সতর্কতা — উচ্চ ঝুঁকি / টাকা প্রদান বন্ধ রাখুন',
      badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: 'bx-shield-x',
    };
  };

  const verdict = getFeasibilityVerdict();

  return (
    <section id="landtech-track" className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* ── 1. HACKATHON HEADER & TRACK IDENTITY ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF0EB] dark:bg-[#1E1E1C] border border-[#F3D5C6] dark:border-[#2B2A27] text-[#CC5A2B] text-xs font-bold uppercase tracking-wider">
          <i className="bx bx-award text-base" aria-hidden="true" />
          <span>LandTech 2026 Innovation Hackathon Track</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[#191817] dark:text-[#FAF9F5]">
          {isBn ? (
            <>
              ডিজিটাল ভূমি রেকর্ড, <span className="text-[#CC5A2B]">যাচাইকরণ ও ডিজিটাইজেশন</span>
            </>
          ) : (
            <>
              Digital Land Records, <span className="text-[#CC5A2B]">Verification & Digitization</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#706E6B] dark:text-[#9E9B95] max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'ল্যান্ডটেক ২০২৬ হ্যাকাথন নির্দেশিকা অনুযায়ী পুরনো খতিয়ান ডিজিটাইজেশন (P1), ক্রিপ্টোগ্রাফিক দলিল যাচাই (P2), দ্বৈত-বিক্রি ও জালিয়াতি শনাক্তকরণ (P3), স্মার্ট ই-নামজারি (P4) এবং কেনার আগে নাগরিক যাচাই (P5) সহ সব সমস্যা সমাধানের পূর্ণাঙ্গ সফটওয়্যার স্যুট।'
            : 'Fulfills all requirements from the LandTech 2026 Rulebook: Old Record Digitization (P1), Cryptographic Verification (P2), Fraud & Double-Selling Prevention (P3), Smart e-Mutation (P4), and Citizen Pre-Purchase Audit (P5).'}
        </p>

        {/* DIU Hackathon Metadata Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-[#706E6B] dark:text-[#9E9B95]">
          <span className="px-2.5 py-1 rounded-[4px] bg-[#F3EFE8] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            DIU CSE & CSE-TECH
          </span>
          <span className="px-2.5 py-1 rounded-[4px] bg-[#F3EFE8] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            Supported by DIU Law Dept
          </span>
          <span className="px-2.5 py-1 rounded-[4px] bg-[#F3EFE8] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] text-[#CC5A2B] font-semibold">
            100% Client-Side Synthetic Data
          </span>
        </div>
      </div>

      {/* ── 2. PROBLEM TRACK NAVIGATION TABS (BMS segmented control) ── */}
      <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-2 scrollbar-thin">
        <div className="p-1 bg-[#F3EFE8] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] rounded-[4px] inline-flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('p1')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'p1'
                ? 'bg-[#FAF9F5] dark:bg-[#141413] text-[#191817] dark:text-[#FAF9F5] shadow-xs'
                : 'text-[#706E6B] dark:text-[#9E9B95] hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <i className="bx bx-scan text-[#CC5A2B]" />
            <span>{isBn ? 'P1: রেকর্ড ডিজিটাইজার' : 'P1: Digitize Records'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('p2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'p2'
                ? 'bg-[#FAF9F5] dark:bg-[#141413] text-[#191817] dark:text-[#FAF9F5] shadow-xs'
                : 'text-[#706E6B] dark:text-[#9E9B95] hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <i className="bx bx-qr-scan text-blue-500" />
            <span>{isBn ? 'P2: দলিল ও কিউআর যাচাই' : 'P2: Verify Deeds & QR'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('p3')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'p3'
                ? 'bg-[#FAF9F5] dark:bg-[#141413] text-[#191817] dark:text-[#FAF9F5] shadow-xs'
                : 'text-[#706E6B] dark:text-[#9E9B95] hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <i className="bx bx-shield-x text-rose-500" />
            <span>{isBn ? 'P3: দ্বৈত-বিক্রি ও জালিয়াতি' : 'P3: Catch Double-Selling'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('p4')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'p4'
                ? 'bg-[#FAF9F5] dark:bg-[#141413] text-[#191817] dark:text-[#FAF9F5] shadow-xs'
                : 'text-[#706E6B] dark:text-[#9E9B95] hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <i className="bx bx-transfer text-amber-500" />
            <span>{isBn ? 'P4: স্মার্ট ই-নামজারি' : 'P4: Smart e-Mutation'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('p5')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'p5'
                ? 'bg-[#FAF9F5] dark:bg-[#141413] text-[#191817] dark:text-[#FAF9F5] shadow-xs'
                : 'text-[#706E6B] dark:text-[#9E9B95] hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <i className="bx bx-check-double text-teal-500" />
            <span>{isBn ? 'P5: কেনার আগে নাগরিক যাচাই' : 'P5: Check Before You Buy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'sectors'
                ? 'bg-[#FAF9F5] dark:bg-[#141413] text-[#191817] dark:text-[#FAF9F5] shadow-xs'
                : 'text-[#706E6B] dark:text-[#9E9B95] hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <i className="bx bx-buildings text-indigo-500" />
            <span>{isBn ? '৮টি ব্যবহারকারী খাত (Section 4)' : 'Target Sectors (Sec 4)'}</span>
          </button>
        </div>
      </div>

      {/* ── 3. TAB 1: P1 DIGITIZE OLD RECORDS ── */}
      {activeTab === 'p1' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[4px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF0EB] dark:bg-[#1E1E1C] text-[#CC5A2B] border border-[#F3D5C6] dark:border-[#2B2A27]">
                  Problem 1 (P1)
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
                  {isBn ? 'পুরোনো খতিয়ান, পর্চা ও দলিল ডিজিটাইজেশন' : 'Digitize Scanned Khatian, Porcha & Deed Records'}
                </h3>
              </div>
              <p className="text-xs text-[#706E6B] dark:text-[#9E9B95] mt-1">
                {isBn
                  ? 'হাতে লেখা বা মুদ্রিত বাংলা পুরোনো রেকর্ড (সিএস, এসএ, আরএস, বিএস) স্ক্যান করে মেশিন-রিডেবল ডিজিটাল উপাত্ত ও ১৬ আনার হিস্যা রূপান্তর করুন।'
                  : 'Transforms scanned historical Bengali records into searchable digital datasets with traditional 16-ana to decimal conversion.'}
              </p>
            </div>

            {/* Sample Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#706E6B] dark:text-[#9E9B95] font-medium whitespace-nowrap">
                {isBn ? 'নমুনা রেকর্ড:' : 'Select Sample:'}
              </span>
              <div className="flex gap-1.5">
                {SAMPLE_KHATIAN_SCANS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSimulateOcr(item)}
                    className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold border transition-all ${
                      selectedKhatianId === item.id
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs'
                        : 'bg-[#FAF9F5] dark:bg-[#141413] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {item.edition} ({item.khatianNo})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Vintage Scan Raw Preview (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {isBn ? 'স্ক্যানকৃত মূল নথির প্রিভিউ' : 'Scanned Physical Sheet'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-zinc-100 dark:bg-zinc-800 text-[#706E6B] dark:text-[#9E9B95]">
                  {extractedData.edition} • {extractedData.scanType}
                </span>
              </div>

              {/* Simulated Paper Graphic */}
              <div className="p-4 rounded-[4px] border border-dashed border-amber-300/60 dark:border-amber-500/30 bg-[#FFFDF7] dark:bg-[#1A1813] text-zinc-800 dark:text-zinc-200 font-mono text-xs leading-relaxed space-y-2 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
                  <i className="bx bxs-badge-check text-5xl text-amber-600" />
                </div>
                <p className="font-bold text-amber-900 dark:text-amber-300 text-[11px] pb-1 border-b border-amber-200 dark:border-amber-800">
                  [GOVT OF BANGLADESH • DLRS RECORD ARCHIVE]
                </p>
                <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {extractedData.banglaRawText}
                </pre>
                <div className="pt-2 text-[10px] text-zinc-500 italic">
                  Note: {extractedData.previewImageNote}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">
                  {isBn ? 'ওসিআর নির্ভুলতা হার:' : 'OCR Confidence Score:'}
                </span>
                <span className="font-bold text-[#CC5A2B] font-mono">
                  98.4% (Confidence Index)
                </span>
              </div>
            </div>

            {/* Right: Digitized Searchable Structured Data (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#191817] dark:text-[#FAF9F5]">
                    {isBn ? 'ডিজিটাইজড স্ট্রাকচার্ড খতিয়ান কার্ড' : 'Digitized Structured Output'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  <i className="bx bx-copy text-xs" />
                  <span>{copiedJson ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'JSON কপি' : 'Copy JSON')}</span>
                </button>
              </div>

              {isOcrProcessing ? (
                <div className="py-12 text-center space-y-2">
                  <i className="bx bx-loader-alt text-2xl text-[#CC5A2B] animate-spin" />
                  <p className="text-xs text-zinc-500">Processing Bengali handwritten script tokenization...</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Top Metadata Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">
                        {isBn ? 'খতিয়ান নম্বর' : 'Khatian No'}
                      </span>
                      <span className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                        {extractedData.khatianNo}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">
                        {isBn ? 'মৌজা ও জেএল' : 'Mouza & JL'}
                      </span>
                      <span className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                        {extractedData.mouzaBn} ({extractedData.jlNo})
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">
                        {isBn ? 'উপজেলা ও জেলা' : 'Upazila / Dist'}
                      </span>
                      <span className="font-bold text-[#191817] dark:text-[#FAF9F5] text-sm">
                        {extractedData.upazila}, {extractedData.district}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27]">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">
                        {isBn ? 'জরিপ সংস্করণ' : 'Survey Era'}
                      </span>
                      <span className="font-bold text-[#CC5A2B] text-sm">
                        {extractedData.editionBn}
                      </span>
                    </div>
                  </div>

                  {/* Dags & Shares Table */}
                  <div className="border border-[#E8E3DA] dark:border-[#2B2A27] rounded-[4px] overflow-hidden">
                    <div className="px-3.5 py-2 bg-zinc-50 dark:bg-[#18181B] border-b border-[#E8E3DA] dark:border-[#2B2A27] text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                      {isBn ? 'দাগ ও অংশীদার হিস্যা তালিকা' : 'Dag Breakdown & Traditional 16-Ana Ownership Share'}
                    </div>

                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {extractedData.dags.map((dag, idx) => (
                        <div key={idx} className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#191817] dark:text-[#FAF9F5] text-xs">
                              {isBn ? 'দাগ নং:' : 'Dag No:'} {dag.dagNo} ({dag.dagType === 'hal' ? 'হাল' : 'সাবেক'})
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                              {isBn ? dag.landTypeBn : dag.landType} • {dag.totalAreaDecimals} {isBn ? 'শতক' : 'Decimals'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {dag.shares.map((sh, sIdx) => (
                              <div key={sIdx} className="flex items-center justify-between text-[11px] pl-2 border-l-2 border-emerald-500">
                                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                                  {isBn ? sh.ownerNameBn : sh.ownerName}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="text-[#706E6B] dark:text-[#9E9B95] font-mono text-[10px]">
                                    {sh.anaGondaShare}
                                  </span>
                                  <span className="font-bold text-[#CC5A2B] font-mono">
                                    {sh.decimalShare} {isBn ? 'শতক' : 'dec'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TAB 2: P2 VERIFY DEEDS & OWNERSHIP (CRYPTOGRAPHIC & QR) ── */}
      {activeTab === 'p2' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[4px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Problem 2 (P2)
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
                  {isBn ? 'দলিল ও মালিকানা যাচাই (ক্রিপ্টোগ্রাফিক হ্যাশিং ও কিউআর কোড)' : 'Verify Deeds & Ownership via Cryptographic SHA-256 & QR'}
                </h3>
              </div>
              <p className="text-xs text-[#706E6B] dark:text-[#9E9B95] mt-1">
                {isBn
                  ? 'দলিলের কোনো অক্ষর, দাগ নম্বর বা জমির পরিমাণ পরিবর্তন করা হলে ক্রিপ্টোগ্রাফিক হ্যাশ অমিলের মাধ্যমে তাৎক্ষণিক জালিয়াতি শনাক্ত হয়।'
                  : 'Tamper-proof deed integrity verification: modifying even 1 decimal or digit invalidates the cryptographic hash signature.'}
              </p>
            </div>

            {/* Test Case Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#706E6B] dark:text-[#9E9B95] font-medium whitespace-nowrap">
                {isBn ? 'পরীক্ষামূলক দলিল:' : 'Test Deed:'}
              </span>
              <div className="flex gap-1.5">
                {SAMPLE_CRYPTO_DEEDS.map((deed) => (
                  <button
                    key={deed.id}
                    type="button"
                    onClick={() => handleSelectCryptoDeed(deed)}
                    className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold border transition-all ${
                      selectedCryptoDeed.id === deed.id
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs'
                        : 'bg-[#FAF9F5] dark:bg-[#141413] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {deed.isTampered ? 'Tampered Deed Demo' : 'Authentic Deed Demo'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Deed Payload Editor (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191817] dark:text-[#FAF9F5]">
                  {isBn ? 'দলিলের মূল তথ্যাবলি ও টেস্ট এডিটর' : 'Deed Payload Inspection & Tamper Simulation'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isHashMismatch
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/15 text-[#CC5A2B] border-emerald-500/30'
                }`}>
                  {isHashMismatch ? (isBn ? 'জালিয়াতি / পরিবর্তন শনাক্ত!' : 'TAMPER DETECTED!') : (isBn ? 'স্বাক্ষর অক্ষত ও বৈধ' : 'GENESIS INTEGRITY VERIFIED')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    {isBn ? 'দলিল নম্বর' : 'Deed Number'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCryptoDeed.deedNo}
                    className="w-full px-3 py-2 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] font-bold text-[#191817] dark:text-[#FAF9F5]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    {isBn ? 'সাব-রেজিস্ট্রি অফিস' : 'Sub-Registry'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCryptoDeed.subRegistry}
                    className="w-full px-3 py-2 rounded-[4px] bg-zinc-50 dark:bg-[#18181B] border border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    {isBn ? 'দাগ নম্বর (Interactive)' : 'Dag Number (Try Changing)'}
                  </label>
                  <input
                    type="text"
                    value={deedFormDag}
                    onChange={(e) => handleRecomputeHash(deedFormArea, e.target.value)}
                    className="w-full px-3 py-2 rounded-[4px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-bold text-[#191817] dark:text-[#FAF9F5] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                    {isBn ? 'জমির পরিমাণ (শতক - Interactive)' : 'Land Area Decimals (Try Changing)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={deedFormArea}
                    onChange={(e) => handleRecomputeHash(parseFloat(e.target.value) || 0, deedFormDag)}
                    className="w-full px-3 py-2 rounded-[4px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-bold text-[#191817] dark:text-[#FAF9F5] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Cryptographic Hash Comparison Panel */}
              <div className="space-y-2 pt-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-0.5">
                    Genesis Hash (Stored at Sub-Registry on Registration Day):
                  </span>
                  <div className="px-3 py-1.5 rounded-[4px] bg-[#F3EFE8] dark:bg-[#1E1E1C] font-mono text-[11px] text-[#706E6B] dark:text-[#9E9B95] break-all select-all">
                    {selectedCryptoDeed.genesisHash}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-0.5">
                    Live Computed Hash (From current document payload):
                  </span>
                  <div className={`px-3 py-1.5 rounded-[4px] font-mono text-[11px] break-all select-all ${
                    isHashMismatch
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      : 'bg-[#FAF0EB] dark:bg-[#1E1E1C] text-[#CC5A2B] border border-emerald-500/30'
                  }`}>
                    {computedHash}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: QR Code & Verification Status (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                {isBn ? 'ডিজিটাল কিউআর স্ট্যাম্প' : 'Official Digital Stamp & QR Code'}
              </span>

              {/* QR Code Container */}
              <div className="w-36 h-36 mx-auto p-2 bg-white rounded-[4px] border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col items-center justify-center relative">
                {/* Simulated QR Code graphic */}
                <div className="w-32 h-32 bg-zinc-950 p-2 rounded flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 bg-white border-4 border-zinc-950"></div>
                    <div className="w-8 h-8 bg-white border-4 border-zinc-950"></div>
                  </div>
                  <div className="text-white text-[8px] text-center font-mono tracking-tighter truncate">
                    LW-HASH-{computedHash.slice(0, 8)}
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 bg-white border-4 border-zinc-950"></div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Verdict Card */}
              <div className={`p-4 rounded-[4px] border text-left text-xs space-y-1.5 ${
                isHashMismatch
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                  : 'bg-[#FAF0EB] dark:bg-[#1E1E1C] border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <i className={`bx ${isHashMismatch ? 'bx-error-circle text-rose-500' : 'bx-check-circle text-[#CC5A2B]'} text-base`} />
                  <span>
                    {isHashMismatch ? (isBn ? 'সতর্কতা: দলিল পরিবর্তিত!' : 'Tamper Alert!') : (isBn ? 'বৈধ সরকারি দলিল' : 'Genuine Registry Record')}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#706E6B] dark:text-[#9E9B95]">
                  {isHashMismatch
                    ? (isBn
                        ? 'মূল দলিলের রেকর্ড বা দাগের সাথে বর্তমান তথ্যের অমিল পাওয়া গেছে। এটি ভুয়া বা ঘষামাজা করা দলিল হওয়ার আশঙ্কা রয়েছে।'
                        : 'The hash of the submitted document does not match the registry genesis hash. Possible forged area or modified dag number.')
                    : (isBn
                        ? 'সাব-রেজিস্ট্রি অফিসের মূল ডাটাবেজের সাথে হ্যাশ শতভাগ মিলেছে। কোনো অননুমোদিত পরিবর্তন ঘটেনি।'
                        : 'Cryptographic hash matches the immutable genesis registry record perfectly. Title is verified tamper-free.')}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── 5. TAB 3: P3 CATCH FRAUD & DOUBLE-SELLING ── */}
      {activeTab === 'p3' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[4px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  Problem 3 (P3)
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
                  {isBn ? 'জালিয়াতি ও একাধিকবার বিক্রি (দ্বৈত বিক্রয়) শনাক্তকরণ' : 'Catch Fraud, Duplicate Conveyance & Double-Selling'}
                </h3>
              </div>
              <p className="text-xs text-[#706E6B] dark:text-[#9E9B95] mt-1">
                {isBn
                  ? 'একই জমি একাধিক ক্রেতার কাছে প্রতারণামূলক বিক্রি, অতিরিক্ত জমির কাগুজে দলিল এবং রেজিস্ট্রেশন ও নামজারির অমিল শনাক্তকরণ।'
                  : 'Detects duplicate deed registrations on unmutated parcels, cumulative dag deficits, and dual collateral fraud.'}
              </p>
            </div>

            {/* Case Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#706E6B] dark:text-[#9E9B95] font-medium whitespace-nowrap">
                {isBn ? 'দ্বন্দ্ব কেস:' : 'Conflict Case:'}
              </span>
              <div className="flex gap-1.5">
                {SAMPLE_FRAUD_CONFLICTS.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedFraudCaseId(c.id)}
                    className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold border transition-all ${
                      selectedFraudCaseId === c.id
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs'
                        : 'bg-[#FAF9F5] dark:bg-[#141413] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    Case #{idx + 1} ({c.fraudType === 'double_sale_unmutated' ? 'Double Sale' : 'Area Deficit'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Conflict Breakdown Card */}
          <div className="p-6 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 mb-1">
                  <i className="bx bx-error text-sm" />
                  {isBn ? activeFraudCase.fraudTypeBn : activeFraudCase.fraudType}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
                  {activeFraudCase.mouzaName} • {activeFraudCase.dagNo} ({activeFraudCase.khatianNo})
                </h4>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                  {isBn ? 'জরিপকৃত মোট জমি' : 'Surveyed Area'}
                </span>
                <span className="text-base font-black text-[#191817] dark:text-[#FAF9F5] font-mono">
                  {activeFraudCase.totalSurveyedAreaDecimals} {isBn ? 'শতক' : 'Decimals'}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {isBn ? activeFraudCase.descriptionBn : activeFraudCase.descriptionEn}
            </p>

            {/* Transaction Timeline with Fraud Flagging */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                {isBn ? 'দাগের পূর্বাপর বিক্রয় লেনদেন বিশ্লেষণ' : 'Conveyance Collision Timeline'}
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeFraudCase.transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-[4px] border space-y-2 ${
                      tx.mutationStatus === 'unmutated_fake'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
                        : 'bg-zinc-50 dark:bg-[#18181B] border-[#E8E3DA] dark:border-[#2B2A27] text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">
                        Deed #{tx.deedNo} ({tx.date})
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tx.mutationStatus === 'unmutated_fake'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500/20 text-[#CC5A2B]'
                      }`}>
                        {tx.mutationStatus === 'unmutated_fake' ? 'COLLISION FRAUD' : 'PRIOR CONVEYANCE'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-[#706E6B] dark:text-[#9E9B95]">
                      <div><strong>Seller:</strong> {tx.seller}</div>
                      <div><strong>Buyer:</strong> {tx.buyer}</div>
                      <div><strong>Area Sold:</strong> <span className="font-mono font-bold text-[#191817] dark:text-[#FAF9F5]">{tx.areaSoldDecimals} decimals</span></div>
                      <div className="text-[10px] text-zinc-500">{tx.subRegistryOffice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Redress Box (Land Crime Prevention Act 2023) */}
            <div className="p-3.5 rounded-[4px] bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <i className="bx bxs-institution text-lg text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-amber-950 dark:text-amber-300">
                  {isBn ? 'ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩ ধারা প্রয়োগ:' : 'Statutory Violation & Legal Enforcement:'}
                </strong>
                <p className="text-[11px] mt-0.5 leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {activeFraudCase.statutoryViolation}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── 6. TAB 4: P4 SMART E-MUTATION & REGISTRY PIPELINE ── */}
      {activeTab === 'p4' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[4px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Problem 4 (P4)
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
                  {isBn ? 'স্মার্ট ই-নামজারি ও সাব-রেজিস্ট্রি সরাসরি আন্তঃসংযোগ' : 'Smart e-Mutation & Sub-Registry Interoperability Pipeline'}
                </h3>
              </div>
              <p className="text-xs text-[#706E6B] dark:text-[#9E9B95] mt-1">
                {isBn
                  ? 'দলিল রেজিস্ট্রেশনের সাথে সাথে স্বয়ংক্রিয়ভাবে ই-নামজারি প্রক্রিয়া শুরু, ২৮ দিনের অগ্রগতি পর্যবেক্ষণ এবং সরকারি নির্দিষ্ট ফি হিসাব।'
                  : 'Automatic deed-to-mutation synchronization with statutory 28-day SLA timeline and exact government fee schedule.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#706E6B] dark:text-[#9E9B95] font-medium">
                {isBn ? 'ট্র্যাকিং নং:' : 'Tracking #:'}
              </span>
              <input
                type="text"
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                className="px-2.5 py-1 rounded-[4px] text-xs font-mono font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[#191817] dark:text-[#FAF9F5] w-36"
              />
            </div>
          </div>

          {/* 4-Stage Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMUTATION_PIPELINE_STAGES.map((st) => (
              <div
                key={st.stageNumber}
                className={`p-4 rounded-[6px] border flex flex-col justify-between space-y-3 ${
                  st.status === 'completed'
                    ? 'bg-[#FFFFFF] dark:bg-[#1E1E1C] border-emerald-500/40 shadow-xs'
                    : st.status === 'in_progress'
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                    : 'bg-[#FAF9F5] dark:bg-[#1E1E1C]/60 border-[#E8E3DA] dark:border-[#2B2A27] opacity-70'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Step {st.stageNumber} • {st.dayWindow}
                    </span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      st.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : st.status === 'in_progress'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {st.status === 'completed' ? '✓' : st.stageNumber}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#191817] dark:text-[#FAF9F5] leading-tight">
                    {isBn ? st.titleBn : st.titleEn}
                  </h4>

                  <span className="text-[10px] text-[#CC5A2B] font-semibold block">
                    {isBn ? st.actorBn : st.actor}
                  </span>

                  <p className="text-[11px] text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                    {isBn ? st.actionDetailsBn : st.actionDetailsEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 text-[10px]">
                    {isBn ? 'সরকারি ফি:' : 'Statutory Fee:'}
                  </span>
                  <span className="font-bold font-mono text-[#191817] dark:text-[#FAF9F5]">
                    ৳{st.statutoryFeeBDT}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Statutory Fee Breakdown Banner */}
          <div className="p-4 rounded-[4px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[4px] bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-sm">
                ৳
              </div>
              <div>
                <strong className="text-sm font-bold text-[#191817] dark:text-[#FAF9F5] block">
                  {isBn ? 'ই-নামজারি সরকারি মোট ফি: মাত্র ১,১৭০ টাকা' : 'Official Government e-Mutation Fee: Exactly ৳1,170'}
                </strong>
                <span className="text-zinc-500 text-[11px]">
                  Court Fee (৳২০) + Notice Fee (৳৫০) + Record Correction (৳১,০০০) + DCR (৳১০০) = No Extra Bribe
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1.5 rounded-[4px] bg-[#FAF0EB] dark:bg-[#1E1E1C] text-[#CC5A2B] font-bold border border-[#F3D5C6] dark:border-[#2B2A27]">
                28-Day Statutory Guarantee
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. TAB 5: P5 CHECK BEFORE YOU BUY ── */}
      {activeTab === 'p5' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-[4px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Problem 5 (P5)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
                {isBn ? 'কেনার আগে নাগরিক যাচাই (Check Before You Buy)' : 'Citizen Pre-Purchase Due-Diligence Tool'}
              </h3>
            </div>
            <p className="text-xs text-[#706E6B] dark:text-[#9E9B95] mt-1">
              {isBn
                ? 'জমি কেনার বায়না করার পূর্বে সাধারণ নাগরিক ও প্রবাসীদের জন্য ৬টি অপরিহার্য আইনি ও স্বত্বলিপি শর্ত যাচাইকরণ চেকলিস্ট।'
                : 'A statutory 6-point pre-purchase audit for prospective buyers to verify title continuity, mutation, court cases, and khas clearance.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 6-Point Interactive Checklist (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block pb-2 border-b border-zinc-100 dark:border-zinc-800">
                {isBn ? '৬-দফা বাধ্যতামূলক নাগরিক অনুসন্ধান তালিকা' : '6-Point Statutory Pre-Purchase Checklist'}
              </span>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {[
                  {
                    key: 'titleChainContinuity' as const,
                    titleEn: '1. Root Title Continuity (CS → SA → RS → BS)',
                    titleBn: '১. স্বত্বলিপির ঐতিহাসিক পরম্পরা (সিএস → এসএ → আরএস → বিএস)',
                    descEn: 'Unbroken chain of deeds and inheritance tracing back to 1950.',
                    descBn: '১৯৫০ সালের পর থেকে কোনো খতিয়ান বা ওয়ারিশ বাদ পড়েনি।',
                  },
                  {
                    key: 'sellerMutationCompleted' as const,
                    titleEn: '2. Up-to-date Mutation & DCR in Seller’s Name',
                    titleBn: '২. বিক্রেতার নিজ নামে ই-নামজারি ও ডিসিআর',
                    descEn: 'Deed must not be executed solely on deceased ancestor’s khatian.',
                    descBn: 'শুধুমাত্র পিতার বা পূর্বপুরুষের নামে নয়, বিক্রেতার নিজ নামে নামজারি সম্পন্ন।',
                  },
                  {
                    key: 'taxClearanceUpdated' as const,
                    titleEn: '3. Land Development Tax Paid up to Current Year',
                    titleBn: '৩. হাল সনের ভূমি উন্নয়ন কর (খাজনা) দাখিলা',
                    descEn: 'Online tax receipt token verified on ldtax.gov.bd.',
                    descBn: '১৪৩১ বাংলা সন পর্যন্ত বকেয়াহীন অনলাইন দাখিলা রশিদ রয়েছে।',
                  },
                  {
                    key: 'khasOrAcquisitionFree' as const,
                    titleEn: '4. Non-Khas / Non-Vested Property Clearance',
                    titleBn: '৪. সরকারি খাস, অর্পিত (ভিপি) বা অধিগ্রহণমুক্ত',
                    descEn: 'Land is not included in government gazette or megaproject acquisition list.',
                    descBn: 'জমিটি কোনো ওয়াকফ, অর্পিত সম্পত্তি বা সরকারি অধিগ্রহণের তালিকায় নেই।',
                  },
                  {
                    key: 'courtCaseFree' as const,
                    titleEn: '5. Zero Civil Court Injunction / Section 52 Suit',
                    titleBn: '৫. আদালতে কোনো দেওয়ানি মামলা বা নিষেধাজ্ঞা নেই',
                    descEn: 'Sub-Registry non-encumbrance inspection confirms clear possession.',
                    descBn: 'সাব-রেজিস্ট্রি অফিসে কোনো বন্ধক বা নিষেধাজ্ঞা নিবন্ধিত নেই।',
                  },
                  {
                    key: 'boundaryPhysicalMatch' as const,
                    titleEn: '6. Physical Possession Matches Mouza Map Boundary',
                    titleBn: '৬. সরেজমিনে সীমানা ও মৌজা নকশার হুবহু মিল',
                    descEn: 'Amin survey confirms physical boundary corresponds to surveyed dag polygon.',
                    descBn: 'আমিন দ্বারা পরিমাপ করে কাগুজে শতক ও মাঠের বাস্তবের মিল পাওয়া গেছে।',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3 rounded-[4px] border cursor-pointer transition-all ${
                      citizenChecklist[item.key]
                        ? 'bg-emerald-500/5 dark:bg-[#FAF0EB] dark:bg-[#1E1E1C] border-emerald-500/40 text-[#191817] dark:text-[#FAF9F5]'
                        : 'bg-zinc-50 dark:bg-[#18181B] border-[#E8E3DA] dark:border-[#2B2A27] text-[#706E6B] dark:text-[#9E9B95]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={citizenChecklist[item.key]}
                      onChange={(e) =>
                        setCitizenChecklist((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-zinc-300 dark:border-zinc-700"
                    />
                    <div className="space-y-0.5 text-xs">
                      <strong className="font-bold block">
                        {isBn ? item.titleBn : item.titleEn}
                      </strong>
                      <span className="text-[11px] text-[#706E6B] dark:text-[#9E9B95] block">
                        {isBn ? item.descBn : item.descEn}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Right: Feasibility Certificate & Safety Verdict (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-5 text-center flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                  {isBn ? 'নাগরিক প্রাক-ক্রয় সনদ' : 'Pre-Purchase Citizen Feasibility Certificate'}
                </span>

                {/* Score Dial */}
                <div className="w-28 h-28 mx-auto rounded-full border-4 border-[#E8E3DA] dark:border-[#2B2A27] flex flex-col items-center justify-center relative shadow-sm">
                  <span className="text-2xl font-black text-[#191817] dark:text-[#FAF9F5] font-mono">
                    {feasibilityPercentage}%
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">
                    {passedChecksCount} / 6 Passed
                  </span>
                </div>

                {/* Verdict Badge */}
                <div className={`p-3 rounded-[4px] border text-xs font-bold flex items-center justify-center gap-2 ${verdict.badgeClass}`}>
                  <i className={`bx ${verdict.icon} text-base`} />
                  <span>{isBn ? verdict.labelBn : verdict.labelEn}</span>
                </div>

                <p className="text-[11px] text-[#706E6B] dark:text-[#9E9B95] leading-relaxed text-left">
                  {isBn
                    ? 'টাকা বা বায়না দেওয়ার পূর্বে সকল ৬টি শর্ত পূরণ করা আবশ্যক। ১টিও শর্ত অপূর্ণ থাকলে সাব-রেজিস্ট্রি অফিসে তল্লাশি ছাড়া চুক্তি করবেন না।'
                    : 'Prospective buyers should never disburse token money until all 6 criteria are verified through certified record room folios.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  alert(isBn ? 'চেকলিস্ট প্রিন্ট হচ্ছে...' : 'Generating printable pre-purchase audit checklist...');
                  window.print();
                }}
                className="w-full py-2.5 rounded-[4px] font-bold text-xs bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 shadow-xs transition-opacity flex items-center justify-center gap-2"
              >
                <i className="bx bx-printer text-sm" />
                <span>{isBn ? 'যাচাই চেকলিস্ট প্রিন্ট করুন' : 'Print Pre-Purchase Audit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. TAB 6: TARGET SECTORS (SECTION 4 OF RULEBOOK) ── */}
      {activeTab === 'sectors' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-[4px] bg-[#FAF9F5] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27]">
            <h3 className="text-sm sm:text-base font-bold text-[#191817] dark:text-[#FAF9F5]">
              {isBn ? '৮টি মূল ব্যবহারকারী খাত (Section 4 — Where Solution Can Be Used)' : '8 Target Sectors & Ecosystem Stakeholders'}
            </h3>
            <p className="text-xs text-[#706E6B] dark:text-[#9E9B95] mt-1">
              {isBn
                ? 'হ্যাকাথন নির্দেশিকার ৪ নম্বর অনুচ্ছেদ অনুযায়ী এই প্ল্যাটফর্ম সাব-রেজিস্ট্রি, এসি ল্যান্ড, ব্যাংক, ডিসি অফিস, ডিএলআরএস, আদালত ও নাগরিকদের কীভাবে সেবা দেয়।'
                : 'Outlines the concrete operational value propositions across the 8 sectors defined in Section 4 of the LandTech 2026 Rulebook.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TARGET_SECTOR_ROLES.map((sec) => (
              <div
                key={sec.id}
                className="p-4 rounded-[6px] bg-[#FFFFFF] dark:bg-[#1E1E1C] border border-[#E8E3DA] dark:border-[#2B2A27] space-y-3 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-[4px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 text-lg">
                    <i className={`bx ${sec.icon}`} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0EB] dark:bg-[#1E1E1C] text-[#CC5A2B] border border-[#F3D5C6] dark:border-[#2B2A27]">
                    {sec.roleBadge}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#191817] dark:text-[#FAF9F5]">
                  {isBn ? sec.nameBn : sec.nameEn}
                </h4>

                <p className="text-[11px] text-[#706E6B] dark:text-[#9E9B95] leading-relaxed">
                  {isBn ? sec.primaryBenefitBn : sec.primaryBenefitEn}
                </p>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-[#706E6B] dark:text-[#9E9B95] italic">
                  {isBn ? sec.operationalWorkflowBn : sec.operationalWorkflowEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
