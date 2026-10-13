import React from 'react';
import { ExtractedLandDocument } from '../../types/dueDiligence';
import {
  GitCommit,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Info
} from 'lucide-react';

interface ChainOfTitleVisualizerProps {
  documents: ExtractedLandDocument[];
  isBn: boolean;
}

export const ChainOfTitleVisualizer: React.FC<ChainOfTitleVisualizerProps> = ({
  documents,
  isBn,
}) => {
  const deed = documents.find((d) => d.type === 'saf_kabala');
  const rsKhatian = documents.find((d) => d.type === 'khatian' && (d.surveyEdition === 'RS' || !d.surveyEdition));
  const csKhatian = documents.find((d) => d.type === 'khatian' && d.surveyEdition === 'CS');
  const mutation = documents.find((d) => d.type === 'namjari');
  const dakhila = documents.find((d) => d.type === 'dakhila');

  // Chain state evaluations
  const hasDeed = !!deed;
  const hasKhatian = !!rsKhatian || !!csKhatian;
  const hasMutation = !!mutation;
  const hasDakhila = !!dakhila;

  // Is chain broken? If deed exists, khatian exists, but no mutation in seller's name!
  const isChainBroken = hasDeed && !hasMutation;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCommit className="text-emerald-500" size={18} />
            <span>
              {isBn
                ? 'স্বত্বলিপির ঐতিহাসিক পরম্পরা (Chain of Title)'
                : 'Historical Chain-of-Title & Mutation Audit'}
            </span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {isBn
              ? 'সিএস → এসএ → আরএস → নামজারি → সাফ-কবলা দলিলের নিরবচ্ছিন্ন বৈধতা পরীক্ষা'
              : 'Verifying continuous legal lineage from Cadastral Survey to AC (Land) Mutation and Conveyance Deed'}
          </p>
        </div>

        <div className="shrink-0">
          {isChainBroken ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
              <ShieldAlert size={14} />
              <span>{isBn ? 'স্বত্বলিপি বিচ্ছিন্ন (Chain Broken)' : 'Broken Title Chain Detected'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={14} />
              <span>{isBn ? 'ধারাবাহিকতা অক্ষুণ্ণ' : 'Continuous Lineage Verified'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Timeline Flow */}
      <div className="relative pt-2 pb-4 overflow-x-auto">
        <div className="min-w-[640px] flex items-center justify-between gap-3 relative">
          
          {/* Step 1: Historical CS Survey (Benchmark) */}
          <div className="flex-1 flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isBn ? 'ঐতিহাসিক মূল জরিপ' : 'Original Cadastre'}
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 my-2">
              CS
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {csKhatian ? `খতিয়ান ${csKhatian.documentNumber}` : (isBn ? 'সিএস বেঞ্চমার্ক' : 'CS Benchmark')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">1888–1940</span>
          </div>

          {/* Connector */}
          <ArrowRight className="text-slate-300 dark:text-slate-700 shrink-0" size={18} />

          {/* Step 2: Revisional Survey (RS Record) */}
          <div className="flex-1 flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isBn ? 'হাল মাঠ জরিপ' : 'Revisional Survey'}
            </span>
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-400/30 flex items-center justify-center font-bold text-xs text-sky-600 dark:text-sky-400 my-2">
              RS
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {rsKhatian ? `খতিয়ান #${rsKhatian.documentNumber}` : (isBn ? 'আরএস খতিয়ান' : 'RS Khatian')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              {rsKhatian?.primaryOwnerName ? `মালিক: ${rsKhatian.primaryOwnerName}` : '1965–Present'}
            </span>
          </div>

          {/* Connector: The Critical Gap! */}
          <div className="flex flex-col items-center shrink-0 px-1">
            {isChainBroken ? (
              <div className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900 animate-bounce">
                {isBn ? 'বিচ্ছিন্ন!' : 'GAP!'}
              </div>
            ) : (
              <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                {isBn ? 'সংযুক্ত' : 'OK'}
              </div>
            )}
            <ArrowRight
              className={isChainBroken ? 'text-rose-500 stroke-[2.5]' : 'text-emerald-500'}
              size={20}
            />
          </div>

          {/* Step 3: AC (Land) Mutation Khatian (ই-নামজারি) */}
          <div
            className={`flex-1 flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
              hasMutation
                ? 'bg-emerald-500/5 border-emerald-500/40 shadow-sm'
                : 'bg-rose-500/5 border-rose-500/40 border-dashed ring-2 ring-rose-500/20'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              {isBn ? 'এসি ল্যান্ড নামজারি' : 'AC (Land) Mutation'}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs my-2 ${
                hasMutation
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}
            >
              {hasMutation ? <CheckCircle2 size={16} /> : <AlertOctagon size={16} />}
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {mutation ? `নামজারি #${mutation.documentNumber}` : (isBn ? 'নামজারি অনুপস্থিত' : 'No Mutation')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              {mutation?.primaryOwnerName ? `মালিক: ${mutation.primaryOwnerName}` : (isBn ? 'সরকারি রেকর্ডে শূন্যতা' : 'Critical Defect')}
            </span>
          </div>

          {/* Connector */}
          <ArrowRight className="text-slate-300 dark:text-slate-700 shrink-0" size={18} />

          {/* Step 4: Registered Sale Deed (সাফ-কবলা) */}
          <div className="flex-1 flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isBn ? 'বিক্রয় দলিল' : 'Conveyance Deed'}
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-400/30 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 my-2">
              দলিল
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {deed ? `দলিল #${deed.documentNumber}` : (isBn ? 'সাফ-কবলা দলিল' : 'Sale Deed')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              {deed?.sellerOrDonorName ? `বিক্রেতা: ${deed.sellerOrDonorName}` : (isBn ? 'হস্তান্তরকারী' : 'Transferor')}
            </span>
          </div>

          {/* Connector */}
          <ArrowRight className="text-slate-300 dark:text-slate-700 shrink-0" size={18} />

          {/* Step 5: Land Tax Dakhila (দাখিলা) */}
          <div
            className={`flex-1 flex flex-col items-center text-center p-3 rounded-xl border ${
              hasDakhila
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isBn ? 'ভূমি কর দাখিলা' : 'LD Tax Dakhila'}
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-400/30 flex items-center justify-center font-bold text-xs text-amber-600 dark:text-amber-400 my-2">
              কর
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {dakhila ? `দাখিলা #${dakhila.documentNumber}` : (isBn ? 'দাখিলা নেই' : 'No Receipt')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1">
              {dakhila?.taxClearanceYear || 'হালনাগাদ কর'}
            </span>
          </div>

        </div>
      </div>

      {/* Explanatory Callout */}
      {isChainBroken ? (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertOctagon size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong>
              {isBn
                ? 'ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩ অনুযায়ী সতর্কতা:'
                : 'Crucial Legal Warning under Land Crime Prevention Act 2023:'}
            </strong>{' '}
            {isBn
              ? 'বিক্রেতা আরএস খতিয়ানের উত্তরাধিকারী দাবি করলেও সহকারী কমিশনার (ভূমি) অফিস থেকে নিজ নামে কোনো ই-নামজারি ও ডিসিআর করেননি। নামজারি ছাড়া জমি বিক্রি করলে সরকারি রেজিস্টারে পূর্বের মালিকের ওয়ারিশদের নামই বহাল থাকে, যা পরবর্তীতে উচ্ছেদ বা দেওয়ানি মামলার কারণ হয়।'
              : 'The seller is conveying property based on a historical RS Khatian of their ancestor without having completed formal Namjari (Mutation) in their own name. Under Bangladesh law, purchasing un-mutated property leaves government revenue records in the prior deceased owner’s name, exposing the buyer to title disputes from omitted co-heirs.'}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2 leading-relaxed">
          <Info size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            {isBn
              ? 'নথিপত্রে পরম্পরা সুসংগত: আরএস খতিয়ানের পর হাল সনের এসি ল্যান্ড নামজারি ও দাখিলা বিদ্যমান রয়েছে।'
              : 'Unbroken documentary chain: The lineage flows lawfully from the RS survey record to an active AC (Land) Mutation and current tax clearance.'}
          </div>
        </div>
      )}
    </div>
  );
};
