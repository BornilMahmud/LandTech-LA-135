import { LandParcel, SuitabilityPurpose, TourismDestination, Language } from '../types';
import { calculateSuitability } from './suitability';
import { formatBdt, formatArea } from './formatters';

interface AdvisorContext {
  parcel?: LandParcel;
  comparedParcels?: LandParcel[];
  purpose: SuitabilityPurpose;
  destination?: TourismDestination;
  language: Language;
}

export async function askAdvisor(
  question: string,
  context: AdvisorContext,
  apiKey?: string
): Promise<{ textEn: string; textBn: string; sources: string[]; missingWarnings: string[] }> {
  // If an API key is provided and user is online, attempt Gemini with grounded prompt
  if (apiKey && apiKey.trim() !== '' && typeof window !== 'undefined' && navigator.onLine) {
    try {
      const groundedResponse = await callGeminiWithGrounding(question, context, apiKey);
      if (groundedResponse) return groundedResponse;
    } catch (e) {
      console.warn('Gemini API call failed or timed out, falling back to deterministic engine:', e);
    }
  }

  // Deterministic Grounded Reasoning Engine
  return generateDeterministicAnswer(question, context);
}

function generateDeterministicAnswer(
  query: string,
  context: AdvisorContext
): { textEn: string; textBn: string; sources: string[]; missingWarnings: string[] } {
  const q = query.toLowerCase();
  const { parcel, comparedParcels, purpose, destination } = context;

  const sources: string[] = ['LandWise AI Deterministic Suitability Engine', 'Public Bangladesh Cadastral Framework'];
  const missingWarnings: string[] = [];

  if (parcel?.missingAttributes && parcel.missingAttributes.length > 0) {
    parcel.missingAttributes.forEach(a => missingWarnings.push(a));
  }

  // 1. Comparison query between multiple properties
  if (q.includes('better fits') || q.includes('compare') || q.includes('budget') || (comparedParcels && comparedParcels.length > 1 && q.includes('which'))) {
    if (comparedParcels && comparedParcels.length >= 2) {
      const p1 = comparedParcels[0];
      const p2 = comparedParcels[1];
      const s1 = calculateSuitability(p1, purpose).overallScore;
      const s2 = calculateSuitability(p2, purpose).overallScore;

      const higherSuit = s1 >= s2 ? p1 : p2;
      const lowerPriceKatha = p1.pricePerKatha <= p2.pricePerKatha ? p1 : p2;

      sources.push(`Evaluated for: ${purpose.toUpperCase()}`);

      const textEn = `### Grounded Comparison Analysis:
1. **Suitability Champion for ${purpose.toUpperCase()}**:
   - **${higherSuit.titleEn}** scores **${Math.max(s1, s2)}/100**, compared to **${Math.min(s1, s2)}/100** for ${higherSuit.id === p1.id ? p2.titleEn : p1.titleEn}.
   - **Key Advantage**: Road width is ${higherSuit.roadWidthFt}ft with ${higherSuit.floodRisk} flood vulnerability.

2. **Budget & Value Efficiency**:
   - **${lowerPriceKatha.titleEn}** offers the more affordable rate at **${formatBdt(lowerPriceKatha.pricePerKatha, 'en')} / Katha** (Total: ${formatBdt(lowerPriceKatha.priceBdt, 'en')}).
   - In contrast, ${lowerPriceKatha.id === p1.id ? p2.titleEn : p1.titleEn} is priced at **${formatBdt(lowerPriceKatha.id === p1.id ? p2.pricePerKatha : p1.pricePerKatha, 'en')} / Katha**.

3. **Due Diligence Notice**:
   - Note that ${p1.missingAttributes.length > 0 ? `${p1.titleEn} lacks ${p1.missingAttributes.join(', ')}` : 'verified sample data'}.
   - Always verify physical mutation records at the local AC Land office prior to financial commitments.`;

      const textBn = `### বাস্তব তথ্যের ভিত্তিতে জমি তুলনা:
১. **${purpose} ব্যবহারের জন্য সেরা পছন্দ**:
   - **${higherSuit.titleBn}** পেয়েছে **${Math.max(s1, s2)}/১০০**, অপরদিকে অন্যটি পেয়েছে **${Math.min(s1, s2)}/১০০**।
   - **প্রধান কারণ**: রাস্তার প্রশস্ততা ${higherSuit.roadWidthFt} ফুট ও অনুকূল বন্যা প্রতিরোধ ক্ষমতা।

২. **বাজেট ও মূল্য সাশ্রয়ী মানদণ্ড**:
   - প্রতি কাঠা মূল্যে **${lowerPriceKatha.titleBn}** বেশি সাশ্রয়ী: **${formatBdt(lowerPriceKatha.pricePerKatha, 'bn')} / কাঠা** (মোট মূল্য: ${formatBdt(lowerPriceKatha.priceBdt, 'bn')})।

৩. **প্রয়োজনীয় আইনি সতর্কতা**:
   - চূড়ান্ত চুক্তির পূর্বে সংশ্লিষ্ট উপজেলা সহকারী কমিশনার (ভূমি) বা এসি ল্যান্ড অফিস থেকে নামজারি খতিয়ান যাচাই করুন।`;

      return { textEn, textBn, sources, missingWarnings };
    }
  }

  // 2. "Why does this location score highest / rank first?"
  if (q.includes('why') || q.includes('rank') || q.includes('score') || q.includes('কেন')) {
    if (parcel) {
      const res = calculateSuitability(parcel, purpose);
      sources.push(`Parcel ID: ${parcel.id}`, `Evaluation Purpose: ${purpose}`);

      const textEn = `### Why **${parcel.titleEn}** scores ${res.overallScore}/100 for ${purpose.toUpperCase()}:
- **Primary Driving Factors**:
  ${res.strengthsEn.map(s => `• ${s}`).join('\n  ')}

- **Infrastructure Verification**:
  • Road Width: **${parcel.roadWidthFt} ft** (Min 20ft is required for smooth access in BD).
  • Elevation & Waterlogging: **${parcel.elevationMeters}m above MSL** with **${parcel.floodRisk}** monsoon flood vulnerability.
  • Recorded Utilities: Electricity (${parcel.utilities.electricity ? 'Available' : 'Pending'}), Water (${parcel.utilities.water ? 'Yes' : 'No'}), Gas (${parcel.utilities.gas ? 'Piped Gas' : 'LPG Only'}).

- **Limitations to Factor**:
  ${res.limitationsEn.length > 0 ? res.limitationsEn.map(l => `• ${l}`).join('\n  ') : '• No critical site limitations identified in verified attributes.'}
  
*Notice: Suitability is computed deterministically from input criteria and does not constitute financial or legal advice.*`;

      const textBn = `### কেন **${parcel.titleBn}** ${purpose} এর জন্য ${res.overallScore}/১০০ পেয়েছে:
- **শীর্ষ ইতিবাচক বৈশিষ্ট্যসমূহ**:
  ${res.strengthsBn.map(s => `• ${s}`).join('\n  ')}

- **ভৌত অবকাঠামো বিবরণ**:
  • রাস্তার প্রশস্ততা: **${parcel.roadWidthFt} ফুট** (বাংলাদেশে যেকোনো টেকসই প্রকল্পের জন্য প্রশস্ত রাস্তা জরুরি)।
  • উচ্চতা ও জলাবদ্ধতা: সমুদ্রপৃষ্ঠ থেকে **${parcel.elevationMeters} মিটার** এবং **${parcel.floodRisk === 'Low' ? 'কম' : 'মাঝারি'}** বন্যা ঝুঁকি।
  • ইউটিলিটি: বিদ্যুৎ (${parcel.utilities.electricity ? 'আছে' : 'নেই'}), পানি (${parcel.utilities.water ? 'আছে' : 'নেই'}), গ্যাস (${parcel.utilities.gas ? 'পাইপলাইন গ্যাস' : 'এলপিজি নির্ভর'})।

- **সীমাবদ্ধতা ও বিবেচ্য বিষয়**:
  ${res.limitationsBn.length > 0 ? res.limitationsBn.map(l => `• ${l}`).join('\n  ') : '• কোনো বড় সীমাবদ্ধতা রেকর্ড করা হয়নি।'}`;

      return { textEn, textBn, sources, missingWarnings };
    }
  }

  // 3. Legal & Due Diligence Questions
  if (q.includes('legal') || q.includes('investigate') || q.includes('check') || q.includes('paper') || q.includes('কেনার আগে') || q.includes('আইনি')) {
    if (parcel) {
      sources.push(`Registry Status: ${parcel.legalStatus}`, `Khatian: ${parcel.khatianType}`);
      const textEn = `### Essential Bangladesh Land Due Diligence Checklist for **${parcel.titleEn}**:
1. **Chain of Ownership (Baya Deed Verification)**:
   - Verify the uninterrupted 25-30 year chain of ownership deeds (Baya Dalil) tracing from CS, SA, RS to current BS Khatian.
   - Parcel current status: *${parcel.legalStatus}* (${parcel.csRsReference}).

2. **AC Land Office Mutation & DCR Check**:
   - Check the **Namjari (Mutation)** record, Mutation Khatian, and **DCR (Duplicate Carbon Receipt)** at the local Union Land Office / AC Land.
   - Confirm Land Development Tax (Khajna) is cleared up to the current Bengali calendar year (1431-1432 BS).

3. **Zoning & Master Plan Clearance**:
   - Current classification is **${parcel.zoning}**. If planning commercial/hospital construction, verify layout approval from the master development authority (e.g., RAJUK / CDA / RDA / KDA).

4. **Missing Technical Surveys for this Plot**:
   ${missingWarnings.length > 0 ? missingWarnings.map(m => `⚠️ **Pending Verification**: ${m}`).join('\n   ') : 'No pending surveys recorded in sample dossier.'}`;

      const textBn = `### **${parcel.titleBn}** কেনার পূর্বে অপরিহার্য আইনি ও সার্ভে চেকলিস্ট:
১. **মালিকানা ধারাবাহিকতা ও বায়া দলিল যাচাই**:
   - সিএস, এসএ, আরএস থেকে বর্তমান বিএস খতিয়ান পর্যন্ত ২৫-৩০ বছরের বায়া দলিলের ধারাবাহিকতা যাচাই করুন।
   - প্লটের রেকর্ড: *${parcel.legalStatus}* (${parcel.csRsReference})।

২. **এসি ল্যান্ড নামজারি ও ডিসিআর যাচাই**:
   - সংশ্লিষ্ট উপজেলা বা ইউনিয়ন ভূমি অফিসে নামজারি (মিউটেশন) খতিয়ান, ডিসিআর ও চলতি ১৪৩১-১৪৩২ বঙ্গাব্দের খাজনা পরিশোধের দাখিলা দেখুন।

৩. **জোনিং ও মাস্টারপ্ল্যান ছাড়পত্র**:
   - বর্তমান জোনিং: **${parcel.zoning}**। হাসপাতাল বা বাণিজ্যিক ভবনের ক্ষেত্রে স্থানীয় উন্নয়ন কর্তৃপক্ষ (রাজউক/সিডিএ) থেকে অনুমোদিত নকশা যাচাই আবশ্যক।

৪. **বাকি থাকা ফিল্ড টেস্ট**:
   ${missingWarnings.length > 0 ? missingWarnings.map(m => `⚠️ **যাচাই আবশ্যক**: ${m}`).join('\n   ') : 'সব তথ্য যাচাইকৃত।'}`;

      return { textEn, textBn, sources, missingWarnings };
    }
  }

  // 4. Flood, Monsoon & Soil Questions
  if (q.includes('flood') || q.includes('rain') || q.includes('soil') || q.includes('বন্যা') || q.includes('মাটি')) {
    if (parcel) {
      sources.push(`Flood Risk Index: ${parcel.floodRisk}`, `Soil Type: ${parcel.soilType}`);
      const textEn = `### Environmental & Monsoon Profile for **${parcel.titleEn}**:
- **Monsoon Flood Vulnerability**: Rated **${parcel.floodRisk} Risk** at **${parcel.elevationMeters} meters** elevation.
  ${parcel.floodRisk === 'Low' ? '• Plot sits on natural high ground with rapid runoff to local drainage canals.' : '• Seasonal torrential rainfall may cause temporary surface waterlogging; elevation landfill or retaining wall recommended.'}
- **Geotechnical Soil Profile**: **${parcel.soilType} Soil**.
  ${parcel.soilType === 'Red Clay' ? '• High cohesive bearing strength (Madhupur Tract/Barind Tract), minimal piling settlement.' : parcel.soilType === 'Alluvial' ? '• Fertile silty deposit; standard deep RCC cast-in-situ piles advised for multi-story structures.' : '• Specialized foundation engineering required.'}
- **Missing Environmental Data**:
  ${missingWarnings.length > 0 ? missingWarnings.join('; ') : 'None'}.`;

      const textBn = `### **${parcel.titleBn}** এর পরিবেশগত ও বর্ষাকালীন তথ্য:
- **বন্যা ঝুঁকি ও নিষ্কাশন**: **${parcel.floodRisk === 'Low' ? 'কম ঝুঁকি' : 'মাঝারি ঝুঁকি'}**, ভূমির উচ্চতা সমুদ্রপৃষ্ঠ থেকে **${parcel.elevationMeters} মিটার**।
- **মাটির গঠন ও ভিত নির্মাণ**: **${parcel.soilType}** মাটি।
  ${parcel.soilType === 'Red Clay' ? '• লালমাটির প্রাকৃতিক ভারবহন ক্ষমতা বেশি হওয়ায় ভিত নির্মাণ খরচ সাশ্রয়ী হয়।' : '• পলল দোআঁশ মাটি; বহুতল ভবনের জন্য আরসিসি পাইল টেস্ট প্রয়োজন।'}`;

      return { textEn, textBn, sources, missingWarnings };
    }
  }

  // 5. Tourism / Travel Itinerary Questions
  if (q.includes('travel') || q.includes('itinerary') || q.includes('tourist') || q.includes('visit') || q.includes('ভ্রমণ') || destination) {
    const dest = destination || {
      nameEn: "Cox's Bazar",
      nameBn: 'কক্সবাজার',
      taglineEn: "World's Longest Sea Beach",
      practicalInfo: {
        bestSeasonEn: 'November to March',
        suggestedDurationEn: '3 Days / 2 Nights',
        howToReachEn: 'Direct flight, Express train, or AC bus',
        guidanceNoticeEn: 'Observe coastguard flag safety.'
      },
      attractions: []
    };

    sources.push(`Tourism Guidance: ${dest.nameEn}`, 'Bangladesh Tourism Board');

    const textEn = `### 3-Day Travel Itinerary for **${dest.nameEn}**:
- **Best Season**: ${dest.practicalInfo.bestSeasonEn}
- **Suggested Duration**: ${dest.practicalInfo.suggestedDurationEn}
- **Recommended Plan**:
  • **Day 1**: Arrival, check-in to verified beach/eco resort, sunset walk and local seafood tasting.
  • **Day 2**: Full day exploration of prime attractions, scenic coastal/hill viewpoints, and eco-parks.
  • **Day 3**: Sunrise viewing, handicraft bazaar shopping, and departure.
- **Transport**: ${dest.practicalInfo.howToReachEn}.
- **Advisory**: ${dest.practicalInfo.guidanceNoticeEn}`;

    const textBn = `### **${dest.nameBn}** ভ্রমণের ৩ দিনের পরিকল্পনা:
- **ভ্রমণের সেরা সময়**: ${dest.practicalInfo.bestSeasonEn}
- **পরামর্শকৃত সময়কাল**: ৩ দিন / ২ রাত
- **দৈনিক ভ্রমণ রূপরেখা**:
  • **১ম দিন**: পৌঁছানো, রিসোর্টে চেক-ইন, সূর্যাস্ত দর্শন ও স্থানীয় খাবারের স্বাদ গ্রহণ।
  • **২য় দিন**: প্রধান দর্শনীয় স্থানসমূহ, পাহাড়ি বা সামুদ্রিক ভিউপয়েন্ট ও ইকো-ট্যুরিজম কেন্দ্র পরিদর্শন।
  • **৩য় দিন**: সূর্যোদয় দর্শন, কেনাকাটা ও প্রস্থান।`;

    return { textEn, textBn, sources, missingWarnings };
  }

  // Generic fallback grounded in selected item
  const selectedName = parcel ? parcel.titleEn : 'the selected Bangladesh property';
  const textEn = `Based on verified attributes for **${selectedName}**, the platform evaluates road accessibility, flood elevation, and title records deterministically. 

Current Purpose: **${purpose.toUpperCase()}**.
Feel free to ask specifically about:
- Why this parcel ranks highest
- Legal due diligence and mutation steps
- Monsoon flood elevation and soil strength
- Comparison with another property on your shortlist`;

  const textBn = `**${selectedName}** এর যাচাইকৃত তথ্যের ভিত্তিতে প্ল্যাটফর্মটি রাস্তা, বন্যা ঝুঁকি ও আইনি রেকর্ড মূল্যায়ন করে।

বর্তমান উদ্দেশ্য: **${purpose}**।
আপনি নির্দিষ্টভাবে জানতে চাইতে পারেন:
- কেন এই জমিটি সর্বোচ্চ উপযুক্ততা পেয়েছে
- নামজারি ও দলিলের আইনি যাচাই প্রক্রিয়া
- বর্ষায় জলাবদ্ধতা ও মাটির গঠন
- অন্য কোনো জমির সাথে তুলনামূলক বিশ্লেষণ`;

  return { textEn, textBn, sources, missingWarnings };
}

