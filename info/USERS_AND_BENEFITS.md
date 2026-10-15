# SetuLand & LandWise: Stakeholder Personas & Societal Impact

> **Who Uses the Platform, How It Solves Their Pain Points, and the Macro-Socioeconomic Impact on Bangladesh**  
> *Track P4: Digital Land Records, Verification & Cadastral Digitization (LandTech 2026)*

---

## 1. Executive Summary: The Human Dimension of the Land Crisis

In Bangladesh, land ownership is not merely an economic asset—it represents family legacy, retirement security, and ancestral identity. Yet, the land sector generates **over 75% of all civil and criminal litigations** clogging the judicial system, entangling more than **3.2 million active court cases**.

The fundamental driver is **structural opacity and institutional silos**:
- A buyer purchases land in good faith, only to discover it was mortgaged to a bank five years prior.
- An expatriate (NRB) in the UK or UAE sends remittances to buy ancestral land, only to find a corrupt middleman forged a deed and sold it to three different buyers.
- An honest citizen registers a deed at the Sub-Registry office, but spends 6 to 18 months visiting the AC Land office, paying thousands of Taka in unauthorized "speed money" simply to get their name mutated on the Record of Rights.

**SetuLand & LandWise** re-engineer this entire paradigm into a transparent, deterministic digital pipeline.

---

## 2. Comprehensive Stakeholder Matrix

```mermaid
mindmap
  root((SetuLand & LandWise Ecosystem))
    Citizens & NRBs
      Instant Deed Pre-Verification
      Zero-Touch Mutation
      SMS & QR Porcha Tracking
      Protection Against Fraud
    Sub-Registrars
      1-Click 5-Point Validation
      Automated Fee Breakdown
      Instant Escrow Parcel Lock
      Immunity from Fraud Complicity
    AC Land & Tahsildars
      Auto-Initiated Mutation Queue
      Digital Field Verification Log
      1-Click Sanction & Auto-Split
      Zero Backlog & Audit Trails
    Commercial Banks
      Real-Time Mortgage Lien Register
      Instant NOC Settlement
      Zero Non-Performing Loan Defaults
    Real Estate & Industry
      Bulk Cadastral Title Screening
      Due Diligence in Minutes
      Secure Institutional Land Banks
    Judiciary & Courts
      Digital Injunction Intercept
      Immutable Chain-of-Title Evidence
      75% Reduction in Land Litigations
    DC Acquisition Branch
      Gazette Infrastructure Overlay
      Zero Double-Compensation Fraud
```

---

## 3. Detailed Stakeholder Personas & Impact Analysis

---

### Persona 1: General Citizens, Property Buyers & Non-Resident Bangladeshis (NRBs)

#### Profile & Current Pain Points
- **The Expatriate Dilemma**: Over 10 million NRBs contribute $25B+ annually in foreign remittances. A significant portion is invested in homeland property. However, NRBs cannot physically monitor their land, making them prime targets for illegal encroachment and counterfeit deeds.
- **The Middle-Class Nightmare**: Buying a plot in Savar, Gazipur, or Purbachal often consumes life savings. Buyers lack the specialized legal knowledge to decipher handwritten Persian/Bangla CS/SA/RS porchas or discover hidden bank liens.

#### How SetuLand & LandWise Solves This:
1. **Public Title Verification Portal**: Anyone can input a Khatian number, Dag number, and JL code to verify the legal chain-of-title across CS (1940), SA (1962), RS (1985), and BS (2012).
2. **Instant Encumbrance Alert**: Immediate red-flag alerts if the plot has an active civil court stay order, bank mortgage lien, or DC acquisition notice.
3. **Automated Zero-Touch Mutation**: The moment the buyer registers the deed at the Sub-Registry, the e-mutation case is automatically spawned. The buyer receives an automated SMS tracking ID and receives a digitally signed Porcha with a secure QR code within 48 hours.

