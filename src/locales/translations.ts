export const TRANSLATIONS = {
  en: {
    brandName: 'LandWise AI',
    brandTagline: 'Bangladesh Land Intelligence & Tourism Platform',
    nav: {
      map: 'Map Explorer',
      finder: 'Smart Land Finder',
      compare: 'Compare Properties',
      tourism: 'Tourism & Stays',
      advisor: 'AI Advisor',
      about: 'About / Contest Info'
    },
    purposes: {
      residential: 'Residential',
      hotel: 'Hotel / Resort',
      farm: 'Farm / Agro',
      hospital: 'Hospital / Healthcare',
      restaurant: 'Restaurant / F&B'
    },
    purposesDesc: {
      residential: 'Housing, apartments, residential estates',
      hotel: 'Tourism eco-resorts, beach/hill hotels',
      farm: 'Commercial agriculture, dairy, agro-forestry',
      hospital: 'Clinics, diagnostic centers, healthcare',
      restaurant: 'Dining hubs, food courts, highway diners'
    },
    filters: {
      searchPlaceholder: 'Search by title, mouza, district, or keyword...',
      allDivisions: 'All Divisions',
      allDistricts: 'All Districts',
      allZoning: 'All Zoning Categories',
      allSoils: 'All Soil Types',
      allFloods: 'All Flood Levels',
      targetPurpose: 'Intended Development Purpose:',
      priceRange: 'Price Range (BDT)',
      areaRange: 'Plot Area (Katha)',
      resetFilters: 'Reset Filters',
      showingResults: 'Showing {count} verified sample parcels',
      filterTitle: 'Filter Land Listings',
      apply: 'Apply Filters'
    },
    propertyCard: {
      sampleBadge: 'DEMO SAMPLE',
      perKatha: 'per Katha',
      roadWidth: 'Road Width',
      elevation: 'Elevation',
      floodRisk: 'Flood Risk',
      soil: 'Soil Type',
      zoning: 'Zoning',
      legalStatus: 'Title & Records',
      viewOnMap: 'View on Map',
      calculateSuitability: 'Calculate Suitability',
      addToCompare: 'Compare',
      removeFromCompare: 'Remove',
      viewDetails: 'Full Intelligence Dossier',
      missingDataNotice: 'Missing field surveys:'
    },
    suitability: {
      title: 'Location Suitability Analysis',
      subtitle: 'Deterministic multi-factor decision engine for Bangladesh property development',
      scoreOutOf100: 'Suitability Score',
      purposeSelected: 'Evaluated for: {purpose}',
      factorBreakdown: 'Factor-Level Breakdown',
      weightCustomizer: 'Adjust Factor Weights (%)',
      resetWeights: 'Reset Default Weights',
      dataCoverage: 'Available Data Coverage',
      missingFactors: 'Missing / Unverified Factors',
      strengths: 'Identified Strengths & Advantages',
      limitations: 'Limitations & Development Risks',
      methodologyNote: 'Methodology: Scores are computed deterministically using weighted criteria. This is a heuristic decision tool, not a probability or speculative ML prediction.',
      close: 'Close Dossier'
    },
    comparison: {
      title: 'Side-by-Side Property Comparison',
      subtitle: 'Compare up to 3 properties against the selected development purpose',
      selectPurpose: 'Evaluate for Purpose:',
      winnerBadge: 'Top Recommendation',
      winnerWhy: 'Ranks #1 based on {purpose} criteria: higher road width, flood safety, and essential utility access.',
      compareMetrics: 'Key Decision Metrics',
      addMoreNotice: 'Select at least 2 properties from the Land Finder or Map to activate comparison.',
      clearAll: 'Clear All',
      emptyTitle: 'No properties selected for comparison',
      emptyDesc: 'Go to the Map Explorer or Smart Land Finder and click "Compare" on 2 or 3 properties.',
      exploreLands: 'Browse Land Listings'
    },
    tourism: {
      title: 'Curated Bangladesh Tourism Destinations',
      subtitle: 'Discover natural wonders, coastal beaches, and cloud valleys with verified accommodation options',
      selectDestination: 'Explore Destination:',
      attractionsHeader: 'Key Attractions & Highlights',
      practicalHeader: 'Practical Travel Guidance',
      bestSeason: 'Best Travel Season',
      duration: 'Suggested Duration',
      howToReach: 'How to Reach',
      guidanceNotice: 'Travel Advisory Notice',
      accommodationsHeader: 'Verified Stays & Resort Bookings',
      bookExternal: 'View on {provider}',
      verifiedDisclaimer: 'External links redirect to official verified booking engines. LandWise AI processes no payments.',
      dataLimitations: 'Data Provenance & Sources'
    },
    advisor: {
      title: 'AI Land Intelligence Advisor',
      subtitle: 'Grounded decision assistant powered by deterministic parcel attributes and tourism data',
      placeholder: 'Ask a question about this plot, legal verification, flood risk, or travel...',
      send: 'Ask Advisor',
      quickPromptsTitle: 'Suggested Questions for Current Selection:',
      quickPrompts: [
        'Why does this location score highest for Residential?',
        'What legal and environmental checks are needed before buying this plot in Bangladesh?',
        'How does this parcel perform during monsoon floods and heavy rain?',
        'Which property offers better value per Katha and road access?',
        'Give me a 3-day travel itinerary and resort guidance for this destination.'
      ],
      notice: 'Disclaimer: Guidance is grounded strictly in provided public parcel records and standard Bangladesh land management procedures. Not a substitute for professional survey, legal deed vetting, or certified soil tests.'
    },
    contest: {
      title: 'Contest Architecture & Compliance',
      ruleNotice: 'Built strictly to hackathon specifications: 100% offline-capable, standalone browser execution, deterministic reproducible scoring, bilingual UI, and zero external paid API dependencies.',
      provenanceTitle: 'Sample Data Provenance',
      provenanceDesc: 'All parcels and property details are realistically structured sample records reflecting authentic Bangladesh cadastral formats (Khatian, Mouza, BDT units). Clearly distinguished from real-time private listings.',
      fullStackNotice: 'Optional FastAPI backend included in /backend with Pydantic schemas, ready if judges permit server-side execution.',
      close: 'Got it'
    }
  },
  bn: {
    brandName: 'ল্যান্ডওয়াইজ এআই',
    brandTagline: 'বাংলাদেশ ভূমি মূল্যায়ন ও পর্যটন প্ল্যাটফর্ম',
    nav: {
      map: 'ম্যাপ এক্সপ্লোরার',
      finder: 'স্মার্ট ল্যান্ড ফাইন্ডার',
      compare: 'জমি তুলনা',
      tourism: 'পর্যটন ও হোটেল',
      advisor: 'এআই উপদেষ্টা',
      about: 'প্রকল্প তথ্য'
    },
    purposes: {
      residential: 'আবাসিক',
      hotel: 'হোটেল / রিসোর্ট',
      farm: 'কৃষি খামার',
      hospital: 'হাসপাতাল / স্বাস্থ্যসেবা',
      restaurant: 'রেস্তোরাঁ / ফুড কোর্ট'
    },
    purposesDesc: {
      residential: 'বাড়ি, অ্যাপার্টমেন্ট ও আবাসিক আবাসন',
      hotel: 'ইকো-রিসোর্ট, পর্যটন ও অবকাশ কেন্দ্র',
      farm: 'বাণিজ্যিক কৃষিকাজ, ডেইরি ও কৃষি বাগান',
      hospital: 'ক্লিনিক, ডায়াগনস্টিক ও স্বাস্থ্যকেন্দ্র',
      restaurant: 'রেস্তোরাঁ, ফুড কোর্ট ও হাইওয়ে ডাইনিং'
    },
    filters: {
      searchPlaceholder: 'প্লট, মৌজা, জেলা বা কি-ওয়ার্ড দিয়ে খুঁজুন...',
      allDivisions: 'সকল বিভাগ',
      allDistricts: 'সকল জেলা',
      allZoning: 'সকল জোনিং ক্যাটাগরি',
      allSoils: 'সকল মাটির ধরন',
      allFloods: 'সকল বন্যা ঝুঁকি স্তর',
      targetPurpose: 'উন্নয়ন উদ্দেশ্য নির্বাচন করুন:',
      priceRange: 'মূল্যের পরিসীমা (টাকা)',
      areaRange: 'জমির পরিমাণ (কাঠা)',
      resetFilters: 'ফিল্টার রিসেট',
      showingResults: '{count}টি যাচাইকৃত নমুনা প্লট প্রদর্শিত হচ্ছে',
      filterTitle: 'প্লট ফিল্টার করুন',
      apply: 'ফিল্টার প্রয়োগ করুন'
    },
    propertyCard: {
      sampleBadge: 'নমুনা রেকর্ড',
      perKatha: 'প্রতি কাঠা',
      roadWidth: 'রাস্তার প্রশস্ততা',
      elevation: 'উচ্চতা',
      floodRisk: 'বন্যা ঝুঁকি',
      soil: 'মাটির ধরন',
      zoning: 'জোনিং',
      legalStatus: 'মালিকানা ও খতিয়ান',
      viewOnMap: 'ম্যাপে দেখুন',
      calculateSuitability: 'উপযুক্ততা যাচাই',
      addToCompare: 'তুলনা করুন',
      removeFromCompare: 'বাদ দিন',
      viewDetails: 'সম্পূর্ণ গোয়েন্দা তথ্য',
      missingDataNotice: 'অপ্রমাণিত বা অসমাপ্ত তথ্য:'
    },
    suitability: {
      title: 'অবস্থান উপযুক্ততা বিশ্লেষণ',
      subtitle: 'বাংলাদেশের জমির উন্নয়নে বহু-উপাদানভিত্তিক গাণিতিক সিদ্ধান্ত ইঞ্জিন',
      scoreOutOf100: 'উপযুক্ততা স্কোর',
      purposeSelected: 'মূল্যায়ন উদ্দেশ্য: {purpose}',
      factorBreakdown: 'উপাদানভিত্তিক স্কোর বিভাজন',
      weightCustomizer: 'উপাদানের গুরুত্ব (Weight %) পরিবর্তন করুন',
      resetWeights: 'ডিফল্ট মান ফিরিয়ে আনুন',
      dataCoverage: 'প্রাপ্য তথ্যের কভারেজ',
      missingFactors: 'অনুপস্থিত বা অপরীক্ষিত উপাদান',
      strengths: 'চিহ্নিত সুবিধা ও ইতিবাচক দিক',
      limitations: 'সীমাবদ্ধতা ও সম্ভাব্য ঝুঁকি',
      methodologyNote: 'পদ্ধতি: স্কোরগুলো বাস্তব বৈশিষ্ট্যের ভিত্তিতে গাণিতিকভাবে নির্ধারিত। এটি একটি হিউরিস্টিক সিদ্ধান্ত সহায়িকা, কোনো কাল্পনিক সম্ভাবনা বা মেশিন লার্নিং ভবিষ্যদ্বাণী নয়।',
      close: 'বন্ধ করুন'
    },
    comparison: {
      title: 'একাধিক জমির পাশাপাশি তুলনা',
      subtitle: 'নির্বাচিত উন্নয়ন উদ্দেশ্যের ওপর ভিত্তি করে সর্বোচ্চ ৩টি জমির তুলনা করুন',
      selectPurpose: 'মূল্যায়ন উদ্দেশ্য:',
      winnerBadge: 'সেরা পছন্দ',
      winnerWhy: '{purpose} এর জন্য #১ নির্বাচিত হয়েছে: তুলনামূলক প্রশস্ত রাস্তা, বন্যা নিরাপত্তা ও ইউটিলিটি সংযোগের কারণে।',
      compareMetrics: 'সিদ্ধান্তের মূল মানদণ্ড',
      addMoreNotice: 'তুলনা শুরু করতে ল্যান্ড ফাইন্ডার বা ম্যাপ থেকে নূন্যতম ২টি জমি নির্বাচন করুন।',
      clearAll: 'সব পরিষ্কার করুন',
      emptyTitle: 'তুলনার জন্য কোনো জমি নির্বাচিত করা হয়নি',
      emptyDesc: 'ম্যাপ এক্সপ্লোরার বা স্মার্ট ল্যান্ড ফাইন্ডারে গিয়ে জমির পাশে "তুলনা করুন" বাটনে ক্লিক করুন।',
      exploreLands: 'জমির তালিকা দেখুন'
    },
    tourism: {
      title: 'বাংলাদেশের শীর্ষ পর্যটন গন্তব্য',
      subtitle: 'প্রাকৃতিক সৌন্দর্য, সমুদ্র সৈকত ও পাহাড়ি মেঘের উপত্যকা ভ্রমণ ও হোটেল বুকিং',
      selectDestination: 'গন্তব্য বেছে নিন:',
      attractionsHeader: 'প্রধান আকর্ষণ ও দর্শনীয় স্থান',
      practicalHeader: 'ভ্রমণ সংক্রান্ত তথ্য ও পরামর্শ',
      bestSeason: 'ভ্রমণের উপযুক্ত সময়',
      duration: 'পরামর্শকৃত সময়কাল',
      howToReach: 'যাতায়াত ব্যবস্থা',
      guidanceNotice: 'বিশেষ ভ্রমণ সতর্কতা',
      accommodationsHeader: 'যাচাইকৃত হোটেল ও রিসোর্ট বুকিং',
      bookExternal: '{provider} এ দেখুন',
      verifiedDisclaimer: 'বাহ্যিক লিঙ্কগুলো সরাসরি অনুমোদিত পোর্টাল খোলে। LandWise AI কোনো পেমেন্ট বা টাকা নেয় না।',
      dataLimitations: 'উৎস ও তথ্য বিশ্লেষণ'
    },
    advisor: {
      title: 'এআই ল্যান্ড ইন্টেলিজেন্স উপদেষ্টা',
      subtitle: 'জমির প্রকৃত বৈশিষ্ট্য ও বাস্তব তথ্যের ভিত্তিতে সিদ্ধান্ত সহায়তাকারী এআই',
      placeholder: 'এই জমি, মালিকানা যাচাই, বন্যা ঝুঁকি বা ভ্রমণ বিষয়ে যেকোনো প্রশ্ন করুন...',
      send: 'পরামর্শ চান',
      quickPromptsTitle: 'নির্বাচিত বিষয়ের ওপর প্রস্তাবিত প্রশ্নাবলী:',
      quickPrompts: [
        'কেন এই জমিটি আবাসিক ব্যবহারের জন্য সর্বোচ্চ স্কোর পেয়েছে?',
        'বাংলাদেশে এই জমি কেনার আগে কোন কোন আইনি ও খতিয়ান কাগজপত্র যাচাই করা উচিত?',
        'বর্ষাকালে ভারি বৃষ্টিপাত ও বন্যায় এই প্লটটি কতটা নিরাপদ?',
        'রাস্তার সুবিধা ও প্রতি কাঠা মূল্যে কোন জমিটি বেশি সাশ্রয়ী?',
        'এই পর্যটন গন্তব্যে ভ্রমণের জন্য ৩ দিনের একটি ভ্রমণ পরিকল্পনা দিন।'
      ],
      notice: 'সতর্কতা: এই পরামর্শ শুধুমাত্র প্রদত্ত রেকর্ড ও বাংলাদেশের প্রচলিত ভূমি আইনের সাধারণ নির্দেশনার ওপর ভিত্তি করে তৈরি। এটি কোনো আইনি সার্টিফিকেট বা জমি রেজিস্ট্রির বিকল্প নয়।'
    },
    contest: {
      title: 'প্রতিযোগিতার নীতিমালা ও স্থাপত্য',
      ruleNotice: 'হ্যাকাথন নির্দেশনার শতভাগ অনুকূলে তৈরি: কোনো বাহ্যিক পেইড এপিআই বা সার্ভার ছাড়াই ব্রাউজারে সম্পূর্ণ অফলাইন সক্ষম, সুনির্দিষ্ট গাণিতিক স্কোরিং ও দ্বিভাষিক ইন্টারফেস।',
      provenanceTitle: 'নমুনা তথ্যের সত্যতা',
      provenanceDesc: 'সকল প্লটের তথ্য বাংলাদেশের বাস্তব প্রশাসনিক কাঠামো (খতিয়ান, মৌজা, কাঠা, বিঘা) অনুযায়ী সাজানো নমুনা রেকর্ড। এটি কোনো ব্যক্তিগত রিয়েল এস্টেট তালিকা নয়।',
      fullStackNotice: 'সার্ভার-সাইড মূল্যায়নের জন্য /backend ডিরেক্টরিতে ঐচ্ছিক FastAPI সার্ভিস অন্তর্ভুক্ত করা হয়েছে।',
      close: 'বুঝেছি'
    }
  }
};
