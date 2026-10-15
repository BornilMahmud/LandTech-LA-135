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
import { DeedAnnotationModal } from './DeedAnnotationModal';


interface DueDiligenceWorkbenchProps {
  isBn: boolean;
  theme?: 'dark' | 'light';
  selectedDistrictId?: string;
  onSelectDistrictById?: (id: string) => void;
}

export const DueDiligenceWorkbench: React.FC<DueDiligenceWorkbenchProps> = ({
  isBn,
  theme = 'light',
  selectedDistrictId,
  onSelectDistrictById,
}) => {
  const isLight = theme === 'light';
  // All cases state, allowing additions of custom documents
  const [cases, setCases] = useState<DueDiligenceCase[]>(AUTHENTIC_DUE_DILIGENCE_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(AUTHENTIC_DUE_DILIGENCE_CASES[0].id);

  // Active view tab inside the case
  const [activeTab, setActiveTab] = useState<'matrix' | 'chain' | 'spatial' | 'roadmap' | 'bhumipedia'>('matrix');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [inspectedDoc, setInspectedDoc] = useState<ExtractedLandDocument | null>(null);

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

  // Handler for Human-in-the-Loop OCR override
  const handleSaveDocumentOverride = (docId: string, updatedFields: Partial<ExtractedLandDocument>) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id === activeCase.id) {
          const updatedDocs = c.documents.map((d) => {
            if (d.id === docId) {
              const patched = { ...d, ...updatedFields };
              // Also sync inspectedDoc if active
              if (inspectedDoc && inspectedDoc.id === docId) {
                setInspectedDoc(patched);
              }
              return patched;
            }
            return d;
          });
          return {
            ...c,
            documents: updatedDocs,
          };
        }
        return c;
      })
    );
  };

  const areaConversions = convertFromDecimals(activeCase.claimedAreaDecimals);

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* ── WORKBENCH TOP HEADER & VALUE PROPOSITION ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <i className="bx bx-shield-quarter text-emerald-600 dark:text-emerald-400 text-sm" aria-hidden="true" />
          <span>
            {isBn
              ? 'ল্যান্ডওয়াইজ অডিট • স্বত্ব ও ক্যাডাস্ট্রাল ভেরিফিকেশন'
              : 'LANDWISE AUDIT • CADASTRAL & TITLE DUE DILIGENCE'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-zinc-950 dark:text-white">
          {isBn ? (
            <>
              জমির স্বত্ব ও রেকর্ড <span className="text-emerald-700 dark:text-emerald-400">ডিজিটাল ক্রস-ভেরিফিকেশন</span>
            </>
          ) : (
            <>
              Land Title Due Diligence & <span className="text-emerald-700 dark:text-emerald-400">Cadastral Verification</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'বিক্রেতার সাফ-কবলা দলিল, আরএস খতিয়ান, ই-নামজারি ও খাজনা দাখিলা স্বয়ংক্রিয়ভাবে ক্রস-যাচাই করে দাগ নম্বর, জমির হিস্যা, মালিকানার ধারাবাহিকতা এবং পরিবেশগত ঝুঁকির সুনির্দিষ্ট প্রমাণ নিরীক্ষা করুন।'
            : 'Cross-examine seller deeds, RS khatians, mutation records, and tax dakhilas. Instantly detect broken title chains, area discrepancies, mismatched dag numbers, and spatial hazards with statutory evidence grounding.'}
        </p>
      </div>

      {/* ── CASE SELECTOR STRIP ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <i className="bx bx-file-find text-emerald-600 dark:text-emerald-400 text-sm" aria-hidden="true" />
            {isBn ? 'বাস্তব কেস স্টাডি নির্বাচন করুন বা নিজস্ব দলিল পরীক্ষা করুন:' : 'Select Real Case Study or Audit Your Own Document:'}
          </span>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
          >
            <i className="bx bx-cloud-upload text-sm" aria-hidden="true" />
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
                    ? isLight
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/25 shadow-sm text-zinc-950 font-semibold'
                      : 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/30 shadow-sm text-white font-semibold'
                    : isLight
                    ? 'bg-white hover:bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-800 shadow-xs'
                    : 'bg-[#121215] hover:bg-[#18181D] border-zinc-800 hover:border-zinc-700 text-zinc-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.riskScore >= 65
                      ? isLight ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      : c.riskScore >= 35
                      ? isLight ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {c.riskScore >= 65
                      ? (isBn ? 'রেড ফ্ল্যাগ' : 'Red Flags')
                      : c.riskScore >= 35
                      ? (isBn ? 'সতর্কতা' : 'Warning')
                      : (isBn ? 'পরিষ্কার স্বত্ব' : 'Clean Title')}
                  </span>
                  <span className={`text-[11px] font-mono font-semibold ${
                    isSelected 
                      ? (isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold') 
                      : (isLight ? 'text-zinc-500' : 'text-zinc-400')
                  }`}>
                    {c.claimedAreaDecimals} Dec
                  </span>
                </div>

                <h4 className={`text-xs leading-snug line-clamp-1 ${
                  isSelected
                    ? isLight ? 'text-zinc-950 font-bold' : 'text-white font-bold'
                    : isLight ? 'text-zinc-800 font-semibold' : 'text-zinc-200 font-semibold'
                }`}>
                  {isBn ? c.caseTitleBn : c.caseTitleEn}
                </h4>

                <div className={`flex items-center gap-1 text-[11px] mt-1 ${
                  isSelected 
                    ? isLight ? 'text-zinc-700 font-medium' : 'text-zinc-300 font-medium' 
                    : isLight ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  <i className={`bx bx-map-pin text-xs shrink-0 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} aria-hidden="true" />
                  <span className="truncate">{c.mouzaName}, {c.districtName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE CASE DOSSIER HERO BANNER ── */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        
        {/* Banner Top Details */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {activeCase.districtName} • {activeCase.upazilaName}
              </span>
              <span className="text-xs text-zinc-500">
                {isBn ? 'মৌজা:' : 'Mouza:'} <strong>{activeCase.mouzaName}</strong> (J.L. #{activeCase.jlNumber})
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
              {isBn ? activeCase.caseTitleBn : activeCase.caseTitleEn}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {isBn ? activeCase.targetPropertyDescriptionBn : activeCase.targetPropertyDescriptionEn}
            </p>
          </div>

          {/* Right KPIs & Download Report Trigger */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            {/* Risk Gauge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
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
                  <span className="text-xs font-normal text-zinc-400">/100</span>
                </span>
              </div>

              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />

              <div>
                {riskAnalysis.score >= 65 ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                    <i className="bx bx-error-circle text-base" aria-hidden="true" />
                    <span>{isBn ? 'উচ্চ ঝুঁকি!' : 'Red Flags Detected'}</span>
                  </div>
                ) : riskAnalysis.score >= 35 ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <i className="bx bx-error text-base" aria-hidden="true" />
                    <span>{isBn ? 'তদন্ত আবশ্যক' : 'Caution Required'}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <i className="bx bx-check-circle text-base" aria-hidden="true" />
                    <span>{isBn ? 'স্বত্ব সুসংগত' : 'Favorable Pre-Screen'}</span>
                  </div>
                )}
                <div className="text-[10px] text-zinc-500">
                  {riskAnalysis.breakdown.criticalCount} Red Flags • {riskAnalysis.breakdown.highCount} Warnings
                </div>
              </div>
            </div>

            {/* Download Verification Report */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-[#121215] hover:bg-[#18181B] text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xs transition-colors"
            >
              <i className="bx bx-download text-sm" aria-hidden="true" />
              <span>{isBn ? 'পূর্ণাঙ্গ রেকর্ড রিপোর্ট ডাউনলোড' : 'Download Verification Report'}</span>
            </button>
          </div>
        </div>

        {/* Quick Area Unit Converter Pill Strip */}
        <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
          isLight ? 'bg-zinc-50/80 border-zinc-200' : 'bg-[#14141A] border-zinc-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {isBn ? 'জমির মোট পরিমাণ:' : 'Claimed Area:'}
            </span>
            <span className={`text-sm sm:text-base font-black ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              {preferredUnit === 'decimals' && `${areaConversions.decimals} Decimals (শতক)`}
              {preferredUnit === 'katha' && `${areaConversions.katha} Katha (কাঠা)`}
              {preferredUnit === 'bigha' && `${areaConversions.bigha} Bigha (বিঘা)`}
              {preferredUnit === 'sqFeet' && `${areaConversions.sqFeet} Sq.Ft. (বর্গফুট)`}
            </span>
          </div>

          <div className={`flex items-center gap-1 p-1 rounded-xl border ${
            isLight ? 'bg-white border-zinc-200' : 'bg-[#181820] border-zinc-800'
          }`}>
            {(['decimals', 'katha', 'bigha', 'sqFeet'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setPreferredUnit(unit)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  preferredUnit === unit
                    ? isLight
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-white text-zinc-950 shadow-xs font-bold'
                    : isLight
                    ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={isLight ? 'text-zinc-800' : 'text-zinc-200'}>
              {isBn ? 'সংযুক্ত নথিপত্র (' + activeCase.documents.length + 'টি)' : 'Submitted Documents (' + activeCase.documents.length + ')'}
            </span>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              <i className="bx bx-plus-circle text-sm" aria-hidden="true" />
              <span>{isBn ? 'আরও নথি যোগ করুন' : 'Add Document to Case'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeCase.documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isBn={isBn}
                theme={theme}
                onInspect={(d) => setInspectedDoc(d)}
                isSelected={inspectedDoc?.id === doc.id}
              />
            ))}
          </div>
        </div>

        {/* ── WORKBENCH BOTTOM FEATURE BOXES (NO SIDE SCROLL — CLEAN RESPONSIVE 5-COLUMN GRID) ── */}
        <div className="pt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-bold uppercase tracking-wider ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              {isBn ? 'তদন্ত ও অডিট ফিচার মডিউল' : 'Investigation & Due-Diligence Feature Modules'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {isBn ? '৫টি সক্রিয় ফিচার' : '5 Modules Available'}
            </span>
          </div>

          {/* 5-Column Responsive Feature Cards Grid — ZERO Side Scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
            {/* Feature Box 1: 12-Field Reconciliation & Red Flags */}
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                activeTab === 'matrix'
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-500 text-zinc-950 ring-2 ring-emerald-500/20 shadow-md font-semibold'
                    : 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/30 shadow-md font-semibold'
                  : isLight
                  ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300 shadow-xs'
                  : 'bg-[#14141A] hover:bg-[#1A1A22] border-zinc-800 text-zinc-300 hover:text-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl border ${
                  isLight ? 'bg-emerald-100/70 border-emerald-200 text-emerald-800' : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                }`}>
                  <i className="bx bx-check-shield text-base" aria-hidden="true" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-mono">
                  {findings.length} {isBn ? 'টি অসঙ্গতি' : 'Red Flags'}
                </span>
              </div>
              <div className="space-y-0.5">
                <h5 className={`text-xs font-bold leading-tight ${activeTab === 'matrix' ? (isLight ? 'text-zinc-950' : 'text-white') : (isLight ? 'text-zinc-900' : 'text-zinc-200')}`}>
                  {isBn ? '১২টি নির্দেশক অডিট' : '12-Field Reconciliation'}
                </h5>
                <p className={`text-[11px] leading-snug ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {isBn ? 'দাগ, খতিয়ান ও নামের অসঙ্গতি ক্রস-চেক' : 'Deed vs Khatian discrepancies'}
                </p>
              </div>
            </button>

            {/* Feature Box 2: Chain of Title Flow */}
            <button
              type="button"
              onClick={() => setActiveTab('chain')}
              className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                activeTab === 'chain'
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-500 text-zinc-950 ring-2 ring-emerald-500/20 shadow-md font-semibold'
                    : 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/30 shadow-md font-semibold'
                  : isLight
                  ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300 shadow-xs'
                  : 'bg-[#14141A] hover:bg-[#1A1A22] border-zinc-800 text-zinc-300 hover:text-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl border ${
                  isLight ? 'bg-teal-100/70 border-teal-200 text-teal-800' : 'bg-teal-950/60 border-teal-800 text-teal-400'
                }`}>
                  <i className="bx bx-git-branch text-base" aria-hidden="true" />
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                  isLight ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-teal-950/60 text-teal-300 border-teal-800'
                }`}>
                  Ancestry
                </span>
              </div>
              <div className="space-y-0.5">
                <h5 className={`text-xs font-bold leading-tight ${activeTab === 'chain' ? (isLight ? 'text-zinc-950' : 'text-white') : (isLight ? 'text-zinc-900' : 'text-zinc-200')}`}>
                  {isBn ? 'স্বত্বলিপির পরম্পরা' : 'Chain of Title Flow'}
                </h5>
                <p className={`text-[11px] leading-snug ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {isBn ? 'মালিকানা হস্তান্তর ও ওয়ারিশান প্রবাহ' : 'Ownership transfer genealogy tree'}
                </p>
              </div>
            </button>

            {/* Feature Box 3: Environmental & Spatial Hazards */}
            <button
              type="button"
              onClick={() => setActiveTab('spatial')}
              className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                activeTab === 'spatial'
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-500 text-zinc-950 ring-2 ring-emerald-500/20 shadow-md font-semibold'
                    : 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/30 shadow-md font-semibold'
                  : isLight
                  ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300 shadow-xs'
                  : 'bg-[#14141A] hover:bg-[#1A1A22] border-zinc-800 text-zinc-300 hover:text-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl border ${
                  isLight ? 'bg-sky-100/70 border-sky-200 text-sky-800' : 'bg-sky-950/60 border-sky-800 text-sky-400'
                }`}>
                  <i className="bx bx-compass text-base" aria-hidden="true" />
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                  isLight ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-sky-950/60 text-sky-300 border-sky-800'
                }`}>
                  Spatial GIS
                </span>
              </div>
              <div className="space-y-0.5">
                <h5 className={`text-xs font-bold leading-tight ${activeTab === 'spatial' ? (isLight ? 'text-zinc-950' : 'text-white') : (isLight ? 'text-zinc-900' : 'text-zinc-200')}`}>
                  {isBn ? 'পরিবেশ ও জোনিং ঝুঁকি' : 'Spatial Hazards'}
                </h5>
                <p className={`text-[11px] leading-snug ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {isBn ? 'বন্যা ঝুঁকি ও মাস্টারপ্ল্যান জোনিং' : 'Flood risk & RAJUK zoning scan'}
                </p>
              </div>
            </button>

            {/* Feature Box 4: Official Verification Roadmap */}
            <button
              type="button"
              onClick={() => setActiveTab('roadmap')}
              className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                activeTab === 'roadmap'
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-500 text-zinc-950 ring-2 ring-emerald-500/20 shadow-md font-semibold'
                    : 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/30 shadow-md font-semibold'
                  : isLight
                  ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300 shadow-xs'
                  : 'bg-[#14141A] hover:bg-[#1A1A22] border-zinc-800 text-zinc-300 hover:text-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl border ${
                  isLight ? 'bg-indigo-100/70 border-indigo-200 text-indigo-800' : 'bg-indigo-950/60 border-indigo-800 text-indigo-400'
                }`}>
                  <i className="bx bx-list-check text-base" aria-hidden="true" />
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                  isLight ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
                }`}>
                  4 Steps
                </span>
              </div>
              <div className="space-y-0.5">
                <h5 className={`text-xs font-bold leading-tight ${activeTab === 'roadmap' ? (isLight ? 'text-zinc-950' : 'text-white') : (isLight ? 'text-zinc-900' : 'text-zinc-200')}`}>
                  {isBn ? '৪-দফা সরকারি গাইড' : 'Gov Verification Guide'}
                </h5>
                <p className={`text-[11px] leading-snug ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {isBn ? 'সাব-রেজিস্ট্রি ও ভূমি অফিসে কী দেখবেন' : 'Official pre-purchase checklist'}
                </p>
              </div>
            </button>

            {/* Feature Box 5: Bhumipedia Legal Glossary */}
            <button
              type="button"
              onClick={() => setActiveTab('bhumipedia')}
              className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                activeTab === 'bhumipedia'
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-500 text-zinc-950 ring-2 ring-emerald-500/20 shadow-md font-semibold'
                    : 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/30 shadow-md font-semibold'
                  : isLight
                  ? 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 hover:border-zinc-300 shadow-xs'
                  : 'bg-[#14141A] hover:bg-[#1A1A22] border-zinc-800 text-zinc-300 hover:text-white shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl border ${
                  isLight ? 'bg-amber-100/70 border-amber-200 text-amber-800' : 'bg-amber-950/60 border-amber-800 text-amber-400'
                }`}>
                  <i className="bx bx-book-bookmark text-base" aria-hidden="true" />
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                  isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950/60 text-amber-300 border-amber-800'
                }`}>
                  Statutory
                </span>
              </div>
              <div className="space-y-0.5">
                <h5 className={`text-xs font-bold leading-tight ${activeTab === 'bhumipedia' ? (isLight ? 'text-zinc-950' : 'text-white') : (isLight ? 'text-zinc-900' : 'text-zinc-200')}`}>
                  {isBn ? 'ভূমিপিডিয়া আইন কোষ' : 'Legal Glossary'}
                </h5>
                <p className={`text-[11px] leading-snug ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {isBn ? 'আইনি ধারা ও দলিলের পরিভাষা' : 'Statutory land acts & definitions'}
                </p>
              </div>
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
              <div className="p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
                    <i className="bx bx-award text-emerald-500 text-base" aria-hidden="true" />
                    <span>{isBn ? 'জমি কেনার পূর্বে ৪-দফা বাধ্যতামূলক সরকারি যাচাইকরণ' : 'Actionable 4-Step Pre-Purchase Verification Roadmap'}</span>
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {isBn
                      ? 'যেকোনো বায়না বা সাফ-কবলা দলিল রেজিস্ট্রেশনের পূর্বে এই সরকারি যাচাইগুলো সম্পন্ন করা আইনত জরুরি'
                      : 'Statutory verification steps every buyer must execute through official Ministry of Land portals'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {OFFICIAL_GOV_VERIFICATION_PORTALS.map((portal) => (
                    <div
                      key={portal.name}
                      className="p-4 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-sm font-semibold text-zinc-950 dark:text-white">
                            {portal.name}
                          </h5>
                          <a
                            href={portal.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          >
                            <i className="bx bx-link-external text-sm" aria-hidden="true" />
                          </a>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          {isBn ? portal.descriptionBn : portal.descriptionEn}
                        </p>
                      </div>

                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 text-zinc-800 dark:text-zinc-200 transition-colors shadow-xs"
                      >
                        <span>{isBn ? 'সরকারি পোর্টালে অনুসন্ধান করুন' : 'Verify on Official Portal'}</span>
                        <i className="bx bx-link-external text-xs" aria-hidden="true" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bhumipedia' && (
            <div className="p-5 rounded-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
                    <i className="bx bx-book-open text-emerald-500 text-base" aria-hidden="true" />
                    <span>{isBn ? 'ভূমিপিডিয়া আইন কোষ ও পরিভাষা গাইড' : 'Bhumipedia Legal Glossary & Terminology'}</span>
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {isBn
                      ? 'ভূমি মন্ত্রণালয় (bhumipedia.land.gov.bd) ও প্রজাস্বত্ব আইন ১৯৫০ এর প্রামাণ্য পরিভাষা'
                      : 'Authentic statutory definitions from Ministry of Land & SAT Act 1950'}
                  </p>
                </div>
                <a
                  href="https://bhumipedia.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>bhumipedia.land.gov.bd</span>
                  <i className="bx bx-link-external text-xs" aria-hidden="true" />
                </a>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(BANGLADESH_LAND_TERMS).map(([key, term]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-2"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h5 className="text-sm font-bold text-zinc-950 dark:text-white">
                        {isBn ? term.termBn : term.termEn}
                      </h5>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {term.phonetic}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {isBn ? term.definitionBn : term.definitionEn}
                    </p>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-500/5 p-2 rounded-lg">
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

      <DeedAnnotationModal
        document={inspectedDoc}
        isOpen={Boolean(inspectedDoc)}
        onClose={() => setInspectedDoc(null)}
        isBn={isBn}
        theme={theme}
        onSaveOverride={handleSaveDocumentOverride}
      />

    </div>
  );
};
