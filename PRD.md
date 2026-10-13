# LandWise AI — Bangladesh Land Due-Diligence Assistant & Digital Explorer
## Master Product Requirements Document (PRD)

**Version:** 2.0.0 (Production Release)  
**Date:** October 2026  
**Audience:** Hackathon Jury, Geospatial Engineers, Legal Tech Architects  

---

## 1. Problem Statement & Background

### 1.1 The Real-World Crisis in Bangladesh Land Purchases
In Bangladesh, purchasing land represents the largest financial commitment in a citizen's or expatriate family's lifetime. However, land transactions remain plagued by severe information asymmetry, fragmented record systems, and counterfeit documentation:
1. **Broken Chain of Title:** Sellers frequently present an old RS or SA Khatian without a valid subsequent mutation (নামজারি / খারিজ খতিয়ান) registered under the current seller's name. Under the *Land Crime Prevention and Redress Act 2023*, selling un-mutated land is a statutory offense.
2. **Deed vs. Record Inconsistencies:** The land area declared in a registered Sale Deed (Saf-Kabala / সাফ-কবলা) often conflicts with the actual share (হিস্যা) recorded in the Mouza Khatian or the Dakhila (ভূমি উন্নয়ন কর দাখিলা) receipt.
3. **Disputed or Outdated Dag (Plot) Numbers:** Over the course of historical surveys—**CS** (1888–1940), **SA** (1956–1962), **RS** (1965–present), and modern **BS / BDS / City Survey**—plot boundaries and Dag numbers shift. Fraudulent actors exploit this by selling lands with CS Dag numbers that no longer correspond to the seller's RS Dag.
4. **Hidden Location & Regulatory Hazards:** Buyers often discover only *after paying* that the parcel is zoned as non-convertible agricultural wetland, lies within a river erosion zone (নদী ভাঙন এলাকা), is reserved forest or government Khash land (খাস জমি), or lacks lawful road access.
5. **Lack of an Integrated Digital Experience:** Prospective buyers have had to juggle disconnected websites (static SVG maps, disconnected DLRS portals, manual deeds), with no unified tool connecting national geography to district roads, upazila infrastructure, cadastral parcels, and document forensic checking.

---

## 2. Product Vision & Value Proposition

**LandWise AI** unites two essential, connected capabilities into a cohesive platform:
1. **A Deep, Animated Digital Explorer of Bangladesh:**
   - Seamless progressive 4-level navigation from the national 64-district map down to district intelligence, upazila local infrastructure, street networks, and authoritative cadastral plots.
   - Built on React 19 + TypeScript + MapLibre GL JS + CartoDB Voyager tiles.
   - Real road routing powered by the Open Source Routing Machine (OSRM) along actual highways and streets.
2. **An Integrated Land-Management & Due-Diligence System:**
   - Automated client-side document processing for deeds, khatians, mutation records, and tax receipts.
   - Deterministic 12-field cross-verification matrix with 5 categorical statuses: *Exact Match*, *Potential Match*, *Inconsistency*, *Missing Evidence*, and *Unable to Verify*.
   - Historical chain-of-title visualizer tracking CS $\rightarrow$ SA $\rightarrow$ RS $\rightarrow$ Mutation $\rightarrow$ Deed flows.
   - Environmental and regulatory risk assessment (flood, river erosion, zoning compliance, road frontage).
   - Downloadable comprehensive Due-Diligence Report (Print/PDF, Markdown, JSON).

### 2.1 The Cardinal Principle: Responsible Legal AI & Honest Data
> **MANDATORY LEGAL DISCLAIMER:**  
> *LandWise AI is an assistive pre-purchase due-diligence and geographical exploration tool. It does NOT certify legal ownership, guarantee title validity, declare criminal fraud, or replace official searches conducted at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms. Furthermore, LandWise AI never fabricates missing infrastructure, invented upazila boundaries, or straight-line road routes. Users must always engage a qualified Advocate before transferring funds.*

---

## 3. Four-Level Progressive Map Architecture

The interactive map implements four distinct levels of progressive geographic detail with animated `flyTo` camera transitions:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1 — BANGLADESH OVERVIEW                                          │
│ • All 64 Districts visible with interactive polygons & SVG overview    │
│ • Division filters (8 divisions) & district search                     │
│ • Hover cards displaying population, upazila count, survey status      │
│ • Animated flyTo camera movement into selected district boundaries     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click District (e.g., Kushtia)
┌───────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 2 — DISTRICT INTELLIGENCE                                        │
│ • District boundary highlight & geographic extent                      │
│ • Upazila boundaries and names (all upazilas selectable)               │
│ • Pourashavas (municipalities), primary highways (N704, etc.), rivers  │
│ • District intelligence statistics derived from authentic data         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click Upazila (e.g., Kushtia Sadar)
┌───────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 3 — LOCAL INFRASTRUCTURE & ROADS                                 │
│ • Street networks and local road connections                           │
│ • Mapped POIs: Schools, colleges, universities, hospitals, markets,    │
│   and Upazila Land Offices (AC Land)                                   │
│ • Selectable POI cards with verified coordinates and metadata          │
│ • Integrated OSRM real road route calculator (turn-by-turn guidance)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click Cadastral View / Parcel
┌───────────────────────────────────▼────────────────────────────────────┐
│ LEVEL 4 — LAND & PLOT INVESTIGATION                                    │
│ • Cadastral survey editions: CS, SA, RS, BRS, BDS records              │
│ • Mapped cadastral parcel boundaries, Dag (plot) numbers, and area     │
│ • DLRS official map purchase guidance & ePorcha deep links             │
│ • 1-Click CTA: "Investigate in Land Due-Diligence Workspace"           │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Level Specifications

