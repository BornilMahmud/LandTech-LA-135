// LandTech 2026 — Innovation Hackathon Official Track Data
// Track: Digital Land Records, Verification & Digitization
// Covers Section 5 (P1-P5) and Section 4 (8 Target Sectors) of the LandTech 2026 Rulebook

export interface SampleKhatianScan {
  id: string;
  edition: 'CS' | 'SA' | 'RS' | 'BS';
  editionBn: string;
  khatianNo: string;
  mouzaName: string;
  mouzaBn: string;
  jlNo: string;
  upazila: string;
  district: string;
  scanType: 'handwritten_vintage' | 'printed_official';
  dags: {
    dagNo: string;
    dagType: 'hal' | 'sabek';
    landType: string;
    landTypeBn: string;
    totalAreaDecimals: number;
    shares: {
      ownerName: string;
      ownerNameBn: string;
      anaGondaShare: string; // Traditional 16-ana system
      decimalShare: number;
    }[];
  }[];
  previewImageNote: string;
  banglaRawText: string;
}

export const SAMPLE_KHATIAN_SCANS: SampleKhatianScan[] = [
  {
    id: 'khatian-rs-142',
    edition: 'RS',
    editionBn: 'আরএস খতিয়ান',
    khatianNo: '১৪২',
    mouzaName: 'Badda',
    mouzaBn: 'বাড্ডা',
    jlNo: '০৯',
    upazila: 'Badda',
    district: 'Dhaka',
    scanType: 'handwritten_vintage',
    dags: [
      {
        dagNo: '৩০৮',
        dagType: 'hal',
        landType: 'Nal (Agricultural)',
        landTypeBn: 'নাল (কৃষি জমি)',
        totalAreaDecimals: 30.0,
        shares: [
          {
            ownerName: 'Munsur Ali Sheikh',
            ownerNameBn: 'মুনসুর আলী শেখ',
            anaGondaShare: '০.৫০০ (৮ আনা)',
            decimalShare: 15.0,
          },
          {
            ownerName: 'Kader Sheikh',
            ownerNameBn: 'কাদের শেখ',
            anaGondaShare: '০.৫০০ (৮ আনা)',
            decimalShare: 15.0,
          },
        ],
      },
      {
        dagNo: '৩১২',
        dagType: 'hal',
        landType: 'Bari (Residential Homestead)',
        landTypeBn: 'বাড়ি (আবাসিক ভিটি)',
        totalAreaDecimals: 18.5,
        shares: [
          {
            ownerName: 'Munsur Ali Sheikh',
            ownerNameBn: 'মুনসুর আলী শেখ',
            anaGondaShare: '১.০০০ (১৬ আনা ষোলআনা)',
            decimalShare: 18.5,
          },
        ],
      },
    ],
    previewImageNote: 'Vintage RS Handwritten Sheet • Dhaka District Collectorate seal (1968)',
    banglaRawText: `ঢাকা জেলা, বাড্ডা মৌজা, জেএল নং ০৯
খতিয়ান নং ১৪২ (সাবেক ৬২)
মালিকের নাম: মুনসুর আলী শেখ ও কাদের শেখ, পিতা: করিম বখশ শেখ
দাগ নং ৩০৮ (হাল), শ্রেণি: নাল, মোট জমি: ৩০.০০ শতক
অংশ: মুনসুর আলী শেখ (৮ আনা - ১৫.০০ শতক), কাদের শেখ (৮ আনা - ১৫.০০ শতক)
দাগ নং ৩১২ (হাল), শ্রেণি: বাড়ি, মোট জমি: ১৮.৫০ শতক (১৬ আনা)`,
  },
  {
    id: 'khatian-cs-88',
    edition: 'CS',
    editionBn: 'সিএস খতিয়ান (ক্যাডেলস্ট্রাল সার্ভে)',
    khatianNo: '৮৮',
    mouzaName: 'Tejgaon',
    mouzaBn: 'তেজগাঁও',
    jlNo: '০৪',
    upazila: 'Tejgaon',
    district: 'Dhaka',
    scanType: 'printed_official',
    dags: [
      {
        dagNo: '১০৪',
        dagType: 'sabek',
        landType: 'Chalan Wetland',
        landTypeBn: 'চালান জলাভূমি',
        totalAreaDecimals: 45.0,
        shares: [
          {
            ownerName: 'Zamiruddin Mondol',
            ownerNameBn: 'জমিরউদ্দিন মণ্ডল',
            anaGondaShare: '১.০০০ (১৬ আনা)',
            decimalShare: 45.0,
          },
        ],
      },
    ],
    previewImageNote: 'British Bengal Survey Cadastral Sheet (1918) • Bengal Tenancy Act 1885',
    banglaRawText: `ঢাকা কালেক্টরেট, মৌজা: তেজগাঁও, জে. এল. নং ০৪
সি. এস. খতিয়ান নং ৮৮
রায়তের নাম: জমিরউদ্দিন মণ্ডল, পিতা: গোলাম মণ্ডল
দাগ নং ১০৪ (সাবেক), শ্রেণি: চালান
জমির মোট পরিমাণ: ৪৫ শতক (এক একর পয়তাল্লিশ শতাংশ)`,
  },
  {
    id: 'khatian-bs-512',
    edition: 'BS',
    editionBn: 'বিএস খতিয়ান (বাংলাদেশ সার্ভে)',
    khatianNo: '৫১২',
    mouzaName: 'Panchlaish',
    mouzaBn: 'পাঁচলাইশ',
    jlNo: '১৬',
    upazila: 'Panchlaish',
    district: 'Chattogram',
    scanType: 'printed_official',
    dags: [
      {
        dagNo: '৭২০',
        dagType: 'hal',
        landType: 'Commercial Plot',
        landTypeBn: 'বাণিজ্যিক প্লট',
        totalAreaDecimals: 22.0,
        shares: [
          {
            ownerName: 'Anowar Hossain Chowdhury',
            ownerNameBn: 'আনোয়ার হোসেন চৌধুরী',
            anaGondaShare: '১.০০০ (১৬ আনা)',
            decimalShare: 22.0,
          },
        ],
      },
    ],
    previewImageNote: 'Digital Printed BS Porcha • QR Verified e-Porcha Registry (2012)',
    banglaRawText: `চট্টগ্রাম জেলা, পাঁচলাইশ থানা, পাঁচলাইশ মৌজা, জেএল ১৬
বিএস খতিয়ান নং ৫১২
মালিক: আনোয়ার হোসেন চৌধুরী, পিতা: রফিক উল্লাহ চৌধুরী
হাল দাগ নং ৭২০, শ্রেণি: বাণিজ্যিক, মোট জমি: ২২.০০ শতক
ডিএলআরএস ডিজিটাল ডাটাবেজ ভেরিফায়েড`,
  },
];

