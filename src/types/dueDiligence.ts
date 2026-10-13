// LandWise AI — Due-Diligence Type Definitions
// Rigorously structured around Bangladesh Land Records (SAT Act 1950, Land Crime Act 2023)

export type SurveyEdition = 'CS' | 'SA' | 'RS' | 'BS' | 'BRS' | 'City Survey' | 'Diyara';

export type DocumentType = 
  | 'saf_kabala'      // Registered Sale Deed (সাফ-কবলা দলিল)
  | 'khatian'         // Cadastral Record-of-Rights / Porcha (খতিয়ান / পর্চা)
  | 'namjari'         // Mutation Record-of-Rights / DCR (নামজারি খতিয়ান ও ডি.সি.আর)
  | 'dakhila'         // Land Development Tax Receipt (ভূমি উন্নয়ন কর দাখিলা)
  | 'warishan'        // Succession Certificate (ওয়ারিশান সনদ)
  | 'mouza_map_sheet';// Cadastral Map Sheet (মৌজা নকশা)

export interface LandDocumentField {
  labelEn: string;
  labelBn: string;
  value: string | number;
  confidence: number; // 0 to 1
  sourceSnippet?: string;
  isVerified?: boolean;
}

export interface ExtractedLandDocument {
  id: string;
  titleEn: string;
  titleBn: string;
  type: DocumentType;
  surveyEdition?: SurveyEdition;
  documentNumber: string; // Deed No, Khatian No, Case No, Dakhila Token No
  registrationDate?: string;
  issueOffice: string; // e.g. "Savar Sub-Registry Office", "AC (Land) Office, Sylhet Sadar"
  
  // 12 Core Extracted Identifiers
  district: string;
  upazila: string;
  mouzaName: string;
  jlNumber: string | number;
  
  khatianNumber: string;
  dagNumber: string; // Can be "Sabek 104, Hal 308" or single Dag
  dagType?: 'hal' | 'sabek' | 'both';
  
  landAreaDecimals: number; // Normalized area in Decimals (Satak / শতক)
  recordedShare?: string; // e.g. "০.২৫০ (৪ আনা)" or "0.250"
  subjectTransferredAreaDecimals?: number; // Transferred share in decimals
  
  primaryOwnerName: string;
  ownerFatherOrHusbandName?: string;
  sellerOrDonorName?: string;
  buyerOrRecipientName?: string;
  
  taxClearanceYear?: string; // e.g. "1431 BS (2024-2025)"
  mutationCaseNumber?: string; // e.g. "1204/IX/2023-24"
  
  status: 'verified' | 'provisional' | 'disputed' | 'unverified';
  documentImageOrPdfUrl?: string;
  notes?: string;
}

export type FindingSeverity = 'critical_red_flag' | 'high_warning' | 'moderate_inconsistency' | 'verified_evidence' | 'unknown_information';

export interface VerificationFinding {
  id: string;
  titleEn: string;
  titleBn: string;
  severity: FindingSeverity;
  category: 'chain_of_title' | 'area_reconciliation' | 'dag_alignment' | 'identity_matching' | 'tax_compliance' | 'spatial_zoning';
  descriptionEn: string;
  descriptionBn: string;
  sourceDocumentIds: string[];
  evidenceSnippet?: string;
  recommendedActionEn?: string;
  recommendedActionBn?: string;
  officialVerificationPortal?: {
    name: string;
    url: string;
    serviceDescription: string;
  };
}

export interface EnvironmentalAndSpatialRisk {
  floodRiskLevel: 'low' | 'moderate' | 'high' | 'severe';
  floodRiskDescriptionEn: string;
  floodRiskDescriptionBn: string;
  
  riverErosionRisk: 'none' | 'low' | 'moderate' | 'high_alert';
  riverErosionDescriptionEn: string;
  riverErosionDescriptionBn: string;
  
  zoningClassification: 'residential' | 'commercial' | 'agricultural' | 'wetland_chalan' | 'forest_reserve' | 'industrial';
  zoningPermitStatusEn: string;
  zoningPermitStatusBn: string;
  isZoningConversionRequired: boolean;
  
  roadAccessWidthFeet: number;
  roadType: 'paved_highway' | 'pucca_road' | 'semi_pucca' | 'kaccha_earthen' | 'no_direct_access';
  roadAccessDescriptionEn: string;
  roadAccessDescriptionBn: string;
  
  khashOrGovernmentProximityEn: string;
  khashOrGovernmentProximityBn: string;
  acquisitionNoticeRisk: boolean;
}

export interface DueDiligenceCase {
  id: string;
  caseTitleEn: string;
  caseTitleBn: string;
  targetPropertyDescriptionEn: string;
  targetPropertyDescriptionBn: string;
  districtId: string;
  districtName: string;
  upazilaName: string;
  mouzaName: string;
  jlNumber: string | number;
  proposedSellingPriceBdt: number;
  claimedAreaDecimals: number;
  
  riskScore: number; // 0 to 100 (0 = Lowest Risk, 100 = Highest Danger)
  overallVerdict: 'favorable_proceed_with_standard_checks' | 'caution_investigation_required' | 'high_risk_major_red_flags';
  
  documents: ExtractedLandDocument[];
  spatialRisk: EnvironmentalAndSpatialRisk;
  customUploaded?: boolean;
}
