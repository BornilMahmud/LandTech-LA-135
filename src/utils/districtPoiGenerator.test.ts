import { describe, it, expect } from 'vitest';
import {
  generateDistrictPOIs,
  generateDistrictRoads,
  calculateRouteDirections,
  getDistrictAreaSummary,
  filterPOIsByCategory,
  getPathBoundingBox,
} from './districtPoiGenerator';

describe('districtPoiGenerator', () => {
  it('parses bounding box from SVG path correctly', () => {
    const samplePath = 'M375.3,201.0L479.1,201.0L479.1,290.2L375.3,290.2Z';
    const bbox = getPathBoundingBox(samplePath);
    expect(bbox.minX).toBeCloseTo(375.3);
    expect(bbox.maxX).toBeCloseTo(479.1);
    expect(bbox.minY).toBeCloseTo(201.0);
    expect(bbox.maxY).toBeCloseTo(290.2);
    expect(bbox.width).toBeGreaterThan(100);
    expect(bbox.height).toBeGreaterThan(80);
  });

  it('generates non-overlapping POIs for Sunamganj with geographic spread', () => {
    const sunamPath = 'M410.1,287.7L375.3,201.0L479.1,290.2Z';
    const pois = generateDistrictPOIs('sunamganj', [429.1, 238.4], sunamPath);
    expect(pois.length).toBeGreaterThan(12);

    const upazilas = filterPOIsByCategory(pois, 'upazila');
    expect(upazilas.length).toBeGreaterThanOrEqual(10);

    // Verify upazilas are spread out across at least 30 SVG units width and height
    const xCoords = upazilas.map((u) => u.x);
    const yCoords = upazilas.map((u) => u.y);
    const spreadX = Math.max(...xCoords) - Math.min(...xCoords);
    const spreadY = Math.max(...yCoords) - Math.min(...yCoords);

    expect(spreadX).toBeGreaterThan(30);
    expect(spreadY).toBeGreaterThan(25);
  });

  it('generates connected road networks between District Sadar and upazilas', () => {
    const pois = generateDistrictPOIs('sunamganj', [429.1, 238.4]);
    const roads = generateDistrictRoads('sunamganj', pois);

    expect(roads.length).toBeGreaterThan(5);
    roads.forEach((road) => {
      expect(road.path).toContain('M');
      expect(road.path).toContain('Q');
      expect(road.distanceKm).toBeGreaterThan(0);
      expect(road.code).toBeTruthy();
    });
  });

  it('calculates driving route directions between Sadar and destination', () => {
    const pois = generateDistrictPOIs('sunamganj', [429.1, 238.4]);
    const roads = generateDistrictRoads('sunamganj', pois);

    const sadar = pois.find((p) => p.isHub) || pois[0];
    const destination = pois.find((p) => p.id !== sadar.id && p.category === 'upazila') || pois[1];

    const route = calculateRouteDirections(sadar, destination, roads);
    expect(route.distanceKm).toBeGreaterThan(0);
    expect(route.durationMinutes).toBeGreaterThan(0);
    expect(route.path).toBeTruthy();
    expect(route.steps.length).toBeGreaterThanOrEqual(3);
    expect(route.bnSteps.length).toBeGreaterThanOrEqual(3);
  });
});