#### Level 1 — Bangladesh Overview
* **Visual Scope:** Entire territory of Bangladesh ($20.5^\circ\text{N}$ to $26.7^\circ\text{N}$, $88.0^\circ\text{E}$ to $92.7^\circ\text{E}$).
* **Interactions:**
  * Mode switcher: MapLibre Progressive Explorer, 64 Districts SVG, 8 Divisions, and Satellite hybrid view.
  * District search bar with instant autocomplete.
  * Division filter chips (Dhaka, Chittagong, Khulna, Rajshahi, Rangpur, Sylhet, Barisal, Mymensingh).
  * Hover tooltip with district name (Bangla + English), headquarters, area ($\text{km}^2$), population, and upazila count.
  * Clicking a district triggers a 1.5-second easing camera transition (`flyTo` / `fitBounds`) into the district's WGS84 geographic bounding box.

#### Level 2 — District Intelligence
* **Visual Scope:** Selected district framed at zoom levels 9.5 to 11.5.
* **Layers Displayed:**
  * Boundary polygon of the selected district.
  * Selectable Upazila boundary tiles and label badges.
  * Pourashava (urban municipality) indicators.
  * Major national highways (e.g., N704 Kushtia-Pabna Highway, N1 Dhaka-Chittagong, N2 Dhaka-Sylhet).
  * Major rivers (Padma, Jamuna, Meghna, Gorai, Surma, Karnafuli).
  * District intelligence summary drawer: Total area, population, literacy rate, cadastral survey status (CS/SA/RS completion), and active land issues.

#### Level 3 — Local Infrastructure
* **Visual Scope:** Selected Upazila framed at zoom levels 12.0 to 14.5.
* **Layers Displayed:**
  * Secondary and local road networks from OpenStreetMap.
  * Categorized POI markers:
    * 🎓 Schools & Colleges (e.g., Kushtia Govt. College, Kushtia Zilla School).
    * 🏥 Hospitals & Clinics (e.g., Kushtia General Hospital).
    * 🏛️ Government Offices (Upazila Land Office / AC Land, Sub-Registry Office).
    * 🛒 Markets & Bazars (Bara Bazar, Mohini Mill Market).
  * POI Detail Card: Name, category, verified WGS84 coordinates, address, and quick actions ("Set as Route Origin" / "Set as Route Destination").

#### Level 4 — Land & Plot Investigation
* **Visual Scope:** Deep geographic parcel zoom (levels 15.0 to 18.0).
* **Layers Displayed:**
  * Authoritative and demonstration cadastral parcel boundaries.
  * Plot identifiers: RS Dag No., Sabek CS Dag No., Mouza Name, and J.L. No.
  * Land-use classification (Agricultural, Residential, Commercial, Wetland).
  * Official DLRS map purchase parameters: Division, District, Upazila, Mouza, Sheet No., and link to `map.settlement.gov.bd`.
  * **Direct Bridge to Due Diligence:** "Open in Land Due-Diligence Workspace" button automatically loads the selected district, upazila, mouza, and dag number into the forensic document workspace.

---

## 4. Real Road Routing System (OSRM Engine)

### 4.1 Routing Engine Principles
* **Real Network Only:** Queries `https://router.project-osrm.org/route/v1/driving/{lon1},{lat1};{lon2},{lat2}`.
* **No Fabricated Straight Lines:** If the external routing service encounters an error, timeout, or unreachable destination (e.g. river without ferry or bridge), LandWise AI displays an honest explanation. It never falls back to drawing a straight line and mislabeling it as a road route.
* **Route Metadata:**
  * Polyline geometry rendered in royal blue (`#2563eb`) with casing and directional styling.
  * Total driving distance in kilometers ($\text{km}$).
  * Estimated duration in minutes.
  * Step-by-step turn guidance drawer showing maneuver instructions (e.g., *"Turn left onto Kushtia-Pabna Highway N704"*).
* **Presets & Custom Endpoints:** Pre-configured route combinations between key local infrastructure (e.g., Kushtia Sadar AC Land Office $\rightarrow$ Kumarkhali Upazila Parishad) plus custom origin/destination pickers.

---

## 5. Land Due-Diligence & Document Verification System