#### Before vs. After Transformation
| Dimension | Traditional Manual System | With SetuLand & LandWise |
| :--- | :--- | :--- |
| **Due Diligence Time** | 3 to 6 weeks traversing multiple offices | **< 30 seconds online** |
| **Mutation Process** | Manual application, 4–6 physical visits, 45–180 days | **Zero-touch, auto-initiated, < 48 hours** |
| **Middleman / Bribery Cost** | ৳15,000 to ৳80,000 in unauthorized "speed money" | **৳0 (Statutory ৳1,170 bundled fee only)** |
| **Risk of Fake Title** | Extremely high (1 in 4 plots has overlapping claims) | **0% (Verified via SHA-256 cryptographic ledger)** |

---

### Persona 2: Sub-Registrars & Registry Officials (Ministry of Law)

#### Profile & Current Pain Points
- Sub-registrars are legally mandated under the **Registration Act, 1908** to register deeds presented with apparent prima facie compliance.
- They have **no real-time digital access** to AC Land revenue records, bank lien ledgers, or civil court injunctions.
- Corrupt syndicates exploit this lack of verification to register fraudulent deeds. When fraud is later uncovered, Sub-Registrars face Anti-Corruption Commission (ACC) inquiries and disciplinary suspensions despite having had no technical means to verify the plot in real-time.

#### How SetuLand & LandWise Solves This:
1. **1-Click 5-Point Verification Engine**: Before printing or executing a deed, the Sub-Registrar clicks **"Run Automated 5-Point Verification"**. Within 400 milliseconds, the engine queries the unified database and validates:
   - ✅ National ID biometric validity of seller & buyer.
   - ✅ Khatian ownership & available decimal balance.
   - ✅ Active bank mortgage liens (CIB integration).
   - ✅ Civil court stay orders (Order 39 Rule 1 CPC).
   - ✅ DC Office acquisition gazettes.
2. **Automated Statutory Fee Calculation**: Eliminates stamp duty disputes and cash handling:
   - Stamp Duty (1.5%)
   - Registration Fee (1.0%)
   - Local Government Tax (3.0%)
   - Capital Gains Tax (2.0%)
   - Bundled e-Mutation Fee (৳1,170)
3. **Instant Land Escrow Lock**: The instant the deed is executed, the transferred decimals are automatically locked, preventing the seller from rushing to another Sub-Registry office to execute a second deed on the same parcel.

---

### Persona 3: Assistant Commissioners of Land (AC Land) & Tahsildars (Ministry of Land)

#### Profile & Current Pain Points
- An average Upazila AC Land office receives **400 to 1,200 mutation applications monthly**.
- Officers are overwhelmed with physical paper dockets, manual field verification notes, and physical hearings.
- Discrepancies between manual deed copies and revenue registers create massive backlogs (often exceeding 6 months), inviting public distrust.

#### How SetuLand & LandWise Solves This:
1. **Auto-Initiated Work Queue**: No citizen needs to submit an e-mutation application. Deeds registered at the Sub-Registry appear in the AC Land’s digital queue within seconds, accompanied by verified deed metadata and fee receipts.
2. **Integrated Tahsil Verification Workflow**: Union Land Sub-Offices (Tahsil) receive a digital prompt to complete ground verification with pre-filled survey records.
3. **1-Click Sanction & Automated Khatian Split**: When the AC Land approves the case:
   - The PostgreSQL statutory trigger (`trg_execute_khatian_split`) instantly deducts the decimals from the seller's parent khatian.
   - A new child khatian is generated with an immutable SHA-256 hash.
   - A digital Khatiyan/Porcha with a secure QR code is published for the citizen.

---

### Persona 4: Commercial Banks & Financial Institutions (Mortgage Credit)

#### Profile & Current Pain Points
- Commercial banks in Bangladesh hold over **৳1.4 Trillion ($12B+) in real estate mortgage-backed loans**.
- "Mortgage Fraud" is widespread: borrowers pledge title deeds as collateral to Bank A, claim they "lost" the deed, obtain a duplicate copy from the Sub-Registry, and pledge the exact same property to Bank B or sell it to an unsuspecting buyer.
- Banks face multi-year legal battles under the **Artha Rin Adalat Ain, 2003** to auction encumbered properties with disputed titles.

#### How SetuLand & LandWise Solves This:
1. **Real-Time Digital Lien Registry**: When a bank sanctions a loan, the mortgage lien is recorded in the platform's immutable ledger.
2. **Instant Pre-Registration Block**: The Sub-Registry engine strictly blocks any deed registration on mortgaged land unless the bank issues a digitally authenticated Release Order / NOC.
3. **Portfolio Health Monitoring**: Banks can audit their entire mortgage collateral portfolio across 64 districts in real time.

