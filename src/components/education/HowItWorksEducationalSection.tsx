import React, { useState } from 'react';

interface HowItWorksEducationalSectionProps {
  isBn: boolean;
  theme: 'dark' | 'light';
}

export type StoryAct =
  | 'problem'
  | 'how-it-works'
  | 'who-benefits'
  | 'time-savings'
  | 'business-model'
  | 'trust-roadmap';

export const HowItWorksEducationalSection: React.FC<HowItWorksEducationalSectionProps> = ({
  isBn,
  theme,
}) => {
  const isLight = theme === 'light';

  // 6 Story Acts: Problem → How It Works → Who Benefits → Time & Cost Savings → Business Model → Trust & Roadmap
  const [activeAct, setActiveAct] = useState<StoryAct>('problem');

  // Sub-tab inside Act 6 (Trust & Roadmap)
  const [trustSubTab, setTrustSubTab] = useState<'ai-limits' | 'roadmap' | 'faq'>('ai-limits');

  // Selected persona in Act 3 (Who Benefits)
  const [selectedPersona, setSelectedPersona] = useState<number>(0);

  // Active FAQ accordion item in Act 6 (null = none or index)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Active Glossary Modal / Term Popup
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // INTERACTIVE SAVINGS CALCULATOR STATE (FOR ACT 4)
  // ─────────────────────────────────────────────────────────────
  const [docVolume, setDocVolume] = useState<number>(200);
  const [timeBeforeHours, setTimeBeforeHours] = useState<number>(4.5);
  const [reductionPercent, setReductionPercent] = useState<number>(73);
  const [staffCostPerHour, setStaffCostPerHour] = useState<number>(750);
  const [monthlyPlatformCost, setMonthlyPlatformCost] = useState<number>(45000);

  // Calculator Math:
  // Time saved = monthly documents * hours per document before * expected reduction percentage / 100
  const timeSavedHours = Math.round(docVolume * timeBeforeHours * (reductionPercent / 100));
  // Value of time saved = time saved * staff cost per hour
  const valueOfTimeSavedBDT = Math.round(timeSavedHours * staffCostPerHour);
  // Net monthly benefit = value of time saved - monthly platform and operating costs
  const netMonthlyBenefitBDT = valueOfTimeSavedBDT - monthlyPlatformCost;
  // Net annual benefit = net monthly benefit * 12
  const netAnnualBenefitBDT = netMonthlyBenefitBDT * 12;
  // Estimated monthly ROI = (net monthly benefit / monthly platform and operating costs) * 100
  const monthlyRoiPercent =
    monthlyPlatformCost > 0
      ? Math.round((netMonthlyBenefitBDT / monthlyPlatformCost) * 100)
      : 0;

  // ─────────────────────────────────────────────────────────────
  // GLOSSARY DATA
  // ─────────────────────────────────────────────────────────────
  const glossaryTerms: Record<
    string,
    { titleEn: string; titleBn: string; descEn: string; descBn: string }
  > = {
    ocr: {
      titleEn: 'OCR (Optical Character Recognition)',
      titleBn: 'ওসিআর (অপটিক্যাল ক্যারেক্টার রেকগনিশন)',
      descEn:
        'Technology that converts scanned images of paper documents and handwritten Bengali/English text into searchable, structured machine-readable text and data fields.',
      descBn:
        'একটি প্রযুক্তি যার মাধ্যমে স্ক্যান করা কাগজের নথি বা হাতে লেখা দলিলের ছবিকে স্বয়ংক্রিয়ভাবে ডিজিটাল সার্চযোগ্য টেক্সট ও ডেটাতে রূপান্তর করা হয়।',
    },
    khatian: {
      titleEn: 'Khatian / Porcha (খতিয়ান / পর্চা)',
      titleBn: 'খতিয়ান / পর্চা (Record of Rights)',
      descEn:
        'Official Record of Rights (RoR) prepared during government cadastral surveys (CS, SA, RS, BS), detailing plot numbers, boundaries, owner shares, and land class.',
      descBn:
        'সরকারি জরিপ (সিএস, এসএ, আরএস, বিএস) চলাকালীন প্রস্তুতকৃত জমির মালিকানা ও হিস্যার আনুষ্ঠানিক খতিয়ান বা স্বত্বলিপি রেকর্ড।',
    },
    dag: {
      titleEn: 'Dag Number (দাগ নম্বর / Plot Number)',
      titleBn: 'দাগ নম্বর (ক্যাডাস্ট্রাল প্লট নম্বর)',
      descEn:
        'A unique parcel identification number assigned to a specific piece of surveyed land on official government Mouza cadastral maps.',
      descBn:
        'সরকারি মৌজা নকশায় সুনির্দিষ্ট একখণ্ড চিহ্নিত ভূমির জন্য নির্ধারিত স্বতন্ত্র পরিচিতি বা প্লট নম্বর।',
    },
    mutation: {
      titleEn: 'e-Mutation / Namjari (ই-নামজারি ও ডিসিআর)',
      titleBn: 'ই-নামজারি (নামপত্তন ও ডিসিআর রশিদ)',
      descEn:
        'The legal administrative process at the Upazila Land Office where an old owner’s name is substituted by the new buyer’s name in government Register IX.',
      descBn:
        'উপজেলা ভূমি অফিসে পূর্ববর্তী মালিকের নামের পরিবর্তে নতুন ক্রেতার নাম সরকারি রেজিস্টার ৯-এ অন্তর্ভুক্ত করার আইনি প্রশাসনিক প্রক্রিয়া।',
    },
    dakhila: {
      titleEn: 'Dakhila (দাখিলা / Land Tax Receipt)',
      titleBn: 'দাখিলা (ভূমি উন্নয়ন কর রশিদ)',
      descEn:
        'Official government receipt issued by the Union Land Office certifying that annual land development taxes have been cleared for the specified Bengali year.',
      descBn:
        'ইউনিয়ন ভূমি অফিস কর্তৃক প্রদত্ত সরকারি রশিদ যা প্রমাণ করে যে উক্ত সম্পত্তির সংশ্লিষ্ট বাংলা সনের ভূমি উন্নয়ন কর পরিশোধিত আছে।',
    },
    auditTrail: {
      titleEn: 'Cryptographic Audit Trail (ক্রিপ্টোগ্রাফিক অডিট ট্রেইল)',
      titleBn: 'ক্রিপ্টোগ্রাফিক অডিট ট্রেইল',
      descEn:
        'An unalterable, time-stamped digital log generated using mathematical hashes (such as SHA-256) ensuring document inspection results cannot be manipulated.',
      descBn:
        'একটি অপরিবর্তনযোগ্য গাণিতিক হ্যাশ (SHA-256) ভিত্তিক ডিজিটাল রেকর্ড যা নিশ্চিত করে যে একবার যাচাই করা নথির ফলাফল পরবর্তীতে গোপনে পরিবর্তন করা অসম্ভব।',
    },
    dueDiligence: {
      titleEn: 'Due Diligence (ডিউ ডিলিজেন্স / পূর্ব-যাচাই)',
      titleBn: 'ডিউ ডিলিজেন্স (ক্রয়-পূর্ব স্বত্ব নিরীক্ষা)',
      descEn:
        'Comprehensive investigation of land ownership history, legal encumbrances, and physical boundary risks before signing contracts or disbursing funds.',
      descBn:
        'যেকোনো জমি ক্রয়ের বায়না বা চুক্তি স্বাক্ষরের পূর্বে দলিলের ধারাবাহিকতা, মামলা-মোকদ্দমা ও সীমানা সংক্রান্ত ঝুঁকি খতিয়ে দেখার পূর্ণাঙ্গ নিরীক্ষা।',
    },
  };

  // ─────────────────────────────────────────────────────────────
  // STORY ACTS DEFINITIONS
  // ─────────────────────────────────────────────────────────────
  const storyActs = [
    {
      id: 'problem' as StoryAct,
      number: '1',
      titleEn: 'Problem',
      titleBn: 'সমস্যা ও সংকট',
      taglineEn: 'The 3.2M Dispute Crisis',
      taglineBn: '৩২ লাখ মামলার জট',
      icon: 'bx-error-circle',
    },
    {
      id: 'how-it-works' as StoryAct,
      number: '2',
      titleEn: 'How It Works',
      titleBn: 'কার্যপদ্ধতি',
      taglineEn: '6-Step Digital Pipeline',
      taglineBn: '৬-ধাপের যাচাই ব্যবস্থা',
      icon: 'bx-git-commit',
    },
    {
      id: 'who-benefits' as StoryAct,
      number: '3',
      titleEn: 'Who Benefits',
      titleBn: 'উপকারভোগী',
      taglineEn: '6 Stakeholder Personas',
      taglineBn: 'নাগরিক থেকে করপোরেট',
      icon: 'bx-group',
    },
    {
      id: 'time-savings' as StoryAct,
      number: '4',
      titleEn: 'Time & Savings',
      titleBn: 'সময় ও অর্থ সাশ্রয়',
      taglineEn: '73% Faster & ROI Tool',
      taglineBn: '৭৩% দ্রুত ও আরওআই',
      icon: 'bx-calculator',
    },
    {
      id: 'business-model' as StoryAct,
      number: '5',
      titleEn: 'Business Model',
      titleBn: 'ব্যবসায়িক মডেল',
      taglineEn: 'Who Pays For This?',
      taglineBn: 'কারা অর্থায়ন করবে?',
      icon: 'bx-wallet',
    },
    {
      id: 'trust-roadmap' as StoryAct,
      number: '6',
      titleEn: 'Trust & Roadmap',
      titleBn: 'বিশ্বাস ও রোডম্যাপ',
      taglineEn: 'AI Limits, Roadmap & FAQs',
      taglineBn: 'সীমাবদ্ধতা ও প্রশ্নোত্তর',
      icon: 'bx-shield-quarter',
    },
  ];

  // Helper to step forward/backward in the story
  const currentActIndex = storyActs.findIndex((a) => a.id === activeAct);
  const handleNextAct = () => {
    if (currentActIndex < storyActs.length - 1) {
      setActiveAct(storyActs[currentActIndex + 1].id);
    }
  };
  const handlePrevAct = () => {
    if (currentActIndex > 0) {
      setActiveAct(storyActs[currentActIndex - 1].id);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // "WHO BENEFITS" PERSONAS DATA
  // ─────────────────────────────────────────────────────────────
  const personas = [
    {
      id: 'citizens',
      titleEn: 'Citizens & Landowners',
      titleBn: 'নাগরিক ও সাধারণ জমি ক্রেতা',
      icon: 'bx-user',
      badgeEn: 'Public User',
      badgeBn: 'সাধারণ ব্যবহারকারী',
      problemEn:
        'Ordinary buyers often lack legal expertise and risk their life savings on land with broken title chains, forged deeds, or unpaid tax arrears.',
      problemBn:
        'সাধারণ জমি ক্রেতারা জটিল আইনি পরিভাষা বোঝেন না এবং প্রায়ই বিক্রেতার কথার ওপর ভরসা করে জীবনের সঞ্চয় দিয়ে জাল বা ত্রুটিপূর্ণ জমি কিনে প্রতারিত হন।',
      helpsEn:
        'Provides a simple 1-click checklist showing whether Deed, RS Khatian, and Mutation records match, plus an official 4-step roadmap of government offices to visit.',
      helpsBn:
        '১-ক্লিকে সাফ-কবলা দলিল, আরএস খতিয়ান ও ই-নামজারির তথ্য মিলিয়ে দেখে অসঙ্গতি থাকলে সতর্ক করে এবং ক্রেতাকে কোন অফিসে যেতে হবে তার ৪-দফা গাইড প্রদান করে।',
      limitsEn:
        'LandWise does NOT grant or certify legal ownership. Buyers must always retain a registered Advocate and visit the Sub-Registry Office for formal searches.',
      limitsBn:
        'এটি কোনো সরকারি মালিকানা সনদ নয়। চূড়ান্ত আর্থিক লেনদেনের আগে অবশ্যই তালিকাভুক্ত আইনজীবীর পরামর্শ নিতে হবে এবং সাব-রেজিস্ট্রি অফিসে আনুষ্ঠানিক তল্লাশি চালাতে হবে।',
    },
    {
      id: 'government',
      titleEn: 'Government Land Officials (AC Land & Sub-Registry)',
      titleBn: 'সরকারি কর্মকর্তা (সহকারী কমিশনার ও সাব-রেজিস্ট্রার)',
      icon: 'bx-government',
      badgeEn: 'GovTech Partner',
      badgeBn: 'প্রশাসনিক অংশীদার',
      problemEn:
        'Upazila land offices and Sub-Registry record rooms handle thousands of paper documents manually with limited staff, creating hearing backlogs.',
      problemBn:
        'উপজেলা ভূমি অফিস ও সাব-রেজিস্ট্রি অফিসে প্রতিদিন শত শত হস্তলিখিত বালাম বই ও নথি পরীক্ষা করতে গিয়ে কর্মকর্তাদের প্রচুর সময় অপচয় হয় ও দীর্ঘসূত্রতা সৃষ্টি হয়।',
      helpsEn:
        'Acts as an automated triage co-pilot that pre-screens Dag numbers, calculates fractional inheritance shares, and flags duplicate claims before hearings.',
      helpsBn:
        'শুনানির পূর্বে সহকারী স্ক্রিনিং কো-পাইলট হিসেবে কাজ করে দাগের হিস্যা, ওয়ারিশান ধারাবাহিকতা ও কর বকেয়া স্বয়ংক্রিয়ভাবে হিসেব করে কর্মকর্তাদের সামনে উপস্থাপন করে।',
      limitsEn:
        'The system has zero statutory administrative authority. Final approval or rejection rests entirely on the lawful discretion of the authorized human officer.',
      limitsBn:
        'এই সিস্টেমের কোনো আইনি কর্তৃত্ব নেই। দলিলের চূড়ান্ত নিবন্ধন বা নামজারি মঞ্জুর করার একমাত্র এখতিয়ার সংশ্লিষ্ট ক্ষমতাপ্রাপ্ত সরকারি কর্মকর্তার।',
    },
    {
      id: 'developers',
      titleEn: 'Real Estate & Housing Companies',
      titleBn: 'রিয়েল এস্টেট ও আবাসন প্রতিষ্ঠান',
      icon: 'bx-buildings',
      badgeEn: 'Commercial B2B',
      badgeBn: 'বাণিজ্যিক বি২বি',
      problemEn:
        'Acquiring large parcels often stalls for years if even one minor ancestral plot within the proposed project has an undisclosed legal defect or heir dispute.',
      problemBn:
        'বড় আবাসন প্রকল্পের জমি ক্রয়ের সময় বহু দাগ ও খতিয়ানের মধ্যে একটি খতিয়ানেও ওয়ারিশান বা সীমানা জটিলতা থাকলে পুরো প্রজেক্টের কোটি কোটি টাকার বিনিয়োগ আটকে যায়।',
      helpsEn:
        'Enables rapid portfolio batch-screening of dozens of contiguous plots, identifying khash land proximity, road access widths, and mutation gaps before signing.',
      helpsBn:
        'একসাথে ডজন ডজন দাগ ও খতিয়ানের ধারাবাহিকতা স্ক্রিনিং করে খাস জমির নৈকট্য ও রাস্তার প্রশস্ততা নিশ্চিত করে বায়না চুক্তি সম্পাদনে সহায়তা করে।',
      limitsEn:
        'Screening results do not eliminate the necessity of on-site cadastral boundary demarcation by certified licensed Amins or formal registry searches.',
      limitsBn:
        'প্ল্যাটফর্মের স্ক্রিনিং ফিজিক্যাল সীমানা নির্ধারণের বিকল্প নয়; প্রকল্পে কাজ শুরুর আগে অবশ্যই লাইসেন্সপ্রাপ্ত আমিন দ্বারা জমিন পরিমাপ করতে হবে।',
    },
    {
      id: 'banks',
      titleEn: 'Banks & Financial Institutions',
      titleBn: 'বাণিজ্যিক ব্যাংক ও আর্থিক প্রতিষ্ঠান',
      icon: 'bx-bank',
      badgeEn: 'Financial Risk',
      badgeBn: 'ঋণ ঝুঁকি নিয়ন্ত্রণ',
      problemEn:
        'Mortgage loan applications suffer 3-to-4 week turnaround times; banks face non-performing loan (NPL) risks when forged deeds are pledged as collateral.',
      problemBn:
        'হোম লোন বা প্রপার্টি বন্ধকী ঋণের আবেদনে নথি যাচাই করতে ৩ থেকে ৪ সপ্তাহ সময় লাগে এবং জাল বা ভুয়া দলিল মর্টগেজ রাখার কারণে খেলাপি ঋণের ঝুঁকি বৃদ্ধি পায়।',
      helpsEn:
        'Delivers a standardized 60-second preliminary collateral verification report that confirms whether the mortgaged plot matches digitized mutation records.',
      helpsBn:
        'মাত্র ৬০ সেকেন্ডে প্রাথমিক জামানত যাচাই ডসিয়ার প্রস্তুত করে ব্যাংক কর্মকর্তাদের নিশ্চিত করে যে প্রস্তাবিত বন্ধকী জমির মিউটেশন ও খাজনা রেকর্ড সক্রিয় আছে কিনা।',
      limitsEn:
        'Serves solely as a preliminary risk screening filter; bank panel lawyers must still independently review original title deeds prior to loan disbursement.',
      limitsBn:
        'এটি কেবল ঋণ আবেদনের প্রাথমিক স্ক্রিনিং স্তর; ব্যাংক প্যানেল ল-ইয়ার কর্তৃক মূল দলিলের আনুষ্ঠানিক লিগ্যাল অপিনিয়নের বিকল্প নয়।',
    },
    {
      id: 'lawyers',
      titleEn: 'Lawyers & Legal Scrutiny Firms',
      titleBn: 'আইনজীবী ও আইনি পরামর্শক প্রতিষ্ঠান',
      icon: 'bx-briefcase',
      badgeEn: 'Legal Practice',
      badgeBn: 'আইনি অনুশীলন',
      problemEn:
        'Advocates and paralegals waste dozens of billable hours manually transcribing handwritten Porchas and cross-referencing multi-generation lineage chains.',
      problemBn:
        'জুনিয়র আইনজীবীদের হাতে লেখা প্রাচীন বালাম বই ও বিভিন্ন জরিপের পর্চা ঘেঁটে বংশপরম্পরা মেলানোর পেছনে অপ্রয়োজনীয় বিলযোগ্য কর্মঘণ্টা অপচয় করতে হয়।',
      helpsEn:
        'Automatically reconstructs generational ownership trees, formats evidence tables, and highlights statutory red flags under the Registration Act and SAT Act.',
      helpsBn:
        'স্বয়ংক্রিয়ভাবে বংশানুক্রমিক স্বত্বলিপির টাইমলাইন তৈরি করে দেয় এবং রেজিস্ট্রেশন আইন ও ১৯৫০ সালের প্রজাস্বত্ব আইনের আওতায় অসঙ্গতিগুলো চিহ্নিত করে দেয়।',
      limitsEn:
        'LandWise cannot provide legal counsel. The advocate retains full professional responsibility for drafting title search reports and legal certifications.',
      limitsBn:
        'সিস্টেম কোনো আইনি পরামর্শ প্রদান করে না। চূড়ান্ত মতামত বা লিগ্যাল সার্চ রিপোর্টের পেশাগত দায়ভার সর্বদা আইনজীবীর নিজস্ব বিবেচনার ওপর নির্ভরশীল।',
    },
    {
      id: 'investors',
      titleEn: 'Enterprises & Industrial Investors',
      titleBn: 'শিল্পোদ্যোক্তা ও করপোরেট বিনিয়োগকারী',
      icon: 'bx-factory',
      badgeEn: 'Enterprise',
      badgeBn: 'করপোরেট বিনিয়োগ',
      problemEn:
        'Setting up industrial factories, economic zones (SEZs), or warehouses requires aggregating 50+ contiguous plots with high exposure to land grabbing.',
      problemBn:
        'শিল্প কারখানা বা ইকোনমিক জোনের জন্য বড় জমি অধিগ্রহণকালে নদীভাঙন, সরকারি খাস জমি বা পরিবেশগত রেড জোনের মধ্যে পড়ার বড় ঝুঁকি থাকে।',
      helpsEn:
        'Combines title cross-checks with GIS spatial hazard intelligence (flood inundation, river erosion, Masterplan RAJUK zoning, and road frontage width).',
      helpsBn:
        'দলিলের পাশাপাশি ভূ-স্থানিক ঝুঁকি (বন্যা ঝুঁকি, নদীভাঙন ও সরকারি মাস্টারপ্ল্যান জোনিং) যাচাই করে করপোরেট বোর্ডকে ঝুঁকিহীন সিদ্ধান্ত নিতে সাহায্য করে।',
      limitsEn:
        'Does not replace mandatory environmental clearances (DoE), local zoning approvals, or DC Office formal acquisition verification searches.',
      limitsBn:
        'পরিবেশ অধিদপ্তরের ছাড়পত্র বা জেলা প্রশাসক (ডিসি) অফিসের আনুষ্ঠানিক অধিগ্রহণ যাচাইয়ের কোনো বিকল্প হিসেবে এটি কাজ করে না।',
    },
  ];

  // ─────────────────────────────────────────────────────────────
  // 12 HONEST FAQ ITEMS
  // ─────────────────────────────────────────────────────────────
  const faqItems = [
    {
      qEn: '1. What exactly is the LandWise platform?',
      qBn: '১. ল্যান্ডওয়াইজ প্ল্যাটফর্মটি আসলে কী?',
      aEn:
        'LandWise is an assistive AI and spatial cadastral due diligence engine built for Bangladesh. It reconciles seller deeds, RS khatians, mutation porchas, and tax receipts to identify potential title gaps, area deficits, and spatial hazards before property transactions occur.',
      aBn:
        'ল্যান্ডওয়াইজ হলো বাংলাদেশের ভূমি ব্যবস্থার জন্য তৈরি একটি সহায়ক কৃত্রিম বুদ্ধিমত্তা ও ক্যাডাস্ট্রাল প্ল্যাটফর্ম। এটি সাফ-কবলা দলিল, আরএস খতিয়ান, ই-নামজারি ও খাজনা দাখিলা ক্রস-যাচাই করে জমি কেনাবেচার আগেই স্বত্ব ও সীমানা সংক্রান্ত সম্ভাব্য ত্রুটি চিহ্নিত করতে সাহায্য করে।',
    },
    {
      qEn: '2. Can LandWise prove or certify legal land ownership?',
      qBn: '২. ল্যান্ডওয়াইজ কি আইনিভাবে জমির স্বত্ব বা মালিকানা প্রমাণ করতে পারে?',
      aEn:
        'No. LandWise is strictly a decision-support and screening engine. In Bangladesh, legal land ownership can only be certified by authorized government authorities (Sub-Registry Office and Assistant Commissioner Land) or decreed by a Civil Court. Our platform helps users review documentation consistency before visiting those authorities.',
      aBn:
        'না। ল্যান্ডওয়াইজ কোনো অবস্থাতেই আইনি স্বত্ব সনদ দিতে পারে না। বাংলাদেশে জমির চূড়ান্ত মালিকানা নির্ধারণের এখতিয়ার কেবল সহকারী কমিশনার (ভূমি), সাব-রেজিস্ট্রি অফিস বা দেওয়ানি আদালতের। আমাদের প্ল্যাটফর্মটি কেবল কর্মকর্তাদের ও ক্রেতাদের সিদ্ধান্ত গ্রহণের পূর্বপ্রস্তুতিমূলক স্ক্রিনিং হিসেবে কাজ করে।',
    },
    {
      qEn: '3. Does the platform connect directly to live government databases?',
      qBn: '৩. এই প্ল্যাটফর্ম কি সরকারি লাইভ ডাটাবেজের সাথে সরাসরি যুক্ত?',
      aEn:
        'Currently, the prototype uses representative historical datasets, structured cadastral records across all 64 districts, and simulated API interfaces. Production-level live integration requires formal Memorandums of Understanding (MoU) and authorized API credentials from the Ministry of Land and DLRS.',
      aBn:
        'বর্তমানে এই প্রোটোটাইপটি বাংলাদেশের ৬৪ জেলার প্রতিনিধি ডেটাসেট, কাঠামোগত ক্যাডাস্ট্রাল রেকর্ড ও সিমুলেটেড এপিআই ব্যবহার করছে। সরকারি মূল ডাটাবেজের লাইভ অ্যাক্সেসের জন্য ভূমি মন্ত্রণালয় ও ডিএলআরএস-এর আনুষ্ঠানিক সমঝোতা স্মারক (MoU) ও প্রাতিষ্ঠানিক এপিআই অনুমতি প্রয়োজন।',
    },
    {
      qEn: '4. What can AI do, and what can it NOT do regarding land documents?',
      qBn: '৪. জমির দলিলের ক্ষেত্রে কৃত্রিম বুদ্ধিমত্তা কী করতে পারে এবং কী করতে পারে না?',
      aEn:
        'AI can read scanned forms, extract Dag numbers and names, calculate fractional anna-ganda shares, match inheritance progression, and detect missing documents. However, AI CANNOT physically inspect the land, cannot confirm biometric identity without government systems, and cannot replace the lawful signature of an authorized officer.',
      aBn:
        'এআই স্ক্যান করা নথিপত্র পড়তে পারে, দাগ নম্বর ও নাম শনাক্ত করতে পারে, আনা-গন্ডার জটিল গাণিতিক হিস্যা মেলাতে পারে এবং ধারাবাহিকতা পরীক্ষা করতে পারে। কিন্তু এআই বাস্তবে জমিন গিয়ে পরিমাপ করতে পারে না এবং কোনো সরকারি কর্মকর্তার আইনি স্বাক্ষরের বিকল্প হতে পারে না।',
    },
    {
      qEn: '5. Who is expected to pay for this service? Are citizens forced to pay?',
      qBn: '৫. এই প্ল্যাটফর্মের খরচ কে দেবে? সাধারণ নাগরিকরা কি টাকা দিতে বাধ্য?',
      aEn:
        'Citizens are not required to be the primary revenue source. Our commercial model focuses on B2B subscriptions from real estate developers, commercial banks verifying mortgage loan collateral, and legal firms. Government offices may adopt it via annual GovTech service-level agreements, while citizens can access basic educational guidance freely.',
      aBn:
        'সাধারণ নাগরিকদের মূল আর্থিক উৎস হওয়ার প্রয়োজন নেই। আমাদের ব্যবসায়িক মডেলটি তৈরি হয়েছে রিয়েল এস্টেট ডেভেলপার, বাণিজ্যিক ব্যাংক ও আইনি ফার্মগুলোর বি২বি সাবস্ক্রিপশনের ওপর ভিত্তি করে। সরকারি অফিসগুলো সফটওয়্যার সেবা ও রক্ষণাবেক্ষণ চুক্তির মাধ্যমে এটি ব্যবহার করতে পারে, আর নাগরিকরা প্রাথমিক সেবা বিনামূল্যে দেখতে পারেন।',
    },
    {
      qEn: '6. Does LandWise guarantee 100% fraud prevention?',
      qBn: '৬. ল্যান্ডওয়াইজ কি শতভাগ জালিয়াতি প্রতিরোধের নিশ্চয়তা দেয়?',
      aEn:
        'No technology can guarantee 100% fraud prevention. LandWise identifies documented inconsistencies—such as a deed claiming 5 decimals when the underlying RS Khatian only records 4 decimals, or an unmutated deceased owner. Physical impersonation, forged offline stamps, or undocumented disputes must still be verified through official channels.',
      aBn:
        'কোনো প্রযুক্তিই শতভাগ জালিয়াতি প্রতিরোধের পূর্ণ নিশ্চয়তা দিতে পারে না। ল্যান্ডওয়াইজ নথিপত্রের গাণিতিক ও ধারাবাহিক গরমিল (যেমন: খতিয়ানে ৪ শতক জমি কিন্তু দলিলে ৫ শতক দাবি) তাৎক্ষণিক ধরে ফেলে। তবে ভুয়া ব্যক্তির সশরীরে উপস্থিতি বা অপ্রকাশিত বিরোধ যাচাই করতে সরকারি কর্মকর্তা ও আইনজীবীর নজরদারি আবশ্যক।',
    },
    {
      qEn: '7. How is sensitive personal and land document information protected?',
      qBn: '৭. সংবেদনশীল ব্যক্তিগত তথ্য ও দলিলের নিরাপত্তা কীভাবে বজায় রাখা হয়?',
      aEn:
        'The system uses industry-standard AES-256 encryption at rest and TLS 1.3 in transit. Document data is processed under strict tenant isolation, meaning one client cannot see another client’s files. We adhere to data minimization principles, ensuring document images are not used to train public third-party AI models.',
      aBn:
        'প্ল্যাটফর্মটি ডেটা এনক্রিপশনের জন্য ইন্ডাস্ট্রি স্ট্যান্ডার্ড AES-256 এবং ট্রানজিটের জন্য TLS 1.3 ব্যবহার করে। প্রতিটি ক্লায়েন্টের নথি সম্পূর্ণ পৃথক ও সংরক্ষিত থাকে এবং কোনো পাবলিক মডেলের সাথে বাণিজ্যিক ডেটা শেয়ার করা হয় না।',
    },
    {
      qEn: '8. How can a commercial company or bank subscribe?',
      qBn: '৮. কোনো বাণিজ্যিক প্রতিষ্ঠান বা ব্যাংক কীভাবে এই সেবা গ্রহণ করতে পারে?',
      aEn:
        'Commercial clients can explore illustrative tiers (Starter, Professional, Enterprise) and register for early pilot access. Upon deployment, organizations receive multi-seat team accounts, REST API keys, and priority customer success integration with their credit approval systems.',
      aBn:
        'বাণিজ্যিক প্রতিষ্ঠানগুলো আমাদের নির্ধারিত টায়ার (স্টার্টার, প্রফেশনাল, এন্টারপ্রাইজ) যাচাই করে পাইলট অ্যাক্সেসের জন্য আবেদন করতে পারে। পূর্ণাঙ্গ চালুর পর তারা সরাসরি মাল্টি-সিট অ্যাকাউন্ট ও তাদের কোর-ব্যাংকিং বা ইআরপি সিস্টেমের সাথে এপিআই সংযোগ সুবিধা পাবে।',
    },
    {
      qEn: '9. Is the platform already being used by real paying customers?',
      qBn: '৯. এই প্ল্যাটফর্মটি কি বর্তমানে বাস্তব গ্রাহক দ্বারা বাণিজ্যিকভাবে ব্যবহৃত হচ্ছে?',
      aEn:
        'No. To remain fully honest before judges and visitors: LandWise is currently a working functional prototype built for the LandTech Hackathon. It features working client-side engines, sample cases, and calculators, but has not yet commenced live commercial operations or received official government deployment.',
      aBn:
        'না। বিচারক ও দর্শকদের সামনে সম্পূর্ণ স্বচ্ছ থাকতে আমরা পরিষ্কারভাবে জানাচ্ছি: ল্যান্ডওয়াইজ বর্তমানে ল্যান্ডটেক হ্যাকাথনের জন্য নির্মিত একটি কার্যকর প্রোটোটাইপ। এর ফিচার ও ক্যালকুলেটরগুলো কার্যকর হলেও এটি এখনো বাণিজ্যিক বিক্রি শুরু করেনি বা কোনো সরকারি অফিসে স্থায়ীভাবে মোতায়েন হয়নি।',
    },
    {
      qEn: '10. What is needed before this system can be deployed in the real world?',
      qBn: '১০. বাস্তবে পুরোপুরি চালু করার পূর্বে এই সিস্টেমের কী কী প্রয়োজন?',
      aEn:
        'Three milestones are required: (1) A supervised 6-week pilot with 100 historical anonymized land records to benchmark OCR and error-detection F1-scores; (2) Formal third-party cybersecurity and penetration audits; and (3) Data-sharing API frameworks with the relevant government directorates.',
      aBn:
        'বাস্তবে মোতায়েনের পূর্বে ৩টি ধাপ প্রয়োজন: (১) ১০০টি ঐতিহাসিক অ্যানোনিমাইজড দলিলের ওপর ৬ সপ্তাহের নিয়ন্ত্রিত পাইলট ট্রায়াল; (২) স্বাধীন সাইবার সিকিউরিটি ও পেনিট্রেশন অডিট; এবং (৩) ভূমি মন্ত্রণালয়ের সংশ্লিষ্ট দপ্তরের সাথে নিরাপদ এপিআই সমঝোতা।',
    },
    {
      qEn: '11. How does LandWise support the Land Crime Prevention and Redress Act 2023?',
      qBn: '১১. ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩-এর সমর্থনে ল্যান্ডওয়াইজ কীভাবে কাজ করে?',
      aEn:
        'The 2023 Act criminalizes selling land without valid title, selling the same plot multiple times, and creating forged deeds. LandWise automates the cross-checking of Dag numbers and owner lineage, giving buyers and officers documented proof of title continuity before deeds are drafted.',
      aBn:
        'ভূমি অপরাধ আইন ২০২৩ অনুযায়ী মালিকানা ছাড়া জমি বিক্রি, একই জমি একাধিকবার হস্তান্তর ও জাল দলিল তৈরি ফৌজদারি অপরাধ। ল্যান্ডওয়াইজ দলিলের পূর্ববর্তী ধারাবাহিকতা যাচাই করে এসব অপরাধমূলক লেনদেনের লক্ষণ প্রাথমিক পর্যায়েই শনাক্ত করতে সাহায্য করে।',
    },
    {
      qEn: '12. What makes LandWise scalable across all 64 districts of Bangladesh?',
      qBn: '১২. বাংলাদেশের ৬৪ জেলায় এই সিস্টেম কীভাবে সহজে ছড়িয়ে দেওয়া সম্ভব?',
      aEn:
        'Our software is built with containerized microservices and responsive web standards. It can run on standard browser workstations in Upazila offices without requiring expensive local servers or GPUs, leveraging centralized secure cloud or sovereign National Data Center hosting.',
      aBn:
        'আমাদের সিস্টেমটি স্ট্যান্ডার্ড ক্লাউড ও ওয়েব স্ট্যান্ডার্ডে নির্মিত। উপজেলা পর্যায়ের কম্পিউটারগুলোতে কোনো ভারী সফটওয়্যার বা দামি সার্ভার ইনস্টল না করেই সাধারণ ব্রাউজার থেকেই এটি ৬৪ জেলার মৌজা ও খতিয়ান ডেটায় প্রবেশ করতে সক্ষম।',
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* ── SECTION HEADER & NARRATIVE STORY BANNER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <i className="bx bx-book-open text-emerald-600 dark:text-emerald-400 text-sm" aria-hidden="true" />
          <span>
            {isBn
              ? 'সম্পূর্ণ গল্পের ধারাবাহিক রূপরেখা • সমস্যা থেকে ভবিষ্যৎ রোডম্যাপ'
              : 'THE COMPLETE LANDWISE STORY • FROM CRISIS TO SUSTAINABLE DIGITAL INFRASTRUCTURE'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
          {isBn ? (
            <>
              কেন ল্যান্ডওয়াইজ জরুরি? <span className="text-emerald-700 dark:text-emerald-400">একটি সহজ গল্পে জানুন</span>
            </>
          ) : (
            <>
              The LandWise Story: <span className="text-emerald-700 dark:text-emerald-400">Why This Project Matters</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'সাধারণ নাগরিক, বিচারকমণ্ডলী, সরকারি কর্মকর্তা ও করপোরেট বিনিয়োগকারীদের জন্য বাংলাদেশের ভূমি ব্যবস্থার সমস্যা, আমাদের প্রযুক্তি, সময় সাশ্রয়, ব্যবসায়িক মডেল ও ভবিষ্যৎ রোডম্যাপ।'
            : 'A clean narrative progression designed for judges, landowners, government officials, and investors: The Problem → How It Works → Who Benefits → Time & Cost Savings → Business Model → Trust & Roadmap.'}
        </p>

        {/* Quick Glossary Help Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] text-zinc-500">
          <span>{isBn ? 'ভূমি পরিভাষা সহায়তা:' : 'LandTech Glossary:'}</span>
          {Object.keys(glossaryTerms).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedGlossaryTerm(key)}
              className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-emerald-50 dark:bg-zinc-800 dark:hover:bg-emerald-950/40 text-zinc-700 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer text-[10px] font-medium"
            >
              {key === 'ocr'
                ? 'OCR'
                : key === 'khatian'
                ? 'Khatian'
                : key === 'dag'
                ? 'Dag'
                : key === 'mutation'
                ? 'Mutation'
                : key === 'dakhila'
                ? 'Dakhila'
                : key === 'dueDiligence'
                ? 'Due Diligence'
                : 'Audit Trail'}
            </button>
          ))}
        </div>
      </div>

      {/* ── 6-STAGE STORYLINE STEPPER / NARRATIVE BREADCRUMB ── */}
      <div className="p-2 sm:p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-[#121215] shadow-sm">
        <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 text-center pb-2 hidden sm:block">
          {isBn ? 'গল্পের ধাপসমূহ নির্বাচন করুন' : 'Explore The 6 Chapters of the Project Story'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {storyActs.map((act, index) => {
            const isActive = activeAct === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setActiveAct(act.id)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'bg-emerald-50/80 border-emerald-500 text-zinc-950 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-emerald-950/40 border-emerald-500 text-white shadow-xs ring-1 ring-emerald-500'
                    : isLight
                    ? 'bg-zinc-50/80 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                    : 'bg-[#18181C] hover:bg-[#202026] border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : isLight
                        ? 'bg-zinc-200 text-zinc-700'
                        : 'bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    {act.number}
                  </span>
                  <i
                    className={`bx ${act.icon} text-base ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight line-clamp-1">
                    {isBn ? act.titleBn : act.titleEn}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                    {isBn ? act.taglineBn : act.taglineEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACT 1: THE PROBLEM (BANGLADESH LAND CRISIS)
          ───────────────────────────────────────────────────────────── */}
      {activeAct === 'problem' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Executive Summary Card */}
          <div className="p-6 rounded-2xl border bg-gradient-to-br from-rose-50/60 via-white to-amber-50/40 dark:from-rose-950/20 dark:via-[#141418] dark:to-amber-950/20 border-rose-200/80 dark:border-rose-900/40 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <i className="bx bx-error text-xs" />
              <span>{isBn ? 'অধ্যায় ১: মূল সমস্যা' : 'Chapter 1: The Core Problem'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-zinc-950 dark:text-white">
              {isBn
                ? 'বাংলাদেশের ভূমি ব্যবস্থাপনার সংকট: ৩২ লাখ মামলার জট ও কাগজের নথি বিভ্রাট'
                : 'The Real-World Crisis: 3.2 Million Court Cases & Generational Land Conflict'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
              {isBn
                ? 'বাংলাদেশে দেওয়ানি আদালতের ৭০ শতাংশেরও বেশি মামলার মূল কারণ ভূমিস্বত্ব সংক্রান্ত বিরোধ। একটি বিতর্কিত জমির নিষ্পত্তি হতে গড়ে ১৫ থেকে ২৫ বছর সময় লাগে, যা বংশপরম্পরায় মামলা পরিচালনায় পারিবারিক নিঃস্বতা ও কোটি কোটি টাকার অর্থনৈতিক স্থবিরতা তৈরি করে।'
                : 'Over 70% of all civil court disputes in Bangladesh stem from land title and boundary confusion. The average land lawsuit takes 15 to 25 years to resolve, causing severe financial distress, family conflict, and locking billions in economic capital.'}
            </p>
          </div>

          {/* 4 Impactful Problem Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
            <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-heading">
                3.2M+
              </div>
              <div className="font-bold text-zinc-900 dark:text-white">
                {isBn ? 'বিচারাধীন দেওয়ানি মামলা' : 'Pending Land Lawsuits'}
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {isBn
                  ? 'সারাদেশের আদালতে ঝুলে থাকা মামলার সিংহভাগই জমির জাল দলিল বা স্বত্ব বিরোধ।'
                  : 'Clogging civil courts and overwhelming judicial magistrates nationwide.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-heading">
                70%+
              </div>
              <div className="font-bold text-zinc-900 dark:text-white">
                {isBn ? 'দেওয়ানি বিরোধের মূল উৎস' : 'Of All Civil Disputes'}
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {isBn
                  ? 'পারিবারিক হিংসা ও ফৌজদারি অপরাধের এক বিশাল অংশ জন্ম নেয় জমি বিরোধ থেকে।'
                  : 'Traced back directly to fraudulent deeds or broken chain-of-title records.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-heading">
                15–25 Yrs
              </div>
              <div className="font-bold text-zinc-900 dark:text-white">
                {isBn ? 'গড় মামলা নিষ্পত্তির সময়' : 'Dispute Resolution Time'}
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {isBn
                  ? 'দাদা শুরু করেন, বাবা পরিচালনা করেন এবং নাতি এসে রায় পান।'
                  : 'Frequently spanning multiple generations, paralyzing productive land utilization.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                4 Layers
              </div>
              <div className="font-bold text-zinc-900 dark:text-white">
                {isBn ? 'বিচ্ছিন্ন জরিপ রেকর্ড' : 'Disconnected Surveys'}
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight">
                {isBn
                  ? 'সিএস (১৮৮৮), এসএ (১৯৫৬), আরএস (১৯৭০) ও বিএস (১৯৯৮)-এর দাগের অমিল।'
                  : 'CS, SA, RS, and BS survey records lack a single digital cross-reference index.'}
              </p>
            </div>
          </div>

          {/* 3 Root Flaws of the Existing System */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-book-content" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '১. কাগজের বালাম বইয়ের ভঙ্গুরতা' : '1. Physical Paper Vulnerability'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'উপজেলা ও সাব-রেজিস্ট্রির ৩০,০০০+ প্রাচীন বাঁধানো বালাম বইয়ের কালি মুছে যাচ্ছে, পোকায় কাটছে এবং ছেঁড়া পাতা বা পেনসিলের অবৈধ কাটাকাটির কারণে রেকর্ড বিকৃত হচ্ছে।'
                  : 'Over 30,000 hand-bound register volumes suffer from ink oxidation, moisture decay, termite attacks, and unauthorized pencil tampering in local record rooms.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-git-merge" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '২. জরিপ দাগের বিচ্ছিন্নতা' : '2. Disconnected Cadastral Surveys'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'সিএস থেকে বিএস পর্যন্ত প্রতি জরিপে প্লটের দাগ ও খতিয়ান নম্বর বদলে গেছে। সরকারি নকশার সাথে হস্তলিখিত বালাম মেলানোর কোনো স্বয়ংক্রিয় ডিজিটাল রূপান্তর নেই।'
                  : 'Dag and Khatian numbers changed across 130 years of British, Pakistan, and Bangladesh surveys without a unified digital cross-matching index.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-user-x" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৩. দ্বৈত বিক্রি ও ওয়ারিশান জালিয়াতি' : '3. Double Selling & Heir Fraud'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'একই জমি একাধিক ব্যক্তির কাছে বায়না বা সাফ-কবলা করা হয়। অন্য ওয়ারিশদের না জানিয়ে গোপনে অংশ বিক্রি করায় নির্দোষ ক্রেতারা সর্বস্বান্ত হন।'
                  : 'Fraudulent sellers exploit paper gaps to sell the same parcel to multiple buyers or conceal non-signing heirs, leaving innocent families bankrupt.'}
              </p>
            </div>
          </div>

          {/* Statutory Mandate Note */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
            <i className="bx bx-badge-check text-emerald-600 text-lg shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-950 dark:text-white font-bold">
                {isBn
                  ? 'ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩-এর আইনি বাধ্যবাধকতা:'
                  : 'Statutory Imperative: Land Crime Prevention and Redress Act 2023:'}
              </strong>{' '}
              {isBn
                ? 'আইন অনুযায়ী স্বত্ব ছাড়া জমি বিক্রি বা একই জমি একাধিকবার হস্তান্তর ফৌজদারি অপরাধ (সর্বোচ্চ ৭ বছর কারাদণ্ড)। ল্যান্ডওয়াইজ চুক্তি বা নিবন্ধনের পূর্বেই স্বত্বলিপির ধারাবাহিকতা খতিয়ে দেখে অপরাধ ও প্রতারণা রুখতে সাহায্য করে।'
                : 'The 2023 Act criminalizes selling land without valid title or multiple sales of the same plot (up to 7 years imprisonment). LandWise provides the exact digital pre-audit infrastructure needed to verify title continuity before contracts are signed.'}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ACT 2: HOW IT WORKS (6-STEP DIGITAL PIPELINE)
          ───────────────────────────────────────────────────────────── */}
      {activeAct === 'how-it-works' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <i className="bx bx-git-commit text-xs" />
              <span>{isBn ? 'অধ্যায় ২: কার্যপদ্ধতি' : 'Chapter 2: The 6-Step Engine'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-zinc-950 dark:text-white">
              {isBn ? '৬টি সহজ ধাপে নথিপত্র থেকে বিশ্বস্ত নিরীক্ষা' : 'The 6-Step Land Document Verification Journey'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'কাগজের জটিল দলিল কীভাবে ধাপে ধাপে যাচাইকৃত ডিজিটাল তথ্যে রূপান্তরিত হয়।'
                : 'How manual, paper-heavy land records move seamlessly through ingestion, extraction, and verification.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  1
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {isBn ? 'ইনটেক ও আপলোড' : 'Intake'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '১. নথি আপলোড বা নির্বাচন' : '1. Upload or Access Document'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'ব্যবহারকারী তার সাফ-কবলা দলিল, আরএস খতিয়ান বা ই-নামজারি পর্চা স্ক্যান করে সিস্টেমে প্রদান করেন অথবা আমাদের প্রোটোটাইপ ডেমো কেস নির্বাচন করেন।'
                  : 'The user provides a land document through an authorized upload workflow or selects one of the 4 authentic real-world demonstration cases.'}
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                <strong>Current State:</strong> Working file-drop modal with OCR simulation &amp; verified demonstration cases.
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  2
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                  {isBn ? 'ওসিআর ও ডিজিটাইজ' : 'OCR Extraction'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '২. তথ্য রূপান্তর ও ডিজিটাইজেশন' : '2. Digitize the Information'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'ওসিআর ইঞ্জিন স্ক্যানকৃত ছবি থেকে দাগ নম্বর, খতিয়ান নম্বর, জে.এল. নম্বর, জমির হিস্যা ও মালিকের নাম নির্ভুলভাবে এক্সট্রাক্ট করে।'
                  : 'Document-processing tools extract readable key-value information from scanned papers, isolating legal parcel identifiers.'}
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                <strong>Current State:</strong> Extracts 12 core statutory attributes into structured JSON objects.
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  3
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {isBn ? 'ক্রস-অডিট ম্যাট্রিক্স' : '12-Field Graph'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৩. দলিলের ধারাবাহিকতা বিশ্লেষণ' : '3. Analyze the Document'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'সিস্টেম সাফ-কবলা দলিলের সাথে আরএস খতিয়ান ও ই-নামজারি মিলিয়ে দেখে দাগ নম্বর ও জমির পরিমাণে কোনো অসঙ্গতি আছে কিনা।'
                  : 'The graph engine matches the deed against the underlying survey Khatian and tax receipt, checking fractional math and ownership lineage.'}
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                <strong>Current State:</strong> Fully working 12-field verification matrix evaluating Dag, Area, Seller &amp; Office.
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  4
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  {isBn ? 'রেড ফ্ল্যাগ সতর্কতা' : 'Discrepancies'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৪. সম্ভাব্য অসঙ্গতি ও ঝুঁকি চিহ্নিতকরণ' : '4. Review Potential Issues'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'যদি বিক্রেতা তার খতিয়ানের মোট অংশের চেয়ে বেশি জমি বিক্রি করতে চান অথবা ওয়ারিশান সূত্রে শূন্যতা থাকে, তবে তা লাল সতর্কতায় হাইলাইট হয়।'
                  : 'The platform flags missing inheritance links, area deficits, or suspicious transfer patterns with specific statutory evidence citations.'}
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                <strong>Current State:</strong> Categorizes findings into Critical Red Flags, High Warnings, and Verified Concordance.
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  5
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  {isBn ? 'মানুষের চূড়ান্ত যাচাই' : 'Human Oversight'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৫. অনুমোদিত মানুষের চূড়ান্ত নিরীক্ষা' : '5. Human Verification & Oversight'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'সরকারি কর্মকর্তা বা আইনজীবী সিস্টেমের নির্দেশিত রেড ফ্ল্যাগগুলো পর্যালোচনা করে সিদ্ধান্ত গ্রহণ করেন। এআই কখনো স্বয়ংক্রিয়ভাবে সিদ্ধান্ত চাপিয়ে দেয় না।'
                  : 'An authorized legal professional or government officer reviews flagged items, cross-verifies physical records, and approves next legal steps.'}
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                <strong>Core Philosophy:</strong> Strict Human-in-the-Loop design preserving authorized discretion.
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  6
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {isBn ? 'যাচাইকৃত ডসিয়ার' : 'Verifiable Output'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৬. ফলাফল ও অডিট ডসিয়ার প্রস্তুতি' : '6. Generate Traceable Result'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {isBn
                  ? 'একটি পাঠযোগ্য সারসংক্ষেপ, ঝুঁকি স্কোর, প্রমাণের অডিট ট্রেইল এবং ক্রিপ্টোগ্রাফিক হ্যাশ সহ ডাউনলোডযোগ্য ডসিয়ার তৈরি হয়।'
                  : 'Presents a readable summary, risk score, statutory finding trail, and cryptographic SHA-256 hash seal for auditability.'}
              </p>
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500">
                <strong>Current State:</strong> Working PDF Export engine and interactive on-screen audit report.
              </div>
            </div>

          </div>

          {/* Working vs Planned Banner */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#16161B] text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
              <i className="bx bx-info-circle text-emerald-600 dark:text-emerald-400 text-base" />
              <span>
                {isBn
                  ? 'স্বচ্ছতা ও সত্যনিষ্ঠতা: কার্যকর বনাম ভবিষ্যত পরিকল্পনা'
                  : 'Honest Disclosure: Working In-Browser Engine vs Planned Gov DB APIs'}
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
              {isBn
                ? 'বর্তমান কোডবেজে ৪টি খাঁটি কেস স্টাডি, ১২টি ফিল্ডের ক্রস-অডিট গ্রাফ, ও তাৎক্ষণিক হিসাবের ইঞ্জিন সম্পূর্ণ সচল। তবে সরকারি সেন্ট্রাল ডাটাবেজের (eporcha/land.gov.bd) সাথে সরাসরি সংযোগ স্থাপনের বিষয়টি ভবিষ্যতে সমঝোতা স্মারক (MoU) ও প্রাতিষ্ঠানিক অনুমোদনের ওপর নির্ভরশীল।'
                : 'The current prototype contains fully functional client-side graph verification, math cross-checks, and simulated OCR for 4 real-world cases. Direct real-time API verification against government databases (eporcha.gov.bd) is a planned capability requiring official Ministry of Land data-sharing agreements.'}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ACT 3: WHO BENEFITS (6 STAKEHOLDER PERSONAS)
          ───────────────────────────────────────────────────────────── */}
      {activeAct === 'who-benefits' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <i className="bx bx-group text-xs" />
              <span>{isBn ? 'অধ্যায় ৩: উপকারভোগী' : 'Chapter 3: Who Benefits'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-zinc-950 dark:text-white">
              {isBn ? 'কার কী উপকার হবে? ৬টি ভিন্ন স্তরের সেবা' : 'Who Benefits? Tailored for 6 Core Stakeholder Personas'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'নাগরিক থেকে শুরু করে করপোরেট বিনিয়োগকারী—সবার জন্যই নির্দিষ্ট সমস্যা ও সমাধানের স্পষ্ট রূপরেখা।'
                : 'Explore specific problems, platform solutions, and realistic boundaries for each sector.'}
            </p>
          </div>

          {/* Persona selector tabs */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-1">
            {personas.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                  selectedPersona === idx
                    ? isLight
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-white text-zinc-900 border-white shadow-xs'
                    : isLight
                    ? 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    : 'bg-[#18181C] hover:bg-[#202026] text-zinc-300 border-zinc-800'
                }`}
              >
                <i className={`bx ${p.icon} text-sm`} />
                <span>{isBn ? p.titleBn.split(' ')[0] : p.titleEn.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Selected Persona Deep Dive Card */}
          {personas[selectedPersona] && (
            <div className="p-6 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">
                    <i className={`bx ${personas[selectedPersona].icon}`} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-zinc-950 dark:text-white">
                      {isBn ? personas[selectedPersona].titleBn : personas[selectedPersona].titleEn}
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {isBn ? personas[selectedPersona].badgeBn : personas[selectedPersona].badgeEn}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  Persona #{selectedPersona + 1} of 6
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                
                {/* Existing Problem */}
                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                    <i className="bx bx-error-circle text-sm" />
                    <span>{isBn ? 'বিদ্যমান সমস্যা ও জটিলতা' : 'The Existing Problem'}</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {isBn ? personas[selectedPersona].problemBn : personas[selectedPersona].problemEn}
                  </p>
                </div>

                {/* How LandWise Helps */}
                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <i className="bx bx-check-circle text-sm" />
                    <span>{isBn ? 'ল্যান্ডওয়াইজ যেভাবে সাহায্য করে' : 'How LandWise Helps'}</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {isBn ? personas[selectedPersona].helpsBn : personas[selectedPersona].helpsEn}
                  </p>
                </div>

                {/* Limitations */}
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                    <i className="bx bx-shield-quarter text-sm" />
                    <span>{isBn ? 'সহায়তার আইনি সীমাবদ্ধতা' : 'Limits of Assistance'}</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {isBn ? personas[selectedPersona].limitsBn : personas[selectedPersona].limitsEn}
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ACT 4: TIME AND COST SAVINGS (BEFORE VS AFTER & ROI TOOL)
          ───────────────────────────────────────────────────────────── */}
      {activeAct === 'time-savings' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <i className="bx bx-calculator text-xs" />
              <span>{isBn ? 'অধ্যায় ৪: সময় ও অর্থ সাশ্রয়' : 'Chapter 4: Time & Cost Savings'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-zinc-950 dark:text-white">
              {isBn ? '৭৩% দ্রুত নিরীক্ষা: বাস্তব কাজের উদাহরণ ও হিসাব' : '73% Faster Due Diligence: Real-World Scenario & ROI Calculator'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'কাগজের বালাম বই ঘেঁটে যাচাই বনাম স্বয়ংক্রিয় গ্রাফ স্ক্রিনিং—কী পরিমাণ সময় ও অর্থ বাঁচবে দেখুন।'
                : 'Compare the before-and-after workflow and use the interactive tool below to calculate your estimated savings.'}
            </p>
          </div>

          {/* Side-by-Side Comparison: Before vs With LandWise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Before Column */}
            <div className="p-5 rounded-2xl border bg-rose-50/30 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40 space-y-3.5">
              <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-400 text-sm pb-2 border-b border-rose-200 dark:border-rose-900/40">
                <i className="bx bx-time text-base" />
                <span>{isBn ? 'আগে: প্রচলিত হস্তলিখিত ব্যবস্থা' : 'BEFORE LandWise (Manual Process)'}</span>
              </div>

              <ul className="space-y-2.5 text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'কাগজে খোঁজাখুঁজি:' : 'Manual Document Searching:'}</strong>{' '}
                    {isBn
                      ? 'কর্মকর্তা বা জুনিয়র আইনজীবীকে রেকর্ড রুমে ধুলোবালি ঘেঁটে খতিয়ানের পাতা খুঁজে বের করতে হয়।'
                      : 'Staff manually page through dense bound registers (Balam books) and paper archives.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'পুনরাবৃত্ত ডেটা এন্ট্রি:' : 'Repetitive Data Entry:'}</strong>{' '}
                    {isBn
                      ? 'একই দাগ ও ব্যক্তির নাম বারবার নতুন রেজিস্টারে হাতে লিখতে গিয়ে টাইপিং ও বানান ভুল হয়।'
                      : 'Same identifiers are manually copied across multiple inquiry forms with human errors.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'দীর্ঘ পর্যালোচনা:' : 'Multiple Review Rounds:'}</strong>{' '}
                    {isBn
                      ? 'অসঙ্গতি চোখে না পড়ায় একাধিকবার শুনানিতে ফাইল ফেরত যায়; ফাইল শেষ হতে ২ থেকে ৪ সপ্তাহ লাগে।'
                      : 'Hidden fractional share mismatches slip through, triggering repeated dispute hearings.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'ফলাফল:' : 'Total Turnaround:'}</strong>{' '}
                    {isBn ? 'প্রতি ফাইলে ৪.৫ ঘণ্টা ব্যয়; ১৪ থেকে ৩০ দিন অপেক্ষার ঝুঁকি।' : '4.5 hours per file; 14 to 30 days turnaround with high litigation risk.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* With LandWise Column */}
            <div className="p-5 rounded-2xl border bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40 space-y-3.5">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-400 text-sm pb-2 border-b border-emerald-200 dark:border-emerald-900/40">
                <i className="bx bx-check-double text-base" />
                <span>{isBn ? 'ল্যান্ডওয়াইজের সাথে: ডিজিটাল স্ক্রিনিং' : 'WITH LandWise (Assisted Workflow)'}</span>
              </div>

              <ul className="space-y-2.5 text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-2">
                  <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'তাৎক্ষণিক অনুসন্ধান:' : 'Searchable & Digitized:'}</strong>{' '}
                    {isBn
                      ? 'স্ক্যানকৃত যে কোনো দলিল তাৎক্ষণিক সার্চযোগ্য হয়ে যায় এবং দাগের হিস্যা স্ক্রিনে ভেসে ওঠে।'
                      : 'Supported documents become instantly searchable with OCR-extracted legal attributes.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'স্বয়ংক্রিয় ১২-ফিল্ড ম্যাচিং:' : 'Automated 12-Field Audit:'}</strong>{' '}
                    {isBn
                      ? 'সাফ-কবলা দলিলের সাথে আরএস খতিয়ান ও ই-নামজারি স্বয়ংক্রিয়ভাবে মিলিয়ে দেখা হয়।'
                      : 'Core fields are mathematically verified against historical survey parameters in seconds.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'রেড ফ্ল্যাগ হাইলাইট:' : 'Instant Red-Flag Highlighting:'}</strong>{' '}
                    {isBn
                      ? 'ওয়ারিশানের ঘাটতি বা খতিয়ানের মোট অংশের চেয়ে বেশি বিক্রির চেষ্টা হলে তাৎক্ষণিক সতর্কবার্তা দেয়।'
                      : 'Potential area deficits, deceased unmutated owners, or tax arrears are visibly flagged.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                  <span>
                    <strong>{isBn ? 'ফলাফল:' : 'Total Turnaround:'}</strong>{' '}
                    {isBn ? 'প্রতি ফাইলে মাত্র ১.২ ঘণ্টা; ২৪ থেকে ৪৮ ঘণ্টায় সম্পূর্ণ ডসিয়ার প্রস্তুত।' : '1.2 hours per file; 24 to 48 hours turnaround with verifiable audit trail.'}
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Interactive Savings & ROI Calculator Widget */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h4 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <i className="bx bx-calculator text-emerald-600" />
                  <span>{isBn ? 'আপনার সম্ভাব্য সাশ্রয় হিসাব করুন' : 'Calculate Your Potential Savings (Interactive Tool)'}</span>
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isBn
                    ? 'আপনার মাসিক নথির সংখ্যা ও কর্মীদের খরচ প্রবেশ করিয়ে সম্ভাব্য সময় ও আর্থিক সুবিধা যাচাই করুন।'
                    : 'Adjust the sliders to simulate operational savings based on your team’s workload.'}
                </p>
              </div>
              <div className="text-[11px] px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                Formula: Transparent Economics
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              
              {/* Slider 1: Monthly Doc Volume */}
              <div className="space-y-2 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#16161B]">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                  <span>{isBn ? 'মাসিক নথির সংখ্যা:' : 'Monthly Documents:'}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">{docVolume} files</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={docVolume}
                  onChange={(e) => setDocVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>20 files</span>
                  <span>1,000 files</span>
                </div>
              </div>

              {/* Slider 2: Hours Per Document Before */}
              <div className="space-y-2 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#16161B]">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                  <span>{isBn ? 'পূর্ববর্তী গড় সময়/ফাইল:' : 'Time Before (hrs/file):'}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">{timeBeforeHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={timeBeforeHours}
                  onChange={(e) => setTimeBeforeHours(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>1 hr</span>
                  <span>8 hrs</span>
                </div>
              </div>

              {/* Slider 3: Expected Reduction % */}
              <div className="space-y-2 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#16161B]">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                  <span>{isBn ? 'প্রত্যাশিত সময় সাশ্রয় (%):' : 'Expected Reduction:'}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">{reductionPercent}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="85"
                  step="1"
                  value={reductionPercent}
                  onChange={(e) => setReductionPercent(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>20%</span>
                  <span>85%</span>
                </div>
              </div>

              {/* Slider 4: Staff Cost Per Hour */}
              <div className="space-y-2 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#16161B]">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                  <span>{isBn ? 'কর্মী কর্মঘণ্টা খরচ:' : 'Staff Cost/Hour:'}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">৳{staffCostPerHour}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2500"
                  step="50"
                  value={staffCostPerHour}
                  onChange={(e) => setStaffCostPerHour(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>৳200/hr</span>
                  <span>৳2,500/hr</span>
                </div>
              </div>

              {/* Slider 5: Monthly Platform Cost */}
              <div className="space-y-2 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#16161B] sm:col-span-2">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                  <span>{isBn ? 'আনুমানিক প্ল্যাটফর্ম খরচ/মাস:' : 'Monthly Platform Cost:'}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">৳{monthlyPlatformCost.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="150000"
                  step="5000"
                  value={monthlyPlatformCost}
                  onChange={(e) => setMonthlyPlatformCost(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>৳15,000/mo (Starter)</span>
                  <span>৳150,000/mo (Enterprise)</span>
                </div>
              </div>

            </div>

            {/* Calculated Results Banner */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 grid grid-cols-2 lg:grid-cols-5 gap-3 text-center">
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase">
                  {isBn ? 'মাসিক সাশ্রয়কৃত সময়' : 'Hours Saved / Month'}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading">
                  {timeSavedHours.toLocaleString()} hrs
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase">
                  {isBn ? 'সাশ্রয়কৃত সময়ের মূল্য' : 'Value of Saved Time'}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white font-heading">
                  ৳{valueOfTimeSavedBDT.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase">
                  {isBn ? 'মাসিক নিট সুবিধা' : 'Net Monthly Benefit'}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading">
                  ৳{netMonthlyBenefitBDT.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase">
                  {isBn ? 'বার্ষিক নিট সুবিধা' : 'Net Annual Benefit'}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white font-heading">
                  ৳{netAnnualBenefitBDT.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase">
                  {isBn ? 'প্রত্যাশিত আরওআই' : 'Estimated ROI %'}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-heading">
                  {monthlyRoiPercent}%
                </div>
              </div>
            </div>

            {/* Honest Economic Disclaimer */}
            <div className="text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <strong>Transparent Methodology:</strong> Time saved = Monthly Documents × Time Before × Reduction %. Value of time saved = Time Saved × Staff Cost/hr. Net benefit = Value of saved time − Platform costs. ROI = (Net benefit / Platform costs) × 100.
              <span className="block text-amber-700 dark:text-amber-400 mt-1">
                * Note: Saved staff time represents economic capacity and workload liberation; it does not constitute immediate cash savings and must be validated through controlled pilot deployments.
              </span>
            </div>

          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ACT 5: BUSINESS MODEL (WHO PAYS & COMMERCIAL SUSTAINABILITY)
          ───────────────────────────────────────────────────────────── */}
      {activeAct === 'business-model' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <i className="bx bx-wallet text-xs" />
              <span>{isBn ? 'অধ্যায় ৫: ব্যবসায়িক মডেল' : 'Chapter 5: Who Pays For This?'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-zinc-950 dark:text-white">
              {isBn ? 'কারা অর্থায়ন করবে? টেকসই রাজস্ব ও ব্যবসায়িক যুক্তি' : 'Who Pays For This Platform? Sustainable Revenue & Economic Model'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'সাধারণ নাগরিকের ওপর বাড়তি ফি না চাপিয়ে কীভাবে প্রতিষ্ঠানভিত্তিক রাজস্বের মাধ্যমে প্ল্যাটফর্মটি লাভজনক হবে।'
                : 'Clear institutional revenue streams without charging ordinary citizens for basic land verification guidance.'}
            </p>
          </div>

          {/* Citizen Free Tier Banner */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-zinc-950 dark:text-white text-sm">
                <i className="bx bx-check-shield text-emerald-600 text-lg" />
                <span>{isBn ? 'নাগরিকদের জন্য ফ্রি পাবলিক-গুড সার্ভিস' : 'Citizens Do Not Need to Be the Primary Revenue Source'}</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed max-w-2xl">
                {isBn
                  ? 'সাধারণ ভূমি ক্রেতাদের জন্য প্রাথমিক চেক-লিস্ট, রূপান্তর ক্যালকুলেটর ও চার-দফা রেজিস্ট্রি নির্দেশিকা সম্পূর্ণ বিনামূল্যে উন্মুক্ত থাকবে।'
                  : 'Ordinary citizens and small landowners can access standard educational guidance, conversion tools, and registry check-lists without mandatory subscription fees.'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider shrink-0 self-start sm:self-center">
              {isBn ? 'পাবলিক গুড স্তর' : 'Public Good Tier'}
            </span>
          </div>

          {/* 6 Institutional Revenue Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            
            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-buildings" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '১. রিয়েল এস্টেট সাবস্ক্রিপশন' : '1. Real Estate Subscriptions'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                {isBn
                  ? 'আবাসন প্রতিষ্ঠানগুলো শত শত প্লটের জমির ধারাবাহিকতা ও বাউন্ডারি যাচাই করতে মাসিক বি২বি সাবস্ক্রিপশন নেবে।'
                  : 'Property developers processing dozens of contiguous plots subscribe to accelerate acquisitions and protect investments.'}
              </p>
              <div className="pt-2 text-[10px] text-zinc-400 font-mono">
                Illustrative Tier: ৳45,000–৳120,000 / month
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-bank" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '২. ব্যাংকিং বন্ধকী স্ক্রিনিং' : '2. Bank Mortgage Verification'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                {isBn
                  ? 'হোম লোন ও প্রাতিষ্ঠানিক ঋণের বিপরীতে বন্ধকী জমির প্রাথমিক স্ক্রিনিং রিপোর্ট প্রদান ফি।'
                  : 'Commercial banks and NBFIs pay per-document scrutiny fees to prevent non-performing loan (NPL) title risks.'}
              </p>
              <div className="pt-2 text-[10px] text-zinc-400 font-mono">
                Illustrative Rate: ৳1,500–৳3,500 / screening
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-briefcase" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৩. আইনি ফার্ম ওয়ার্কস্টেশন' : '3. Law Firm Workstations'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                {isBn
                  ? 'দলিল প্রস্তুতকারী ও আইনজীবীদের জন্য বংশপরম্পরা ম্যাপিং ও টাইপিং সহকারী হিসেবে সিট লাইসেন্স।'
                  : 'Multi-seat professional software licenses for real estate advocates transcribing Khatians and drafting searches.'}
              </p>
              <div className="pt-2 text-[10px] text-zinc-400 font-mono">
                Illustrative Tier: ৳25,000–৳60,000 / month
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-government" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৪. সরকারি গভটেক লাইসেন্স' : '4. GovTech Enterprise SLAs'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                {isBn
                  ? 'উপজেলা ভূমি অফিস ও সাব-রেজিস্ট্রির জন্য ক্লাউড বা অন-প্রিমিসেস সফটওয়্যার ও রক্ষণাবেক্ষণ চুক্তি।'
                  : 'Annual software maintenance and cloud hosting contracts with Upazila Land Offices and Sub-Registry rooms.'}
              </p>
              <div className="pt-2 text-[10px] text-zinc-400 font-mono">
                Annual Institutional SLA Model
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-data" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৫. ঐতিহাসিক বালাম ডিজিটাইজেশন' : '5. Volume Digitization Services'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                {isBn
                  ? 'পুরাতন বালাম বই ও মৌজা নকশা স্ক্যান করে হাই-রেজুলেশন ডিজিটাল ভেক্টরে রূপান্তরের সেবা।'
                  : 'Specialized optical character recognition and digitization services for historical district land archives.'}
              </p>
              <div className="pt-2 text-[10px] text-zinc-400 font-mono">
                Volume-Based Per-Mouza Pricing
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-white dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-lg font-bold">
                <i className="bx bx-code-curly" />
              </div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                {isBn ? '৬. ডেভেলপার রেস্ট এপিআই' : '6. Developer REST API'}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[11px]">
                {isBn
                  ? 'থার্ড-পার্টি ফিনটেক ও প্রপটেক অ্যাপ্লিকেশনের জন্য জমির স্বত্ব ও ঝুঁকি স্ক্রিনিং এপিআই।'
                  : 'High-throughput programmatic API keys for enterprise ERPs, mortgage origination systems, and legal databases.'}
              </p>
              <div className="pt-2 text-[10px] text-zinc-400 font-mono">
                Pay-Per-Call API Metering
              </div>
            </div>

          </div>

          {/* Pricing Disclaimer Note */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#141418] text-[11px] text-zinc-500 text-center">
            <strong>Labeling Notice:</strong> Illustrative business model and example pricing, not a confirmed market rate. Actual financial benefits depend on organizational workload, deployment scale, and integration complexity.
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ACT 6: TRUST & FUTURE ROADMAP (AI LIMITS, ROADMAP & FAQS)
          ───────────────────────────────────────────────────────────── */}
      {activeAct === 'trust-roadmap' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <i className="bx bx-shield-quarter text-xs" />
              <span>{isBn ? 'অধ্যায় ৬: বিশ্বাস ও রোডম্যাপ' : 'Chapter 6: Trust, Roadmap & FAQs'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-zinc-950 dark:text-white">
              {isBn ? 'বিশ্বস্ততা ও ভবিষ্যৎ রূপরেখা: স্বচ্ছ এআই ও পূর্ণাঙ্গ রোডম্যাপ' : 'Building Trust: AI Boundaries, Transparent Roadmap & Public FAQs'}
            </h3>
            <p className="text-xs text-zinc-500">
              {isBn
                ? 'এআই-এর আসল ক্ষমতা ও সীমাবদ্ধতা, ৩-ধাপের বাস্তবায়ন পরিকল্পনা এবং ১২টি সততাপূর্ণ প্রশ্নোত্তর।'
                : 'What AI can and cannot do, unembellished deployment milestones, and direct answers to statutory questions.'}
            </p>
          </div>

          {/* Sub-Tabs Selector inside Act 6 */}
          <div className="flex items-center justify-center gap-2 pb-1">
            <button
              onClick={() => setTrustSubTab('ai-limits')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                trustSubTab === 'ai-limits'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <i className="bx bx-check-double mr-1" />
              {isBn ? 'এআই কী পারে ও পারে না' : 'What AI Can & Cannot Do'}
            </button>

            <button
              onClick={() => setTrustSubTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                trustSubTab === 'roadmap'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <i className="bx bx-trending-up mr-1" />
              {isBn ? '৩-ধাপের ভবিষ্যৎ রোডম্যাপ' : '3-Stage Roadmap'}
            </button>

            <button
              onClick={() => setTrustSubTab('faq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                trustSubTab === 'faq'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <i className="bx bx-help-circle mr-1" />
              {isBn ? '১২টি গুরুত্বপূর্ণ প্রশ্নোত্তর' : '12 Public FAQs'}
            </button>
          </div>

          {/* Sub-Tab 1: AI Limits Matrix */}
          {trustSubTab === 'ai-limits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-fade-in">
              
              {/* What AI Can Do */}
              <div className="p-5 rounded-2xl border bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40 space-y-3">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-400 text-sm pb-2 border-b border-emerald-200 dark:border-emerald-900/40">
                  <i className="bx bx-check-circle text-base" />
                  <span>{isBn ? 'কৃত্রিম বুদ্ধিমত্তা যেভাবে সাহায্য করতে পারে' : 'What AI CAN Help With'}</span>
                </div>
                <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2">
                    <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                    <span>{isBn ? 'স্ক্যানকৃত দলিলের বাংলা ও ইংরেজি টেক্সট দ্রুত পাঠ করা।' : 'Reading supported scanned deeds and handwritten Porcha forms.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                    <span>{isBn ? 'মালিকের নাম, দাগ নম্বর, খতিয়ান ও জে.এল. নম্বর স্বয়ংক্রিয়ভাবে এক্সট্রাক্ট করা।' : 'Extracting names, dates, parcel IDs, and fractional shares.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                    <span>{isBn ? 'দলিলের সাথে আরএস খতিয়ানের জমির পরিমাণের অমিল চিহ্নিত করা।' : 'Detecting discrepancies between deeds and underlying Khatians.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                    <span>{isBn ? 'নিবন্ধনে অনুপস্থিত ওয়ারিশান বা কর দাখিলার বকেয়া সতর্কবার্তা দেওয়া।' : 'Flagging missing inheritance links and unpaid development taxes.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                    <span>{isBn ? 'নথিপত্র সাজিয়ে কর্মকর্তাদের দ্রুত পর্যালোচনার জন্য প্রমাণের ছক তৈরি করা।' : 'Organizing document chains for rapid human review.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-check text-emerald-600 text-sm mt-0.5" />
                    <span>{isBn ? 'মানুষের মনোযোগ প্রয়োজন এমন ঝুঁকিপূর্ণ ফাইলগুলোকে অগ্রাধিকার দেওয়া।' : 'Prioritizing anomalous files for authorized officer oversight.'}</span>
                  </li>
                </ul>
              </div>

              {/* What AI Cannot Do */}
              <div className="p-5 rounded-2xl border bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40 space-y-3">
                <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-400 text-sm pb-2 border-b border-rose-200 dark:border-rose-900/40">
                  <i className="bx bx-shield-x text-base" />
                  <span>{isBn ? 'এআই কখনো যা নিশ্চয়তা দিতে পারে না' : 'What AI CANNOT Automatically Guarantee'}</span>
                </div>
                <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start gap-2">
                    <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                    <span>{isBn ? 'দলিলটি শারীরিকভাবে খাঁটি ও আসল কি না তা নিশ্চিত করা।' : 'That a physical paper document is genuine or free from counterfeit stamps.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                    <span>{isBn ? 'কোনো ব্যক্তি আইনিভাবে ওই সম্পত্তির একমাত্র প্রকৃত মালিক কি না।' : 'That a person legally owns a property under civil land jurisprudence.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                    <span>{isBn ? 'শতভাগ প্রতারণা বা জালিয়াতি যেকোনো পরিস্থিতিতেই ধরা পড়বে।' : 'That every offline fraud or impersonation attempt will be detected.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                    <span>{isBn ? 'সরকারি রেকর্ড রুমের তথ্য শতভাগ নির্ভুল বা হালনাগাদ।' : 'That underlying historical government records are current or complete.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                    <span>{isBn ? 'দলিলটির কোনো অঘোষিত দেওয়ানি মামলা স্থগিতাদেশ (Injunction) নেই।' : 'That a property is unencumbered by unrecorded civil court injunctions.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="bx bx-x text-rose-500 text-sm mt-0.5" />
                    <span>{isBn ? 'এআই-এর ফলাফল কোনো ক্ষমতাপ্রাপ্ত সরকারি কর্মকর্তার আদেশের বিকল্প হতে পারে।' : 'That an automated score replaces an authorized officer’s legal signature.'}</span>
                  </li>
                </ul>
              </div>

            </div>
          )}

          {/* Sub-Tab 2: 3-Stage Scalability Roadmap */}
          {trustSubTab === 'roadmap' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fade-in">
              
              {/* Stage 1 */}
              <div className="p-5 rounded-2xl border bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/40 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                  Available Now
                </span>
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {isBn ? '১. বর্তমান কার্যকর ফিচার (কোডবেজ)' : '1. Available Now (Codebase Verified)'}
                </h4>
                <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <li>• ১২-ফিল্ড ক্রস-অডিট ভেরিফিকেশন ইঞ্জিন</li>
                  <li>• ৪টি বাস্তবসম্মত ডেমো কেস ও অসঙ্গতি বিশ্লেষণ</li>
                  <li>• ৬৪ জেলার ক্যাডাস্ট্রাল ভৌগোলিক মানচিত্র</li>
                  <li>• বাংলাদেশি ভূমি পরিমাপ ও মূল্য ক্যালকুলেটর</li>
                  <li>• ক্রিপ্টোগ্রাফিক হ্যাশযুক্ত অডিট ডসিয়ার (PDF)</li>
                </ul>
              </div>

              {/* Stage 2 */}
              <div className="p-5 rounded-2xl border bg-blue-50/30 dark:bg-blue-950/10 border-blue-500/40 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                  Next Stage
                </span>
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {isBn ? '২. পাইলট ও বাস্তব যাচাইকরণ' : '2. Next: Pilot & Validation'}
                </h4>
                <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <li>• ১০০টি ঐতিহাসিক দলিলের ওপর ৬ সপ্তাহের নিয়ন্ত্রিত পাইলট</li>
                  <li>• বাংলা হস্তলিপি ওসিআর একিউরেসি ও F1-স্কোর নির্ধারণ</li>
                  <li>• স্বাধীন সাইবার সিকিউরিটি ও ডাটা প্রাইভেসী অডিট</li>
                  <li>• সহকারী কমিশনার (ভূমি) কর্মকর্তাদের সরাসরি ফিডব্যাক</li>
                  <li>• ডেবিলিশন ও ফলস-পজিটিভ রেট মিনিমাইজেশন</li>
                </ul>
              </div>

              {/* Stage 3 */}
              <div className="p-5 rounded-2xl border bg-purple-50/30 dark:bg-purple-950/10 border-purple-500/40 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-600 text-white">
                  Future Vision
                </span>
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {isBn ? '৩. প্রাতিষ্ঠানিক বিস্তার' : '3. Future: Institutional Scaling'}
                </h4>
                <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                  <li>• ভূমি মন্ত্রণালয়ের সাথে সমঝোতা (MoU) ও লাইভ API</li>
                  <li>• eporcha.gov.bd ও ই-নামজারি গেটওয়ে ইন্টিগ্রেশন</li>
                  <li>• ন্যাশনাল ডাটা সেন্টারে সার্বভৌম ক্লাউড ডিপ্লয়মেন্ট</li>
                  <li>• কোর-ব্যাংকিং লোন স্ক্রিনিং এন্টারপ্রাইজ এপিআই</li>
                  <li>• ৬৪ জেলা ও ৪৯৫ উপজেলায় পর্যায়ক্রমিক বিস্তার</li>
                </ul>
              </div>

            </div>
          )}

          {/* Sub-Tab 3: 12 Public FAQs */}
          {trustSubTab === 'faq' && (
            <div className="space-y-2.5 animate-fade-in">
              {faqItems.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-[#18181D] transition-colors cursor-pointer"
                    >
                      <span>{isBn ? faq.qBn : faq.qEn}</span>
                      <i
                        className={`bx bx-chevron-down text-base text-zinc-400 transition-transform ${
                          isOpen ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-[#15151A]">
                        {isBn ? faq.aBn : faq.aEn}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ── CHAPTER BOTTOM STORY NAVIGATION CONTROLS ── */}
      <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#141418] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevAct}
            disabled={currentActIndex === 0}
            className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentActIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-transparent text-zinc-400 border-zinc-300 dark:border-zinc-700'
                : 'bg-white dark:bg-[#1c1c22] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
            }`}
          >
            <i className="bx bx-chevron-left text-base" />
            <span>{isBn ? 'পূর্ববর্তী অধ্যায়' : 'Previous Chapter'}</span>
          </button>

          <span className="text-[11px] font-mono text-zinc-500 px-2">
            {isBn ? `অধ্যায় ${currentActIndex + 1} / ৬` : `Chapter ${currentActIndex + 1} of 6`}
          </span>

          <button
            onClick={handleNextAct}
            disabled={currentActIndex === storyActs.length - 1}
            className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
              currentActIndex === storyActs.length - 1
                ? 'opacity-40 cursor-not-allowed bg-transparent text-zinc-400 border-zinc-300 dark:border-zinc-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
            }`}
          >
            <span>{isBn ? 'পরবর্তী অধ্যায়' : 'Next Chapter'}</span>
            <i className="bx bx-chevron-right text-base" />
          </button>
        </div>

        {/* Quick jump to live interactive tools */}
        <div className="flex items-center gap-2">
          <a
            href="#due-diligence"
            className="px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold flex items-center gap-1.5 text-xs transition-colors"
          >
            <i className="bx bx-git-repo-forked text-emerald-600" />
            <span>{isBn ? 'লাইভ ডিউ ডিলিজেন্স টেস্ট করুন' : 'Test Live Due-Diligence Tool'}</span>
          </a>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          GLOSSARY MODAL / POPUP
          ───────────────────────────────────────────────────────────── */}
      {selectedGlossaryTerm && glossaryTerms[selectedGlossaryTerm] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <i className="bx bx-book text-base" />
                <span>{isBn ? 'ভূমি পরিভাষা ব্যাখ্যা' : 'LandTech Glossary Term'}</span>
              </div>
              <button
                onClick={() => setSelectedGlossaryTerm(null)}
                className="w-7 h-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 cursor-pointer"
              >
                <i className="bx bx-x text-xl" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-zinc-950 dark:text-white">
                {isBn
                  ? glossaryTerms[selectedGlossaryTerm].titleBn
                  : glossaryTerms[selectedGlossaryTerm].titleEn}
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {isBn
                  ? glossaryTerms[selectedGlossaryTerm].descBn
                  : glossaryTerms[selectedGlossaryTerm].descEn}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedGlossaryTerm(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold cursor-pointer transition-colors"
              >
                {isBn ? 'বুঝেছি' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
