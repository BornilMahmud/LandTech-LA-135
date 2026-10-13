# LandWise AI — Master Project Specification & Control Document
**Document ID:** `PROJECT_MASTER`  
**Classification:** Single Source of Truth (SSOT)  
**Version:** 3.0.0 (Production Verified)  
**Date:** October 2026  
**Operating Team:** LandWise AI Geospatial Engineering & Title Forensics Architecture  

---

## 1. Product Identity & Purpose

**LandWise AI** is a Bangladesh Geospatial Intelligence, Interactive Administrative Explorer, and Land Due-Diligence Platform.

It bridges two tightly connected capabilities in one cohesive product:
1. **Deep, Animated Geographic Exploration of Bangladesh:**
   - Multi-tier progressive zoom from national 64-district boundaries down to district intelligence, upazila boundaries, pourashavas, local road networks, educational/health/land institutions, and cadastral survey plots.
   - Built on React 19 + TypeScript + MapLibre GL JS v5.15+ + Authenticated CARTO Basemaps (Voyager, Positron, Dark Matter) + Turf.js.
   - Real highway and street route calculation via the Open Source Routing Machine (OSRM) with turn-by-turn guidance and a strict anti-fabrication fallback policy.
2. **Authoritative Pre-Purchase Land Due-Diligence System:**
   - In-browser document ingestion and parsing for Deeds (*Saf-Kabala*), Khatians (*CS, SA, RS, BS*), Mutation records (*e-Namjari*), and Tax Dakhilas.
   - 12-field cross-verification matrix with 5 categorical statuses: *Exact Match*, *Potential Match*, *Inconsistency*, *Missing Evidence*, and *Unable to Verify*.
   - Historical Chain-of-Title visualizer tracking statutory survey and mutation progression.
   - Environmental hazard evaluation (flood exposure, riverbank erosion proximity, *Smart Bhumi Naksha* zoning, road access).
   - Downloadable comprehensive Due-Diligence Dossier (Print/PDF, Markdown, JSON).

---

## 2. Technical Constraints & Architecture

1. **100% Frontend-Only Execution:**
   - Single Page Application (SPA) built with Vite 6 + React 19 + TypeScript + Tailwind CSS.
   - Zero backend server runtime (no Node/Express/Python/Go server required for core operations). Fully static hosting ready.
2. **Absolute Client-Side Privacy:**
   - User-supplied documents are processed exclusively in browser memory via `FileReader`.
   - Zero remote transmission of deeds, personal names, tax records, or national ID numbers.
   - Zero console leakage of sensitive document contents.
3. **Honest Data Provenance & Anti-Fabrication Mandate:**
   - Road routes are rendered **only** when returned by the real OSRM routing engine along mapped roads; straight-line approximations are prohibited.
   - Missing geographic or institutional features are transparently labeled as unavailable; no fake upazila boundaries, fictitious schools, or fabricated plot boundaries are ever generated.
   - Synthetic demonstration packages are explicitly labeled: *"SYNTHETIC DEMONSTRATION — NOT A VERIFIED REAL PROPERTY"*.
4. **Statutory Legal Integrity:**
   - Explicit statutory disclaimers declaring that LandWise AI is an assistive pre-screening tool; it never certifies legal ownership, issues title warranties, declares criminal fraud, or replaces official search at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms.

---

## 3. Geographic Exploration Hierarchy (4 Levels)

