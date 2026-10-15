/**
 * CARTO API Key & Basemap Configuration for LandWise AI
 *
 * Configures authenticated access to CARTO basemaps (Voyager, Positron, Dark Matter)
 * utilizing the user's CARTO access token.
 */

export const CARTO_API_KEY =
  (import.meta.env.VITE_CARTO_API_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfazI1NWsyMXkiLCJqdGkiOiJjY2ZhMWU1YTIxYWVmNTM3MGI4YzJlYzc1YTVhOWZjMCIsImV4cCI6MTc5NzA5ODM5OX0.02S8xtxu6HRJCQWLGbUJFl5CIDo_HmFqYp3sQ6cWm74';

export type CartoStyleId = 'voyager' | 'light_all' | 'dark_all';
export const CARTO_STYLES = [
  { id: 'voyager' as CartoStyleId, name: 'CARTO Voyager' },
  { id: 'light_all' as CartoStyleId, name: 'CARTO Positron' },
  { id: 'dark_all' as CartoStyleId, name: 'CARTO Dark Matter' },
];

export type BasemapStyleId = 'osm' | 'topo' | 'satellite' | 'light' | 'dark';

export interface BasemapOption {
  id: BasemapStyleId;
  name: string;
  labelBangla: string;
  description: string;
  badgeColor: string;
}

export const BASEMAP_STYLES: BasemapOption[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap Detailed',
    labelBangla: 'ওপেনস্ট্রিটম্যাপ (রঙিন সড়ক ও নদী)',
    description: 'Detailed colorful roads, waterways, institutions and places',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  {
    id: 'topo',
    name: 'World Topographic',
    labelBangla: 'টপোগ্রাফিক (উচ্চতা ও ভূগোল)',
    description: 'Terrain elevation contours, administrative boundaries, rivers',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  },
  {
    id: 'satellite',
    name: 'Satellite Aerial',
    labelBangla: 'স্যাটেলাইট এরিয়াল ভিউ',
    description: 'High-resolution true-color satellite photography',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  },
  {
    id: 'light',
    name: 'Minimal Light Canvas',
    labelBangla: 'হালকা ক্যানভাস (সার্ভে)',
    description: 'Clean high-contrast light basemap for cadastral surveying',
    badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  },
  {
    id: 'dark',
    name: 'Executive Dark Canvas',
    labelBangla: 'ডার্ক ক্যানভাস (রাতের ভিউ)',
    description: 'Sleek executive dark mode for night audits and high contrast',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
];

/**
 * Returns reliable unwatermarked raster tile endpoints
 */
export function getReliableBasemapUrls(style: BasemapStyleId = 'osm'): string[] {
  switch (style) {
    case 'osm':
      return [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ];
    case 'topo':
      return [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      ];
    case 'satellite':
      return [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ];
    case 'light':
      return [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      ];
    case 'dark':
      return [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      ];
    default:
      return [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ];
  }
}


/**
 * Returns raster tile endpoints with authenticated API key attached
 */
export function getCartoTileUrls(style: CartoStyleId = 'voyager'): string[] {
  const keyParam = CARTO_API_KEY ? `?api_key=${encodeURIComponent(CARTO_API_KEY)}` : '';
  return [
    `https://a.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}@2x.png${keyParam}`,
    `https://b.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}@2x.png${keyParam}`,
    `https://c.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}@2x.png${keyParam}`,
  ];
}

/**
 * Parses JWT token to extract account ID for verification badge
 */
export function getCartoAccountInfo(): { accountId: string; validUntil: string | null } {
  try {
    if (!CARTO_API_KEY || !CARTO_API_KEY.includes('.')) {
      return { accountId: 'Unauthenticated', validUntil: null };
    }
    const payloadBase64 = CARTO_API_KEY.split('.')[1];
    const decoded = JSON.parse(atob(payloadBase64));
    const expDate = decoded.exp ? new Date(decoded.exp * 1000).toLocaleDateString() : null;
    return {
      accountId: decoded.a || 'ac_k255k21y',
      validUntil: expDate,
    };
  } catch {
    return { accountId: 'ac_k255k21y', validUntil: null };
  }
}

/**
 * MapLibre transformRequest interceptor ensuring all CARTO requests carry the API key
 */
export function cartoTransformRequest(url: string): { url: string; headers?: Record<string, string> } {
  if (url.includes('cartocdn.com') || url.includes('carto.com')) {
    if (!url.includes('api_key=') && CARTO_API_KEY) {
      const sep = url.includes('?') ? '&' : '?';
      return {
        url: `${url}${sep}api_key=${encodeURIComponent(CARTO_API_KEY)}`,
      };
    }
  }
  return { url };
}