// P2: Cryptographic Deed Data
export interface CryptographicDeedSample {
  id: string;
  deedNo: string;
  deedYear: string;
  subRegistry: string;
  sellerName: string;
  sellerNid: string;
  buyerName: string;
  buyerNid: string;
  mouza: string;
  dagNo: string;
  khatianNo: string;
  areaDecimals: number;
  genesisHash: string;
  registrationTimestamp: string;
  isTampered: boolean;
  tamperField?: string;
  tamperOriginal?: string;
  tamperModified?: string;
}

export const SAMPLE_CRYPTO_DEEDS: CryptographicDeedSample[] = [
  {
    id: 'deed-sha-authentic',
    deedNo: '৪৫০২/২০২১',
    deedYear: '2021',
    subRegistry: 'Savar Sub-Registry Office, Dhaka',
    sellerName: 'Abdul Malek Bhuiyan',
    sellerNid: '1975269384729104',
    buyerName: 'Nasir Uddin Ahmed',
    buyerNid: '1988269384910243',
    mouza: 'Bhadail (JL 22)',
    dagNo: 'Hal 812',
    khatianNo: 'RS 340',
    areaDecimals: 12.5,
    genesisHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    registrationTimestamp: '2021-04-12 11:42:18 BST',
    isTampered: false,
  },
  {
    id: 'deed-sha-tampered',
    deedNo: '৮১১২/২০২৩',
    deedYear: '2023',
    subRegistry: 'Tejgaon Sub-Registry Office, Dhaka',
    sellerName: 'Ruhul Amin Talukder',
    sellerNid: '1968269384112233',
    buyerName: 'Sharif Hasan',
    buyerNid: '1992269384556677',
    mouza: 'Tejgaon (JL 04)',
    dagNo: 'Hal 104',
    khatianNo: 'RS 88',
    areaDecimals: 18.0, // Tampered: was originally 10.0 decimals on paper!
    genesisHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    registrationTimestamp: '2023-08-19 14:15:02 BST',
    isTampered: true,
    tamperField: 'landAreaDecimals',
    tamperOriginal: '10.0 Decimals',
    tamperModified: '18.0 Decimals (Forged +8.0 dec)',
  },
];

