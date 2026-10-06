# Content Moderation Analytics Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an enterprise-grade, offline-first Content Moderation and Trust & Safety analytics platform ("ApexTrust Operations") featuring a 4-tab interactive web dashboard, Python mock data generator, Erlang-C capacity planner, and programmatic Power BI TMDL export engine.

**Architecture:** Client-side offline-first architecture with pure HTML5, vanilla JavaScript (ES2022), custom CSS design tokens (Telus color theme), Chart.js visual layer, IndexedDB persistence, pure statistical mathematical engines, and in-browser JSZip Power BI `.pbip` model generation.

**Tech Stack:** JavaScript (ES2022), HTML5, CSS3, Chart.js, PapaParse, JSZip, Python 3.10+, Node.js (for verification tests), Git.

## Global Constraints

- Directory: `D:\Projects\content-moderation-dashboard-portfolio`
- Brand Colors: `--brand-primary: #492C73;`, `--brand-secondary: #66548C;`, `--brand-accent: #6FD904;`, `--brand-accent-dark: #74BF04;`, `--bg-app: #F2F2F2;`
- Generic white-labeled branding: "ApexTrust Operations" / "Global Trust & Safety Command Center"
- Zero external CDN dependencies (all vendor libraries in `vendor/`)
- Strict TDD execution: Test -> Fail -> Implement -> Pass -> Commit

---

### Task 1: Vendor Assets & Foundation Setup

**Files:**
- Create: `vendor/chart.umd.min.js`
- Create: `vendor/papaparse.min.js`
- Create: `vendor/jszip.min.js`
- Create: `.gitignore`

- [ ] **Step 1: Create vendor directory and copy vendor libraries from reference project**
- [ ] **Step 2: Add `.gitignore` for node_modules and scratch artifacts**
- [ ] **Step 3: Commit initial vendor foundation**

---

### Task 2: Synthetic Data Engine & Validation Test

**Files:**
- Create: `check-data-schema.js`
- Create: `generate_mock_data.py`
- Output: `dashboard-ready.csv`

**Interfaces:**
- Produces: 18-column canonical CSV (`Review_ID`, `Timestamp`, `Agent_ID`, `Tenure_Group`, `Queue_Name`, `Content_Type`, `Egregious_Flag`, `HITL_Routing`, `AHT_Seconds`, `TAT_Minutes`, `SLA_Breached`, `Decision_Action`, `QA_Audited`, `QA_Score`, `Error_Type`, `Appealed_Flag`, `Overturned_Flag`, `Content_Snippet`).

- [ ] **Step 1: Write `check-data-schema.js` test**
- [ ] **Step 2: Run `node check-data-schema.js` to verify failure**
- [ ] **Step 3: Implement `generate_mock_data.py` and run it to produce `dashboard-ready.csv`**
- [ ] **Step 4: Run `node check-data-schema.js` to verify pass**
- [ ] **Step 5: Commit data generation module**

---

### Task 3: Statistical Computation Engine & Math Verification

**Files:**
- Create: `check-math-stats.js`
- Create: `stats.js`

**Interfaces:**
- Produces: `window.ModerationStats` with methods:
  - `computeKpis(records)`: Total volume, weighted AHT, SLA attainment %, egregious count, QA pass rate, false positive/negative rates, overturn rate.
  - `filterRecords(records, filters)`: Multi-dimensional slicing by date range, queue, content type, tenure, egregious flag.
  - `aggregateByDate(records)`: Daily influx and throughput.
  - `aggregateByQueue(records)`: Queue volume, SLA %, AHT.
  - `aggregateByError(records)`: Pareto distribution of QA errors.

- [ ] **Step 1: Write `check-math-stats.js` test fixture**
- [ ] **Step 2: Run `node check-math-stats.js` to verify failure**
- [ ] **Step 3: Implement `stats.js`**
- [ ] **Step 4: Run `node check-math-stats.js` to verify pass**
- [ ] **Step 5: Commit stats computation engine**

---

### Task 4: Interactive Capacity & Erlang-C Engine

**Files:**
- Modify: `check-math-stats.js`
- Create: `capacity.js`

**Interfaces:**
- Produces: `window.CapacityPlanner` with methods:
  - `calcWorkloadHours(volume, ahtSeconds)`
  - `calcProductiveHours(shiftHours, shrinkageRate, occupancyRate)`
  - `calcRequiredFTE(workloadHours, productiveHours)`
  - `calcErlangC(trafficIntensity, servers)`
  - `evaluateScenario(inputs)`

- [ ] **Step 1: Add capacity planning test assertions to `check-math-stats.js`**
- [ ] **Step 2: Run `node check-math-stats.js` to verify failure**
- [ ] **Step 3: Implement `capacity.js`**
- [ ] **Step 4: Run `node check-math-stats.js` to verify pass**
- [ ] **Step 5: Commit capacity planning module**

---

### Task 5: Web UI Shell, Telus Design System & UI Structure Test

**Files:**
- Create: `check-ui-structure.js`
- Create: `brand.css`
- Create: `app.css`
- Create: `index.html`

**Interfaces:**
- Produces: Fully styled, responsive 4-tab HTML application with ARIA landmarks and WCAG 2.1 AA accessibility.

- [ ] **Step 1: Write `check-ui-structure.js`**
- [ ] **Step 2: Run `node check-ui-structure.js` to verify failure**
- [ ] **Step 3: Implement `brand.css`, `app.css`, and `index.html`**
- [ ] **Step 4: Run `node check-ui-structure.js` to verify pass**
- [ ] **Step 5: Commit web UI shell**

---

### Task 6: Visualizations & Reactive Chart Orchestration

**Files:**
- Create: `charts.js`
- Modify: `index.html`

**Interfaces:**
- Produces: `window.ModerationCharts` managing Chart.js instances across all 4 tabs, reactive filtering, data tables, and dynamic narrative alerts.

- [ ] **Step 1: Implement `charts.js` with all tab charts and lifecycle bindings**
- [ ] **Step 2: Verify all canvas contexts and rendering in headless DOM**
- [ ] **Step 3: Commit chart orchestration module**

---

### Task 7: Programmatic Power BI (.pbip / TMDL) Export Engine

**Files:**
- Create: `check-powerbi-tmdl.js`
- Create: `powerbi.js`

**Interfaces:**
- Produces: `window.PowerBIExport` generating a complete `.pbip` zip file containing TMDL definitions and duration-weighted DAX measures.

- [ ] **Step 1: Write `check-powerbi-tmdl.js`**
- [ ] **Step 2: Run `node check-powerbi-tmdl.js` to verify failure**
- [ ] **Step 3: Implement `powerbi.js`**
- [ ] **Step 4: Run `node check-powerbi-tmdl.js` to verify pass**
- [ ] **Step 5: Commit Power BI export engine**

---

### Task 8: End-to-End Verification, Documentation & Project Metadata Sync

**Files:**
- Modify: `PROJECT_META.md`
- Create: `README.md`

- [ ] **Step 1: Run complete verification suite (`check-*.js`)**
- [ ] **Step 2: Update `PROJECT_META.md` conforming to user rule template**
- [ ] **Step 3: Create comprehensive `README.md`**
- [ ] **Step 4: Final git commit and status check**
