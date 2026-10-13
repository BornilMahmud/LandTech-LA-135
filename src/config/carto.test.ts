import { describe, it, expect } from 'vitest';
import {
  CARTO_API_KEY,
  CARTO_STYLES,
  getCartoTileUrls,
  getCartoAccountInfo,
  cartoTransformRequest,
} from './carto';

describe('CARTO API Key & Basemap Configuration', () => {
  it('has a valid CARTO API key configured', () => {
    expect(CARTO_API_KEY).toBeDefined();
    expect(CARTO_API_KEY.length).toBeGreaterThan(20);
    expect(CARTO_API_KEY).toContain('.');
  });

  it('correctly decodes the CARTO account information', () => {
    const info = getCartoAccountInfo();
    expect(info.accountId).toBe('ac_k255k21y');
    expect(info.validUntil).toBeDefined();
  });

  it('generates authenticated tile URLs with api_key parameter for all styles', () => {
    for (const style of CARTO_STYLES) {
      const urls = getCartoTileUrls(style.id);
      expect(urls).toHaveLength(3);
      expect(urls[0]).toContain(`rastertiles/${style.id}/`);
      expect(urls[0]).toContain(`api_key=${encodeURIComponent(CARTO_API_KEY)}`);
      expect(urls[1]).toContain('https://b.basemaps.cartocdn.com');
      expect(urls[2]).toContain('https://c.basemaps.cartocdn.com');
    }
  });

  it('transforms CARTO requests to attach api_key parameter without duplicates', () => {
    const rawUrl = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/10/100/100@2x.png';
    const transformed = cartoTransformRequest(rawUrl);
    expect(transformed.url).toContain('?api_key=');

    // Should not duplicate if api_key already present
    const alreadyWithKey = transformed.url;
    const transformedAgain = cartoTransformRequest(alreadyWithKey);
    expect(transformedAgain.url).toBe(alreadyWithKey);
  });

  it('leaves non-CARTO URLs unchanged', () => {
    const osmUrl = 'https://router.project-osrm.org/route/v1/driving/89.1,23.9;89.2,23.8';
    const result = cartoTransformRequest(osmUrl);
    expect(result.url).toBe(osmUrl);
  });
});
