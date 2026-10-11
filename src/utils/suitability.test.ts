import { describe, it, expect } from 'vitest';
import { calculateSuitability } from './suitability';
import { BANGLADESH_PARCELS } from '../data/parcels';
import { formatBdt, formatArea } from './formatters';

describe('Deterministic Suitability Engine', () => {
  const purbachalParcel = BANGLADESH_PARCELS[0];
  const marineDriveParcel = BANGLADESH_PARCELS[1];
  const teaEstateParcel = BANGLADESH_PARCELS[2];

  it('computes residential suitability correctly for high-elevation wide-road plot', () => {
    const res = calculateSuitability(purbachalParcel, 'residential');
    expect(res.overallScore).toBeGreaterThan(70);
    expect(res.factors.length).toBe(5);
    expect(res.dataCoveragePct).toBeGreaterThanOrEqual(80);
    expect(res.missingFactors).toContain('Borehole soil bearing test report');
  });

  it('computes hotel suitability correctly for tourism zoned marine drive parcel', () => {
    const res = calculateSuitability(marineDriveParcel, 'hotel');
    expect(res.overallScore).toBeGreaterThan(75);
    const tourismFactor = res.factors.find(f => f.id === 'tourism_zoning');
    expect(tourismFactor?.rawScore).toBeGreaterThanOrEqual(90);
  });

  it('updates overall score when custom factor weights are modified', () => {
    const defaultRes = calculateSuitability(purbachalParcel, 'residential');
    // Give 100% weight to road_access (which scored 100)
    const customRes = calculateSuitability(purbachalParcel, 'residential', {
      road_access: 100,
      flood_safety: 0,
      civic_amenities: 0,
      utilities: 0,
      environmental_soil: 0,
    });
    expect(customRes.overallScore).toBe(100);
    expect(customRes.overallScore).not.toBe(defaultRes.overallScore);
  });

  it('changes rankings between properties when development purpose changes', () => {
    // For Hotel/Tourism: Marine drive should score higher than Purbachal
    const marineHotel = calculateSuitability(marineDriveParcel, 'hotel').overallScore;
    const purbachalHotel = calculateSuitability(purbachalParcel, 'hotel').overallScore;
    expect(marineHotel).toBeGreaterThan(purbachalHotel);

    // For Residential: Purbachal should score higher than remote hill plot
    const purbachalRes = calculateSuitability(purbachalParcel, 'residential').overallScore;
    const hillRes = calculateSuitability(BANGLADESH_PARCELS[5], 'residential').overallScore; // Bandarban
    expect(purbachalRes).toBeGreaterThan(hillRes);
  });

  it('formats BDT with Crore and Lakh representation', () => {
    expect(formatBdt(35000000, 'en')).toBe('৳ 3.50 Cr');
    expect(formatBdt(4500000, 'en')).toBe('৳ 45.0 Lakh');
    expect(formatBdt(35000000, 'bn')).toContain('কোটি');
    expect(formatBdt(4500000, 'bn')).toContain('লাখ');
  });

  it('formats land area in Katha and Bigha', () => {
    expect(formatArea(10, 'en')).toBe('10 Katha (16.5 Decimal)');
    expect(formatArea(40, 'en')).toBe('2.0 Bigha (40 Katha)');
    expect(formatArea(10, 'bn')).toContain('কাঠা');
  });
});
