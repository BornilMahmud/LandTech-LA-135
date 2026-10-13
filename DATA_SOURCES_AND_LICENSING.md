# LandWise AI — Bangladesh Land Geospatial & Cadastral Data Sources & Licensing Report

**Report Date:** October 2026  
**Auditor:** LandWise AI Research & Geospatial Engineering Team  
**Methodology:** Direct automated scraping and metadata extraction via Firecrawl MCP & Grounded Web Discovery.

---

## 1. Executive Summary

This report establishes the factual data availability, access constraints, legal reuse boundaries, and technical architecture for integrating cadastral and geospatial information into **LandWise AI (Bangladesh Land Due-Diligence Assistant)**.

LandWise AI strictly adheres to the principle that **publicly viewable does not equal open-source or freely redistributable**. Rather than scraping, caching, or distributing proprietary or official government-restricted cadastral map sheets without authorization, LandWise AI implements a **provenance-grounded, privacy-preserving, and legally compliant architecture**:
1. Utilizing open-domain vector administrative boundaries (64 districts, 8 divisions, upazila geodata).
2. Referencing official DLRS and Ministry of Land portals with verifiable links, guidance, and sheet lookup numbers.
3. Supplying synthetically generated and anonymized multi-record test packages modeled strictly on authentic Bangladesh legal formats (Saf-Kabala deed, CS/SA/RS/BS Khatians, Namjari Mutation Khatian, Dakhila tax receipt).

---

## 2. In-Depth Audit of Target Portals

### 2.1 Bhumipedia (`https://bhumipedia.land.gov.bd/`)
* **Operating Entity:** Ministry of Land (গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের ভূমি মন্ত্রণালয়).
* **Platform Purpose:** National digital legal encyclopedia and knowledge base for land laws, ordinances, presidential orders, rules, circulars, gazettes, manuals, and citizen land education.
* **Key Content Scraped / Indexed:**
  * **Core Statutes:** *State Acquisition and Tenancy Act, 1950 (SAT Act 1950)*; *Land Crime Prevention and Redress Act, 2023 (ভূমি অপরাধ প্রতিরোধ ও প্রতিকার আইন, ২০২৩)*; *Land Reform Act, 2023 (ভূমি সংস্কার আইন, ২০২৩)*; *Land Development Tax Act, 2023 (ভূমি উন্নয়ন কর আইন, ২০২৩)*; *Acquisition and Requisition of Immovable Property Act, 2017*.
  * **Standard Terminology:** Definitive definitions for *Khatian (খতিয়ান)*, *Dag / Plot (দাগ)*, *Mouza (মৌজা)*, *J.L. Number (জে.এল. নম্বর)*, *Namjari / Mutation (নামজারি)*, *Dakhila (দাখিলা)*, *Porcha (পর্চা)*, *Chitta (চিটা)*, *Hissya (হিস্যা / Share)*.
* **Access & Firewall Behavior:** The portal implements aggressive rate limiting and geographic firewalling against foreign non-browser IPs (blocking basic headless bot user-agents).
* **Reuse Terms & Licensing:**
  * **Statutory Content:** Government laws, circulars, and official gazettes are public legal records and non-copyrightable statutes under Bangladesh law. They may be referenced, cited, and used to establish due-diligence verification rules.
  * **Proprietary Elements:** Platform UI assets, branding, and proprietary backend chatbots remain government property. LandWise AI embeds the statutory rules and definitions into its client-side validation logic while providing deep-link references to Bhumipedia.

---

### 2.2 Mouza.BD (`https://mouza.bd/en/mouza-maps`)
* **Operating Entity:** Private digital aggregator / map bureau (`mouza.bd` / Digital Mouza Map).
* **Platform Purpose:** Commercial directory and indexed repository containing reference digital mouza map sheets across all 8 divisions and 64 districts of Bangladesh.
* **Key Content Scraped via Firecrawl:**
  * **Coverage:** Over 200,000 mouza map sheets cataloged across 64 districts:
    * Dhaka Division: 45,699 sheets
    * Chittagong Division: 35,034 sheets
    * Rangpur Division: 19,913 sheets
    * Mymensingh Division: 16,382 sheets
    * Khulna Division: 16,049 sheets
    * Barisal Division: 12,776 sheets
    * Rajshahi Division: 12,446 sheets
    * Sylhet Division: 6,639 sheets
  * **Survey Coverage:** Distinguishes sheets by historical survey editions: CS (Cadastral Survey), SA (State Acquisition Survey), RS (Revisional Survey), BS/BDS/City Survey (Bangladesh Survey), and Diyara Survey.
* **Explicit Legal Notice & Limitations (Quoted Directly from Scraped Output):**
  > *"The sheets are reference copies of public survey records—not certified copies. Use them to locate a dag, verify land before buying, brief a surveyor or prepare bank paperwork; obtain certified copies from the land office or ePorcha when a legal step requires them."*
* **Access & Commercial Terms:**
  * Free account required for search; checkout/payment gateway attached for full-resolution sheet downloads (`spagreen.sgp1.digitaloceanspaces.com`).
* **Licensing Decision for LandWise AI:**
  * **Do Not Mirror:** Commercial raster sheets cannot be bulk-scraped or redistributed without license.
  * **Integration Strategy:** LandWise AI exposes Mouza sheet numbers, J.L. index lookups, and survey edition cross-referencing, linking prospective buyers to verified sources while demonstrating plot boundaries via open vector and synthetic cadastral overlays.

---

