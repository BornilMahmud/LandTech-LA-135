import { LandParcel, SuitabilityPurpose, FactorDefinition, FactorScoreItem, SuitabilityResult } from '../types';

export const PURPOSE_FACTOR_DEFINITIONS: Record<SuitabilityPurpose, FactorDefinition[]> = {
  residential: [
    {
      id: 'road_access',
      nameEn: 'Road Accessibility & Width',
      nameBn: 'রাস্তার প্রশস্ততা ও প্রবেশাধিকার',
      defaultWeight: 25,
      descriptionEn: 'Evaluates access road width (min 20ft recommended for residential cars and utilities).',
      descriptionBn: 'গাড়ি ও চলাচলের জন্য রাস্তার প্রশস্ততা (আবাসিকের জন্য নূন্যতম ২০ ফুট জরুরি)।',
    },
    {
      id: 'flood_safety',
      nameEn: 'Flood Safety & Elevation',
      nameBn: 'বন্যা নিরাপত্তা ও ভূমির উচ্চতা',
      defaultWeight: 25,
      descriptionEn: 'Evaluates seasonal monsoon waterlogging and plot elevation above flood level.',
      descriptionBn: 'বর্ষায় জলাবদ্ধতা ঝুঁকি এবং বন্যা সমতল থেকে প্লটের উচ্চতা।',
    },
    {
      id: 'civic_amenities',
      nameEn: 'Proximity to Schools & Markets',
      nameBn: 'স্কুল, বাজার ও জরুরি সেবা',
      defaultWeight: 20,
      descriptionEn: 'Distance to educational institutions, daily grocery bazaars, and clinics.',
      descriptionBn: 'প্রতিদিনের বাজার, শিক্ষাপ্রতিষ্ঠান ও প্রাথমিক স্বাস্থ্যসেবার দূরত্ব।',
    },
    {
      id: 'utilities',
      nameEn: 'Essential Utility Connectivity',
      nameBn: 'বিদ্যুৎ, পানি ও গ্যাস সংযোগ',
      defaultWeight: 20,
      descriptionEn: 'Availability of grid electricity, water supply, gas pipeline, and fiber optics.',
      descriptionBn: 'জাতীয় গ্রিড বিদ্যুৎ, ওয়াসা/টিউবওয়েল পানি, গ্যাস ও ইন্টারনেট সংযোগ।',
    },
    {
      id: 'environmental_soil',
      nameEn: 'Soil Stability & Zoning Alignment',
      nameBn: 'মাটির গঠন ও জোনিং উপযুক্ততা',
      defaultWeight: 10,
      descriptionEn: 'Piling suitability (Red Clay/Alluvial vs Marshy) and residential zoning.',
      descriptionBn: 'ভিত নির্মাণে মাটির ধারণক্ষমতা ও আবাসিক জোনিং অনুমোদন।',
    },
  ],
  hotel: [
    {
      id: 'tourism_zoning',
      nameEn: 'Tourism & Commercial Zoning',
      nameBn: 'পর্যটন ও বাণিজ্যিক জোনিং',
      defaultWeight: 30,
      descriptionEn: 'Proximity to natural attractions, beach/hill view, and commercial permissions.',
      descriptionBn: 'প্রাকৃতিক পর্যটন আকর্ষণ, মনোরম দৃশ্য ও বাণিজ্যিক নির্মাণের অনুমতি।',
    },
    {
      id: 'highway_frontage',
      nameEn: 'Highway Access & Frontage Width',
      nameBn: 'মহাসড়ক সংযোগ ও সম্মুখভাগ',
      defaultWeight: 25,
      descriptionEn: 'Wide approach road for tourist buses and airport/station transfer convenience.',
      descriptionBn: 'পর্যটক বাস ও গাড়ি চলাচলের উপযোগী প্রশস্ত সম্মুখভাগ।',
    },
    {
      id: 'plot_scale',
      nameEn: 'Plot Footprint & Parking Capacity',
      nameBn: 'প্লটের আয়তন ও পার্কিং সুবিধা',
      defaultWeight: 15,
      descriptionEn: 'Adequate land area (10+ Katha) for guest parking, lobby, and landscaping.',
      descriptionBn: 'রিসোর্ট পার্কিং, লবি ও বাগানের জন্য পর্যাপ্ত জমির পরিমাণ।',
    },
    {
      id: 'utility_infrastructure',
      nameEn: 'High-Demand Utility Grid',
      nameBn: 'উচ্চক্ষমতাসম্পন্ন ইউটিলিটি গ্রিড',
      defaultWeight: 15,
      descriptionEn: '3-phase electricity, commercial water capacity, and high-speed internet.',
      descriptionBn: 'হোটেল পরিচালনার জন্য নিরবচ্ছিন্ন বিদ্যুৎ, পানি ও উচ্চগতির সংযোগ।',
    },
    {
      id: 'flood_resilience',
      nameEn: 'Monsoon Flood Resilience',
      nameBn: 'বর্ষাকালীন দুর্যোগ প্রতিরোধ',
      defaultWeight: 15,
      descriptionEn: 'Elevated foundation safety during heavy cyclones and monsoon rainfall.',
      descriptionBn: 'ঘূর্ণিঝড় ও ভারি বৃষ্টিপাতের সময় প্লাবনমুক্ত থাকার সক্ষমতা।',
    },
  ],
  farm: [
    {
      id: 'soil_fertility',
      nameEn: 'Soil Fertility & Composition',
      nameBn: 'মাটির উর্বরতা ও ধরন',
      defaultWeight: 35,
      descriptionEn: 'Agricultural suitability of Alluvial river silt, Red Clay, or Loam.',
      descriptionBn: 'পলিমাটি বা দোআঁশ মাটির কৃষি উপযোগী প্রাকৃতিক উর্বরতা।',
    },
    {
      id: 'irrigation_access',
      nameEn: 'Water Source & Irrigation',
      nameBn: 'সেচ সুবিধা ও ভূগর্ভস্থ পানি',
      defaultWeight: 25,
      descriptionEn: 'Proximity to canals, river distributaries, or sweet groundwater table.',
      descriptionBn: 'খাল-নদী ও মিঠাপানির ভূগর্ভস্থ স্তরের সেচ প্রাপ্যতা।',
    },
    {
      id: 'acreage_scale',
      nameEn: 'Agricultural Plot Acreage',
      nameBn: 'জমির বিস্তৃতি ও আয়তন',
      defaultWeight: 15,
      descriptionEn: 'Contiguous land size (preferably 1 Bigha / 20+ Katha) for mechanized farming.',
      descriptionBn: 'কৃষিকাজে সাশ্রয়ী আয়তনের জন্য অবিচ্ছিন্ন জমির পরিমাপ (১ বিঘা বা অধিক)।',
    },
    {
      id: 'market_transport',
      nameEn: 'Wholesale Market Transport',
      nameBn: 'আড়ত ও পাইকারি বাজারে পরিবহন',
      defaultWeight: 15,
      descriptionEn: 'Distance to national highways or regional crop distribution hubs.',
      descriptionBn: 'ফসল দ্রুত পরিবহনের জন্য প্রধান সড়ক ও বাজারের দূরত্ব।',
    },
    {
      id: 'drainage_safety',
      nameEn: 'Waterlogging & Crop Drainage',
      nameBn: 'নিষ্কাশন ব্যবস্থা ও জলাবদ্ধতা',
      defaultWeight: 10,
      descriptionEn: 'Adequate slope to drain excess water without crop root rot.',
      descriptionBn: 'অতিরিক্ত বৃষ্টির পানি নিষ্কাশনের প্রাকৃতিক ঢাল।',
    },
  ],
  hospital: [
    {
      id: 'emergency_access',
      nameEn: 'Emergency Road & Ambulance Access',
      nameBn: 'জরুরি রাস্তা ও অ্যাম্বুলেন্স প্রবেশ',
      defaultWeight: 30,
      descriptionEn: 'Paved roadway of at least 30-40ft for multi-directional ambulance transit.',
      descriptionBn: 'অ্যাম্বুলেন্স সহজে যাতায়াতের জন্য ৩০-৪০ ফুট প্রশস্ত প্রধান সংযোগ সড়ক।',
    },
    {
      id: 'utility_redundancy',
      nameEn: 'Uninterrupted Utility Backing',
      nameBn: 'জরুরি সেবা ও নিরবচ্ছিন্ন বিদ্যুৎ',
      defaultWeight: 25,
      descriptionEn: 'Multi-source electrical supply line, deep tube-well water, and emergency backup.',
      descriptionBn: 'আইসিইউ ও জরুরি অপারেশনের জন্য নিরবচ্ছিন্ন বিদ্যুৎ ও গভীর নলকূপ পানি।',
    },
    {
      id: 'flood_free_elevation',
      nameEn: 'Zero-Flood Elevation Standard',
      nameBn: 'বন্যা প্রতিরোধক সর্বোচ্চ উচ্চতা',
      defaultWeight: 20,
      descriptionEn: 'Crucial ground floor immunity from inundation during 50-year flood levels.',
      descriptionBn: 'দুর্যোগকালীন জরুরি চিকিৎসা চালু রাখতে শতভাগ প্লাবনমুক্ত ভূমি।',
    },
    {
      id: 'population_catchment',
      nameEn: 'Population Catchment & Transit',
      nameBn: 'জনবসতি ও গণপরিবহন সংযোগ',
      defaultWeight: 15,
      descriptionEn: 'Close proximity to sub-district centers and public transport corridors.',
      descriptionBn: 'উপজেলা ও ঘনবসতিপূর্ণ এলাকার রোগী সাধারণের সহজ গম্যতা।',
    },
    {
      id: 'clean_environment',
      nameEn: 'Quiet & Low-Pollution Buffer',
      nameBn: 'কোলাহলমুক্ত ও পরিচ্ছন্ন পরিবেশ',
      defaultWeight: 10,
      descriptionEn: 'Buffer distance from hazardous heavy industrial factories and dumpsites.',
      descriptionBn: 'রোগীর সুস্থতায় ভারী কলকারখানা ও বর্জ্য ডাম্পিং মুক্ত পরিবেশ।',
    },
  ],
  restaurant: [
    {
      id: 'commercial_footfall',
      nameEn: 'Customer Footfall & Proximity',
      nameBn: 'গ্রাহক সমাগম ও বাজার সান্নিধ্য',
      defaultWeight: 35,
      descriptionEn: 'High-density commercial hubs, college centers, tourist corridors, or offices.',
      descriptionBn: 'বাজার, অফিসপাড়া বা পর্যটন এলাকায় সাধারণ মানুষের যাতায়াত ঘনত্ব।',
    },
    {
      id: 'road_parking',
      nameEn: 'Frontage Width & Guest Parking',
      nameBn: 'সম্মুখভাগ ও গাড়ি পার্কিং সুবিধা',
      defaultWeight: 25,
      descriptionEn: 'Visible road frontage (25ft+) with customer parking clearance.',
      descriptionBn: 'পথচারীর চোখে পড়ার মতো ফ্রন্টেজ ও গ্রাহক পার্কিংয়ের জায়গা।',
    },
    {
      id: 'kitchen_utilities',
      nameEn: 'Gas & Commercial Kitchen Utilities',
      nameBn: 'গ্যাস ও বাণিজ্যিক রান্নাঘর সংযোগ',
      defaultWeight: 25,
      descriptionEn: 'Pipeline/LPG infrastructure, high-volume water supply, and waste grease drainage.',
      descriptionBn: 'রেস্টুরেন্টের জন্য গ্যাস সরবরাহ, পর্যাপ্ত পানি ও বর্জ্য লাইন সুবিধা।',
    },
    {
      id: 'drainage_cleanliness',
      nameEn: 'Drainage & Hygiene Standards',
      nameBn: 'পানি নিষ্কাশন ও স্বাস্থ্যবিধি মানদণ্ড',
      defaultWeight: 15,
      descriptionEn: 'Municipal sewerage discharge capability and storm drain clearance.',
      descriptionBn: 'পৌর ড্রেনেজ ব্যবস্থা ও বৃষ্টির পানি নিষ্কাশনের নিশ্চয়তা।',
    },
  ],
};

