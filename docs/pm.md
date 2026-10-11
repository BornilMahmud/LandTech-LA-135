# 📋 Product Management & PRD — LandTech-LA-135

**Product:** LandTech-LA-135 (Spatial Land Intelligence & Cadastral GIS Platform)  
**Document Owner:** Product Management Team  
**Target Release:** v1.0.0 (Public Alpha)  
**Last Updated:** October 12, 2026  

---

## 1. Vision & Problem Statement

### 1.1. The Problem
Land acquisition, valuation, and due diligence in Bangladesh are notoriously fragmented:
- Paper records (CS, SA, RS, BRS) are siloed across regional land registries (উপজেলা ভূমি অফিস).
- Valuation benchmarks are opaque, leaving developers vulnerable to pricing manipulation.
- Spatial visualization tools lack authentic vector boundaries down to the 64-district and mouza level.

### 1.2. The Solution
**LandTech-LA-135** democratizes geospatial and cadastral intelligence across Bangladesh through:
1. An **interactive hero map** featuring authentic vector boundaries for all **64 districts** and **8 divisions**.
2. Real-time **dossier inspection** delivering instant land valuations, zoning bylaws, flood risk indices, and infrastructure connectivity.
3. A **traditional land measurement engine** that bridges regional metrics (Decimal, Katha, Bigha) with institutional measurements (Sq Ft, Acres).

---

## 2. User Personas

| Persona | Role | Key Goals & Needs |
| :--- | :--- | :--- |
| **Rahim Chowdhury** | Real Estate Developer (Dhaka & Chattogram) | Needs to compare land rates per katha across suburban expansion corridors (Purbachal, Gazipur, Mirsarai). |
| **Sadia Rahman** | Expatriate Property Investor (UK / US) | Wants to assess title dispute risk and remote land viability in Sylhet and Cox's Bazar. |
| **Engr. Tanvir Ahmed** | GIS & Infrastructure Consultant | Requires authentic vector polygon shapes and topological data for transit corridor modeling. |
| **Farzana Yeasmin** | Financial Due Diligence Auditor | Verifies mouza dag/khatian survey validity (CS, SA, RS, BRS) before underwriting loans. |

---

## 3. Product Features & Functional Requirements

### 3.1. Feature 1: Interactive Hero Vector Map
- **FR-101:** Map must render full authentic vector polygons for all 64 districts upon page load without delay.
- **FR-102:** Users must be able to switch between **64 Districts**, **8 Administrative Divisions**, and **Satellite Hybrid** views.
- **FR-103:** Clicking any district or division must trigger an active state with high-contrast golden border (`#F59E0B`) and glowing pulse.
- **FR-104:** Smooth zoom controls (0.75x to 3.2x) and drag-to-pan must be functional with mouse and touch gestures.
- **FR-105:** Bilingual switch must toggle between English and authentic Bengali (`বাংলা`) typography seamlessly.

### 3.2. Feature 2: Real-Time District Dossier
- **FR-201:** Displays prevailing market rate (BDT/katha and BDT/decimal) based on actual sub-registry averages.
- **FR-202:** Displays Cadastral Survey Status (BRS Digital, City Survey, RS Validated).
- **FR-203:** Displays Primary Zoning (Commercial CBD, High-Density Residential, SEZ, Agro-Greenbelt).
- **FR-204:** Interactive mini plot valuation calculator allowing users to change Katha quantity and get instant total price.

### 3.3. Feature 3: Traditional Unit Converter & Valuation Engine
- **FR-301:** Seamless conversion between **Katha (কাঠা)**, **Decimal (শতাংশ)**, **Bigha (বিঘা)**, **Acre (একর)**, and **Sq Ft**.
- **FR-302:** Calculates total valuation in Crore (`কোটি`) and Lakh (`লাখ`) based on active district pricing.
- **FR-303:** One-click copy summary to clipboard.

### 3.4. Feature 4: Cadastral Mouza & Plot Explorer
- **FR-401:** Searchable dag (দাগ) and khatian (খতিয়ান) mock registry with title status badges (`Verified`, `Dispute-Free`, `Under Mutation`).

---

## 4. Key Performance Indicators (KPIs & OKRs)

- **Map Interaction Latency:** < 16ms per frame on hover and selection.
- **Search Time to Result:** < 50ms filtering 64 districts.
- **First Contentful Paint (FCP):** < 0.6 seconds.
- **User Engagement Time:** Target average session time > 3 minutes exploring geographic regions.
