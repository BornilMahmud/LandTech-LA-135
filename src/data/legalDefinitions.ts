// Bhumipedia & Bangladesh Ministry of Land Statutory Definitions & Guidance
// Grounded in SAT Act 1950, Land Crime Prevention and Redress Act 2023, and DLRS manuals

export interface LegalTerm {
  termBn: string;
  termEn: string;
  phonetic: string;
  definitionEn: string;
  definitionBn: string;
  practicalSignificanceEn: string;
  practicalSignificanceBn: string;
}

export const BANGLADESH_LAND_TERMS: Record<string, LegalTerm> = {
  khatian: {
    termBn: "খতিয়ান (পর্চা)",
    termEn: "Khatian (Record of Rights / Porcha)",
    phonetic: "Khatian / Porcha",
    definitionEn: "The official cadastral record-of-rights issued under the State Acquisition & Tenancy Act 1950, detailing plot boundaries, owners' names, tenancy class, and individual shares (hissya).",
    definitionBn: "ভূমি জরিপের ভিত্তিতে প্রস্তুতকৃত স্বত্বলিপি বা মালিকানার রেকর্ড, যেখানে মৌজা, দাগ, মালিকের নাম, খতিয়ান নম্বর ও হিস্যা উল্লেখ থাকে।",
    practicalSignificanceEn: "A buyer must verify the chain from historical Khatians (CS/SA/RS) down to the latest Mutation Khatian.",
    practicalSignificanceBn: "জমি কেনার আগে সিএস, এসএ, আরএস থেকে শুরু করে সর্বশেষ নামজারি খতিয়ান পর্যন্ত পরম্পরা মিলিয়ে দেখতে হয়।"
  },
  namjari: {
    termBn: "নামজারি (খারিজ / মিউটেশন)",
    termEn: "Namjari (Mutation / Mutation Khatian)",
    phonetic: "Namjari / Khariz",
    definitionEn: "The formal administrative procedure conducted by the Assistant Commissioner (Land) to record a new owner's name in the government revenue register after purchase, inheritance, or transfer.",
    definitionBn: "জমি হস্তান্তর বা উত্তরাধিকার সূত্রে মালিকানা পরিবর্তনের পর সহকারী কমিশনার (ভূমি) কর্তৃক সরকারি রেকর্ডে নতুন মালিকের নাম লিপিবদ্ধ করার প্রক্রিয়া।",
    practicalSignificanceEn: "Possessing an old deed without mutation is dangerous; government revenue records will still list the prior owner or their heirs.",
    practicalSignificanceBn: "দলিল থাকলেও নামজারি না থাকলে সরকারি খাতায় পূর্বের মালিকের নামই থাকে, যার ফলে প্রতারণা ও দখলের ঝুঁকি তৈরি হয়।"
  },
  saf_kabala: {
    termBn: "সাফ-কবলা দলিল",
    termEn: "Saf-Kabala (Absolute Sale Deed)",
    phonetic: "Saf-Kabala Dolil",
    definitionEn: "An irrevocable deed of absolute conveyance registered under the Registration Act 1908 transferring full title, rights, and interest from the seller to the buyer for consideration.",
    definitionBn: "রেজিস্ট্রেশন আইন অনুযায়ী নিবন্ধিত চূড়ান্ত বিক্রয় দলিল, যার মাধ্যমে বিক্রেতা পণমূল্যের বিনিময়ে ক্রেতাকে জমির নিরঙ্কুশ মালিকানা প্রদান করেন।",
    practicalSignificanceEn: "Must be cross-examined against the seller's actual share in the Khatian to ensure the seller is not selling more land than they own.",
    practicalSignificanceBn: "দলিলের দাগ ও জমির পরিমাণ খতিয়ানের হিস্যার সাথে মেলাতে হয়, যেন বিক্রেতা তার অংশের অতিরিক্ত জমি বিক্রি করতে না পারেন।"
  },
  dakhila: {
    termBn: "দাখিলা (খাজনা রসিদ)",
    termEn: "Dakhila (Land Development Tax Receipt)",
    phonetic: "Dakhila / Khajna Roshid",
    definitionEn: "The official receipt issued by the Union Land Office upon payment of Land Development Tax (LD Tax) under the Land Development Tax Act 2023.",
    definitionBn: "ভূমি উন্নয়ন কর পরিশোধের পর ইউনিয়ন ভূমি অফিস কর্তৃক প্রদত্ত সরকারি রাজস্ব আদায়ের রসিদ।",
    practicalSignificanceEn: "Confirms that taxes are up to date and that the government recognizes the current possessor's tenancy status without arrears.",
    practicalSignificanceBn: "দাখিলা যাচাইয়ের মাধ্যমে নিশ্চিত হওয়া যায় যে সরকারের নিকট কোনো খাজনা বকেয়া নেই এবং হাল সন পর্যন্ত হালনাগাদ রেকর্ড রয়েছে।"
  },
  dag_number: {
    termBn: "দাগ নম্বর (প্লট নম্বর)",
    termEn: "Dag Number (Cadastral Plot Identifier)",
    phonetic: "Dag / Plot Number",
    definitionEn: "The unique parcel index number designated on a Mouza cadastral survey map. Can be Sabek (former historical survey) or Hal (current active survey).",
    definitionBn: "মৌজা ম্যাপে প্রতিটি স্বতন্ত্র জমির সীমানা চিহ্নিতকারী নির্দিষ্ট নম্বর। জরিপভেদে এটি 'সাবেক' (পূর্বের) বা 'হাল' (বর্তমান) হতে পারে।",
    practicalSignificanceEn: "A common fraud tactic is referencing a valuable road-facing Hal Dag in the deed while holding rights only to an interior Sabek Dag.",
    practicalSignificanceBn: "অনেক সময় দলিলের হাল দাগের সাথে খতিয়ানের সাবেক দাগের অমিল থাকে, যা দাগসূচি দিয়ে মেলানো আবশ্যক।"
  },
  mouza_jl: {
    termBn: "মৌজা ও জে.এল. নম্বর",
    termEn: "Mouza & J.L. (Jurisdiction List) Number",
    phonetic: "Mouza & J.L. No",
    definitionEn: "The foundational revenue village unit (Mouza) and its statutory sequential registration number (Jurisdiction List / J.L. Number) within a police station / upazila.",
    definitionBn: "ভূমি রাজস্ব ব্যবস্থার মৌলিক ভৌগোলিক একক (মৌজা) এবং থানার আওতাধীন তার নির্দিষ্ট সরকারি তালিকাভুক্তি নম্বর (জে.এল. নম্বর)।",
    practicalSignificanceEn: "Two mouzas can share identical names in adjacent upazilas; the J.L. number is the unmistakable legal anchor.",
    practicalSignificanceBn: "জে.এল. নম্বর দিয়ে নিশ্চিত হওয়া যায় যে দলিল ও খতিয়ানের জমি একই মৌজায় অবস্থিত।"
  }
};

