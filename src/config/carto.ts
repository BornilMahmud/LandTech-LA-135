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

export interface CartoStyleOption {
  id: CartoStyleId;
  name: string;
  labelBangla: string;
  description: string;
  badgeColor: string;
}

export const CARTO_STYLES: CartoStyleOption[] = [
  {
    id: 'voyager',
    name: 'CARTO Voyager',
    labelBangla: 'ভয়েজার (রঙিন)',
    description: 'Detailed, Google Maps-style colorful roads, rivers & POIs',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  {
    id: 'light_all',
    name: 'CARTO Positron',
    labelBangla: 'পজিট্রন (হালকা)',
    description: 'Clean, high-contrast light basemap for cadastral surveying',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  {
    id: 'dark_all',
    name: 'CARTO Dark Matter',
    labelBangla: 'ডার্ক ম্যাটার (কালো)',
    description: 'Sleek executive dark mode for night audits and high focus',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
];

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