// P3: Double-Selling & Fraud Cases
export interface DoubleSellingConflictCase {
  id: string;
  mouzaName: string;
  dagNo: string;
  khatianNo: string;
  totalSurveyedAreaDecimals: number;
  fraudType: 'double_sale_unmutated' | 'over_selling_deficit' | 'bank_double_mortgage';
  fraudTypeBn: string;
  descriptionEn: string;
  descriptionBn: string;
  transactions: {
    deedNo: string;
    date: string;
    seller: string;
    buyer: string;
    areaSoldDecimals: number;
    mutationStatus: 'mutated' | 'pending' | 'unmutated_fake';
    subRegistryOffice: string;
  }[];
  statutoryViolation: string;
}

export const SAMPLE_FRAUD_CONFLICTS: DoubleSellingConflictCase[] = [
  {
    id: 'fraud-case-1',
    mouzaName: 'Gazipur Sadar, Mouza: Joydebpur (JL 14)',
    dagNo: 'Hal 412 (Sabek 198)',
    khatianNo: 'RS 204',
    totalSurveyedAreaDecimals: 20.0,
    fraudType: 'double_sale_unmutated',
    fraudTypeBn: 'নামজারিহীন একই জমি দ্বিতীয় ক্রেতার কাছে বিক্রি (দ্বৈত বিক্রয়)',
    descriptionEn: 'The same 10-decimal parcel was sold to Buyer 1 (Rafiqul) in 2021. Before Buyer 1 mutated the porcha, the fraudulent seller re-sold the identical parcel to Buyer 2 (Tanvir) using old CS papers in 2023!',
    descriptionBn: '২০২১ সালে রফিকুলের কাছে ১০ শতক সাফ-কবলা করা হয়। রফিকুল নামজারি সম্পন্ন করার আগেই অসৎ বিক্রেতা ২০২৩ সালে তানভীরের কাছে পুরনো খতিয়ান দেখিয়ে একই ১০ শতক পুনরায় রেজিস্ট্রি করে দিয়েছে!',
    transactions: [
      {
        deedNo: '১২৪০/২০২১',
        date: '2021-03-14',
        seller: 'Shamim Osman',
        buyer: 'Rafiqul Islam',
        areaSoldDecimals: 10.0,
        mutationStatus: 'pending',
        subRegistryOffice: 'Joydebpur Sub-Registry',
      },
      {
        deedNo: '৫৮৯০/২০২৩',
        date: '2023-09-22',
        seller: 'Shamim Osman (Duplicate Sale)',
        buyer: 'Tanvir Hossain (Defrauded Buyer)',
        areaSoldDecimals: 10.0,
        mutationStatus: 'unmutated_fake',
        subRegistryOffice: 'Joydebpur Sub-Registry',
      },
    ],
    statutoryViolation: 'Section 4, Land Crime Prevention and Redress Act 2023 (Up to 7 years imprisonment for fraudulent double conveyance).',
  },
  {
    id: 'fraud-case-2',
    mouzaName: 'Sylhet Sadar, Mouza: Tukerbazar (JL 52)',
    dagNo: 'Hal 910',
    khatianNo: 'RS 115',
    totalSurveyedAreaDecimals: 30.0,
    fraudType: 'over_selling_deficit',
    fraudTypeBn: 'খতিয়ানের মোট জমির চেয়ে বেশি জমি অতিরিক্ত বিক্রয় (আয়তন ঘাটতি)',
    descriptionEn: 'Surveyed RS Dag 910 holds only 30.0 decimals. However, cumulative deeds executed by co-heirs sum to 42.0 decimals, creating a 12.0 decimal paper shortfall where subsequent buyers receive zero physical possession!',
    descriptionBn: 'আরএস ৯১০ দাগে জরিপকৃত মোট জমি ৩০.০০ শতক। কিন্তু ওয়ারিশগণ মোট ৪২.০০ শতক জমি বিভিন্ন দলিলে বিক্রি করেছেন—ফলে ১২.০০ শতক জমি কাগুজে বানোয়াট এবং দখলে কোনো জমি নেই!',
    transactions: [
      {
        deedNo: '৩৪১১/২০২০',
        date: '2020-01-10',
        seller: 'Karim Ullah Heir 1',
        buyer: 'Dr. Shahabuddin',
        areaSoldDecimals: 20.0,
        mutationStatus: 'mutated',
        subRegistryOffice: 'Sylhet Sadar Sub-Registry',
      },
      {
        deedNo: '৭২০২/২০২২',
        date: '2022-11-05',
        seller: 'Rahim Ullah Heir 2',
        buyer: 'Enamul Haque',
        areaSoldDecimals: 22.0, // 20 + 22 = 42 dec, but Dag only has 30 dec!
        mutationStatus: 'unmutated_fake',
        subRegistryOffice: 'Sylhet Sadar Sub-Registry',
      },
    ],
    statutoryViolation: 'Section 5, Land Crime Prevention and Redress Act 2023 (Deceitful sale in excess of lawful title).',
  },
];

