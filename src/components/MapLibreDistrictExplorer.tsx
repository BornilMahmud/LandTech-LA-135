import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  BANGLADESH_GEO_DISTRICTS,
  BANGLADESH_CENTER,
  BANGLADESH_BBOX,
  getDistrictGeoData,
  DistrictGeoRecord,
  UpazilaGeo,
  LocalPlace,
  CadastralParcelGeo,
} from '../data/bangladeshGeoRegistry';
import { fetchOsrmDrivingRoute, OsrmRouteResult } from '../utils/osrmRoutingService';
import {
  Compass,
  Layers,
  Search,
  Navigation,
  School,
  Building2,
  Stethoscope,
  Landmark,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Map as MapIcon,
  Globe2
} from 'lucide-react';
import {
  BASEMAP_STYLES,
  BasemapStyleId,
  getReliableBasemapUrls,
} from '../config/carto';

export type MapNavigationLevel = 'national' | 'district' | 'upazila' | 'cadastral';

interface MapLibreDistrictExplorerProps {
  isBn: boolean;
  theme?: "dark" | "light";
  selectedDistrictId: string;
  onSelectDistrictId: (id: string) => void;
  onOpenDueDiligenceForParcel?: (parcel: CadastralParcelGeo) => void;
  selectedUpazilaId?: string | null;
  onSelectUpazilaId?: (id: string) => void;
  externalRouteOpen?: boolean;
  fullMapTrigger?: number;
}

