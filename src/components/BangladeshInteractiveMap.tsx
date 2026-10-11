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
  Globe2,
  Satellite,
  GraduationCap,
  Building2,
  Activity,
  ArrowRight
} from 'lucide-react';
import districtsGeoData from '../data/bangladeshDistrictsGeo.json';
import {
  BANGLADESH_DIVISIONS,
  ALL_BANGLADESH_DISTRICTS,
  BANGLADESH_FLOWS,
  DivisionData,
  DistrictData,
  TransactionFlow,
} from '../data/bangladeshMapData';
import { getDistrictLandData } from '../data/landtechData';
import {
  getDistrictIntelligence,
  searchIntelligence,
  SearchResultItem,
} from '../data/districtIntelligence';

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

  // Hover
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

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Google Maps Satellite URL for Bangladesh center or active district
  const googleMapsUrl = useMemo(() => {
    const query = selectedDistrict ? `${selectedDistrict.name}, Bangladesh` : "Bangladesh";
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&t=k&z=${selectedDistrict ? 11 : 7}&output=embed`;
  }, [selectedDistrict]);

  return (
    <div className={`relative w-full rounded-2xl border shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl transition-colors duration-200 ${
      theme === "light"
        ? "bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50"
        : "bg-slate-950/80 border-slate-700/80 text-slate-100"
    }`}>
      {/* ── TOP CONTROL BAR ── */}
      <div className={`flex flex-wrap items-center justify-between p-3 sm:p-4 border-b gap-3 z-10 transition-colors ${
        theme === "light" ? "bg-slate-50/90 border-slate-200 text-slate-800" : "bg-slate-900/90 border-slate-800 text-slate-100"
      }`}>
        
        {/* Left: Map Layer Mode Toggles */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
          theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-950/90 border-slate-800"
        }`}>
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
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === "light" ? "text-slate-400" : "text-slate-400"}`} />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? "জেলা, উপজেলা, শিক্ষাপ্রতিষ্ঠান খুঁজুন..." : "Search 64 districts, upazila, POI..."}
            className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-emerald-500 ${
              theme === "light"
                ? "bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm"
                : "bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
            }`}
          />

          {/* Unified Intelligence Search Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-2xl p-1 z-50 max-h-72 overflow-y-auto ${
              theme === "light" ? "bg-white border-slate-200 text-slate-800" : "bg-slate-900 border-slate-700 text-slate-100"
            }`}>
              <div className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider flex justify-between border-b ${
                theme === "light" ? "text-slate-400 border-slate-100" : "text-slate-400 border-slate-800"
              }`}>
                <span>{isBn ? "অনুসন্ধান ফলাফল" : "Search Results"}</span>
                <span className="text-emerald-500 font-semibold">{searchResults.length} {isBn ? "পাওয়া গেছে" : "found"}</span>
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
                        setIsSearchFocused(false);
                        setSearchQuery("");
                        const el = document.getElementById("district-dashboard");
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition ${
                      theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 shrink-0">
                        {item.type === 'district' ? <MapPin size={12} /> :
                         item.type === 'upazila' ? <Navigation size={12} /> :
                         item.type === 'institution' ? <GraduationCap size={12} /> :
                         item.type === 'hospital' ? <Activity size={12} /> :
                         <Compass size={12} />}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate">{isBn && item.bnTitle ? item.bnTitle : item.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.details}</div>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                      theme === "light" ? "bg-slate-100 text-slate-600" : "bg-slate-800 text-slate-300"
                    }`}>
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
      >
        
        {/* Floating Zoom Controls */}
        {mapMode !== "satellite" && (
          <div className={`absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl border backdrop-blur-md shadow-xl ${
            theme === "light"
              ? "bg-white/95 border-slate-200 shadow-slate-200/60"
              : "bg-slate-900/90 border-slate-700/80"
          }`}>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 0.35, 3.2))}
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
              onClick={() => setZoomLevel((z) => Math.max(z - 0.35, 0.75))}
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
              title="Reset View"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}

        {/* Floating Compass Badge */}
        <div className={`absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md text-[11px] ${
          theme === "light"
            ? "bg-white/95 border-slate-200 text-slate-700 shadow-sm"
            : "bg-slate-900/80 border-slate-700/60 text-slate-300"
        }`}>
          <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
          <span>{isBn ? "উচ্চ-নির্ভুল ভেক্টর মানচিত্র" : "High-Precision Vector GIS"}</span>
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
            <div className={`absolute bottom-4 left-4 z-20 px-3 py-2 rounded-xl border text-xs backdrop-blur-md ${
              theme === "light"
                ? "bg-white/95 border-slate-200 text-slate-700 shadow-md"
                : "bg-slate-900/90 border-slate-700 text-slate-300"
            }`}>
              <span className={`font-bold ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                {selectedDistrict ? (isBn ? selectedDistrict.bnName : selectedDistrict.name) : (isBn ? "সারাদেশ" : "Bangladesh")}
              </span>
              <span className="text-slate-400 ml-2">Satellite Layer Live</span>
            </div>
          </div>
        )}

        {/* 2. 64-DISTRICT SELECTABLE VECTOR MAP */}
        {mapMode === "districts" && (
          <svg
            ref={mapSvgRef}
            viewBox="0 0 600 872"
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
            <defs>
              <filter id="dist-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#10B981" floodOpacity="0.6" />
              </filter>
              <filter id="dist-glow-selected" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.8" />
              </filter>
              <filter id="dist-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Bay of Bengal stylized wash */}
            <path
              d="M 0,660 C 175,690 360,680 600,735 L 600,872 L 0,872 Z"
              fill={themeStyles.waterColor}
              opacity="0.85"
            />
            <text
              x="300"
              y="810"
              fontSize="16"
              fontWeight="900"
              fill={themeStyles.waterText}
              letterSpacing="8"
              textAnchor="middle"
              opacity="0.5"
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

                // Color calculation
                let fillColor = (geo as any).color || "#D4C2A5";
                if (theme === "emerald") {
                  fillColor = isSelected ? themeStyles.landSelected : isHovered ? themeStyles.landHover : themeStyles.landDefault;
                } else if (theme === "midnight") {
                  fillColor = isSelected ? themeStyles.landSelected : isHovered ? themeStyles.landHover : themeStyles.landDefault;
                } else if (theme === "atlas") {
                  fillColor = isSelected ? "#F59E0B" : isHovered ? "#FDE047" : getAtlasDivColor(dst.divisionId);
                } else if (theme === "light") {
                  fillColor = isSelected ? "#F59E0B" : isHovered ? "#10B981" : ((geo as any).color || "#E2E8F0");
                } else {
                  // Authentic reference colors
                  fillColor = isSelected ? "#F59E0B" : isHovered ? "#FEE08B" : ((geo as any).color || "#D4C2A5");
                }

                if (colorByViability && !isSelected) {
                  // Color code by Land Viability score (Grade A+: >90, A: 85-89, B+: 75-84, B: <75)
                  if (landMeta.viabilityScore >= 90) fillColor = "#10B981"; // Emerald green
                  else if (landMeta.viabilityScore >= 85) fillColor = "#38BDF8"; // Sky blue
                  else if (landMeta.viabilityScore >= 80) fillColor = "#FBBF24"; // Amber
                  else fillColor = "#FB7185"; // Rose
                }

                const strokeColor = isSelected
                  ? (theme === "light" ? "#0F172A" : "#FFFFFF")
                  : isHovered
                  ? "#0284C7"
                  : themeStyles.stroke;

                const strokeWidth = isSelected ? 2.5 : isHovered ? 1.8 : 0.85;

                return (
                  <g
                    key={dst.id}
                    id={`dst-${dst.id}`}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: isHovered || isSelected ? "scale(1.025)" : "scale(1)",
                      transformOrigin: `${geo.centroid[0]}px ${geo.centroid[1]}px`,
                    }}
                    onMouseEnter={() => {
                      setHoveredDistrict(dst);
                      const rect = mapSvgRef.current?.getBoundingClientRect();
                      if (rect) {
                        setTooltipPos({
                          x: (geo.centroid[0] / 600) * rect.width,
                          y: (geo.centroid[1] / 872) * rect.height,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredDistrict(null);
                      setTooltipPos(null);
                    }}
                    onClick={() => {
                      onSelectDistrict(dst);
                      const parentDiv = BANGLADESH_DIVISIONS.find((d) => d.id === dst.divisionId);
                      if (parentDiv) onSelectDivision(parentDiv);
                    }}
                  >
                    <path
                      d={geo.path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter={isSelected ? "url(#dist-glow-selected)" : isHovered ? "url(#dist-glow)" : "url(#dist-shadow)"}
                      className="transition-colors duration-150"
                    />

                    {/* Capital Pin for Dhaka */}
                    {dst.isCapital && (
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
                    {dst.isDivisionHQ && !dst.isCapital && (
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

                    {/* District Name Label */}
                    {showLabels && (
                      <text
                        x={geo.centroid[0]}
                        y={geo.centroid[1] + (dst.isCapital ? 9 : 4)}
                        textAnchor="middle"
                        fontSize={dst.isCapital ? (isBn ? "8.5" : "8") : dst.isDivisionHQ ? (isBn ? "7.5" : "7") : (isBn ? "6.2" : "5.8")}
                        fontWeight={dst.isCapital || dst.isDivisionHQ ? "800" : "600"}
                        fill={theme === "midnight" || theme === "emerald" ? "#FFFFFF" : "#0F172A"}
                        className="pointer-events-none select-none"
                        style={{
                          fontFamily: isBn ? "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" : "inherit",
                          letterSpacing: isBn ? "0px" : "-0.01em",
                          textShadow: theme === "reference" ? "0 1px 2px rgba(255,255,255,0.8)" : "0 1px 3px rgba(0,0,0,0.8)"
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

        {/* ── DYNAMIC HOVER TOOLTIP (FEATURE A: MICRO-INTELLIGENCE PREVIEW) ── */}
        {hoveredDistrict && tooltipPos && (() => {
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
              <div className={`rounded-2xl p-3.5 shadow-2xl backdrop-blur-md min-w-[250px] max-w-[290px] text-xs border transition-all ${
                theme === "light"
                  ? "bg-white/95 border-emerald-500/40 text-slate-800 shadow-slate-300/40"
                  : "bg-slate-900/95 border-emerald-500/50 text-slate-200"
              }`}>
                {/* Header: Name and Division */}
                <div className={`flex items-center justify-between gap-2 border-b pb-2 mb-2 ${
                  theme === "light" ? "border-slate-200" : "border-slate-700/80"
                }`}>
                  <div>
                    <span className={`font-black text-sm block leading-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
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
                  {/* Administrative Overview (Official BBS) */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">{isBn ? "প্রশাসনিক একক:" : "Administrative:"}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {intel.upazilas.length} {isBn ? "উপজেলা" : "Upazilas"} • {intel.pourashavasCount} {isBn ? "পৌরসভা" : "Paurashavas"}
                    </span>
                  </div>

                  {/* Institutions & Healthcare */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">{isBn ? "প্রতিষ্ঠান ও স্বাস্থ্য:" : "Institutions:"}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {intel.universitiesCount + intel.collegesCount} {isBn ? "কলেজ/ভার্সিটি" : "Higher Edu"} • {intel.hospitalsCount} {isBn ? "হাসপাতাল" : "Hospitals"}
                    </span>
                  </div>

                  {/* Tourist Attractions */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">{isBn ? "পর্যটন স্পট:" : "Attractions:"}</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                      {intel.attractionsCount} {isBn ? "চিহ্নিত স্থান" : "Tourist Spots"}
                    </span>
                  </div>

                  {/* Land Valuation & Listings */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">{isBn ? "ভূমি দর ও লিস্টিং:" : "Land Rate & Sale:"}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      ৳{(landMeta.avgPricePerKathaBDT / 100000).toFixed(1)}L/{isBn ? "কাঠা" : "Katha"} • {intel.landListingsCount} {isBn ? "বিক্রয়যোগ্য" : "Listings"}
                    </span>
                  </div>

                  {/* Suitability Index */}
                  <div className={`pt-1.5 border-t flex justify-between items-center text-[10px] ${
                    theme === "light" ? "border-slate-100" : "border-slate-800"
                  }`}>
                    <span className="text-slate-400">{isBn ? "উপযোগিতা সূচক:" : "Suitability Index:"}</span>
                    <div className="flex gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">Res {intel.suitabilityScores.residential}/100</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">Com {intel.suitabilityScores.commercial}/100</span>
                    </div>
                  </div>
                </div>

                {/* Footer Prompt */}
                <div className={`mt-2 pt-1.5 border-t text-[10px] flex items-center justify-between font-semibold ${
                  theme === "light" ? "border-slate-200 text-emerald-600" : "border-slate-800 text-emerald-400"
                }`}>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>{isBn ? "সম্পূর্ণ জেলা ড্যাশবোর্ডের জন্য ক্লিক করুন" : "Click for Full District Intel"}</span>
                  </div>
                  <ArrowRight size={11} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── MAP LEGEND (BOTTOM-LEFT) ── */}
        <div className={`absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 rounded-xl px-3 py-2 backdrop-blur-md text-[11px] border ${
          theme === "light"
            ? "bg-white/95 border-slate-200 text-slate-700 shadow-md"
            : "bg-slate-900/90 border-slate-800 text-slate-300"
        }`}>
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

      </div>

    </div>
  );
};
