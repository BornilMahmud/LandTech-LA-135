// LandTech-LA-135: Spatial & Cadastral Land Intelligence Data

export interface LandDistrictMeta {
  areaSqKm: number;
  population: string;
  avgPricePerKathaBDT: number; // In BDT
  cadastralSurvey: "BRS Digital" | "City Survey Verified" | "RS Validated" | "e-Cadastre Pilot";
  zoning: "Commercial CBD" | "High-Density Residential" | "Industrial / SEZ" | "Agro-Greenbelt" | "Coastal & Port" | "Eco-Reserve";
  viabilityScore: number; // 0 - 100
  floodRisk: "Minimal (Zone 1)" | "Moderate (Zone 2)" | "High (Riverine / Basin)";
  growthRateYoY: number; // % annual appreciation
  keyInfra: string;
  bnKeyInfra: string;
}

export const DISTRICT_LAND_DATA: Record<string, LandDistrictMeta> = {
  dhaka: {
    areaSqKm: 1463.6,
    population: "14.7 Million",
    avgPricePerKathaBDT: 8500000,
    cadastralSurvey: "City Survey Verified",
    zoning: "Commercial CBD",
    viabilityScore: 98,
    floodRisk: "Minimal (Zone 1)",
    growthRateYoY: 14.2,
    keyInfra: "MRT Lines 6 & 1, Dhaka Elevated Expressway, Purbachal Smart City",
    bnKeyInfra: "মেট্রোরেল ৬ ও ১, ঢাকা এলিভেটেড এক্সপ্রেসওয়ে, পূর্বাচল স্মার্ট সিটি"
  },
  gazipur: {
    areaSqKm: 1806.4,
    population: "4.1 Million",
    avgPricePerKathaBDT: 3200000,
    cadastralSurvey: "BRS Digital",
    zoning: "Industrial / SEZ",
    viabilityScore: 92,
    floodRisk: "Minimal (Zone 1)",
    growthRateYoY: 16.5,
    keyInfra: "BRT Corridor, Dhaka Bypass Expressway, Bangabandhu Hi-Tech City",
    bnKeyInfra: "বিআরটি করিডোর, ঢাকা বাইপাস এক্সপ্রেসওয়ে, বঙ্গবন্ধু হাই-টেক সিটি"
  },
  narayanganj: {
    areaSqKm: 684.4,
    population: "3.4 Million",
    avgPricePerKathaBDT: 3800000,
    cadastralSurvey: "City Survey Verified",
    zoning: "Industrial / SEZ",
    viabilityScore: 91,
    floodRisk: "Moderate (Zone 2)",
    growthRateYoY: 13.8,
    keyInfra: "Inland Container Depot, Shitalakshya 3rd Bridge, Araihazar Japanese SEZ",
    bnKeyInfra: "ইনল্যান্ড কন্টেইনার ডিপো, শীতলক্ষ্যা ৩য় সেতু, আড়াইহাজার জাপানি অর্থনৈতিক অঞ্চল"
  },
  chattogram: {
    areaSqKm: 5282.9,
    population: "8.9 Million",
    avgPricePerKathaBDT: 5400000,
    cadastralSurvey: "City Survey Verified",
    zoning: "Coastal & Port",
    viabilityScore: 96,
    floodRisk: "Moderate (Zone 2)",
    growthRateYoY: 15.1,
    keyInfra: "Bangabandhu Tunnel (Karnaphuli), Bay Terminal, Mirsarai National SEZ",
    bnKeyInfra: "বঙ্গবন্ধু টানেল (কর্ণফুলী), বে টার্মিনাল, মীরসরাই জাতীয় অর্থনৈতিক অঞ্চল"
  },
  coxsbazar: {
    areaSqKm: 2491.9,
    population: "2.8 Million",
    avgPricePerKathaBDT: 4200000,
    cadastralSurvey: "BRS Digital",
    zoning: "Eco-Reserve",
    viabilityScore: 94,
    floodRisk: "Moderate (Zone 2)",
    growthRateYoY: 18.2,
    keyInfra: "Dohazari-Cox's Bazar Rail Link, Matarbari Deep Sea Port, Int'l Airport",
    bnKeyInfra: "দোহাজারী-কক্সবাজার রেল সংযোগ, মাতারবাড়ি গভীর সমুদ্রবন্দর, আন্তর্জাতিক বিমানবন্দর"
  },
  sylhet: {
    areaSqKm: 3452.1,
    population: "3.9 Million",
    avgPricePerKathaBDT: 3900000,
    cadastralSurvey: "BRS Digital",
    zoning: "High-Density Residential",
    viabilityScore: 89,
    floodRisk: "Moderate (Zone 2)",
    growthRateYoY: 12.4,
    keyInfra: "Osmani Int'l Airport Modernization, Sylhet Hi-Tech Park, 4-Lane Highway",
    bnKeyInfra: "ওসমানী বিমানবন্দর আধুনিকায়ন, সিলেট হাই-টেক পার্ক, ঢাকা-সিলেট ৪ লেন মহাসড়ক"
  },
  rajshahi: {
    areaSqKm: 2407.0,
    population: "2.9 Million",
    avgPricePerKathaBDT: 2600000,
    cadastralSurvey: "BRS Digital",
    zoning: "Agro-Greenbelt",
    viabilityScore: 86,
    floodRisk: "Minimal (Zone 1)",
    growthRateYoY: 10.8,
    keyInfra: "Bangabandhu Silicon City Hi-Tech Park, River Port, Airport Expansion",
    bnKeyInfra: "বঙ্গবন্ধু সিলিকন সিটি হাই-টেক পার্ক, নৌবন্দর, রাজশাহী বিমানবন্দর সম্প্রসারণ"
  },
  khulna: {
    areaSqKm: 4394.5,
    population: "2.6 Million",
    avgPricePerKathaBDT: 2800000,
    cadastralSurvey: "BRS Digital",
    zoning: "Industrial / SEZ",
    viabilityScore: 88,
    floodRisk: "Moderate (Zone 2)",
    growthRateYoY: 12.0,
    keyInfra: "Padma Rail Link Connection, Mongla Port Expansion, Rupsha Rail Bridge",
    bnKeyInfra: "পদ্মা সেতু রেল সংযোগ, মোংলা বন্দর সম্প্রসারণ, রূপসা রেল সেতু"
  },
  bogura: {
    areaSqKm: 2898.6,
    population: "3.8 Million",
    avgPricePerKathaBDT: 2400000,
    cadastralSurvey: "RS Validated",
    zoning: "Industrial / SEZ",
    viabilityScore: 87,
    floodRisk: "Minimal (Zone 1)",
    growthRateYoY: 11.5,
    keyInfra: "North Bengal Industrial Corridor, Bogura Airport Upgrade, 4-lane link",
    bnKeyInfra: "উত্তরবঙ্গ শিল্প করিডোর, বগুড়া বিমানবন্দর আধুনিকায়ন, ৪-লেন মহাসড়ক"
  },
  cumilla: {
    areaSqKm: 3146.3,
    population: "6.1 Million",
    avgPricePerKathaBDT: 3100000,
    cadastralSurvey: "BRS Digital",
    zoning: "High-Density Residential",
    viabilityScore: 90,
    floodRisk: "Moderate (Zone 2)",
    growthRateYoY: 13.0,
    keyInfra: "Cumilla EPZ, Dhaka-Chittagong High Speed Corridor Link",
    bnKeyInfra: "কুমিল্লা ইপিজেড, ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে করিডোর"
  },
  mymensingh: {
    areaSqKm: 4393.8,
    population: "5.8 Million",
    avgPricePerKathaBDT: 2100000,
    cadastralSurvey: "BRS Digital",
    zoning: "Agro-Greenbelt",
    viabilityScore: 83,
    floodRisk: "Minimal (Zone 1)",
    growthRateYoY: 9.6,
    keyInfra: "Brahmaputra Bridge Network, Division HQ Smart City Plan",
    bnKeyInfra: "ব্রহ্মপুত্র বহুমুখী সেতু নেটওয়ার্ক, বিভাগীয় সদর আধুনিক নগর মহাপরিকল্পনা"
  },
  barishal: {
    areaSqKm: 2784.5,
    population: "2.5 Million",
    avgPricePerKathaBDT: 2300000,
    cadastralSurvey: "BRS Digital",
    zoning: "Coastal & Port",
    viabilityScore: 84,
    floodRisk: "High (Riverine / Basin)",
    growthRateYoY: 14.5,
    keyInfra: "Payra Bridge connectivity, Southern Waterfront Economic Belt",
    bnKeyInfra: "পায়রা সেতু সরাসরি সংযোগ, দক্ষিণাঞ্চলীয় নদী তীরবর্তী অর্থনৈতিক বেল্ট"
  },
  rangpur: {
    areaSqKm: 2400.6,
    population: "3.2 Million",
    avgPricePerKathaBDT: 1900000,
    cadastralSurvey: "BRS Digital",
    zoning: "Agro-Greenbelt",
    viabilityScore: 80,
    floodRisk: "Moderate (Zone 2)",
    growthRateYoY: 9.2,
    keyInfra: "Teesta Bridge & River Basin Irrigation, Northern Agri-Park",
    bnKeyInfra: "তিস্তা সেতু ও নদী অববাহিকা উন্নয়ন, উত্তরবঙ্গ কৃষি প্রক্রিয়াজাতকরণ পার্ক"
  }
};