---

### Persona 5: Real Estate Developers & Industrial Infrastructure Builders

#### Profile & Current Pain Points
- Real estate developers (e.g., REHAB members) and industrial conglomerates require 50 to 500 acres for housing developments or economic zones.
- Land aggregation requires vetting hundreds of individual cadastral plots (Dags). A single disputed plot or fraudulent CS/RS mismatch can stall a ৳500 Crore project for years.

#### How SetuLand & LandWise Solves This:
1. **Batch Cadastral Due Diligence**: Developers can upload a schedule of 100+ Dag numbers and receive an instantaneous risk report.
2. **Interactive Cadastral Mouza Map**: High-resolution vector polygon rendering displays clear plots in green, pending mutations in amber, and encumbered/mortgaged plots in red.
3. **Historical Lineage Tracing**: Visualizes the evolution of ownership across 80 years, proving undisputed continuity of title.

---

### Persona 6: Judiciary, Civil Courts & Legal Advocates

#### Profile & Current Pain Points
- Land dispute cases (Title Suits, Partition Suits, Specific Performance Suits) drag on for **10 to 25 years** across District Courts, High Court Division, and Appellate Division.
- Judges are forced to evaluate conflicting, yellowed paper documents, conflicting handwriting, and forged seals.

#### How SetuLand & LandWise Solves This:
1. **Instant Digital Injunction Intercept**: When a civil judge issues a temporary injunction under Order 39 Rule 1 of the Code of Civil Procedure (CPC), the court clerk enters the order into the platform. That Dag is immediately locked nationwide.
2. **Cryptographic Evidentiary Standard**: Digital porchas and deeds contain deterministic SHA-256 hashes linked to an immutable Merkle audit ledger, eliminating evidentiary disputes regarding document alteration.
3. **Drastic Litigation Reduction**: By preventing double selling and forged transfers at the source, new land litigation filings drop by an estimated **65% to 80%**.

---

### Persona 7: District Administration (DC Land Acquisition Branch)

#### Profile & Current Pain Points
- For national infrastructure megaprojects (highways, bridges, economic zones, metro rail), the government acquires thousands of acres under the **Acquisition and Requisition of Immovable Property Act, 2017**.
- Corrupt syndicates rapidly buy up gazetted land at discounted rates or fabricate deeds to claim 300% government compensation payouts, defrauding the national exchequer.

#### How SetuLand & LandWise Solves This:
1. **Gazette Overlay Lock**: The DC Land Acquisition Branch logs preliminary Section 4 acquisition notices directly into the platform.
2. **Automatic Transaction Halt**: All private transactions, mutations, and sub-divisions on gazetted plots are automatically blocked.
3. **Compensation Audit Trail**: Compensation payouts are tied to verified NIDs and khatians, preventing double-compensation fraud.

---

## 4. Macro-Socioeconomic Transformation Metrics

| Key Performance Indicator | Baseline (Manual Era) | With SetuLand & LandWise | Societal Impact |
| :--- | :--- | :--- | :--- |
| **Land Disputes Backlog** | 3.2M+ active cases | Expected 70% decrease in new filings | Decongests civil courts; frees citizens from intergenerational litigation. |
| **Average Mutation Duration** | 45 to 180 days | **< 48 hours** | Eliminates wait times and physical bureaucratic burden. |
| **Citizen Out-of-Pocket Cost** | ৳15,000 – ৳80,000 (Bribery) | **৳1,170 (Official Fee)** | Saves citizens an estimated ৳4,500 Crore annually in extortion. |
| **Double Selling Fraud** | Common across all 64 districts | **0% (Mechanically Blocked)** | Complete investment security for property buyers. |
| **Bank Mortgage Collateral Defaults** | High non-performing loan risk | **Near 0% due to digital lien enforcement** | Financial sector stability and reduced banking NPAs. |
| **Government Revenue Leakage** | Widespread under-valuation | **Automated statutory fee calculation** | Maximizes stamp duty and municipal tax revenue collection. |
