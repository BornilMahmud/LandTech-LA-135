# LandWise AI — Bangladesh Land Due-Diligence Assistant
## Master Product Requirements Document (PRD)

---

## 1. Problem Statement & Background

### 1.1 The Real-World Crisis in Bangladesh Land Purchases
In Bangladesh, purchasing land represents the largest financial commitment in a citizen's or expatriate family's lifetime. However, land transactions remain plagued by severe information asymmetry, fragmented record systems, and counterfeit documentation:
1. **Broken Chain of Title:** Sellers frequently present an old RS or SA Khatian without a valid subsequent mutation (নামজারি / খারিজ খতিয়ান) registered under the current seller's name.
2. **Deed vs. Record Inconsistencies:** The land area declared in a registered Sale Deed (Saf-Kabala / সাফ-কবলা) often conflicts with the actual share (হিস্যা) recorded in the Mouza Khatian or the Dakhila (ভূমি উন্নয়ন কর দাখিলা) receipt.
3. **Disputed or Outdated Dag (Plot) Numbers:** Over the course of historical surveys—**CS** (1888–1940), **SA** (1956–1962), **RS** (1965–present), and modern **BS / BDS / City Survey**—plot boundaries and Dag numbers shift. Fraudulent actors exploit this by selling lands with CS Dag numbers that no longer correspond to the seller's RS Dag.
4. **Hidden Location & Regulatory Hazards:** Buyers often discover only *after paying* that the parcel is zoned as non-convertible agricultural wetland, lies within a river erosion zone (নদী ভাঙন এলাকা), is reserved forest or government Khash land (খাস জমি), or is scheduled for imminent public acquisition.
5. **Lack of Actionable Due Diligence:** The average buyer cannot afford a team of forensic title attorneys for initial property scouting. By the time they discover red flags, tokens or non-refundable deposits have already been paid.

---

## 2. Product Vision & Value Proposition

**LandWise AI** is an AI-assisted, client-side, evidence-grounded **Bangladesh Land Due-Diligence Assistant**. It empowers prospective land buyers, expatriates (NRBs), and family investors to:
- **Investigate before paying a single Taka.**
- **Cross-examine multiple seller-provided documents** (Deeds, Khatians, Mutation records, Tax receipts) with automated multi-way field reconciliations.
- **Surface evidence-backed discrepancies, red flags, and missing verification records.**
- **Explore geographic context, cadastral survey status, and environmental risk indicators** integrated seamlessly with an interactive 64-district vector map of Bangladesh.
- **Generate an actionable, downloadable Due-Diligence Dossier** complete with transparent uncertainty scores, itemized red flags, and concrete official verification steps (ePorcha, AC Land, Sub-Registry, DLRS).

### 2.1 The Cardinal Principle: Responsible Legal AI
> **MANDATORY LEGAL DISCLAIMER:**  
> *LandWise AI is an educational and analytical due-diligence pre-screening assistant. It does NOT certify legal ownership, issue title warranties, declare criminal fraud, or replace official searches conducted at the Sub-Registry Office, AC (Land) Office, or DLRS Record Rooms. Users must always engage a qualified Advocate / Legal Professional before executing binding contracts or transferring funds.*

---

## 3. Core User Personas

| Persona | Motivation | Pain Point | How LandWise AI Wins |
|---|---|---|---|
| **Rahim (First-Time Buyer in Dhaka/Savar)** | Buying 5 satak land for building a family home. | Confused by CS vs RS vs BS dag numbers; seller gave him 3 different xerox copies. | Instant multi-doc comparison highlights that RS Dag 412 has only 3.2 satak registered, saving him from a 1.8 satak shortfall. |
| **Farzana (Non-Resident Bangladeshi in UK)** | Sending remittance to purchase ancestral plot in Sylhet. | Cannot physically visit the AC Land office or inspect boundaries. | Checks district/mouza cadastral availability, zoning alignment, flood risks, and receives a ready-to-print official verification checklist for her local representative. |
| **Tanvir (Commercial Real Estate Scout)** | Sourcing industrial land in Gazipur / Narayanganj. | Needs to verify road connectivity, highway setbacks, and whether land is classified as agricultural wetland or industrial. | Cross-references Smart Bhumi Naksha zoning with cadastral intelligence and road access vectors. |

---

## 4. End-to-End User Journey & Workflows

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 1. GEOGRAPHIC EXPLORER                                  │
│  Explore Bangladesh via the preserved 64-district interactive vector map               │
│  Select Division & District -> View Cadastral Survey Status & Smart Zoning Coverage     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                             2. LAND OPPORTUNITY DOSSIER                                │
│  Examine pre-loaded authentic Bangladesh test cases or start custom case               │
│  (Case A: Clean Title | Case B: Forged Mutation / Dag Mismatch | Case C: Area Deficit)  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                           3. DOCUMENT INTAKE & EXTRACTION                              │
│  Upload or load sample: Sale Deed (সাফ-কবলা), Khatian (পর্চা), Mutation (নামজারি), Tax │
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