### 5.1 Document Intake & Client-Side Extraction
* **Supported Document Classes:**
  1. **Sale Deed (Saf-Kabala / সাফ-কবলা):** Registered transfer document containing deed number, date, sub-registry office, seller/buyer names, consideration value, and transferred area.
  2. **Survey Khatian (পর্চা - CS / SA / RS / BS):** Historical or current land record from DLRS containing Khatian No., J.L. No., Mouza, Dag No., recorded owners, and statutory shares (*হিস্যা*).
  3. **Mutation Khatian (ই-নামজারি ও খারিজ খতিয়ান):** Upazila AC (Land) office mutation order establishing seller's lawful title and tax assessment roll.
  4. **Land Development Tax Dakhila (ভূমি উন্নয়ন কর দাখিলা):** Union Land Office tax payment receipt verifying payment up to the current fiscal year.
* **Processing Mechanics:**
  - 100% client-side file reading (`FileReader`) for text, JSON, and CSV uploads.
  - Automated regex and semantic extraction for 12 critical Bengali and English identifiers (দাগ নং, খতিয়ান নং, মৌজা, জে.এল. নং, জমির পরিমাণ, মালিকের নাম, ইত্যাদি).
  - Manual Review & Editing Modal: Users can review, adjust, or supplement extracted values before triggering verification.

### 5.2 Deterministic 12-Field Cross-Verification Matrix
The verification engine cross-audits the 12 critical fields across all supplied documents and outputs 5 deterministic statuses:

| Status | Meaning | Color Code | Action Required |
|---|---|---|---|
| **Exact Match** | Field matches across all documents identically | Green (`#16a34a`) | Fully verified evidence |
| **Potential Match** | Slight variation (e.g. spelling transliteration, minor rounding) | Blue (`#2563eb`) | Review recommended |
| **Inconsistency** | Conflict between documents (e.g. Deed area exceeds Khatian share) | Red (`#dc2626`) | Critical Red Flag — do not proceed |
| **Missing Evidence** | Critical document missing (e.g. no Mutation in seller's name) | Amber (`#d97706`) | Mandatory document required |
| **Unable to Verify** | Incomplete text or unreadable identifier | Gray (`#64748b`) | Request clear physical original |

### 5.3 Historical Chain-of-Title Flow
Visualizes the statutory evolution of title:
$$\text{CS (1888–1940)} \longrightarrow \text{SA (1956–1962)} \longrightarrow \text{RS (1965–present)} \longrightarrow \text{e-Mutation (খারিজ)} \longrightarrow \text{Registered Deed}$$
- Flags broken mutation links where a seller inherits from an RS owner but has never registered a separate mutation in their own name.
- Highlights that under the *Land Crime Prevention and Redress Act 2023*, executing a deed without an up-to-date e-mutation is unlawful.

### 5.4 Environmental & Regulatory Risk Assessment
Cross-references geographic position with 4 environmental risk layers:
1. **Flood Exposure Index:** Low, Moderate, or High seasonal inundation vulnerability.
2. **Riverbank Erosion Risk:** Proximity to active eroding riverbeds (Padma, Jamuna, Meghna, Surma, Gorai).
3. **Smart Bhumi Naksha Zoning:** Verification against official Ministry of Land agricultural, residential, commercial, and wetland conservation zones.
4. **Road Frontage & Right-of-Way:** Physical access check to prevent land-locked parcel fraud.

### 5.5 Comprehensive Due-Diligence Report Generation
Generates a full audit dossier with:
- Property summary, district, upazila, mouza, and dag identifiers.
- Processed document list with extraction provenance.
- Field-by-field verification matrix and detected discrepancies.
- Actionable 4-step official verification roadmap (ePorcha, AC Land Register 9, Sub-Registry Index II, DLRS certified map order).
- Export formats: One-click Browser Print/PDF, Markdown file download, and structured JSON export.

---

## 6. Technical Stack & Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Type-safe, component-driven reactive user interface |
| **Build Tool** | Vite 6 | Ultra-fast development server and optimized rollup bundle |
| **Map Rendering** | MapLibre GL JS v5.15+ | Open-source, GPU-accelerated vector map engine with smooth camera animations |
| **Map Tiles** | CartoDB Voyager Raster Tiles | High-resolution, Google Maps-style clean visual aesthetics without private API keys |
| **Geographic Analysis** | Turf.js v7.3.4 | Client-side bounding boxes, centroids, and distance metrics |
| **Road Routing** | OSRM Public Driving API | Real road navigation along mapped highways with zero line fabrication |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive, modern design with accessible contrast and touch targets |
| **Unit Testing** | Vitest 3.2.7 | Deterministic, fast test execution with 21/21 passing tests |

---

## 7. Compliance, Privacy & Contest Rules

1. **100% Frontend-Only:** Zero server-side runtime, no external databases, zero backend dependency. Fully compatible with static hosting (Vercel, Netlify, Render, GitHub Pages).
2. **Absolute Privacy:** User-uploaded documents are processed strictly in browser memory via `FileReader`. No documents, personal names, or tax details are ever transmitted to external servers.
3. **No Private Secrets in Client Code:** Uses open, unauthenticated public endpoints (OSRM, CartoDB Voyager, OpenStreetMap).
4. **Honest Provenance & Caveats:** All synthetic test cases are explicitly labeled. No AI score is ever presented as a guarantee of legal title.
