export type Language = 'en' | 'bn';

export type SuitabilityPurpose = 'residential' | 'hotel' | 'farm' | 'hospital' | 'restaurant';

export type SoilType = 'Alluvial' | 'Red Clay' | 'Sandy Loam' | 'Marshy' | 'Gravel Bed';
export type FloodRisk = 'Low' | 'Moderate' | 'High';
export type ZoningCategory = 'Residential' | 'Commercial' | 'Agricultural' | 'Eco-Tourism' | 'Industrial';

export interface UtilitiesInfo {
  electricity: boolean;
  water: boolean;
  gas: boolean;
  fiberInternet: boolean;
}

export interface NearbyFacilities {
  highwayDistKm: number;
  marketDistKm: number;
  schoolDistKm: number;
  hospitalDistKm: number;
  policeStationDistKm: number;
}

export interface LandParcel {
  id: string;
  titleEn: string;
  titleBn: string;
  district: string;
  division: string;
  upazila: string;
  mouza: string;
  lat: number;
  lng: number;
  areaKatha: number;
  areaDecimal: number;
  areaSqFt: number;
  priceBdt: number;
  pricePerKatha: number;
  roadWidthFt: number;
  soilType: SoilType;
  floodRisk: FloodRisk;
  elevationMeters: number;
  zoning: ZoningCategory;
  utilities: UtilitiesInfo;
  nearbyFacilities: NearbyFacilities;
  legalStatus: string;
  khatianType: string;
  csRsReference: string;
  demoLabel: string;
  descriptionEn: string;
  descriptionBn: string;
  imageUrl: string;
  tags: string[];
  missingAttributes: string[];
}

export interface FactorDefinition {
  id: string;
  nameEn: string;
  nameBn: string;
  defaultWeight: number; // e.g. 25
  descriptionEn: string;
  descriptionBn: string;
}

export interface FactorScoreItem {
  id: string;
  nameEn: string;
  nameBn: string;
  rawScore: number; // 0 - 100
  weight: number; // percentage
  weightedPoints: number; // (rawScore * weight) / 100
  dataAvailable: boolean;
  explanationEn: string;
  explanationBn: string;
}

export interface SuitabilityResult {
  purpose: SuitabilityPurpose;
  overallScore: number; // 0 - 100
  factors: FactorScoreItem[];
  dataCoveragePct: number; // 0 - 100%
  missingFactors: string[];
  strengthsEn: string[];
  strengthsBn: string[];
  limitationsEn: string[];
  limitationsBn: string[];
  confidenceLabelEn: string;
  confidenceLabelBn: string;
}

export interface Attraction {
  nameEn: string;
  nameBn: string;
  type: string;
  descriptionEn: string;
  descriptionBn: string;
  distanceKm?: number;
}

export interface TourismDestination {
  id: string;
  nameEn: string;
  nameBn: string;
  district: string;
  division: string;
  lat: number;
  lng: number;
  taglineEn: string;
  taglineBn: string;
  overviewEn: string;
  overviewBn: string;
  attractions: Attraction[];
  practicalInfo: {
    bestSeasonEn: string;
    bestSeasonBn: string;
    suggestedDurationEn: string;
    suggestedDurationBn: string;
    howToReachEn: string;
    howToReachBn: string;
    guidanceNoticeEn: string;
    guidanceNoticeBn: string;
  };
  imageUrl: string;
  dataSources: string[];
  limitationsNoticeEn: string;
  limitationsNoticeBn: string;
}

export interface ExternalBookingLink {
  provider: 'Booking.com' | 'Agoda' | 'Trip.com' | 'GoZayaan';
  url: string;
  badge: string;
}

export interface Accommodation {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  category: string;
  priceRangeBdt: string;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  imageUrl: string;
  verifiedExternalLinks: ExternalBookingLink[];
  lastVerified: string;
  disclaimerEn: string;
  disclaimerBn: string;
}

export interface FilterState {
  division: string;
  district: string;
  minPriceBdt: number;
  maxPriceBdt: number;
  minKatha: number;
  maxKatha: number;
  zoning: string;
  soilType: string;
  floodRisk: string;
  purpose: SuitabilityPurpose;
  searchQuery: string;
}

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  textEn: string;
  textBn?: string;
  sourcesCited?: string[];
  dataCoverageNotice?: string;
}