// P4: Smart e-Mutation Steps & Timeline
export interface EMutationPipelineStep {
  stageNumber: number;
  titleEn: string;
  titleBn: string;
  dayWindow: string;
  actor: string;
  actorBn: string;
  actionDetailsEn: string;
  actionDetailsBn: string;
  statutoryFeeBDT: number;
  status: 'completed' | 'in_progress' | 'queued';
}

export const EMUTATION_PIPELINE_STAGES: EMutationPipelineStep[] = [
  {
    stageNumber: 1,
    titleEn: 'Digital Application & Deed Token Ingestion',
    titleBn: 'ই-নামজারি আবেদন ও সাব-রেজিস্ট্রি দলিল স্থানান্তর',
    dayWindow: 'Day 1 - 3',
    actor: 'Sub-Registry & Citizen Portal (mutation.land.gov.bd)',
    actorBn: 'সাব-রেজিস্ট্রি ও নাগরিক ভূমি বাতায়ন',
    actionDetailsEn: 'Upon deed execution, deed metadata, seller NID, and land schedule automatically transfer to the AC (Land) database with cryptographic verification token.',
    actionDetailsBn: 'দলিল রেজিস্ট্রেশনের সাথে সাথে দলিলের উপাত্ত, বিক্রেতার এনআইডি ও দাগ নম্বর স্বয়ংক্রিয়ভাবে এসি ল্যান্ড সার্ভারে স্থানান্তরিত হয়ে ট্র্যাকিং নম্বর তৈরি হয়।',
    statutoryFeeBDT: 20, // Court fee
    status: 'completed',
  },
  {
    stageNumber: 2,
    titleEn: 'Union Land Office Field Inquiry & Record Verification',
    titleBn: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (তহশিলদার) কর্তৃক সরেজমিন তদন্ত',
    dayWindow: 'Day 4 - 12',
    actor: 'Union Land Assistant Officer (Tahsildar)',
    actorBn: 'তহশিলদার (ইউনিয়ন ভূমি অফিস)',
    actionDetailsEn: 'Field verification of actual physical possession, checking Khas/Vested list, CS-SA-RS record room reconciliation, and submission of the digital inquiry report.',
    actionDetailsBn: 'জমির প্রকৃত দখল যাচাই, সরকারি খাস বা অর্পিত সম্পত্তি কি না পরীক্ষা এবং মূল ভলিউমের সাথে মিলিয়ে অনলাইনে প্রস্তাবপত্র প্রেরণ।',
    statutoryFeeBDT: 50, // Notice fee
    status: 'completed',
  },
  {
    stageNumber: 3,
    titleEn: 'Public Notice & Objection Hearing',
    titleBn: 'গণবিজ্ঞপ্তি জারি ও ১৫ দিনের শুনানী গ্রহণ',
    dayWindow: 'Day 13 - 22',
    actor: 'Assistant Commissioner (Land) / Kanungo',
    actorBn: 'সহকারী কমিশনার (ভূমি) ও কানুনগো',
    actionDetailsEn: 'Statutory 15-day notice period to co-sharers. Hearing of objections under Section 11 of the State Acquisition and Tenancy Act 1950.',
    actionDetailsBn: 'শরিকদারদের নোটিশ জারি ও ১৫ দিনের সময়সীমা। কোনো আপত্তি থাকলে এসি ল্যান্ড এজলাসে উভয় পক্ষের শুনানী ও নথি পর্যালোচনা।',
    statutoryFeeBDT: 0,
    status: 'in_progress',
  },
  {
    stageNumber: 4,
    titleEn: 'Order Approval, DCR Payment & Digital Khatian Issuance',
    titleBn: 'আদেশ অনুমোদন, ডিসিআর ফি প্রদান ও ডিজিটাল খতিয়ান প্রদান',
    dayWindow: 'Day 23 - 28',
    actor: 'AC Land & Digital Record Room',
    actorBn: 'এসি ল্যান্ড অফিস ও রেকর্ড রুম',
    actionDetailsEn: 'AC Land approves mutation order. Citizen pays statutory DCR fee via bKash/Nagad/Rocket. Instant QR-coded Mutation Khatian and DCR generated.',
    actionDetailsBn: 'নামজারি মঞ্জুর আদেশ। অনলাইনে ১,১০০ টাকা ডিসিআর ফি পরিশোধের সাথে সাথে কিউআর কোডযুক্ত নতুন ডিজিটাল নামজারি খতিয়ান প্রিন্টযোগ্য হয়।',
    statutoryFeeBDT: 1100, // DCR Fee
    status: 'queued',
  },
];

