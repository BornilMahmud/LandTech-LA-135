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
    },
    {
      id: 'how-it-works',
      labelEn: 'Story',
      labelBn: 'গল্প',
      highlight: true,
    },
    {
      id: 'due-diligence',
      labelEn: 'Graph',
      labelBn: 'গ্রাফ',
      highlight: true,
    },
    {
      id: 'trusted-infrastructure',
      labelEn: 'Impact',
      labelBn: 'প্রভাব',
      highlight: true,
    },
    {
      id: 'district-dashboard',
      labelEn: 'Cadastre',
      labelBn: 'ক্যাডাস্ট্রে',
    },
    {
      id: 'calculator',
      labelEn: 'Calculator',
      labelBn: 'হিসাব',
    },
    {
      id: 'landtech-track',
      labelEn: 'LandTech',
      labelBn: 'ল্যান্ডটেক',
      highlight: true,
    },
    {
      id: 'cadastre',
      labelEn: 'Mouza',
      labelBn: 'মৌজা',
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
        ? "bg-[#FAF9F5]/95 border-b border-[#E8E3DA] text-[#191817]" 
        : "bg-[#141413]/95 border-b border-[#2B2A27] text-[#FAF9F5]"
    }`}>
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Research-Journal Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-lg sm:text-xl tracking-tight text-[#191817] dark:text-[#FAF9F5] hover:opacity-85 transition-opacity flex items-center gap-2.5"
            >
              <img src="/logo.svg" alt="LandWise" className="w-7 h-7 rounded-[7px] border border-[#2E2D2B] shadow-sm flex-shrink-0" />
              <div className="flex items-baseline">
                <span className="font-serif font-semibold tracking-tight">LandWise</span>
                <span className="text-[#CC5A2B] font-bold text-xl leading-none ml-0.5">.</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links — Editorial Segmented Bar */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F3EFE8] dark:bg-[#1E1E1C] p-1 rounded-[6px] border border-[#E8E3DA] dark:border-[#2B2A27]">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1 rounded-[4px] text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#FAF9F5] dark:bg-[#141413] text-[#191817] dark:text-[#FAF9F5] shadow-xs border border-[#E8E3DA] dark:border-[#2B2A27] font-semibold'
                      : item.highlight
                      ? 'text-[#CC5A2B] hover:text-[#191817] dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#141413]/50'
                      : 'text-[#706E6B] dark:text-[#9E9B95] hover:text-[#191817] dark:hover:text-white hover:bg-white/50 dark:hover:bg-[#141413]/50'
                  }`}
                >
                  <span>{isBn ? item.labelBn : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Quick District, Lang & Theme */}
          <div className="flex items-center gap-2">
            
            {/* Quick District Selector Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                className={`h-8 inline-flex items-center gap-1.5 px-3 rounded-[4px] border text-xs font-medium transition-all shadow-xs cursor-pointer ${
                  isDistrictDropdownOpen
                    ? isLight
                      ? "bg-[#FAF0EB] border-[#F3D5C6] text-[#CC5A2B]"
                      : "bg-[#2B2A27] border-[#383632] text-[#FAF9F5]"
                    : isLight 
                    ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#191817] hover:bg-[#F3EFE8] hover:border-[#D5CEC2]" 
                    : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5] hover:bg-[#2B2A27] hover:border-[#383632]"
                }`}
                title={isBn ? "জেলা নির্বাচন করুন" : "Select District"}
                aria-expanded={isDistrictDropdownOpen}
              >
                <i className="bx bx-map-pin text-[#CC5A2B] text-sm" aria-hidden="true" />
                <span className="max-w-[95px] sm:max-w-[120px] truncate">{selectedDistrictName}</span>
                <i
                  className={`bx bx-chevron-down text-[#706E6B] text-xs transition-transform duration-150 ${
                    isDistrictDropdownOpen ? "rotate-180 text-[#CC5A2B]" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* District Dropdown Popover */}
              {isDistrictDropdownOpen && (
                <div
                  className={`absolute top-full right-0 mt-2 w-[340px] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-[6px] border shadow-editorial backdrop-blur-xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 ${
                    isLight
                      ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#191817]"
                      : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5]"
                  }`}
                >
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#E8E3DA] dark:border-[#2B2A27]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#CC5A2B]"></span>
                      <h4 className="text-xs font-semibold tracking-tight">
                        {isBn ? "৬৪টি জেলা থেকে নির্বাচন করুন" : "Select Bangladesh District"}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#F3EFE8] dark:bg-[#2B2A27] text-[#706E6B] dark:text-[#9E9B95]">
                      {filteredDistricts.length} {isBn ? "টি জেলা" : "districts"}
                    </span>
                  </div>

                  {/* Search Input Bar */}
                  <div className="relative">
                    <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9E9B95]" aria-hidden="true" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      placeholder={isBn ? "জেলা বা বিভাগ খুঁজুন (উদাঃ চট্টগ্রাম, ঢাকা)..." : "Search district or division (e.g. Chattogram)..."}
                      className={`w-full pl-8 pr-7 py-1.5 rounded-[4px] text-xs border outline-none font-medium transition-colors ${
                        isLight
                          ? "bg-white border-[#E8E3DA] text-[#191817] focus:border-[#CC5A2B] focus:ring-1 focus:ring-[#CC5A2B]/20"
                          : "bg-[#141413] border-[#2B2A27] text-[#FAF9F5] focus:border-[#CC5A2B] focus:ring-1 focus:ring-[#CC5A2B]/20"
                      }`}
                    />
                    {districtSearch && (
                      <button
                        type="button"
                        onClick={() => setDistrictSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9E9B95] hover:text-[#191817] dark:hover:text-white p-0.5"
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
                      className={`px-2 py-1 rounded-[4px] font-medium shrink-0 transition-all ${
                        selectedDivisionTab === 'all'
                          ? "bg-[#CC5A2B] text-[#FAF9F5] shadow-xs"
                          : isLight
                          ? "bg-[#F3EFE8] hover:bg-[#EDE7DD] text-[#706E6B] hover:text-[#191817]"
                          : "bg-[#2B2A27] hover:bg-[#383632] text-[#9E9B95] hover:text-white"
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
                          className={`px-2 py-1 rounded-[4px] font-medium shrink-0 transition-all ${
                            isDivActive
                              ? "bg-[#CC5A2B] text-[#FAF9F5] shadow-xs font-semibold"
                              : isLight
                              ? "bg-[#F3EFE8] hover:bg-[#EDE7DD] text-[#706E6B] hover:text-[#191817]"
                              : "bg-[#2B2A27] hover:bg-[#383632] text-[#9E9B95] hover:text-white"
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
                      <div className="py-6 text-center text-xs text-[#706E6B]">
                        <i className="bx bx-search-alt text-2xl block mb-1 text-[#9E9B95]" aria-hidden="true" />
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
                              className={`w-full text-left p-2 rounded-[4px] text-xs transition-all flex items-center justify-between border ${
                                isSelected
                                  ? isLight
                                    ? "bg-[#FAF0EB] border-[#F3D5C6] text-[#CC5A2B] font-semibold"
                                    : "bg-[#2B2A27] border-[#383632] text-[#FAF9F5] font-semibold"
                                  : isLight
                                  ? "bg-white hover:bg-[#F3EFE8] border-[#E8E3DA] text-[#191817]"
                                  : "bg-[#141413]/60 hover:bg-[#2B2A27] border-[#2B2A27] text-[#FAF9F5]"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <i className={`bx bx-map-pin text-sm shrink-0 ${isSelected ? "text-[#CC5A2B]" : "text-[#9E9B95]"}`} aria-hidden="true" />
                                <div className="truncate">
                                  <div className="font-semibold text-xs leading-snug truncate">
                                    {isBn ? d.bnName : d.name}
                                  </div>
                                  <div className={`text-[10px] leading-tight truncate ${isLight ? "text-[#706E6B]" : "text-[#9E9B95]"}`}>
                                    {isBn ? d.name : d.bnName} • {isBn ? d.bnDivisionName : d.divisionName}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <span className="text-[#CC5A2B] font-bold text-xs ml-1.5 shrink-0">
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

            {/* Language Switcher Single Button (Matches h-8 height, toggles on click) */}
            <button
              type="button"
              onClick={() => setIsBn((prev) => !prev)}
              title={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              aria-label="Toggle language between English and Bangla"
              className={`h-8 px-2.5 inline-flex items-center justify-center gap-1 rounded-[4px] border text-xs font-mono transition-all shadow-xs cursor-pointer select-none ${
                isLight
                  ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#191817] hover:bg-[#F3EFE8] hover:border-[#D5CEC2]"
                  : "bg-[#1E1E1C] border-[#2B2A27] text-[#FAF9F5] hover:bg-[#2B2A27] hover:border-[#383632]"
              }`}
            >
              <span className={`transition-colors ${!isBn ? "text-[#CC5A2B] font-bold" : "text-[#706E6B] dark:text-[#9E9B95]"}`}>
                EN
              </span>
              <span className="text-[#D5CEC2] dark:text-[#383632] text-[10px] select-none">/</span>
              <span className={`transition-colors font-bangla ${isBn ? "text-[#CC5A2B] font-bold" : "text-[#706E6B] dark:text-[#9E9B95]"}`}>
                বাং
              </span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} setTheme={setTheme} />

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 inline-flex items-center justify-center rounded-[4px] text-[#706E6B] dark:text-[#9E9B95] hover:bg-[#F3EFE8] dark:hover:bg-[#1E1E1C] transition-colors border border-[#E8E3DA] dark:border-[#2B2A27]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <i className="bx bx-x text-lg" aria-hidden="true" />
              ) : (
                <i className="bx bx-menu text-lg" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E3DA] dark:border-[#2B2A27] py-3 space-y-2">
            {/* Quick district selector in mobile menu */}
            <div className="px-1 pb-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsDistrictDropdownOpen(true);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-[4px] border text-xs font-semibold ${
                  isLight ? "bg-[#FAF9F5] border-[#E8E3DA] text-[#191817]" : "bg-[#1E1E1C] border-[#2B2A27] text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <i className="bx bx-map-pin text-[#CC5A2B] text-base" aria-hidden="true" />
                  <span>{isBn ? "বর্তমান জেলা:" : "Current District:"} <strong>{selectedDistrictName}</strong></span>
                </div>
                <span className="text-xs text-[#CC5A2B] font-semibold">{isBn ? "পরিবর্তন করুন →" : "Change →"}</span>
              </button>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-[4px] text-xs font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#191817] text-[#FAF9F5] dark:bg-[#FAF9F5] dark:text-[#191817] shadow-xs'
                    : 'text-[#706E6B] dark:text-[#9E9B95] hover:bg-[#F3EFE8] dark:hover:bg-[#1E1E1C]'
                }`}
              >
                <span>{isBn ? item.labelBn : item.labelEn}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
