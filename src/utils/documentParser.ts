/**
 * Client-Side Land Document Parser & Bengali/English Regex Extractor
 *
 * Extracts 12 core land identification fields from text, JSON, and CSV uploads
 * completely in-memory with zero remote data leakage.
 */

export interface ParsedDocumentFields {
  docType?: string;
  deedNumber?: string;
  khatianNumber?: string;
  mouza?: string;
  jlNumber?: string;
  dagNumber?: string;
  areaDecimals?: number;
  sellerName?: string;
  buyerName?: string;
  surveyEdition?: string;
  fiscalYear?: string;
}

/**
 * Normalizes Bengali numerals (০-৯) into ASCII numerals (0-9)
 */
export function normalizeBengaliNumerals(str: string): string {
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  return str.replace(/[০-৯]/g, (char) => bnToEnMap[char] || char);
}

/**
 * Parses raw text or JSON content to extract land document fields
 */
export function parseDocumentText(content: string): ParsedDocumentFields {
  const result: ParsedDocumentFields = {};
  if (!content || !content.trim()) return result;

  const trimmed = content.trim();

  // 1. JSON handling
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.dagNumber || parsed.dag) result.dagNumber = normalizeBengaliNumerals(String(parsed.dagNumber || parsed.dag));
      if (parsed.khatianNumber || parsed.khatian) result.khatianNumber = normalizeBengaliNumerals(String(parsed.khatianNumber || parsed.khatian));
      if (parsed.deedNumber || parsed.deed) result.deedNumber = normalizeBengaliNumerals(String(parsed.deedNumber || parsed.deed));
      if (parsed.mouza || parsed.mouzaName) result.mouza = String(parsed.mouza || parsed.mouzaName).trim();
      if (parsed.jlNumber || parsed.jl) result.jlNumber = normalizeBengaliNumerals(String(parsed.jlNumber || parsed.jl));
      if (parsed.areaDecimals || parsed.landAreaDecimals || parsed.area) {
        const areaStr = normalizeBengaliNumerals(String(parsed.areaDecimals || parsed.landAreaDecimals || parsed.area));
        const num = parseFloat(areaStr);
        if (!isNaN(num)) result.areaDecimals = num;
      }
      if (parsed.sellerName || parsed.seller || parsed.owner) result.sellerName = String(parsed.sellerName || parsed.seller || parsed.owner).trim();
      if (parsed.buyerName || parsed.buyer) result.buyerName = String(parsed.buyerName || parsed.buyer).trim();
      if (parsed.surveyEdition || parsed.survey) result.surveyEdition = String(parsed.surveyEdition || parsed.survey).trim();
      if (parsed.docType || parsed.type) result.docType = String(parsed.docType || parsed.type).trim();
      return result;
    } catch {
      // Fall through to regex parser
    }
  }

  // 2. Bilingual Regex extraction
  const deedMatch = trimmed.match(/(?:দলিল\s*নং|দলিল\s*নম্বর|দলিল|deed\s*no|deed\s*number)[\s:.]*([০-৯0-9\/\w-]+)/i);
  if (deedMatch) result.deedNumber = normalizeBengaliNumerals(deedMatch[1].trim());

  const dagMatch = trimmed.match(/(?:দাগ\s*নং|দাগ\s*নম্বর|দাগ|dag\s*no|dag\s*number|plot\s*no|plot)[\s:.]*([০-৯0-9\/\w-]+)/i);
  if (dagMatch) result.dagNumber = normalizeBengaliNumerals(dagMatch[1].trim());

  const khatianMatch = trimmed.match(/(?:খতিয়ান\s*নং|খতিয়ান\s*নম্বর|খতিয়ান|খতিয়ান\s*নং|খতিয়ান\s*নম্বর|খতিয়ান|khatian\s*no|khatian\s*number|khatian)[\s:.]*([০-৯0-9\/\w-]+)/i);
  if (khatianMatch) result.khatianNumber = normalizeBengaliNumerals(khatianMatch[1].trim());

  const mouzaMatch = trimmed.match(/(?:মৌজা|mouza)[\s:.]*([^\n\r,]+)/i);
  if (mouzaMatch) result.mouza = mouzaMatch[1].trim();

  const jlMatch = trimmed.match(/(?:জে\.?\s*এল\.?\s*নং|জে\.?\s*এল\.?|j\.?l\.?\s*no)[\s:.]*([০-৯0-9\w-]+)/i);
  if (jlMatch) result.jlNumber = normalizeBengaliNumerals(jlMatch[1].trim());

  const areaMatch = trimmed.match(/(?:জমির\s*পরিমাণ|পরিমাণ|area|decimals|satak)[\s:.]*([০-৯0-9\.]+)\s*(?:শতাংশ|শতক|decimals|satak)?/i);
  if (areaMatch) {
    const num = parseFloat(normalizeBengaliNumerals(areaMatch[1].trim()));
    if (!isNaN(num)) result.areaDecimals = num;
  }

  const sellerMatch = trimmed.match(/(?:মালিকের\s*নাম|বিক্রেতা|মালিক|owner|seller)[\s:.]*([^\n\r,]+)/i);
  if (sellerMatch) result.sellerName = sellerMatch[1].trim();

  const buyerMatch = trimmed.match(/(?:গ্রহীতার\s*নাম|ক্রেতা|buyer|purchaser)[\s:.]*([^\n\r,]+)/i);
  if (buyerMatch) result.buyerName = buyerMatch[1].trim();

  const surveyMatch = trimmed.match(/\b(CS|SA|RS|BRS|BDS|City\s*Survey)\b/i);
  if (surveyMatch) result.surveyEdition = surveyMatch[1].toUpperCase();

  return result;
}
