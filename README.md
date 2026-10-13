# 🇧🇩 LandWise AI — Bangladesh Land Due-Diligence Assistant & Digital Explorer
### Deep Animated Geographic Explorer & Forensics-Grounded Land Due-Diligence System

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Frontend Tests](https://img.shields.io/badge/Vitest-21%2F21%20Passing-brightgreen.svg)](#-testing--verification)
[![Build Status](https://img.shields.io/badge/Vite%20Build-Passing-brightgreen.svg)](#-testing--verification)
[![Map Engine](https://img.shields.io/badge/Map%20Engine-MapLibre%20GL%20JS-blue.svg)](#-progressive-4-level-map-explorer)
[![Routing Engine](https://img.shields.io/badge/Routing-OSRM%20Real%20Roads-orange.svg)](#-real-osrm-road-routing-system)
[![Architecture](https://img.shields.io/badge/Architecture-100%25%20Frontend%20Offline%20Capable-blue.svg)](#-architecture--contest-compliance)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20বাংলা-amber.svg)](#-bilingual-support)

---

## 📑 Table of Contents

1. [Executive Summary & Problem Statement](#-executive-summary--the-real-world-problem)
2. [Why LandWise AI Wins: Core Value Proposition](#-why-landwise-ai-wins-core-value-proposition)
3. [Progressive 4-Level Map Explorer](#-progressive-4-level-map-explorer)
4. [Real OSRM Road Routing System](#-real-osrm-road-routing-system)
5. [End-to-End User Workflow](#-end-to-end-user-workflow)
6. [The 12 Critical Document Identifiers Cross-Audited](#-the-12-critical-document-identifiers-cross-audited)
7. [Client-Side Document Processing & Review Engine](#-client-side-document-processing--review-engine)
8. [Data Source Research & Licensing Findings](#-data-source-research--licensing-findings)
9. [How All 10 Skill Repositories Were Applied](#-how-all-10-skill-repositories-were-applied)
10. [Authentic Demonstration Cases (Pre-Loaded for Judges)](#-authentic-demonstration-cases)
11. [Actionable 4-Step Official Verification Roadmap](#-actionable-4-step-official-verification-roadmap)
12. [Three-Minute Live Demonstration Script (For Hackathon Judges)](#-three-minute-live-demonstration-script)
13. [Testing & Verification](#-testing--verification)
14. [Legal Integrity & Statutory Disclaimer](#-legal-integrity--statutory-disclaimer)

---

## 🚨 Executive Summary: The Real-World Problem

In Bangladesh, purchasing land is the single largest financial investment a family or expatriate (NRB) makes. Yet it is one of the most perilous:
- **Broken Chain of Title:** Sellers frequently present a historical RS or SA Khatian without having completed an **e-Mutation (ই-নামজারি ও খারিজ খতিয়ান)** in their own name. Under the *Land Crime Prevention and Redress Act 2023*, selling un-mutated land is illegal, leaving buyers vulnerable to eviction and civil litigation from co-heirs.
- **Deed vs. Record Inconsistencies:** Land area claimed in a proposed Sale Deed (*Saf-Kabala / সাফ-কবলা*) routinely exceeds the seller's lawful share (*হিস্যা*) recorded in the Mouza Khatian or the Tax Dakhila receipt.
- **Sabek vs. Hal Dag (Plot) Discrepancies:** Boundary shifts across historical surveys (CS 1888–1940, SA 1956–1962, RS 1965–present, and BS/BDS) are exploited by fraudsters who sell valuable road-front Hal Dags while only possessing interior Sabek plots.
- **Hidden Environmental & Zoning Hazards:** Buyers commit non-refundable tokens before discovering that the plot is protected agricultural wetland (violation of *Land Reform Act 2023*), borders a riverbank erosion zone (নদী ভাঙন এলাকা), or falls within a government canal easement.

**LandWise AI** solves this problem by acting as an algorithmic, evidence-grounded pre-purchase due-diligence assistant combined with a deep, animated digital explorer of Bangladesh. It connects national geography to district intelligence, upazila local infrastructure, real road navigation, cadastral plot records, and client-side forensic document cross-examination.

---

## 💡 Why LandWise AI Wins: Core Value Proposition

Unlike generic chatbots that hallucinate legal advice, or property listing websites that promote sales commissions, **LandWise AI**:
1. **Never claims AI certifies title ownership:** Transparently flags verified evidence, detected discrepancies, and unknown information with uncertainty indices.
2. **Progressive 4-Level Geographic Explorer:** Features smooth animated camera movements (`flyTo`) from the Bangladesh national map down to district intelligence, upazila roads, schools, colleges, and cadastral plots.
3. **Calculates Real Road Routes via OSRM:** Queries real highway networks and turns; strictly rejects fabricated straight lines.
4. **Reconciles 12 Key Identifiers across 4 Document Classes:** Compares Deed vs. Khatian vs. Mutation vs. Tax Dakhila.
5. **Processes Documents 100% Client-Side:** Secure in-browser text and metadata extraction with zero remote data leakage.
6. **Delivers an Actionable 4-Step Official Roadmap:** Equips buyers with precise guidance for ePorcha, Upazila Land Office Register 9, Sub-Registry Index II searches, and DLRS map orders.

---

## 🗺️ Progressive 4-Level Map Explorer

Built with **MapLibre GL JS v5.15+** and **CartoDB Voyager raster tiles**, LandWise AI provides four seamless tiers of geographic exploration:

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

---

## 🚗 Real OSRM Road Routing System

LandWise AI integrates with the **Open Source Routing Machine (OSRM)** to calculate real driving paths along Bangladesh highways and city streets:
- **Real Road Polylines:** Fetches high-resolution driving geometry along official roads (e.g., N704 Kushtia-Pabna Highway).
- **Turn-by-Turn Guidance:** Renders detailed maneuvers (e.g., *"Turn left onto Kushtia-Pabna Highway N704 in 2.1 km"*).
- **Exact Driving Metrics:** Distance in kilometers and estimated driving duration in minutes.
- **Strict Anti-Fabrication Policy:** If an endpoint is disconnected, unbridged, or the routing service fails, LandWise AI displays a clear diagnostic warning and **never substitutes a straight line**.

---

## 🔄 End-to-End User Workflow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. GEOGRAPHIC EXPLORER                                  │
│  Explore Bangladesh via MapLibre GL JS or the 64-district vector overview              │
│  Select District -> Zoom to Upazila -> Inspect Roads, Schools, Colleges & Land Offices │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             2. CADASTRAL & PARCEL SELECTION                            │
│  Examine Mouza records (CS, SA, RS, BRS) & select a parcel -> Jump to Due Diligence   │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                           3. DOCUMENT INTAKE & EXTRACTION                              │
│  Inspect sample cases or upload custom documents (Deed, Khatian, Mutation, Tax)        │
│  Client-side extraction reads 12 critical identifiers with user review/edit modal      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                       4. CROSS-DOCUMENT VERIFICATION ENGINE                            │
│  Calculates Area Deltas, Name Consistency, Chain of Title, and Dag Alignment           │
│  Generates Findings: [EXACT MATCH] vs [POTENTIAL MATCH] vs [INCONSISTENCY]             │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                    5. ENVIRONMENTAL & REGULATORY RISK AUDIT                            │
│  Assesses Flood Risk, River Erosion, Zoning, and Road Frontage                         │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                           6. DUE-DILIGENCE DOSSIER EXPORT                              │
│  Download comprehensive dossier via Browser Print/PDF, Markdown, or JSON export       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 The 12 Critical Document Identifiers Cross-Audited

1. **Document Class & Registration Date**
2. **Deed / Document Number**
3. **Sub-Registry / Upazila Office Jurisdiction**
4. **Current & Historical Survey Edition (CS / SA / RS / BS)**
5. **Khatian Number (Sabek vs. Hal)**
6. **Dag / Plot Number (Sabek vs. Hal)**
7. **Mouza Name & J.L. Number (Jurisdiction List)**
8. **Seller / Declared Owner Name**
9. **Buyer / Transferee Name**
10. **Statutory Share (*হিস্যা*)**
11. **Land Area & Unit Reconciliation**
12. **Tax Dakhila Clearance Fiscal Year**

---

## 📁 Client-Side Document Processing & Review Engine

LandWise AI processes all files directly in browser memory:
- **Client-Side FileReader:** Reads `.txt`, `.json`, and `.csv` files locally.
- **Bilingual Regex Parser:** Detects and extracts Bengali and English land terms (`দাগ নং`, `খতিয়ান নং`, `মৌজা`, `জে.এল. নং`, `জমির পরিমাণ`, `মালিকের নাম`).
- **Review & Edit Sandbox:** Allows the user to inspect, edit, and confirm extracted values before committing them to the verification matrix.
- **Zero Cloud Leaks:** No personal data, deed photos, or identity records leave the user's browser.

---

## 📊 Data Source Research & Licensing Findings

See [DATA_SOURCES_AND_LICENSING.md](DATA_SOURCES_AND_LICENSING.md) for full audit notes. Key highlights:
- **Bhumipedia (`bhumipedia.land.gov.bd`):** Statutory legal definitions under the *State Acquisition and Tenancy Act 1950* and *Land Crime Prevention and Redress Act 2023*.
- **Mouza.BD (`mouza.bd`):** Catalog of over 200,000 public reference sheets across 64 districts. Reference copies only; certified copies must be requested through government offices.
- **DLRS Portal (`map.settlement.gov.bd`):** Over 239.9K digitized maps across 63 districts with certified copy ordering workflows.
- **Smart Bhumi Naksha (`map.land.gov.bd`):** Land zoning classifications across 90+ upazilas.
- **CartoDB Voyager:** OpenStreetMap data under the ODbL license rendered via CARTO free basemaps.
- **OSRM Public Routing API:** Highway and street routing along actual roads.

---

## 🧠 How All 10 Skill Repositories Were Applied

1. **Superpowers:** Disciplined task breakdown, verification before completion, and incremental execution.
2. **Ponytail:** Standard library and native browser features before unnecessary bloat (`FileReader`, native Canvas/SVG, zero backend).
3. **UI UX Pro Max:** High-contrast design tokens, bilingual typography, accessible badges, responsive drawers, and breadcrumbs.
4. **Graphify:** Structural modularity and clean dependency boundaries across geospatial, legal, and UI components.
5. **Caveman:** Precise, information-dense technical documentation and zero-fluff code structure.
6. **Addy Osmani Skills:** Front-end performance optimization, bundle splitting, clean lazy loading, and Core Web Vitals awareness.
7. **Understand Anything:** Forensic deconstruction of Bangladesh land laws (CS/SA/RS survey history, Namjari mutation rules, SAT Act 1950).
8. **Archify:** Robust 100% frontend architectural decoupling of UI views, calculation engines, and data registries.
9. **Impeccable:** Polished micro-interactions, silky smooth 1.5-second camera easing (`flyTo`), and clean glassmorphism accents.
10. **Awesome Claude Skills:** Prompt-grounded forensic discrepancy detection rules without hallucinated legal authority.

---

## 📂 Authentic Demonstration Cases

Pre-loaded for instant review by hackathon judges:
- **Case 1: Savar, Dhaka (Clean Title & Complete Chain):** RS Khatian + Namjari Khatian in seller's name + Clear Dakhila + Deed draft matching 5.00 decimals. Low risk, verified evidence.
- **Case 2: Patiya, Chittagong (Disputed Dag & Area Deficit):** Deed claims 8.50 decimals, but RS Khatian only grants 5.20 decimals share; Hal Dag cited without Sabek Dag link. High alert!
- **Case 3: Sylhet Sadar (Broken Mutation Chain & Floodplain Risk):** Seller claims title via RS Khatian of deceased father, but NO Namjari mutation has been executed; land borders Surma river with severe seasonal flood risk. Critical Red Flag!

---

## 📋 Actionable 4-Step Official Verification Roadmap

1. **Step 1: Digital Khatian Verification via ePorcha (`eporcha.gov.bd`)**
2. **Step 2: Mutation & AC (Land) Office Register 9 Verification (`mutation.land.gov.bd`)**
3. **Step 3: Non-Encumbrance Search at Sub-Registry Office (Index II)**
4. **Step 4: Certified Mouza Map & Boundary Ground-Truthing via DLRS (`map.settlement.gov.bd`)**

---

## ⏱️ Three-Minute Live Demonstration Script

**For Hackathon Judges & Evaluators:**

- **Minute 0:00–0:45 (The Digital Explorer):**
  1. Open LandWise AI. Point out the mode switcher and click **"MapLibre Explorer"**.
  2. Search for **"Kushtia"** or click Kushtia district on the national map.
  3. Watch the smooth 1.5-second animated `flyTo` camera zoom into Kushtia district boundaries.
  4. Select **"Kushtia Sadar"** Upazila to reveal local streets, schools, and hospitals.
  5. Click **"Kushtia Govt. College"** $\rightarrow$ Click **"Calculate Route to Kumarkhali"** $\rightarrow$ Show the real OSRM road polyline ($14.7\text{ km}$, $18\text{ mins}$, 5 turn maneuvers) along highway N704.

- **Minute 0:45–1:45 (The Cadastral & Land Connection):**
  1. Click **"Cadastral View"** on the map to reveal Dag 412 parcel boundaries in Kushtia Sadar.
  2. Click **"Investigate in Land Due-Diligence Workspace"**.
  3. The page transitions directly into the forensic due-diligence workbench pre-filled with the geographic location.

- **Minute 1:45–2:30 (Document Cross-Auditing & Chain of Title):**
  1. Toggle between **Case 1 (Clean)** and **Case 2 (Disputed Dag & Deficit)**.
  2. Show the **12-Field Cross-Verification Matrix**: Point out the red badges highlighting the 3.30 decimal area deficit and mismatched Dag.
  3. Inspect the **Chain of Title Visualizer**: Explain why missing e-mutation violates the *Land Crime Prevention and Redress Act 2023*.
  4. Show the **Client-Side Document Uploader**: Upload or paste sample text, demonstrate automatic regex extraction and the edit modal.

- **Minute 2:30–3:00 (Report Export & Legal Integrity):**
  1. Click **"Download Due-Diligence Report"**.
  2. Display the generated print-ready PDF preview and download Markdown/JSON exports.
  3. Conclude by reading the legal disclaimer: *"LandWise AI provides evidence-grounded pre-purchase pre-screening; it never replaces official registry searches or professional legal counsel."*

---

## 🧪 Testing & Verification

All test suites execute deterministically:

```bash
# Run all unit tests
npm test -- --run

# Run production build
npm run build
```

**Test Results:**
- `src/utils/verificationEngine.test.ts` (4 tests) — PASSED
- `src/utils/districtPoiGenerator.test.ts` (4 tests) — PASSED
- `src/utils/osrmRoutingService.test.ts` (3 tests) — PASSED
- `src/data/districtIntelligence.test.ts` (4 tests) — PASSED
- `src/utils/suitability.test.ts` (6 tests) — PASSED
- **Total: 21 passed across 5 test files (880ms duration)**
- **Build: `tsc -b && vite build` built in 6.17s with 0 errors**

---

## ⚖️ Legal Integrity & Statutory Disclaimer

> **IMPORTANT NOTICE:**  
> LandWise AI is an educational and analytical due-diligence pre-screening assistant. It does **NOT** certify legal ownership, issue title warranties, declare criminal fraud, or replace official searches conducted at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms. Users must always engage a qualified Advocate / Legal Professional before executing binding contracts or transferring funds.
