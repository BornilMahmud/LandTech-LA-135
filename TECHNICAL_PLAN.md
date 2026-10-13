# LandWise AI — Technical Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

---

## 1. System Architecture & Module Boundaries

The project is built on **Vite 6 + React 19 + TypeScript + Tailwind CSS** with **Vitest** for deterministic testing.
The application is 100% frontend-only, self-contained, offline-capable, and deployable to Vercel/Netlify with zero server dependencies.

```
src/
├── components/
│   ├── BangladeshInteractiveMap.tsx      [PRESERVED & ENHANCED - 64-District Vector Map]
│   ├── DistrictIntelligenceDashboard.tsx [PRESERVED & ENHANCED - Cadastral & Infrastructure Dossier]
│   ├── LandCalculatorSection.tsx         [PRESERVED - Bangladeshi Land Unit Converter]
│   ├── CadastralExplorerSection.tsx      [PRESERVED - Mouza & Cadastral Status]
│   ├── Navbar.tsx                        [RESET & REBRANDED to LandWise AI Due-Diligence]
│   ├── Footer.tsx                        [RESET & REBRANDED with Bhumipedia / DLRS credits & legal disclaimer]
│   │
│   ├── duediligence/                     [NEW CORE ENGINE & UI COMPONENTS]
│   │   ├── DueDiligenceWorkbench.tsx     [Main Hub: Opportunity selector, Document workspace, Case manager]
│   │   ├── DocumentCard.tsx              [Individual Document Inspector: Deed, Khatian, Mutation, Tax]
│   │   ├── DocumentUploadModal.tsx       [Custom Document Uploader & Parser with Sample Presets]
│   │   ├── CrossVerificationMatrix.tsx   [12-Field Multi-Way Reconciliation & Discrepancy Table]
│   │   ├── ChainOfTitleVisualizer.tsx    [Historical Survey & Mutation Flow: CS -> SA -> RS -> Mutation -> Deed]
│   │   ├── EnvironmentalRiskCard.tsx     [Flood, River Erosion, Zoning, Road Accessibility Indicators]
│   │   └── DueDiligenceReportModal.tsx   [Comprehensive Downloadable Report (Print/PDF & JSON/Markdown)]
│
├── data/
│   ├── bangladeshDistrictsGeo.json       [PRESERVED - 64-District GeoJSON SVG geometries]
│   ├── bangladeshMapData.ts              [PRESERVED - Administrative Divisions & District stats]
│   ├── districtIntelligence.ts           [PRESERVED - Cadastral, Infrastructure, Economic intelligence]
│   ├── dueDiligenceCases.ts              [NEW - Rich authentic sample cases: Clean, Mismatch, Deficit]
│   └── legalDefinitions.ts               [NEW - Bhumipedia & SAT Act 1950 terminology & legal criteria]
│
├── utils/
│   ├── verificationEngine.ts             [NEW - Deterministic cross-document matching & red flag engine]
│   ├── verificationEngine.test.ts        [NEW - Vitest test suite for discrepancy detection]
│   ├── landUnits.ts                      [NEW & PRESERVED - Satak, Katha, Bigha, Acre, SqFt conversions]
│   └── reportGenerator.ts                [NEW - Due-Diligence report formatter (HTML/PDF-ready, Markdown)]
│
└── types/
    └── dueDiligence.ts                   [NEW - Strongly typed models for Land Documents, Findings, Checks]
```

---

## 2. Tasks Breakdown

- [ ] **Task 1: Core Type Definitions & Legal Data Structures**
  - Create `src/types/dueDiligence.ts` for all document types (Sale Deed / Saf-Kabala, Khatian CS/SA/RS/BS, Mutation / Namjari Porcha, Tax Dakhila), 12 extracted fields, verification findings, and risk levels.
  - Create `src/data/legalDefinitions.ts` capturing verified Bhumipedia statutory definitions and survey editions.

