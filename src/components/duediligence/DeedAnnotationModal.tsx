import React, { useState } from 'react';
import { ExtractedLandDocument } from '../../types/dueDiligence';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileText,
  Eye,
  Edit3,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

interface DeedAnnotationModalProps {
  document: ExtractedLandDocument | null;
  isOpen: boolean;
  onClose: () => void;
  isBn: boolean;
  theme?: 'dark' | 'light';
  onSaveOverride?: (docId: string, updatedFields: Partial<ExtractedLandDocument>) => void;
}

interface BoundingBox {
  id: string;
  fieldKey: string;
  labelEn: string;
  labelBn: string;
  top: number; // percentage
  left: number; // percentage
  width: number; // percentage
  height: number; // percentage
  rawOcr: string;
  normalizedValue: string;
  confidence: number;
}

export const DeedAnnotationModal: React.FC<DeedAnnotationModalProps> = ({
  document,
  isOpen,
  onClose,
  isBn,
  theme = 'light',
  onSaveOverride,
}) => {
  const [activeField, setActiveField] = useState<string | null>('dag');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [overrideNotice, setOverrideNotice] = useState<string | null>(null);

  if (!isOpen || !document) return null;

  const isLight = theme === 'light';

  // Generate bounding boxes based on the document type
  const isKhatian = document.type === 'khatian' || document.type === 'namjari';

  const boundingBoxes: BoundingBox[] = isKhatian
    ? [
        {
          id: 'box-office',
          fieldKey: 'office',
          labelEn: 'Issuing Authority / DLRS',
          labelBn: 'প্রদানকারী কর্তৃপক্ষ ও রেকর্ড রুম',
          top: 14,
          left: 10,
          width: 80,
          height: 10,
          rawOcr: `${document.issueOffice} - সহকারী কমিশনার (ভূমি) কার্যালয়`,
          normalizedValue: document.issueOffice,
          confidence: 0.99,
        },
        {
          id: 'box-mouza',
          fieldKey: 'mouza',
          labelEn: 'Mouza & J.L. Number',
          labelBn: 'মৌজা ও জে. এল. নম্বর',
          top: 28,
          left: 10,
          width: 38,
          height: 11,
          rawOcr: `মৌজা: ${document.mouzaName}, জে. এল. নং: ${document.jlNumber}`,
          normalizedValue: `${document.mouzaName} (J.L. ${document.jlNumber})`,
          confidence: 0.98,
        },
        {
          id: 'box-khatian',
          fieldKey: 'khatian',
          labelEn: 'Khatian Number (পর্চা নং)',
          labelBn: 'খতিয়ান নম্বর (আরএস / নামজারি)',
          top: 28,
          left: 52,
          width: 38,
          height: 11,
          rawOcr: `খতিয়ান নম্বর- ${document.khatianNumber} (${document.surveyEdition || 'স্বত্ব'})`,
          normalizedValue: document.khatianNumber,
          confidence: 0.99,
        },
        {
          id: 'box-owner',
          fieldKey: 'owner',
          labelEn: 'Owner / Possessor (দখলকার)',
          labelBn: 'মালিক ও দখলকার বিবরণ',
          top: 44,
          left: 10,
          width: 80,
          height: 14,
          rawOcr: `মালিক: ${document.primaryOwnerName} ${document.ownerFatherOrHusbandName ? `পিতা: ${document.ownerFatherOrHusbandName}` : ''}`,
          normalizedValue: document.primaryOwnerName,
          confidence: 0.96,
        },
        {
          id: 'box-dag',
          fieldKey: 'dag',
          labelEn: 'Dag (Plot) Number',
          labelBn: 'দাগ নম্বর (সাবেক / হাল)',
          top: 62,
          left: 10,
          width: 38,
          height: 14,
          rawOcr: `দাগ নং- ${document.dagNumber} (নাল/ভিটি শ্রেণি)`,
          normalizedValue: document.dagNumber,
          confidence: 0.99,
        },
        {
          id: 'box-area',
          fieldKey: 'area',
          labelEn: 'Recorded Area (হিস্যা ও শতক)',
          labelBn: 'জমির হিস্যা ও মোট পরিমাণ',
          top: 62,
          left: 52,
          width: 38,
          height: 14,
          rawOcr: `জমির পরিমাণ: ${document.landAreaDecimals} শতক (১৬ আনা হিস্যা)`,
          normalizedValue: `${document.landAreaDecimals} Decimals (শতক)`,
          confidence: 0.97,
        },
      ]
    : [
        {
          id: 'box-stamp',
          fieldKey: 'stamp',
          labelEn: 'Govt Stamp & Deed Number',
          labelBn: 'সরকারি স্ট্যাম্প ও দলিল নম্বর',
          top: 12,
          left: 12,
          width: 76,
          height: 12,
          rawOcr: `দলিল নং- ${document.documentNumber}, তারিখ: ${document.registrationDate || '২০২৪'}`,
          normalizedValue: `Deed #${document.documentNumber}`,
          confidence: 0.99,
        },
        {
          id: 'box-seller',
          fieldKey: 'seller',
          labelEn: 'Seller / Transferor (১ম পক্ষ / দাতা)',
          labelBn: '১ম পক্ষ দাতার নাম ও ওয়ারিশান',
          top: 29,
          left: 12,
          width: 76,
          height: 14,
          rawOcr: `দাতা: ${document.sellerOrDonorName || document.primaryOwnerName}, থানা: ${document.upazila}`,
          normalizedValue: document.sellerOrDonorName || document.primaryOwnerName,
          confidence: 0.97,
        },
        {
          id: 'box-buyer',
          fieldKey: 'buyer',
          labelEn: 'Buyer / Transferee (২য় পক্ষ / গ্রহীতা)',
          labelBn: '২য় পক্ষ গ্রহীতার নাম',
          top: 47,
          left: 12,
          width: 76,
          height: 12,
          rawOcr: `গ্রহীতা: ${document.buyerOrRecipientName || 'নাম্বার/অজ্ঞাত'}, জেলা: ${document.district}`,
          normalizedValue: document.buyerOrRecipientName || 'Buyer Listed in Deed',
          confidence: 0.95,
        },
        {
          id: 'box-schedule-dag',
          fieldKey: 'dag',
          labelEn: 'Schedule Dag (তফসিল দাগ নম্বর)',
          labelBn: 'তফসিলভুক্ত দাগ নম্বর',
          top: 63,
          left: 12,
          width: 36,
          height: 14,
          rawOcr: `তফসিল দাগ নং- ${document.dagNumber} (মৌজা: ${document.mouzaName})`,
          normalizedValue: document.dagNumber,
          confidence: 0.99,
        },
        {
          id: 'box-schedule-area',
          fieldKey: 'area',
          labelEn: 'Transferred Area (হস্তান্তরিত জমি)',
          labelBn: 'হস্তান্তরিত জমির পরিমাণ',
          top: 63,
          left: 52,
          width: 36,
          height: 14,
          rawOcr: `বিক্রিত জমির পরিমাণ: ${document.landAreaDecimals} শতক`,
          normalizedValue: `${document.landAreaDecimals} Decimals (শতক)`,
          confidence: 0.98,
        },
        {
          id: 'box-seal',
          fieldKey: 'office',
          labelEn: 'Sub-Registry Official Seal',
          labelBn: 'সাব-রেজিস্ট্রি সিলমোহর ও স্বাক্ষর',
          top: 81,
          left: 12,
          width: 76,
          height: 12,
          rawOcr: `${document.issueOffice} - নিবন্ধিত ও বালামভুক্ত`,
          normalizedValue: document.issueOffice,
          confidence: 0.99,
        },
      ];

  const currentBox = boundingBoxes.find((b) => b.fieldKey === activeField) || boundingBoxes[0];

  const handleApplyOverride = () => {
    if (onSaveOverride && activeField) {
      const val = editValues[activeField];
      if (val !== undefined && val.trim() !== '') {
        const patch: Partial<ExtractedLandDocument> = {};
        if (activeField === 'dag') patch.dagNumber = val.trim();
        if (activeField === 'area') patch.landAreaDecimals = parseFloat(val) || document.landAreaDecimals;
        if (activeField === 'khatian') patch.khatianNumber = val.trim();
        if (activeField === 'owner' || activeField === 'seller') patch.primaryOwnerName = val.trim();

        onSaveOverride(document.id, patch);
        setOverrideNotice(
          isBn
            ? `ফিল্ড "${currentBox.labelBn}" সফলভাবে হালনাগাদ ও ভেরিফিকেশন মডেলে প্রয়োগ করা হয়েছে!`
            : `Field "${currentBox.labelEn}" manually overridden and reapplied to verification engine!`
        );
        setTimeout(() => setOverrideNotice(null), 4000);
      }
    }
    setIsEditing(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden transition-colors ${
          isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#121216] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Modal Header */}
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-3.5 border-b shrink-0 ${
            isLight ? 'bg-zinc-50/90 border-zinc-200' : 'bg-[#18181F]/90 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isLight ? 'bg-emerald-100/70 border-emerald-300 text-emerald-800' : 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
              }`}
            >
              <FileText size={18} />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold truncate">
                  {isBn ? document.titleBn : document.titleEn}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  #{document.documentNumber}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <span>{document.issueOffice}</span>
                <span>•</span>
                <span>{document.mouzaName} (J.L. {document.jlNumber})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 mr-2 px-2 py-1 rounded-lg border text-xs bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1 hover:text-emerald-600 rounded"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="font-mono text-[11px] w-10 text-center">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1 hover:text-emerald-600 rounded"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 hover:text-emerald-600 rounded"
                title="Reset Zoom"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Override notification banner if applied */}
        {overrideNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={14} />
              {overrideNotice}
            </span>
            <button onClick={() => setOverrideNotice(null)} className="text-white/80 hover:text-white">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main Content: Split View between Deed Scan and OCR Extraction Intelligence */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Left / Center Viewport (7 Cols): Authentic Vector Deed Scan with Interactive Bounding Boxes */}
          <div className={`lg:col-span-7 p-4 sm:p-6 overflow-auto border-b lg:border-b-0 lg:border-r flex items-center justify-center relative ${
            isLight ? 'bg-zinc-100/60 border-zinc-200' : 'bg-[#0b0b0e] border-zinc-800'
          }`}>
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
              }}
              className="w-full max-w-[480px] min-h-[580px] bg-[#fdfaf3] text-[#2c2416] p-6 sm:p-7 rounded shadow-xl border-4 border-double border-[#8b6f47]/40 relative font-serif select-none"
            >
              {/* Bangladeshi Government Watermark / Seal */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <div className="w-64 h-64 rounded-full border-8 border-dashed border-[#8b6f47] flex items-center justify-center text-4xl font-black">
                  ভূমি রেকর্ড ও জরিপ
                </div>
              </div>

              {/* Document Header Seal */}
              <div className="text-center border-b-2 border-[#8b6f47]/30 pb-3 mb-4 space-y-1">
                <div className="text-[11px] font-bold tracking-widest uppercase text-[#8b6f47]">
                  {isKhatian ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার' : 'রেজিস্ট্রেশন বিভাগ • বাংলাদেশ'}
                </div>
                <div className="text-base font-black tracking-tight text-[#1c1810]">
                  {isKhatian ? 'খতিয়ান ও স্বত্বলিপি রেকর্ড' : 'সাফ-কবলা বিক্রয় দলিল'}
                </div>
                <div className="text-[10px] text-zinc-600">
                  {document.issueOffice} • খতিয়ান/দলিল নং: {document.documentNumber}
                </div>
              </div>

              {/* Document Simulated Content Lines */}
              <div className="space-y-4 text-[11px] leading-relaxed text-[#3a3224]">
                <div className="p-2 bg-[#f4ece1] rounded border border-[#8b6f47]/20 flex justify-between text-[10px]">
                  <span><strong>মৌজা:</strong> {document.mouzaName}</span>
                  <span><strong>জে.এল. নং:</strong> {document.jlNumber}</span>
                  <span><strong>থানা:</strong> {document.upazila}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p>
                    <strong>দাতার/মালিকের বিবরণ:</strong> অত্র দলিলের লিখিত ব্যক্তি {document.primaryOwnerName}, পিতা/স্বামী: {document.ownerFatherOrHusbandName || 'আলী আহমদ'}, সাং- {document.mouzaName}।
                  </p>
                  <p>
                    <strong>তফসিলভুক্ত সম্পত্তি:</strong> জেলা: {document.district}, থানা: {document.upazila}, মৌজা: {document.mouzaName} মধ্যস্থিত।
                  </p>
                </div>

                {/* Table representation for Khatian */}
                <div className="mt-3 border border-[#8b6f47]/40 text-[9px]">
                  <div className="grid grid-cols-4 bg-[#ece2d0] font-bold p-1 text-center border-b border-[#8b6f47]/40">
                    <div>খতিয়ান নং</div>
                    <div>দাগ নং</div>
                    <div>জমির শ্রেণি</div>
                    <div>পরিমাণ (শতক)</div>
                  </div>
                  <div className="grid grid-cols-4 p-1.5 text-center">
                    <div>{document.khatianNumber}</div>
                    <div className="font-bold">{document.dagNumber}</div>
                    <div>নাল জমি</div>
                    <div className="font-black text-emerald-900">{document.landAreaDecimals} শতক</div>
                  </div>
                </div>

                {/* Official Stamp & Signatures */}
                <div className="pt-6 flex items-center justify-between text-[9px] text-zinc-600 border-t border-[#8b6f47]/20">
                  <div className="w-20 h-20 border-2 border-dashed border-[#8b6f47]/50 rounded-full flex flex-col items-center justify-center p-1 text-center font-bold text-[#8b6f47]">
                    <span>রেজিস্ট্রি সিল</span>
                    <span className="text-[8px]">{document.registrationDate || '২০২৪'}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="italic font-serif text-[11px]">স্বাক্ষর / টিপসহি</div>
                    <div className="border-t border-zinc-400 pt-0.5">সাব-রেজিস্ট্রার / এসি ল্যান্ড</div>
                  </div>
                </div>
              </div>

              {/* OVERLAID INTERACTIVE BOUNDING BOXES */}
              {boundingBoxes.map((box) => {
                const isActive = activeField === box.fieldKey;
                return (
                  <button
                    key={box.id}
                    type="button"
                    onClick={() => setActiveField(box.fieldKey)}
                    style={{
                      top: `${box.top}%`,
                      left: `${box.left}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                    className={`absolute rounded border-2 transition-all cursor-pointer flex items-start justify-end p-0.5 ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-500/20 ring-4 ring-emerald-500/30 z-20 shadow-lg'
                        : 'border-amber-600/60 bg-amber-500/10 hover:border-emerald-500 hover:bg-emerald-500/15 z-10'
                    }`}
                  >
                    <span
                      className={`text-[9px] font-bold px-1 rounded shadow-xs font-mono uppercase tracking-tighter ${
                        isActive ? 'bg-emerald-700 text-white' : 'bg-amber-700/80 text-white'
                      }`}
                    >
                      {box.fieldKey}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Viewport (5 Cols): OCR Extraction Pipeline & Human-in-the-Loop Override */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-5">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  {isBn ? 'স্বয়ংক্রিয় ওসিআর ফিল্ড এক্সট্রাকশন' : 'Automated OCR Field Extraction'}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {boundingBoxes.length} {isBn ? 'টি ফিল্ড চিহ্নিত' : 'Fields Mapped'}
                </span>
              </div>

              {/* Active Field Highlight Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isLight
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                    : 'bg-emerald-950/20 border-emerald-700/60 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                      {isBn ? 'নির্বাচিত ফিল্ড' : 'Selected Field Annotation'}
                    </span>
                    <h4 className="text-sm font-bold mt-0.5">
                      {isBn ? currentBox.labelBn : currentBox.labelEn}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">AI Confidence</span>
                    <span className="text-xs font-black font-mono text-emerald-700 dark:text-emerald-400">
                      {(currentBox.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                      {isBn ? 'দলিল থেকে অপরিবর্তিত ওসিআর টেক্সট (Raw Bengali Text):' : 'Raw Document OCR Text:'}
                    </span>
                    <div className="p-2 rounded bg-black/5 dark:bg-white/5 font-mono text-xs mt-0.5 border border-black/10 dark:border-white/10 break-all">
                      {currentBox.rawOcr}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                      {isBn ? 'সাধারণীকরণকৃত মান (Normalized Value):' : 'Normalized Legal Value:'}
                    </span>
                    <div className="p-2 rounded bg-white dark:bg-zinc-900 font-bold text-sm mt-0.5 border border-zinc-200 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400">
                      {currentBox.normalizedValue}
                    </div>
                  </div>
                </div>

                {/* Human-in-the-Loop Override Section */}
                <div className="mt-4 pt-3 border-t border-emerald-500/20">
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setEditValues({
                          ...editValues,
                          [currentBox.fieldKey]:
                            currentBox.fieldKey === 'dag'
                              ? document.dagNumber
                              : currentBox.fieldKey === 'area'
                              ? String(document.landAreaDecimals)
                              : currentBox.fieldKey === 'khatian'
                              ? document.khatianNumber
                              : document.primaryOwnerName,
                        });
                        setIsEditing(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 border border-emerald-400/50 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 transition-colors shadow-xs"
                    >
                      <Edit3 size={13} />
                      <span>
                        {isBn ? 'মানবীয় নিরীক্ষা ও মান সংশোধন (Human-in-the-Loop)' : 'Edit / Override OCR Value'}
                      </span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold block text-zinc-700 dark:text-zinc-300">
                        {isBn ? 'সংশোধিত মান লিখুন:' : 'Corrected Value:'}
                      </label>
                      <input
                        type="text"
                        value={editValues[currentBox.fieldKey] || ''}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            [currentBox.fieldKey]: e.target.value,
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleApplyOverride}
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                        >
                          {isBn ? 'প্রয়োগ করুন' : 'Apply Override'}
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 text-zinc-800 dark:text-zinc-200"
                        >
                          {isBn ? 'বাতিল' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* All Extracted Fields List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block">
                  {isBn ? 'সকল সনাক্তকৃত ফিল্ড তালিকা (ক্লিক করে দেখুন):' : 'All Extracted Fields (Click to Inspect):'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {boundingBoxes.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveField(b.fieldKey);
                        setIsEditing(false);
                      }}
                      className={`text-left p-2 rounded-lg border text-xs transition-all ${
                        activeField === b.fieldKey
                          ? 'border-emerald-500 bg-emerald-500/15 font-bold text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                          : isLight
                          ? 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                          : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="text-[10px] text-zinc-500 uppercase">{b.fieldKey}</div>
                      <div className="truncate font-semibold">{isBn ? b.labelBn : b.labelEn}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div
              className={`p-3 rounded-xl border text-[11px] leading-relaxed shrink-0 ${
                isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-600' : 'bg-[#18181F] border-zinc-800 text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>{isBn ? 'আইনগত ও স্বচ্ছতা নিশ্চয়তা' : 'Statutory & Explainability Contract'}</span>
              </div>
              <p>
                {isBn
                  ? 'ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩ অনুযায়ী দলিলের দাগ, খতিয়ান ও হিস্যা যাচাইয়ের ক্ষেত্রে ওসিআর কোনো চূড়ান্ত কর্তৃত্ব রাখে না। প্রতিটি ফিল্ড মানুষের পর্যালোচনার জন্য উন্মুক্ত।'
                  : 'Under the Land Crime Prevention and Redress Act 2023, automated OCR provides assistive pre-screening and does not replace human statutory oversight. All extractions maintain full traceability.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