// Fallback generator for remaining districts
export function getDistrictLandData(id: string): LandDistrictMeta {
  if (DISTRICT_LAND_DATA[id]) {
    return DISTRICT_LAND_DATA[id];
  }
  // Deterministic realistic numbers based on ID hash
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const price = 1200000 + (hash % 18) * 120000;
  const viability = 72 + (hash % 20);
  const growth = 7.5 + (hash % 8) * 0.9;
  const surveyTypes: LandDistrictMeta["cadastralSurvey"][] = ["BRS Digital", "RS Validated", "City Survey Verified", "e-Cadastre Pilot"];
  const zoningTypes: LandDistrictMeta["zoning"][] = ["Agro-Greenbelt", "High-Density Residential", "Industrial / SEZ", "Eco-Reserve"];

  return {
    areaSqKm: 1400 + (hash % 1600),
    population: `${(1.2 + (hash % 25) * 0.1).toFixed(1)} Million`,
    avgPricePerKathaBDT: price,
    cadastralSurvey: surveyTypes[hash % surveyTypes.length],
    zoning: zoningTypes[hash % zoningTypes.length],
    viabilityScore: viability,
    floodRisk: hash % 3 === 0 ? "High (Riverine / Basin)" : hash % 2 === 0 ? "Moderate (Zone 2)" : "Minimal (Zone 1)",
    growthRateYoY: Number(growth.toFixed(1)),
    keyInfra: "Regional Highway & Fiber-optic GIS Registry Network",
    bnKeyInfra: "আঞ্চলিক মহাসড়ক ও অপটিক্যাল ফাইবার জিআইএস ভূমি ডাটাবেজ"
  };
}

