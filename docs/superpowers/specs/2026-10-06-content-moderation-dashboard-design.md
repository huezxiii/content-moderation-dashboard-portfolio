# Content Moderation Operations & Analytics Dashboard - Design Specification

**Project**: ApexTrust Content Moderation Operations & Trust & Safety Intelligence Platform  
**Directory**: `D:\Projects\content-moderation-dashboard-portfolio`  
**Date**: 2026-10-06  
**Status**: Approved Design  

---

## 1. Executive Summary & Purpose
This project delivers an enterprise-grade, offline-first Content Moderation and Trust & Safety analytics platform. Derived from the business analysis principles in `content-moderation-ba-guide.md` and modeled on the robust architecture of `speech-analytics-dashboard-portfolio`, this application equips operational leaders, workforce planners, and quality managers with real-time operational intelligence.

The platform provides a generic white-labeled command center ("ApexTrust Operations / OmniSafety Analytics") styled under a refined enterprise theme utilizing Telus brand colors (Deep Aubergine `#492C73`, Slate Purple `#66548C`, Bright Lime `#6FD904`, Olive Lime `#74BF04`, and Neutral Canvas `#F2F2F2`).

---

## 2. Deliverables & System Architecture

The project consists of four interconnected core modules:

1. **Synthetic Data Engine (`generate_mock_data.py`)**:
   - Synthesizes 2,500+ realistic operational moderation records spanning a 30-day timeline.
   - Embeds realistic operational patterns: diurnal hourly arrival spikes, policy ambiguity variance, high-risk video backlog bursts, and emergency 1-hour TCO escalation triggers.
   - Outputs canonical CSV: `dashboard-ready.csv`.

2. **Offline-First Client-Side Web Dashboard (`index.html`, `app.css`, `brand.css`, `stats.js`, `charts.js`, `capacity.js`)**:
   - Zero-external-CDN architecture using bundled vendor libraries in `vendor/` (`chart.umd.min.js`, `papaparse.min.js`, `jszip.min.js`).
   - High-performance in-memory filtering and IndexedDB local caching.
   - 4-tab analytical command center covering Executive SLAs, Queue & Policy Mechanics, Quality & Audits, and Workforce Capacity Simulation.

3. **Interactive Workforce Capacity & Erlang-C Engine (`capacity.js`)**:
   - Full implementation of Section 5 capacity planning and variance tracking formulas from the BA guide.
   - Dynamic what-if simulator adjusting volume, handling time, shift constraints (standard 8h vs 5.5h egregious safeguards), occupancy, and shrinkage.

4. **Programmatic Power BI Project Exporter (`powerbi.js`)**:
   - In-browser generator producing complete `.pbip` zip packages with modern TMDL semantic models and mathematically sound duration-weighted DAX measures.

5. **Automated Quality Verification Suite (`check-*.js`)**:
   - Automated Node.js test scripts validating schema compliance, statistical accuracy, Power BI model integrity, and UI/accessibility standards.

---

## 3. Canonical 18-Column Data Schema

All operational analytics and Power BI exports conform strictly to the following 18-column canonical schema:

| Column | Type | Allowed Values / Format | Description |
| :--- | :--- | :--- | :--- |
| `Review_ID` | String | `MOD-2026-XXXXX` | Unique identifier per moderation interaction |
| `Timestamp` | Datetime | ISO 8601 (`YYYY-MM-DD HH:MM:SS`) | Timestamp of content arrival / ingestion |
| `Agent_ID` | String | `AGENT_01` to `AGENT_15` | Anonymized moderator identifier |
| `Tenure_Group` | String | `New Hire (<30d)`, `Core (1-6mo)`, `Senior (6mo+)` | Agent operational experience tier |
| `Queue_Name` | String | `Violence_HighRisk`, `Hate_Speech`, `Fraud_Scams`, `Spam_Commercial`, `Emergency_TCO` | Operational queue routing |
| `Content_Type` | String | `Text_Post`, `Static_Image`, `Short_Video`, `Live_Stream` | Media modality reviewed |
| `Egregious_Flag` | Integer | `0` or `1` | High-harm content flag requiring exposure controls |
| `HITL_Routing` | String | `Auto_Approved`, `Auto_Rejected`, `Manual_Review`, `Tier2_Escalated` | Human-in-the-Loop triage classification |
| `AHT_Seconds` | Float | Positive numeric (e.g. 15.0 – 300.0) | Active handling time spent by agent on review |
| `TAT_Minutes` | Float | Positive numeric (e.g. 2.0 – 1440.0) | Turnaround time from flag to final decision |
| `SLA_Breached` | Integer | `0` or `1` | Adherence to SLA window (1h for TCO, 4h-24h for standard) |
| `Decision_Action` | String | `Approve_Keep`, `Remove_Delete`, `Content_Warning`, `Account_Suspend`, `Escalate` | Enforcement outcome executed |
| `QA_Audited` | Integer | `0` or `1` | Whether sampled for QA audit (~12% rate) |
| `QA_Score` | Float | `0.0` to `100.0` | Quality assurance evaluation score |
| `Error_Type` | String | `None`, `False_Positive`, `False_Negative`, `Wrong_Selection` | Quality error taxonomy |
| `Appealed_Flag` | Integer | `0` or `1` | Whether decision was disputed by user |
| `Overturned_Flag`| Integer | `0` or `1` | Whether appeal reversed the initial action |
| `Content_Snippet`| String | Sanitized text string | Generic, non-PII contextual summary of content |

