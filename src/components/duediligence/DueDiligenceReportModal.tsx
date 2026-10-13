import React from 'react';
import { DueDiligenceCase, VerificationFinding } from '../../types/dueDiligence';
import { convertFromDecimals } from '../../utils/landUnits';
import { generateMarkdownReport, downloadFile } from '../../utils/reportGenerator';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  FileText,
  MapPin,
  Scale
} from 'lucide-react';

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(caseData, findings);
    downloadFile(md, `LandWise-Due-Diligence-${caseData.id}.md`, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify({ caseData, findings, timestamp: new Date().toISOString() }, null, 2);
    downloadFile(jsonStr, `LandWise-Due-Diligence-${caseData.id}.json`, 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Sticky Action Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-20 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs">
              LANDWISE AI
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {isBn ? 'ডিউ-ডিলিজেন্স অডিট ডসিয়ার' : 'Executive Due-Diligence Dossier'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              <Printer size={14} />
              <span>{isBn ? 'প্রিন্ট / পিডিএফ' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Download size={14} />
              <span>{isBn ? 'রিপোর্ট ডাউনলোড (.md)' : 'Download (.md)'}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
              title="Download JSON Audit"
            >
              JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Dossier Content */}
        <div id="printable-dossier" className="p-6 sm:p-10 space-y-8 text-slate-900 dark:text-slate-100 print:text-black print:p-0">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-emerald-600 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <span>🛡️ LandWise AI • Bangladesh Cadastral Audit</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {isBn ? caseData.caseTitleBn : caseData.caseTitleEn}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-emerald-500" />
                  {caseData.mouzaName} (J.L. {caseData.jlNumber}), {caseData.upazilaName}, {caseData.districtName}
                </span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>•</span>
                <span className="font-mono">Audit ID: {caseData.id}</span>
              </div>
            </div>

            {/* Verdict Gauge */}
            <div className="sm:text-right shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                {isBn ? 'সার্বিক ঝুঁকি সূচক' : 'Overall Hazard Index'}
              </span>
              <div className="flex items-baseline gap-1 sm:justify-end mt-0.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{caseData.riskScore}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <div className="mt-1">
                {caseData.riskScore >= 65 ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    <ShieldAlert size={14} />
                    {isBn ? 'উচ্চ ঝুঁকি (Red Flags)' : 'High Hazard Alert'}
                  </span>
                ) : caseData.riskScore >= 35 ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <AlertTriangle size={14} />
                    {isBn ? 'সতর্কতা প্রয়োজন' : 'Caution Required'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck size={14} />
                    {isBn ? 'স্বত্বলিপি সুসংগত' : 'Favorable Pre-Screen'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mandatory Legal Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
              <Scale size={15} />
              <span>{isBn ? 'আইনগত দায়মুক্তি ও ব্যবহারের সীমাবদ্ধতা:' : 'Mandatory Statutory Due-Diligence Disclaimer:'}</span>
            </div>
            <p>
              {isBn
                ? 'ল্যান্ডওয়াইজ এআই একটি সহায়ক প্রযুক্তি প্ল্যাটফর্ম। এটি কোনো সরকারি স্বত্ব সনদ নয় এবং ফৌজদারি প্রতারণা বা জালিয়াতি চূড়ান্তভাবে প্রতিষ্ঠা করে না। সহকারী কমিশনার (ভূমি) অফিস, সাব-রেজিস্ট্রি অফিস বা ডিএলআরএস-এর আনুষ্ঠানিক তল্লাশি ও রেজিস্টার পরীক্ষার কোনো বিকল্প নেই। যেকোনো আর্থিক লেনদেনের পূর্বে অবশ্যই বাংলাদেশ বার কাউন্সিলের তালিকাভুক্ত দক্ষ আইনজীবীর পরামর্শ গ্রহণ করুন।'
                : 'LandWise AI is an assistive pre-purchase due-diligence screening engine. It does not certify official title ownership, declare criminal fraud, or substitute for formal searches at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms. Prospective purchasers must engage a qualified Advocate / Legal Professional prior to executing contracts or disbursing funds.'}
            </p>
          </div>

          {/* Property & Area Specification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'দাবীকৃত জমি' : 'Claimed Area'}</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{caseData.claimedAreaDecimals} {isBn ? 'শতক' : 'Decimals'}</span>
              <span className="block text-[11px] text-slate-500">{units.katha} Katha • {units.sqFeet} Sq.Ft.</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'প্রস্তাবিত পণমূল্য' : 'Proposed Price'}</span>
              <span className="text-base font-black text-slate-900 dark:text-white">৳ {caseData.proposedSellingPriceBdt.toLocaleString('en-IN')}</span>
              <span className="block text-[11px] text-slate-500">৳ {Math.round(caseData.proposedSellingPriceBdt / caseData.claimedAreaDecimals).toLocaleString('en-IN')}/Dec</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'মৌজা ও জে.এল.' : 'Mouza & J.L.'}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{caseData.mouzaName}</span>
              <span className="block text-[11px] text-slate-500">J.L. No. {caseData.jlNumber}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'জোনিং শ্রেণি' : 'Zoning Class'}</span>
              <span className="text-sm font-bold capitalize text-slate-900 dark:text-white">{caseData.spatialRisk.zoningClassification}</span>
              <span className="block text-[11px] text-slate-500">{caseData.spatialRisk.roadAccessWidthFeet} ft {caseData.spatialRisk.roadType}</span>
            </div>
          </div>

          {/* Critical Red Flags Section */}
          {criticalFindings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertOctagon size={16} />
                <span>{isBn ? 'মারাত্মক আইনগত রেড ফ্ল্যাগ' : 'Critical Title Red Flags'} ({criticalFindings.length})</span>
              </h3>
              <div className="space-y-2.5">
                {criticalFindings.map((f, i) => (
                  <div key={f.id} className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-1">
                    <div className="font-bold text-rose-900 dark:text-rose-200">
                      {i + 1}. {isBn ? f.titleBn : f.titleEn}
                    </div>
                    <p className="text-rose-800 dark:text-rose-300">
                      {isBn ? f.descriptionBn : f.descriptionEn}
                    </p>
                    {f.evidenceSnippet && (
                      <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-1.5 rounded">
                        <strong>Evidence:</strong> {f.evidenceSnippet}
                      </div>
                    )}
                    <div className="text-[11px] font-semibold text-rose-900 dark:text-rose-200 pt-1">
                      <strong>Mandatory Action:</strong> {isBn ? f.recommendedActionBn : f.recommendedActionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* High Warnings Section */}
          {highWarnings.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={16} />
                <span>{isBn ? 'উচ্চ সতর্কতা ও গরমিল' : 'High Discrepancy Warnings'} ({highWarnings.length})</span>
              </h3>
              <div className="space-y-2">
                {highWarnings.map((f, i) => (
                  <div key={f.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                    <div className="font-bold text-amber-950 dark:text-amber-100">
                      {i + 1}. {isBn ? f.titleBn : f.titleEn}
                    </div>
                    <p className="text-amber-800 dark:text-amber-300">
                      {isBn ? f.descriptionBn : f.descriptionEn}
                    </p>
                    <div className="text-[11px] font-medium text-amber-900 dark:text-amber-200">
                      <strong>Action:</strong> {isBn ? f.recommendedActionBn : f.recommendedActionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Evidence */}
          {verifiedEvidence.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>{isBn ? 'যাচাইকৃত সামঞ্জস্য প্রমাণ' : 'Verified Evidence Points'} ({verifiedEvidence.length})</span>
              </h3>
              <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {verifiedEvidence.map((f) => (
                  <li key={f.id}>
                    <strong>{isBn ? f.titleBn : f.titleEn}:</strong> {isBn ? f.descriptionBn : f.descriptionEn}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Document Inventory Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'নিরীক্ষিত নথিপত্রের তালিকা' : 'Submitted Document Inventory'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-2 border-b border-slate-200 dark:border-slate-800">Type</th>
                    <th className="p-2 border-b border-slate-200 dark:border-slate-800">Serial No.</th>
                    <th className="p-2 border-b border-slate-200 dark:border-slate-800">Office</th>
                    <th className="p-2 border-b border-slate-200 dark:border-slate-800">Area (Dec)</th>
                    <th className="p-2 border-b border-slate-200 dark:border-slate-800">Owner/Seller</th>
                    <th className="p-2 border-b border-slate-200 dark:border-slate-800">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {caseData.documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="p-2 font-medium">{doc.titleEn}</td>
                      <td className="p-2 font-mono">#{doc.documentNumber}</td>
                      <td className="p-2 text-slate-500">{doc.issueOffice}</td>
                      <td className="p-2 font-bold">{doc.landAreaDecimals}</td>
                      <td className="p-2">{doc.primaryOwnerName}</td>
                      <td className="p-2 capitalize font-semibold">{doc.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official 4-Step Verification Roadmap */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{isBn ? 'ক্রেতার জন্য চূড়ান্ত ৪-দফা সরকারি ভেরিফিকেশন রোডম্যাপ:' : 'Actionable 4-Step Official Verification Roadmap for Buyer:'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-emerald-600 block">1. ePorcha (eporcha.gov.bd)</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Search Khatian numbers in the digitized District Record Room to confirm that the Porcha exists in government records.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-indigo-600 block">2. AC (Land) Register IX</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Audit Register 9 at the Upazila Land Office to verify that the DCR receipt and Namjari case are genuine and uninterrupted.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-amber-600 block">3. Sub-Registry Index II Search</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Conduct a formal 12 to 25 year encumbrance search (তল্লাশি) at the Sub-Registry Office to uncover duplicate deeds or undisclosed bank mortgages.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-sky-600 block">4. DLRS Map Order (map.settlement.gov.bd)</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Procure certified Mouza map sheet and commission a licensed Amin / Surveyor to measure physical corner boundary points.
                </p>
              </div>
            </div>
          </div>

          {/* Footer watermark */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
            <div>LandWise AI — Bangladesh Land Due-Diligence Assistant</div>
            <div>Generated with evidence grounding from Ministry of Land & DLRS records</div>
          </div>

        </div>

      </div>
    </div>
  );
};
