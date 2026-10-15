import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ThemeToggle } from './ThemeToggle';
import {
  ALL_BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  DistrictData,
  DivisionData,
} from '../data/bangladeshMapData';

interface NavbarProps {
  isBn: boolean;
  setIsBn: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  selectedDistrictName: string;
  selectedDistrict?: DistrictData | null;
  onSelectDistrict?: (d: DistrictData) => void;
  districts?: DistrictData[];
  divisions?: DivisionData[];
  onOpenQuickSelect?: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isBn,
  setIsBn,
  theme,
  setTheme,
  selectedDistrictName,
  selectedDistrict,
  onSelectDistrict,
  districts = ALL_BANGLADESH_DISTRICTS,
  divisions = BANGLADESH_DIVISIONS,
  onOpenQuickSelect,
  activeSection,
  setActiveSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [selectedDivisionTab, setSelectedDivisionTab] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isLight = theme === "light";

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDistrictDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDistrictDropdownOpen(false);
      }
    };

    if (isDistrictDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDistrictDropdownOpen]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesDivision =
        selectedDivisionTab === 'all' || d.divisionId === selectedDivisionTab;
      const q = districtSearch.trim().toLowerCase();
      if (!q) return matchesDivision;

      const matchesQuery =
        d.name.toLowerCase().includes(q) ||
        d.bnName.includes(q) ||
        d.divisionName.toLowerCase().includes(q) ||
        d.bnDivisionName.includes(q);

      return matchesDivision && matchesQuery;
    });
  }, [districts, selectedDivisionTab, districtSearch]);

  const handleDistrictSelect = (district: DistrictData) => {
    if (onSelectDistrict) {
      onSelectDistrict(district);
    }
    setIsDistrictDropdownOpen(false);
    setDistrictSearch('');

    // Smoothly scroll to map if not currently viewing hero-map
    const heroMap = document.getElementById('hero-map');
    if (heroMap) {
      heroMap.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    {
      id: 'hero-map',
      labelEn: 'Map',
      labelBn: 'মানচিত্র',
      icon: <i className="bx bx-map-alt text-sm" aria-hidden="true" />,
    },
    {
      id: 'how-it-works',
      labelEn: 'The Story',
      labelBn: 'গল্প ও কার্যপদ্ধতি',
      icon: <i className="bx bx-book-open text-sm text-emerald-600 dark:text-emerald-400" aria-hidden="true" />,
      highlight: true,
    },
    {
      id: 'due-diligence',
      labelEn: 'Graph',
      labelBn: 'গ্রাফ',
      icon: <i className="bx bx-git-repo-forked text-sm" aria-hidden="true" />,
      highlight: true,
    },
    {
      id: 'trusted-infrastructure',
      labelEn: 'Impact & ROI',
      labelBn: 'বিজনেস ও আরওআই',
      icon: <i className="bx bx-buildings text-sm text-emerald-500" aria-hidden="true" />,
      highlight: true,
    },
    {
      id: 'district-dashboard',
      labelEn: 'Cadastre',
      labelBn: 'ক্যাডাস্ট্রে',
      icon: <i className="bx bx-analyse text-sm" aria-hidden="true" />,
    },
    {
      id: 'calculator',
      labelEn: 'Calculator',
      labelBn: 'ক্যালকুলেটর',
      icon: <i className="bx bx-calculator text-sm" aria-hidden="true" />,
    },
    {
      id: 'landtech-track',
      labelEn: 'LandTech 2026',
      labelBn: 'ল্যান্ডটেক ২০২৬',
      icon: <i className="bx bx-award text-sm text-emerald-500" aria-hidden="true" />,
      highlight: true,
    },
    {
      id: 'cadastre',
      labelEn: 'Mouza',
      labelBn: 'মৌজা',
      icon: <i className="bx bx-compass text-sm" aria-hidden="true" />,
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-md transition-colors ${
      isLight 
        ? "bg-white/92 border-b border-[#E4E4E7] text-[#09090B]" 
        : "bg-[#09090B]/92 border-b border-[#27272A] text-[#FAFAFA]"
    }`}>
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Pure Brand Text — BMS High Contrast Typography */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-heading font-black text-lg sm:text-xl tracking-tight text-[#09090B] dark:text-[#FAFAFA] hover:opacity-80 transition-opacity flex items-center"
            >
              <span>LandWise</span>
              <span className="text-[#16A34A] dark:text-[#4ADE80] font-black text-xl leading-none ml-0.5">.</span>
            </button>
          </div>

          {/* Desktop Navigation Links — BMS segmented pill style */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F4F4F5] dark:bg-[#121215] p-1 rounded-xl border border-[#E4E4E7] dark:border-[#27272A]">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-[#18181B] text-[#09090B] dark:text-white shadow-xs border border-[#E4E4E7] dark:border-[#27272A]'
                      : item.highlight
                      ? 'text-[#16A34A] dark:text-[#4ADE80] hover:text-[#09090B] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#18181B]/60'
                      : 'text-[#52525B] dark:text-[#A1A1AA] hover:text-[#09090B] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#18181B]/60'
                  }`}
                >
                  {item.icon}
                  <span>{isBn ? item.labelBn : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Quick District, Lang & Theme */}
          <div className="flex items-center gap-2">
            
            {/* Quick District Selector Dropdown Button — BMS btn-line */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                  isDistrictDropdownOpen
                    ? isLight
                      ? "bg-zinc-100 border-zinc-400 text-zinc-900 ring-2 ring-emerald-500/20"
                      : "bg-[#18181B] border-zinc-600 text-white ring-2 ring-emerald-500/20"
                    : isLight 
                    ? "bg-white border-[#E4E4E7] text-[#09090B] hover:bg-[#FAFAFA] hover:border-[#D4D4D8]" 
                    : "bg-[#121215] border-[#27272A] text-[#FAFAFA] hover:bg-[#18181B] hover:border-[#3F3F46]"
                }`}
                title={isBn ? "জেলা নির্বাচন করুন" : "Select District"}
                aria-expanded={isDistrictDropdownOpen}
              >
                <i className="bx bx-map-pin text-[#16A34A] dark:text-[#4ADE80] text-sm" aria-hidden="true" />
                <span className="max-w-[95px] sm:max-w-[120px] truncate">{selectedDistrictName}</span>
                <i
                  className={`bx bx-chevron-down text-[#71717A] text-xs transition-transform duration-200 ${
                    isDistrictDropdownOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* District Dropdown Popover */}
              {isDistrictDropdownOpen && (
                <div
                  className={`absolute top-full right-0 mt-2 w-[340px] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl backdrop-blur-xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 ${
                    isLight
                      ? "bg-white border-zinc-200 text-zinc-900 shadow-zinc-900/15"
                      : "bg-[#121215] border-zinc-800 text-white shadow-2xl"
                  }`}
                >
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h4 className="text-xs font-bold tracking-tight">
                        {isBn ? "৬৪টি জেলা থেকে নির্বাচন করুন" : "Select Bangladesh District"}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {filteredDistricts.length} {isBn ? "টি জেলা" : "districts"}
                    </span>
                  </div>

                  {/* Search Input Bar */}
                  <div className="relative">
                    <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400" aria-hidden="true" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      placeholder={isBn ? "জেলা বা বিভাগ খুঁজুন (উদাঃ চট্টগ্রাম, ঢাকা)..." : "Search district or division (e.g. Chattogram)..."}
                      className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs border outline-none font-medium transition-colors ${
                        isLight
                          ? "bg-zinc-50 border-zinc-200 text-zinc-900 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          : "bg-[#18181B] border-zinc-800 text-white focus:bg-[#202025] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                    />
                    {districtSearch && (
                      <button
                        type="button"
                        onClick={() => setDistrictSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Division Filter Strip */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedDivisionTab('all')}
                      className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                        selectedDivisionTab === 'all'
                          ? "bg-emerald-600 text-white shadow-xs"
                          : isLight
                          ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {isBn ? "সকল বিভাগ" : "All"}
                    </button>
                    {divisions.map((div) => {
                      const isDivActive = selectedDivisionTab === div.id;
                      return (
                        <button
                          key={div.id}
                          type="button"
                          onClick={() => setSelectedDivisionTab(div.id)}
                          className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all ${
                            isDivActive
                              ? "bg-emerald-600 text-white shadow-xs font-semibold"
                              : isLight
                              ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                              : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                          }`}
                        >
                          {isBn ? div.bnName.replace(' বিভাগ', '') : div.name.replace(' Division', '')}
                        </button>
                      );
                    })}
                  </div>

                  {/* Scrollable Districts Grid */}
                  <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                    {filteredDistricts.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-500">
                        <i className="bx bx-search-alt text-2xl block mb-1 text-zinc-400" aria-hidden="true" />
                        <span>{isBn ? "কোনো জেলা খুঁজে পাওয়া যায়নি" : "No matching district found"}</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {filteredDistricts.map((d) => {
                          const isSelected =
                            selectedDistrict?.id === d.id ||
                            selectedDistrictName === d.name ||
                            selectedDistrictName === d.bnName;
                          return (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => handleDistrictSelect(d)}
                              className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between border ${
                                isSelected
                                  ? isLight
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-xs"
                                    : "bg-emerald-950/40 border-emerald-600/50 text-emerald-200 font-semibold shadow-xs"
                                  : isLight
                                  ? "bg-zinc-50/60 hover:bg-zinc-100 border-zinc-200/70 text-zinc-800"
                                  : "bg-[#18181B]/60 hover:bg-[#202025] border-zinc-800/80 text-zinc-200 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <i className={`bx bx-map-pin text-sm shrink-0 ${isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`} aria-hidden="true" />
                                <div className="truncate">
                                  <div className="font-semibold text-xs leading-snug truncate">
                                    {isBn ? d.bnName : d.name}
                                  </div>
                                  <div className={`text-[10px] leading-tight truncate ${isLight ? "text-zinc-500" : "text-zinc-400"}`}>
                                    {isBn ? d.name : d.bnName} • {isBn ? d.bnDivisionName : d.divisionName}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs ml-1.5 shrink-0">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher — BMS segmented toggle */}
            <div className={`inline-flex items-center p-0.5 rounded-lg border text-xs font-bold ${
              isLight ? "bg-[#FAFAFA] border-[#E4E4E7]" : "bg-[#121215] border-[#27272A]"
            }`}>
              <button
                type="button"
                onClick={() => setIsBn(false)}
                className={`px-2 py-1 rounded-[6px] transition-all text-xs ${
                  !isBn
                    ? "bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] shadow-xs"
                    : "text-[#71717A] hover:text-[#09090B] dark:hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setIsBn(true)}
                className={`px-2 py-1 rounded-[6px] transition-all text-xs font-bangla ${
                  isBn
                    ? "bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] shadow-xs"
                    : "text-[#71717A] hover:text-[#09090B] dark:hover:text-white"
                }`}
              >
                বাং
              </button>
            </div>

            {/* Theme Toggle matching newDark_portfolio + BMS square icon button */}
            <ThemeToggle theme={theme} setTheme={setTheme} />

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#18181B] transition-colors border border-[#E4E4E7] dark:border-[#27272A]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <i className="bx bx-x text-xl" aria-hidden="true" />
              ) : (
                <i className="bx bx-menu text-xl" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E4E4E7] dark:border-[#27272A] py-3 space-y-2">
            {/* Quick district selector in mobile menu */}
            <div className="px-1 pb-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDistrictDropdownOpen(true);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold ${
                  isLight ? "bg-zinc-50 border-zinc-200 text-zinc-900" : "bg-[#18181B] border-zinc-800 text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <i className="bx bx-map-pin text-emerald-600 text-base" aria-hidden="true" />
                  <span>{isBn ? "বর্তমান জেলা:" : "Current District:"} <strong>{selectedDistrictName}</strong></span>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">{isBn ? "পরিবর্তন করুন →" : "Change →"}</span>
              </button>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#09090B] text-white dark:bg-[#FAFAFA] dark:text-[#09090B] shadow-xs'
                    : 'text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#18181B]'
                }`}
              >
                {item.icon}
                <span>{isBn ? item.labelBn : item.labelEn}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