### 2.3 DLRS Map Purchase System (`https://map.settlement.gov.bd/`)
* **Operating Entity:** Department of Land Records and Surveys (DLRS), Ministry of Land, Government of Bangladesh (ভূমি রেকর্ড ও জরিপ অধিদপ্তর).
* **Platform Purpose:** Official national digital platform for searching, purchasing, and couriering certified Mouza maps.
* **Key Content Scraped via Firecrawl:**
  * **Digitization Status:** **239.9K+ digitized maps** covering **63 districts**.
  * **Survey Types:** CS, SA, RS, BRS, BDS.
  * **Workflow:** Location search (Division → District → Upazila → Mouza → Sheet Number) → Secure electronic payment (bKash, Nagad, Visa/Mastercard, Sonali Bank) → Digital instant download or printed certified hardcopy via postal courier.
  * **Digitization On-Demand:** Provides a "Can't find your map? Request a scan" feature for remaining rural mouzas.
* **Legal Status & Reuse Restrictions:**
  * Official cadastral records maintained by DLRS are certified government survey records.
  * Under DLRS regulations and Bangladesh Land Records rules, certified copies require statutory administrative fees. Unauthorized replication or mirroring of paid government map files is strictly prohibited.
* **Integration Strategy:**
  * LandWise AI includes DLRS Sheet verification checklists in the due-diligence report.
  * For any investigated plot (Dag), LandWise AI provides the prospective buyer with exact DLRS search parameters (Division, District, Upazila, Mouza J.L. No., Survey type, and Sheet number) with a direct link to `map.settlement.gov.bd` to order the official certified sheet.

---

### 2.4 Smart Bhumi Naksha / Digital Land Zoning (`https://map.land.gov.bd/`)
* **Operating Entity:** Ministry of Land, Bangladesh — National Digital Land Zoning Project (মৌজা ও প্লট ভিত্তিক জাতীয় ডিজিটাল ভূমি জোনিং প্রকল্প).
* **Platform Purpose:** Plot-based and Mouza-based digital land zoning to protect agricultural lands, wetlands, and forests while guiding residential, commercial, industrial, and infrastructure development.
* **Key Content Scraped via Firecrawl:**
  * **Geographic Coverage:** Active plot-level satellite georeferenced data rolling out across 90+ upazilas (e.g., Nabinagar, Chouddagram, Jhalokathi Sadar, Dimla, Bhandaria, Anwara, Tongi, Nilphamari Sadar, Mymensingh Sadar, Sonargaon, Brahmanbaria Sadar, Cox's Bazar, etc.).
  * **Data Classifications:**
    * Agricultural (কৃষি)
    * Residential (আবাসিক)
    * Waterbodies & Rivers (জলমহাল ও নদী)
    * Forest & Reserves (বনাঞ্চল)
    * Industrial / Commercial (শিল্প প্রতিষ্ঠান / বাণিজ্যিক)
    * Transport & Highways (রাস্তাঘাট)
    * Coastal & Char Lands (উপকূলীয় ও চরাঞ্চল)
  * **Connected Citizen Portals:**
    * e-Mutation: `https://mutation.land.gov.bd/`
    * Digital Record Room (ePorcha): `https://eporcha.gov.bd/`
    * Land Hotline: `16122` / `+880 9612-316122`
* **Licensing & Integration Strategy:**
  * LandWise AI incorporates the official zoning classifications into its Environmental & Cadastral Risk engine.
  * When a buyer investigates a plot, LandWise AI evaluates zoning alignment (e.g., alert if buying agricultural land claiming residential permit without zoning conversion).

---

## 3. Data Source Synthesis Matrix

| Source | Domain | Coverage | Access Model | LandWise AI Integration Mode |
|---|---|---|---|---|
| **Bhumipedia** | `bhumipedia.land.gov.bd` | National (All BD) | Free Public Legal Portal | Rules Engine: S.A.T. Act 1950 & Land Crime Act 2023 statutory definitions |
| **Mouza.BD** | `mouza.bd` | 64 Districts, 200K+ Sheets | Freemium / Private Aggregator | Cadastral survey edition metadata & J.L. index reference guidance |
| **DLRS Portal** | `map.settlement.gov.bd` | 63 Districts, 239.9K+ Maps | Official Gov (Paid Certified Delivery) | Actionable verification pathway & DLRS purchase guidance generator |
| **Smart Bhumi Naksha** | `map.land.gov.bd` | 90+ Upazilas (Expanding) | Public Land Zoning Portal | Environmental zoning risk indicators & plot-usage alignment scoring |
| **ePorcha (DLRS)** | `eporcha.gov.bd` | National | Gov Portal (Khatian Verification) | Verification step guidance for online Khatian search |
| **e-Mutation** | `mutation.land.gov.bd` | National | Gov Portal (AC Land office records) | Mutation ledger checking step & Khatian chain auditing |

---

## 4. Ethical Compliance & Hackathon Rules Summary

1. **Zero Piracy & Zero Bypassing:** No authentication bypass, scraping of protected paywalled raster tiles, or API secret exploitation.
2. **Transparent Provenance:** All datasets used in the frontend are explicitly attributed. Synthetic documents and demonstration packages are prominently labeled as *"Simulated Demonstration Package"* with realistic fields.
3. **Legal Disclaimer Transparency:** Prominently declare that LandWise AI is an assistive pre-purchase due-diligence tool; it does not issue certified legal opinions, establish criminal fraud, or replace official search at the Sub-Registry Office, AC (Land) office, or qualified legal counsel.
