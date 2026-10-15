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
  Globe2,
} from 'lucide-react';
import districtsGeoData from '../data/bangladeshDistrictsGeo.json';
import {
  BANGLADESH_DIVISIONS,
  ALL_BANGLADESH_DISTRICTS,
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
  getPathBoundingBox,
  DistrictPOI,
  DistrictRoad,
  RouteDirections,
  POICategory,
} from '../utils/districtPoiGenerator';
import { MapLibreDistrictExplorer } from './MapLibreDistrictExplorer';
import {
  CadastralParcelGeo,
  getDistrictGeoData,
  UpazilaGeo,
} from '../data/bangladeshGeoRegistry';

interface BangladeshInteractiveMapProps {
  isBn: boolean;
  theme: "dark" | "light";
  setTheme?: (t: "dark" | "light") => void;
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
  const [mapMode, setMapMode] = useState<"maplibre" | "districts" | "atlas" | "satellite">("maplibre");
  const [showLabels, setShowLabels] = useState(true);
  const [colorByViability, setColorByViability] = useState(false);

  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // POI Layer states
  const [activeLayerFilter, setActiveLayerFilter] = useState<'all' | 'upazila' | 'pourashava' | 'college' | 'school' | 'hospital'>('all');
  const [selectedPOI, setSelectedPOI] = useState<DistrictPOI | null>(null);
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<string | null>(null);
  const [hoveredPOI, setHoveredPOI] = useState<DistrictPOI | null>(null);

  // Route Navigation Mode states ("route soho")
  const [isRouteMode, setIsRouteMode] = useState<boolean>(false);
  const [routeFromId, setRouteFromId] = useState<string>('');
  const [routeToId, setRouteToId] = useState<string>('');

  // Hover states
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [hoveredDivision, setHoveredDivision] = useState<DivisionData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const mapSvgRef = useRef<SVGSVGElement | null>(null);

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

  // Active district fallback guaranteed across all modes
  const activeDistrict = selectedDistrict || ALL_BANGLADESH_DISTRICTS.find((d) => d.id === 'dhaka') || ALL_BANGLADESH_DISTRICTS[0];

  // District Area Metrics
  const districtAreaSummary = useMemo(() => {
    return getDistrictAreaSummary(activeDistrict.id);
  }, [activeDistrict]);

  // All POIs for currently active district using real boundary bounds
  const allDistrictPOIs = useMemo(() => {
    const geo = geoLookup.get(activeDistrict.id);
    const centroid = geo ? (geo.centroid as [number, number]) : ([300, 436] as [number, number]);
    return generateDistrictPOIs(activeDistrict.id, centroid, geo?.path);
  }, [activeDistrict, geoLookup]);

  // Filtered POIs based on active layer tab
  const visiblePOIs = useMemo(() => {
    return filterPOIsByCategory(allDistrictPOIs, activeLayerFilter);
  }, [allDistrictPOIs, activeLayerFilter]);

  // Road Network for active district
  const districtRoads = useMemo(() => {
    if (allDistrictPOIs.length < 2) return [];
    return generateDistrictRoads(activeDistrict.id, allDistrictPOIs);
  }, [activeDistrict, allDistrictPOIs]);

  // Auto-initialize route origin (Sadar) and destination when entering route mode or changing district
  useEffect(() => {
    if (allDistrictPOIs.length > 1) {
      const sadar = allDistrictPOIs.find((p) => p.isHub) || allDistrictPOIs[0];
      const otherPOIs = allDistrictPOIs.filter((p) => p.id !== sadar?.id && p.category === 'upazila');
      const defaultDest = otherPOIs[0] || allDistrictPOIs[1];
      if (sadar && (!routeFromId || !allDistrictPOIs.some((p) => p.id === routeFromId))) {
        setRouteFromId(sadar.id);
      }
      if (defaultDest && (!routeToId || !allDistrictPOIs.some((p) => p.id === routeToId))) {
        setRouteToId(defaultDest.id);
      }
    }
  }, [allDistrictPOIs, routeFromId, routeToId]);