// Target Sectors (Section 4 of Rulebook)
export interface TargetSectorUseRole {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  roleBadge: string;
  primaryBenefitEn: string;
  primaryBenefitBn: string;
  operationalWorkflowEn: string;
  operationalWorkflowBn: string;
}

export const TARGET_SECTOR_ROLES: TargetSectorUseRole[] = [
  {
    id: 'sub-registry',
    nameEn: 'Sub-Registry Offices',
    nameBn: 'সাব-রেজিস্ট্রি অফিস',
    icon: 'bx-buildings',
    roleBadge: 'Pre-Sale Verification',
    primaryBenefitEn: 'Check seller ownership & deed chain before executing registered sale deeds.',
    primaryBenefitBn: 'বিক্রয় রেজিস্ট্রেশনের পূর্বেই বিক্রেতার স্বত্বলিপি ও পূর্বতন দলিল যাচাই।',
    operationalWorkflowEn: 'Sub-Registrar scans seller deed hash; instantly detects if land has already been conveyed or encumbered.',
    operationalWorkflowBn: 'সাব-রেজিস্ট্রার দলিল হ্যাশ স্ক্যান করে তাৎক্ষণিক জানতে পারেন জমিটি ইতিপূর্বে বিক্রি বা বন্ধক রয়েছে কি না।',
  },
  {
    id: 'ac-land',
    nameEn: 'AC Land & Union Land Offices',
    nameBn: 'এসি ল্যান্ড ও ইউনিয়ন ভূমি অফিস',
    icon: 'bx-shield-quarter',
    roleBadge: 'e-Mutation Acceleration',
    primaryBenefitEn: 'Speed up e-Mutation, detect fake porchas, and automate 28-day settlement pipeline.',
    primaryBenefitBn: 'ই-নামজারি নিষ্পত্তির গতি বৃদ্ধি ও ভুয়া পর্চা বা দাগের গরমিল তাৎক্ষণিক শনাক্তকরণ।',
    operationalWorkflowEn: 'Digital transfer from Sub-Registry eliminates physical paper delivery delay and cuts tout corruption.',
    operationalWorkflowBn: 'সাব-রেজিস্ট্রি থেকে সরাসরি ডিজিটাল উপাত্ত প্রাপ্তির ফলে দালালমুক্ত ও দ্রুত নামজারি নিশ্চিত হয়।',
  },
  {
    id: 'banks',
    nameEn: 'Banks & Financial Institutions',
    nameBn: 'ব্যাংক ও আর্থিক প্রতিষ্ঠান',
    icon: 'bx-wallet',
    roleBadge: 'Collateral Risk Guard',
    primaryBenefitEn: 'Verify mortgaged title deeds and stop the identical land being pledged across multiple banks.',
    primaryBenefitBn: 'ঋণের বিপরীতে বন্ধককৃত জমির স্বত্ব যাচাই ও একই জমি একাধিক ব্যাংকে দ্বৈত বন্ধক রোধ।',
    operationalWorkflowEn: 'Credit officers verify non-encumbrance certificate (NEC) and title ancestry before sanctioning loans.',
    operationalWorkflowBn: 'ক্রেডিট অফিসার ঋণ মঞ্জুরের পূর্বে নির্দায় সনদ ও মূল রেকর্ডের ডিজিটাল সত্যতা যাচাই করেন।',
  },
  {
    id: 'dc-office',
    nameEn: 'Land Acquisition (DC Office)',
    nameBn: 'ভূমি অধিগ্রহণ (জেলা প্রশাসকের কার্যালয়)',
    icon: 'bxs-landmark',
    roleBadge: 'Compensation Integrity',
    primaryBenefitEn: 'Confirm genuine lawful owners before government infrastructure compensation payout.',
    primaryBenefitBn: 'সরকারি মেগা প্রজেক্টে অধিগ্রহণের ক্ষতিপূরণ বিতরণের পূর্বে প্রকৃত মালিকানা নিশ্চিতকরণ।',
    operationalWorkflowEn: 'Prevents fraudulent proxy claims by checking unbroken CS-to-BS ownership ancestry.',
    operationalWorkflowBn: 'সিএস থেকে বিএস পর্যন্ত ধারাবাহিক উত্তরাধিকার নিশ্চিত করে ভুয়া দাবিদারদের অর্থ লোপাট রোধ করে।',
  },
  {
    id: 'dlrs',
    nameEn: 'Survey & Records (DLRS)',
    nameBn: 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর (ডিএলআরএস)',
    icon: 'bx-map-pin',
    roleBadge: 'Cadastral Vector Matching',
    primaryBenefitEn: 'Digitize legacy CS, SA, RS sheets and reconcile them with modern digital mouza polygons.',
    primaryBenefitBn: 'শতবর্ষী সিএস, এসএ, আরএস নকশা ডিজিটাইজ করে আধুনিক উপগ্রহ মানচিত্রের সাথে সুসংগত করা।',
    operationalWorkflowEn: 'Raster-to-vector cadastral alignment prevents plot boundary distortions and encroachment.',
    operationalWorkflowBn: 'হাতে আঁকা পুরোনো মৌজা নকশাকে ভেক্টর পলিম্যাপে রূপান্তর করে সীমানা বিরোধ দূর করে।',
  },
  {
    id: 'courts',
    nameEn: 'Courts & Legal Advocates',
    nameBn: 'আদালত ও আইনজীবী',
    icon: 'bxs-institution',
    roleBadge: 'Evidentiary Chain Graph',
    primaryBenefitEn: 'Provide a trusted, immutable record history as court evidence in land title disputes.',
    primaryBenefitBn: 'দেওয়ানি আদালতে জমি-জমা সংক্রান্ত মামলায় প্রামাণ্য স্বত্বলিপির ঐতিহাসিক পরম্পরা উপস্থাপন।',
    operationalWorkflowEn: 'Visual graph export traces root title from 1950 SAT Act to date, resolving Title Suits swiftly.',
    operationalWorkflowBn: '১৯৫০ সালের স্টেট একুইজিশন অ্যাক্ট থেকে বর্তমান পর্যন্ত টাইটেল চেইন উপস্থাপন করে দ্রুত মামলা নিষ্পত্তি।',
  },
  {
    id: 'citizens',
    nameEn: 'Citizens & Prospective Buyers',
    nameBn: 'নাগরিক ও জমি ক্রেতা',
    icon: 'bx-user-check',
    roleBadge: 'Check Before You Buy',
    primaryBenefitEn: 'Empower citizens to verify deeds, mutation records, and khas hazards before paying token money.',
    primaryBenefitBn: 'বায়না বা টাকা দেওয়ার পূর্বেই যেকোনো সাধারণ নাগরিকের জন্য জমির বৈধতা যাচাইয়ের উন্মুক্ত টুল।',
    operationalWorkflowEn: 'Instant Green/Amber/Red flag verdict alerts families and expatriates of hidden fraud before contract signing.',
    operationalWorkflowBn: 'প্রবাসীদের ও সাধারণ পরিবারের জন্য বায়না করার আগেই সম্ভাব্য জালিয়াতি ও মামলা শনাক্ত করার সুবিধা।',
  },
  {
    id: 'real-estate',
    nameEn: 'Real Estate Developers',
    nameBn: 'রিয়েল এস্টেট ডেভেলপার',
    icon: 'bx-building',
    roleBadge: 'Clear Project Title',
    primaryBenefitEn: 'Confirm undisputed title and environmental permits before executing joint-venture agreements.',
    primaryBenefitBn: 'আবাসিক বা বাণিজ্যিক প্রকল্প গ্রহণের পূর্বে নিষ্কণ্টক জমি ও রাজউক/সিডিএ জোনিং ক্লিয়ারেন্স নিশ্চিতকরণ।',
    operationalWorkflowEn: 'Aggregates multiple adjacent dags and verifies collective clearance without unrecorded co-sharer risk.',
    operationalWorkflowBn: 'একাধিক দাগ একত্রিত করে মেগা প্রজেক্টের ক্ষেত্রে ওয়ারিশদের কোনো গোপন অংশ রয়েছে কি না তা শনাক্তকরণ।',
  },
];