---

## 4. Visual Design System & Brand Palette

The dashboard utilizes the Telus-inspired color palette configured via CSS custom properties in `brand.css`:

```css
:root {
  /* Brand Core Palette */
  --brand-primary: #492C73;        /* Deep Aubergine - Headers, active navigation, primary action */
  --brand-secondary: #66548C;      /* Slate Purple - Subheadings, card accents, borders */
  --brand-accent: #6FD904;         /* Bright Lime - Key KPI highlights, SLA positive badges */
  --brand-accent-dark: #74BF04;    /* Olive Lime - Chart series primary accent, hover states */
  
  /* Neutral Canvas */
  --bg-app: #F2F2F2;               /* Neutral light background */
  --bg-card: #FFFFFF;              /* Pure white elevated cards */
  --border-subtle: #E2E8F0;        /* Subtle slate borders */
  --text-main: #1E1E24;            /* High-contrast dark charcoal text */
  --text-muted: #64748B;           /* Muted slate text */

  /* Operational Status Semantics */
  --status-success: #10B981;       /* Target Met / Compliant */
  --status-warning: #F59E0B;       /* At-Risk / High Occupancy */
  --status-danger: #EF4444;        /* SLA Breach / False Negative / Egregious */
  --status-info: #0284C7;          /* Triage / Informational */
}
```

---

## 5. Detailed Dashboard View Architecture

### Global Controls & Header
* Brand title: **ApexTrust Operations** with subtitle *Global Trust & Safety Intelligence Command*.
* Global Filter Bar: Date Range picker, Queue selector, Content Type selector, Tenure filter, and Egregious toggle.
* Top Actions: "Export Power BI (.pbip)", "Export Filtered CSV", "Reset Filters", and Active Record Counter.

### Tab 1: Executive Operations Hub
1. **Strategic KPI Banner**:
   - Total Resolved Volume & Daily Throughput
   - Weighted Average Handling Time (AHT) in seconds
   - SLA Compliance Rate % (Target: ≥95.0%)
   - Critical Escalations & Egregious Exposure Count
   - Audited QA Pass Rate % (Target: ≥98.0%)
2. **Daily Volume Influx vs Resolution Velocity (Dual-Axis Chart)**:
   - Bars: Incoming flags vs Closed reviews.
   - Line: Daily SLA compliance %.
3. **HITL Automation Funnel**:
   - Visual breakdown of Auto-Approved, Auto-Rejected, Manual Queue, and Tier-2 Escalated volumes.
4. **Queue SLA Attainment Leaderboard**:
   - Horizontal bar chart comparing queue SLA attainment against the 95% baseline target line.
5. **Executive Dynamic "So-What" Narrative**:
   - Automated text callout synthesizing current operational bottlenecks and capacity alerts.

### Tab 2: Queue & Policy Command
1. **Operational Metrics**: Action Rate %, Top Policy Violation, High-Risk Video Volume, Median Queue TAT.
2. **Policy Violation Breakdown (Donut/Doughnut)**:
   - Proportional split across Hate Speech, Violence, Fraud, Spam, and Emergency TCO.
3. **Media Format Complexity vs Handling Time (Bar / Grouped Chart)**:
   - AHT comparison for Text, Image, Video, and Live Stream against SLA thresholds.
4. **Diurnal Heatmap / Queue Congestion Grid**:
   - Hourly arrival distribution across shifts (Day, Evening, Night) to identify peak staffing stress.
5. **Enforcement Decision Distribution**:
   - Distribution of Approve, Remove, Warning, Suspend, and Escalate actions across queues.

### Tab 3: Quality, Audits & Appeals Assurance
1. **Quality Metrics**: Fleet QA Score %, False Positive Rate %, False Negative Rate % (Platform Risk), Overturn Rate % on Appeals.
2. **Audit Error Pareto Chart**:
   - Distribution of False Positives, False Negatives, and Wrong Selection errors.
