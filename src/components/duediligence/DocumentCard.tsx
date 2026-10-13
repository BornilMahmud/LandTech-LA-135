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
  onInspect?: (doc: ExtractedLandDocument) => void;
  isSelected?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isBn,
  onInspect,
  isSelected = false,
}) => {
  const getStatusBadge = () => {
    switch (document.status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            {isBn ? 'যাচাইকৃত' : 'Verified'}
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle size={12} />
            {isBn ? 'বিরোধপূর্ণ' : 'Disputed'}
          </span>
        );
      case 'provisional':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle size={12} />
            {isBn ? 'খসড়া / পর্যালোচনায়' : 'Provisional Draft'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            <HelpCircle size={12} />
            {isBn ? 'অনিশ্চিত' : 'Unverified'}
          </span>
        );
    }
  };

  const getDocTypeIcon = () => {
    switch (document.type) {
      case 'saf_kabala':
        return <FileText className="text-emerald-600 dark:text-emerald-400" size={18} />;
      case 'khatian':
        return <Layers className="text-sky-600 dark:text-sky-400" size={18} />;
      case 'namjari':
        return <CheckCircle2 className="text-indigo-600 dark:text-indigo-400" size={18} />;
      case 'dakhila':
        return <Scale className="text-amber-600 dark:text-amber-400" size={18} />;
      default:
        return <FileText className="text-slate-600 dark:text-slate-400" size={18} />;
    }
  };

  return (
    <div
      onClick={() => onInspect?.(document)}
      className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-emerald-500/5 border-emerald-500 shadow-md ring-1 ring-emerald-500'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-sm'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            {getDocTypeIcon()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {isBn ? document.titleBn : document.titleEn}
            </h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <span>#{document.documentNumber}</span>
              {document.surveyEdition && (
                <span className="px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[10px] font-bold">
                  {document.surveyEdition}
                </span>
              )}
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Primary Key Identifiers */}
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
            {isBn ? 'দাগ নম্বর' : 'Dag / Plot'}
          </span>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {document.dagNumber || '—'}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
            {isBn ? 'জমির পরিমাণ' : 'Stated Area'}
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {document.landAreaDecimals} {isBn ? 'শতক' : 'Dec'}
          </span>
        </div>
      </div>

      {/* Owner & Office Details */}
      <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 truncate">
          <User size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">
            <strong>{isBn ? 'মালিক/বিক্রেতা:' : 'Owner/Seller:'}</strong> {document.primaryOwnerName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <MapPin size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">
            {document.mouzaName} (J.L. {document.jlNumber}), {document.upazila}
          </span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Building size={12} className="text-slate-400 shrink-0" />
          <span className="truncate text-slate-500 dark:text-slate-400">
            {document.issueOffice}
          </span>
        </div>

        {document.registrationDate && (
          <div className="flex items-center gap-1.5 truncate text-[11px] text-slate-400">
            <Calendar size={11} className="shrink-0" />
            <span>{isBn ? 'তারিখ:' : 'Date:'} {document.registrationDate}</span>
          </div>
        )}
      </div>

      {document.notes && (
        <div className="mt-2 text-[11px] italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded">
          {document.notes}
        </div>
      )}
    </div>
  );
};
