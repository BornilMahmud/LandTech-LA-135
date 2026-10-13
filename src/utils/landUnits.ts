// Bangladeshi Land Unit Conversion Standards
// Standardized under Ministry of Land Land Survey Guidelines

export interface LandUnitConversions {
  decimals: number; // শতক (Satak / Decimal)
  katha: number;    // কাঠা (Katha)
  bigha: number;    // বিঘা (Bigha)
  acres: number;    // একর (Acre)
  sqFeet: number;   // বর্গফুট (Square Feet)
  sqMeters: number; // বর্গমিটার (Square Meters)
}

export function convertFromDecimals(decimals: number): LandUnitConversions {
  const safeDec = Math.max(0, decimals);
  return {
    decimals: safeDec,
    katha: Number((safeDec / 1.65).toFixed(3)),
    bigha: Number((safeDec / 33.0).toFixed(3)),
    acres: Number((safeDec / 100.0).toFixed(4)),
    sqFeet: Number((safeDec * 435.6).toFixed(1)),
    sqMeters: Number((safeDec * 40.4686).toFixed(1)),
  };
}

export function convertToDecimals(
  value: number,
  unit: 'decimals' | 'satak' | 'katha' | 'bigha' | 'acres' | 'sqFeet' | 'sqft'
): number {
  switch (unit) {
    case 'decimals':
    case 'satak':
      return value;
    case 'katha':
      return value * 1.65;
    case 'bigha':
      return value * 33.0;
    case 'acres':
      return value * 100.0;
    case 'sqFeet':
    case 'sqft':
      return value / 435.6;
    default:
      return value;
  }
}

export function convertLandArea(
  value: number,
  fromUnit: 'decimals' | 'satak' | 'katha' | 'bigha' | 'acres' | 'sqft' | 'sqFeet',
  toUnit: 'decimals' | 'satak' | 'katha' | 'bigha' | 'acres' | 'sqft' | 'sqFeet'
): number {
  const dec = convertToDecimals(value, fromUnit);
  const conv = convertFromDecimals(dec);
  switch (toUnit) {
    case 'decimals':
    case 'satak':
      return conv.decimals;
    case 'katha':
      return conv.katha;
    case 'bigha':
      return conv.bigha;
    case 'acres':
      return conv.acres;
    case 'sqft':
    case 'sqFeet':
      return conv.sqFeet;
    default:
      return dec;
  }
}

export function formatAreaBilingual(decimals: number, isBn: boolean): string {
  if (isBn) {
    return `${decimals.toFixed(2)} শতাংশ (${(decimals / 1.65).toFixed(2)} কাঠা)`;
  }
  return `${decimals.toFixed(2)} Satak (${(decimals / 1.65).toFixed(2)} Katha)`;
}
