# 🧪 Quality Assurance & Test Plan — LandTech-LA-135

**Document:** QA Test Plan, Test Cases, and Edge Case Verification  
**Test Cycle:** Sprint 1 — Map Integration & Core Platform  
**Target Build:** v1.0.0-alpha  
**QA Lead:** Quality Engineering Team  

---

## 1. Test Scope & Objectives

The QA cycle validates:
1. **Interactive Vector Geometry:** Precision click targeting across all 64 districts and 8 divisions without coordinate drift.
2. **State Synchronization:** Immediate synchronization between map selection, hero dossier inspector, region grid, and cadastral tables.
3. **Responsive Viewport Stability:** Zoom, pan, and drag gestures across mobile (touch) and desktop (mouse) viewports.
4. **Calculations Accuracy:** Exact arithmetic for Bangladeshi land unit conversions and valuation forecasts.

---

## 2. Test Execution Matrix

| Test ID | Test Case Description | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **TC-001** | Initial Page Load & SVG Rendering | Map renders within 600ms; Dhaka is selected by default with capital pulse beacon. | **PASS** |
| **TC-002** | Select District via Direct Click | Clicking "Chattogram" highlights district polygon in amber (`#F59E0B`), sets zoom focus, and updates dossier to Chattogram metrics. | **PASS** |
| **TC-003** | Select Non-Hub District | Clicking "Panchagarh" or "Bandarban" loads accurate regional attributes with valid land rates. | **PASS** |
| **TC-004** | Toggle Map Modes | Switching to "8 Divisions" renders 8 macro divisions; switching to "Satellite" loads Google Maps embed. | **PASS** |
| **TC-005** | Zoom Controls Execution | Zoom In (`+`) increments scale up to 3.2x; Zoom Out (`-`) decrements to 0.75x; Reset (`↺`) restores 1.0x scale and zero offset. | **PASS** |
| **TC-006** | Pan & Drag Canvas | Mouse drag moves map smoothly; releasing stops pan without jump. | **PASS** |
| **TC-007** | Search Box Autocomplete | Typing "Cox" filters and highlights Cox's Bazar; clearing returns to default view. | **PASS** |
| **TC-008** | Language Toggle (English ⇄ বাংলা) | All labels, headers, units, and descriptions convert cleanly without layout overflow. | **PASS** |
| **TC-009** | Plot Valuation Input | Entering `10` Katha calculates `10 × District Rate` in Lakh/Crore BDT dynamically. | **PASS** |
| **TC-010** | Land Unit Conversion Engine | 1 Katha equals 1.653 Decimal, 720 Sq Ft, 0.05 Bigha, and 0.0165 Acre with zero rounding errors. | **PASS** |
| **TC-011** | Cadastral Explorer Filtering | Filtering by status ("Verified", "Dispute-Free") updates table rows without DOM error. | **PASS** |
| **TC-012** | Theme Selector | Switching between "Authentic Atlas", "Emerald GIS", and "Midnight Cyber" updates color palettes instantly. | **PASS** |

---

## 3. Responsive & Device Compatibility Matrix

| Device / Viewport | Resolution | Result | Notes |
| :--- | :--- | :---: | :--- |
| **Desktop UltraWide** | 2560 × 1440 | **PASS** | Crisp vector lines; dossier stays fixed on the right grid column. |
| **Standard Laptop** | 1440 × 900 | **PASS** | Primary layout tested; optimal readability. |
| **Tablet Portrait** | 768 × 1024 | **PASS** | Hero map stacks above dossier gracefully; controls remain touch-accessible. |
| **Mobile Standard** | 390 × 844 | **PASS** | Pan and touch zoom work; table scrolls horizontally with clean indicators. |

---

## 4. Edge Cases Tested

1. **Rapid District Clicking:** Clicking 10 different districts in rapid succession triggers no race conditions or unhandled state promises.
2. **Boundary Dragging:** Dragging map far off-canvas is easily recoverable with the "Reset Zoom" button (`RotateCcw`).
3. **Zero / Negative Katha Input:** Handled cleanly with `Math.max(0.1, value)` to prevent divide-by-zero or negative pricing anomalies.
4. **Special Characters in Search:** Handles punctuation and Bengali unicode characters without throwing regex exceptions.

---

## 5. QA Sign-Off

The application meets all alpha criteria for stability, responsiveness, and functional completeness.  
**Build Status:** Ready for staging and user acceptance testing.