export interface DivisionLandMeta {
  totalParcels: number;
  digitalCadastreCoverage: number; // percentage
  avgLandAppreciation: number;
  primaryEconomicFocus: string;
  bnPrimaryEconomicFocus: string;
}

export const DIVISION_LAND_DATA: Record<string, DivisionLandMeta> = {
  dhaka: {
    totalParcels: 3840000,
    digitalCadastreCoverage: 94.2,
    avgLandAppreciation: 15.3,
    primaryEconomicFocus: "Capital Mega-Metropolis, Real Estate & Fintech Hub",
    bnPrimaryEconomicFocus: "রাজধানী মেগা-সিটি, রিয়েল এস্টেট ও প্রযুক্তি বাণিজ্যিক হাব"
  },
  chittagong: {
    totalParcels: 2950000,
    digitalCadastreCoverage: 89.6,
    avgLandAppreciation: 14.8,
    primaryEconomicFocus: "Commercial Seaport, Industrial Mega-SEZ & Tourism",
    bnPrimaryEconomicFocus: "আন্তর্জাতিক সমুদ্রবন্দর, মেগা অর্থনৈতিক অঞ্চল ও পর্যটন"
  },
  rajshahi: {
    totalParcels: 2180000,
    digitalCadastreCoverage: 91.0,
    avgLandAppreciation: 11.2,
    primaryEconomicFocus: "Agro-Technology, Silk & Educational Innovation Hub",
    bnPrimaryEconomicFocus: "কৃষি প্রযুক্তি, রেশম শিল্প ও শিক্ষা উদ্ভাবন করিডোর"
  },
  khulna: {
    totalParcels: 1890000,
    digitalCadastreCoverage: 88.4,
    avgLandAppreciation: 12.5,
    primaryEconomicFocus: "Mangrove Eco-Zone, Mongla Seaport & Fisheries",
    bnPrimaryEconomicFocus: "সুন্দরবন ইকোলজি, মোংলা বন্দর ও রূপালী চিংড়ি রপ্তানি"
  },
  barishal: {
    totalParcels: 1420000,
    digitalCadastreCoverage: 86.5,
    avgLandAppreciation: 13.9,
    primaryEconomicFocus: "Payra Deep Seaport Corridor & Riverine Logistics",
    bnPrimaryEconomicFocus: "পায়রা গভীর সমুদ্রবন্দর করিডোর ও নৌ-যোগাযোগ হাব"
  },
  sylhet: {
    totalParcels: 1650000,
    digitalCadastreCoverage: 90.1,
    avgLandAppreciation: 13.1,
    primaryEconomicFocus: "Expatriate Real Estate, Natural Gas & Tea Estates",
    bnPrimaryEconomicFocus: "প্রবাসী রিয়েল এস্টেট, প্রাকৃতিক গ্যাস ও চা বাগান অঞ্চল"
  },
  rangpur: {
    totalParcels: 1720000,
    digitalCadastreCoverage: 87.2,
    avgLandAppreciation: 9.8,
    primaryEconomicFocus: "Tobacco, Agro-Processing & Northern Transit Trade",
    bnPrimaryEconomicFocus: "তামাক ও খাদ্য প্রক্রিয়াজাতকরণ এবং ট্রানজিট বাণিজ্য"
  },
  mymensingh: {
    totalParcels: 1310000,
    digitalCadastreCoverage: 85.9,
    avgLandAppreciation: 10.4,
    primaryEconomicFocus: "Agricultural University Hub & Inland Aqua-Culture",
    bnPrimaryEconomicFocus: "কৃষি গবেষণা, হাওর অঞ্চল ও মিঠাপানির মৎস্য বাণিজ্য"
  }
};
