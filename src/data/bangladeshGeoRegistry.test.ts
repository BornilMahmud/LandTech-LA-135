import { describe, it, expect } from 'vitest';
import {
  BANGLADESH_GEO_DISTRICTS,
  BANGLADESH_CENTER,
  BANGLADESH_BBOX,
  getDistrictGeoData,
} from './bangladeshGeoRegistry';

describe('Bangladesh Geographic Registry & Geo-Bounds Validation', () => {
  it('has valid national center and bounding box coordinates within Bangladesh WGS84 range', () => {
    // Bangladesh lies between lat 20.5 - 26.7 N, lng 88.0 - 92.7 E
    expect(BANGLADESH_CENTER.lat).toBeGreaterThan(20.5);
    expect(BANGLADESH_CENTER.lat).toBeLessThan(26.7);
    expect(BANGLADESH_CENTER.lng).toBeGreaterThan(88.0);
    expect(BANGLADESH_CENTER.lng).toBeLessThan(92.7);

    // BANGLADESH_BBOX is [minLng, minLat, maxLng, maxLat]
    const [west, south, east, north] = BANGLADESH_BBOX;
    expect(south).toBeLessThan(north);
    expect(west).toBeLessThan(east);
    expect(south).toBeGreaterThan(20.0);
    expect(north).toBeLessThan(27.0);
  });

  it('validates all registered district records have valid coordinates, bounds, and names', () => {
    const districts = Object.values(BANGLADESH_GEO_DISTRICTS);
    expect(districts.length).toBeGreaterThanOrEqual(6);

    for (const d of districts) {
      expect(d.id).toBeDefined();
      expect(d.name).toBeTruthy();
      expect(d.bnName).toBeTruthy();
      expect(d.divisionName).toBeTruthy();

      // Centroid
      expect(d.center.lat).toBeGreaterThan(20.0);
      expect(d.center.lat).toBeLessThan(27.0);
      expect(d.center.lng).toBeGreaterThan(88.0);
      expect(d.center.lng).toBeLessThan(93.0);

      // Bounding box: [minLng, minLat, maxLng, maxLat]
      const [minLng, minLat, maxLng, maxLat] = d.bbox;
      expect(minLat).toBeLessThanOrEqual(maxLat);
      expect(minLng).toBeLessThanOrEqual(maxLng);
    }
  });

  it('validates upazilas within districts have coordinates and non-empty metadata', () => {
    const kushtia = BANGLADESH_GEO_DISTRICTS['kushtia'];
    expect(kushtia).toBeDefined();
    expect(kushtia.upazilas.length).toBeGreaterThanOrEqual(6);

    for (const upz of kushtia.upazilas) {
      expect(upz.id).toBeTruthy();
      expect(upz.name).toBeTruthy();
      expect(upz.bnName).toBeTruthy();
      expect(upz.lat).toBeGreaterThan(23.0);
      expect(upz.lat).toBeLessThan(24.5);
      expect(upz.lng).toBeGreaterThan(88.5);
      expect(upz.lng).toBeLessThan(89.5);
    }
  });

  it('validates mapped local POIs have categories, valid coordinates, and authentic metadata', () => {
    const dhaka = BANGLADESH_GEO_DISTRICTS['dhaka'];
    expect(dhaka).toBeDefined();
    expect(dhaka.localPlaces.length).toBeGreaterThan(0);

    for (const place of dhaka.localPlaces) {
      expect(place.id).toBeTruthy();
      expect(place.name).toBeTruthy();
      expect(place.category).toMatch(/School|College|University|Hospital|Land Office|Market|Sub-Registry|Police Station/);
      expect(place.lat).toBeGreaterThan(23.0);
      expect(place.lng).toBeGreaterThan(90.0);
    }
  });

  it('returns safe fallback for unknown district IDs without crashing', () => {
    const unknown = getDistrictGeoData('unknown_demo_district');
    expect(unknown).toBeDefined();
    expect(unknown.id).toBe('unknown_demo_district');
    expect(unknown.center.lat).toBeGreaterThan(20.0);
    expect(unknown.upazilas.length).toBeGreaterThan(0);
    expect(unknown.localPlaces.length).toBeGreaterThan(0);
  });

  it('validates cadastral parcels carry survey history and zoning tags', () => {
    const kushtia = BANGLADESH_GEO_DISTRICTS['kushtia'];
    expect(kushtia.cadastralParcels.length).toBeGreaterThan(0);

    const parcel = kushtia.cadastralParcels[0];
    expect(parcel.dagNumber).toBeTruthy();
    expect(parcel.mouzaName).toBeTruthy();
    expect(parcel.surveyEdition).toMatch(/CS|SA|RS|BRS|BDS/);
    expect(parcel.landType).toMatch(/Commercial|Residential|Agricultural|Industrial/);
  });
});
