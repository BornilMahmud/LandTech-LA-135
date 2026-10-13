import { describe, it, expect } from 'vitest';
import { parseDocumentText } from './documentParser';
import { convertLandArea, formatAreaBilingual } from './landUnits';

describe('Document Processing & Regex Extractor Unit Tests', () => {
  it('correctly extracts Bengali land fields from raw text', () => {
    const rawBengaliText = `
      দলিল নং: ১২৩৪
      মৌজা: কান্দিরপাড়
      জে.এল. নং: ৮২
      খতিয়ান নং: ৪৫০
      দাগ নং: ৫১২
      জমির পরিমাণ: ৪.৫০ শতাংশ
      মালিকের নাম: মোঃ আবদুর রহিম
      গ্রহীতার নাম: মোসাম্মৎ ফাতেমা বেগম
    `;

    const extracted = parseDocumentText(rawBengaliText);
    expect(extracted.deedNumber).toBe('1234');
    expect(extracted.mouza).toBe('কান্দিরপাড়');
    expect(extracted.jlNumber).toBe('82');
    expect(extracted.khatianNumber).toBe('450');
    expect(extracted.dagNumber).toBe('512');
    expect(extracted.areaDecimals).toBe(4.5);
    expect(extracted.sellerName).toBe('মোঃ আবদুর রহিম');
    expect(extracted.buyerName).toBe('মোসাম্মৎ ফাতেমা বেগম');
  });

  it('correctly extracts English land fields from raw text', () => {
    const rawEnglishText = `
      Deed No. 9876
      Mouza: Boroipara
      J.L. No. 45
      Khatian No. 120
      Plot No. 789
      Area: 6.25 decimals
      Seller: Mohammad Karim Ullah
      Buyer: Rashida Akhter
    `;

    const extracted = parseDocumentText(rawEnglishText);
    expect(extracted.deedNumber).toBe('9876');
    expect(extracted.mouza).toBe('Boroipara');
    expect(extracted.jlNumber).toBe('45');
    expect(extracted.khatianNumber).toBe('120');
    expect(extracted.dagNumber).toBe('789');
    expect(extracted.areaDecimals).toBe(6.25);
    expect(extracted.sellerName).toBe('Mohammad Karim Ullah');
    expect(extracted.buyerName).toBe('Rashida Akhter');
  });

  it('handles empty or unreadable text gracefully without inventing values', () => {
    const junkText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    const extracted = parseDocumentText(junkText);

    expect(extracted.deedNumber).toBeUndefined();
    expect(extracted.khatianNumber).toBeUndefined();
    expect(extracted.dagNumber).toBeUndefined();
    expect(extracted.areaDecimals).toBeUndefined();
    expect(extracted.sellerName).toBeUndefined();
  });

  it('accurately converts Bangladeshi land units under standard statutory ratios', () => {
    // 1 Acre = 100 Satak (Decimals)
    const acreInSatak = convertLandArea(1, 'acres', 'satak');
    expect(acreInSatak).toBeCloseTo(100, 2);

    // 1 Satak = 435.6 Sq Ft
    const satakInSqft = convertLandArea(1, 'satak', 'sqft');
    expect(satakInSqft).toBeCloseTo(435.6, 1);

    // 1 Katha = 1.65 Satak (standard Bengal survey ratio: 720 sq ft / 435.6 sq ft)
    const kathaInSatak = convertLandArea(1, 'katha', 'satak');
    expect(kathaInSatak).toBeCloseTo(1.6529, 2);

    // 1 Bigha = 20 Katha = 33.0 Satak
    const bighaInSatak = convertLandArea(1, 'bigha', 'satak');
    expect(bighaInSatak).toBeCloseTo(33.0, 1);
  });

  it('formats bilingual area strings accurately', () => {
    const formattedEn = formatAreaBilingual(5.0, false);
    expect(formattedEn).toContain('5');
    expect(formattedEn).toContain('Satak');

    const formattedBn = formatAreaBilingual(5.0, true);
    expect(formattedBn).toContain('শতাংশ');
  });
});