  // Active Route Calculation - reliable and guaranteed
  const activeRoute = useMemo(() => {
    if (!isRouteMode || allDistrictPOIs.length < 2) return null;
    const fromId = routeFromId || (allDistrictPOIs.find((p) => p.isHub)?.id || allDistrictPOIs[0]?.id);
    let toId = routeToId;
    if (!toId || toId === fromId) {
      toId = allDistrictPOIs.find((p) => p.id !== fromId)?.id || allDistrictPOIs[1]?.id;
    }
    const fromPOI = allDistrictPOIs.find((p) => p.id === fromId);
    const toPOI = allDistrictPOIs.find((p) => p.id === toId);
    if (!fromPOI || !toPOI || fromPOI.id === toPOI.id) return null;
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

  // Full Map Trigger Counter for MapLibre & SVG
  const [fullMapTrigger, setFullMapTrigger] = useState<number>(0);

  // Smooth Zoom to District Centroid & auto-fit district bounding box
  const zoomToDistrict = (districtId: string) => {
    const geo = geoLookup.get(districtId);
    if (!geo) return;
    const [cx, cy] = geo.centroid;
    const containerH = mapSvgRef.current?.parentElement?.clientHeight || 620;
    const svgScale = Math.min(containerH, 660) / 872;
    
    let targetZoom = 6.8; // default punchy zoom
    if (geo.path) {
      const bbox = getPathBoundingBox(geo.path);
      if (bbox.width > 0 && bbox.height > 0) {
        // Fit district bounding box into comfortable ~65% of viewport
        const fitScaleX = 260 / bbox.width;
        const fitScaleY = 320 / bbox.height;
        targetZoom = Math.max(5.5, Math.min(10.5, Math.min(fitScaleX, fitScaleY) * 0.85));
      }
    }
    targetZoom = Number(targetZoom.toFixed(2));

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

  // Reset to Full Map
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedPOI(null);
    setSelectedUpazilaId(null);
    setIsRouteMode(false);
    setFullMapTrigger((prev) => prev + 1);
  };

  // Toggle Routes Mode with immediate origin/destination setup
  const handleToggleRoutes = () => {
    if (!selectedDistrict) {
      onSelectDistrict(activeDistrict);
    }
    if (mapMode === 'atlas') {
      setMapMode('districts');
      zoomToDistrict(activeDistrict.id);
    }
    setIsRouteMode((prev) => {
      const nextMode = !prev;
      if (nextMode && allDistrictPOIs.length > 1) {
        const sadar = allDistrictPOIs.find((p) => p.isHub) || allDistrictPOIs[0];
        const dest = allDistrictPOIs.filter((p) => p.id !== sadar?.id)[0] || allDistrictPOIs[1];
        if (sadar) setRouteFromId(sadar.id);
        if (dest) setRouteToId(dest.id);
      }
      return nextMode;
    });
  };

  // Active district area metrics
  const activeAreaSummary = useMemo(() => {
    return getDistrictAreaSummary(activeDistrict.id);
  }, [activeDistrict]);

  // Current district geo registry data containing verified upazilas and hubs
  const currentDistrictGeo = useMemo(() => {
    return getDistrictGeoData(activeDistrict.id);
  }, [activeDistrict]);

  // Upazila selection from right-side panel: pans map & opens verified intelligence
  const handleSelectUpazilaFromSidebox = (upz: UpazilaGeo) => {
    setSelectedUpazilaId(upz.id);

    // If district is not selected or different, select it
    if (!selectedDistrict || selectedDistrict.id !== activeDistrict.id) {
      onSelectDistrict(activeDistrict);
    }

    // Match or create POI for detail inspection card
    const matchPOI = allDistrictPOIs.find(
      (p) =>
        p.name.toLowerCase().includes(upz.name.toLowerCase()) ||
        upz.name.toLowerCase().includes(p.name.toLowerCase()) ||
        p.id === upz.id ||
        (p.upazila && p.upazila.toLowerCase().includes(upz.name.toLowerCase()))
    );

    // Deep zoom directly into the selected Upazila coordinates on SVG map
    if (mapMode === 'districts') {
      const containerH = mapSvgRef.current?.parentElement?.clientHeight || 620;
      const svgScale = Math.min(containerH, 660) / 872;
      const targetZoom = 11.5; // Deep zoom into the upazila hub
      if (matchPOI) {
        const targetPanX = (300 - matchPOI.x) * svgScale * targetZoom;
        const targetPanY = (436 - matchPOI.y) * svgScale * targetZoom;
        setZoomLevel(targetZoom);
        setPanOffset({ x: targetPanX, y: targetPanY });
      } else {
        zoomToDistrict(activeDistrict.id);
      }
    }

    if (matchPOI) {
      setSelectedPOI(matchPOI);
    } else {
      setSelectedPOI({
        id: upz.id,
        districtId: activeDistrict.id,
        name: upz.name,
        bnName: upz.bnName,
        category: 'upazila',
        badge: upz.pourashava ? (isBn ? 'পৌরসভা' : 'Pourashava') : (isBn ? 'উপজেলা' : 'Upazila'),
        upazila: upz.name,
        bnUpazila: upz.bnName,
        verified: true,
        details: `${upz.name} administrative headquarters with digitized land revenue records, mouza maps, and automated mutation processing.`,
        bnDetails: `${upz.bnName} প্রশাসনিক সদর দপ্তর, ডিজিটাইজড ভূমি রেকর্ড ও স্বয়ংক্রিয় নামজারি প্রক্রিয়াকরণ কেন্দ্র।`,
        x: 300,
        y: 436,
        metadata: {
          pourashavaGrade: upz.pourashava ? 'Class A Municipality' : undefined,
          address: `${upz.name}, ${activeDistrict.name}, Bangladesh`,
          areaSqKm: Number((activeAreaSummary.areaSqKm / (activeAreaSummary.upazilasCount || 1)).toFixed(1)),
        },
      });
    }
  };

  // Theme styling definitions matching BMS design system
  const themeStyles = useMemo(() => {
    if (theme === "light") {
      return {
        bg: "#FAFAFA",
        border: "#E4E4E7",
        landDefault: "#E4E4E7",
        landHover: "#16A34A",
        landSelected: "#09090B",
        stroke: "#D4D4D8",
        selectedStroke: "#09090B",
        waterColor: "#F4F4F5",
        waterText: "#71717A",
      };
    }
    // dark theme
    return {
      bg: "#09090B",
      border: "#27272A",
      landDefault: "#18181B",
      landHover: "#22C55E",
      landSelected: "#FAFAFA",
      stroke: "#27272A",
      selectedStroke: "#FAFAFA",
      waterColor: "#121215",
      waterText: "#71717A",
    };
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
    const delta = e.deltaY < 0 ? 0.6 : -0.6;
    setZoomLevel((prev) => Math.max(0.75, Math.min(16.0, Number((prev + delta).toFixed(2)))));
  };

  // Google Maps Satellite URL for Bangladesh center or active district
  const googleMapsUrl = useMemo(() => {
    const query = selectedDistrict ? `${selectedDistrict.name}, Bangladesh` : "Bangladesh";
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&t=k&z=${selectedDistrict ? 11 : 7}&output=embed`;
  }, [selectedDistrict]);

  return (
    <div
      className={`relative w-full rounded-2xl border shadow-card overflow-hidden flex flex-col transition-colors duration-200 ${
        theme === "light"
          ? "bg-white border-[#E4E4E7] text-[#09090B]"
          : "bg-[#121215] border-[#27272A] text-[#FAFAFA]"
      }`}
    >
      {/* ── TOP CONTROL BAR ── */}
      <div
        className={`flex flex-wrap items-center justify-between p-3.5 sm:p-4 border-b gap-3 z-10 transition-colors ${
          theme === "light"
            ? "bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B]"
            : "bg-[#121215] border-[#27272A] text-[#FAFAFA]"
        }`}
      >
        {/* Left: Map Layer Mode Toggles */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border ${
            theme === "light" ? "bg-[#F4F4F5] border-[#E4E4E7]" : "bg-[#18181B] border-[#27272A]"
          }`}
        >
          <button
            type="button"
            onClick={() => setMapMode("maplibre")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mapMode === "maplibre"
                ? "bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] shadow-xs"
                : theme === "light"
                ? "text-[#52525B] hover:text-[#09090B] hover:bg-white/60"
                : "text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"
            }`}
          >
            <i className="bx bx-map-alt text-sm text-[#16A34A] dark:text-[#4ADE80]" aria-hidden="true" />
            <span>{isBn ? "ভেক্টর জিআইএস ম্যাপ" : "Vector GIS Map"}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#16A34A]/10 text-[#16A34A] dark:text-[#4ADE80] font-mono border border-[#16A34A]/20 hidden sm:inline">
              Live
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode("districts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mapMode === "districts"
                ? "bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] shadow-xs"
                : theme === "light"
                ? "text-[#52525B] hover:text-[#09090B] hover:bg-white/60"
                : "text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"
            }`}
          >
            <i className="bx bx-map-pin text-xs text-[#2563EB] dark:text-[#60A5FA]" aria-hidden="true" />
            <span>{isBn ? "৬৪ জেলা মানচিত্র" : "64 Districts"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode("atlas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mapMode === "atlas"
                ? "bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] shadow-xs"
                : theme === "light"
                ? "text-[#52525B] hover:text-[#09090B] hover:bg-white/60"
                : "text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"
            }`}
          >
            <i className="bx bx-layer text-xs text-[#D97706] dark:text-[#FBBF24]" aria-hidden="true" />
            <span>{isBn ? "৮ প্রশাসনিক বিভাগ" : "8 Divisions"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode("satellite")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mapMode === "satellite"
                ? "bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] shadow-xs"
                : theme === "light"
                ? "text-[#52525B] hover:text-[#09090B] hover:bg-white/60"
                : "text-[#A1A1AA] hover:text-white hover:bg-[#27272A]"
            }`}
          >
            <i className="bx bx-planet text-xs text-[#16A34A] dark:text-[#4ADE80]" aria-hidden="true" />
            <span>{isBn ? "স্যাটেলাইট ভিউ" : "Satellite"}</span>
          </button>
        </div>

        {/* Center: Search & Quick Find with Omnibox Intelligence */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <i
            className={`bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
              theme === "light" ? "text-[#71717A]" : "text-[#71717A]"
            }`}
            aria-hidden="true"
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
            className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-[#09090B] dark:focus:border-white ${
              theme === "light"
                ? "bg-white border border-[#E4E4E7] text-[#09090B] placeholder-[#A1A1AA] shadow-xs"
                : "bg-[#18181B] border border-[#27272A] text-white placeholder-[#71717A]"
            }`}
          />

          {/* Unified Intelligence Search Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div
              className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-2xl p-1 z-50 max-h-72 overflow-y-auto ${
                theme === "light"
                  ? "bg-white border-zinc-200 text-zinc-800"
                  : "bg-[#121215] border-zinc-800 text-zinc-100"
              }`}
            >
              <div
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider flex justify-between border-b ${
                  theme === "light" ? "text-zinc-400 border-zinc-100" : "text-zinc-400 border-zinc-800"
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
                      theme === "light" ? "hover:bg-zinc-100" : "hover:bg-[#18181B]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                        {item.type === 'district' ? (
                          <i className="bx bx-map-pin text-xs" />
                        ) : item.type === 'upazila' ? (
                          <i className="bx bx-navigation text-xs" />
                        ) : item.type === 'institution' ? (
                          <i className="bx bx-book-reader text-xs" />
                        ) : item.type === 'hospital' ? (
                          <i className="bx bx-plus-medical text-xs" />
                        ) : (
                          <i className="bx bx-compass text-xs" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate">
                          {isBn && item.bnTitle ? item.bnTitle : item.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">{item.details}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        theme === "light" ? "bg-zinc-100 text-zinc-600" : "bg-[#18181B] text-zinc-300"
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
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  showLabels
                    ? theme === "light"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold"
                      : "bg-[#18181B] border-emerald-500/40 text-emerald-400"
                    : theme === "light"
                    ? "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    : "bg-[#09090B] border-zinc-800 text-zinc-400"
                }`}
                title="Toggle District Labels"
              >
                <i className="bx bx-show text-xs" aria-hidden="true" />
                <span className="hidden sm:inline">{isBn ? "লেবেল" : "Labels"}</span>
              </button>

              <button
                type="button"
                onClick={() => setColorByViability((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  colorByViability
                    ? theme === "light"
                      ? "bg-amber-50 border-amber-500 text-amber-700 font-bold"
                      : "bg-[#18181B] border-amber-500/40 text-amber-400"
                    : theme === "light"
                    ? "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                    : "bg-[#09090B] border-zinc-800 text-zinc-400"
                }`}
                title="Color code by Land Viability Score"
              >
                <i className="bx bx-slider-alt text-xs" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MAIN WORKSPACE: MAP CANVAS (LEFT) + DISTRICT & UPAZILA INSPECTOR BOX (RIGHT) ── */}
      <div className="flex flex-col lg:flex-row w-full min-h-[580px] lg:h-[720px] overflow-hidden border-t border-zinc-200 dark:border-zinc-800">
        {/* ── LEFT: MAP CANVAS CONTAINER ── */}
        <div
          className="relative flex-1 min-w-0 h-[480px] sm:h-[560px] lg:h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          style={{ backgroundColor: themeStyles.bg }}
          onWheel={handleWheel}
        >
          {/* Floating Zoom Controls (Only for SVG Map: High Zoom up to 1600%) */}
          {mapMode !== "satellite" && mapMode !== "maplibre" && (
            <div
              className={`absolute top-4 right-4 z-20 flex flex-col items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-md shadow-xl ${
                theme === "light"
                  ? "bg-white/95 border-zinc-200 shadow-zinc-200/60"
                  : "bg-[#121215] border-zinc-800"
              }`}
            >
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(Number((z + 1.0).toFixed(1)), 16.0))}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                  theme === "light"
                    ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    : "bg-[#18181B] hover:bg-zinc-800 active:bg-zinc-700 text-zinc-200"
                }`}
                aria-label="Zoom In"
                title="Zoom In (up to 16x)"
              >
                <ZoomIn size={15} />
              </button>

              {/* Live Zoom Percentage Badge */}
              <div
                className={`text-[9px] font-mono font-bold px-1 py-0.5 text-center select-none w-full ${
                  theme === "light" ? "text-zinc-600" : "text-zinc-400"
                }`}
                title="Current Map Zoom Level"
              >
                {Math.round(zoomLevel * 100)}%
              </div>

              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(Number((z - 1.0).toFixed(1)), 0.75))}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                  theme === "light"
                    ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                    : "bg-[#18181B] hover:bg-zinc-800 active:bg-zinc-700 text-zinc-200"
                }`}
                aria-label="Zoom Out"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>

              {/* Quick Preset Zoom Levels (1x / 6x / 12x) */}
              <div className="w-full pt-1 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (zoomLevel < 4.0) {
                      if (selectedDistrict) zoomToDistrict(selectedDistrict.id);
                      else setZoomLevel(6.5);
                    } else if (zoomLevel < 9.0) {
                      setZoomLevel(12.0);
                    } else {
                      handleResetZoom();
                    }
                  }}
                  className={`w-8 h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center transition-colors ${
                    theme === "light"
                      ? "bg-zinc-100 hover:bg-emerald-50 text-emerald-700 hover:border-emerald-300 border border-transparent"
                      : "bg-[#18181B] hover:bg-emerald-950/60 text-emerald-400 hover:border-emerald-800 border border-transparent"
                  }`}
                  title="Cycle Quick Zoom (1x → 6x → 12x)"
                >
                  {zoomLevel < 4.0 ? '6x' : zoomLevel < 9.0 ? '12x' : '1x'}
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                    theme === "light"
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                      : "bg-[#18181B] hover:bg-zinc-800 active:bg-zinc-700 text-zinc-200"
                  }`}
                  aria-label="Reset Zoom"
                  title="Reset View to Full Bangladesh Map"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Floating Compass Badge (Only for SVG Map) */}
          {mapMode !== "satellite" && mapMode !== "maplibre" && (
            <div
              className={`absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md text-[11px] ${
                theme === "light"
                  ? "bg-white/95 border-zinc-200 text-zinc-700 shadow-sm"
                  : "bg-[#121215] border-zinc-800 text-zinc-300"
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
          )}

          {/* 0. MAPLIBRE GL JS DEEP PROGRESSIVE DIGITAL EXPLORER */}
          {mapMode === "maplibre" && (
            <div className="w-full h-full p-2">
              <MapLibreDistrictExplorer
                isBn={isBn}
                theme={theme}
                selectedDistrictId={activeDistrict.id}
                selectedUpazilaId={selectedUpazilaId}
                onSelectUpazilaId={setSelectedUpazilaId}
                onSelectDistrictId={(id) => {
                  const dst = ALL_BANGLADESH_DISTRICTS.find((d) => d.id === id);
                  if (dst) onSelectDistrict(dst);
                }}
                onOpenDueDiligenceForParcel={(parcel) => {
                  const el = document.getElementById('due-diligence');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                externalRouteOpen={isRouteMode}
                fullMapTrigger={fullMapTrigger}
              />
            </div>
          )}

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
                  ? "bg-white/95 border-zinc-200 text-zinc-700 shadow-md"
                  : "bg-[#121215] border-zinc-800 text-zinc-300"
              }`}
            >
              <span className={`font-bold ${theme === "light" ? "text-zinc-950" : "text-white"}`}>
                {selectedDistrict
                  ? isBn
                    ? selectedDistrict.bnName
                    : selectedDistrict.name
                  : isBn
                  ? "সারাদেশ"
                  : "Bangladesh"}
              </span>
              <span className="text-zinc-400 ml-2">Satellite Layer Live</span>
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
                let fillColor = theme === "light"
                  ? isSelected
                    ? "#F59E0B"
                    : isHovered
                    ? "#10B981"
                    : (geo as any).color || "#E2E8F0"
                  : isSelected
                  ? "#F59E0B"
                  : isHovered
                  ? "#10B981"
                  : (geo as any).color || "#1E293B";

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
                            : theme === "dark"
                            ? "#FFFFFF"
                            : "#0F172A"
                        }
                        className="pointer-events-none select-none"
                        style={{
                          fontFamily: isBn ? "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" : "inherit",
                          letterSpacing: isBn ? "0px" : "-0.01em",
                          textShadow:
                            theme === "light"
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

            {/* ── DISTRICT LOCAL INFRASTRUCTURE LAYER (ZOOMED IN: CLEAN PIN SPACING) ── */}
            {isDistrictZoomed && selectedDistrict && selectedGeo && (
              <g id="district-poi-layer" className="transition-opacity duration-500 ease-out">
                {/* Render filtered POIs without overlapping centroid banner */}
                {visiblePOIs.map((poi) => {
                  const isUpazila = poi.category === 'upazila';
                  const isPoiHovered = hoveredPOI?.id === poi.id;
                  const isPoiSelected = selectedPOI?.id === poi.id;
                  const isUpazilaSelected = selectedUpazilaId === poi.id;

                  // Clean UX: Only show full label pill on hover or selection to prevent overlap clusters
                  const shouldShowLabel = isPoiHovered || isPoiSelected;

                  // Dynamic pin scaling: pins stay delicate and sharp at high zoom levels
                  const pinScale = Math.max(0.6, Math.min(1.0, 3.8 / Math.sqrt(zoomLevel)));
                  const outerR = (isUpazila ? 3.0 : 2.4) * pinScale;
                  const innerR = (isUpazila ? 1.1 : 0.8) * pinScale;
                  const strokeW = 0.65 * pinScale;

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
                          r={outerR * 2.2}
                          fill={badgeColor}
                          opacity="0.35"
                          className="animate-ping"
                        />
                      )}

                      {/* Marker Anchor Pin Circle */}
                      <circle
                        cx={poi.x}
                        cy={poi.y}
                        r={outerR}
                        fill={badgeColor}
                        stroke="#FFFFFF"
                        strokeWidth={strokeW}
                        filter="url(#poi-shadow)"
                      />
                      <circle cx={poi.x} cy={poi.y} r={innerR} fill="#FFFFFF" />

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
                  <g className="pointer-events-none select-none">
                    <text
                      x={div.center.x}
                      y={div.center.y}
                      textAnchor="middle"
                      fontSize="24"
                      fontWeight="800"
                      fill={theme === "light" ? "#0F172A" : "#FFFFFF"}
                      stroke={theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)"}
                      strokeWidth="4"
                      paintOrder="stroke fill"
                      strokeLinejoin="round"
                      style={{
                        fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "inherit",
                      }}
                    >
                      {isBn ? div.bnName : div.name}
                    </text>
                    <text
                      x={div.center.x}
                      y={div.center.y + 24}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="700"
                      fill={isSelected ? (theme === "light" ? "#78350F" : "#FEF3C7") : (theme === "light" ? "#166534" : "#86EFAC")}
                      stroke={theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(15,23,42,0.9)"}
                      strokeWidth="3"
                      paintOrder="stroke fill"
                      strokeLinejoin="round"
                    >
                      {div.districtsCount} {isBn ? "জেলা" : "Districts"}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        )}

        {/* ── GOOGLE MAPS ROUTE DIRECTIONS CARD ("route soho") ── */}
        {isRouteMode && activeRoute && (
          <div
            className={`absolute top-4 left-4 sm:left-6 z-30 w-[calc(100%-2rem)] sm:w-96 max-w-sm sm:max-w-md rounded-2xl p-4 backdrop-blur-xl border shadow-2xl animate-in fade-in slide-in-from-top-4 overflow-hidden ${
              theme === "light"
                ? "bg-white/95 border-blue-500/40 text-zinc-950 shadow-zinc-300/80"
                : "bg-[#121215] border-blue-500/40 text-zinc-100 shadow-black/90"
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
                  <span className="text-[10px] text-zinc-400">
                    {isBn ? "সড়ক যোগাযোগ ও ড্রাইভ সময়সূচী" : "Direct Highway Driving Corridor"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRouteMode(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#18181B] transition"
                title="Exit Route Mode"
              >
                <X size={15} />
              </button>
            </div>

            {/* Origin & Destination Selectors */}
            <div className="space-y-2 mb-3">
              {/* Origin (A) */}
              <div className="flex items-center gap-2 min-w-0 w-full">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                  A
                </span>
                <select
                  value={routeFromId}
                  onChange={(e) => setRouteFromId(e.target.value)}
                  className={`flex-1 min-w-0 w-full truncate rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition cursor-pointer ${
                    theme === "light"
                      ? "bg-zinc-50 border-zinc-200 text-zinc-800"
                      : "bg-[#18181B] border-zinc-800 text-zinc-200"
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
                      ? "bg-white border-zinc-200 text-zinc-500"
                      : "bg-[#18181B] border-zinc-800 text-zinc-300"
                  }`}
                  title="Reverse directions"
                >
                  <ArrowUpDown size={12} />
                </button>
              </div>

              {/* Destination (B) */}
              <div className="flex items-center gap-2 min-w-0 w-full">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                  B
                </span>
                <select
                  value={routeToId}
                  onChange={(e) => setRouteToId(e.target.value)}
                  className={`flex-1 min-w-0 w-full truncate rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition cursor-pointer ${
                    theme === "light"
                      ? "bg-zinc-50 border-zinc-200 text-zinc-800"
                      : "bg-[#18181B] border-zinc-800 text-zinc-200"
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
                <div className="font-mono font-black text-sm text-zinc-800 dark:text-zinc-100">
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
                <div key={sIdx} className="flex items-start gap-1.5 text-zinc-600 dark:text-zinc-300">
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
                    ? "bg-white/95 border-emerald-500/40 text-zinc-800 shadow-zinc-300/40"
                    : "bg-[#121215] border-emerald-500/50 text-zinc-200"
                }`}
              >
                {/* Header: Name and Division */}
                <div
                  className={`flex items-center justify-between gap-2 border-b pb-2 mb-2 ${
                    theme === "light" ? "border-zinc-200" : "border-zinc-800"
                  }`}
                >
                  <div>
                    <span
                      className={`font-black text-sm block leading-tight ${
                        theme === "light" ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      {isBn ? hoveredDistrict.bnName : hoveredDistrict.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
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
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {isBn ? "প্রশাসনিক একক:" : "Administrative:"}
                    </span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-200">
                      {intel.upazilas.length} {isBn ? "উপজেলা" : "Upazilas"} • {intel.pourashavasCount}{" "}
                      {isBn ? "পৌরসভা" : "Paurashavas"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {isBn ? "প্রতিষ্ঠান ও স্বাস্থ্য:" : "Institutions:"}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {intel.universitiesCount + intel.collegesCount} {isBn ? "কলেজ/ভার্সিটি" : "Higher Edu"} •{" "}
                      {intel.hospitalsCount} {isBn ? "হাসপাতাল" : "Hospitals"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-400">
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
                    theme === "light" ? "border-zinc-200 text-emerald-600" : "border-zinc-800 text-emerald-400"
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

        {/* ── MAP LEGEND (BOTTOM-LEFT WHEN NATIONWIDE) ── */}
        {!isDistrictZoomed && (
          <div
            className={`absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 rounded-xl px-3 py-2 backdrop-blur-md text-[11px] border ${
              theme === "light"
                ? "bg-white/95 border-zinc-200 text-zinc-700 shadow-md"
                : "bg-[#121215] border-zinc-800 text-zinc-300"
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

        {/* ── DISTRICT DATA RIBBON (OUTSIDE THE SELECTED MAP: BOTTOM HUD) ── */}
        {isDistrictZoomed && selectedDistrict && (
          <div
            className={`absolute bottom-3 left-3 right-3 sm:right-auto z-20 flex flex-wrap items-center gap-2 sm:gap-3 rounded-xl px-3.5 py-2 backdrop-blur-md text-xs border shadow-md animate-in fade-in slide-in-from-bottom-2 ${
              theme === "light"
                ? "bg-white/95 border-emerald-500/30 text-zinc-800 shadow-zinc-200/80"
                : "bg-[#121215]/95 border-emerald-500/30 text-zinc-200 shadow-black/80"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700 dark:text-emerald-400 font-heading">
                {isBn ? activeDistrict.bnName : activeDistrict.name} {isBn ? "জেলা" : "District"}
              </span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-zinc-400">{isBn ? "আয়তন:" : "Area:"}</span>
              <strong className="text-zinc-900 dark:text-zinc-100">
                {activeAreaSummary.areaSqKm.toLocaleString()} km²
              </strong>
              <span className="text-zinc-400 hidden md:inline">
                ({activeAreaSummary.areaAcres.toLocaleString()} {isBn ? "একর" : "acres"} • {activeAreaSummary.areaBighas.toLocaleString()} {isBn ? "বিঘা" : "bighas"})
              </span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold">
                {activeAreaSummary.upazilasCount} {isBn ? "উপজেলা" : "Upazilas"}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                {activeAreaSummary.pourashavasCount} {isBn ? "পৌরসভা" : "Pourashavas"}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold">
                {allDistrictPOIs.length} {isBn ? "পয়েন্ট" : "POIs"}
              </span>
            </div>
            {selectedPOI && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>🎯</span>
                  <span>{isBn ? selectedPOI.bnName : selectedPOI.name}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── RIGHT: DEDICATED INSPECTION & UPAZILA BOX (OUT OF THE MAP BESIDE THE MAP) ── */}
      <aside
        className={`w-full lg:w-[400px] xl:w-[440px] shrink-0 border-t lg:border-t-0 lg:border-l flex flex-col h-auto lg:h-full overflow-y-auto scrollbar-thin z-20 transition-colors ${
          theme === "light"
            ? "bg-[#FAFAFA] border-zinc-200 text-zinc-900"
            : "bg-[#09090B] border-zinc-800 text-zinc-100"
        }`}
      >
        {/* 1. TOP HEADER: District Title + Division Badge + Area summary + Routes / Full Map */}
        <div
          className={`p-4 sm:p-5 border-b shrink-0 ${
            theme === "light" ? "bg-white border-zinc-200" : "bg-[#121215] border-zinc-800"
          }`}
        >
          {/* Top Row: District Title & Division Pill (Full Width, Zero Truncation!) */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 border transition-colors ${
                theme === "light"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs"
                  : "bg-emerald-950/60 border-emerald-800 text-emerald-400"
              }`}
            >
              <MapPin size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-extrabold text-base sm:text-lg leading-tight tracking-tight text-zinc-950 dark:text-white whitespace-normal break-words">
                  {isBn ? activeDistrict.bnName : activeDistrict.name} {isBn ? "জেলা" : "District"}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 transition-colors ${
                    theme === "light"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-emerald-950/50 text-emerald-300 border-emerald-800/80"
                  }`}
                >
                  {isBn ? activeDistrict.bnDivisionName : activeDistrict.divisionName} {isBn ? "বিভাগ" : "Div"}
                </span>
              </div>
            </div>
          </div>

          {/* Next Row: Quick Action Controls (Routes & Full Map) Full Width & Perfectly Visible */}
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={handleToggleRoutes}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isRouteMode
                  ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                  : theme === "light"
                  ? "bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 border-blue-200 shadow-2xs"
                  : "bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border-blue-800/80 shadow-2xs"
              }`}
              title="Toggle Route Navigator"
            >
              <Route size={14} className={isRouteMode ? "text-white" : "text-blue-600 dark:text-blue-400"} />
              <span>{isBn ? "সড়ক রুট" : "Routes"}</span>
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                theme === "light"
                  ? "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border-zinc-200 shadow-2xs"
                  : "bg-[#18181F] hover:bg-[#202028] text-zinc-300 hover:text-white border-zinc-800 shadow-2xs"
              }`}
              title="Reset to Full Bangladesh Map"
            >
              <RotateCcw size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? "সারাদেশ (Full Map)" : "Full Map"}</span>
            </button>
          </div>

          {/* District Area Metrics Bar: Clean 3-Segment Ribbon */}
          <div
            className={`grid grid-cols-3 gap-1 p-1.5 rounded-xl border text-center transition-colors mb-3 ${
              theme === "light"
                ? "bg-[#F8F9FA] border-zinc-200/90 text-zinc-700 shadow-2xs"
                : "bg-[#16161B] border-zinc-800/90 text-zinc-300"
            }`}
          >
            <div className="px-1.5 py-1">
              <span className="text-[10px] text-zinc-400 block font-medium">
                {isBn ? "বর্গ কিমি" : "Sq Km"}
              </span>
              <strong className="text-xs font-black text-zinc-900 dark:text-zinc-100 font-mono">
                {activeAreaSummary.areaSqKm.toLocaleString()}
              </strong>
            </div>

            <div className="px-1.5 py-1 border-x border-zinc-200/80 dark:border-zinc-800/80">
              <span className="text-[10px] text-zinc-400 block font-medium">
                {isBn ? "একর" : "Acres"}
              </span>
              <strong className="text-xs font-black text-zinc-900 dark:text-zinc-100 font-mono">
                {activeAreaSummary.areaAcres.toLocaleString()}
              </strong>
            </div>

            <div className="px-1.5 py-1">
              <span className="text-[10px] text-zinc-400 block font-medium">
                {isBn ? "বিঘা" : "Bighas"}
              </span>
              <strong className="text-xs font-black text-zinc-900 dark:text-zinc-100 font-mono">
                {activeAreaSummary.areaBighas.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Key Stats Strip (4 Metric Cards) */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3 text-center text-[10px]">
            <div
              className={`p-2 rounded-xl border ${
                theme === "light" ? "bg-zinc-50 border-zinc-200" : "bg-[#18181B] border-zinc-800"
              }`}
            >
              <div className="text-zinc-400 font-medium">{isBn ? "উপজেলা" : "Upazilas"}</div>
              <div className="font-extrabold text-sm text-indigo-500 mt-0.5">{activeAreaSummary.upazilasCount}</div>
            </div>
            <div
              className={`p-2 rounded-xl border ${
                theme === "light" ? "bg-zinc-50 border-zinc-200" : "bg-[#18181B] border-zinc-800"
              }`}
            >
              <div className="text-zinc-400 font-medium">{isBn ? "পৌরসভা" : "Pourashavas"}</div>
              <div className="font-extrabold text-sm text-amber-500 mt-0.5">{activeAreaSummary.pourashavasCount}</div>
            </div>
            <div
              className={`p-2 rounded-xl border ${
                theme === "light" ? "bg-zinc-50 border-zinc-200" : "bg-[#18181B] border-zinc-800"
              }`}
            >
              <div className="text-zinc-400 font-medium">{isBn ? "কলেজ" : "Colleges"}</div>
              <div className="font-extrabold text-sm text-sky-500 mt-0.5">
                {activeAreaSummary.collegesCount + activeAreaSummary.universitiesCount}
              </div>
            </div>
            <div
              className={`p-2 rounded-xl border ${
                theme === "light" ? "bg-zinc-50 border-zinc-200" : "bg-[#18181B] border-zinc-800"
              }`}
            >
              <div className="text-zinc-400 font-medium">{isBn ? "হাসপাতাল" : "Hospitals"}</div>
              <div className="font-extrabold text-sm text-rose-500 mt-0.5">{activeAreaSummary.hospitalsCount}</div>
            </div>
          </div>

          {/* Layer Filter Buttons — All Visible at Once, ZERO Horizontal Scrolling */}
          <div className="pt-1 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-1">
                <span>{isBn ? "ক্যাটাগরি ফিল্টার" : "Category Filter"}</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                {allDistrictPOIs.length} {isBn ? "টি পয়েন্ট" : "POIs"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 w-full text-xs">
              {[
                { id: "all", label: isBn ? "সবগুলো" : "All", icon: "🔘", count: allDistrictPOIs.length },
                { id: "upazila", label: isBn ? "উপজেলা" : "Upazilas", icon: "🏛️", count: activeAreaSummary.upazilasCount },
                { id: "pourashava", label: isBn ? "পৌরসভা" : "Pourashavas", icon: "🏢", count: activeAreaSummary.pourashavasCount },
                { id: "college", label: isBn ? "কলেজ" : "Colleges", icon: "🎓", count: activeAreaSummary.collegesCount },
                { id: "school", label: isBn ? "স্কুল" : "Schools", icon: "🏫", count: activeAreaSummary.schoolsCount },
                { id: "hospital", label: isBn ? "হাসপাতাল" : "Hospitals", icon: "🏥", count: activeAreaSummary.hospitalsCount },
              ].map((tab) => {
                const isActive = activeLayerFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveLayerFilter(tab.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border text-center ${
                      isActive
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : theme === "light"
                        ? "bg-[#F4F4F5] hover:bg-[#E4E4E7] text-zinc-800 border-zinc-200/90 hover:border-zinc-300"
                        : "bg-[#18181D] hover:bg-[#23232A] text-zinc-300 border-zinc-800"
                    }`}
                    title={`${tab.label} (${tab.count})`}
                  >
                    <span className="text-xs leading-none">{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. UPAZILAS & MUNICIPAL ZONES — VERTICAL WRAPPING (UP & DOWN, NO SIDE SCROLL) */}
        <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            
            {/* If a POI is currently selected, show the active inspection card */}
            {selectedPOI && (
              <div
                className={`rounded-2xl p-4 border transition-all shrink-0 ${
                  theme === "light"
                    ? "bg-white border-zinc-200 shadow-sm"
                    : "bg-[#151518] border-zinc-800"
                }`}
              >
                {/* Header */}
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
                    <span className="text-[11px] text-zinc-400">
                      {isBn
                        ? `${selectedPOI.bnUpazila || selectedPOI.bnName} উপজেলা, ${activeDistrict.bnName} জেলা`
                        : `${selectedPOI.upazila || selectedPOI.name} Upazila, ${activeDistrict.name} District`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPOI(null);
                      setSelectedUpazilaId(null);
                    }}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
                    aria-label="Clear selection"
                    title={isBn ? "তালিকা দেখুন" : "Clear selection"}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
                  {isBn ? selectedPOI.bnDetails : selectedPOI.details}
                </p>

                {/* Extra details */}
                <div className="space-y-1.5 text-[11px] border-t pt-2 mb-3 border-zinc-100 dark:border-zinc-800">
                  {selectedPOI.metadata?.beds && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">{isBn ? "হাসপাতাল শয্যা:" : "Hospital Beds:"}</span>
                      <span className="font-bold text-rose-500">{selectedPOI.metadata.beds} {isBn ? "টি বেড" : "Beds"}</span>
                    </div>
                  )}
                  {selectedPOI.metadata?.pourashavaGrade && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">{isBn ? "পৌরসভা শ্রেণি:" : "Municipality Class:"}</span>
                      <span className="font-bold text-amber-500">{selectedPOI.metadata.pourashavaGrade}</span>
                    </div>
                  )}
                  {selectedPOI.metadata?.areaSqKm && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">{isBn ? "আয়তন:" : "Area:"}</span>
                      <span className="font-bold text-emerald-500">{selectedPOI.metadata.areaSqKm} km²</span>
                    </div>
                  )}
                  {selectedPOI.metadata?.address && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">{isBn ? "ঠিকানা:" : "Address:"}</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[210px]">
                        {selectedPOI.metadata.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Directions Button */}
                <button
                  type="button"
                  onClick={() => handleDirectionsToPOI(selectedPOI)}
                  className="w-full px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Route size={13} />
                  <span>{isBn ? "এখানকার ড্রাইভ রুট দেখুন" : "Get Directions to Here"}</span>
                </button>
              </div>
            )}

            {/* Upazilas & Municipal Zones List (Wrapping Up and Down, No Left-Right Overflow) */}
            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    {isBn ? "উপজেলা ও পৌর এলাকা" : "Upazilas & Municipal Zones"}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {currentDistrictGeo.upazilas.length}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium">
                  {isBn ? "ক্লিক করে ম্যাপে যান" : "Click to fly on map"}
                </span>
              </div>

              {/* Vertical Wrapping Pills Container: flex-wrap, no horizontal scroll, scrolls up and down */}
              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[300px] lg:max-h-[380px] p-1 scrollbar-thin">
                {currentDistrictGeo.upazilas.map((upz) => {
                  const isSelected =
                    selectedUpazilaId === upz.id ||
                    Boolean(selectedPOI?.name && selectedPOI.name.toLowerCase().includes(upz.name.toLowerCase()));
                  return (
                    <button
                      key={upz.id}
                      type="button"
                      onClick={() => handleSelectUpazilaFromSidebox(upz)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/40 ring-2 ring-emerald-400/80 scale-[1.02]"
                          : theme === "light"
                          ? "bg-[#F4F4F5] text-zinc-800 hover:bg-[#E4E4E7] hover:text-zinc-950 border border-zinc-300/80 shadow-2xs"
                          : "bg-[#1E2430] text-zinc-100 hover:bg-[#2A3345] border border-zinc-700/80 shadow-xs"
                      }`}
                      title={`Inspect ${upz.name}`}
                    >
                      <Building2
                        size={13}
                        className={
                          isSelected
                            ? "text-white"
                            : theme === "light"
                            ? "text-emerald-700"
                            : "text-emerald-400"
                        }
                      />
                      <span>{isBn ? upz.bnName : upz.name}</span>
                      {upz.pourashava && (
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            isSelected
                              ? "bg-amber-400/30 text-amber-100 border border-amber-300/40"
                              : theme === "light"
                              ? "bg-amber-100 text-amber-900 border border-amber-300/80"
                              : "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          {isBn ? "পৌর" : "Mun"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom link to full intel */}
          <div className="mt-4 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 text-[10px]">
              {isBn ? "উৎস: সরকারি গেজেট ও জরিপ" : "Source: Official BBS & DLRS"}
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
      </aside>
    </div>
  </div>
);
};
