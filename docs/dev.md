# 💻 Developer Guide & Technical Architecture — LandTech-LA-135

**Target Audience:** Frontend Engineers, GIS Developers, Full-Stack Contributors  
**Stack:** React 19, TypeScript 5.7, Vite 6, Tailwind CSS 3.4, Lucide Icons  

---

## 1. Project Directory Structure

```plaintext
LandTech-LA-135/
├── docs/                             # Engineering & Project Documentation
│   ├── review.md                     # Code & Architecture Review
│   ├── pm.md                         # Product Requirements Document
│   ├── dev.md                        # Developer Guide (this document)
│   ├── qa.md                         # Quality Assurance & Test Matrix
│   ├── planning.md                   # Sprint Planning & Milestones
│   ├── coding.md                     # Coding Standards & Guidelines
│   ├── implementation.md             # Vector Extraction & Tech Report
│   └── updates.md                    # Changelog & Daily Updates
├── public/                           # Static assets & GIS icons
├── src/
│   ├── components/                   # Modular React UI Components
│   │   ├── Navbar.tsx                # Glassmorphic header & controls
│   │   ├── BangladeshInteractiveMap.tsx # 64-District & 8-Division SVG Engine
│   │   ├── HeroMapDossier.tsx        # District inspector & valuation card
│   │   ├── RegionQuickGrid.tsx       # Fast-access divisions & hubs
│   │   ├── LandCalculatorSection.tsx # Bangladeshi land unit converter
│   │   ├── CadastralExplorerSection.tsx # Mouza, dag, and khatian registry
│   │   ├── SpatialFeaturesSection.tsx# 4-column GIS feature matrix
│   │   └── Footer.tsx                # Bottom metadata & credits
│   ├── data/
│   │   ├── bangladeshDistrictsGeo.json # Authentic 64-district SVG paths
│   │   ├── bangladeshMapData.ts      # Vector divisions, districts & flows
│   │   └── landtechData.ts           # Valuation benchmarks, zoning & infra
│   ├── App.tsx                       # Master Application Layout
│   ├── index.css                     # Tailwind tokens, fonts & animations
│   └── main.tsx                      # Vite React 19 bootstrap entry
├── index.html                        # HTML5 entry with Hind Siliguri font
├── package.json                      # Dependencies & NPM scripts
├── tailwind.config.js                # Design system color tokens
├── tsconfig.json                     # Strict TypeScript configuration
└── vite.config.ts                    # Vite build configuration with @ alias
```

---

## 2. Component Hierarchy & State Flow

```
[ App.tsx ]
   ├── state: isBn (boolean)
   ├── state: theme ("reference" | "emerald" | "atlas" | "midnight")
   ├── state: selectedDistrict (DistrictData)
   ├── state: selectedDivision (DivisionData)
   │
   ├── <Navbar /> (receives language, theme, and triggers quick nav)
   ├── <BangladeshInteractiveMap /> (renders SVG, pan/zoom, handles district click)
   ├── <HeroMapDossier /> (inspects active district, calculates katha price)
   ├── <RegionQuickGrid /> (allows one-click switching of 8 divisions & 8 hubs)
   ├── <CadastralExplorerSection /> (displays mock dag/khatian for selected district)
   ├── <LandCalculatorSection /> (converts Decimal/Katha/Bigha with active rate)
   ├── <SpatialFeaturesSection /> (static GIS architecture pillars)
   └── <Footer />
```

---

## 3. Data Schema Specifications

### 3.1. District Data (`DistrictData`)
```typescript
export interface DistrictData {
  id: string;              // e.g. "dhaka", "chattogram", "sylhet"
  name: string;            // English Name (e.g. "Dhaka")
  bnName: string;          // Bangla Name (e.g. "ঢাকা")
  divisionId: string;      // e.g. "dhaka", "chittagong"
  divisionName: string;    // e.g. "Dhaka"
  bnDivisionName: string;  // e.g. "ঢাকা"
  x: number;               // Centroid X
  y: number;               // Centroid Y
  isCapital?: boolean;     // Highlight capital with red pulse beacon
  isDivisionHQ?: boolean;  // Highlight division HQ with blue dot
  tps: number;             // Activity rate
  volume: number;          // Financial/Land volume in BDT
  wallets: number;         // Active cadastral accounts
  riskScore: number;       // Title/Dispute Risk index
  riskTier: "Critical" | "High" | "Normal";
  anomaly: string;         // Unique regional characteristic (English)
  bnAnomaly: string;       // Unique regional characteristic (Bangla)
}
```

### 3.2. LandTech Metadata (`LandDistrictMeta`)
```typescript
export interface LandDistrictMeta {
  areaSqKm: number;
  population: string;
  avgPricePerKathaBDT: number;   // In BDT (e.g. 8,500,000 for Dhaka)
  cadastralSurvey: "BRS Digital" | "City Survey Verified" | "RS Validated" | "e-Cadastre Pilot";
  zoning: "Commercial CBD" | "High-Density Residential" | "Industrial / SEZ" | "Agro-Greenbelt" | "Coastal & Port" | "Eco-Reserve";
  viabilityScore: number;        // 0 - 100
  floodRisk: "Minimal (Zone 1)" | "Moderate (Zone 2)" | "High (Riverine / Basin)";
  growthRateYoY: number;         // Annual appreciation %
  keyInfra: string;              // Transit corridors & megaprojects (English)
  bnKeyInfra: string;            // Transit corridors & megaprojects (Bangla)
}
```

---

## 4. Development Workflow

### Installation
```bash
npm install
```

### Local Dev Server
```bash
npm run dev
# Running on http://localhost:3000/
```

### Type Checking & Build
```bash
npm run build
# Runs tsc -b && vite build
```

---

## 5. Adding New Spatial Features

To register a new district or alter geographic coordinates:
1. Update `src/data/bangladeshDistrictsGeo.json` with the new SVG `<path d="..." />`.
2. Ensure the `id` matches an entry in `ALL_BANGLADESH_DISTRICTS` in `src/data/bangladeshMapData.ts`.
3. Add specific land metrics to `DISTRICT_LAND_DATA` in `src/data/landtechData.ts`.