/**
 * Calculates raw factor scores (0-100) deterministically from parcel attributes
 */
function evaluateFactor(factorId: string, parcel: LandParcel): { rawScore: number; isMissing: boolean; explanationEn: string; explanationBn: string } {
  switch (factorId) {
    // Residential Factors
    case 'road_access': {
      const width = parcel.roadWidthFt;
      let score = 30;
      if (width >= 40) score = 100;
      else if (width >= 30) score = 88;
      else if (width >= 20) score = 75;
      else if (width >= 12) score = 55;
      else score = 35;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Road width is ${width} ft. ${width >= 20 ? 'Optimal for passenger cars & emergency access.' : 'Narrow lane restricts dual vehicle passage.'}`,
        explanationBn: `রাস্তার প্রশস্ততা ${width} ফুট। ${width >= 20 ? 'গাড়ি ও জরুরি চলাচলের জন্য উপযোগী।' : 'সংকীর্ণ রাস্তা চলাচলে কিছুটা বাধা সৃষ্টি করতে পারে।'}`
      };
    }

    case 'flood_safety': {
      let score = 50;
      if (parcel.floodRisk === 'Low' && parcel.elevationMeters >= 5) score = 95;
      else if (parcel.floodRisk === 'Low') score = 85;
      else if (parcel.floodRisk === 'Moderate') score = 55;
      else score = 25;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Flood risk: ${parcel.floodRisk}, Elevation: ${parcel.elevationMeters}m above sea level.`,
        explanationBn: `বন্যা ঝুঁকি: ${parcel.floodRisk === 'Low' ? 'কম' : parcel.floodRisk === 'Moderate' ? 'মাঝারি' : 'উচ্চ'}, উচ্চতা: সমুদ্রপৃষ্ঠ থেকে ${parcel.elevationMeters} মিটার।`
      };
    }

    case 'civic_amenities': {
      const { schoolDistKm, marketDistKm, hospitalDistKm } = parcel.nearbyFacilities;
      const schoolScore = Math.max(20, 100 - schoolDistKm * 15);
      const marketScore = Math.max(20, 100 - marketDistKm * 20);
      const hospitalScore = Math.max(20, 100 - hospitalDistKm * 10);
      const avg = Math.round((schoolScore + marketScore + hospitalScore) / 3);
      return {
        rawScore: avg,
        isMissing: false,
        explanationEn: `School: ${schoolDistKm}km, Market: ${marketDistKm}km, Hospital: ${hospitalDistKm}km.`,
        explanationBn: `বিদ্যালয়: ${schoolDistKm} কিমি, বাজার: ${marketDistKm} কিমি, হাসপাতাল: ${hospitalDistKm} কিমি।`
      };
    }

    case 'utilities': {
      let count = 0;
      if (parcel.utilities.electricity) count += 35;
      if (parcel.utilities.water) count += 35;
      if (parcel.utilities.gas) count += 20;
      if (parcel.utilities.fiberInternet) count += 10;
      return {
        rawScore: count,
        isMissing: false,
        explanationEn: `Electricity: ${parcel.utilities.electricity ? 'Yes' : 'No'}, Water: ${parcel.utilities.water ? 'Yes' : 'No'}, Gas: ${parcel.utilities.gas ? 'Yes' : 'No'}, Fiber: ${parcel.utilities.fiberInternet ? 'Yes' : 'No'}.`,
        explanationBn: `বিদ্যুৎ: ${parcel.utilities.electricity ? 'আছে' : 'নেই'}, পানি: ${parcel.utilities.water ? 'আছে' : 'নেই'}, গ্যাস: ${parcel.utilities.gas ? 'আছে' : 'নেই'}, ইন্টারনেট: ${parcel.utilities.fiberInternet ? 'আছে' : 'নেই'}।`
      };
    }

    case 'environmental_soil': {
      let score = 60;
      if (parcel.zoning === 'Residential') score += 20;
      if (parcel.soilType === 'Red Clay' || parcel.soilType === 'Alluvial') score += 20;
      else if (parcel.soilType === 'Marshy') score -= 30;
      score = Math.min(100, Math.max(15, score));
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Zoning: ${parcel.zoning}, Soil Type: ${parcel.soilType}.`,
        explanationBn: `জোনিং: ${parcel.zoning}, মাটির ধরন: ${parcel.soilType}।`
      };
    }

    // Hotel / Tourism Factors
    case 'tourism_zoning': {
      let score = 40;
      if (parcel.zoning === 'Eco-Tourism') score = 95;
      else if (parcel.zoning === 'Commercial') score = 85;
      else if (parcel.zoning === 'Residential') score = 60;
      if (parcel.district.includes('Cox') || parcel.district.includes('Bandarban') || parcel.district.includes('Sylhet')) {
        score = Math.min(100, score + 15);
      }
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Located in tourism hub district (${parcel.district}) with ${parcel.zoning} zoning classification.`,
        explanationBn: `পর্যটন জেলা (${parcel.district}) ও ${parcel.zoning} জোনিং ক্যাটাগরি।`
      };
    }

    case 'highway_frontage': {
      const highwayKm = parcel.nearbyFacilities.highwayDistKm;
      const roadW = parcel.roadWidthFt;
      const hScore = Math.max(20, 100 - highwayKm * 12);
      const rScore = Math.min(100, roadW * 2.2);
      const combined = Math.round(hScore * 0.5 + rScore * 0.5);
      return {
        rawScore: combined,
        isMissing: false,
        explanationEn: `Approach road: ${roadW}ft, Highway distance: ${highwayKm}km.`,
        explanationBn: `সংযোগ সড়ক: ${roadW} ফুট, মহাসড়ক দূরত্ব: ${highwayKm} কিমি।`
      };
    }

    case 'plot_scale': {
      const katha = parcel.areaKatha;
      let score = 40;
      if (katha >= 20) score = 95;
      else if (katha >= 10) score = 85;
      else if (katha >= 6) score = 65;
      else score = 35;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Plot area is ${katha} Katha. ${katha >= 10 ? 'Sufficient for hotel footprint & parking.' : 'Compact plot for luxury resort hospitality.'}`,
        explanationBn: `জমির পরিমাণ ${katha} কাঠা। ${katha >= 10 ? 'হোটেল কাঠামো ও পার্কিংয়ের উপযোগী।' : 'বড় হোটেলের জন্য কিছুটা ছোট।'}`
      };
    }

    case 'utility_infrastructure': {
      let score = 40;
      if (parcel.utilities.electricity) score += 30;
      if (parcel.utilities.water) score += 20;
      if (parcel.utilities.fiberInternet) score += 10;
      return {
        rawScore: Math.min(100, score),
        isMissing: false,
        explanationEn: `Utility grid connectivity check score: ${score}/100.`,
        explanationBn: `ইউটিলিটি সংযোগ মান: ${score}/১০০।`
      };
    }

    case 'flood_resilience': {
      let score = parcel.floodRisk === 'Low' ? 90 : parcel.floodRisk === 'Moderate' ? 60 : 30;
      if (parcel.elevationMeters > 8) score = Math.min(100, score + 10);
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Elevation: ${parcel.elevationMeters}m with ${parcel.floodRisk} flood vulnerability.`,
        explanationBn: `উচ্চতা: ${parcel.elevationMeters} মিটার এবং ${parcel.floodRisk} বন্যা ঝুঁকি।`
      };
    }

    // Farm Factors
    case 'soil_fertility': {
      let score = 50;
      if (parcel.soilType === 'Alluvial') score = 98;
      else if (parcel.soilType === 'Red Clay') score = 85;
      else if (parcel.soilType === 'Sandy Loam') score = 80;
      else if (parcel.soilType === 'Marshy') score = 55;
      else score = 40;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `${parcel.soilType} soil is ${score >= 80 ? 'highly nutrient-rich for crop cultivation' : 'moderately suitable; may require soil conditioning'}.`,
        explanationBn: `${parcel.soilType} মাটি চাষাবাদের জন্য ${score >= 80 ? 'উচ্চ পুষ্টিসমৃদ্ধ ও উর্বর' : 'মাঝারি মানের'}।`
      };
    }

    case 'irrigation_access': {
      // In BD, alluvial & low elevation regions possess abundant ground irrigation
      let score = 65;
      if (parcel.soilType === 'Alluvial') score += 25;
      if (parcel.utilities.water) score += 10;
      return {
        rawScore: Math.min(100, score),
        isMissing: false,
        explanationEn: `Irrigation feasibility score based on aquifer depth and soil composition.`,
        explanationBn: `মাটির গুণাগুণ ও পানি সংযোগের ভিত্তিতে সেচ উপযোগিতা।`
      };
    }

    case 'acreage_scale': {
      const katha = parcel.areaKatha;
      let score = 30;
      if (katha >= 40) score = 100;
      else if (katha >= 20) score = 90;
      else if (katha >= 10) score = 70;
      else if (katha >= 5) score = 45;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Area: ${katha} Katha (${(katha / 20).toFixed(1)} Bigha).`,
        explanationBn: `আয়তন: ${katha} কাঠা (${(katha / 20).toFixed(1)} বিঘা)।`
      };
    }

    case 'market_transport': {
      const mDist = parcel.nearbyFacilities.marketDistKm;
      const score = Math.max(25, 100 - mDist * 10);
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Wholesale market / bazaar transit distance is ${mDist} km.`,
        explanationBn: `পাইকারি বাজার / আড়তের দূরত্ব ${mDist} কিমি।`
      };
    }

    case 'drainage_safety': {
      let score = parcel.floodRisk === 'Low' ? 85 : parcel.floodRisk === 'Moderate' ? 65 : 40;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Seasonal runoff and drainage index: ${score}/100.`,
        explanationBn: `মৌসুমি পানি নিষ্কাশন স্কোর: ${score}/১০০।`
      };
    }

    // Hospital Factors
    case 'emergency_access': {
      const roadW = parcel.roadWidthFt;
      const hwKm = parcel.nearbyFacilities.highwayDistKm;
      let score = 30;
      if (roadW >= 40 && hwKm <= 2) score = 98;
      else if (roadW >= 30) score = 85;
      else if (roadW >= 20) score = 65;
      else score = 30;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Road width ${roadW}ft with ${hwKm}km highway access. ${roadW >= 30 ? 'Suitable for dual ambulance passage.' : 'May cause bottlenecks during rush hours.'}`,
        explanationBn: `রাস্তা ${roadW} ফুট ও মহাসড়ক ${hwKm} কিমি। ${roadW >= 30 ? 'জরুরি অ্যাম্বুলেন্স চলাচলের উপযোগী।' : 'জরুরি গাড়ির চলাচলে জট লাগতে পারে।'}`
      };
    }

    case 'utility_redundancy': {
      let score = 30;
      if (parcel.utilities.electricity) score += 35;
      if (parcel.utilities.water) score += 25;
      if (parcel.utilities.fiberInternet) score += 10;
      return {
        rawScore: Math.min(100, score),
        isMissing: false,
        explanationEn: `Critical power, water, and connectivity infrastructure rating: ${score}/100.`,
        explanationBn: `হাসপাতালের প্রয়োজনীয় নিরবচ্ছিন্ন বিদ্যুৎ ও পানি প্রাপ্যতা: ${score}/১০০।`
      };
    }

    case 'flood_free_elevation': {
      let score = 30;
      if (parcel.floodRisk === 'Low' && parcel.elevationMeters >= 6) score = 100;
      else if (parcel.floodRisk === 'Low') score = 80;
      else if (parcel.floodRisk === 'Moderate') score = 40;
      else score = 15;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Zero-flood tolerance criterion: ${parcel.floodRisk} risk at ${parcel.elevationMeters}m elevation.`,
        explanationBn: `বন্যা প্রতিরোধ মানদণ্ড: ${parcel.floodRisk} ঝুঁকি এবং ${parcel.elevationMeters} মিটার উচ্চতা।`
      };
    }

    case 'population_catchment': {
      const { marketDistKm, schoolDistKm } = parcel.nearbyFacilities;
      const avgDist = (marketDistKm + schoolDistKm) / 2;
      const score = Math.max(30, 100 - avgDist * 12);
      return {
        rawScore: Math.round(score),
        isMissing: false,
        explanationEn: `Proximity to civic center: ~${avgDist.toFixed(1)} km.`,
        explanationBn: `নাগরিক কেন্দ্র ও লোকালয়ের দূরত্ব: প্রায় ${avgDist.toFixed(1)} কিমি।`
      };
    }

    case 'clean_environment': {
      let score = 80;
      if (parcel.zoning === 'Industrial') score = 25;
      else if (parcel.zoning === 'Residential' || parcel.zoning === 'Eco-Tourism') score = 95;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Surrounding zone (${parcel.zoning}) is ${score >= 80 ? 'low pollution' : 'exposed to commercial/industrial noise'}.`,
        explanationBn: `আশপাশের পরিবেশ (${parcel.zoning}) ${score >= 80 ? 'কম দূষণযুক্ত' : 'শব্দ ও কারখানার সান্নিধ্যে'}।`
      };
    }

    // Restaurant Factors
    case 'commercial_footfall': {
      const mDist = parcel.nearbyFacilities.marketDistKm;
      let score = Math.max(30, 100 - mDist * 18);
      if (parcel.zoning === 'Commercial') score = Math.min(100, score + 15);
      return {
        rawScore: Math.round(score),
        isMissing: false,
        explanationEn: `Commercial market density index: distance is ${mDist}km.`,
        explanationBn: `বাণিজ্যিক সমাগম দূরত্ব সূচক: বাজার থেকে ${mDist} কিমি।`
      };
    }

    case 'road_parking': {
      const roadW = parcel.roadWidthFt;
      let score = 35;
      if (roadW >= 40) score = 95;
      else if (roadW >= 30) score = 85;
      else if (roadW >= 20) score = 70;
      else score = 40;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Frontage road width: ${roadW}ft. ${roadW >= 25 ? 'Accommodates curbside parking.' : 'Limited customer parking.'}`,
        explanationBn: `রাস্তা ${roadW} ফুট। ${roadW >= 25 ? 'গ্রাহক গাড়ি পার্কিং সহজ হবে।' : 'পার্কিং স্পেস সীমিত।'}`
      };
    }

    case 'kitchen_utilities': {
      let score = 20;
      if (parcel.utilities.gas) score += 40;
      if (parcel.utilities.water) score += 25;
      if (parcel.utilities.electricity) score += 15;
      return {
        rawScore: Math.min(100, score),
        isMissing: false,
        explanationEn: `Kitchen utilities (Gas: ${parcel.utilities.gas ? 'Yes' : 'No'}, Water: ${parcel.utilities.water ? 'Yes' : 'No'}).`,
        explanationBn: `রান্নাঘরের ইউটিলিটি (গ্যাস: ${parcel.utilities.gas ? 'আছে' : 'নেই'}, পানি: ${parcel.utilities.water ? 'আছে' : 'নেই'})।`
      };
    }

    case 'drainage_cleanliness': {
      const score = parcel.floodRisk === 'Low' ? 88 : parcel.floodRisk === 'Moderate' ? 60 : 35;
      return {
        rawScore: score,
        isMissing: false,
        explanationEn: `Drainage clearance rating: ${score}/100.`,
        explanationBn: `ড্রেনেজ ও পরিষ্কার-পরিচ্ছন্নতা মান: ${score}/১০০।`
      };
    }

    default:
      return { rawScore: 50, isMissing: true, explanationEn: 'Standard baseline score applied.', explanationBn: 'সাধারণ মান প্রযোজ্য।' };
  }
}

/**
 * Deterministically computes suitability for a parcel and purpose, supporting custom weights.
 */
export function calculateSuitability(
  parcel: LandParcel,
  purpose: SuitabilityPurpose,
  customWeights?: Record<string, number>
): SuitabilityResult {
  const definitions = PURPOSE_FACTOR_DEFINITIONS[purpose] || PURPOSE_FACTOR_DEFINITIONS.residential;

  // Calculate total weight to normalize
  const totalWeight = definitions.reduce((sum, def) => {
    const w = customWeights && customWeights[def.id] !== undefined ? customWeights[def.id] : def.defaultWeight;
    return sum + (w > 0 ? w : 0);
  }, 0) || 100;

  const factors: FactorScoreItem[] = [];
  let weightedSum = 0;
  let availableFactorsCount = 0;
  const missingFactors: string[] = [];
  const strengthsEn: string[] = [];
  const strengthsBn: string[] = [];
  const limitationsEn: string[] = [];
  const limitationsBn: string[] = [];

  for (const def of definitions) {
    const rawWeight = customWeights && customWeights[def.id] !== undefined ? customWeights[def.id] : def.defaultWeight;
    const normalizedWeight = Math.round((rawWeight / totalWeight) * 100);

    const evaluation = evaluateFactor(def.id, parcel);
    const weightedPoints = (evaluation.rawScore * normalizedWeight) / 100;
    weightedSum += weightedPoints;

    if (!evaluation.isMissing) {
      availableFactorsCount++;
    } else {
      missingFactors.push(def.nameEn);
    }

    if (evaluation.rawScore >= 80) {
      strengthsEn.push(`${def.nameEn} (${evaluation.rawScore}/100): ${evaluation.explanationEn}`);
      strengthsBn.push(`${def.nameBn} (${evaluation.rawScore}/১০০): ${evaluation.explanationBn}`);
    } else if (evaluation.rawScore <= 55) {
      limitationsEn.push(`${def.nameEn} (${evaluation.rawScore}/100): ${evaluation.explanationEn}`);
      limitationsBn.push(`${def.nameBn} (${evaluation.rawScore}/১০০): ${evaluation.explanationBn}`);
    }

    factors.push({
      id: def.id,
      nameEn: def.nameEn,
      nameBn: def.nameBn,
      rawScore: evaluation.rawScore,
      weight: normalizedWeight,
      weightedPoints: Math.round(weightedPoints * 10) / 10,
      dataAvailable: !evaluation.isMissing,
      explanationEn: evaluation.explanationEn,
      explanationBn: evaluation.explanationBn,
    });
  }

  // Account for any specific unverified attributes in parcel
  if (parcel.missingAttributes && parcel.missingAttributes.length > 0) {
    for (const attr of parcel.missingAttributes) {
      missingFactors.push(attr);
    }
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(weightedSum)));
  const dataCoveragePct = Math.round(
    ((definitions.length - (parcel.missingAttributes ? parcel.missingAttributes.length * 0.5 : 0)) / definitions.length) * 100
  );

  let confidenceLabelEn = 'High Grounded Confidence';
  let confidenceLabelBn = 'উচ্চমাত্রার নির্ভরযোগ্যতা';
  if (dataCoveragePct < 70) {
    confidenceLabelEn = 'Moderate (Partial Field Data)';
    confidenceLabelBn = 'মাঝারি (আংশিক ফিল্ড ডেটা)';
  }

  return {
    purpose,
    overallScore,
    factors,
    dataCoveragePct: Math.min(100, Math.max(30, dataCoveragePct)),
    missingFactors,
    strengthsEn,
    strengthsBn,
    limitationsEn,
    limitationsBn,
    confidenceLabelEn,
    confidenceLabelBn,
  };
}