export const OFFICIAL_GOV_VERIFICATION_PORTALS = [
  {
    name: "ePorcha (ডিজিটাল রেকর্ড রুম)",
    url: "https://eporcha.gov.bd/",
    descriptionEn: "Official government portal to verify Khatian records (CS, SA, RS, BS) and order certified copies online.",
    descriptionBn: "অনলাইনে খতিয়ান (সিএস, এসএ, আরএস, বিএস) অনুসন্ধান এবং সার্টিফাইড কপির আবেদন করার সরকারি পোর্টাল।"
  },
  {
    name: "DLRS Map Portal (ভূমি রেকর্ড ও জরিপ অধিদপ্তর)",
    url: "https://map.settlement.gov.bd/",
    descriptionEn: "National integrated portal to search, inspect and purchase certified digital or printed Mouza maps across 63 districts.",
    descriptionBn: "৬৩ জেলার ডিজিটাল মৌজা ম্যাপ অনুসন্ধান ও সার্টিফাইড নকশা ক্রয়ের সরকারি ব্যবস্থা।"
  },
  {
    name: "e-Mutation (ই-নামজারি পোর্টাল)",
    url: "https://mutation.land.gov.bd/",
    descriptionEn: "Ministry of Land portal to check status of mutation applications and verify authentic DCR and Mutation Khatian cases.",
    descriptionBn: "অনলাইনে নামজারি আবেদন যাচাই এবং ডিসিআর ও নামজারি খতিয়ানের বৈধতা পরীক্ষার পোর্টাল।"
  },
  {
    name: "Smart Bhumi Naksha (ভূমি জোনিং ও ব্যবহার)",
    url: "https://map.land.gov.bd/",
    descriptionEn: "Official digital land zoning portal showing agricultural, residential, commercial and waterway land-use categories.",
    descriptionBn: "মৌজা ও প্লটভিত্তিক জাতীয় ডিজিটাল ভূমি জোনিং এবং জমির অনুমোদিত ব্যবহার প্রদর্শনের পোর্টাল।"
  },
  {
    name: "Bhumipedia (ভূমিপিডিয়া)",
    url: "https://bhumipedia.land.gov.bd/",
    descriptionEn: "Ministry of Land legal repository for land acts, statutory circulars, manuals, and citizen advice.",
    descriptionBn: "ভূমি মন্ত্রণালয়ের ডিজিটাল আইন কোষ, বিধিমালা ও নাগরিক সহায়িকা।"
  }
];
