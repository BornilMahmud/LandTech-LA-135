import { describe, it, expect } from 'vitest';
import {
  performDueDiligenceCrossVerification,
  computeOverallRiskScore,
  calculateNameSimilarity,
} from './verificationEngine';
import { ExtractedLandDocument } from '../types/dueDiligence';

describe('LandWise AI Verification Engine Tests', () => {
  it('correctly calculates name similarity across Bengali and English prefixes', () => {
    expect(calculateNameSimilarity('Md. Rafiqul Islam', 'Rafiqul Islam')).toBe(1.0);
    expect(calculateNameSimilarity('মোঃ রফিকুল ইসলাম', 'রফিকুল ইসলাম')).toBe(1.0);
    expect(calculateNameSimilarity('Kabir Hossain', 'Anwar Hossain')).toBeLessThan(0.7);
  });

  it('detects critical red flag when mutation khatian is missing from seller', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-01',
        titleEn: 'Proposed Sale Deed',
        titleBn: 'বিক্রয় দলিল',
        type: 'saf_kabala',
        documentNumber: '1120/2024',
        issueOffice: 'Savar Sub-Registry',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Hemayetpur',
        jlNumber: 42,
        khatianNumber: 'RS 402',
        dagNumber: '812',
        landAreaDecimals: 5.0,
        primaryOwnerName: 'Abdul Malek',
        sellerOrDonorName: 'Abdul Malek',
        status: 'provisional',
      },
      {
        id: 'doc-khatian-01',
        titleEn: 'RS Khatian',
        titleBn: 'আরএস খতিয়ান',
        type: 'khatian',
        surveyEdition: 'RS',
        documentNumber: '402',
        issueOffice: 'DLRS Record Room',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Hemayetpur',
        jlNumber: 42,
        khatianNumber: '402',
        dagNumber: '812',
        landAreaDecimals: 5.0,
        primaryOwnerName: 'Late Kashem Ali', // Deceased father
        status: 'verified',
      },
    ];

    const findings = performDueDiligenceCrossVerification(documents, 5.0);
    const criticalFlag = findings.find(f => f.id === 'chain-missing-mutation');
    expect(criticalFlag).toBeDefined();
    expect(criticalFlag?.severity).toBe('critical_red_flag');

    const scoreResult = computeOverallRiskScore(findings);
    expect(scoreResult.verdict).toBe('high_risk_major_red_flags');
    expect(scoreResult.score).toBeGreaterThanOrEqual(65);
  });

  it('verifies clean title when Deed, Mutation, and Dakhila concord perfectly', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-02',
        titleEn: 'Sale Deed',
        titleBn: 'বিক্রয় দলিল',
        type: 'saf_kabala',
        documentNumber: '3410/2024',
        issueOffice: 'Savar Sub-Registry',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Ashulia',
        jlNumber: 15,
        khatianNumber: 'Namjari 982',
        dagNumber: '504',
        landAreaDecimals: 4.5,
        primaryOwnerName: 'Rashid Ahmed',
        sellerOrDonorName: 'Rashid Ahmed',
        status: 'verified',
      },
      {
        id: 'doc-khatian-02',
        titleEn: 'RS Khatian',
        titleBn: 'আরএস খতিয়ান',
        type: 'khatian',
        surveyEdition: 'RS',
        documentNumber: '210',
        issueOffice: 'DLRS',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Ashulia',
        jlNumber: 15,
        khatianNumber: '210',
        dagNumber: '504',
        landAreaDecimals: 4.5,
        primaryOwnerName: 'Rashid Ahmed',
        status: 'verified',
      },
      {
        id: 'doc-mut-02',
        titleEn: 'Namjari Khatian',
        titleBn: 'নামজারি খতিয়ান',
        type: 'namjari',
        documentNumber: '982',
        issueOffice: 'AC (Land) Savar',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Ashulia',
        jlNumber: 15,
        khatianNumber: '982',
        dagNumber: '504',
        landAreaDecimals: 4.5,
        primaryOwnerName: 'Rashid Ahmed',
        mutationCaseNumber: '1102/IX/2023',
        status: 'verified',
      },
      {
        id: 'doc-tax-02',
        titleEn: 'LD Tax Dakhila',
        titleBn: 'দাখিলা',
        type: 'dakhila',
        documentNumber: 'D-998124',
        issueOffice: 'Ashulia Union Land Office',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Ashulia',
        jlNumber: 15,
        khatianNumber: '982',
        dagNumber: '504',
        landAreaDecimals: 4.5,
        primaryOwnerName: 'Rashid Ahmed',
        taxClearanceYear: '1431 BS (2024-25)',
        status: 'verified',
      },
    ];

    const findings = performDueDiligenceCrossVerification(documents, 4.5);
    const verifiedFindings = findings.filter(f => f.severity === 'verified_evidence');
    expect(verifiedFindings.length).toBeGreaterThanOrEqual(3);

    const scoreResult = computeOverallRiskScore(findings);
    expect(scoreResult.verdict).toBe('favorable_proceed_with_standard_checks');
    expect(scoreResult.breakdown.criticalCount).toBe(0);
  });

  it('detects land area deficit when deed claimed area exceeds khatian share', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-03',
        titleEn: 'Sale Deed',
        titleBn: 'বিক্রয় দলিল',
        type: 'saf_kabala',
        documentNumber: '7712',
        issueOffice: 'Patiya Sub-Registry',
        district: 'Chittagong',
        upazila: 'Patiya',
        mouzaName: 'Kachuai',
        jlNumber: 28,
        khatianNumber: '110',
        dagNumber: '315',
        landAreaDecimals: 7.5, // Claims 7.5 decimals
        primaryOwnerName: 'Mustafa Kamal',
        sellerOrDonorName: 'Mustafa Kamal',
        status: 'provisional',
      },
      {
        id: 'doc-khatian-03',
        titleEn: 'RS Khatian',
        titleBn: 'আরএস খতিয়ান',
        type: 'khatian',
        surveyEdition: 'RS',
        documentNumber: '110',
        issueOffice: 'DLRS',
        district: 'Chittagong',
        upazila: 'Patiya',
        mouzaName: 'Kachuai',
        jlNumber: 28,
        khatianNumber: '110',
        dagNumber: '315',
        landAreaDecimals: 5.0, // Only has 5.0 decimals
        subjectTransferredAreaDecimals: 5.0,
        primaryOwnerName: 'Mustafa Kamal',
        status: 'verified',
      },
    ];

    const findings = performDueDiligenceCrossVerification(documents, 7.5);
    const areaDeficit = findings.find(f => f.id.startsWith('area-deficit'));
    expect(areaDeficit).toBeDefined();
    expect(areaDeficit?.severity).toBe('high_warning');
  });

  it('detects severe inconsistency when multiple conflicting mouza names are submitted', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-04',
        titleEn: 'Sale Deed',
        titleBn: 'দলিল',
        type: 'saf_kabala',
        documentNumber: '9901',
        issueOffice: 'Savar Sub-Registry Office',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Hemayetpur',
        jlNumber: 42,
        khatianNumber: '500',
        dagNumber: '101',
        landAreaDecimals: 6.0,
        primaryOwnerName: 'Kamal Uddin',
        status: 'verified',
      },
      {
        id: 'doc-khatian-04',
        titleEn: 'RS Khatian',
        titleBn: 'খতিয়ান',
        type: 'khatian',
        documentNumber: '500',
        issueOffice: 'DLRS Record Room',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Ashulia', // Conflicting mouza!
        jlNumber: 15,
        khatianNumber: '500',
        dagNumber: '101',
        landAreaDecimals: 6.0,
        primaryOwnerName: 'Kamal Uddin',
        status: 'verified',
      },
    ];

    const findings = performDueDiligenceCrossVerification(documents, 6.0);
    const mouzaMismatch = findings.find(f => f.id === 'mouza-mismatch');
    expect(mouzaMismatch).toBeDefined();
    expect(mouzaMismatch?.severity).toBe('critical_red_flag');
  });

  it('detects missing tax dakhila and spatial environmental hazards', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-05',
        titleEn: 'Sale Deed',
        titleBn: 'দলিল',
        type: 'saf_kabala',
        documentNumber: '4450',
        issueOffice: 'Golapganj Sub-Registry Office',
        district: 'Sylhet',
        upazila: 'Golapganj',
        mouzaName: 'Charkhai',
        jlNumber: 10,
        khatianNumber: '12',
        dagNumber: '70',
        landAreaDecimals: 12.0,
        primaryOwnerName: 'Abdul Bari',
        status: 'verified',
      },
    ];

    const spatialRisk = {
      floodRiskLevel: 'severe' as const,
      floodRiskDescriptionEn: 'Lowland haor basin with severe seasonal inundation.',
      floodRiskDescriptionBn: 'হাওর নিম্নাঞ্চল, বর্ষাকালে ৮ ফুট পর্যন্ত পানির নিচে তলিয়ে যায়।',
      riverErosionRisk: 'high_alert' as const,
      riverErosionDescriptionEn: 'Within 50m of active Surma river meander.',
      riverErosionDescriptionBn: 'সুরমা নদীর ভাঙনকূল থেকে মাত্র ৫০ মিটার দূরত্বে অবস্থিত।',
      zoningClassification: 'wetland_chalan' as const,
      zoningPermitStatusEn: 'Protected seasonal wetland under Haor Development Board.',
      zoningPermitStatusBn: 'হাওর উন্নয়ন বোর্ডের আওতাধীন সংরক্ষিত জলাভূমি।',
      isZoningConversionRequired: true,
      roadAccessWidthFeet: 6,
      roadType: 'kaccha_earthen' as const,
      roadAccessDescriptionEn: '6-foot unpaved earthen footpath.',
      roadAccessDescriptionBn: '৬ ফুট মেঠোপথ।',
      khashOrGovernmentProximityEn: 'Adjacent to gazetted government khas waterbody.',
      khashOrGovernmentProximityBn: 'সরকারি খাস জলাশয়ের সীমানা সংলগ্ন।',
      acquisitionNoticeRisk: true,
    };

    const findings = performDueDiligenceCrossVerification(documents, 12.0, spatialRisk);

    const taxFinding = findings.find(f => f.id === 'missing-tax-dakhila');
    expect(taxFinding).toBeDefined();
    expect(taxFinding?.severity).toBe('high_warning');

    const floodAlert = findings.find(f => f.id === 'spatial-flood-alert');
    expect(floodAlert).toBeDefined();

    const erosionAlert = findings.find(f => f.id === 'spatial-erosion-alert');
    expect(erosionAlert).toBeDefined();
    expect(erosionAlert?.severity).toBe('critical_red_flag');

    const zoningAlert = findings.find(f => f.id === 'spatial-zoning-alert');
    expect(zoningAlert).toBeDefined();
  });

  // ────────────────────────────────────────────────────────────────
  // ADVERSARIAL EDGE CASE SUITE: INHERITANCE, FRACTIONAL MATH & RESILIENCE
  // ────────────────────────────────────────────────────────────────

  it('detects name mismatch between mutation holder and seller demanding warishan certificate', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-adv-01',
        titleEn: 'Sale Deed',
        titleBn: 'বিক্রয় দলিল',
        type: 'saf_kabala',
        documentNumber: '8821',
        issueOffice: 'Dhanmondi Sub-Registry',
        district: 'Dhaka',
        upazila: 'Dhanmondi',
        mouzaName: 'Dhanmondi',
        jlNumber: 2,
        khatianNumber: '55',
        dagNumber: '312',
        landAreaDecimals: 3.5,
        primaryOwnerName: 'Tariqul Islam',
        sellerOrDonorName: 'Tariqul Islam',
        status: 'provisional',
      },
      {
        id: 'doc-mut-adv-01',
        titleEn: 'Namjari Khatian',
        titleBn: 'নামজারি খতিয়ান',
        type: 'namjari',
        documentNumber: '1104',
        issueOffice: 'AC (Land) Dhanmondi',
        district: 'Dhaka',
        upazila: 'Dhanmondi',
        mouzaName: 'Dhanmondi',
        jlNumber: 2,
        khatianNumber: '1104',
        dagNumber: '312',
        landAreaDecimals: 3.5,
        primaryOwnerName: 'Al-Haj Shamsuddin Ahmed', // completely different name!
        status: 'verified',
      },
    ];

    const findings = performDueDiligenceCrossVerification(documents, 3.5);
    const mismatchFinding = findings.find(f => f.id === 'chain-mutation-name-mismatch');
    expect(mismatchFinding).toBeDefined();
    expect(mismatchFinding?.severity).toBe('critical_red_flag');
    expect(mismatchFinding?.descriptionEn).toContain('A missing intermediate deed or succession certificate exists');
  });

  it('handles fractional area calculations within 0.05 decimal delta tolerance without false deficit warnings', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-adv-02',
        titleEn: 'Sale Deed',
        titleBn: 'দলিল',
        type: 'saf_kabala',
        documentNumber: '1200',
        issueOffice: 'Mirpur Sub-Registry',
        district: 'Dhaka',
        upazila: 'Mirpur',
        mouzaName: 'Senpara Parbata',
        jlNumber: 8,
        khatianNumber: '900',
        dagNumber: '44',
        landAreaDecimals: 4.98, // Slight rounding difference
        primaryOwnerName: 'Nazmul Huda',
        sellerOrDonorName: 'Nazmul Huda',
        status: 'verified',
      },
      {
        id: 'doc-khatian-adv-02',
        titleEn: 'RS Khatian',
        titleBn: 'খতিয়ান',
        type: 'khatian',
        documentNumber: '900',
        issueOffice: 'DLRS',
        district: 'Dhaka',
        upazila: 'Mirpur',
        mouzaName: 'Senpara Parbata',
        jlNumber: 8,
        khatianNumber: '900',
        dagNumber: '44',
        landAreaDecimals: 5.0, // 5.0 vs 4.98 is <= 0.05
        primaryOwnerName: 'Nazmul Huda',
        status: 'verified',
      },
    ];

    const findings = performDueDiligenceCrossVerification(documents, 4.98);
    const deficitFinding = findings.find(f => f.id.startsWith('area-deficit'));
    expect(deficitFinding).toBeUndefined(); // Must NOT produce false alarm deficit

    const matchFinding = findings.find(f => f.id.startsWith('area-match'));
    expect(matchFinding).toBeDefined();
    expect(matchFinding?.severity).toBe('verified_evidence');
  });

  it('detects multiple J.L. number inconsistencies across different survey documents', () => {
    const documents: ExtractedLandDocument[] = [
      {
        id: 'doc-deed-adv-03',
        titleEn: 'Sale Deed',
        titleBn: 'দলিল',
        type: 'saf_kabala',
        documentNumber: '5001',
        issueOffice: 'Savar Sub-Registry',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Hemayetpur',
        jlNumber: 42,
        khatianNumber: '10',
        dagNumber: '20',
        landAreaDecimals: 5.0,
        primaryOwnerName: 'Belal Hossain',
        status: 'verified',
      },
      {
        id: 'doc-khatian-adv-03',
        titleEn: 'RS Khatian',
        titleBn: 'খতিয়ান',
        type: 'khatian',
        documentNumber: '10',
        issueOffice: 'DLRS',
        district: 'Dhaka',
        upazila: 'Savar',
        mouzaName: 'Hemayetpur',
        jlNumber: 99, // Inconsistent JL number!
        khatianNumber: '10',
        dagNumber: '20',
        landAreaDecimals: 5.0,
        primaryOwnerName: 'Belal Hossain',
        status: 'verified',
      },
    ];

    const findings = performDueDiligenceCrossVerification(documents, 5.0);
    const jlFinding = findings.find(f => f.id === 'jl-mismatch');
    expect(jlFinding).toBeDefined();
    expect(jlFinding?.severity).toBe('high_warning');
    expect(jlFinding?.descriptionEn).toContain('Multiple J.L. numbers');
  });

  it('gracefully handles empty document dossier without crashing', () => {
    const findings = performDueDiligenceCrossVerification([], 0);
    expect(Array.isArray(findings)).toBe(true);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.some(f => f.id === 'missing-deed')).toBe(true);
    expect(findings.some(f => f.id === 'missing-tax-dakhila')).toBe(true);

    const scoreResult = computeOverallRiskScore(findings);
    expect(scoreResult).toBeDefined();
    expect(typeof scoreResult.score).toBe('number');
  });
});

