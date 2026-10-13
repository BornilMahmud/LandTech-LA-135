# 🇧🇩 LandWise AI — Bangladesh Land Due-Diligence Assistant
### AI-Assisted Pre-Purchase Land Document Audit, Title Chain Verification & Hazard Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Frontend Tests](https://img.shields.io/badge/Vitest-14%2F14%20Passing-brightgreen.svg)](#-testing--verification)
[![Build Status](https://img.shields.io/badge/Vite%20Build-Passing-brightgreen.svg)](#-testing--verification)
[![Architecture](https://img.shields.io/badge/Architecture-100%25%20Frontend%20Offline%20Capable-blue.svg)](#-architecture--contest-compliance)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20বাংলা-amber.svg)](#-bilingual-support)

---

## 📑 Table of Contents

1. [Executive Summary & Problem Statement](#-executive-summary--the-real-world-problem)
2. [Why LandWise AI Wins: Core Value Proposition](#-why-landwise-ai-wins-core-value-proposition)
3. [End-to-End User Workflow](#-end-to-end-user-workflow)
4. [The 12 Critical Document Identifiers Cross-Audited](#-the-12-critical-document-identifiers-cross-audited)
5. [Firecrawl Research & Data Source Licensing](#-firecrawl-research--data-source-licensing)
6. [How All 10 Skill Repositories Were Applied](#-how-all-10-skill-repositories-were-applied)
7. [System Architecture & Contest Compliance](#-architecture--contest-compliance)
8. [Authentic Demonstration Cases (Pre-Loaded for Judges)](#-authentic-demonstration-cases)
9. [Actionable 4-Step Official Verification Roadmap](#-actionable-4-step-official-verification-roadmap)
10. [Three-Minute Live Demonstration Script (For Hackathon Judges)](#-three-minute-live-demonstration-script)
11. [Testing & Verification](#-testing--verification)
12. [Legal Integrity & Statutory Disclaimer](#-legal-integrity--statutory-disclaimer)

---

## 🚨 Executive Summary: The Real-World Problem

In Bangladesh, purchasing land is the single largest financial investment a family or expatriate (NRB) makes. Yet it is one of the most perilous:
- **Broken Chain of Title:** Sellers frequently present a historical RS or SA Khatian without having completed an **e-Mutation (ই-নামজারি ও খারিজ খতিয়ান)** in their own name. Under the *Land Crime Prevention and Redress Act 2023*, selling un-mutated land is illegal, leaving buyers vulnerable to eviction and civil litigation from co-heirs.
- **Deed vs. Record Inconsistencies:** Land area claimed in a proposed Sale Deed (*Saf-Kabala / সাফ-কবলা*) routinely exceeds the seller's lawful share (*হিস্যা*) recorded in the Mouza Khatian or the Tax Dakhila receipt.
- **Sabek vs. Hal Dag (Plot) Discrepancies:** Boundary shifts across historical surveys (CS 1888–1940, SA 1956–1962, RS 1965–present, and BS/BDS) are exploited by fraudsters who sell valuable road-front Hal Dags while only possessing interior Sabek plots.
- **Hidden Environmental & Zoning Hazards:** Buyers commit non-refundable tokens before discovering that the plot is protected agricultural wetland (violation of *Land Reform Act 2023*), borders a riverbank erosion zone (নদী ভাঙন এলাকা), or falls within a government canal easement.

**LandWise AI** solves this problem by acting as an algorithmic, evidence-grounded pre-purchase due-diligence assistant. It cross-examines multiple land documents, pinpoints exact inconsistencies with citations, evaluates location hazards, and generates a downloadable due-diligence report with a concrete official verification roadmap.

---

## 💡 Why LandWise AI Wins: Core Value Proposition

Unlike generic chatbots that hallucinate legal advice, or property listing websites that promote sales commissions, **LandWise AI**:
1. **Never claims AI certifies title ownership:** Transparently flags verified evidence, detected discrepancies, and unknown information with uncertainty indices.
2. **Reconciles 12 Key Identifiers across 4 Document Classes:** Compares Deed vs. Khatian vs. Mutation vs. Tax Dakhila.
3. **Integrates the Interactive Bangladesh 64-District Vector Map:** Direct access to cadastral survey editions, Smart Bhumi Naksha zoning, and regional unit conversions.
4. **Delivers an Actionable 4-Step Official Roadmap:** Equips buyers with precise guidance for ePorcha, Upazila Land Office Register 9, Sub-Registry Index II searches, and DLRS map orders.

---

## 🔄 End-to-End User Workflow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. GEOGRAPHIC EXPLORER                                  │
│  Explore Bangladesh via the preserved 64-district interactive vector map               │
│  Select Division & District -> View Cadastral Survey Status & Smart Zoning Coverage     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             2. LAND OPPORTUNITY DOSSIER                                │
│  Examine pre-loaded authentic Bangladesh test cases or upload custom documents         │
│  (Case 1: Clean Title | Case 2: Dag Mismatch & Deficit | Case 3: Broken Mutation Chain)│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                           3. DOCUMENT INTAKE & EXTRACTION                              │
│  Inspect: Sale Deed (সাফ-কবলা), RS Khatian (পর্চা), Mutation (ই-নামজারি), Tax Dakhila  │
│  Extracts 12 Key Identifiers: Khatian No, Dag No, Mouza J.L., Area, Owner, Hissya, etc.│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                       4. CROSS-DOCUMENT VERIFICATION ENGINE                            │
│  Calculates Area Deltas, Name Consistency, Chain of Title, and Dag Alignment           │
│  Generates Findings: [VERIFIED EVIDENCE] vs [DETECTED DISCREPANCY] vs [UNKNOWN/MISSING]│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                    5. ENVIRONMENTAL & REGULATORY RISK AUDIT                            │
│  Assesses Flood Risk, River Erosion, Road Access, and Khash/Wetland Proximity          │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                        6. ACTIONABLE REPORT & CHECKLIST                                │
│  Downloadable Due-Diligence Dossier (PDF/Printable View & Markdown/JSON)               │
│  Step-by-step guidance: ePorcha, AC Land Ledger, Sub-Registry Index II, DLRS Map       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 The 12 Critical Document Identifiers Cross-Audited

1. **District & Upazila Name** (জেলা ও উপজেলা)
2. **Mouza Name & J.L. Number** (মৌজা ও জে.এল. নম্বর)
3. **Survey Edition** (CS, SA, RS, BS / BDS / City Survey)
4. **Khatian Number** (খতিয়ান নম্বর — CS vs RS vs Namjari)
5. **Dag / Plot Number** (দাগ নম্বর — সাবেক / হাল দাগ)
6. **Total Land Area** (জমির মোট পরিমাণ — Satak / Decimal / Katha / Bigha / Acres)
7. **Recorded Share / Hissya** (হিস্যা — আনা, গণ্ডা, কড়া, ক্রান্তি or Decimal share)
8. **Transferred / Subject Area** (হস্তান্তরিত জমির পরিমাণ)
9. **Primary Owner / Seller Name** (মালিক বা বিক্রেতার নাম)
10. **Father's / Husband's Name** (পিতা / স্বামীর নাম)
11. **Deed Registration Number & Date** (দলিল নম্বর ও তারিখ)
12. **Tax Payment / Dakhila Clearance Year** (খাজনা পরিশোধের সন ও দাখিলা রশিদ)

---

## 🌐 Firecrawl Research & Data Source Licensing

Before implementation, in-depth web discovery and Firecrawl scraping was conducted across the target Bangladesh land portals (documented in detail in [`DATA_SOURCES_AND_LICENSING.md`](DATA_SOURCES_AND_LICENSING.md)):

| Portal | Scope & Discovered Capabilities | Legal Status & LandWise AI Reuse Policy |
|---|---|---|
| **Bhumipedia** (`bhumipedia.land.gov.bd`) | Ministry of Land legal encyclopedia for SAT Act 1950, Land Crime Act 2023, and official glossary. | Public statutory definitions integrated into rules engine. Direct portal citation provided. |
| **Mouza.BD** (`mouza.bd/en/mouza-maps`) | 200,000+ mouza map sheets across 64 districts; explicit notice: *"Reference copies of public survey records—not certified copies."* Requires accounts/payments. | No raster tile caching or piracy. Referenced as survey edition index guidance. |
| **DLRS Portal** (`map.settlement.gov.bd`) | 239.9K+ digitized maps, 63 districts. Official paid government portal to purchase certified maps via bKash/courier. | Official certified ordering instructions embedded into due-diligence report roadmap. |
| **Smart Bhumi Naksha** (`map.land.gov.bd`) | National Digital Land Zoning Project: plot-level agricultural, residential, wetland, and commercial zoning. | Zoning risk classifications integrated into environmental hazard analyzer. |

---

## 🛠️ How All 10 Skill Repositories Were Applied

1. **Superpowers ([github.com/obra/superpowers](https://github.com/obra/superpowers)):** Disciplined TDD implementation plan with Red-Green-Refactor loop and unit tests in `src/utils/verificationEngine.test.ts`.
2. **Ponytail ([github.com/DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)):** Zero-bloat engineering. Eliminated unnecessary heavy server dependencies; 100% self-contained frontend with native browser APIs.
3. **UI UX Pro Max ([github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)):** High-end geospatial UI design system, Emerald & Slate dark/light theme tokens, responsive hierarchy, and WCAG AA contrast.
4. **Graphify ([github.com/Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)):** Modular knowledge graph principles connecting districts, survey editions, documents, and risk indicators.
5. **Caveman ([github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)):** Crisp, jargon-free copy for complex Bangladeshi legal mechanics (e.g. *Why an RS khatian without mutation poses eviction risk*).
6. **Addy Osmani Skills ([github.com/addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)):** Component boundary decoupling, fast client-side rendering, and zero-jank vector SVG map interactions.
7. **Understand Anything ([github.com/Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything)):** Deep mental model of Bangladesh land lineage: CS → SA → RS → BS/BRS, Saf-Kabala deeds, Khatian porcha, Namjari DCR, and tax dakhila.
8. **Archify ([github.com/tt-ali/archify](https://github.com/tt-ali/archify)):** Robust system decomposition: Ingestion → Cross-Verification Engine → Spatial Hazards → Report Generator.
9. **Impeccable ([github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable)):** Visual polish, micro-animations, accessible badges, print stylesheets, and responsive mobile drawers.
10. **Awesome Claude Skills ([github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills)):** Verification before completion protocol, evidence-backed assertions, and prompt engineering best practices.

---

## 💻 Architecture & Contest Compliance

- **100% Frontend-Only:** Built on **Vite 6 + React 19 + TypeScript + Tailwind CSS**.
- **No Backend Server Required:** Can be served offline or deployed to any static host (Vercel, GitHub Pages, Netlify).
- **Deterministic & Privacy-Preserving:** All document reconciliation and mathematical deltas run client-side in the browser. Zero user documents or sensitive land records are uploaded to remote third-party servers.

---

## 📁 Authentic Demonstration Cases

| Case | Location | Key Scenario & Findings | Risk Verdict |
|---|---|---|---|
| **Case 1** | Savar, Dhaka | **Clean Title & Fully Mutated Family Parcel:** RS Khatian matches, AC (Land) Mutation in seller's name verified, current 1431 BS LD Tax Dakhila cleared, 5.00 decimals match. | 🟢 **Favorable (Score 18)** |
| **Case 2** | Patiya, Chittagong | **Disputed Dag & Area Deficit:** Deed claims 8.50 decimals, but RS Khatian only grants 5.20 decimals share (-3.30 decimal deficit!). Deed cites Hal Dag 940 while Khatian cites Sabek Dag 412 without Dag-Suchi. | 🔴 **High Hazard (Score 78)** |
| **Case 3** | Sylhet Sadar | **Broken Mutation Chain & River Erosion Alert:** Seller claims inheritance under RS Khatian of deceased father, but NO Namjari mutation exists in seller's name. Plot is 75m from Surma river with severe flood & erosion hazard. | 🔴 **Critical Red Flag (Score 92)** |
| **Case 4** | Gazipur Sadar | **Industrial Claim vs. Agricultural Wetland Classification:** Seller advertises commercial warehouse plot, but Smart Bhumi Naksha zoning records classify the plot as protected double-crop agricultural land. | 🟠 **Caution (Score 62)** |

*Users can also click **"+ Upload Custom Document"** to upload scanned PDFs/images or enter custom deed and khatian numbers with live reconciliation.*

---

## 📋 Actionable 4-Step Official Verification Roadmap

1. **ePorcha Digital Search (`eporcha.gov.bd`):** Search Khatian numbers across the Upazila and District to confirm digitised Record Room entry.
2. **AC (Land) Office Register IX Inspection:** Visit the local Upazila Land Office to review Register IX (নামজারি রেজিস্টার ৯) and DCR receipt authenticity.
3. **Sub-Registry Index II Search (তল্লাশি):** Conduct a formal 12–25 year deed search at the Sub-Registry Office to uncover any undisclosed mortgages or duplicate deeds.
4. **DLRS Certified Mouza Map Order (`map.settlement.gov.bd`):** Procure the official certified Mouza map sheet (CS/RS) and commission a licensed Amin / Surveyor to physically verify plot boundary cornerstones.

---

## ⏱️ Three-Minute Live Demonstration Script

**0:00 - 0:45 | The Discovery & The Map**
- Introduce LandWise AI: *"In Bangladesh, buying land often risks your life savings due to hidden document discrepancies."*
- Click on the interactive 64-district vector map: select **Dhaka**, then **Chittagong**, then **Sylhet**. Observe instant district intelligence updates (cadastral survey status, upazila breakdown, average land valuations).

**0:45 - 1:45 | The Due-Diligence Investigation**
- Scroll to the **Due-Diligence Workbench**.
- Switch to **Case 2 (Patiya, Chittagong)**: Show how LandWise AI immediately flags the **3.30 decimal area deficit** (Deed claims 8.50 dec, but Khatian share is only 5.20 dec) and highlights the **Sabek vs. Hal Dag discrepancy**.
- Switch to **Case 3 (Sylhet Sadar)**: Open the **Chain-of-Title Flow** tab to display the glowing broken link between the RS Khatian and the Sale Deed caused by the **missing e-Mutation in the seller's name**.

**1:45 - 2:30 | Environmental Hazards & Custom Upload**
- Click on **Environmental & Spatial Hazards**: Review Surma River erosion risk, Smart Bhumi Naksha zoning alignment, and road frontage width.
- Click **"+ Upload Custom Document"**: Select a preset or input a deed number to demonstrate real-time client-side cross-verification.

**2:30 - 3:00 | Executive Report Generation**
- Click **"Download Due-Diligence Report"**.
- Showcase the print-ready Dossier with official audit seals, itemized findings, citations, and the 4-step official verification roadmap.
- Trigger **"Print / PDF"** or **"Download (.md)"**. Conclude with the legal disclaimer: LandWise AI equips the citizen with evidence before they visit their lawyer or registry office.

---

## 🧪 Testing & Verification

```bash
# Run unit tests
npm test

# Run production build check
npm run build

# Start local development server
npm run dev
```

**Test Results:**
- 14 Vitest unit tests covering name similarity algorithms, missing mutation detection, dag concordance, and area deficit calculations.
- Clean TypeScript compilation with zero errors.

---

## ⚖️ Legal Integrity & Statutory Disclaimer

> **IMPORTANT NOTICE:**  
> *LandWise AI is an educational, analytical due-diligence pre-screening assistant. It does not certify official title ownership, issue legal warranties, declare criminal fraud, or substitute for formal legal searches at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms. Users must always engage a qualified Advocate enrolled with the Bangladesh Bar Council before executing binding contracts or transferring funds.*
