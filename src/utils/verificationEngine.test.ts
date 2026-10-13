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
});