## 5. Technical Specifications & Architecture

### 5.1 Architecture Principles (Applying 10 Core Skills)
1. **Superpowers & TDD:** Deterministic verification logic with robust unit tests (`vitest`).
2. **Ponytail (Minimalist, Zero-Bloat):** Frontend-only, native browser APIs, client-side deterministic reconciliation, no unnecessary heavy dependencies or unstable backend servers.
3. **UI/UX Pro Max & Impeccable:** Beautiful visual hierarchy, Emerald & Slate luxury geospatial palette, dynamic interactive badges, dark/light theme support, responsive typography, WCAG AA accessible contrast.
4. **Caveman & Understand Anything:** Clear, crisp explanations of complex Bangladeshi legal concepts (e.g. *Why an RS khatian without a 9/KA mutation poses ownership eviction risks*).
5. **Archify & Addy Osmani:** Modular decoupled components:
   - `BangladeshInteractiveMap`: Preserved 64-district vector map
   - `DistrictIntelligenceDashboard`: Cadastral, economic, infrastructure context
   - `DueDiligenceWorkbench`: Multi-document uploader and extractor
   - `CrossVerificationEngine`: Deterministic discrepancy analyzer
   - `EnvironmentalRiskCard`: Location, zoning, flood & erosion context
   - `DueDiligenceReportModal`: Downloadable, printable executive dossier
   - `LandUnitConverter`: Accurate decimal, katha, bigha, square feet calculations.

### 5.2 The 12 Critical Document Identifiers Extracted & Cross-Checked

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

## 6. Discrepancy & Red Flag Classification Model

| Severity | Category | Example Scenario |
|---|---|---|
| 🔴 **CRITICAL RED FLAG** | Chain-of-Title Break | Seller presents deed based on RS Khatian, but no AC (Land) Mutation Khatian (ই-নামজারি পর্চা) exists in seller's name. Risk of eviction or dual-ownership. |
| 🔴 **CRITICAL RED FLAG** | Dag (Plot) Mismatch | Deed cites Hal (Current) Dag 812, but attached RS Khatian cites Sabek (Former) Dag 405 with no cross-referencing Dag-Suchi (দাগসূচি). |
| 🟠 **HIGH WARNING** | Area Discrepancy | Deed purports to sell 6.50 decimals, but the seller's recorded hissya in RS Khatian only equals 4.80 decimals (Deficit of 1.70 decimals). |
| 🟠 **HIGH WARNING** | Unpaid Land Tax | Dakhila receipt is expired by >3 years or lacks 10-digit digital e-Tax barcode verification. |
| 🟡 **MODERATE INCONSISTENCY** | Name Spelling Variance | Deed lists "Md. Rafiqul Islam", whereas Mutation Porcha spells "Rafiqul Islam Chowdhury" without national NID linkage. |
| 🔵 **VERIFIED EVIDENCE** | Document Concordance | Mouza, J.L. No, Dag No, and Area match perfectly across Deed, Mutation, and Dakhila. |

---

## 7. Actionable Official Verification Steps Provided in Every Report

Every report generated by LandWise AI gives the prospective buyer a practical 4-step official verification roadmap:
1. **ePorcha Digital Search (`eporcha.gov.bd`):** Verify whether the Khatian number and owner name exist in the digitized district record room.
2. **AC (Land) Office Mutation Register Inspection:** Check Register IX (নামজারি রেজিস্টার ৯) to confirm the DCR (Duplicate Carbon Receipt) and mutation case number are genuine.
3. **Sub-Registry Index II Search (তল্লাশি):** Inspect the Sub-Registry Office Index II (দলিল তল্লাশি) for the past 12–25 years to confirm the seller hasn't previously sold or mortgaged the same Dag to another party (Dual-deed fraud).
4. **DLRS Certified Mouza Map Order (`map.settlement.gov.bd`):** Order the official certified sheet matching the J.L. number and survey edition to verify road frontage and physical boundary coordinates with a licensed Amin / Surveyor.

---

## 8. Success Criteria & Hackathon Evaluation Matrix

- **100% Functional Preserved 64-District Map:** Zero regressions on district clicks, zoom, division filtering, or boundary rendering.
- **Flawless End-to-End Workflow:** User can select a district, inspect realistic sample document cases (or upload custom documents), see instant deterministic discrepancies, inspect environmental risks, and download a comprehensive Due-Diligence Report.
- **Zero Hallucination or Legal Claims:** Transparent evidence labeling, clear uncertainty indicators, and strict educational/advisory positioning.
- **Clean Code & High Performance:** Fast client-side performance, zero console errors, full TypeScript type safety, and 100% passing tests.