export const MapLibreDistrictExplorer: React.FC<MapLibreDistrictExplorerProps> = ({
  isBn,
  theme = "light",
  selectedDistrictId,
  onSelectDistrictId,
  onOpenDueDiligenceForParcel,
  selectedUpazilaId,
  onSelectUpazilaId,
  externalRouteOpen,
  fullMapTrigger,
}) => {
  const isLight = theme === "light";
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);


  // Progressive Navigation Level
  const [currentLevel, setCurrentLevel] = useState<MapNavigationLevel>('district');
  const [selectedUpazila, setSelectedUpazila] = useState<UpazilaGeo | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<LocalPlace | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcelGeo | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Basemap style state (Clean unwatermarked tiles)
  const [basemapStyleId, setBasemapStyleId] = useState<BasemapStyleId>('osm');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState<boolean>(false);

  // Layer filters
  const [activeCategory, setActiveCategory] = useState<'all' | 'College' | 'Hospital' | 'Land Office' | 'Market'>('all');

  // Routing State
  const [routingOrigin, setRoutingOrigin] = useState<LocalPlace | null>(null);
  const [routingDestination, setRoutingDestination] = useState<LocalPlace | null>(null);
  const [activeRoute, setActiveRoute] = useState<OsrmRouteResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [isRouteDrawerOpen, setIsRouteDrawerOpen] = useState<boolean>(false);

  // Active district geo data
  const currentDistrictGeo = useMemo(() => {
    return getDistrictGeoData(selectedDistrictId);
  }, [selectedDistrictId]);

  // Reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const animationDuration = prefersReducedMotion ? 0 : 1400;

  // Handle Full Map trigger from parent
  useEffect(() => {
    if (!fullMapTrigger || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [90.3563, 23.6850], // Bangladesh National Center
      zoom: 6.8,
      duration: animationDuration,
      essential: true,
    });
    setCurrentLevel('national');
    setSelectedUpazila(null);
    setSelectedPlace(null);
    setSelectedParcel(null);
    setActiveRoute(null);
    setIsRouteDrawerOpen(false);
  }, [fullMapTrigger, animationDuration]);

  // Handle externalRouteOpen from parent
  useEffect(() => {
    if (externalRouteOpen !== undefined) {
      setIsRouteDrawerOpen(externalRouteOpen);
    }
  }, [externalRouteOpen]);

  /* ──────────────────────────────────────────────────────────
     1. INITIALIZE MAPLIBRE GL JS WITH RELIABLE HIGH-RES BASEMAP
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Define High-Resolution Basemap style (Zero Watermark)
    const mapStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'basemap-tiles': {
          type: 'raster',
          tiles: getReliableBasemapUrls(basemapStyleId),
          tileSize: 256,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; Esri',
        },
      },
      layers: [
        {
          id: 'basemap-layer',
          type: 'raster',
          source: 'basemap-tiles',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [currentDistrictGeo.center.lng, currentDistrictGeo.center.lat],
      zoom: 9.8,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      // Add GeoJSON sources for active route
      map.addSource('route-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Layer 1: Road Casing
      map.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#1E3A8A',
          'line-width': 7,
          'line-opacity': 0.8,
        },
      });

      // Layer 2: Glowing Navigation Blue Polyline
      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#2563EB',
          'line-width': 4.5,
          'line-opacity': 0.95,
        },
      });

      // Add Cadastral Parcels Source
      map.addSource('cadastral-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: currentDistrictGeo.cadastralParcels.map((p) => ({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [p.polygon],
            },
            properties: {
              id: p.id,
              dag: p.dagNumber,
              khatian: p.khatianNumber,
              mouza: p.mouzaName,
              landType: p.landType,
              area: p.areaKatha,
            },
          })),
        },
      });

      // Cadastral fill layer
      map.addLayer({
        id: 'cadastral-fill',
        type: 'fill',
        source: 'cadastral-source',
        paint: {
          'fill-color': '#F59E0B',
          'fill-opacity': 0.35,
        },
      });

      // Cadastral border layer
      map.addLayer({
        id: 'cadastral-border',
        type: 'line',
        source: 'cadastral-source',
        paint: {
          'line-color': '#B45309',
          'line-width': 2.5,
          'line-dasharray': [2, 1],
        },
      });
    });

    mapInstanceRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  /* ──────────────────────────────────────────────────────────
     2. FLY TO DISTRICT BOUNDS WHEN DISTRICT CHANGES
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setSelectedUpazila(null);
    setSelectedPlace(null);
    setSelectedParcel(null);
    setActiveRoute(null);
    setCurrentLevel('district');

    map.flyTo({
      center: [currentDistrictGeo.center.lng, currentDistrictGeo.center.lat],
      zoom: 10.2,
      duration: animationDuration,
      essential: true,
    });

    // Update cadastral layer data for new district
    if (map.getSource('cadastral-source')) {
      const src = map.getSource('cadastral-source') as maplibregl.GeoJSONSource;
      src.setData({
        type: 'FeatureCollection',
        features: currentDistrictGeo.cadastralParcels.map((p) => ({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [p.polygon],
          },
          properties: {
            id: p.id,
            dag: p.dagNumber,
            khatian: p.khatianNumber,
            mouza: p.mouzaName,
            landType: p.landType,
            area: p.areaKatha,
          },
        })),
      });
    }
  }, [currentDistrictGeo, animationDuration]);

  /* ──────────────────────────────────────────────────────────
     3. FLY TO UPAZILA (LEVEL 3)
  ────────────────────────────────────────────────────────── */
  const handleSelectUpazila = (upazila: UpazilaGeo) => {
    setSelectedUpazila(upazila);
    setCurrentLevel('upazila');
    setSelectedPlace(null);
    onSelectUpazilaId?.(upazila.id);

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo({
        center: [upazila.lng, upazila.lat],
        zoom: 13.2,
        duration: animationDuration,
        essential: true,
      });
    }
  };

  // Synchronize when selected externally from right-side panel
  useEffect(() => {
    if (selectedUpazilaId && currentDistrictGeo) {
      const upz = currentDistrictGeo.upazilas.find((u) => u.id === selectedUpazilaId);
      if (upz && selectedUpazila?.id !== upz.id) {
        handleSelectUpazila(upz);
      }
    }
  }, [selectedUpazilaId, currentDistrictGeo]);


  /* ──────────────────────────────────────────────────────────
     4. FLY TO CADASTRAL PLOT (LEVEL 4)
  ────────────────────────────────────────────────────────── */
  const handleSelectParcel = (parcel: CadastralParcelGeo) => {
    setSelectedParcel(parcel);
    setCurrentLevel('cadastral');

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo({
        center: [parcel.lng, parcel.lat],
        zoom: 16.5,
        duration: animationDuration,
        essential: true,
      });
    }
  };

  /* ──────────────────────────────────────────────────────────
     5. RESET / RETURN TO NATIONAL LEVEL (LEVEL 1)
  ────────────────────────────────────────────────────────── */
  const handleReturnToNational = () => {
    setCurrentLevel('national');
    setSelectedUpazila(null);
    setSelectedPlace(null);
    setSelectedParcel(null);

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo({
        center: [BANGLADESH_CENTER.lng, BANGLADESH_CENTER.lat],
        zoom: 6.8,
        duration: animationDuration,
        essential: true,
      });
    }
  };

  /* ──────────────────────────────────────────────────────────
     6. REAL OSRM ROUTE CALCULATION
  ────────────────────────────────────────────────────────── */
  const calculateRealRoute = async (origin: LocalPlace, destination: LocalPlace) => {
    setIsCalculatingRoute(true);
    setIsRouteDrawerOpen(true);

    try {
      const result = await fetchOsrmDrivingRoute(
        { lat: origin.lat, lng: origin.lng, name: origin.name },
        { lat: destination.lat, lng: destination.lng, name: destination.name }
      );

      setActiveRoute(result);

      const map = mapInstanceRef.current;
      if (map && result.success && result.geometry.length > 0) {
        // Render geometry on MapLibre source
        const src = map.getSource('route-source') as maplibregl.GeoJSONSource;
        if (src) {
          src.setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: result.geometry,
                },
                properties: {},
              },
            ],
          });
        }

        // Fit map bounds to frame the route
        const bounds = new maplibregl.LngLatBounds();
        for (const coord of result.geometry) {
          bounds.extend([coord[0], coord[1]]);
        }
        map.fitBounds(bounds, { padding: 80, duration: animationDuration });
      }
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleRouteToPlace = (destPlace: LocalPlace) => {
    // Pick the Upazila Centre or first college/hospital as default origin
    const defaultOrigin = currentDistrictGeo.localPlaces[0] || destPlace;
    setRoutingOrigin(defaultOrigin);
    setRoutingDestination(destPlace);
    calculateRealRoute(defaultOrigin, destPlace);
  };

  // Filtered places
  const displayedPlaces = useMemo(() => {
    if (activeCategory === 'all') return currentDistrictGeo.localPlaces;
    if (activeCategory === 'Land Office') {
      return currentDistrictGeo.localPlaces.filter((p) => p.category === 'Land Office' || p.category === 'Sub-Registry');
    }
    return currentDistrictGeo.localPlaces.filter((p) => p.category === activeCategory);
  }, [currentDistrictGeo, activeCategory]);

  /* ──────────────────────────────────────────────────────────
     2B. SYNCHRONIZE MAPLIBRE POI MARKERS WITH ACTIVE CATEGORY FILTER
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Create marker for each place in displayedPlaces
    displayedPlaces.forEach((place) => {
      const el = document.createElement('div');
      el.className = 'landwise-poi-marker-pin';
      el.style.cursor = 'pointer';

      let bg = '#10B981';
      let icon = '📍';

      if (place.category === 'Hospital') {
        bg = '#059669'; // Emerald-600 matching Hospitals filter
        icon = '🩺';
      } else if (place.category === 'College') {
        bg = '#2563EB'; // Blue for Education
        icon = '🎓';
      } else if (place.category === 'Land Office' || place.category === 'Sub-Registry') {
        bg = '#D97706'; // Amber for Land Offices
        icon = '🏛️';
      } else if (place.category === 'Market') {
        bg = '#7C3AED'; // Purple for Markets
        icon = '🛍️';
      }

      el.innerHTML = `
        <div style="
          background: ${bg};
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #FFFFFF;
          cursor: pointer;
          transform-origin: center;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        " onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'">
          ${icon}
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px 6px; min-width: 140px;">
          <div style="font-size: 10px; font-weight: 800; color: ${bg}; text-transform: uppercase; letter-spacing: 0.5px;">
            ${place.category}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #111827; margin: 2px 0; line-height: 1.2;">
            ${isBn ? place.bnName : place.name}
          </div>
          <div style="font-size: 11px; color: #4B5563;">
            ${place.address || ''}
          </div>
        </div>
      `);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedPlace(place);
        map.flyTo({
          center: [place.lng, place.lat],
          zoom: Math.max(map.getZoom(), 14.5),
          duration: 800,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([place.lng, place.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Auto-fit to filtered markers when user clicks a specific category
    if (activeCategory !== 'all' && displayedPlaces.length > 0) {
      if (displayedPlaces.length === 1) {
        map.flyTo({
          center: [displayedPlaces[0].lng, displayedPlaces[0].lat],
          zoom: 14.2,
          duration: animationDuration,
        });
      } else {
        const bounds = new maplibregl.LngLatBounds();
        displayedPlaces.forEach((p) => bounds.extend([p.lng, p.lat]));
        map.fitBounds(bounds, { padding: 90, maxZoom: 15, duration: animationDuration });
      }
    }
  }, [displayedPlaces, activeCategory, isBn, animationDuration]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border transition-colors flex flex-col ${
      isLight ? "border-zinc-200 bg-white text-zinc-900 shadow-sm" : "border-zinc-800 bg-[#09090B] text-white shadow-2xl"
    }`}>
      {/* ── TOP INTERACTIVE CONTROLS BAR & BREADCRUMBS ── */}
      <div className={`z-10 p-3 sm:p-4 backdrop-blur-md border-b flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
        isLight
          ? "bg-white/95 border-zinc-200 text-zinc-900 shadow-xs"
          : "bg-[#09090B]/90 border-zinc-800 text-white"
      }`}>
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleReturnToNational}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-xs ${
              currentLevel === 'national'
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200'
                : 'bg-[#18181B] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <span>🇧🇩</span>
            <span>{isBn ? 'বাংলাদেশ' : 'Bangladesh'}</span>
          </button>

          <ChevronRight size={13} className={isLight ? "text-zinc-400" : "text-zinc-500"} />

          <button
            onClick={() => {
              setCurrentLevel('district');
              setSelectedUpazila(null);
              setSelectedPlace(null);
              mapInstanceRef.current?.flyTo({
                center: [currentDistrictGeo.center.lng, currentDistrictGeo.center.lat],
                zoom: 10.2,
                duration: animationDuration,
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-xs ${
              currentLevel === 'district'
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200'
                : 'bg-[#18181B] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <MapPin size={12} className={isLight ? "text-amber-600" : "text-amber-400"} />
            <span>{isBn ? currentDistrictGeo.bnName : currentDistrictGeo.name} {isBn ? 'জেলা' : 'District'}</span>
          </button>

          {selectedUpazila && (
            <>
              <ChevronRight size={13} className={isLight ? "text-zinc-400" : "text-zinc-500"} />
              <button
                onClick={() => handleSelectUpazila(selectedUpazila)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-semibold shadow-xs ${
                  currentLevel === 'upazila'
                    ? 'bg-emerald-600 text-white'
                    : isLight
                    ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200'
                    : 'bg-[#18181B] text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <Building2 size={12} className={isLight ? "text-emerald-600" : "text-sky-400"} />
                <span>{isBn ? selectedUpazila.bnName : selectedUpazila.name}</span>
              </button>
            </>
          )}

          {selectedParcel && (
            <>
              <ChevronRight size={13} className={isLight ? "text-zinc-400" : "text-zinc-500"} />
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shadow-xs ${
                isLight
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-amber-600/90 text-white"
              }`}>
                <FileCheck2 size={12} className={isLight ? "text-amber-700" : "text-amber-200"} />
                <span>{isBn ? `দাগ নং ${selectedParcel.dagNumber}` : `Plot #${selectedParcel.dagNumber}`}</span>
              </span>
            </>
          )}
        </div>

        {/* Quick Level Badge & Layer Toggles */}
        <div className="flex items-center gap-2">
          <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${
            isLight
              ? "bg-zinc-100 border-zinc-200 text-zinc-700"
              : "bg-[#18181B] border-zinc-800 text-zinc-300"
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {currentLevel === 'national' && (isBn ? 'লেভেল ১: জাতীয় ওভারভিউ' : 'Level 1: National View')}
              {currentLevel === 'district' && (isBn ? 'লেভেল ২: জেলা ইনটেলিজেন্স' : 'Level 2: District Spatial')}
              {currentLevel === 'upazila' && (isBn ? 'লেভেল ৩: অবকাঠামো' : 'Level 3: Infrastructure')}
              {currentLevel === 'cadastral' && (isBn ? 'লেভেল ৪: ক্যাডাস্ট্রাল প্লট' : 'Level 4: Cadastral Survey')}
            </span>
          </div>

          {/* Active Vector GIS Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-mono border ${
              isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
            title="High-Resolution Vector GIS Engine • Zero Watermark"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">GIS:</span>
            <span>Online</span>
          </div>

          {/* Basemap Style Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all text-xs font-semibold shadow-xs ${
                isLight
                  ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800"
                  : "bg-[#18181B] hover:bg-zinc-800 border-zinc-800 text-zinc-200 hover:text-white"
              }`}
              title="Switch Basemap Style"
            >
              <i className="bx bx-layer text-sm text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{BASEMAP_STYLES.find((s) => s.id === basemapStyleId)?.name.split(' ')[0] || 'Basemap'}</span>
            </button>

            {isStyleMenuOpen && (
              <div className={`absolute top-full right-0 mt-1 w-64 rounded-xl border p-2 shadow-2xl backdrop-blur-xl z-30 space-y-1 ${
                isLight
                  ? "bg-white border-zinc-200 text-zinc-900"
                  : "bg-[#09090B]/95 border-zinc-800 text-white"
              }`}>
                <div className={`text-[10px] uppercase font-bold px-2 py-1 flex items-center justify-between ${
                  isLight ? "text-zinc-500" : "text-zinc-400"
                }`}>
                  <span>Basemap Layer</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[9px] font-mono">Unwatermarked</span>
                </div>
                {BASEMAP_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setBasemapStyleId(style.id);
                      setIsStyleMenuOpen(false);
                      const map = mapInstanceRef.current;
                      if (!map) return;
                      const newTiles = getReliableBasemapUrls(style.id);
                      if (map.getLayer('basemap-layer')) {
                        map.removeLayer('basemap-layer');
                      }
                      if (map.getSource('basemap-tiles')) {
                        map.removeSource('basemap-tiles');
                      }
                      map.addSource('basemap-tiles', {
                        type: 'raster',
                        tiles: newTiles,
                        tileSize: 256,
                        attribution:
                          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; Esri',
                      });
                      const beforeId = map.getLayer('route-casing') ? 'route-casing' : undefined;
                      map.addLayer(
                        {
                          id: 'basemap-layer',
                          type: 'raster',
                          source: 'basemap-tiles',
                          minzoom: 0,
                          maxzoom: 20,
                        },
                        beforeId
                      );
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex flex-col ${
                      basemapStyleId === style.id
                        ? isLight
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold"
                          : "bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-semibold"
                        : isLight
                        ? "text-zinc-700 hover:bg-zinc-100"
                        : "text-zinc-300 hover:bg-[#18181B] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{isBn ? style.labelBangla : style.name}</span>
                      {basemapStyleId === style.id && <span className="text-[10px] text-emerald-600 dark:text-emerald-400">✓</span>}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{style.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Route Drawer Button */}
          <button
            onClick={() => setIsRouteDrawerOpen(!isRouteDrawerOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-xs font-semibold ${
              activeRoute
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                : isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-800'
                : 'bg-[#18181B] border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Navigation size={13} className={activeRoute ? "text-white" : isLight ? "text-blue-600" : "text-blue-400"} />
            <span>{isBn ? 'সড়ক রুট' : 'OSRM Route'}</span>
          </button>
        </div>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div className="relative w-full h-[540px] sm:h-[620px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Category Filter Pills */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-sm">
          {[
            { id: 'all', label: isBn ? 'সকল স্থান' : 'All Places', icon: Layers, count: currentDistrictGeo.localPlaces.length },
            { id: 'College', label: isBn ? 'কলেজ/ভার্সিটি' : 'Colleges', icon: School, count: currentDistrictGeo.localPlaces.filter(p => p.category === 'College').length },
            { id: 'Hospital', label: isBn ? 'হাসপাতাল' : 'Hospitals', icon: Stethoscope, count: currentDistrictGeo.localPlaces.filter(p => p.category === 'Hospital').length },
            { id: 'Land Office', label: isBn ? 'ভূমি অফিস' : 'Land Offices', icon: Landmark, count: currentDistrictGeo.localPlaces.filter(p => p.category === 'Land Office' || p.category === 'Sub-Registry').length },
            { id: 'Market', label: isBn ? 'বাজার' : 'Markets', icon: ShoppingBag, count: currentDistrictGeo.localPlaces.filter(p => p.category === 'Market').length },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setSelectedPlace(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                    : isLight
                    ? 'bg-white/95 text-zinc-800 hover:bg-zinc-100 border border-zinc-300 shadow-sm'
                    : 'bg-[#09090B]/85 text-zinc-200 hover:bg-[#18181B] border border-zinc-700 shadow-md'
                }`}
              >
                <Icon size={12} className={isSelected ? "text-white" : isLight ? "text-emerald-600" : "text-emerald-400"} />
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 font-semibold'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Floating Right Map Controls (Zoom, Reset) */}
        <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
            className={`w-8 h-8 rounded-md shadow-md backdrop-blur-md flex items-center justify-center transition-colors border ${
              isLight
                ? "bg-white/95 hover:bg-zinc-100 text-zinc-800 border-zinc-300"
                : "bg-[#09090B]/90 hover:bg-[#18181B] text-white border-zinc-800"
            }`}
          >
            <i className="bx bx-plus text-base" aria-hidden="true" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
            className={`w-8 h-8 rounded-md shadow-md backdrop-blur-md flex items-center justify-center transition-colors border ${
              isLight
                ? "bg-white/95 hover:bg-zinc-100 text-zinc-800 border-zinc-300"
                : "bg-[#09090B]/90 hover:bg-[#18181B] text-white border-zinc-800"
            }`}
          >
            <i className="bx bx-minus text-base" aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              mapInstanceRef.current?.flyTo({
                center: [currentDistrictGeo.center.lng, currentDistrictGeo.center.lat],
                zoom: 10.2,
                duration: animationDuration,
              });
            }}
            title="Reset District View"
            className={`w-8 h-8 rounded-md shadow-md backdrop-blur-md flex items-center justify-center transition-colors border ${
              isLight
                ? "bg-white/95 hover:bg-zinc-100 text-emerald-600 border-zinc-300"
                : "bg-[#09090B]/90 hover:bg-[#18181B] text-emerald-400 border-zinc-800"
            }`}
          >
            <i className="bx bx-reset text-base" aria-hidden="true" />
          </button>
        </div>

        {/* ── SELECTED PLACE DETAIL POPUP CARD ── */}
        {selectedPlace && (
          <div className={`absolute top-[4.75rem] left-4 z-20 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border p-4 shadow-xl backdrop-blur-xl space-y-3 transition-colors ${
            isLight
              ? "bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-900/10"
              : "bg-[#09090B]/95 border-zinc-800 text-white shadow-2xl"
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLight
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}>
                  {selectedPlace.category}
                </span>
                <h4 className={`text-sm font-bold mt-1 leading-snug ${isLight ? "text-zinc-900" : "text-white"}`}>
                  {isBn ? selectedPlace.bnName : selectedPlace.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className={`p-1 rounded transition-colors ${isLight ? "text-zinc-400 hover:text-zinc-800" : "text-zinc-400 hover:text-white"}`}
              >
                ✕
              </button>
            </div>

            <div className={`text-xs space-y-1 ${isLight ? "text-zinc-600" : "text-zinc-300"}`}>
              <p className={isLight ? "text-zinc-600" : "text-zinc-400"}>{selectedPlace.address}</p>
              <div className="flex items-center gap-2 text-[11px] pt-1">
                <span className={isLight ? "text-zinc-500" : "text-zinc-400"}>Coordinates:</span>
                <span className={`font-mono font-medium ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                  {selectedPlace.lat.toFixed(4)}°N, {selectedPlace.lng.toFixed(4)}°E
                </span>
              </div>
              <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                <ShieldCheck size={12} className={isLight ? "text-blue-600" : "text-sky-400"} />
                <span>Source: {selectedPlace.source}</span>
              </div>
            </div>

            <button
              onClick={() => handleRouteToPlace(selectedPlace)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
            >
              <Navigation size={13} />
              <span>{isBn ? 'এখানে আসার সড়ক রুট দেখুন (OSRM)' : 'Get Directions to Here (OSRM)'}</span>
            </button>
          </div>
        )}

        {/* ── LEVEL 4: SELECTED CADASTRAL PARCEL MODAL CARD ── */}
        {selectedParcel && (
          <div className={`absolute top-16 left-4 z-20 w-88 max-w-[calc(100vw-2rem)] rounded-2xl border p-4 shadow-xl backdrop-blur-xl space-y-3 transition-colors ${
            isLight
              ? "bg-white/95 border-amber-300 text-zinc-900 shadow-zinc-900/10"
              : "bg-[#09090B]/95 border-amber-500/50 text-white shadow-2xl"
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isLight
                    ? "bg-amber-50 text-amber-900 border-amber-200"
                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                }`}>
                  {selectedParcel.surveyEdition} {isBn ? 'ক্যাডাস্ট্রাল জরিপ রেকর্ড' : 'Cadastral Survey Parcel'}
                </span>
                <h4 className={`text-sm font-bold mt-1 ${isLight ? "text-zinc-900" : "text-white"}`}>
                  {isBn ? `দাগ নং ${selectedParcel.dagNumber} • খতিয়ান ${selectedParcel.khatianNumber}` : `Plot #${selectedParcel.dagNumber} • Khatian ${selectedParcel.khatianNumber}`}
                </h4>
                <p className={`text-xs font-medium ${isLight ? "text-amber-800" : "text-amber-300"}`}>
                  {isBn ? selectedParcel.bnMouzaName : selectedParcel.mouzaName} (J.L. {selectedParcel.jlNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className={`p-1 rounded transition-colors ${isLight ? "text-zinc-400 hover:text-zinc-800" : "text-zinc-400 hover:text-white"}`}
              >
                ✕
              </button>
            </div>

            <div className={`grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl border ${
              isLight
                ? "bg-zinc-50 border-zinc-200 text-zinc-800"
                : "bg-[#18181B] border-zinc-800 text-zinc-200"
            }`}>
              <div>
                <span className={`text-[10px] block ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{isBn ? 'জমির শ্রেণি' : 'Land Type'}</span>
                <span className={`font-semibold ${isLight ? "text-zinc-900" : "text-zinc-200"}`}>
                  {isBn ? selectedParcel.bnLandType : selectedParcel.landType}
                </span>
              </div>
              <div>
                <span className={`text-[10px] block ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{isBn ? 'পরিমাপ' : 'Area Area'}</span>
                <span className={`font-semibold ${isLight ? "text-zinc-900" : "text-zinc-200"}`}>
                  {selectedParcel.areaKatha} {isBn ? 'কাঠা' : 'Katha'} ({selectedParcel.areaDecimals} dec)
                </span>
              </div>
              <div className={`col-span-2 pt-1 border-t ${isLight ? "border-zinc-200" : "border-zinc-800/60"}`}>
                <span className={`text-[10px] block ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>{isBn ? 'আইনি স্ট্যাটাস' : 'Title Status'}</span>
                <span className={`font-semibold flex items-center gap-1 ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                  <ShieldCheck size={12} />
                  <span>{selectedParcel.status}</span>
                </span>
              </div>
            </div>

            {/* Direct CTA to Records & Title Graph */}
            <button
              onClick={() => {
                if (onOpenDueDiligenceForParcel) {
                  onOpenDueDiligenceForParcel(selectedParcel);
                } else {
                  const el = document.getElementById('due-diligence');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <i className="bx bx-git-repo-forked text-sm" aria-hidden="true" />
              <span>{isBn ? 'টাইটেল গ্রাফ ও অডিটে এই প্লটটি খুলুন' : 'Open in Title & Spatial Graph'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── OSRM ROUTE NAVIGATOR DRAWER (EXPANDABLE) ── */}
      {isRouteDrawerOpen && (
        <div className={`p-4 border-t space-y-3 transition-colors ${
          isLight
            ? "bg-zinc-50 border-zinc-200 text-zinc-900"
            : "bg-[#09090B] border-zinc-800 text-white"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={15} className={isLight ? "text-blue-600" : "text-blue-400"} />
              <h4 className={`text-xs sm:text-sm font-bold ${isLight ? "text-zinc-900" : "text-white"}`}>
                {isBn ? 'গুগল ম্যাপস রোড নেটওয়ার্ক নেভিগেটর (OSRM)' : 'Google Maps Highway Route Navigator (OSRM)'}
              </h4>
            </div>
            <button
              onClick={() => setIsRouteDrawerOpen(false)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                isLight
                  ? "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  : "bg-[#18181B] border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {isBn ? 'লুকান' : 'Hide'}
            </button>
          </div>

          {/* Origin & Destination Dropdown Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className={`block font-semibold ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                {isBn ? 'শুরুর স্থান (Origin):' : 'Origin:'}
              </label>
              <select
                value={routingOrigin?.id || ''}
                onChange={(e) => {
                  const place = currentDistrictGeo.localPlaces.find((p) => p.id === e.target.value);
                  if (place) {
                    setRoutingOrigin(place);
                    if (routingDestination) calculateRealRoute(place, routingDestination);
                  }
                }}
                className={`w-full min-w-0 truncate p-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                  isLight
                    ? "bg-white border-zinc-300 text-zinc-900"
                    : "bg-[#18181B] border-zinc-800 text-white"
                }`}
              >
                {currentDistrictGeo.localPlaces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isBn ? p.bnName : p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className={`block font-semibold ${isLight ? "text-zinc-700" : "text-zinc-400"}`}>
                {isBn ? 'গন্তব্য (Destination):' : 'Destination:'}
              </label>
              <select
                value={routingDestination?.id || ''}
                onChange={(e) => {
                  const place = currentDistrictGeo.localPlaces.find((p) => p.id === e.target.value);
                  if (place) {
                    setRoutingDestination(place);
                    if (routingOrigin) calculateRealRoute(routingOrigin, place);
                  }
                }}
                className={`w-full min-w-0 truncate p-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium ${
                  isLight
                    ? "bg-white border-zinc-300 text-zinc-900"
                    : "bg-[#18181B] border-zinc-800 text-white"
                }`}
              >
                {currentDistrictGeo.localPlaces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isBn ? p.bnName : p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Route Summary & Turn by Turn Guidance */}
          {isCalculatingRoute ? (
            <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs ${
              isLight
                ? "bg-white border-zinc-200 text-blue-600"
                : "bg-[#18181B] border-zinc-800 text-blue-400"
            }`}>
              <span className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></span>
              <span>{isBn ? 'OSRM রোড নেটওয়ার্ক থেকে ড্রাইভ রুট গণনা করা হচ্ছে...' : 'Querying OSRM road network for authentic route...'}</span>
            </div>
          ) : activeRoute ? (
            activeRoute.success ? (
              <div className={`p-3 rounded-xl border space-y-2 text-xs ${
                isLight
                  ? "bg-blue-50/80 border-blue-200 text-zinc-800"
                  : "bg-blue-950/40 border-blue-800/60 text-white"
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-black font-mono ${isLight ? "text-blue-900" : "text-white"}`}>
                      {activeRoute.distanceKm} <span className={`text-xs font-normal ${isLight ? "text-zinc-600" : "text-zinc-300"}`}>km</span>
                    </span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                      <Clock size={13} />
                      <span>~{activeRoute.durationMinutes} {isBn ? 'মিনিট' : 'mins'}</span>
                    </span>
                  </div>
                  <span className={`text-[11px] font-medium ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                    {isBn ? activeRoute.bnRoadSummary : activeRoute.roadSummary}
                  </span>
                </div>

                {/* Step by step maneuvers */}
                <div className={`pt-2 border-t max-h-32 overflow-y-auto space-y-1 scrollbar-thin ${
                  isLight ? "border-blue-200" : "border-blue-900/50"
                }`}>
                  {activeRoute.steps.map((step, idx) => (
                    <div key={idx} className={`flex items-start gap-2 text-[11px] ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold ${
                        isLight ? "bg-blue-100 text-blue-700" : "bg-blue-600/30 text-blue-400"
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{isBn ? step.bnInstruction : step.instruction}</span>
                      <span className={`ml-auto font-mono text-[10px] shrink-0 ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                        {step.distanceKm} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                isLight
                  ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-rose-950/40 border-rose-800/60 text-rose-300"
              }`}>
                <AlertTriangle size={15} className={`shrink-0 mt-0.5 ${isLight ? "text-rose-600" : "text-rose-400"}`} />
                <div>
                  <p className="font-semibold">{isBn ? 'সড়ক রুট পাওয়া যায়নি' : 'No Road Route Available'}</p>
                  <p className={`text-[11px] mt-0.5 ${isLight ? "text-rose-700" : "text-rose-400"}`}>
                    {isBn ? activeRoute.bnErrorMessage : activeRoute.errorMessage}
                  </p>
                </div>
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};
