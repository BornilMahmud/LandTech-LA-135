# 🗺️ Strategic Planning & Product Roadmap — LandTech-LA-135

**Document:** Roadmap, Sprint Planning, and Milestone Trajectory  
**Planning Cycle:** Q4 2026 – Q2 2027  
**Owner:** Technical Project Lead & Product Engineering  

---

## 1. Roadmap Milestones Overview

```plaintext
[Milestone 1: COMPLETE] ──► [Milestone 2: IN PROGRESS] ──► [Milestone 3: Q1 2027] ──► [Milestone 4: Q2 2027]
  • Extract Vectors           • Live Cadastral Mockups       • Real-time e-Porcha API     • 3D Terrain & DEM
  • Hero Interactive Map      • Traditional Land Calc        • Land Title Blockchain      • Offline Mobile GIS
  • Bilingual Toggle          • Division Dossier             • AI Zoning Bylaw Engine     • Real Estate Marketplace
```

---

## 2. Detailed Milestone Breakdown

### 🎯 Milestone 1: Vector Extraction & Hero Map Core (Completed)
- **Goal:** Extract authentic Bangladesh vector map from `AI_DEV_FEST080` and establish a high-performance web platform.
- **Key Deliverables:**
  - [x] Extract 64-district GeoJSON SVG polygons (`bangladeshDistrictsGeo.json`).
  - [x] Extract 8-division vector coordinates and corridor transaction flows.
  - [x] Implement interactive click selection, zoom in/out, and touch pan/drag.
  - [x] Build live Hero Dossier card for spatial metrics inspection.
  - [x] Support dual language (`English` & `বাংলা`).

---

### 🚀 Milestone 2: Cadastral Land Intelligence & Unit Conversion (Completed)
- **Goal:** Transform raw vector geography into actionable LandTech (PropTech) intelligence.
- **Key Deliverables:**
  - [x] Model land valuation benchmarks per katha across all 64 districts.
  - [x] Categorize cadastral survey status (CS, SA, RS, BRS).
  - [x] Build traditional Bangladeshi land measurement converter (`Katha`, `Decimal`, `Bigha`, `Acre`, `Sq Ft`).
  - [x] Create interactive Cadastral Dag & Mouza Explorer.
  - [x] Establish multi-theme visual selector (Authentic Atlas, Emerald GIS, Cyber Midnight).

---

### 🔮 Milestone 3: Automated Due Diligence & Government e-Porcha Sync (Target: Q1 2027)
- **Goal:** Bridge the platform with national land records for automated mutation checks.
- **Key Deliverables:**
  - [ ] Connect with national e-Khatian and e-Mutation API endpoints.
  - [ ] Automated title deed verification with conflict detection.
  - [ ] AI zoning compliance checker against RAJUK, CDA, KDA, and RDA masterplans.
  - [ ] PDF due diligence report generation for legal officers.

---

### 🌐 Milestone 4: 3D Topography, Hydrology & Mobile GIS (Target: Q2 2027)
- **Goal:** Introduce full spatial elevation models and offline-ready mobile applications.
- **Key Deliverables:**
  - [ ] Integrate 3D Digital Elevation Models (DEM) using Three.js / WebGL.
  - [ ] 50-year monsoon flood risk simulator based on river basin elevation.
  - [ ] Progressive Web App (PWA) with offline tile caching for remote land inspection.
  - [ ] Developer GraphQL API for institutional real estate platforms.

---

## 3. Sprint Allocation & Velocity

| Sprint | Focus Area | Story Points | Status |
| :---: | :--- | :---: | :---: |
| **Sprint 1** | Vector extraction, component architecture & Hero Map | 34 pts | **COMPLETE** |
| **Sprint 2** | Land valuation data, unit converter & Cadastral table | 28 pts | **COMPLETE** |
| **Sprint 3** | Integration tests, performance tuning & documentation | 18 pts | **COMPLETE** |
| **Sprint 4** | Live API mock integration & PDF export module | 24 pts | Planned |
| **Sprint 5** | 3D terrain prototyping & offline PWA setup | 32 pts | Backlog |
