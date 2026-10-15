import React, { useState } from 'react';
import {
  VerificationFinding,
  FindingSeverity,
  ExtractedLandDocument,
} from '../../types/dueDiligence';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Filter,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CrossVerificationMatrixProps {
  findings: VerificationFinding[];
  documents: ExtractedLandDocument[];
  claimedAreaDecimals: number;
  isBn: boolean;
}

export const CrossVerificationMatrix: React.FC<CrossVerificationMatrixProps> = ({
  findings,
  documents,
  claimedAreaDecimals,
  isBn,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<FindingSeverity | 'all'>('all');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const filteredFindings = findings.filter((f) => {
    if (filterSeverity === 'all') return true;
    return f.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case 'critical_red_flag':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <AlertOctagon size={13} />
            <span>{isBn ? 'মারাত্মক ঝুঁকি (Red Flag)' : 'Critical Red Flag'}</span>
          </span>
        );
      case 'high_warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle size={13} />
            <span>{isBn ? 'উচ্চ সতর্কতা (Warning)' : 'High Warning'}</span>
          </span>
        );
      case 'moderate_inconsistency':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            <HelpCircle size={13} />
            <span>{isBn ? 'অসঙ্গতি' : 'Inconsistency'}</span>
          </span>
        );
      case 'verified_evidence':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={13} />
            <span>{isBn ? 'যাচাইকৃত প্রমাণ' : 'Verified Evidence'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. 12-CRITICAL-IDENTIFIERS CROSS-COMPARISON TABLE ── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Layers className="text-emerald-500" size={18} />
              <span>{isBn ? '১২টি মৌলিক নির্দেশকের বহুস্তরীয় তুলনা' : '12-Field Multi-Document Cross-Reconciliation'}</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
              {isBn
                ? 'দলিল, আরএস খতিয়ান, নামজারি পর্চা এবং দাখিলার মধ্যকার তুলনামূলক নিরীক্ষা'
                : 'Direct side-by-side audit across Deed, RS Khatian, e-Mutation, and Tax Dakhila'}
            </p>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            <strong>{documents.length}</strong> {isBn ? 'টি নথি যাচাইাধীন' : 'Records Indexed'}
          </div>
        </div>

        {/* Responsive Cross-Check Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-[#18181B]">
                <th className="py-2.5 px-3 font-bold">{isBn ? 'আইনি নির্দেশক' : 'Critical Identifier'}</th>
                {documents.map((doc) => (
                  <th key={doc.id} className="py-2.5 px-3 font-bold truncate max-w-[160px]">
                    {isBn ? doc.titleBn : doc.titleEn}
                    <span className="block font-normal text-[10px] text-zinc-600 dark:text-zinc-300">
                      #{doc.documentNumber}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {/* Row 1: Mouza & JL */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-950 dark:text-zinc-200">
                  {isBn ? 'মৌজা ও জে.এল. নম্বর' : 'Mouza & J.L. No.'}
                </td>
                {documents.map((doc) => (
                  <td key={doc.id} className="py-2.5 px-3">
                    {doc.mouzaName} (J.L. {doc.jlNumber})
                  </td>
                ))}
              </tr>

              {/* Row 2: Dag / Plot Number */}
              <tr className="bg-zinc-50/50 dark:bg-[#18181B]/20">
                <td className="py-2.5 px-3 font-semibold text-zinc-950 dark:text-zinc-200">
                  {isBn ? 'দাগ নম্বর (প্লট)' : 'Dag / Plot No.'}
                </td>
                {documents.map((doc) => (
                  <td key={doc.id} className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {doc.dagNumber}
                    {doc.dagType && (
                      <span className="ml-1 text-[10px] font-normal uppercase text-zinc-600 dark:text-zinc-300">
                        ({doc.dagType})
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 3: Stated Area */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-950 dark:text-zinc-200">
                  {isBn ? 'নথিবদ্ধ জমির পরিমাণ' : 'Stated Land Area'}
                </td>
                {documents.map((doc) => (
                  <td key={doc.id} className="py-2.5 px-3 font-bold text-zinc-950 dark:text-zinc-100">
                    {doc.subjectTransferredAreaDecimals || doc.landAreaDecimals} {isBn ? 'শতক' : 'Dec'}
                  </td>
                ))}
              </tr>

              {/* Row 4: Owner / Seller Identity */}
              <tr className="bg-zinc-50/50 dark:bg-[#18181B]/20">
                <td className="py-2.5 px-3 font-semibold text-zinc-950 dark:text-zinc-200">
                  {isBn ? 'মালিক / বিক্রেতার নাম' : 'Recorded Owner / Seller'}
                </td>
                {documents.map((doc) => (
                  <td key={doc.id} className="py-2.5 px-3">
                    <span className="font-semibold">{doc.sellerOrDonorName || doc.primaryOwnerName}</span>
                    {doc.ownerFatherOrHusbandName && (
                      <span className="block text-[11px] text-zinc-600 dark:text-zinc-300">
                        {isBn ? 'পিতা:' : 'f:'} {doc.ownerFatherOrHusbandName}
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 5: Issuing Office */}
              <tr>
                <td className="py-2.5 px-3 font-semibold text-zinc-950 dark:text-zinc-200">
                  {isBn ? 'ইস্যুকারী কার্যালয়' : 'Office of Record'}
                </td>
                {documents.map((doc) => (
                  <td key={doc.id} className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300 text-[11px]">
                    {doc.issueOffice}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 2. AUDIT FINDINGS, EVIDENCE & ACTION ROADMAP ── */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={18} />
              <span>{isBn ? 'নিরীক্ষা ফলাফল ও সত্যতা বিশ্লেষণ' : 'Detailed Audit Findings & Evidence Log'}</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
              {isBn
                ? 'আইনগত অসংগতি, নিখোঁজ দলিল এবং সরকারি অফিস ভিত্তিক সমাধানের নির্দেশিকা'
                : 'Identified title risks, missing records, and recommended official verification steps'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-1 mr-1">
              <Filter size={12} />
              {isBn ? 'ফিল্টার:' : 'Filter:'}
            </span>
            {(['all', 'critical_red_flag', 'high_warning', 'verified_evidence'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterSeverity === sev
                    ? 'bg-[#121215] text-white dark:bg-white dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-[#18181B] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {sev === 'all' && (isBn ? 'সকল' : 'All')}
                {sev === 'critical_red_flag' && (isBn ? 'রেড ফ্ল্যাগ' : 'Red Flags')}
                {sev === 'high_warning' && (isBn ? 'সতর্কতা' : 'Warnings')}
                {sev === 'verified_evidence' && (isBn ? 'যাচাইকৃত' : 'Verified')}
              </button>
            ))}
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-3">
          {filteredFindings.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 dark:text-zinc-300 text-xs">
              {isBn ? 'এই বিভাগে কোনো ফলাফল নেই।' : 'No findings in this category.'}
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const isExpanded = expandedFindingId === finding.id;

              return (
                <div
                  key={finding.id}
                  className={`p-4 rounded-xl border transition-all ${
                    finding.severity === 'critical_red_flag'
                      ? 'bg-rose-500/5 border-rose-500/30'
                      : finding.severity === 'high_warning'
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : finding.severity === 'verified_evidence'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-zinc-50 dark:bg-[#18181B] border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div
                    onClick={() => setExpandedFindingId(isExpanded ? null : finding.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getSeverityBadge(finding.severity)}
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                          {finding.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-950 dark:text-white pt-1">
                        {isBn ? finding.titleBn : finding.titleEn}
                      </h4>
                    </div>

                    <button
                      className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
                    {isBn ? finding.descriptionBn : finding.descriptionEn}
                  </p>

                  {/* Evidence Snippet */}
                  {finding.evidenceSnippet && (
                    <div className="mt-2.5 p-2 rounded-lg bg-[#121215]/5 dark:bg-[#09090B]/40 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-300 block mb-0.5">
                        {isBn ? 'দলিলভিত্তিক প্রমাণ:' : 'Document Evidence:'}
                      </span>
                      {finding.evidenceSnippet}
                    </div>
                  )}

                  {/* Action and Portal Link */}
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="text-zinc-700 dark:text-zinc-300">
                      <strong className="text-zinc-950 dark:text-zinc-100">
                        {isBn ? 'করণীয় পদক্ষেপ:' : 'Mandatory Action:'}
                      </strong>{' '}
                      {isBn ? finding.recommendedActionBn : finding.recommendedActionEn}
                    </div>

                    {finding.officialVerificationPortal && (
                      <a
                        href={finding.officialVerificationPortal.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#121215] text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shrink-0 transition-colors shadow-sm"
                      >
                        <span>{finding.officialVerificationPortal.name}</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
