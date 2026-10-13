import { describe, it, expect, vi } from 'vitest';
import { fetchOsrmDrivingRoute } from './osrmRoutingService';
import { getDistrictGeoData, BANGLADESH_GEO_DISTRICTS } from '../data/bangladeshGeoRegistry';

describe('Bangladesh Geographic Registry & OSRM Routing Service', () => {
  it('retrieves verified geographic records for major districts', () => {
    const dhaka = getDistrictGeoData('dhaka');
    expect(dhaka.id).toBe('dhaka');
    expect(dhaka.upazilas.length).toBeGreaterThanOrEqual(5);
    expect(dhaka.localPlaces.length).toBeGreaterThan(0);
    expect(dhaka.bbox).toHaveLength(4);

    const kushtia = getDistrictGeoData('kushtia');
    expect(kushtia.name).toBe('Kushtia');
    expect(kushtia.majorRivers).toContain('Padma');
    expect(kushtia.upazilas.some(u => u.name === 'Kumarkhali')).toBe(true);

    const sunamganj = getDistrictGeoData('sunamganj');
    expect(sunamganj.name).toBe('Sunamganj');
    expect(sunamganj.majorRivers).toContain('Surma');
    expect(sunamganj.upazilas.some(u => u.name === 'Tahirpur')).toBe(true);
  });

  it('handles OSRM failure gracefully without returning fake straight lines', async () => {
    // Mock global fetch returning error
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    const res = await fetchOsrmDrivingRoute(
      { lat: 23.9012, lng: 89.1264 },
      { lat: 23.8647, lng: 89.2471 }
    );

    expect(res.success).toBe(false);
    expect(res.geometry).toHaveLength(0); // Never fabricate a straight line
    expect(res.errorMessage).toBeDefined();

    global.fetch = originalFetch;
  });

  it('parses valid OSRM response with real road geometry, distance, and duration', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        code: 'Ok',
        routes: [
          {
            distance: 14700,
            duration: 1080,
            geometry: {
              coordinates: [
                [89.1264, 23.9012],
                [89.1500, 23.8900],
                [89.2471, 23.8647]
              ]
            },
            legs: [
              {
                steps: [
                  {
                    name: 'Kushtia-Rajbari Highway',
                    distance: 14700,
                    duration: 1080,
                    maneuver: { type: 'depart' }
                  }
                ]
              }
            ]
          }
        ]
      })
    } as any);

    const res = await fetchOsrmDrivingRoute(
      { lat: 23.9012, lng: 89.1264 },
      { lat: 23.8647, lng: 89.2471 }
    );

    expect(res.success).toBe(true);
    expect(res.distanceKm).toBe(14.7);
    expect(res.durationMinutes).toBe(18);
    expect(res.geometry).toHaveLength(3);
    expect(res.steps).toHaveLength(1);

    global.fetch = originalFetch;
  });
});
