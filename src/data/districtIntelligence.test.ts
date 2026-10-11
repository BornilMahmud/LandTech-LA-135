import { describe, it, expect } from 'vitest';
import {
  DISTRICT_INTELLIGENCE,
  getDistrictIntelligence,
  searchIntelligence,
} from './districtIntelligence';
import { ALL_BANGLADESH_DISTRICTS } from './bangladeshMapData';

describe('District Intelligence Dataset (All 64 Districts)', () => {
  it('covers all 64 districts with verified data records', () => {
    const keys = Object.keys(DISTRICT_INTELLIGENCE);
    expect(keys.length).toBe(64);

    // Verify all districts from ALL_BANGLADESH_DISTRICTS are covered
    ALL_BANGLADESH_DISTRICTS.forEach((d) => {
      const record = DISTRICT_INTELLIGENCE[d.id];
      expect(record, `Missing district: ${d.id}`).toBeDefined();
      expect(record.name.toLowerCase().replace(/\s+/g, '')).toBe(d.name.toLowerCase().replace(/\s+/g, ''));
      expect(record.upazilas.length).toBeGreaterThan(0);
      expect(record.upazilasCount).toBeGreaterThan(0);
    });
  });

  it('retrieves district intelligence for Dhaka with authentic statistics', () => {
    const dhaka = getDistrictIntelligence('dhaka');
    expect(dhaka.id).toBe('dhaka');
    expect(dhaka.divisionId).toBe('dhaka');
    expect(dhaka.upazilasCount).toBeGreaterThanOrEqual(5);
    expect(dhaka.schoolsCount).toBeGreaterThan(0);
    expect(dhaka.hospitalsCount).toBeGreaterThan(0);
    expect(dhaka.suitabilityScores.residential).toBeGreaterThan(0);
    expect(dhaka.suitabilityScores.commercial).toBeGreaterThan(0);
  });

  it('falls back gracefully to Dhaka for unknown district IDs', () => {
    const fallback = getDistrictIntelligence('non-existent-district');
    expect(fallback).toBeDefined();
    expect(fallback.id).toBe('dhaka');
  });

  it('searches across districts, upazilas, and institutions effectively', () => {
    // 1. Search for a district
    const districtResults = searchIntelligence('Cox');
    expect(districtResults.length).toBeGreaterThan(0);
    expect(districtResults.some((r) => r.districtId === 'coxsbazar')).toBe(true);

    // 2. Search for an upazila
    const upazilaResults = searchIntelligence('Mirpur');
    expect(upazilaResults.length).toBeGreaterThan(0);
    expect(upazilaResults[0].type).toBe('upazila');

    // 3. Search for a university
    const uniResults = searchIntelligence('University');
    expect(uniResults.length).toBeGreaterThan(0);
    expect(uniResults.some((r) => r.type === 'institution')).toBe(true);

    // 4. Search in Bengali
    const bnResults = searchIntelligence('ঢাকা');
    expect(bnResults.length).toBeGreaterThan(0);
  });
});
