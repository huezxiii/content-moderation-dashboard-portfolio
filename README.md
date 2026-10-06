# ApexTrust Operations - Content Moderation & Trust & Safety Intelligence Command

An enterprise-grade, offline-first analytics dashboard and operational intelligence command center for Content Moderation and Trust & Safety operations.

Modeled after modern Business Process Outsourcing (BPO) operational analytics principles detailed in `content-moderation-ba-guide.md`, this platform provides full visibility across incoming workload volumes, Human-in-the-Loop (HITL) triage funnels, contractual SLA attainment, QA accuracy taxonomies, and interactive Erlang-C workforce capacity planning.

---

## Key Features

1. **Executive Operations Hub (Tab 1)**:
   - High-impact KPI banner cards tracking total reviews, weighted fleet AHT, SLA attainment %, egregious incident exposure, and audited QA pass rates.
   - Dual-axis time-series correlating daily volume influx against decision throughput and SLA attainment trends.
   - Human-in-the-Loop (HITL) automation breakdown (Auto-Approved, Auto-Rejected, Manual Queue, Tier-2 Escalated).
   - Queue SLA compliance leaderboard benchmarked against contractual 95.0% performance lines.
   - Dynamic executive natural language alert summarizing real-time operational bottlenecks.

2. **Queue & Policy Command (Tab 2)**:
   - Category distribution of policy breaches (Hate Speech, Violence, Fraud/Scams, Commercial Spam, Emergency TCO).
   - Media modality complexity analysis comparing AHT across Text, Image, Video, and Live Stream.
   - Diurnal 24-hour arrival curve and hourly congestion patterns for shift planning.
   - Stacked enforcement action distribution (Approve, Remove, Warning, Suspend, Escalate).

3. **Quality, Audits & Appeals Assurance (Tab 3)**:
   - QA accuracy scoring with False Positive (user harm) and False Negative (platform risk) tracking.
   - Pareto analysis of audit error classifications.
   - Agent Speed vs. Quality scatter matrix (QA Score % vs AHT) across tenure cohorts.
   - User appeals influx vs. overturned decision trajectories.
   - Filterable, paginated audited incident drill-down table with contextual snippets.

4. **Workforce & Capacity Planner (Tab 4)**:
   - Live interactive decision simulator based on Section 5 formulas from the BA Guide:
     $$\text{Workload Hours} = \frac{\text{Volume} \times \text{AHT}}{3600}$$
     $$\text{Productive Hours per Agent} = \text{Shift Hours} \times (1 - \text{Shrinkage}) \times \text{Occupancy}$$
     $$\text{Required FTEs} = \frac{\text{Workload Hours}}{\text{Productive Hours per Agent}}$$
   - Egregious queue shift safeguards (5.5h high-impact trauma caps) vs standard 8.0h shifts.
   - Erlang-C queue wait probability model and automated prescriptive recommendations.

5. **Programmatic Power BI Project Export (`.pbip`)**:
   - One-click client-side export generating complete Microsoft Power BI Project (`.pbip`) zip archives.
   - Emits valid TMDL semantic models with duration-weighted DAX measures and date dimension tables.

---

## Design System & Color Palette

Styled with generic white-labeled enterprise branding utilizing the Telus color palette:
* **Deep Aubergine (`#492C73`)**: Header bar, primary buttons, active tab indicators, chart primary series.
* **Slate Purple (`#66548C`)**: Card secondary accents, borders, subheadings.
* **Bright Lime (`#6FD904`)**: Focal KPI highlights, positive SLA attainment, target curves.
* **Olive Lime (`#74BF04`)**: Chart series accents, active hover states.
* **Canvas Light (`#F2F2F2`)**: Full-width dashboard canvas background.

---

## 18-Column Canonical Schema

| Column | Type | Description |
| :--- | :--- | :--- |
| `Review_ID` | String | Unique interaction identifier (`MOD-2026-XXXXX`) |
| `Timestamp` | Datetime | Ingestion timestamp (`YYYY-MM-DD HH:MM:SS`) |
| `Agent_ID` | String | Anonymized agent identifier (`AGENT_01` to `AGENT_15`) |
| `Tenure_Group` | String | Experience cohort: `New Hire (<30d)`, `Core (1-6mo)`, `Senior (6mo+)` |
| `Queue_Name` | String | `Violence_HighRisk`, `Hate_Speech`, `Fraud_Scams`, `Spam_Commercial`, `Emergency_TCO` |
| `Content_Type` | String | `Text_Post`, `Static_Image`, `Short_Video`, `Live_Stream` |
| `Egregious_Flag` | Integer | `1` if high-severity material requiring wellness safeguards; else `0` |
| `HITL_Routing` | String | `Auto_Approved`, `Auto_Rejected`, `Manual_Review`, `Tier2_Escalated` |
| `AHT_Seconds` | Float | Active handling time spent evaluating content |
| `TAT_Minutes` | Float | Turnaround time from flag to decision execution |
| `SLA_Breached` | Integer | `1` if decision exceeded queue SLA window; else `0` |
| `Decision_Action` | String | `Approve_Keep`, `Remove_Delete`, `Content_Warning`, `Account_Suspend`, `Escalate` |
| `QA_Audited` | Integer | `1` if audited by QA team; else `0` (~12% rate) |
| `QA_Score` | Float | Quality assurance audit score (`0.0` to `100.0`) |
| `Error_Type` | String | `None`, `False_Positive`, `False_Negative`, `Wrong_Selection` |
| `Appealed_Flag` | Integer | `1` if user disputed enforcement decision; else `0` |
| `Overturned_Flag` | Integer | `1` if appeal resulted in decision reversal; else `0` |
| `Content_Snippet` | String | Non-PII sanitized contextual summary of reviewed content |

---

## Verification & Quality Gates

Run all automated test suites via Node.js:

```bash
# 1. Validate CSV schema, data types, ranges, and record count
node check-data-schema.js

# 2. Validate statistical computations, weighted metrics, and Erlang-C capacity formulas
node check-math-stats.js

# 3. Validate HTML structure, Telus color tokens, and WCAG 2.1 AA ARIA accessibility
node check-ui-structure.js

# 4. Validate Power BI TMDL model syntax and PBIP ZIP archive bundling
node check-powerbi-tmdl.js
```

---

## Quickstart

1. Clone or open the project folder in your browser:
   - Double-click or serve `index.html` via any local HTTP server (e.g. `npx serve .` or `python -m http.server 8000`).
2. To regenerate the synthetic dataset:
   ```bash
   python generate_mock_data.py --count 2800 --out dashboard-ready.csv
   ```
3. To open the Power BI project:
   - Click **Export Power BI (.pbip)** in the header bar.
   - Unzip the generated archive and double-click `ApexTrust_Moderation.pbip` in Microsoft Power BI Desktop.
