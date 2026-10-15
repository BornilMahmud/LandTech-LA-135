import React from 'react';
import { ExtractedLandDocument } from '../../types/dueDiligence';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Building,
  MapPin,
  Calendar,
  Layers,
  User,
  Scale
} from 'lucide-react';

interface DocumentCardProps {
  document: ExtractedLandDocument;
  isBn: boolean;
  theme?: 'dark' | 'light';
  onInspect?: (doc: ExtractedLandDocument) => void;
  isSelected?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isBn,
  theme = 'light',
  onInspect,
  isSelected = false,
}) => {
  const isLight = theme === 'light';

  const getStatusBadge = () => {
    switch (document.status) {
      case 'verified':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isLight
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50'
          }`}>
            <CheckCircle2 size={12} className={isLight ? "text-emerald-700" : "text-emerald-400"} />
            {isBn ? 'যাচাইকৃত' : 'Verified'}
          </span>
        );
      case 'disputed':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isLight
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-rose-950/50 text-rose-300 border-rose-700/50'
          }`}>
            <XCircle size={12} className={isLight ? "text-rose-700" : "text-rose-400"} />
            {isBn ? 'বিরোধপূর্ণ' : 'Disputed'}
          </span>
        );
      case 'provisional':
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isLight
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-amber-950/50 text-amber-300 border-amber-700/50'
          }`}>
            <AlertTriangle size={12} className={isLight ? "text-amber-700" : "text-amber-400"} />
            {isBn ? 'খসড়া / পর্যালোচনায়' : 'Provisional Draft'}
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            isLight
              ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}>
            <HelpCircle size={12} />
            {isBn ? 'অনিশ্চিত' : 'Unverified'}
          </span>
        );
    }
  };

  const getDocTypeIcon = () => {
    switch (document.type) {
      case 'saf_kabala':
        return <FileText className={isLight ? "text-emerald-700" : "text-emerald-400"} size={17} />;
      case 'khatian':
        return <Layers className={isLight ? "text-sky-700" : "text-sky-400"} size={17} />;
      case 'namjari':
        return <CheckCircle2 className={isLight ? "text-indigo-700" : "text-indigo-400"} size={17} />;
      case 'dakhila':
        return <Scale className={isLight ? "text-amber-700" : "text-amber-400"} size={17} />;
      default:
        return <FileText className={isLight ? "text-zinc-700" : "text-zinc-400"} size={17} />;
    }
  };

  return (
    <div
      onClick={() => onInspect?.(document)}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
        isSelected
          ? isLight
            ? 'bg-white border-[#CC5A2B] shadow-sm'
            : 'bg-[#1E1E1C] border-[#CC5A2B] shadow-sm'
          : isLight
          ? 'bg-white border-[#E8E3DA] hover:border-[#CC5A2B]/40 hover:shadow-xs text-zinc-900'
          : 'bg-[#141413] border-[#2B2A27] hover:border-[#CC5A2B]/40 hover:shadow-xs text-white'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl shrink-0 border ${
              isLight ? 'bg-zinc-100 border-zinc-200/80' : 'bg-[#181820] border-zinc-700/60'
            }`}>
              {getDocTypeIcon()}
            </div>
            <div>
              <h4 className={`text-xs sm:text-sm font-extrabold leading-tight ${
                isLight ? 'text-zinc-950' : 'text-white'
              }`}>
                {isBn ? document.titleBn : document.titleEn}
              </h4>
              <div className="text-[11px] flex items-center gap-1.5 mt-1">
                <span className={`font-mono font-medium ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  #{document.documentNumber}
                </span>
                {document.surveyEdition && (
                  <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                    isLight ? 'bg-sky-100 text-sky-800' : 'bg-sky-950/60 text-sky-300'
                  }`}>
                    {document.surveyEdition}
                  </span>
                )}
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Primary Key Identifiers (Dag / Stated Area) */}
        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          <div className={`p-2.5 rounded-xl border ${
            isLight
              ? 'bg-zinc-50 border-zinc-200 text-zinc-900'
              : 'bg-[#181820] border-zinc-800 text-white'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-zinc-600' : 'text-zinc-400'
            }`}>
              {isBn ? 'দাগ নম্বর' : 'DAG / PLOT'}
            </span>
            <span className={`font-black text-sm block mt-0.5 ${
              isLight ? 'text-zinc-950' : 'text-white'
            }`}>
              {document.dagNumber || '—'}
            </span>
          </div>

          <div className={`p-2.5 rounded-xl border ${
            isLight
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              isLight ? 'text-emerald-800' : 'text-emerald-400'
            }`}>
              {isBn ? 'জমির পরিমাণ' : 'STATED AREA'}
            </span>
            <span className={`font-black text-sm block mt-0.5 ${
              isLight ? 'text-emerald-900' : 'text-emerald-400'
            }`}>
              {document.landAreaDecimals} {isBn ? 'শতক' : 'Dec'}
            </span>
          </div>
        </div>

        {/* Owner & Office Details */}
        <div className={`mt-3 space-y-1.5 text-xs pt-2.5 border-t ${
          isLight ? 'border-zinc-200/80 text-zinc-800' : 'border-zinc-800/80 text-zinc-300'
        }`}>
          <div className="flex items-start gap-1.5 leading-snug">
            <User size={13} className={`mt-0.5 shrink-0 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <span className="truncate">
              <strong className={isLight ? 'text-zinc-900 font-semibold' : 'text-white font-semibold'}>
                {isBn ? 'মালিক/বিক্রেতা:' : 'Owner/Seller:'}
              </strong>{' '}
              <span className={isLight ? 'text-zinc-800' : 'text-zinc-200'}>
                {document.primaryOwnerName}
              </span>
            </span>
          </div>

          <div className="flex items-start gap-1.5 leading-snug">
            <MapPin size={13} className={`mt-0.5 shrink-0 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <span className={`truncate ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              {document.mouzaName} (J.L. {document.jlNumber}), {document.upazila}
            </span>
          </div>

          <div className="flex items-start gap-1.5 leading-snug">
            <Building size={13} className={`mt-0.5 shrink-0 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <span className={`truncate ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {document.issueOffice}
            </span>
          </div>

          {document.registrationDate && (
            <div className={`flex items-center gap-1.5 text-[11px] ${
              isLight ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              <Calendar size={12} className="shrink-0" />
              <span>{isBn ? 'তারিখ:' : 'Date:'} {document.registrationDate}</span>
            </div>
          )}
        </div>
      </div>

      {document.notes && (
        <div className={`mt-3 text-[11px] italic p-2 rounded-xl border leading-relaxed ${
          isLight
            ? 'bg-zinc-50 border-zinc-200/80 text-zinc-700'
            : 'bg-[#181820] border-zinc-800 text-zinc-300'
        }`}>
          {document.notes}
        </div>
      )}

      {/* Inspect OCR & Bounding Box Action Button */}
      <div className="mt-3.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspect?.(document);
          }}
          className={`w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isLight
              ? 'bg-[#FAF0EB] hover:bg-[#F3D5C6] text-[#CC5A2B] border-[#F3D5C6] shadow-2xs'
              : 'bg-[#2B2A27] hover:bg-[#383632] text-[#D4A373] border-[#383632] shadow-2xs'
          }`}
        >
          <i className="bx bx-scan text-sm text-[#CC5A2B] dark:text-[#D4A373]" aria-hidden="true" />
          <span>{isBn ? 'ওসিআর ও স্ক্যান অ্যানোটেশন দেখুন' : 'Inspect OCR & Scan Annotations'}</span>
        </button>
      </div>
    </div>
  );
};
