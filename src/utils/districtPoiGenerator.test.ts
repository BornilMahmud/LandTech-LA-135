import { describe, it, expect } from 'vitest';
import { generateDistrictPOIs, getDistrictAreaSummary, filterPOIsByCategory } from './districtPoiGenerator';

describe('districtPoiGenerator', () => {
  it('generates POIs for Dhaka with upazilas, pourashavas, colleges, schools, and hospitals', () => {
    const pois = generateDistrictPOIs('dhaka', [308, 482]);
    expect(pois.length).toBeGreaterThan(10);

    const upazilas = filterPOIsByCategory(pois, 'upazila');
    expect(upazilas.length).toBeGreaterThanOrEqual(5);

    const pourashavas = filterPOIsByCategory(pois, 'pourashava');
    expect(pourashavas.length).toBeGreaterThanOrEqual(1);

    const colleges = filterPOIsByCategory(pois, 'college');
    expect(colleges.length).toBeGreaterThanOrEqual(2);

    const schools = filterPOIsByCategory(pois, 'school');
    expect(schools.length).toBeGreaterThanOrEqual(1);

    const hospitals = filterPOIsByCategory(pois, 'hospital');
    expect(hospitals.length).toBeGreaterThanOrEqual(2);

    // Verify coordinates are anchored near centroid
    pois.forEach((poi) => {
      expect(poi.x).toBeGreaterThan(250);
      expect(poi.x).toBeLessThan(360);
      expect(poi.y).toBeGreaterThan(430);
      expect(poi.y).toBeLessThan(540);
    });
  });

  it('calculates accurate area summary with square kilometers, acres, and bighas', () => {
    const summary = getDistrictAreaSummary('dhaka');
    expect(summary.areaSqKm).toBeGreaterThan(1000);
    expect(summary.areaAcres).toBeGreaterThan(200000);
    expect(summary.areaBighas).toBeGreaterThan(600000);
    expect(summary.upazilasCount).toBeGreaterThanOrEqual(5);
    expect(summary.pourashavasCount).toBeGreaterThanOrEqual(1);
  });

  it('generates valid POIs for regional districts (e.g. Chattogram, Sylhet, Rajshahi)', () => {
    const ctgPOIs = generateDistrictPOIs('chattogram', [440, 620]);
    expect(ctgPOIs.length).toBeGreaterThan(10);
    expect(filterPOIsByCategory(ctgPOIs, 'upazila').length).toBeGreaterThan(5);

    const sylPOIs = generateDistrictPOIs('sylhet', [480, 320]);
    expect(sylPOIs.length).toBeGreaterThan(8);

    const rajPOIs = generateDistrictPOIs('rajshahi', [190, 390]);
    expect(rajPOIs.length).toBeGreaterThan(8);
  });

  it('correctly filters POIs by category', () => {
    const pois = generateDistrictPOIs('dhaka', [308, 482]);
    const education = filterPOIsByCategory(pois, 'education');
    expect(education.every((p) => p.category === 'college' || p.category === 'school')).toBe(true);

    const hospitals = filterPOIsByCategory(pois, 'hospital');
    expect(hospitals.every((p) => p.category === 'hospital')).toBe(true);
  });
});
