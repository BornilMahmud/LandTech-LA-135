import React, { useState, useMemo } from 'react';
import {
  DueDiligenceCase,
  ExtractedLandDocument,
  VerificationFinding,
} from '../../types/dueDiligence';
import { AUTHENTIC_DUE_DILIGENCE_CASES } from '../../data/dueDiligenceCases';
import { BANGLADESH_LAND_TERMS, OFFICIAL_GOV_VERIFICATION_PORTALS } from '../../data/legalDefinitions';
import {
  performDueDiligenceCrossVerification,
  computeOverallRiskScore,
} from '../../utils/verificationEngine';
import { convertFromDecimals } from '../../utils/landUnits';
import { DocumentCard } from './DocumentCard';
import { ChainOfTitleVisualizer } from './ChainOfTitleVisualizer';
import { CrossVerificationMatrix } from './CrossVerificationMatrix';
import { EnvironmentalRiskCard } from './EnvironmentalRiskCard';
import { DocumentUploadModal } from './DocumentUploadModal';
import { DueDiligenceReportModal } from './DueDiligenceReportModal';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  FileText,
  Compass,
  GitCommit,
  BookOpen,
  Scale,
  Sparkles,
  ExternalLink,
  Layers,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Download
} from 'lucide-react';

interface DueDiligenceWorkbenchProps {
  isBn: boolean;
  selectedDistrictId?: string;
  onSelectDistrictById?: (id: string) => void;
}

