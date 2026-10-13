import {
  ExtractedLandDocument,
  VerificationFinding,
  FindingSeverity,
  EnvironmentalAndSpatialRisk,
} from '../types/dueDiligence';

// Helper: Normalize Bengali & English strings for robust token comparison
export function normalizeText(text: string | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ');
}

// Token-based similarity calculation (Dice's coefficient / Jaccard on tokens)
export function calculateNameSimilarity(nameA: string, nameB: string): number {
  const normA = normalizeText(nameA);
  const normB = normalizeText(nameB);
  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;

  // Bengali prefixes like মোঃ or Md. normalization
  const cleanTokensA = normA.split(' ').filter(t => t !== 'md' && t !== 'মোঃ' && t !== 'md.');
  const cleanTokensB = normB.split(' ').filter(t => t !== 'md' && t !== 'মোঃ' && t !== 'md.');

  const setA = new Set(cleanTokensA);
  const setB = new Set(cleanTokensB);

  let common = 0;
  setA.forEach(token => {
    if (setB.has(token)) common++;
  });

  const total = Math.max(setA.size, setB.size);
  return total > 0 ? common / total : 0;
}

export function performDueDiligenceCrossVerification(
  documents: ExtractedLandDocument[],
  claimedAreaDecimals: number,
  spatialRisk?: EnvironmentalAndSpatialRisk
): VerificationFinding[] {
  const findings: VerificationFinding[] = [];

  const deed = documents.find(d => d.type === 'saf_kabala');
  const khatians = documents.filter(d => d.type === 'khatian');
  const mutations = documents.filter(d => d.type === 'namjari');
  const dakhilas = documents.filter(d => d.type === 'dakhila');

  // ────────────────────────────────────────────────────────────────
  // 1. CHAIN OF TITLE & MUTATION (নামজারি) AUDIT
  // ────────────────────────────────────────────────────────────────
  if (!deed) {
    findings.push({
      id: 'missing-deed',
      titleEn: 'No Registered Sale Deed (Saf-Kabala) Provided',
      titleBn: 'কোনো নিবন্ধিত সাফ-কবলা দলিল বা খসড়া পাওয়া যায়নি',
      severity: 'high_warning',
      category: 'chain_of_title',
      descriptionEn: 'Without a draft or registered Sale Deed, the seller\'s proposed conveyance terms cannot be audited against official records.',
      descriptionBn: 'বিক্রয় দলিল বা খসড়া ছাড়া বিক্রেতার প্রস্তাবিত হস্তান্তর শর্তাবলী সরকারি রেকর্ডের সাথে যাচাই করা সম্ভব নয়।',
      sourceDocumentIds: [],
      recommendedActionEn: 'Demand a certified copy of the seller\'s acquisition deed or drafted Saf-Kabala before committing funds.',
      recommendedActionBn: 'অগ্রিম কোনো টাকা দেওয়ার পূর্বে বিক্রেতার প্রাপ্তি দলিল বা প্রস্তাবিত সাফ-কবলা দলিলের কপি সংগ্রহ করুন।',
    });
  }

  // Mutation Khatian check (Crucial Bangladesh Land Rule)
  if (deed && mutations.length === 0) {
    findings.push({
      id: 'chain-missing-mutation',
      titleEn: 'Critical Red Flag: No Mutation (Namjari) Khatian in Seller\'s Name',
      titleBn: 'মারাত্মক ঝুঁকি: বিক্রেতার নামে কোনো ই-নামজারি বা খারিজ খতিয়ান নেই',
      severity: 'critical_red_flag',
      category: 'chain_of_title',
      descriptionEn: 'The seller is attempting to sell property based on historical records (RS/SA) without having an updated Mutation Khatian (নামজারি পর্চা) registered in their name with the AC (Land) office.',
      descriptionBn: 'বিক্রেতা পুরনো খতিয়ান (আরএস/এসএ) এর ভিত্তিতে জমি বিক্রির চেষ্টা করছেন, কিন্তু সহকারী কমিশনার (ভূমি) অফিস থেকে নিজ নামে কোনো নামজারি খতিয়ান করাননি।',
      sourceDocumentIds: [deed.id],
      evidenceSnippet: `Deed lists seller as "${deed.sellerOrDonorName || deed.primaryOwnerName}", but no corresponding Mutation Porcha was submitted.`,
      recommendedActionEn: 'DO NOT PAY. Under the Land Crime Prevention and Redress Act 2023, selling land without valid mutation and updated Dakhila is an actionable offense. Require the seller to complete Namjari and provide a verified DCR before contract signing.',
      recommendedActionBn: 'কোনো অর্থ লেনদেন করবেন না। ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন ২০২৩ অনুযায়ী নামজারি ছাড়া জমি হস্তান্তর বেআইনি। বিক্রেতাকে আগে নিজ নামে নামজারি ও ডিসিআর সম্পন্ন করতে বলুন।',
      officialVerificationPortal: {
        name: 'Ministry of Land e-Mutation Portal',
        url: 'https://mutation.land.gov.bd/',
        serviceDescription: 'Verify pending or approved mutation cases in the respective Upazila Land Office.',
      },
    });
  } else if (deed && mutations.length > 0) {
    const mutation = mutations[0];
    const seller = deed.sellerOrDonorName || deed.primaryOwnerName;
    const mutOwner = mutation.primaryOwnerName;
    const similarity = calculateNameSimilarity(seller, mutOwner);

    if (similarity >= 0.7) {
      findings.push({
        id: 'chain-mutation-verified',
        titleEn: 'Verified Chain of Title: Mutation Khatian Matches Seller',
        titleBn: 'যাচাইকৃত স্বত্বলিপি: নামজারি খতিয়ান বিক্রেতার নামের সাথে মিলেছে',
        severity: 'verified_evidence',
        category: 'chain_of_title',
        descriptionEn: `Mutation Khatian No. ${mutation.documentNumber} is actively registered in the name of "${mutOwner}", confirming official AC (Land) revenue recognition.`,
        descriptionBn: `নামজারি খতিয়ান নং ${mutation.documentNumber} বিক্রেতা "${mutOwner}"-এর নামে নিবন্ধিত রয়েছে, যা সহকারী কমিশনার (ভূমি) অফিসের স্বীকৃতি নিশ্চিত করে।`,
        sourceDocumentIds: [deed.id, mutation.id],
        evidenceSnippet: `Deed Seller: "${seller}" ↔ Mutation Record: "${mutOwner}" (Case: ${mutation.mutationCaseNumber || 'Valid'})`,
        recommendedActionEn: 'Verify the authenticity of the DCR (Duplicate Carbon Receipt) on the official e-Mutation portal.',
        recommendedActionBn: 'ই-নামজারি পোর্টালে ডিসিআর (ডুপ্লিকেট কার্বন রসিদ) ও খতিয়ানের কিউআর কোড স্ক্যান করে অনলাইন সত্যতা যাচাই করুন।',
        officialVerificationPortal: {
          name: 'e-Mutation Online Verification',
          url: 'https://mutation.land.gov.bd/',
          serviceDescription: 'Scan QR code or search by Mutation Case Number.',
        },
      });
    } else {
      findings.push({
        id: 'chain-mutation-name-mismatch',
        titleEn: 'High Warning: Mutation Owner Name Differs from Deed Seller',
        titleBn: 'সতর্কতা: নামজারি খতিয়ানের মালিকের নামের সাথে দলিলের বিক্রেতার নামের অমিল',
        severity: 'critical_red_flag',
        category: 'chain_of_title',
        descriptionEn: `Deed lists seller as "${seller}", but Mutation Khatian No. ${mutation.documentNumber} records "${mutOwner}". A missing intermediate deed or succession certificate exists.`,
        descriptionBn: `দলিলের বিক্রেতার নাম "${seller}", কিন্তু নামজারি খতিয়ানে মালিক হিসেবে "${mutOwner}"-এর নাম রয়েছে। মধ্যবর্তী কোনো হস্তান্তর দলিল বা ওয়ারিশান সনদ অনুপস্থিত।`,
        sourceDocumentIds: [deed.id, mutation.id],
        evidenceSnippet: `Deed: "${seller}" vs Mutation: "${mutOwner}"`,
        recommendedActionEn: 'Demand the intermediate succession certificate (ওয়ারিশান সনদ) or chain deeds (বায়া দলিল) bridging the gap between the mutation holder and current seller.',
        recommendedActionBn: 'খতিয়ানের মূল মালিকের সাথে বর্তমান বিক্রেতার সম্পর্ক প্রমাণের জন্য বায়া দলিল বা ওয়ারিশান সনদ তলব করুন।',
      });
    }
  }

  // ────────────────────────────────────────────────────────────────
  // 2. DAG (PLOT) IDENTIFIER & SURVEY EDITION ALIGNMENT
  // ────────────────────────────────────────────────────────────────
  if (deed) {
    const deedDag = normalizeText(deed.dagNumber);
    khatians.forEach(k => {
      const khatianDag = normalizeText(k.dagNumber);
      if (deedDag && khatianDag && deedDag !== khatianDag) {
        findings.push({
          id: `dag-mismatch-${k.id}`,
          titleEn: `Discrepancy: Deed Dag (${deed.dagNumber}) vs ${k.surveyEdition || ''} Khatian Dag (${k.dagNumber})`,
          titleBn: `অমিল: দলিলের দাগ নম্বর (${deed.dagNumber}) ও ${k.surveyEdition || ''} খতিয়ানের দাগ (${k.dagNumber}) ভিন্ন`,
          severity: 'high_warning',
          category: 'dag_alignment',
          descriptionEn: `The plot number referenced in the Sale Deed does not match the plot number in the ${k.surveyEdition || ''} Khatian. If the deed uses Hal (current) Dag and the Khatian uses Sabek (former) Dag, an official Dag-Suchi (দাগসূচি) comparative ledger is mandatory.`,
          descriptionBn: `দলিলের দাগ নম্বর এবং খতিয়ানের দাগ নম্বর এক নয়। যদি এটি সাবেক ও হাল দাগের পার্থক্য হয়ে থাকে, তবে ভূমি অফিসের প্রত্যয়িত দাগসূচি ব্যতিরেকে জমি কেনা ঝুঁকিপূর্ণ।`,
          sourceDocumentIds: [deed.id, k.id],
          evidenceSnippet: `Deed Dag: "${deed.dagNumber}" | Khatian Dag: "${k.dagNumber}"`,
          recommendedActionEn: 'Obtain an official comparative Dag-Suchi from the local Sub-Registry or settlement office to verify that the Sabek Dag truly corresponds to the Hal Dag.',
          recommendedActionBn: 'সংশ্লিষ্ট সাব-রেজিস্ট্রি বা সেটেলমেন্ট অফিস থেকে দাগসূচি সংগ্রহ করে সাবেক ও হাল দাগের আন্তঃসম্পর্ক নিশ্চিত করুন।',
          officialVerificationPortal: {
            name: 'DLRS Mouza Map Portal',
            url: 'https://map.settlement.gov.bd/',
            serviceDescription: 'Search both survey editions to trace plot boundary evolution.',
          },
        });
      } else if (deedDag && khatianDag && deedDag === khatianDag) {
        findings.push({
          id: `dag-concordance-${k.id}`,
          titleEn: `Verified: Dag Number (${deed.dagNumber}) Aligned with ${k.surveyEdition || ''} Record`,
          titleBn: `যাচাইকৃত: দলিলের দাগ নম্বর (${deed.dagNumber}) ও খতিয়ানের দাগ সম্পূর্ণ অভিন্ন`,
          severity: 'verified_evidence',
          category: 'dag_alignment',
          descriptionEn: `Dag No. ${deed.dagNumber} matches consistently between the Deed and ${k.surveyEdition || ''} Khatian No. ${k.khatianNumber}.`,
          descriptionBn: `দলিল এবং খতিয়ান নং ${k.khatianNumber}-এ উল্লেখিত দাগ নম্বর (${deed.dagNumber}) সম্পূর্ণরূপে মিলে গেছে।`,
          sourceDocumentIds: [deed.id, k.id],
          recommendedActionEn: 'Confirm physical plot boundaries on the certified DLRS Mouza map sheet.',
          recommendedActionBn: 'ডিএলআরএস সার্টিফাইড মৌজা নকশায় বাস্তব সীমানা চিহ্নিত করুন।',
        });
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 3. LAND AREA RECONCILIATION & DEFICIT CHECK (হিস্যা ও পরিমাণ)
  // ────────────────────────────────────────────────────────────────
  const targetArea = claimedAreaDecimals || (deed ? deed.landAreaDecimals : 0);
  
  if (khatians.length > 0 && targetArea > 0) {
    khatians.forEach(k => {
      const recordedKhatianArea = k.subjectTransferredAreaDecimals || k.landAreaDecimals;
      const delta = targetArea - recordedKhatianArea;

      if (delta > 0.05) {
        // Seller selling more than they own in khatian
        findings.push({
          id: `area-deficit-${k.id}`,
          titleEn: `Area Deficit Warning: Claimed ${targetArea.toFixed(2)} Decimals exceeds Khatian (${recordedKhatianArea.toFixed(2)} Decimals)`,
          titleBn: `জমির পরিমাণে ঘাটতি: বিক্রয় প্রস্তাব (${targetArea.toFixed(2)} শতক) খতিয়ানের রেকর্ড (${recordedKhatianArea.toFixed(2)} শতক)-এর চেয়ে বেশি`,
          severity: 'high_warning',
          category: 'area_reconciliation',
          descriptionEn: `The proposed transaction claims ${targetArea.toFixed(2)} decimals, but the seller\'s recorded share in ${k.surveyEdition || ''} Khatian No. ${k.khatianNumber} is only ${recordedKhatianArea.toFixed(2)} decimals (Deficit of ${delta.toFixed(2)} decimals).`,
          descriptionBn: `বিক্রেতা ${targetArea.toFixed(2)} শতক জমি বিক্রির প্রস্তাব করেছেন, কিন্তু খতিয়ান অনুযায়ী তার অংশে রয়েছে মাত্র ${recordedKhatianArea.toFixed(2)} শতক। ঘাটতির পরিমাণ ${delta.toFixed(2)} শতক।`,
          sourceDocumentIds: [k.id, ...(deed ? [deed.id] : [])],
          evidenceSnippet: `Claimed Area: ${targetArea} decimals ↔ Khatian Record: ${recordedKhatianArea} decimals (Deficit: -${delta.toFixed(2)} decimals)`,
          recommendedActionEn: 'Do not pay for the excess area. Have a professional Amin / Surveyor measure the physical possession (দখল) and demand amendment of the deed schedule to reflect the actual verified share.',
          recommendedActionBn: 'অতিরিক্ত অংশের জন্য কোনো মূল্য পরিশোধ করবেন না। অনুমোদিত সার্ভেয়ার দ্বারা বাস্তব দখল পরিমাপ করান এবং খতিয়ানের হিস্যা অনুযায়ী দলিল সংশোধন করুন।',
        });
      } else if (Math.abs(delta) <= 0.05) {
        findings.push({
          id: `area-match-${k.id}`,
          titleEn: `Verified Land Area: ${targetArea.toFixed(2)} Decimals Fully Accounted in ${k.surveyEdition || ''} Khatian`,
          titleBn: `যাচাইকৃত জমির পরিমাণ: ${targetArea.toFixed(2)} শতক খতিয়ানের অংশের সাথে হুবহু মিলেছে`,
          severity: 'verified_evidence',
          category: 'area_reconciliation',
          descriptionEn: `The proposed land area (${targetArea.toFixed(2)} decimals) matches the recorded share in Khatian No. ${k.khatianNumber}.`,
          descriptionBn: `প্রস্তাবিত জমির পরিমাণ (${targetArea.toFixed(2)} শতক) খতিয়ানের মোট হিস্যার সাথে সামঞ্জস্যপূর্ণ।`,
          sourceDocumentIds: [k.id, ...(deed ? [deed.id] : [])],
          recommendedActionEn: 'Verify physical possession (দখল) with on-site measurement before registration.',
          recommendedActionBn: 'রেজিস্ট্রেশনের পূর্বে সরেজমিনে ফিতা দিয়ে মেপে বাস্তব দখল নিশ্চিত হোন।',
        });
      }
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 4. MOUZA & J.L. NUMBER CONCORDANCE
  // ────────────────────────────────────────────────────────────────
  const mouzaNames = new Set<string>();
  const jlNumbers = new Set<string>();

  documents.forEach(d => {
    if (d.mouzaName) mouzaNames.add(normalizeText(d.mouzaName));
    if (d.jlNumber) jlNumbers.add(String(d.jlNumber).trim());
  });

  if (mouzaNames.size > 1) {
    findings.push({
      id: 'mouza-mismatch',
      titleEn: 'Severe Inconsistency: Discrepant Mouza Names Detected',
      titleBn: 'গুরুতর অসঙ্গতি: দলিলের নথিপত্রে ভিন্ন ভিন্ন মৌজার নাম পাওয়া গেছে',
      severity: 'critical_red_flag',
      category: 'dag_alignment',
      descriptionEn: 'The documents in this dossier reference different Mouza names. This strongly indicates mismatched or composite documents relating to different plots of land.',
      descriptionBn: 'সংযুক্ত নথিপত্রগুলোতে ভিন্ন ভিন্ন মৌজার নাম উল্লেখ রয়েছে। এটি দুটি আলাদা জমির কাগজ মিশে যাওয়ার মারাত্মক লক্ষণ।',
      sourceDocumentIds: documents.map(d => d.id),
      recommendedActionEn: 'Halt transaction immediately until the seller clarifies which Mouza applies and produces documents from a single consistent jurisdiction.',
      recommendedActionBn: 'লেনদেন স্থগিত রাখুন এবং বিক্রেতার নিকট থেকে একই মৌজার সুসংগত ও একক নথিপত্র তলব করুন।',
    });
  }

  if (jlNumbers.size > 1) {
    findings.push({
      id: 'jl-mismatch',
      titleEn: 'Inconsistency: Different J.L. Numbers Recorded',
      titleBn: 'অসঙ্গতি: দলিলের কাগজপত্রে ভিন্ন ভিন্ন জে.এল. নম্বর লিপিবদ্ধ রয়েছে',
      severity: 'high_warning',
      category: 'dag_alignment',
      descriptionEn: `Multiple J.L. numbers (${Array.from(jlNumbers).join(', ')}) were detected. Because each Mouza has an immutable J.L. number within its Thana, this discrepancy suggests conflicting survey jurisdictions.`,
      descriptionBn: `একাধিক জে.এল. নম্বর পাওয়া গেছে। একই থানার অধীনে প্রতিটি মৌজার একটি নির্দিষ্ট জে.এল. নম্বর থাকে, ফলে এই অমিলটি প্রশাসনিক অসংগতির ইঙ্গিত দেয়।`,
      sourceDocumentIds: documents.map(d => d.id),
      recommendedActionEn: 'Verify the true J.L. number at the Upazila Land Office or through the DLRS online portal.',
      recommendedActionBn: 'উপজেলা ভূমি অফিস বা ডিএলআরএস পোর্টাল থেকে মৌজার সঠিক জে.এল. নম্বর যাচাই করুন।',
      officialVerificationPortal: {
        name: 'DLRS Mouza & J.L. Directory',
        url: 'https://map.settlement.gov.bd/',
        serviceDescription: 'Search Mouza and Upazila to verify official J.L. designation.',
      },
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 5. TAX (DAKHILA / খাজনা) REVENUE AUDIT
  // ────────────────────────────────────────────────────────────────
  if (dakhilas.length === 0) {
    findings.push({
      id: 'missing-tax-dakhila',
      titleEn: 'Missing Land Tax Receipt (Dakhila / দাখিলা)',
      titleBn: 'ভূমি উন্নয়ন কর পরিশোধের দাখিলা অনুপস্থিত',
      severity: 'high_warning',
      category: 'tax_compliance',
      descriptionEn: 'No recent Land Development Tax (LD Tax) Dakhila was provided. Under Bangladesh law, unpaid tax arrears transfer to the subsequent buyer and can result in certificate cases or attachment.',
      descriptionBn: 'হাল সনের ভূমি উন্নয়ন কর পরিশোধের কোনো দাখিলা সংযুক্ত করা হয়নি। বকেয়া খাজনা থাকলে জমি ক্রয়ের পর ক্রেতার ওপর দেনা বর্তায়।',
      sourceDocumentIds: [],
      recommendedActionEn: 'Require the seller to provide a verified digital LD Tax Dakhila paid up to the current fiscal year before registry.',
      recommendedActionBn: 'বিক্রেতার নিকট থেকে চলতি অর্থবছরের হালনাগাদ ডিজিটাল ভূমি উন্নয়ন কর পরিশোধের রসিদ দাবি করুন।',
      officialVerificationPortal: {
        name: 'Land Development Tax Portal (ভূমি উন্নয়ন কর)',
        url: 'https://ldtax.gov.bd/',
        serviceDescription: 'Check online land tax dues, clearance tokens, and digital Dakhila.',
      },
    });
  } else {
    const dakhila = dakhilas[0];
    findings.push({
      id: 'dakhila-verified',
      titleEn: `Land Tax Dakhila Recorded: Clearance Year ${dakhila.taxClearanceYear || 'Current'}`,
      titleBn: `দাখিলা নথিবদ্ধ: খাজনা পরিশোধিত সন ${dakhila.taxClearanceYear || 'হালনাগাদ'}`,
      severity: 'verified_evidence',
      category: 'tax_compliance',
      descriptionEn: `Official Dakhila No. ${dakhila.documentNumber} is on record, showing payments through ${dakhila.taxClearanceYear || '1431 BS'}.`,
      descriptionBn: `দাখিলা নং ${dakhila.documentNumber} সংযুক্ত রয়েছে, যেখানে ${dakhila.taxClearanceYear || '১৪৩১ বঙ্গাব্দ'} পর্যন্ত কর পরিশোধিত দেখানো হয়েছে।`,
      sourceDocumentIds: [dakhila.id],
      recommendedActionEn: 'Cross-check the 10-digit digital payment token on the online LD Tax portal before executing the final deed.',
      recommendedActionBn: 'চূড়ান্ত দলিল রেজিস্ট্রেশনের পূর্বে অনলাইন ভূমি উন্নয়ন কর পোর্টালে ১০ ডিজিটের পেমেন্ট টোকেন যাচাই করুন।',
      officialVerificationPortal: {
        name: 'LD Tax Online Verification',
        url: 'https://ldtax.gov.bd/',
        serviceDescription: 'Verify Dakhila token number against the government treasury.',
      },
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 6. ENVIRONMENTAL, SPATIAL & ZONING HAZARD AUDIT
  // ────────────────────────────────────────────────────────────────
  if (spatialRisk) {
    if (spatialRisk.floodRiskLevel === 'severe' || spatialRisk.floodRiskLevel === 'high') {
      findings.push({
        id: 'spatial-flood-alert',
        titleEn: `Elevated Flood Hazard: ${spatialRisk.floodRiskLevel.toUpperCase()} Vulnerability`,
        titleBn: `বন্যা ও প্লাবন ঝুঁকি: ${spatialRisk.floodRiskLevel === 'severe' ? 'মারাত্মক' : 'উচ্চ'} মাত্রার ঝুঁকিপূর্ণ এলাকা`,
        severity: spatialRisk.floodRiskLevel === 'severe' ? 'high_warning' : 'moderate_inconsistency',
        category: 'spatial_zoning',
        descriptionEn: spatialRisk.floodRiskDescriptionEn,
        descriptionBn: spatialRisk.floodRiskDescriptionBn,
        sourceDocumentIds: [],
        recommendedActionEn: 'Conduct an on-site rainy season inspection and check local flood level marks with neighboring residents before committing construction capital.',
        recommendedActionBn: 'বর্ষা মৌসুমে সরেজমিনে জমি পরিদর্শন করুন এবং স্থানীয় বাসিন্দাদের সাথে কথা বলে প্লাবন মাত্রা নিশ্চিত হোন।',
      });
    }

    if (spatialRisk.riverErosionRisk === 'high_alert' || spatialRisk.riverErosionRisk === 'moderate') {
      findings.push({
        id: 'spatial-erosion-alert',
        titleEn: 'Riverbank Erosion (নদী ভাঙন) Risk Detected',
        titleBn: 'নদী ভাঙন প্রবণ অঞ্চলের সন্নিকটে অবস্থিত',
        severity: spatialRisk.riverErosionRisk === 'high_alert' ? 'critical_red_flag' : 'high_warning',
        category: 'spatial_zoning',
        descriptionEn: spatialRisk.riverErosionDescriptionEn,
        descriptionBn: spatialRisk.riverErosionDescriptionBn,
        sourceDocumentIds: [],
        recommendedActionEn: 'Inquire with the Water Development Board (BWDB) regarding embankment projects and historical erosion rates in this Mouza.',
        recommendedActionBn: 'পানি উন্নয়ন বোর্ডের স্থানীয় অফিসের সাথে যোগাযোগ করে তীর সংরক্ষণ বাঁধ ও ভাঙন ঝুঁকি মূল্যায়ন করুন।',
      });
    }

    if (spatialRisk.isZoningConversionRequired) {
      findings.push({
        id: 'spatial-zoning-alert',
        titleEn: 'Zoning Conversion Required: Land Classified as Agricultural / Wetland',
        titleBn: 'শ্রেণি পরিবর্তন আবশ্যক: জমিটি কৃষি বা জলাভূমি হিসেবে শ্রেণিভুক্ত',
        severity: 'high_warning',
        category: 'spatial_zoning',
        descriptionEn: `Official land classification is "${spatialRisk.zoningClassification}". Building commercial or residential structures without an approved conversion from the DC/AC Land office violates the Land Reform Act 2023.`,
        descriptionBn: `জমির সরকারি শ্রেণি "${spatialRisk.zoningClassification}"। ডিসি বা এসি ল্যান্ড অফিসের অনুমোদন ছাড়া কৃষিজমিতে বাণিজ্যিক বা আবাসিক স্থাপনা নির্মাণ বেআইনি।`,
        sourceDocumentIds: [],
        recommendedActionEn: 'Check Smart Bhumi Naksha zoning records and verify whether land conversion (শ্রেণি পরিবর্তন) permission is feasible.',
        recommendedActionBn: 'স্মার্ট ভূমি নকশা যাচাই করে জমির শ্রেণি পরিবর্তনের আইনি সম্ভাব্যতা পরীক্ষা করুন।',
        officialVerificationPortal: {
          name: 'Smart Bhumi Naksha (জাতীয় ডিজিটাল ভূমি জোনিং)',
          url: 'https://map.land.gov.bd/',
          serviceDescription: 'Inspect plot-based land classification and permissible use categories.',
        },
      });
    }

    if (spatialRisk.roadType === 'no_direct_access' || spatialRisk.roadAccessWidthFeet < 8) {
      findings.push({
        id: 'spatial-road-access-alert',
        titleEn: `Substandard Road Frontage: Only ${spatialRisk.roadAccessWidthFeet} Feet Width`,
        titleBn: `অপ্রতুল রাস্তা: সম্মুখস্থ রাস্তার প্রস্থ মাত্র ${spatialRisk.roadAccessWidthFeet} ফুট`,
        severity: 'moderate_inconsistency',
        category: 'spatial_zoning',
        descriptionEn: spatialRisk.roadAccessDescriptionEn,
        descriptionBn: spatialRisk.roadAccessDescriptionBn,
        sourceDocumentIds: [],
        recommendedActionEn: 'Inspect Mouza cadastral sheet to verify whether a public halot (হালট / রাস্তা) exists or if an easement deed (চলাচলের পথ) is legally required.',
        recommendedActionBn: 'মৌজা ম্যাপে সরকারি হালট আছে কি না দেখুন, অথবা চলাচলের রাস্তার আইনি পথ আছে কি না পরীক্ষা করুন।',
      });
    }
  }

  return findings;
}

export function computeOverallRiskScore(findings: VerificationFinding[]): {
  score: number;
  verdict: 'favorable_proceed_with_standard_checks' | 'caution_investigation_required' | 'high_risk_major_red_flags';
  breakdown: {
    criticalCount: number;
    highCount: number;
    moderateCount: number;
    verifiedCount: number;
  };
} {
  let score = 15; // Baseline due-diligence caution

  let criticalCount = 0;
  let highCount = 0;
  let moderateCount = 0;
  let verifiedCount = 0;

  findings.forEach(f => {
    switch (f.severity) {
      case 'critical_red_flag':
        score += 35;
        criticalCount++;
        break;
      case 'high_warning':
        score += 18;
        highCount++;
        break;
      case 'moderate_inconsistency':
        score += 8;
        moderateCount++;
        break;
      case 'verified_evidence':
        score -= 10;
        verifiedCount++;
        break;
    }
  });

  // If any critical red flag exists, the overall danger score must be at least 70
  if (criticalCount > 0) {
    score = Math.max(score, 70 + (criticalCount - 1) * 10);
  }

  // Clamp score between 0 and 100
  score = Math.max(5, Math.min(100, score));

  let verdict: 'favorable_proceed_with_standard_checks' | 'caution_investigation_required' | 'high_risk_major_red_flags';
  if (criticalCount > 0 || score >= 65) {
    verdict = 'high_risk_major_red_flags';
  } else if (highCount > 0 || score >= 35) {
    verdict = 'caution_investigation_required';
  } else {
    verdict = 'favorable_proceed_with_standard_checks';
  }

  return {
    score,
    verdict,
    breakdown: {
      criticalCount,
      highCount,
      moderateCount,
      verifiedCount,
    },
  };
}