- [ ] **Task 2: Deterministic Cross-Verification Engine & TDD Suite**
  - Create `src/utils/verificationEngine.ts` to perform multi-way reconciliation:
    - Khatian number matching between deed and records
    - Dag number alignment (Sabek vs Hal dag)
    - Area reconciliation and delta calculation (with units: Satak, Katha, Bigha, Acres)
    - Owner/Seller name matching & fuzzy similarity
    - Chain-of-title completeness check (is Mutation present in seller's name?)
    - Tax Dakhila validity check (cleared up to current Bengali/English fiscal year)
  - Create `src/utils/verificationEngine.test.ts` with comprehensive unit tests for clean cases, mismatched dags, area deficits, and broken mutation chains.
  - Run and verify `vitest run`.

- [ ] **Task 3: Pre-Loaded Authentic Demonstration Cases**
  - Create `src/data/dueDiligenceCases.ts` with 3 highly detailed, authentic real-world Bangladesh test cases:
    - **Case 1: Savar, Dhaka (Clean Title & Complete Chain):** RS Khatian + Namjari Khatian in seller's name + Clear Dakhila + Deed draft matching 5.00 decimals. Low risk, verified evidence.
    - **Case 2: Patiya, Chittagong (Disputed Dag & Area Deficit):** Deed claims 8.50 decimals, but RS Khatian only grants 5.20 decimals share; Hal Dag cited without Sabek Dag link. High alert!
    - **Case 3: Sylhet Sadar (Broken Mutation Chain & Floodplain Risk):** Seller claims title via RS Khatian of deceased father, but NO Namjari mutation has been executed; land borders Surma river with severe seasonal flood risk. Critical Red Flag!
  - Provide custom document uploader allowing users to input their own deed/khatian numbers or paste document text with client-side field extraction.

- [ ] **Task 4: Clean Up Legacy & Unrelated Codebase Elements**
  - Safely remove unrelated pages and files:
    - `TourismExplorer.tsx`, `tourism.ts`, `accommodations.ts`
    - `LandFinder.tsx`, `PropertyComparison.tsx`, `SuitabilityModal.tsx`
  - Ensure `BangladeshInteractiveMap.tsx`, `HeroMapDossier.tsx`, `DistrictIntelligenceDashboard.tsx`, `LandCalculatorSection.tsx`, `CadastralExplorerSection.tsx` remain fully intact and operational.

- [ ] **Task 5: Build Due-Diligence UI Components**
  - Build `src/components/duediligence/DocumentCard.tsx` (displays document badges, extracted identifiers, and confidence indicators).
  - Build `src/components/duediligence/ChainOfTitleVisualizer.tsx` (graphical timeline showing CS -> SA -> RS -> Mutation -> Deed progression with break indicators).
  - Build `src/components/duediligence/CrossVerificationMatrix.tsx` (comparison table highlighting exact field matches, warnings, and discrepancies).
  - Build `src/components/duediligence/EnvironmentalRiskCard.tsx` (flood risk, river erosion, zoning compliance, and road frontage).
  - Build `src/components/duediligence/DocumentUploadModal.tsx` (custom document creator & parser).
  - Build `src/components/duediligence/DueDiligenceReportModal.tsx` (printable/downloadable PDF-ready report with verification roadmap).

- [ ] **Task 6: Assemble DueDiligenceWorkbench & Rebuild App.tsx**
  - Create `src/components/duediligence/DueDiligenceWorkbench.tsx` uniting the case selector, document intake, cross-verification matrix, environmental risks, and report trigger.
  - Rebuild `src/App.tsx` and `src/components/Navbar.tsx` around the new LandWise AI Due-Diligence workflow, seamlessly integrating the preserved 64-district interactive map.
  - Update `src/components/Footer.tsx` with proper attribution to Ministry of Land, Bhumipedia, DLRS, and clear legal disclaimer.

- [ ] **Task 7: Test Suite, Build Verification & Quality Assurance**
  - Run all Vitest unit tests to ensure 100% pass rate.
  - Run `npm run build` (`tsc -b && vite build`) to verify zero TypeScript errors and a clean production bundle.
  - Perform interactive browser testing to ensure smooth navigation, responsive design, interactive map selection, case switching, custom document upload, and report downloading.