export const DueDiligenceWorkbench: React.FC<DueDiligenceWorkbenchProps> = ({
  isBn,
  selectedDistrictId,
  onSelectDistrictById,
}) => {
  // All cases state, allowing additions of custom documents
  const [cases, setCases] = useState<DueDiligenceCase[]>(AUTHENTIC_DUE_DILIGENCE_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(AUTHENTIC_DUE_DILIGENCE_CASES[0].id);

  // Active view tab inside the case
  const [activeTab, setActiveTab] = useState<'matrix' | 'chain' | 'spatial' | 'roadmap' | 'bhumipedia'>('matrix');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Unit display choice
  const [preferredUnit, setPreferredUnit] = useState<'decimals' | 'katha' | 'bigha' | 'sqFeet'>('decimals');

  // Active Case
  const activeCase = useMemo(() => {
    return cases.find((c) => c.id === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  // Real-time deterministic cross-verification findings & updated score
  const { findings, riskAnalysis } = useMemo(() => {
    const verifiedFindings = performDueDiligenceCrossVerification(
      activeCase.documents,
      activeCase.claimedAreaDecimals,
      activeCase.spatialRisk
    );
    const scoreResult = computeOverallRiskScore(verifiedFindings);
    return {
      findings: verifiedFindings,
      riskAnalysis: scoreResult,
    };
  }, [activeCase]);

  // Handler to add custom extracted document to active case
  const handleAddDocumentToActiveCase = (newDoc: ExtractedLandDocument) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            documents: [newDoc, ...c.documents],
          };
        }
        return c;
      })
    );
  };

  const areaConversions = convertFromDecimals(activeCase.claimedAreaDecimals);

  return (
    <section id="due-diligence" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* ── WORKBENCH TOP HEADER & VALUE PROPOSITION ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <FileCheck2 size={14} className="text-emerald-500" />
          <span>
            {isBn
              ? '🛡️ ল্যান্ডওয়াইজ এআই • বাংলাদেশ ভূমি দলিল অডিট ও স্বত্ব যাচাই সহকারী'
              : '🛡️ LANDWISE AI • BANGLADESH LAND DUE-DILIGENCE ASSISTANT'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
          {isBn ? (
            <>
              টাকা দেওয়ার পূর্বে <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300">দলিল, খতিয়ান ও নামজারি</span> যাচাই করুন
            </>
          ) : (
            <>
              Investigate Land Records, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300">Title Chains & Hidden Risks</span> Before Paying
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'বিক্রেতার সাফ-কবলা দলিল, আরএস খতিয়ান, ই-নামজারি এবং খাজনা দাখিলার মধ্যে দাগ নম্বর, জমির হিস্যা ও মালিকানার ধারাবাহিকতায় অসঙ্গতি বা জালিয়াতি থাকলে তা তাৎক্ষণিক শনাক্ত করুন।'
            : 'Reconcile seller deeds, RS khatians, mutation porchas, and tax receipts. Detect broken title chains, area deficits, mismatched dag numbers, and environmental hazards with evidence references.'}
        </p>
      </div>

      {/* ── CASE SELECTOR STRIP ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-500" />
            {isBn ? 'বাস্তবসম্মত ডেমো কেস প্যাকেজ নির্বাচন করুন:' : 'Select Authentic Demonstration Case or Test Your Own:'}
          </span>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            <UploadCloud size={14} />
            <span>{isBn ? '+ কাস্টম দলিল / পর্চা আপলোড করুন' : '+ Upload Custom Document'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cases.map((c) => {
            const isSelected = c.id === activeCase.id;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCaseId(c.id);
                  if (onSelectDistrictById) {
                    onSelectDistrictById(c.districtId);
                  }
                }}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-emerald-950/40 dark:border-emerald-500 ring-2 ring-emerald-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.riskScore >= 65
                      ? 'bg-rose-500/20 text-rose-500'
                      : c.riskScore >= 35
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {c.riskScore >= 65
                      ? (isBn ? 'রেড ফ্ল্যাগ' : 'Red Flags')
                      : c.riskScore >= 35
                      ? (isBn ? 'সতর্কতা' : 'Warning')
                      : (isBn ? 'পরিষ্কার স্বত্ব' : 'Clean Title')}
                  </span>
                  <span className={`text-[11px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {c.claimedAreaDecimals} Dec
                  </span>
                </div>

                <h4 className="text-xs font-bold line-clamp-1 leading-snug">
                  {isBn ? c.caseTitleBn : c.caseTitleEn}
                </h4>

                <div className={`flex items-center gap-1 text-[11px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  <MapPin size={11} className="shrink-0" />
                  <span className="truncate">{c.mouzaName}, {c.districtName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE CASE DOSSIER HERO BANNER ── */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Banner Top Details */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {activeCase.districtName} • {activeCase.upazilaName}
              </span>
              <span className="text-xs text-slate-500">
                {isBn ? 'মৌজা:' : 'Mouza:'} <strong>{activeCase.mouzaName}</strong> (J.L. #{activeCase.jlNumber})
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isBn ? activeCase.caseTitleBn : activeCase.caseTitleEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn ? activeCase.targetPropertyDescriptionBn : activeCase.targetPropertyDescriptionEn}
            </p>
          </div>

          {/* Right KPIs & Download Report Trigger */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            {/* Risk Gauge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {isBn ? 'ঝুঁকি স্কোর' : 'Hazard Index'}
                </span>
                <span className={`text-2xl font-black ${
                  riskAnalysis.score >= 65
                    ? 'text-rose-600 dark:text-rose-400'
                    : riskAnalysis.score >= 35
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}>
                  {riskAnalysis.score}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </span>
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

              <div>
                {riskAnalysis.score >= 65 ? (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <ShieldAlert size={16} />
                    <span>{isBn ? 'উচ্চ ঝুঁকি!' : 'Red Flags Detected'}</span>
                  </div>
                ) : riskAnalysis.score >= 35 ? (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <AlertTriangle size={16} />
                    <span>{isBn ? 'তদন্ত আবশ্যক' : 'Caution Required'}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={16} />
                    <span>{isBn ? 'স্বত্ব সুসংগত' : 'Favorable Pre-Screen'}</span>
                  </div>
                )}
                <div className="text-[10px] text-slate-500">
                  {riskAnalysis.breakdown.criticalCount} Red Flags • {riskAnalysis.breakdown.highCount} Warnings
                </div>
              </div>
            </div>

            {/* Download Due-Diligence Report */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md transition-colors"
            >
              <Download size={15} />
              <span>{isBn ? 'পূর্ণাঙ্গ ডিউ-ডিলিজেন্স রিপোর্ট' : 'Download Due-Diligence Report'}</span>
            </button>
          </div>
        </div>

        {/* Quick Area Unit Converter Pill Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">
              {isBn ? 'জমির পরিমাণ:' : 'Claimed Area:'}
            </span>
            <span className="font-black text-slate-900 dark:text-white text-sm">
              {preferredUnit === 'decimals' && `${areaConversions.decimals} Decimals (শতক)`}
              {preferredUnit === 'katha' && `${areaConversions.katha} Katha (কাঠা)`}
              {preferredUnit === 'bigha' && `${areaConversions.bigha} Bigha (বিঘা)`}
              {preferredUnit === 'sqFeet' && `${areaConversions.sqFeet} Sq.Ft. (বর্গফুট)`}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['decimals', 'katha', 'bigha', 'sqFeet'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setPreferredUnit(unit)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                  preferredUnit === unit
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {unit === 'decimals' && (isBn ? 'শতক' : 'Decimal')}
                {unit === 'katha' && (isBn ? 'কাঠা' : 'Katha')}
                {unit === 'bigha' && (isBn ? 'বিঘা' : 'Bigha')}
                {unit === 'sqFeet' && (isBn ? 'বর্গফুট' : 'Sq.Ft.')}
              </button>
            ))}
          </div>
        </div>

        {/* Document Inventory Cards Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{isBn ? 'সংযুক্ত নথিপত্র (' + activeCase.documents.length + 'টি)' : 'Submitted Documents (' + activeCase.documents.length + ')'}</span>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              {isBn ? '+ আরও নথি যোগ করুন' : '+ Add Document to Case'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeCase.documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isBn={isBn}
              />
            ))}
          </div>
        </div>

        {/* ── WORKBENCH TABS NAVIGATION ── */}
        <div className="border-b border-slate-200 dark:border-slate-800 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'matrix'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileCheck2 size={15} />
              <span>{isBn ? '১২টি নির্দেশক ও রেড ফ্ল্যাগ' : '12-Field Cross-Reconciliation & Red Flags'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px]">
                {findings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('chain')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'chain'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GitCommit size={15} />
              <span>{isBn ? 'স্বত্বলিপির পরম্পরা (Chain of Title)' : 'Chain of Title Flow'}</span>
            </button>

            <button
              onClick={() => setActiveTab('spatial')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'spatial'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Compass size={15} />
              <span>{isBn ? 'পরিবেশগত ও জোনিং ঝুঁকি' : 'Environmental & Spatial Hazards'}</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'roadmap'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{isBn ? '৪-দফা সরকারি ভেরিফিকেশন গাইড' : 'Official Verification Roadmap'}</span>
            </button>

            <button
              onClick={() => setActiveTab('bhumipedia')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'bhumipedia'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen size={15} />
              <span>{isBn ? 'ভূমিপিডিয়া আইন কোষ' : 'Bhumipedia Legal Glossary'}</span>
            </button>
          </div>
        </div>

        {/* ── WORKBENCH ACTIVE TAB CONTENTS ── */}
        <div className="pt-2">
          {activeTab === 'matrix' && (
            <CrossVerificationMatrix
              findings={findings}
              documents={activeCase.documents}
              claimedAreaDecimals={activeCase.claimedAreaDecimals}
              isBn={isBn}
            />
          )}

          {activeTab === 'chain' && (
            <ChainOfTitleVisualizer
              documents={activeCase.documents}
              isBn={isBn}
            />
          )}

          {activeTab === 'spatial' && (
            <EnvironmentalRiskCard
              spatialRisk={activeCase.spatialRisk}
              mouzaName={activeCase.mouzaName}
              districtName={activeCase.districtName}
              isBn={isBn}
            />
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Scale className="text-emerald-500" size={18} />
                    <span>{isBn ? 'জমি কেনার পূর্বে ৪-দফা বাধ্যতামূলক সরকারি যাচাইকরণ' : 'Actionable 4-Step Pre-Purchase Verification Roadmap'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'যেকোনো বায়না বা সাফ-কবলা দলিল রেজিস্ট্রেশনের পূর্বে এই সরকারি যাচাইগুলো সম্পন্ন করা আইনত জরুরি'
                      : 'Statutory verification steps every buyer must execute through official Ministry of Land portals'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {OFFICIAL_GOV_VERIFICATION_PORTALS.map((portal) => (
                    <div
                      key={portal.name}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                            {portal.name}
                          </h5>
                          <a
                            href={portal.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {isBn ? portal.descriptionBn : portal.descriptionEn}
                        </p>
                      </div>

                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <span>{isBn ? 'সরকারি পোর্টালে অনুসন্ধান করুন' : 'Verify on Official Portal'}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bhumipedia' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="text-emerald-500" size={18} />
                    <span>{isBn ? 'ভূমিপিডিয়া আইন কোষ ও পরিভাষা গাইড' : 'Bhumipedia Legal Glossary & Terminology'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'ভূমি মন্ত্রণালয় (bhumipedia.land.gov.bd) ও প্রজাস্বত্ব আইন ১৯৫০ এর প্রামাণ্য পরিভাষা'
                      : 'Authentic statutory definitions from Ministry of Land & SAT Act 1950'}
                  </p>
                </div>
                <a
                  href="https://bhumipedia.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>bhumipedia.land.gov.bd</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(BANGLADESH_LAND_TERMS).map(([key, term]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {isBn ? term.termBn : term.termEn}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-400">
                        {term.phonetic}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isBn ? term.definitionBn : term.definitionEn}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-500/5 p-2 rounded-lg">
                      <strong>{isBn ? 'আইনি তাৎপর্য:' : 'Practical Impact:'}</strong>{' '}
                      {isBn ? term.practicalSignificanceBn : term.practicalSignificanceEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── MODALS ── */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddDocument={handleAddDocumentToActiveCase}
        defaultDistrict={activeCase.districtName}
        defaultUpazila={activeCase.upazilaName}
        defaultMouza={activeCase.mouzaName}
        defaultJl={activeCase.jlNumber}
        isBn={isBn}
      />

      <DueDiligenceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        caseData={activeCase}
        findings={findings}
        isBn={isBn}
      />

    </section>
  );
};