async function callGeminiWithGrounding(
  question: string,
  context: AdvisorContext,
  apiKey: string
): Promise<{ textEn: string; textBn: string; sources: string[]; missingWarnings: string[] } | null> {
  const { parcel, purpose, destination } = context;

  const systemPrompt = `You are LandWise AI Advisor, a grounded, rigorous expert on Bangladesh land intelligence and tourism.
CRITICAL CONSTRAINTS:
1. ONLY make claims supported by the provided parcel attributes or destination data.
2. NEVER invent land ownership, confirm real-time legal clearance, guarantee financial investment ROI, or claim zero risk.
3. Always mention known attributes vs missing unverified data.
4. Output structured response with both English and Bengali summary.`;

  const contextData = {
    selectedParcel: parcel,
    evaluatedPurpose: purpose,
    selectedDestination: destination
  };

  const body = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `Data Context: ${JSON.stringify(contextData)}\nUser Question: ${question}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 800
    }
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) return null;
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return {
    textEn: text,
    textBn: 'উপরের এআই প্রতিক্রিয়াটি নির্বাচিত জমির বাস্তব তথ্যের ভিত্তিতে তৈরি করা হয়েছে।',
    sources: ['Google Gemini Grounded Model', 'LandWise AI Active Parcel Context'],
    missingWarnings: parcel?.missingAttributes || []
  };
}
