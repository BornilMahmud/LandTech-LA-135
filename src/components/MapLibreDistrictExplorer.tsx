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

export type MapNavigationLevel = 'national' | 'district' | 'upazila' | 'cadastral';

interface MapLibreDistrictExplorerProps {
  isBn: boolean;
  selectedDistrictId: string;
  onSelectDistrictId: (id: string) => void;
  onOpenDueDiligenceForParcel?: (parcel: CadastralParcelGeo) => void;
}

export const MapLibreDistrictExplorer: React.FC<MapLibreDistrictExplorerProps> = ({
  isBn,
  selectedDistrictId,
  onSelectDistrictId,
  onOpenDueDiligenceForParcel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  // Progressive Navigation Level
  const [currentLevel, setCurrentLevel] = useState<MapNavigationLevel>('district');
  const [selectedUpazila, setSelectedUpazila] = useState<UpazilaGeo | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<LocalPlace | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcelGeo | null>(null);

  // Basemap style: Voyager (Google Maps clean aesthetic) vs Satellite/Hybrid
  const [mapStyleType, setMapStyleType] = useState<'voyager' | 'osm' | 'satellite'>('voyager');

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

  /* ──────────────────────────────────────────────────────────
     1. INITIALIZE MAPLIBRE GL JS
  ────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Define CartoDB Voyager style (modern Google Maps style, high contrast, clean vector fonts)
    const mapStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'voyager-tiles': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      },
      layers: [
        {
          id: 'voyager-layer',
          type: 'raster',
          source: 'voyager-tiles',
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
    return currentDistrictGeo.localPlaces.filter((p) => p.category === activeCategory);
  }, [currentDistrictGeo, activeCategory]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
      {/* ── TOP INTERACTIVE CONTROLS BAR & BREADCRUMBS ── */}
      <div className="z-10 p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleReturnToNational}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-semibold ${
              currentLevel === 'national'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>🇧🇩</span>
            <span>{isBn ? 'বাংলাদেশ' : 'Bangladesh'}</span>
          </button>

          <ChevronRight size={13} className="text-slate-500" />

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
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-semibold ${
              currentLevel === 'district'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <MapPin size={12} className="text-amber-400" />
            <span>{isBn ? currentDistrictGeo.bnName : currentDistrictGeo.name} {isBn ? 'জেলা' : 'District'}</span>
          </button>

          {selectedUpazila && (
            <>
              <ChevronRight size={13} className="text-slate-500" />
              <button
                onClick={() => handleSelectUpazila(selectedUpazila)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-semibold ${
                  currentLevel === 'upazila'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Building2 size={12} className="text-sky-400" />
                <span>{isBn ? selectedUpazila.bnName : selectedUpazila.name}</span>
              </button>
            </>
          )}

          {selectedParcel && (
            <>
              <ChevronRight size={13} className="text-slate-500" />
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600/90 text-white font-semibold">
                <FileCheck2 size={12} className="text-amber-200" />
                <span>{isBn ? `দাগ নং ${selectedParcel.dagNumber}` : `Plot #${selectedParcel.dagNumber}`}</span>
              </span>
            </>
          )}
        </div>

        {/* Quick Level Badge & Layer Toggles */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {currentLevel === 'national' && (isBn ? 'লেভেল ১: জাতীয় ওভারভিউ' : 'Level 1: National View')}
              {currentLevel === 'district' && (isBn ? 'লেভেল ২: জেলা ইনটেলিজেন্স' : 'Level 2: District Spatial')}
              {currentLevel === 'upazila' && (isBn ? 'লেভেল ৩: উপজেলা ও অবকাঠামো' : 'Level 3: Infrastructure')}
              {currentLevel === 'cadastral' && (isBn ? 'লেভেল ৪: ক্যাডাস্ট্রাল প্লট' : 'Level 4: Cadastral Survey')}
            </span>
          </div>

          {/* Quick Route Drawer Button */}
          <button
            onClick={() => setIsRouteDrawerOpen(!isRouteDrawerOpen)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all ${
              activeRoute
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Navigation size={13} />
            <span className="font-semibold">{isBn ? 'সড়ক রুট' : 'OSRM Route'}</span>
          </button>
        </div>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div className="relative w-full h-[540px] sm:h-[620px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Category Filter Pills */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-sm">
          {[
            { id: 'all', label: isBn ? 'সকল স্থান' : 'All Places', icon: Layers },
            { id: 'College', label: isBn ? 'কলেজ/ভার্সিটি' : 'Colleges', icon: School },
            { id: 'Hospital', label: isBn ? 'হাসপাতাল' : 'Hospitals', icon: Stethoscope },
            { id: 'Land Office', label: isBn ? 'ভূমি অফিস' : 'Land Offices', icon: Landmark },
            { id: 'Market', label: isBn ? 'বাজার' : 'Markets', icon: ShoppingBag },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <Icon size={12} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Floating Right Map Controls (Zoom, Reset, Compass) */}
        <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-lg backdrop-blur-md"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-lg backdrop-blur-md"
          >
            <ZoomOut size={16} />
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
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-slate-700 shadow-lg backdrop-blur-md"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* ── LEVEL 2: SELECTABLE UPAZILAS CAROUSEL STRIP (BOTTOM) ── */}
        <div className="absolute bottom-4 left-4 right-16 z-10 overflow-x-auto scrollbar-none flex gap-2 pb-1">
          {currentDistrictGeo.upazilas.map((upz) => {
            const isSelected = selectedUpazila?.id === upz.id;
            return (
              <button
                key={upz.id}
                onClick={() => handleSelectUpazila(upz)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30 scale-105'
                    : 'bg-slate-900/85 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Building2 size={12} className={isSelected ? 'text-white' : 'text-emerald-400'} />
                <span>{isBn ? upz.bnName : upz.name}</span>
                {upz.pourashava && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {isBn ? 'পৌর' : 'Mun'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── SELECTED PLACE DETAIL POPUP CARD ── */}
        {selectedPlace && (
          <div className="absolute top-16 left-4 z-20 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900/95 border border-slate-700/80 p-4 shadow-2xl backdrop-blur-xl text-white space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedPlace.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                  {isBn ? selectedPlace.bnName : selectedPlace.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p className="text-slate-400">{selectedPlace.address}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <span>Coordinates:</span>
                <span className="font-mono text-emerald-400">
                  {selectedPlace.lat.toFixed(4)}°N, {selectedPlace.lng.toFixed(4)}°E
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck size={12} className="text-sky-400" />
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
          <div className="absolute top-16 left-4 z-20 w-88 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900/95 border border-amber-500/50 p-4 shadow-2xl backdrop-blur-xl text-white space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {selectedParcel.surveyEdition} {isBn ? 'ক্যাডাস্ট্রাল জরিপ রেকর্ড' : 'Cadastral Survey Parcel'}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {isBn ? `দাগ নং ${selectedParcel.dagNumber} • খতিয়ান ${selectedParcel.khatianNumber}` : `Plot #${selectedParcel.dagNumber} • Khatian ${selectedParcel.khatianNumber}`}
                </h4>
                <p className="text-xs text-amber-300 font-medium">
                  {isBn ? selectedParcel.bnMouzaName : selectedParcel.mouzaName} (J.L. {selectedParcel.jlNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
              <div>
                <span className="text-slate-400 text-[10px] block">{isBn ? 'জমির শ্রেণি' : 'Land Type'}</span>
                <span className="font-semibold text-slate-200">
                  {isBn ? selectedParcel.bnLandType : selectedParcel.landType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">{isBn ? 'পরিমাপ' : 'Area Area'}</span>
                <span className="font-semibold text-slate-200">
                  {selectedParcel.areaKatha} {isBn ? 'কাঠা' : 'Katha'} ({selectedParcel.areaDecimals} dec)
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-700/60">
                <span className="text-slate-400 text-[10px] block">{isBn ? 'আইনি স্ট্যাটাস' : 'Title Status'}</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>{selectedParcel.status}</span>
                </span>
              </div>
            </div>

            {/* Direct CTA to Due-Diligence Workspace */}
            <button
              onClick={() => {
                if (onOpenDueDiligenceForParcel) {
                  onOpenDueDiligenceForParcel(selectedParcel);
                } else {
                  const el = document.getElementById('due-diligence');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-amber-600/20 transition-all"
            >
              <FileCheck2 size={14} />
              <span>{isBn ? 'ডিউ-ডিলিজেন্স অডিটে এই প্লটটি খুলুন' : 'Open in Due-Diligence Workspace'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── OSRM ROUTE NAVIGATOR DRAWER (EXPANDABLE) ── */}
      {isRouteDrawerOpen && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={15} className="text-blue-400" />
              <h4 className="text-xs sm:text-sm font-bold">
                {isBn ? 'গুগল ম্যাপস রোড নেটওয়ার্ক নেভিগেটর (OSRM)' : 'Google Maps Highway Route Navigator (OSRM)'}
              </h4>
            </div>
            <button
              onClick={() => setIsRouteDrawerOpen(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              {isBn ? 'লুকান' : 'Hide'}
            </button>
          </div>

          {/* Origin & Destination Dropdown Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 block font-semibold">{isBn ? 'শুরুর স্থান (Origin):' : 'Origin:'}</label>
              <select
                value={routingOrigin?.id || ''}
                onChange={(e) => {
                  const place = currentDistrictGeo.localPlaces.find((p) => p.id === e.target.value);
                  if (place) {
                    setRoutingOrigin(place);
                    if (routingDestination) calculateRealRoute(place, routingDestination);
                  }
                }}
                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentDistrictGeo.localPlaces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isBn ? p.bnName : p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 block font-semibold">{isBn ? 'গন্তব্য (Destination):' : 'Destination:'}</label>
              <select
                value={routingDestination?.id || ''}
                onChange={(e) => {
                  const place = currentDistrictGeo.localPlaces.find((p) => p.id === e.target.value);
                  if (place) {
                    setRoutingDestination(place);
                    if (routingOrigin) calculateRealRoute(routingOrigin, place);
                  }
                }}
                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center gap-2 text-xs text-blue-400">
              <span className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></span>
              <span>{isBn ? 'OSRM রোড নেটওয়ার্ক থেকে ড্রাইভ রুট গণনা করা হচ্ছে...' : 'Querying OSRM road network for authentic route...'}</span>
            </div>
          ) : activeRoute ? (
            activeRoute.success ? (
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-white font-mono">
                      {activeRoute.distanceKm} <span className="text-xs font-normal text-slate-300">km</span>
                    </span>
                    <span className="text-sm font-bold text-blue-400 flex items-center gap-1">
                      <Clock size={13} />
                      <span>~{activeRoute.durationMinutes} {isBn ? 'মিনিট' : 'mins'}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {isBn ? activeRoute.bnRoadSummary : activeRoute.roadSummary}
                  </span>
                </div>

                {/* Step by step maneuvers */}
                <div className="pt-2 border-t border-blue-900/50 max-h-32 overflow-y-auto space-y-1 scrollbar-thin">
                  {activeRoute.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{isBn ? step.bnInstruction : step.instruction}</span>
                      <span className="ml-auto text-slate-400 font-mono text-[10px] shrink-0">
                        {step.distanceKm} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-2 text-xs text-rose-300">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-semibold">{isBn ? 'সড়ক রুট পাওয়া যায়নি' : 'No Road Route Available'}</p>
                  <p className="text-[11px] text-rose-400 mt-0.5">
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
