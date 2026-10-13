import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Sparkles,
  Search,
  Eye,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Navigation,
  Satellite,
  GraduationCap,
  Building2,
  Activity,
  ArrowRight,
  School,
  Building,
  X,
  ExternalLink,
  Route,
  ArrowUpDown,
  Clock,
  Car,
} from 'lucide-react';
import districtsGeoData from '../data/bangladeshDistrictsGeo.json';
import {
  BANGLADESH_DIVISIONS,
  ALL_BANGLADESH_DISTRICTS,
  BANGLADESH_FLOWS,
  DivisionData,
  DistrictData,
} from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';
import {
  getDistrictIntelligence,
  searchIntelligence,
  SearchResultItem,
} from '../data/districtIntelligence';
import {
  generateDistrictPOIs,
  generateDistrictRoads,
  calculateRouteDirections,
  getDistrictAreaSummary,
  filterPOIsByCategory,
  DistrictPOI,
  DistrictRoad,
  RouteDirections,
  POICategory,
} from '../utils/districtPoiGenerator';

interface BangladeshInteractiveMapProps {
  isBn: boolean;
  theme: "light" | "reference" | "emerald" | "atlas" | "midnight";
  setTheme: (t: "light" | "reference" | "emerald" | "atlas" | "midnight") => void;
  selectedDistrict: DistrictData | null;
  onSelectDistrict: (district: DistrictData) => void;
  selectedDivision: DivisionData | null;
  onSelectDivision: (division: DivisionData) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const BangladeshInteractiveMap: React.FC<BangladeshInteractiveMapProps> = ({
  isBn,
  theme,
  setTheme,
  selectedDistrict,
  onSelectDistrict,
  selectedDivision,
  onSelectDivision,
  searchQuery,
  setSearchQuery,
}) => {
  const [mapMode, setMapMode] = useState<"districts" | "atlas" | "satellite">("districts");
  const [showLabels, setShowLabels] = useState(true);
  const [showFlows, setShowFlows] = useState(true);
  const [colorByViability, setColorByViability] = useState(false);

  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // POI Layer states
  const [activeLayerFilter, setActiveLayerFilter] = useState<'all' | 'upazila' | 'pourashava' | 'college' | 'school' | 'hospital'>('all');
  const [selectedPOI, setSelectedPOI] = useState<DistrictPOI | null>(null);
  const [hoveredPOI, setHoveredPOI] = useState<DistrictPOI | null>(null);

  // Route Navigation Mode states ("route soho")
  const [isRouteMode, setIsRouteMode] = useState<boolean>(false);
  const [routeFromId, setRouteFromId] = useState<string>('');
  const [routeToId, setRouteToId] = useState<string>('');

  // Hover states
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [hoveredDivision, setHoveredDivision] = useState<DivisionData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Corridor Animation
  const [activeFlowIdx, setActiveFlowIdx] = useState(0);

  const mapSvgRef = useRef<SVGSVGElement | null>(null);

  // Flow animation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFlowIdx((prev) => (prev + 1) % BANGLADESH_FLOWS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Quick lookup table for district GEO shapes
  const geoLookup = useMemo(() => {
    const map = new Map<string, (typeof districtsGeoData.districts)[0]>();
    districtsGeoData.districts.forEach((geo) => map.set(geo.id, geo));
    return map;
  }, []);

  // Search Dropdown Focus state
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Unified Search across 64 districts, upazilas, institutions, hospitals, and tourism
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    return searchIntelligence(searchQuery).slice(0, 8);
  }, [searchQuery]);

  // Selected Geo Object
  const selectedGeo = useMemo(() => {
    if (!selectedDistrict) return null;
    return geoLookup.get(selectedDistrict.id) || null;
  }, [selectedDistrict, geoLookup]);

  // Determine if currently in zoomed-in district mode
  const isDistrictZoomed = useMemo(() => {
    return Boolean(selectedDistrict && zoomLevel >= 1.8);
  }, [selectedDistrict, zoomLevel]);

  // District Area Metrics
  const districtAreaSummary = useMemo(() => {
    if (!selectedDistrict) return null;
    return getDistrictAreaSummary(selectedDistrict.id);
  }, [selectedDistrict]);

  // All POIs for currently selected district using real boundary bounds
  const allDistrictPOIs = useMemo(() => {
    if (!selectedDistrict) return [];
    const geo = geoLookup.get(selectedDistrict.id);
    const centroid = geo ? (geo.centroid as [number, number]) : ([300, 436] as [number, number]);
    return generateDistrictPOIs(selectedDistrict.id, centroid, geo?.path);
  }, [selectedDistrict, geoLookup]);

  // Filtered POIs based on active layer tab
  const visiblePOIs = useMemo(() => {
    return filterPOIsByCategory(allDistrictPOIs, activeLayerFilter);
  }, [allDistrictPOIs, activeLayerFilter]);

  // Road Network for current district
  const districtRoads = useMemo(() => {
    if (!selectedDistrict || allDistrictPOIs.length < 2) return [];
    return generateDistrictRoads(selectedDistrict.id, allDistrictPOIs);
  }, [selectedDistrict, allDistrictPOIs]);

  // Auto-initialize route origin (Sadar) and destination when entering route mode
  useEffect(() => {
    if (isRouteMode && allDistrictPOIs.length > 1) {
      const sadar = allDistrictPOIs.find((p) => p.isHub) || allDistrictPOIs[0];
      const otherPOIs = allDistrictPOIs.filter((p) => p.id !== sadar.id && p.category === 'upazila');
      const defaultDest = otherPOIs[0] || allDistrictPOIs[1];
      if (!routeFromId) setRouteFromId(sadar.id);
      if (!routeToId) setRouteToId(defaultDest.id);
    }
  }, [isRouteMode, allDistrictPOIs]);

  // Active Route Calculation
  const activeRoute = useMemo(() => {
    if (!isRouteMode || !routeFromId || !routeToId || routeFromId === routeToId) return null;
    const fromPOI = allDistrictPOIs.find((p) => p.id === routeFromId);
    const toPOI = allDistrictPOIs.find((p) => p.id === routeToId);
    if (!fromPOI || !toPOI) return null;
    return calculateRouteDirections(fromPOI, toPOI, districtRoads);
  }, [isRouteMode, routeFromId, routeToId, allDistrictPOIs, districtRoads]);

  // Handle "Directions to here" from a POI
  const handleDirectionsToPOI = (destPOI: DistrictPOI) => {
    const sadar = allDistrictPOIs.find((p) => p.isHub) || allDistrictPOIs[0];
    setRouteFromId(sadar.id);
    setRouteToId(destPOI.id);
    setIsRouteMode(true);
    setSelectedPOI(null);
  };

  // Smooth Zoom to District Centroid
  const zoomToDistrict = (districtId: string) => {
    const geo = geoLookup.get(districtId);
    if (!geo) return;
    const [cx, cy] = geo.centroid;
    const containerH = mapSvgRef.current?.parentElement?.clientHeight || 620;
    const svgScale = Math.min(containerH, 660) / 872;
    const targetZoom = 3.25;

    // Center [cx, cy] in the viewport
    const targetPanX = (300 - cx) * svgScale * targetZoom;
    const targetPanY = (436 - cy) * svgScale * targetZoom;

    setZoomLevel(targetZoom);
    setPanOffset({ x: targetPanX, y: targetPanY });
    setSelectedPOI(null);
  };

  // District Click Handler
  const handleDistrictClick = (dst: DistrictData) => {
    onSelectDistrict(dst);
    const parentDiv = BANGLADESH_DIVISIONS.find((d) => d.id === dst.divisionId);
    if (parentDiv) onSelectDivision(parentDiv);
    zoomToDistrict(dst.id);
  };

  // Reset Zoom
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedPOI(null);
    setIsRouteMode(false);
  };

  // Theme styling definitions
  const themeStyles = useMemo(() => {
    switch (theme) {
      case "light":
        return {
          bg: "#F8FAFC",
          border: "#E2E8F0",
          landDefault: "#E2E8F0",
          landHover: "#10B981",
          landSelected: "#F59E0B",
          stroke: "#CBD5E1",
          selectedStroke: "#0F172A",
          waterColor: "#E0F2FE",
          waterText: "#0284C7",
        };
      case "emerald":
        return {
          bg: "#062319",
          border: "#0F6B4F",
          landDefault: "#0B4D36",
          landHover: "#10B981",
          landSelected: "#F59E0B",
          stroke: "#031F16",
          selectedStroke: "#FFFFFF",
          waterColor: "#021A12",
          waterText: "#0F6B4F",
        };
      case "midnight":
        return {
          bg: "#0A0F1D",
          border: "#1E293B",
          landDefault: "#1E293B",
          landHover: "#3B82F6",
          landSelected: "#10B981",
          stroke: "#0F172A",
          selectedStroke: "#38BDF8",
          waterColor: "#060A14",
          waterText: "#475569",
        };
      case "atlas":
        return {
          bg: "#10192A",
          border: "#334155",
          landDefault: "#2A3A52",
          landHover: "#FDE047",
          landSelected: "#E9A53A",
          stroke: "#0F172A",
          selectedStroke: "#FFFFFF",
          waterColor: "#0B111F",
          waterText: "#38BDF8",
        };
      default: // reference authentic multi-color
        return {
          bg: "#0B1526",
          border: "#20344E",
          landDefault: "#D4C2A5",
          landHover: "#FFE066",
          landSelected: "#E9A53A",
          stroke: "#2A3A4E",
          selectedStroke: "#000000",
          waterColor: "#091424",
          waterText: "#38BDF8",
        };
    }
  }, [theme]);

  // Color mapping helper for 8 Divisions in Atlas mode
  const getAtlasDivColor = (divId: string) => {
    const map: Record<string, string> = {
      rangpur: "#86EFAC",
      rajshahi: "#6EE7B7",
      mymensingh: "#93C5FD",
      sylhet: "#FDE047",
      dhaka: "#FDBA74",
      khulna: "#A7F3D0",
      barishal: "#FCA5A5",
      chittagong: "#C4B5FD",
    };
    return map[divId] || "#D4C2A5";
  };

  // Pan and Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mapMode === "satellite") return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (mapMode === "satellite") return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.35 : -0.35;
    setZoomLevel((prev) => Math.max(0.75, Math.min(4.5, Number((prev + delta).toFixed(2)))));
  };

  // Google Maps Satellite URL for Bangladesh center or active district
  const googleMapsUrl = useMemo(() => {
    const query = selectedDistrict ? `${selectedDistrict.name}, Bangladesh` : "Bangladesh";
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&t=k&z=${selectedDistrict ? 11 : 7}&output=embed`;
  }, [selectedDistrict]);

  return (
    <div
      className={`relative w-full rounded-2xl border shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl transition-colors duration-200 ${
        theme === "light"
          ? "bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50"
          : "bg-slate-950/80 border-slate-700/80 text-slate-100"
      }`}
    >
      {/* ── TOP CONTROL BAR ── */}
      <div
        className={`flex flex-wrap items-center justify-between p-3 sm:p-4 border-b gap-3 z-10 transition-colors ${
          theme === "light"
            ? "bg-slate-50/90 border-slate-200 text-slate-800"
            : "bg-slate-900/90 border-slate-800 text-slate-100"
        }`}
      >
        {/* Left: Map Layer Mode Toggles */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border ${
            theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-950/90 border-slate-800"
          }`}
        >
          <button
            type="button"
            onClick={() => setMapMode("districts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === "districts"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : theme === "light"
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <MapPin size={13} />
            <span>{isBn ? "৬৪ জেলা মানচিত্র" : "64 Districts"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode("atlas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === "atlas"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : theme === "light"
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers size={13} />
            <span>{isBn ? "৮ প্রশাসনিক বিভাগ" : "8 Divisions"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode("satellite")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapMode === "satellite"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : theme === "light"
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Satellite size={13} />
            <span>{isBn ? "স্যাটেলাইট ভিউ" : "Satellite"}</span>
          </button>
        </div>

        {/* Center: Search & Quick Find with Omnibox Intelligence */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              theme === "light" ? "text-slate-400" : "text-slate-400"
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isBn ? "জেলা, উপজেলা, শিক্ষাপ্রতিষ্ঠান খুঁজুন..." : "Search 64 districts, upazila, POI..."
            }
            className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-emerald-500 ${
              theme === "light"
                ? "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm"
                : "bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
            }`}
          />

          {/* Unified Intelligence Search Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div
              className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-2xl p-1 z-50 max-h-72 overflow-y-auto ${
                theme === "light"
                  ? "bg-white border-slate-200 text-slate-800"
                  : "bg-slate-900 border-slate-700 text-slate-100"
              }`}
            >
              <div
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider flex justify-between border-b ${
                  theme === "light" ? "text-slate-400 border-slate-100" : "text-slate-400 border-slate-800"
                }`}
              >
                <span>{isBn ? "অনুসন্ধান ফলাফল" : "Search Results"}</span>
                <span className="text-emerald-500 font-semibold">
                  {searchResults.length} {isBn ? "পাওয়া গেছে" : "found"}
                </span>
              </div>
              {searchResults.map((item) => {
                const targetDistrict = ALL_BANGLADESH_DISTRICTS.find((d) => d.id === item.districtId);
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (targetDistrict) {
                        onSelectDistrict(targetDistrict);
                        zoomToDistrict(targetDistrict.id);
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition ${
                      theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                        {item.type === 'district' ? (
                          <MapPin size={12} />
                        ) : item.type === 'upazila' ? (
                          <Navigation size={12} />
                        ) : item.type === 'institution' ? (
                          <GraduationCap size={12} />
                        ) : item.type === 'hospital' ? (
                          <Activity size={12} />
                        ) : (
                          <Compass size={12} />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate">
                          {isBn && item.bnTitle ? item.bnTitle : item.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{item.details}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        theme === "light" ? "bg-slate-100 text-slate-600" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Map View Switches (Labels, Heatmap, Flows) */}
        <div className="flex items-center gap-2">
          {mapMode !== "satellite" && (
            <>
              <button
                type="button"
                onClick={() => setShowLabels((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                  showLabels
                    ? theme === "light"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold"
                      : "bg-slate-800 border-emerald-500/40 text-emerald-400"
                    : theme === "light"
                    ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
                title="Toggle District Labels"
              >
                <Eye size={12} />
                <span className="hidden sm:inline">{isBn ? "লেবেল" : "Labels"}</span>
              </button>

              <button
                type="button"
                onClick={() => setColorByViability((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                  colorByViability
                    ? theme === "light"
                      ? "bg-amber-50 border-amber-500 text-amber-700 font-bold"
                      : "bg-slate-800 border-amber-500/40 text-amber-400"
                    : theme === "light"
                    ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
                title="Color code by Land Viability Score"
              >
                <SlidersHorizontal size={12} />
                <span className="hidden sm:inline">{isBn ? "মূল্যায়ন হিটম্যাপ" : "Viability Index"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFlows((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                  showFlows
                    ? theme === "light"
                      ? "bg-teal-50 border-teal-500 text-teal-700 font-bold"
                      : "bg-slate-800 border-teal-500/40 text-teal-400"
                    : theme === "light"
                    ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
                title="Toggle Economic Corridors"
              >
                <Navigation size={12} />
                <span className="hidden sm:inline">{isBn ? "করিডোর" : "Corridors"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MAP CANVAS CONTAINER ── */}
      <div
        className="relative w-full h-[520px] sm:h-[620px] lg:h-[680px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ backgroundColor: themeStyles.bg }}
        onWheel={handleWheel}
      >
        {/* Floating Zoom Controls */}
        {mapMode !== "satellite" && (
          <div
            className={`absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl border backdrop-blur-md shadow-xl ${
              theme === "light"
                ? "bg-white/95 border-slate-200 shadow-slate-200/60"
                : "bg-slate-900/90 border-slate-700/80"
            }`}
          >
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.4, 4.2))}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200"
              }`}
              aria-label="Zoom In"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 0.4, 0.75))}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200"
              }`}
              aria-label="Zoom Out"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  : "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200"
              }`}
              aria-label="Reset Zoom"
              title="Reset View to Full Bangladesh Map"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}

        {/* Floating Compass Badge */}
        <div
          className={`absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md text-[11px] ${
            theme === "light"
              ? "bg-white/95 border-slate-200 text-slate-700 shadow-sm"
              : "bg-slate-900/80 border-slate-700/60 text-slate-300"
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
          <span>
            {isDistrictZoomed
              ? isBn
                ? `${selectedDistrict?.bnName} জেলা • রোড রুট ও জিআইএস`
                : `${selectedDistrict?.name} District • Highway GIS`
              : isBn
              ? "উচ্চ-নির্ভুল ভেক্টর মানচিত্র"
              : "High-Precision Vector GIS"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* 1. SATELLITE GOOGLE MAP VIEW */}
        {mapMode === "satellite" && (
          <div className="w-full h-full relative">
            <iframe
              src={googleMapsUrl}
              title="Bangladesh Satellite View"
              className="w-full h-full border-0"
              loading="lazy"
            />
            <div
              className={`absolute bottom-4 left-4 z-20 px-3 py-2 rounded-xl border text-xs backdrop-blur-md ${
                theme === "light"
                  ? "bg-white/95 border-slate-200 text-slate-700 shadow-md"
                  : "bg-slate-900/90 border-slate-700 text-slate-300"
              }`}
            >
              <span className={`font-bold ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                {selectedDistrict
                  ? isBn
                    ? selectedDistrict.bnName
                    : selectedDistrict.name
                  : isBn
                  ? "সারাদেশ"
                  : "Bangladesh"}
              </span>
              <span className="text-slate-400 ml-2">Satellite Layer Live</span>
            </div>
          </div>
        )}

        {/* 2. 64-DISTRICT SELECTABLE VECTOR MAP WITH SMOOTH ZOOM, HIGHWAYS & MULTI-LAYER POIS */}
        {mapMode === "districts" && (
          <svg
            ref={mapSvgRef}
            viewBox="0 0 600 872"
            className="w-full h-full max-h-[660px] select-none"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <defs>
              <filter id="dist-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#10B981" floodOpacity="0.6" />
              </filter>
              <filter id="dist-glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="7" floodColor="#F59E0B" floodOpacity="0.85" />
              </filter>
              <filter id="dist-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
              </filter>
              <filter id="poi-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0.8" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.5" />
              </filter>
              <filter id="area-badge-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#10B981" floodOpacity="0.7" />
              </filter>
              <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#3B82F6" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Bay of Bengal stylized wash */}
            <path
              d="M 0,660 C 175,690 360,680 600,735 L 600,872 L 0,872 Z"
              fill={themeStyles.waterColor}
              opacity={isDistrictZoomed ? 0.35 : 0.85}
              className="transition-opacity duration-500"
            />
            <text
              x="300"
              y="810"
              fontSize="16"
              fontWeight="900"
              fill={themeStyles.waterText}
              letterSpacing="8"
              textAnchor="middle"
              opacity={isDistrictZoomed ? 0.2 : 0.5}
              className="transition-opacity duration-500 select-none pointer-events-none"
            >
              ব ঙ্গো প সা গ র
            </text>

            {/* ── ALL 64 INTERACTIVE DISTRICT POLYGONS ── */}
            <g id="districts-layer">
              {districtsGeoData.districts.map((geo) => {
                const dst = ALL_BANGLADESH_DISTRICTS.find((d) => d.id === geo.id);
                if (!dst) return null;

                const isHovered = hoveredDistrict?.id === dst.id;
                const isSelected = selectedDistrict?.id === dst.id;
                const landMeta = getDistrictLandData(dst.id);

                // When zoomed in, dim other 63 districts so the clicked district stands out sharply
                const districtOpacity = isDistrictZoomed ? (isSelected ? 1 : 0.28) : 1;

                // Color calculation
                let fillColor = (geo as any).color || "#D4C2A5";
                if (theme === "emerald") {
                  fillColor = isSelected
                    ? themeStyles.landSelected
                    : isHovered
                    ? themeStyles.landHover
                    : themeStyles.landDefault;
                } else if (theme === "midnight") {
                  fillColor = isSelected
                    ? themeStyles.landSelected
                    : isHovered
                    ? themeStyles.landHover
                    : themeStyles.landDefault;
                } else if (theme === "atlas") {
                  fillColor = isSelected
                    ? "#F59E0B"
                    : isHovered
                    ? "#FDE047"
                    : getAtlasDivColor(dst.divisionId);
                } else if (theme === "light") {
                  fillColor = isSelected
                    ? "#F59E0B"
                    : isHovered
                    ? "#10B981"
                    : (geo as any).color || "#E2E8F0";
                } else {
                  // Authentic reference colors
                  fillColor = isSelected
                    ? "#F59E0B"
                    : isHovered
                    ? "#FEE08B"
                    : (geo as any).color || "#D4C2A5";
                }

                if (colorByViability && !isSelected) {
                  if (landMeta.viabilityScore >= 90) fillColor = "#10B981";
                  else if (landMeta.viabilityScore >= 85) fillColor = "#38BDF8";
                  else if (landMeta.viabilityScore >= 80) fillColor = "#FBBF24";
                  else fillColor = "#FB7185";
                }

                const strokeColor = isSelected
                  ? theme === "light"
                    ? "#0F172A"
                    : "#FFFFFF"
                  : isHovered
                  ? "#0284C7"
                  : themeStyles.stroke;

                const strokeWidth = isSelected
                  ? isDistrictZoomed
                    ? 1.8
                    : 2.5
                  : isHovered
                  ? 1.5
                  : 0.8;

                return (
                  <g
                    key={dst.id}
                    id={`dst-${dst.id}`}
                    opacity={districtOpacity}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.4s ease-out, transform 0.18s ease-out",
                      transform: !isDistrictZoomed && (isHovered || isSelected) ? "scale(1.02)" : "scale(1)",
                      transformOrigin: `${geo.centroid[0]}px ${geo.centroid[1]}px`,
                    }}
                    onMouseEnter={() => {
                      if (!isDistrictZoomed) {
                        setHoveredDistrict(dst);
                        const rect = mapSvgRef.current?.getBoundingClientRect();
                        if (rect) {
                          setTooltipPos({
                            x: (geo.centroid[0] / 600) * rect.width,
                            y: (geo.centroid[1] / 872) * rect.height,
                          });
                        }
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isDistrictZoomed) {
                        setHoveredDistrict(null);
                        setTooltipPos(null);
                      }
                    }}
                    onClick={() => handleDistrictClick(dst)}
                  >
                    <path
                      d={geo.path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter={
                        isSelected
                          ? "url(#dist-glow-selected)"
                          : isHovered
                          ? "url(#dist-glow)"
                          : "url(#dist-shadow)"
                      }
                      className="transition-colors duration-150"
                    />

                    {/* Capital Pin for Dhaka */}
                    {dst.isCapital && !isDistrictZoomed && (
                      <g className="pointer-events-none">
                        <circle
                          cx={geo.centroid[0]}
                          cy={geo.centroid[1]}
                          r={7}
                          fill="#EF4444"
                          opacity="0.3"
                          className="animate-ping"
                        />
                        <circle
                          cx={geo.centroid[0]}
                          cy={geo.centroid[1]}
                          r={4.5}
                          fill="#EF4444"
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                        />
                      </g>
                    )}

                    {/* Division HQ indicator */}
                    {dst.isDivisionHQ && !dst.isCapital && !isDistrictZoomed && (
                      <circle
                        cx={geo.centroid[0]}
                        cy={geo.centroid[1]}
                        r={3.2}
                        fill="#0284C7"
                        stroke="#FFFFFF"
                        strokeWidth={1.2}
                        className="pointer-events-none"
                      />
                    )}

                    {/* District Name Label (When Nationwide) */}
                    {showLabels && !isDistrictZoomed && (
                      <text
                        x={geo.centroid[0]}
                        y={geo.centroid[1] + (dst.isCapital ? 9 : 4)}
                        textAnchor="middle"
                        fontSize={
                          dst.isCapital
                            ? isBn
                              ? "8.5"
                              : "8"
                            : dst.isDivisionHQ
                            ? isBn
                              ? "7.5"
                              : "7"
                            : isBn
                            ? "6.2"
                            : "5.8"
                        }
                        fontWeight={dst.isCapital || dst.isDivisionHQ ? "800" : "600"}
                        fill={
                          isSelected
                            ? theme === "light"
                              ? "#0F172A"
                              : "#FFFFFF"
                            : theme === "midnight" || theme === "emerald"
                            ? "#FFFFFF"
                            : "#0F172A"
                        }
                        className="pointer-events-none select-none"
                        style={{
                          fontFamily: isBn ? "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" : "inherit",
                          letterSpacing: isBn ? "0px" : "-0.01em",
                          textShadow:
                            theme === "reference"
                              ? "0 1px 2px rgba(255,255,255,0.9)"
                              : "0 1px 3px rgba(0,0,0,0.85)",
                        }}
                      >
                        {isBn ? dst.bnName : dst.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* ── Active Economic Corridors & Transport Flows ── */}
            {showFlows &&
              !isDistrictZoomed &&
              BANGLADESH_FLOWS.map((f, idx) => {
                const fromGeo = geoLookup.get(f.fromDistrictId);
                const toGeo = geoLookup.get(f.toDistrictId);
                if (!fromGeo || !toGeo) return null;
                const isActive = idx === activeFlowIdx;
                const x1 = fromGeo.centroid[0];
                const y1 = fromGeo.centroid[1];
                const x2 = toGeo.centroid[0];
                const y2 = toGeo.centroid[1];
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2 - 25;
                const color = isActive ? "#10B981" : "#38BDF8";

                return (
                  <g key={f.id} className="pointer-events-none">
                    <path
                      d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={isActive ? 3 : 1.2}
                      strokeDasharray={isActive ? "none" : "3 3"}
                      opacity={isActive ? 0.95 : 0.4}
                    />
                    {isActive && (
                      <circle r="4" fill="#F59E0B">
                        <animateMotion
                          path={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

            {/* ── HIGHWAY & ROAD NETWORK ("route soho" - GOOGLE MAPS STYLE) ── */}
            {isDistrictZoomed && districtRoads.length > 0 && (
              <g id="district-roads-layer" className="transition-opacity duration-500 ease-out">
                {/* 1. Base Road Bed (Road Casing) */}
                {districtRoads.map((road) => (
                  <path
                    key={`bed-${road.id}`}
                    d={road.path}
                    fill="none"
                    stroke={activeRoute ? "#E2E8F0" : "#CBD5E1"}
                    strokeWidth={road.type === 'national' ? 3.0 : 2.0}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={activeRoute ? 0.35 : 0.85}
                  />
                ))}

                {/* 2. Arterial Road Surface (Google Maps Highway Yellow / White) */}
                {districtRoads.map((road) => {
                  const isNational = road.type === 'national';
                  return (
                    <path
                      key={`surface-${road.id}`}
                      d={road.path}
                      fill="none"
                      stroke={isNational ? "#FDE047" : "#FFFFFF"}
                      strokeWidth={isNational ? 2.0 : 1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={activeRoute ? 0.3 : 0.95}
                    />
                  );
                })}

                {/* 3. Highway Route Badges along road midpoints */}
                {!activeRoute &&
                  districtRoads.slice(0, 4).map((road) => (
                    <g
                      key={`badge-${road.id}`}
                      transform={`translate(${road.midCoord[0]}, ${road.midCoord[1]})`}
                      className="pointer-events-none select-none"
                      filter="url(#poi-shadow)"
                    >
                      <rect
                        x="-7.5"
                        y="-3.5"
                        width="15"
                        height="7"
                        rx="1.8"
                        fill="#0F172A"
                        stroke="#FDE047"
                        strokeWidth="0.6"
                      />
                      <text
                        x="0"
                        y="1.3"
                        textAnchor="middle"
                        fontSize="2.4"
                        fontWeight="900"
                        fill="#FDE047"
                        className="font-mono"
                      >
                        {road.code}
                      </text>
                    </g>
                  ))}

                {/* 4. Active Navigation Route Line (Google Maps Blue Navigation) */}
                {activeRoute && (
                  <g id="active-navigation-route" className="animate-in fade-in duration-300">
                    {/* Glowing Route Casing */}
                    <path
                      d={activeRoute.path}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.4"
                      filter="url(#route-glow)"
                    />
                    {/* Main Blue Polyline */}
                    <path
                      d={activeRoute.path}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Animated Moving Transit Vehicle / Dot */}
                    <circle r="3.0" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="1.2" filter="url(#poi-shadow)">
                      <animateMotion path={activeRoute.path} dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle r="1.4" fill="#38BDF8">
                      <animateMotion path={activeRoute.path} dur="3.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Start Point A Badge */}
                    <g transform={`translate(${activeRoute.fromPOI.x}, ${activeRoute.fromPOI.y})`}>
                      <circle r="4.8" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" filter="url(#poi-shadow)" />
                      <text x="0" y="1.5" textAnchor="middle" fontSize="3.2" fontWeight="900" fill="#FFFFFF">
                        A
                      </text>
                    </g>

                    {/* Destination Point B Badge */}
                    <g transform={`translate(${activeRoute.toPOI.x}, ${activeRoute.toPOI.y})`}>
                      <circle r="4.8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" filter="url(#poi-shadow)" />
                      <text x="0" y="1.5" textAnchor="middle" fontSize="3.2" fontWeight="900" fill="#FFFFFF">
                        B
                      </text>
                    </g>
                  </g>
                )}
              </g>
            )}

            {/* ── DISTRICT LOCAL INFRASTRUCTURE LAYER (ZOOMED IN: CLEAN GOOGLE MAPS PIN SPACING) ── */}
            {isDistrictZoomed && selectedDistrict && selectedGeo && (
              <g id="district-poi-layer" className="transition-opacity duration-500 ease-out">
                {/* Centroid Area Banner badge right above the district */}
                {districtAreaSummary && !activeRoute && (
                  <g
                    transform={`translate(${selectedGeo.centroid[0]}, ${selectedGeo.centroid[1] - 12})`}
                    className="pointer-events-none select-none"
                    filter="url(#area-badge-glow)"
                  >
                    <rect
                      x="-48"
                      y="-5"
                      width="96"
                      height="10"
                      rx="3.5"
                      fill={theme === "light" ? "rgba(15, 23, 42, 0.92)" : "rgba(2, 6, 23, 0.95)"}
                      stroke="#10B981"
                      strokeWidth="0.6"
                    />
                    <text
                      x="0"
                      y="1.8"
                      textAnchor="middle"
                      fontSize="3.1"
                      fontWeight="800"
                      fill="#34D399"
                      className="font-mono"
                    >
                      {isBn
                        ? `📐 আয়তন: ${districtAreaSummary.areaSqKm} কিমি² (${districtAreaSummary.areaAcres.toLocaleString()} একর)`
                        : `📐 Area: ${districtAreaSummary.areaSqKm} km² (${districtAreaSummary.areaAcres.toLocaleString()} acres)`}
                    </text>
                  </g>
                )}

                {/* Render filtered POIs */}
                {visiblePOIs.map((poi) => {
                  const isUpazila = poi.category === 'upazila';
                  const isPoiHovered = hoveredPOI?.id === poi.id;
                  const isPoiSelected = selectedPOI?.id === poi.id;
                  const isCategoryFiltered = activeLayerFilter !== 'all';

                  // Only show full label pill if:
                  // 1) It's an upazila town center, OR
                  // 2) Hovered/Selected by user, OR
                  // 3) Filtered by that specific layer (keeps the map uncluttered like Google Maps!)
                  const shouldShowLabel = isUpazila || isPoiHovered || isPoiSelected || isCategoryFiltered;

                  // Color styling per category
                  let badgeColor = "#4F46E5"; // Upazila Indigo
                  if (poi.category === "pourashava") {
                    badgeColor = "#D97706"; // Amber
                  } else if (poi.category === "college") {
                    badgeColor = "#0284C7"; // Sky
                  } else if (poi.category === "school") {
                    badgeColor = "#059669"; // Emerald
                  } else if (poi.category === "hospital") {
                    badgeColor = "#DC2626"; // Red
                  }

                  const labelText = isBn ? poi.bnName : poi.name;
                  const displayLabel = labelText.length > 20 ? labelText.slice(0, 18) + "…" : labelText;
                  const labelW = Math.max(18, displayLabel.length * 2.1);

                  return (
                    <g
                      key={poi.id}
                      className="cursor-pointer group select-none"
                      style={{
                        transition: "transform 0.15s ease-out",
                        transformOrigin: `${poi.x}px ${poi.y}px`,
                        transform: isPoiHovered || isPoiSelected ? "scale(1.35)" : "scale(1)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPOI(poi);
                      }}
                      onMouseEnter={() => setHoveredPOI(poi)}
                      onMouseLeave={() => setHoveredPOI(null)}
                    >
                      {/* Pulse ring for selected POI */}
                      {isPoiSelected && (
                        <circle
                          cx={poi.x}
                          cy={poi.y}
                          r="6.5"
                          fill={badgeColor}
                          opacity="0.35"
                          className="animate-ping"
                        />
                      )}

                      {/* Marker Anchor Pin Circle */}
                      <circle
                        cx={poi.x}
                        cy={poi.y}
                        r={isUpazila ? 3.4 : 2.7}
                        fill={badgeColor}
                        stroke="#FFFFFF"
                        strokeWidth="0.75"
                        filter="url(#poi-shadow)"
                      />
                      <circle cx={poi.x} cy={poi.y} r={isUpazila ? 1.3 : 0.9} fill="#FFFFFF" />

                      {/* Conditionally rendered label pill (clean & non-overlapping) */}
                      {shouldShowLabel && (
                        <g transform={`translate(${poi.x}, ${poi.y - (isUpazila ? 4.8 : 4.2)})`}>
                          <rect
                            x={-labelW / 2}
                            y="-4.2"
                            width={labelW}
                            height="4.8"
                            rx="1.4"
                            fill={
                              isPoiSelected
                                ? badgeColor
                                : theme === "light"
                                ? "rgba(255, 255, 255, 0.96)"
                                : "rgba(15, 23, 42, 0.95)"
                            }
                            stroke={isPoiSelected ? "#FFFFFF" : badgeColor}
                            strokeWidth="0.5"
                            filter="url(#poi-shadow)"
                          />
                          <text
                            x="0"
                            y="-1"
                            textAnchor="middle"
                            fontSize="2.4"
                            fontWeight={isUpazila || isPoiSelected ? "800" : "600"}
                            fill={
                              isPoiSelected
                                ? "#FFFFFF"
                                : theme === "light"
                                ? "#0F172A"
                                : "#F8FAFC"
                            }
                            className="pointer-events-none select-none font-sans"
                          >
                            {displayLabel}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        )}

        {/* 3. 8-DIVISION VECTOR ATLAS MAP */}
        {mapMode === "atlas" && (
          <svg
            viewBox="0 0 1200 1664"
            className="w-full h-full max-h-[660px] transition-transform duration-75 ease-out select-none"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 8 Divisions Vector Rendering */}
            {BANGLADESH_DIVISIONS.map((div) => {
              const isHovered = hoveredDivision?.id === div.id;
              const isSelected = selectedDivision?.id === div.id;

              const fillColor = isSelected
                ? "#F59E0B"
                : isHovered
                ? "#FDE047"
                : div.fillColor;

              return (
                <g
                  key={div.id}
                  onClick={() => {
                    onSelectDivision(div);
                    const capitalDistrict = ALL_BANGLADESH_DISTRICTS.find((d) => d.id === div.hubDistrictId);
                    if (capitalDistrict) onSelectDistrict(capitalDistrict);
                  }}
                  onMouseEnter={() => setHoveredDivision(div)}
                  onMouseLeave={() => setHoveredDivision(null)}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d={div.path}
                    fill={fillColor}
                    stroke={isSelected ? "#FFFFFF" : "#0E3837"}
                    strokeWidth={isSelected ? 5 : 2.5}
                    className="transition-colors duration-150"
                  />
                  {div.linesPath && (
                    <path
                      d={div.linesPath}
                      fill="none"
                      stroke="#0E3837"
                      strokeWidth={1}
                      opacity={0.3}
                    />
                  )}

                  {/* Division Name Label */}
                  <text
                    x={div.center.x * 2}
                    y={div.center.y * 2}
                    textAnchor="middle"
                    fontSize="28"
                    fontWeight="900"
                    fill="#0F172A"
                    className="pointer-events-none select-none font-bold"
                    style={{
                      fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "inherit",
                    }}
                  >
                    {isBn ? div.bnName : div.name}
                  </text>
                  <text
                    x={div.center.x * 2}
                    y={div.center.y * 2 + 26}
                    textAnchor="middle"
                    fontSize="18"
                    fontWeight="700"
                    fill="#15803D"
                    className="pointer-events-none select-none"
                  >
                    {div.districtsCount} {isBn ? "জেলা" : "Districts"}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* ── GOOGLE MAPS ROUTE DIRECTIONS CARD ("route soho") ── */}
        {isRouteMode && activeRoute && (
          <div
            className={`absolute top-4 left-4 sm:left-6 z-30 w-80 sm:w-96 rounded-2xl p-4 backdrop-blur-xl border shadow-2xl animate-in fade-in slide-in-from-top-4 ${
              theme === "light"
                ? "bg-white/95 border-blue-500/40 text-slate-900 shadow-slate-300/80"
                : "bg-slate-900/95 border-blue-500/40 text-slate-100 shadow-black/90"
            }`}
          >
            {/* Route Header */}
            <div className="flex items-center justify-between border-b pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Route size={16} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm leading-none flex items-center gap-1.5">
                    <span>{isBn ? "গুগল ম্যাপস নেভিগেশন রুট" : "Route Navigator"}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {activeRoute.highwayCode}
                    </span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {isBn ? "সড়ক যোগাযোগ ও ড্রাইভ সময়সূচী" : "Direct Highway Driving Corridor"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRouteMode(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Exit Route Mode"
              >
                <X size={15} />
              </button>
            </div>

            {/* Origin & Destination Selectors */}
            <div className="space-y-2 mb-3">
              {/* Origin (A) */}
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                  A
                </span>
                <select
                  value={routeFromId}
                  onChange={(e) => setRouteFromId(e.target.value)}
                  className={`flex-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-200 text-slate-800"
                      : "bg-slate-800 border-slate-700 text-slate-200"
                  }`}
                >
                  {allDistrictPOIs.map((p) => (
                    <option key={`from-${p.id}`} value={p.id}>
                      {isBn ? p.bnName : p.name} ({isBn ? p.badge : p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center -my-1">
                <button
                  type="button"
                  onClick={() => {
                    const temp = routeFromId;
                    setRouteFromId(routeToId);
                    setRouteToId(temp);
                  }}
                  className={`p-1 rounded-full border transition hover:scale-110 ${
                    theme === "light"
                      ? "bg-white border-slate-200 text-slate-500"
                      : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                  title="Reverse directions"
                >
                  <ArrowUpDown size={12} />
                </button>
              </div>

              {/* Destination (B) */}
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                  B
                </span>
                <select
                  value={routeToId}
                  onChange={(e) => setRouteToId(e.target.value)}
                  className={`flex-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-200 text-slate-800"
                      : "bg-slate-800 border-slate-700 text-slate-200"
                  }`}
                >
                  {allDistrictPOIs.map((p) => (
                    <option key={`to-${p.id}`} value={p.id}>
                      {isBn ? p.bnName : p.name} ({isBn ? p.badge : p.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Route Stats Strip */}
            <div
              className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${
                theme === "light"
                  ? "bg-blue-50/70 border-blue-200 text-blue-900"
                  : "bg-blue-950/40 border-blue-800/60 text-blue-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500 shrink-0" />
                <div>
                  <div className="font-heading font-black text-sm leading-tight text-blue-600 dark:text-blue-400">
                    {activeRoute.durationMinutes} {isBn ? "মিনিট" : "mins"}
                  </div>
                  <div className="text-[10px] opacity-75">
                    {isBn ? "হাইওয়েতে দ্রুততম পথ" : "Fastest highway route"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-black text-sm text-slate-800 dark:text-slate-100">
                  {activeRoute.distanceKm} km
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[130px]">
                  {activeRoute.highwayCode}
                </div>
              </div>
            </div>

            {/* Turn-by-Turn Steps */}
            <div className="space-y-1.5 text-[11px] max-h-32 overflow-y-auto pr-1">
              {(isBn ? activeRoute.bnSteps : activeRoute.steps).map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="text-blue-500 font-bold shrink-0">{sIdx + 1}.</span>
                  <span className="leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DYNAMIC HOVER TOOLTIP (WHEN NATIONWIDE) ── */}
        {!isDistrictZoomed && hoveredDistrict && tooltipPos && (() => {
          const intel = getDistrictIntelligence(hoveredDistrict.id);
          const landMeta = getDistrictLandData(hoveredDistrict.id);
          return (
            <div
              className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${Math.max(140, Math.min(tooltipPos.x, (mapSvgRef.current?.clientWidth || 500) - 140))}px`,
                top: `${Math.max(90, tooltipPos.y)}px`,
              }}
            >
              <div
                className={`rounded-2xl p-3.5 shadow-2xl backdrop-blur-md min-w-[250px] max-w-[290px] text-xs border transition-all ${
                  theme === "light"
                    ? "bg-white/95 border-emerald-500/40 text-slate-800 shadow-slate-300/40"
                    : "bg-slate-900/95 border-emerald-500/50 text-slate-200"
                }`}
              >
                {/* Header: Name and Division */}
                <div
                  className={`flex items-center justify-between gap-2 border-b pb-2 mb-2 ${
                    theme === "light" ? "border-slate-200" : "border-slate-700/80"
                  }`}
                >
                  <div>
                    <span
                      className={`font-black text-sm block leading-tight ${
                        theme === "light" ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {isBn ? hoveredDistrict.bnName : hoveredDistrict.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isBn ? `${hoveredDistrict.name} District` : `${hoveredDistrict.bnName} জেলা`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                    {isBn ? `${hoveredDistrict.bnDivisionName} বিভাগ` : `${hoveredDistrict.divisionName} Div`}
                  </span>
                </div>

                {/* Key Statistics */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isBn ? "প্রশাসনিক একক:" : "Administrative:"}
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {intel.upazilas.length} {isBn ? "উপজেলা" : "Upazilas"} • {intel.pourashavasCount}{" "}
                      {isBn ? "পৌরসভা" : "Paurashavas"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isBn ? "প্রতিষ্ঠান ও স্বাস্থ্য:" : "Institutions:"}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {intel.universitiesCount + intel.collegesCount} {isBn ? "কলেজ/ভার্সিটি" : "Higher Edu"} •{" "}
                      {intel.hospitalsCount} {isBn ? "হাসপাতাল" : "Hospitals"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isBn ? "ভূমি দর ও লিস্টিং:" : "Land Rate & Sale:"}
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      ৳{(landMeta.avgPricePerKathaBDT / 100000).toFixed(1)}L/{isBn ? "কাঠা" : "Katha"} •{" "}
                      {intel.landListingsCount} {isBn ? "বিক্রয়যোগ্য" : "Listings"}
                    </span>
                  </div>
                </div>

                {/* Footer Prompt */}
                <div
                  className={`mt-2 pt-1.5 border-t text-[10px] flex items-center justify-between font-semibold ${
                    theme === "light" ? "border-slate-200 text-emerald-600" : "border-slate-800 text-emerald-400"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>{isBn ? "স্মুথ জুম ইন ও রোডের জন্য ক্লিক করুন" : "Click to Smooth Zoom & Routes"}</span>
                  </div>
                  <ArrowRight size={11} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── DISTRICT EXPLORATION HUD (WHEN ZOOMED IN ON A DISTRICT) ── */}
        {isDistrictZoomed && selectedDistrict && districtAreaSummary && (
          <div
            className={`absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-xl z-20 rounded-2xl p-3 sm:p-4 backdrop-blur-xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              theme === "light"
                ? "bg-white/95 border-emerald-500/30 text-slate-900 shadow-slate-300/60"
                : "bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-black/80"
            }`}
          >
            {/* Header row: District title + area + route toggle + reset zoom */}
            <div className="flex items-center justify-between gap-3 border-b pb-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-black text-sm sm:text-base leading-none">
                      {isBn ? selectedDistrict.bnName : selectedDistrict.name} {isBn ? "জেলা" : "District"}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {isBn ? selectedDistrict.bnDivisionName : selectedDistrict.divisionName} {isBn ? "বিভাগ" : "Div"}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span>📐 {isBn ? "আয়তন:" : "Area:"}</span>
                    <strong>{districtAreaSummary.areaSqKm} {isBn ? "বর্গ কিমি" : "sq km"}</strong>
                    <span className="text-slate-400">•</span>
                    <span>{districtAreaSummary.areaAcres.toLocaleString()} {isBn ? "একর" : "acres"}</span>
                    <span className="text-slate-400">•</span>
                    <span>{districtAreaSummary.areaBighas.toLocaleString()} {isBn ? "বিঘা" : "bighas"}</span>
                  </span>
                </div>
              </div>

              {/* Action buttons: Directions & Reset Zoom */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRouteMode((prev) => !prev)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isRouteMode
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : theme === "light"
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                      : "bg-blue-950/60 text-blue-300 hover:bg-blue-900/60 border border-blue-800"
                  }`}
                  title="Toggle Route Navigator"
                >
                  <Route size={13} />
                  <span className="hidden sm:inline">{isBn ? "রুট ও হাইওয়ে" : "Routes"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
                  title="Zoom Out to Full Bangladesh Map"
                >
                  <RotateCcw size={12} />
                  <span className="hidden sm:inline">{isBn ? "সারাদেশ" : "Full Map"}</span>
                </button>
              </div>
            </div>

            {/* Key Stats Strip */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2.5 text-center text-[10px]">
              <div
                className={`p-1.5 rounded-lg border ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-800/60 border-slate-700"
                }`}
              >
                <div className="text-slate-400">{isBn ? "উপজেলা" : "Upazilas"}</div>
                <div className="font-black text-xs text-indigo-500">{districtAreaSummary.upazilasCount}</div>
              </div>
              <div
                className={`p-1.5 rounded-lg border ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-800/60 border-slate-700"
                }`}
              >
                <div className="text-slate-400">{isBn ? "পৌরসভা" : "Pourashavas"}</div>
                <div className="font-black text-xs text-amber-500">{districtAreaSummary.pourashavasCount}</div>
              </div>
              <div
                className={`p-1.5 rounded-lg border ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-800/60 border-slate-700"
                }`}
              >
                <div className="text-slate-400">{isBn ? "কলেজ/ভার্সিটি" : "Colleges"}</div>
                <div className="font-black text-xs text-sky-500">
                  {districtAreaSummary.collegesCount + districtAreaSummary.universitiesCount}
                </div>
              </div>
              <div
                className={`p-1.5 rounded-lg border ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-800/60 border-slate-700"
                }`}
              >
                <div className="text-slate-400">{isBn ? "হাসপাতাল" : "Hospitals"}</div>
                <div className="font-black text-xs text-rose-500">{districtAreaSummary.hospitalsCount}</div>
              </div>
            </div>

            {/* Layer Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-0.5">
                {isBn ? "ফিল্টার:" : "Filter:"}
              </span>
              {[
                { id: "all", label: isBn ? "সবগুলো" : "All", icon: "🔘", count: allDistrictPOIs.length },
                { id: "upazila", label: isBn ? "উপজেলা" : "Upazilas", icon: "🏛️", count: districtAreaSummary.upazilasCount },
                { id: "pourashava", label: isBn ? "পৌরসভা" : "Pourashavas", icon: "🏢", count: districtAreaSummary.pourashavasCount },
                { id: "college", label: isBn ? "কলেজ" : "Colleges", icon: "🎓", count: districtAreaSummary.collegesCount },
                { id: "school", label: isBn ? "স্কুল" : "Schools", icon: "🏫", count: districtAreaSummary.schoolsCount },
                { id: "hospital", label: isBn ? "হাসপাতাল" : "Hospitals", icon: "🏥", count: districtAreaSummary.hospitalsCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLayerFilter(tab.id as any)}
                  className={`px-2 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                    activeLayerFilter === tab.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : theme === "light"
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SELECTED POI DETAIL CARD (FLOATING GOOGLE MAPS STYLE) ── */}
        {selectedPOI && !isRouteMode && (
          <div
            className={`absolute top-16 left-4 sm:left-6 z-30 max-w-xs sm:max-w-sm rounded-2xl p-4 backdrop-blur-xl border shadow-2xl animate-in fade-in zoom-in-95 ${
              theme === "light"
                ? "bg-white/95 border-emerald-500/40 text-slate-900 shadow-slate-300/80"
                : "bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-black/90"
            }`}
          >
            <div className="flex items-start justify-between gap-2 border-b pb-2 mb-2.5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedPOI.category === "upazila"
                        ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                        : selectedPOI.category === "pourashava"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : selectedPOI.category === "college"
                        ? "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                        : selectedPOI.category === "school"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}
                  >
                    {isBn ? selectedPOI.badge : selectedPOI.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 size={11} /> {isBn ? "যাচাইকৃত তথ্য" : "Verified Data"}
                  </span>
                </div>
                <h4 className="font-heading font-black text-sm sm:text-base leading-tight">
                  {isBn ? selectedPOI.bnName : selectedPOI.name}
                </h4>
                <span className="text-[11px] text-slate-400">
                  {isBn
                    ? `${selectedPOI.bnUpazila} উপজেলা, ${selectedDistrict?.bnName} জেলা`
                    : `${selectedPOI.upazila} Upazila, ${selectedDistrict?.name} District`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPOI(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close POI detail"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isBn ? selectedPOI.bnDetails : selectedPOI.details}
              </p>

              {selectedPOI.metadata?.beds && (
                <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">{isBn ? "হাসপাতাল শয্যা:" : "Hospital Beds:"}</span>
                  <span className="font-bold text-rose-500">
                    {selectedPOI.metadata.beds} {isBn ? "টি বেড" : "Beds"} (জরুরি সেবা ২৪/৭)
                  </span>
                </div>
              )}

              {selectedPOI.metadata?.pourashavaGrade && (
                <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">{isBn ? "পৌরসভা শ্রেণি:" : "Municipality Class:"}</span>
                  <span className="font-bold text-amber-500">{selectedPOI.metadata.pourashavaGrade}</span>
                </div>
              )}

              {selectedPOI.metadata?.areaSqKm && (
                <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">{isBn ? "আনুমানিক আয়তন:" : "Estimated Area:"}</span>
                  <span className="font-bold text-emerald-500">{selectedPOI.metadata.areaSqKm} km²</span>
                </div>
              )}

              {selectedPOI.metadata?.address && (
                <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">{isBn ? "ঠিকানা:" : "Address:"}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[190px]">
                    {selectedPOI.metadata.address}
                  </span>
                </div>
              )}
            </div>

            {/* Directions to here button ("route soho") */}
            <button
              type="button"
              onClick={() => handleDirectionsToPOI(selectedPOI)}
              className="w-full mt-2.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-1.5"
            >
              <Route size={13} />
              <span>{isBn ? "এখানকার ড্রাইভ রুট দেখুন" : "Get Directions to Here"}</span>
            </button>

            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 text-[10px]">
                {isBn ? "উৎস: গুগল ম্যাপস ও সরকারি গেজেট" : "Source: Google Maps & BBS"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("district-dashboard");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{isBn ? "পূর্ণাঙ্গ ড্যাশবোর্ড" : "Full Intel"}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ── MAP LEGEND (BOTTOM-LEFT WHEN NATIONWIDE) ── */}
        {!isDistrictZoomed && (
          <div
            className={`absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 rounded-xl px-3 py-2 backdrop-blur-md text-[11px] border ${
              theme === "light"
                ? "bg-white/95 border-slate-200 text-slate-700 shadow-md"
                : "bg-slate-900/90 border-slate-800 text-slate-300"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-400/30"></span>
              <span>{isBn ? "জাতীয় রাজধানী" : "National Capital (Dhaka)"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-sky-400/30"></span>
              <span>{isBn ? "বিভাগীয় সদর" : "Division HQ"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>{isBn ? "নির্বাচিত এলাকা" : "Selected Area"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