```
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1 — BANGLADESH OVERVIEW                                          │
│ • 64 District boundaries & centroids                                   │
│ • Division filters (8 divisions) & district search                     │
│ • Animated flyTo camera movement into selected district bounds         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click District
┌───────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 2 — DISTRICT INTELLIGENCE DOSSIER                                │
│ • District boundary highlight & geographic extent                      │
│ • Selectable Upazila boundaries and pourashava municipal flags         │
│ • National highways (N1, N2, N704, etc.) and major rivers              │
│ • District intelligence dossier (census, literacy, land issues)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click Upazila
┌───────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 3 — LOCAL INFRASTRUCTURE & ROADS                                 │
│ • Secondary road network & city streets                                │
│ • Verified POIs: Schools, colleges, hospitals, markets, AC Land office │
│ • Selectable POI cards with category, coordinates, and route actions   │
│ • Integrated OSRM real road navigator (turn-by-turn guidance)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click Cadastral View / Parcel
┌───────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 4 — CADASTRAL & PLOT INVESTIGATION                               │
│ • Cadastral survey editions: CS, SA, RS, BRS, BDS records              │
│ • Parcel boundaries, Dag numbers, Khatian numbers, and land zoning     │
│ • Official DLRS map purchase workflow & ePorcha deep links             │
│ • 1-Click CTA: "Investigate in Land Due-Diligence Workspace"           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Land-Management & Verification Architecture

### 4.1 Document Intake & Regex Parser
- Supported file formats: `.txt`, `.json`, `.csv`, images/PDFs with client-side fallback.
- In-memory regex extraction for 12 critical Bengali & English identifiers:
  1. Deed Number (`দলিল নং`)
  2. Registration Date
  3. Sub-Registry Jurisdiction
  4. Survey Edition (`CS`, `SA`, `RS`, `BS/BRS`, `BDS`)
  5. Khatian Number (`খতিয়ান নং / খতিয়ান নং`)
  6. Dag / Plot Number (`দাগ নং`)
  7. Mouza Name (`মৌজা`) & J.L. Number (`জে.এল. নং`)
  8. Seller / Declared Owner Name (`মালিকের নাম / বিক্রেতা`)
  9. Buyer Name (`গ্রহীতার নাম / ক্রেতা`)
  10. Statutory Share (*হিস্যা*)
  11. Land Area & Unit Reconciliation (Satak/Decimals, Katha, Bigha, Acres, Sq Ft)
  12. Land Development Tax Dakhila Fiscal Year (`১৪৩১ বঙ্গাব্দ`)

### 4.2 Deterministic 12-Field Verification Matrix
Reconciles all supplied documents into 5 categorical findings:
- **Exact Match:** Identical field values across all supplied documents.
- **Potential Match:** Minor variation (e.g., spelling transliteration, minor decimal rounding).
- **Inconsistency:** Conflict between documents (e.g., Deed claimed area exceeds Khatian recorded share).
- **Missing Evidence:** Mandatory statutory document absent (e.g., no e-Mutation in seller's name).
- **Unable to Verify:** Incomplete text or unreadable identifier.

### 4.3 Chain of Title & Hazard Analysis
- Visualizes the statutory progression: $\text{CS} \rightarrow \text{SA} \rightarrow \text{RS} \rightarrow \text{e-Mutation} \rightarrow \text{Registered Deed}$.
- Flags missing mutation under the *Land Crime Prevention and Redress Act 2023*.
- Cross-references parcel coordinates with environmental risk layers:
  - Flood Exposure Index (Low, Moderate, High)
  - Riverbank Erosion Proximity (Padma, Jamuna, Meghna, Gorai, Surma)
  - Smart Bhumi Naksha Zoning (Agricultural, Residential, Commercial, Wetland)
  - Road Frontage & Right-of-Way Access

---

## 5. Technology Stack & Key Dependencies

| Component | Library / Service | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | UI state management & component hierarchy |
| **Build Tool** | Vite 6 | Development server, HMR, and production bundler |
| **Vector Map Engine** | MapLibre GL JS v5.15+ | GPU-accelerated web vector map rendering |
| **Basemap Tiles** | CARTO Basemaps | Authenticated Voyager, Positron, Dark Matter tiles |
| **Spatial Analysis** | Turf.js v7.3.4 | Client-side bounding boxes, centroids, distance metrics |
| **Highway Routing** | OSRM Driving API | Real road navigation along mapped highways |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern styling with accessible contrast |
| **Unit Testing** | Vitest v3.2.7 | Fast deterministic test runner (37 tests across 8 suites) |

---

## 6. Official Portal Citations & Reference Sources

1. **Bhumipedia (`bhumipedia.land.gov.bd`):** Statutory legal definitions under SAT Act 1950, Land Crime Act 2023, Land Reform Act 2023.
2. **Department of Land Records & Surveys — DLRS (`dlrs.gov.bd` / `map.settlement.gov.bd`):** National digital record rooms, certified mouza map search, and postal courier delivery.
3. **Mouza.BD (`mouza.bd`):** Reference index for 200K+ mouza sheets across 64 districts and survey edition cross-referencing.
4. **Smart Bhumi Naksha (`map.land.gov.bd`):** Plot-based land zoning and environmental usage classifications.
5. **ePorcha (`eporcha.gov.bd`):** Online Khatian verification and digital record rooms.
6. **e-Mutation (`mutation.land.gov.bd`):** Upazila AC (Land) office mutation ledger checking.
