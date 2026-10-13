// OSRM Real Road Network Routing Service
// Integrates with OpenStreetMap road topology via the official OSRM routing engine.
// Never substitutes straight lines when routing fails; provides transparent status and step-by-step turns.

export interface RouteStep {
  instruction: string;
  bnInstruction: string;
  distanceKm: number;
  durationMins: number;
  roadName: string;
}

export interface OsrmRouteResult {
  success: boolean;
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][]; // Array of [lng, lat] along actual paved roads
  steps: RouteStep[];
  roadSummary: string;
  bnRoadSummary: string;
  source: string;
  errorMessage?: string;
  bnErrorMessage?: string;
}

export async function fetchOsrmDrivingRoute(
  origin: { lat: number; lng: number; name?: string },
  destination: { lat: number; lng: number; name?: string },
  signal?: AbortSignal
): Promise<OsrmRouteResult> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng.toFixed(5)},${origin.lat.toFixed(5)};${destination.lng.toFixed(5)},${destination.lat.toFixed(5)}?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal,
    });

    if (!res.ok) {
      throw new Error(`Routing service responded with HTTP status ${res.status}`);
    }

    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      return {
        success: false,
        distanceKm: 0,
        durationMinutes: 0,
        geometry: [],
        steps: [],
        roadSummary: 'No drivable route found between selected points',
        bnRoadSummary: 'নির্বাচিত দুটি অবস্থানের মধ্যে কোনো ড্রাইভযোগ্য সড়ক সংযোগ পাওয়া যায়নি',
        source: 'OSRM Routing Engine (OpenStreetMap Road Network)',
        errorMessage: data.message || 'No drivable road connection available. The points may be separated by unbridged water bodies or pedestrian-only paths.',
        bnErrorMessage: 'কোনো ড্রাইভযোগ্য সড়ক সংযোগ মেলেনি। অবস্থান দুটির মাঝে সাঁকোবিহীন নদী বা পদচারী পথ থাকতে পারে।',
      };
    }

    const route = data.routes[0];
    const distanceKm = Number((route.distance / 1000).toFixed(1));
    const durationMinutes = Math.max(1, Math.round(route.duration / 60));
    const geometry: [number, number][] = route.geometry.coordinates;

    // Parse step-by-step turn guidance
    const steps: RouteStep[] = [];
    const legs = route.legs || [];
    if (legs[0] && legs[0].steps) {
      for (const step of legs[0].steps) {
        const stepDistKm = Number((step.distance / 1000).toFixed(2));
        const stepDurationMins = Number((step.duration / 60).toFixed(1));
        const road = step.name || step.ref || 'Connected Road';

        let instruction = `Continue on ${road}`;
        let bnInstruction = `${road} ধরে এগিয়ে যান`;

        const type = step.maneuver?.type;
        const modifier = step.maneuver?.modifier;

        if (type === 'depart') {
          instruction = `Depart towards ${road}`;
          bnInstruction = `${road} ধরে যাত্রা শুরু করুন`;
        } else if (type === 'arrive') {
          instruction = `Arrive at destination on ${road}`;
          bnInstruction = `গন্তব্যে পৌঁছান (${road})`;
        } else if (modifier === 'left' || modifier === 'slight left' || modifier === 'sharp left') {
          instruction = `Turn left onto ${road}`;
          bnInstruction = `বামে মোড় নিয়ে ${road}-এ প্রবেশ করুন`;
        } else if (modifier === 'right' || modifier === 'slight right' || modifier === 'sharp right') {
          instruction = `Turn right onto ${road}`;
          bnInstruction = `ডানে মোড় নিয়ে ${road}-এ প্রবেশ করুন`;
        } else if (type === 'roundabout') {
          instruction = `Take roundabout exit onto ${road}`;
          bnInstruction = `গোলচত্বর অতিক্রম করে ${road}-এ প্রবেশ করুন`;
        }

        steps.push({
          instruction,
          bnInstruction,
          distanceKm: stepDistKm,
          durationMins: stepDurationMins,
          roadName: road,
        });
      }
    }

    const primaryRoad = legs[0]?.steps?.find((s: any) => s.name && s.name.length > 2)?.name || 'Regional Highway';

    return {
      success: true,
      distanceKm,
      durationMinutes,
      geometry,
      steps,
      roadSummary: `Via ${primaryRoad} (${distanceKm} km, ~${durationMinutes} mins)`,
      bnRoadSummary: `${primaryRoad} হয়ে (${distanceKm} কিমি, প্রায় ${durationMinutes} মিনিট)`,
      source: 'OSRM Routing Engine (OpenStreetMap Highway Network)',
    };
  } catch (err: any) {
    const isAbort = err.name === 'AbortError';
    return {
      success: false,
      distanceKm: 0,
      durationMinutes: 0,
      geometry: [],
      steps: [],
      roadSummary: 'Routing request failed',
      bnRoadSummary: 'রুট নির্ণয় ব্যর্থ হয়েছে',
      source: 'OSRM Routing Engine',
      errorMessage: isAbort
        ? 'Route calculation timed out. Please retry.'
        : `Network connection or routing server error (${err.message || 'Unable to connect'}). Please ensure internet access is active.`,
      bnErrorMessage: isAbort
        ? 'রুট গণনার সময়সীমা শেষ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
        : `নেটওয়ার্ক বা রাউটিং সার্ভার সংযোগে ত্রুটি (${err.message || 'সংযোগ সম্ভব হয়নি'})। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।`,
    };
  }
}
