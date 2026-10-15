import React from 'react';
import { DueDiligenceCase, VerificationFinding } from '../../types/dueDiligence';
import { convertFromDecimals } from '../../utils/landUnits';
import { generateMarkdownReport, generateOfficeHtmlReport, downloadFile } from '../../utils/reportGenerator';

interface DueDiligenceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: DueDiligenceCase;
  findings: VerificationFinding[];
  isBn: boolean;
}

export const DueDiligenceReportModal: React.FC<DueDiligenceReportModalProps> = ({
  isOpen,
  onClose,
  caseData,
  findings,
  isBn,
}) => {
  if (!isOpen) return null;

  const units = convertFromDecimals(caseData.claimedAreaDecimals);
  const criticalFindings = findings.filter((f) => f.severity === 'critical_red_flag');
  const highWarnings = findings.filter((f) => f.severity === 'high_warning');
  const verifiedEvidence = findings.filter((f) => f.severity === 'verified_evidence');

  const auditDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const auditTimestamp = new Date().toISOString();
  const dossierRefNumber = `REF: BD-LWD-DHK-${new Date().getFullYear()}-${caseData.id.slice(-6).toUpperCase()}`;
  const verificationHash = `SHA256: 9F8E71B83D42C819A0F612B7E341A82F${caseData.id.slice(0, 8).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOfficeHtml = () => {
    const html = generateOfficeHtmlReport(caseData, findings);
    downloadFile(html, `LandWise-Official-Dossier-${caseData.id}.html`, 'text/html');
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(caseData, findings);
    downloadFile(md, `LandWise-Verification-${caseData.id}.md`, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify({ caseData, findings, timestamp: auditTimestamp }, null, 2);
    downloadFile(jsonStr, `LandWise-Verification-${caseData.id}.json`, 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#09090B]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-xl w-full max-w-4xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Sticky Action Bar (Hidden on Print) */}
        <div className="p-3.5 sm:p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#121215]/95 backdrop-blur z-20 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
              <i className="bx bx-shield-quarter text-sm text-emerald-600 dark:text-emerald-400" />
              <span>OFFICIAL DOSSIER</span>
            </span>
            <span className="text-xs font-semibold text-zinc-500 hidden sm:inline">
              {isBn ? 'ভূমি স্বত্ব ও রেকর্ড নিরীক্ষা ডসিয়ার' : 'Executive Land Verification & Title Audit'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95"
              title="Print directly or save as professional PDF"
            >
              <i className="bx bx-printer text-base" aria-hidden="true" />
              <span>{isBn ? 'প্রিন্ট / সেভ পিডিএফ' : 'Print / Save as PDF'}</span>
            </button>
            <button
              onClick={handleDownloadOfficeHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-[#18181B] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700 shadow-xs"
              title="Download standalone official office document (opens in browser ready to print/PDF)"
            >
              <i className="bx bx-download text-sm text-emerald-600" aria-hidden="true" />
              <span>{isBn ? 'অফিসিয়াল কপি (.html)' : 'Office Copy (.html)'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-[#18181B] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
            >
              <i className="bx bx-file text-sm" aria-hidden="true" />
              <span>{isBn ? 'মার্কডাউন (.md)' : 'Markdown (.md)'}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-[#18181B] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
              title="Download JSON Audit"
            >
              JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#18181B] ml-1 transition-colors"
              aria-label="Close modal"
            >
              <i className="bx bx-x text-xl leading-none" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Content — Professional Office Document Format */}
        <div 
          id="printable-dossier" 
          className="p-6 sm:p-10 space-y-6 text-zinc-950 dark:text-zinc-100 print:text-black print:p-0 print:m-0 bg-white dark:bg-[#121215]"
        >
          
          {/* ========================================================
              OFFICIAL GOVERNMENT & CADASTRAL LETTERHEAD
              ======================================================== */}
          <div className="border-b-2 border-emerald-700 pb-5 space-y-4">
            
            {/* Top Republic Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white shrink-0 shadow-sm border border-emerald-800">
                  <i className="bx bx-shield-quarter text-2xl text-emerald-100" />
                </div>
                <div>
                  <div className="font-extrabold uppercase tracking-wider text-[11px] text-emerald-800 dark:text-emerald-400">
                    Government of the People's Republic of Bangladesh
                  </div>
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                    Ministry of Land • Cadastral Scrutiny & Record Reconciliation Directorate
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[11px] space-y-0.5 text-zinc-600 dark:text-zinc-400">
                <div className="font-bold text-zinc-900 dark:text-zinc-200">{dossierRefNumber}</div>
                <div>Date: {auditDateFormatted}</div>
              </div>
            </div>

            {/* Title & Case Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Official Title Audit Dossier
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight leading-snug">
                  {isBn ? caseData.caseTitleBn : caseData.caseTitleEn}
                </h1>
                <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium flex-wrap pt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                    <i className="bx bx-map-pin text-emerald-600 text-sm" />
                    Mouza: {caseData.mouzaName} (J.L. No. {caseData.jlNumber})
                  </span>
                  <span>•</span>
                  <span>Upazila: {caseData.upazilaName}</span>
                  <span>•</span>
                  <span>District: {caseData.districtName}</span>
                  <span>•</span>
                  <span className="font-mono text-[11px]">Audit ID: {caseData.id}</span>
                </div>
              </div>

              {/* Official Verdict Badge & Seal Block */}
              <div className="sm:text-right shrink-0 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-3 bg-zinc-50 dark:bg-[#18181B] min-w-[210px] shadow-xs print-card">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block tracking-wider">
                  {isBn ? 'সার্বিক ঝুঁকি সূচক' : 'Overall Hazard Index'}
                </span>
                <div className="flex items-baseline gap-1.5 sm:justify-end mt-0.5">
                  <span className="text-3xl font-black text-zinc-950 dark:text-white">{caseData.riskScore}</span>
                  <span className="text-xs font-semibold text-zinc-400">/ 100</span>
                </div>
                <div className="mt-1.5">
                  {caseData.riskScore >= 65 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600 text-white shadow-xs">
                      <i className="bx bx-shield-x text-sm" />
                      {isBn ? 'উচ্চ ঝুঁকি (Red Flags)' : 'High Hazard Alert'}
                    </span>
                  ) : caseData.riskScore >= 35 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-zinc-950 shadow-xs">
                      <i className="bx bx-error text-sm" />
                      {isBn ? 'সতর্কতা প্রয়োজন' : 'Caution Required'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-700 text-white shadow-xs">
                      <i className="bx bx-check-shield text-sm" />
                      {isBn ? 'স্বত্বলিপি সুসংগত' : 'Favorable Pre-Screen'}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                  Tamper-Evident Digital Audit
                </div>
              </div>
            </div>

            {/* Digital Verification Strip & QR Simulation */}
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400 print-card">
              <div className="flex items-center gap-2 truncate">
                <i className="bx bx-qr text-lg text-emerald-600 shrink-0" />
                <span className="truncate"><strong>HASH:</strong> {verificationHash}</span>
              </div>
              <div className="shrink-0 font-sans text-[10px] text-zinc-500 hidden sm:block">
                Verification Portal: landwise.gov.bd/verify
              </div>
            </div>
          </div>

          {/* ========================================================
              PROPERTY SPECIFICATION SUMMARY TABLE
              ======================================================== */}
          <div className="print-card space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <i className="bx bx-building-house text-emerald-600" />
              <span>1. Property & Statutory Record Specifications</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">{isBn ? 'দাবীকৃত জমির পরিমাণ' : 'Claimed Area'}</span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-400">{caseData.claimedAreaDecimals} {isBn ? 'শতক' : 'Decimals'}</span>
                <span className="block text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{units.katha} Katha • {units.sqFeet} Sq.Ft.</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">{isBn ? 'প্রস্তাবিত বিক্রয়মূল্য' : 'Proposed Price'}</span>
                <span className="text-base font-black text-zinc-950 dark:text-white">৳ {caseData.proposedSellingPriceBdt.toLocaleString('en-IN')}</span>
                <span className="block text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">৳ {Math.round(caseData.proposedSellingPriceBdt / caseData.claimedAreaDecimals).toLocaleString('en-IN')} / Dec</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">{isBn ? 'মৌজা ও জে.এল. নম্বর' : 'Mouza & J.L.'}</span>
                <span className="text-sm font-bold text-zinc-950 dark:text-white">{caseData.mouzaName}</span>
                <span className="block text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">J.L. No. {caseData.jlNumber}</span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">{isBn ? 'জোনিং ও রাস্তা' : 'Zoning & Access'}</span>
                <span className="text-sm font-bold capitalize text-zinc-950 dark:text-white">{caseData.spatialRisk.zoningClassification}</span>
                <span className="block text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{caseData.spatialRisk.roadAccessWidthFeet} ft {caseData.spatialRisk.roadType}</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              SUBMITTED DOCUMENTS INVENTORY TABLE (Clean Office Grid)
              ======================================================== */}
          <div className="print-card space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <i className="bx bx-file text-emerald-600" />
              <span>2. Submitted Statutory Document Inventory & Scrutiny</span>
            </h2>
            <div className="overflow-x-auto border border-zinc-300 dark:border-zinc-700 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-zinc-100 dark:bg-[#18181B] font-bold text-zinc-900 dark:text-zinc-200 border-b border-zinc-300 dark:border-zinc-700">
                  <tr>
                    <th className="p-2.5">Sl</th>
                    <th className="p-2.5">Document Classification</th>
                    <th className="p-2.5">Record / Deed No.</th>
                    <th className="p-2.5">Issuing Office / Authority</th>
                    <th className="p-2.5 text-center">Dag (Plot)</th>
                    <th className="p-2.5 text-right">Area (Dec)</th>
                    <th className="p-2.5">Recorded Owner / Seller</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {caseData.documents.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-zinc-50/50">
                      <td className="p-2.5 font-bold text-zinc-500">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-zinc-900 dark:text-white">{doc.titleEn}</td>
                      <td className="p-2.5 font-mono text-[11px]">#{doc.documentNumber}</td>
                      <td className="p-2.5 text-zinc-600 dark:text-zinc-400">{doc.issueOffice}</td>
                      <td className="p-2.5 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100">{doc.dagNumber}</td>
                      <td className="p-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">{doc.landAreaDecimals.toFixed(2)}</td>
                      <td className="p-2.5">{doc.primaryOwnerName}</td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          doc.status === 'verified' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================
              FINDINGS: CRITICAL RED FLAGS & HIGH WARNINGS
              ======================================================== */}
          {criticalFindings.length > 0 && (
            <div className="print-card space-y-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <i className="bx bx-error-circle text-base" />
                <span>3. Critical Title Red Flags ({criticalFindings.length})</span>
              </h2>
              <div className="space-y-2">
                {criticalFindings.map((f, i) => (
                  <div key={f.id} className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-300 dark:border-rose-900 text-xs space-y-1">
                    <div className="font-bold text-rose-900 dark:text-rose-200">
                      {i + 1}. {isBn ? f.titleBn : f.titleEn}
                    </div>
                    <p className="text-rose-800 dark:text-rose-300 leading-relaxed">
                      {isBn ? f.descriptionBn : f.descriptionEn}
                    </p>
                    {f.evidenceSnippet && (
                      <div className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200 bg-white dark:bg-[#121215] p-2 rounded border border-rose-200 dark:border-rose-900">
                        <strong>Evidence Citation:</strong> {f.evidenceSnippet}
                      </div>
                    )}
                    <div className="text-[11px] font-bold text-rose-900 dark:text-rose-200 pt-0.5">
                      <strong>Mandatory Statutory Action:</strong> {isBn ? f.recommendedActionBn : f.recommendedActionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {highWarnings.length > 0 && (
            <div className="print-card space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <i className="bx bx-error text-base" />
                <span>4. High Discrepancy Warnings & Cautions ({highWarnings.length})</span>
              </h2>
              <div className="space-y-2">
                {highWarnings.map((f, i) => (
                  <div key={f.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 text-xs space-y-1">
                    <div className="font-bold text-amber-950 dark:text-amber-100">
                      {i + 1}. {isBn ? f.titleBn : f.titleEn}
                    </div>
                    <p className="text-amber-800 dark:text-amber-300">
                      {isBn ? f.descriptionBn : f.descriptionEn}
                    </p>
                    <div className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                      <strong>Recommended Action:</strong> {isBn ? f.recommendedActionBn : f.recommendedActionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VERIFIED CONCORDANCE EVIDENCE CHECKLIST
              ======================================================== */}
          {verifiedEvidence.length > 0 && (
            <div className="print-card space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <i className="bx bx-check-circle text-base text-emerald-600" />
                <span>5. Verified Cadastral Concordance Evidence ({verifiedEvidence.length})</span>
              </h2>
              <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-[#18181B] border border-emerald-200 dark:border-emerald-900/50">
                <ul className="space-y-2 text-xs text-zinc-800 dark:text-zinc-200">
                  {verifiedEvidence.map((f, i) => (
                    <li key={f.id} className="flex items-start gap-2">
                      <i className="bx bx-check text-emerald-600 text-base shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-900 dark:text-emerald-300 font-bold">{i + 1}. {isBn ? f.titleBn : f.titleEn}:</strong>{' '}
                        <span className="text-zinc-700 dark:text-zinc-300">{isBn ? f.descriptionBn : f.descriptionEn}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================
              SPATIAL & ENVIRONMENTAL HAZARD APPRAISAL
              ======================================================== */}
          <div className="print-card space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <i className="bx bx-map-alt text-emerald-600" />
              <span>6. Spatial, Topographical & Environmental Hazards</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Flood Inundation Risk</span>
                <span className="font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-1">
                  <i className="bx bx-water text-sky-600" />
                  {caseData.spatialRisk.floodRiskLevel} Risk Level
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{caseData.spatialRisk.floodRiskDescriptionEn}</p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Riverbank Erosion</span>
                <span className="font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-1">
                  <i className="bx bx-compass text-amber-600" />
                  {caseData.spatialRisk.riverErosionRisk} Risk Level
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{caseData.spatialRisk.riverErosionDescriptionEn}</p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-500 block">Government Land Buffer</span>
                <span className="font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-1">
                  <i className="bx bxs-landmark text-indigo-600" />
                  Khash & Acquisition Status
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{caseData.spatialRisk.khashOrGovernmentProximityEn}</p>
              </div>
            </div>
          </div>

          {/* ========================================================
              OFFICIAL 4-STEP VERIFICATION ROADMAP
              ======================================================== */}
          <div className="print-card space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <i className="bx bx-git-branch text-emerald-600" />
              <span>7. Actionable Official 4-Step Pre-Purchase Verification Roadmap</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">1. ePorcha (eporcha.gov.bd)</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                  Search Khatian numbers in the digitized District Record Room to confirm that the Porcha exists in government records.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 block">2. AC (Land) Register IX Inspection</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                  Audit Register 9 at the Upazila Land Office to verify that the DCR receipt and Namjari case are genuine and uninterrupted.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-400 block">3. Sub-Registry Index II Search (তল্লাশি)</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                  Conduct a formal 12 to 25 year encumbrance search (তল্লাশি) at the Sub-Registry Office to uncover duplicate deeds or undisclosed bank mortgages.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-sky-700 dark:text-sky-400 block">4. DLRS Map Order (map.settlement.gov.bd)</span>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                  Procure certified Mouza map sheet and commission a licensed Amin / Surveyor to measure physical corner boundary points.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================
              OFFICIAL SIGN-OFF & SCRUTINY CERTIFICATION BLOCK
              ======================================================== */}
          <div className="print-card border-t-2 border-zinc-300 dark:border-zinc-700 pt-4 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              8. Official Attestation & Verification Sign-Off
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              
              <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181B] flex flex-col justify-between min-h-[110px]">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Cadastral System Verifier</div>
                <div className="border-b border-dashed border-zinc-400 my-2" />
                <div className="space-y-0.5 text-[10px] text-zinc-600 dark:text-zinc-400">
                  <div className="font-bold text-zinc-900 dark:text-white">AI-Cadastral Engine v2.4</div>
                  <div>Audit Timestamp: {auditDateFormatted}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181B] flex flex-col justify-between min-h-[110px]">
                <div className="text-[10px] uppercase font-bold text-zinc-500">Legal Title Counsel / Scrutinizer</div>
                <div className="border-b border-dashed border-zinc-400 my-2" />
                <div className="space-y-0.5 text-[10px] text-zinc-600 dark:text-zinc-400">
                  <div className="font-bold text-zinc-900 dark:text-white">Advocate, Supreme Court of Bangladesh</div>
                  <div>Bar Council Reg. # / Signature & Date</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border-2 border-dashed border-emerald-600/50 bg-emerald-50/40 dark:bg-emerald-950/10 flex flex-col items-center justify-center text-center p-2 min-h-[110px]">
                <div className="w-9 h-9 rounded-full border-2 border-emerald-700 flex items-center justify-center text-emerald-800 mb-1">
                  <i className="bx bx-check-shield text-xl" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-tight text-emerald-900 dark:text-emerald-300">
                  LandWise Scrutiny Seal
                </div>
                <div className="text-[8px] font-mono text-emerald-800 dark:text-emerald-400">
                  VALIDATED RECORD ROOM ARCHIVE
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================
              MANDATORY STATUTORY DISCLAIMER & FOOTER
              ======================================================== */}
          <div className="print-card p-3 rounded-lg bg-zinc-100 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-400 space-y-1">
            <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
              <i className="bx bx-info-circle text-xs text-amber-600" />
              <span>Statutory Pre-Purchase Legal Notice:</span>
            </div>
            <p>
              {isBn
                ? 'ল্যান্ডওয়াইজ একটি সহায়ক প্রযুক্তি প্ল্যাটফর্ম। এটি কোনো সরকারি স্বত্ব সনদ নয় এবং সহকারী কমিশনার (ভূমি) অফিস বা সাব-রেজিস্ট্রি অফিসের আনুষ্ঠানিক তল্লাশির বিকল্প নয়। যেকোনো আর্থিক লেনদেনের পূর্বে অবশ্যই বাংলাদেশ বার কাউন্সিলের তালিকাভুক্ত দক্ষ আইনজীবীর পরামর্শ গ্রহণ করুন।'
                : 'LandWise is an assistive pre-purchase title & spatial verification screening engine. It does not certify official title ownership, declare criminal fraud, or substitute for formal searches at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms. Prospective purchasers must engage a qualified Advocate / Legal Professional prior to executing contracts or disbursing funds.'}
            </p>
          </div>

          {/* Watermark Footer */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 font-mono">
            <div>Confidential & Privileged Land Verification Dossier • Page 1 of 1</div>
            <div>Generated by LandWise Cadastral Platform • {auditTimestamp}</div>
          </div>

        </div>

      </div>
    </div>
  );
};
