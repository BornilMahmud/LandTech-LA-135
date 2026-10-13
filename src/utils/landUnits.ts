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

export function convertToDecimals(value: number, unit: 'decimals' | 'katha' | 'bigha' | 'acres' | 'sqFeet'): number {
  switch (unit) {
    case 'decimals':
      return value;
    case 'katha':
      return value * 1.65;
    case 'bigha':
      return value * 33.0;
    case 'acres':
      return value * 100.0;
    case 'sqFeet':
      return value / 435.6;
    default:
      return value;
  }
}
