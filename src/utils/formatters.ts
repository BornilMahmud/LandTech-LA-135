import { Language } from '../types';

/**
 * Converts English digits to Bengali digits
 */
export function toBengaliNumerals(val: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(val).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
}

/**
 * Formats Bangladeshi Taka (BDT) with Crore & Lakh representation
 * 1 Crore = 10,000,000 (100 Lakhs)
 * 1 Lakh = 100,000
 */
export function formatBdt(amount: number, lang: Language = 'en'): string {
  if (amount >= 10000000) {
    const crore = (amount / 10000000).toFixed(2);
    if (lang === 'bn') {
      return `৳ ${toBengaliNumerals(crore)} কোটি`;
    }
    return `৳ ${crore} Cr`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(1);
    if (lang === 'bn') {
      return `৳ ${toBengaliNumerals(lakh)} লাখ`;
    }
    return `৳ ${lakh} Lakh`;
  }
  const formatted = amount.toLocaleString('en-IN');
  return lang === 'bn' ? `৳ ${toBengaliNumerals(formatted)}` : `৳ ${formatted}`;
}

/**
 * Formats plot area in Katha, Decimal, and Sq Ft
 * In Bangladesh:
 * 1 Katha = 720 Sq Ft = 1.65 Decimal (approx)
 * 1 Bigha = 20 Katha = 14,400 Sq Ft
 */
export function formatArea(katha: number, lang: Language = 'en'): string {
  if (katha >= 20) {
    const bigha = (katha / 20).toFixed(1);
    const remKatha = (katha % 20).toFixed(0);
    if (lang === 'bn') {
      return `${toBengaliNumerals(bigha)} বিঘা (${toBengaliNumerals(katha)} কাঠা)`;
    }
    return `${bigha} Bigha (${katha} Katha)`;
  }
  if (lang === 'bn') {
    return `${toBengaliNumerals(katha)} কাঠা (${toBengaliNumerals((katha * 1.65).toFixed(1))} শতক)`;
  }
  return `${katha} Katha (${(katha * 1.65).toFixed(1)} Decimal)`;
}

export function formatNumber(val: number, lang: Language = 'en', decimals: number = 0): string {
  const str = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  return lang === 'bn' ? toBengaliNumerals(str) : str;
}
