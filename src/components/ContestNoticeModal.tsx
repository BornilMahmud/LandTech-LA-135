import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Languages, 
  Award,
  Terminal
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../locales/translations';

interface ContestNoticeModalProps {
  language: Language;
  onClose: () => void;
}

export const ContestNoticeModal: React.FC<ContestNoticeModalProps> = ({
  language,
  onClose,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        role="dialog"
        aria-labelledby="contest-modal-title"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 id="contest-modal-title" className="text-base sm:text-lg font-black text-white">
              {t.contest.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1">
          {/* Rule Compliance Highlight */}
          <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Hackathon Rules & Offline Compliance</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              {t.contest.ruleNotice}
            </p>
          </div>

          {/* 3-Minute Demonstration Plan for Judges */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>3-Minute Live Judge Demonstration Plan</span>
            </h3>
            <ol className="space-y-2 list-decimal list-inside text-slate-300">
              <li>
                <strong>Minute 1: Bangladesh Map Explorer & Search</strong> — Pan/zoom across Dhaka, Cox's Bazar, Sylhet. Search "Purbachal" or "Kolatoli" and click pins to observe live property attributes and list view fallback.
              </li>
              <li>
                <strong>Minute 2: Deterministic Suitability Engine & Weights</strong> — Open Suitability Dossier for any parcel. Change development purpose (e.g., Residential &rarr; Hotel) or drag the weight sliders to observe immediate deterministic score recomputation and coverage analysis.
              </li>
              <li>
                <strong>Minute 3: Multi-Property Comparison & AI Advisor</strong> — Go to Compare Properties. Change purpose to watch the #1 recommendation dynamically swap based on purpose-specific attributes. Ask the AI Advisor why it ranked first or what AC Land mutation documents are required.
              </li>
            </ol>
          </div>

          {/* Sample Data Provenance & Realism */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-400" />
              <span>{t.contest.provenanceTitle}</span>
            </h3>
            <p className="leading-relaxed">
              {t.contest.provenanceDesc}
            </p>
          </div>

          {/* Implemented vs Deferred Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-emerald-400 block text-xs">
                ✓ Fully Implemented (Contest Bar):
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                <li>• Bangladesh Leaflet Interactive Map</li>
                <li>• Accessible Tabular List Fallback</li>
                <li>• Smart Land Finder with 5 filters</li>
                <li>• Deterministic Suitability Engine (5 use-cases)</li>
                <li>• Interactive Factor Weight Sliders</li>
                <li>• Dynamic Property Comparison Matrix</li>
                <li>• Curated Tourism Explorer & Verified Stays</li>
                <li>• Grounded AI Land Advisor with Citations</li>
                <li>• Full English & বাংলা Bilingual Toggle</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-400 block text-xs">
                ⚙️ Deferred / Out-of-Scope:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>• Real-time payment processing (rules forbid fake payments)</li>
                <li>• Unverified ML predictive claims (rules mandate deterministic heuristic)</li>
                <li>• Third-party paid cloud lock-in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition shadow"
          >
            {t.contest.close}
          </button>
        </div>
      </div>
    </div>
  );
};