3. **Agent QA Accuracy vs AHT Correlation (Scatter Plot)**:
   - 4-Quadrant speed vs quality analysis:
     - Quadrant I: High Accuracy & High Speed (Top Performers)
     - Quadrant II: High Accuracy & Low Speed (Thorough / Needs Speed Coaching)
     - Quadrant III: Low Accuracy & Low Speed (Critical Support Required)
     - Quadrant IV: Low Accuracy & High Speed (Rushed Decisions / High Error Risk)
4. **Appeals & Reversal Trajectory (Time-Series)**:
   - Weekly volume of user appeals vs reversed enforcement decisions.
5. **Audit Drill-Through Grid**:
   - Paginated, searchable record table showing error tags, reviewer tenure, and contextual snippets.

### Tab 4: Workforce Capacity & Erlang-C Planner
1. **Interactive Controls & Sliders**:
   - *Forecasted Volume*: 1,000 to 50,000 items/day.
   - *Handling Time (AHT)*: 15 to 300 seconds.
   - *Shift Duration*: Standard 8.0 hours vs Egregious Queue Safeguard (5.5 hours).
   - *Target Occupancy*: 70% to 90% (with visual warning flag when exceeding 85% burnout limit).
   - *Total Shrinkage*: 15% to 40% (Internal breaks/training + External leave).
2. **Real-time Mathematical Formulas**:
   - $\text{Workload Hours} = \frac{\text{Volume} \times \text{AHT}}{3600}$
   - $\text{Productive Hours per Agent} = \text{Shift Hours} \times (1 - \text{Shrinkage}) \times \text{Occupancy}$
   - $\text{Required FTEs} = \frac{\text{Workload Hours}}{\text{Productive Hours per Agent}}$
3. **Variance & Staffing Gap Cards**:
   - Required FTEs vs Roster FTEs (Headcount Surplus or Deficit).
   - Erlang-C estimated queue delay and probability of wait.
   - Prescriptive recommendations for operational shift reallocation.

---

## 6. Programmatic Power BI Export Specification (`powerbi.js`)

Power BI export generates a valid `.pbip` zip package containing:
* Semantic Model tables: `Moderation` (Canonical Fact Table), `DateTable` (Time Intelligence), `CapacityParams`.
* Core DAX Measures:
  ```dax
  Total Reviews = COUNTROWS('Moderation')
  Total Workload Hours = SUMX('Moderation', 'Moderation'[AHT_Seconds]) / 3600
  Weighted AHT = DIVIDE(SUM('Moderation'[AHT_Seconds]), COUNTROWS('Moderation'), 0)
  SLA Attainment % = DIVIDE(CALCULATE(COUNTROWS('Moderation'), 'Moderation'[SLA_Breached] = 0), COUNTROWS('Moderation'), 0)
  QA Accuracy % = CALCULATE(AVERAGE('Moderation'[QA_Score]), 'Moderation'[QA_Audited] = 1)
  False Positive Rate % = DIVIDE(CALCULATE(COUNTROWS('Moderation'), 'Moderation'[Error_Type] = "False_Positive"), CALCULATE(COUNTROWS('Moderation'), 'Moderation'[QA_Audited] = 1), 0)
  False Negative Rate % = DIVIDE(CALCULATE(COUNTROWS('Moderation'), 'Moderation'[Error_Type] = "False_Negative"), CALCULATE(COUNTROWS('Moderation'), 'Moderation'[QA_Audited] = 1), 0)
  Overturn Rate % = DIVIDE(CALCULATE(COUNTROWS('Moderation'), 'Moderation'[Overturned_Flag] = 1), CALCULATE(COUNTROWS('Moderation'), 'Moderation'[Appealed_Flag] = 1), 0)
  ```

---

## 7. Testing & Verification Suite

The repository will include automated Node.js test scripts:
1. `check-data-schema.js`: Verifies canonical 18 columns, valid non-null ranges, and data types.
2. `check-math-stats.js`: Verifies weighted AHT, SLA attainment rates, and capacity formulas against pre-computed test fixtures.
3. `check-powerbi-tmdl.js`: Verifies TMDL syntax, table definitions, and zip archive structure.
4. `check-ui-structure.js`: Verifies HTML structure, tab IDs, ARIA screen-reader labels, and canvas elements.

---

## 8. Directory Layout

```
D:\Projects\content-moderation-dashboard-portfolio\
├── .git/
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-10-06-content-moderation-dashboard-design.md
├── vendor/
│   ├── chart.umd.min.js
│   ├── papaparse.min.js
│   └── jszip.min.js
├── check-data-schema.js
├── check-math-stats.js
├── check-powerbi-tmdl.js
├── check-ui-structure.js
├── content-moderation-ba-guide.md
├── generate_mock_data.py
├── dashboard-ready.csv
├── index.html
├── app.css
├── brand.css
├── stats.js
├── charts.js
├── capacity.js
├── powerbi.js
├── PROJECT_META.md
└── README.md
```
