# ApexTrust Operations — Content Moderation & Trust & Safety Intelligence
## Executive Briefing Presentation Outline: Queue Analytics, SLA Recovery & Workforce Capacity Optimization

* **Presenter:** Operations Business Analyst
* **Deck File:** [`ApexTrust_Content_Moderation_Executive_Briefing.pptx`](ApexTrust_Content_Moderation_Executive_Briefing.pptx) (5 slides + 1 Q&A backup slide, speaker notes contain the full script)
* **Reference Companion:** [ApexTrust Operations Web Dashboard](file:///D:/Projects/content-moderation-dashboard-portfolio/index.html) (`dashboard-ready.csv`)
* **Dataset Scope:** 2,800 operational moderation reviews across 15 agents, 5 queues, and 4 media modalities (September 6 – October 5, 2026)
* **Framework:** Executive Briefing (*Bottom Line Up Front* → *What?* → *So What?* → *Now What?*)
* **Target Duration:** 10 Minutes (8:00 Presentation + 2:00 Synthesis & Leadership Q&A)
* **Design & Theme:** Telus Color Palette (Deep Aubergine `#492C73`, Slate Purple `#66548C`, Bright Lime `#6FD904`, Olive Lime `#74BF04`, Canvas `#F2F2F2`)

> **Data provenance:** Every figure in this outline and the deck is computed from `dashboard-ready.csv`. AHT is duration-weighted (total handling seconds ÷ reviews); SLA is transaction-level (non-breached ÷ total). The surge window is the calendar dates **Sep 24–27, 2026**. Recovery figures on Slide 5 are **targets**, not model forecasts.

---

## Executive Timing & Architecture Overview

| Slide | Section / Objective | Framework | Target Timestamp | Target Pace | Key Data Anchors |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | **Executive Briefing & The Bottom Line** | **BLUF** | `0:00 – 1:30` *(90s)* | Confident, direct | 2,800 reviews, 78.2% SLA attainment, 52.5s AHT, 98.6% avg. audited QA score |
| **2** | **Baseline Operations: Queue & Modality Breakdown** | **WHAT?** | `1:30 – 3:30` *(120s)* | Methodical, grounded | Spam & Fraud @ 96.7% SLA vs. Violence/Hate/TCO @ 61.1% SLA (93% of breaches); 47.8% HITL auto-triage |
| **3** | **Root Cause: Where the SLA Drag & Backlog Originate** | **SO WHAT?** | `3:30 – 6:00` *(150s)* | Analytical core | Video & live = 28% of volume, 69% of handling hours; Sep 24–27 mix shift (high-risk 24% → 43%) at flat volume, SLA 41.1%; 719 egregious items |
| **4** | **Workforce Dynamics & Speed vs. Quality Matrix** | **SO WHAT?** | `6:00 – 8:00` *(120s)* | Objective, diagnostic | Senior 99.8% QA / 84s manual AHT vs. New Hire 94.5% / 125s; surge mix needs 19 FTEs vs. 15 rostered (−4) |
| **5** | **Action Plan: Rebalancing & Capacity Optimization** | **NOW WHAT?** | `8:00 – 10:00` *(120s)* | Decisive, ROI-focused | 3 targeted interventions, 0 new hires, SLA target 78.2% → ≥95%, TCO 1-hour SLA target 56.7% → ≥95% |
| **6** | **Appendix: Anticipated Leadership Q&A** *(backup)* | **Q&A** | `Q&A window` *(as needed)* | Calm, evidence-led | 75% Spam automation, 22% of hours in Spam & Fraud, 15.8% appeal overturn rate |

---

## Slide-by-Slide Detailed Presentation Outline

### Slide 1: Executive Briefing — The Bottom Line Up Front (BLUF)

#### Slide Architecture & Visual Layout
* **Visual Palette:** Deep aubergine canvas (`#492C73`) with high-contrast bright lime green (`#6FD904`) and crisp white typography.
* **Left Section:** Briefing title ("Trust & Safety Operations: SLA Recovery Briefing"), presenter name and title, and a white "The Bottom Line" callout card.
* **Right Section:** 4 strategic KPI cards:
  * **2,800** Reviews Handled (47.8% resolved by automated HITL filters)
  * **78.2%** SLA Attainment (vs. 95.0% contractual target) — shown in amber
  * **52.5s** Fleet Weighted Average Handling Time (AHT)
  * **98.6%** Average Audited QA Score (1.18% False Positives, 0.59% False Negatives across 340 audits)

#### Core Talking Points
1. **The Headline:** Decision quality is strong (98.6% average audited QA score; 333 of 340 audits error-free), but SLA attainment is 78.2% against a 95.0% contractual target.
2. **The Discovery:** The deficit is not systemic. Commercial Spam and Fraud & Scams together run at **96.7% SLA**.
3. **The Concentration:** 565 of 610 SLA breaches (**93%**) sit in `Violence_HighRisk`, `Hate_Speech` and `Emergency_TCO`. A further 209 breaches (34% of all breaches) landed in just 4 days, **Sep 24–27**, when the intake mix shifted toward high-risk content and SLA fell to **41.1%**.
4. **The Executive Takeaway:** Volume did not grow, so this is a routing and capacity-allocation problem, not a headcount problem. The target is **≥95% SLA within 14 operational days** with no new hires.

#### Spoken Script (`0:00 – 1:30`)
> *"Good morning, leadership team. My name is Wesley Taguinod, and today I am presenting the operational performance briefing and SLA recovery strategy for our Content Moderation and Trust & Safety operations.*
>
> `[Pause 1s — glance at audience]`
>
> *"Across 2,800 reviews over the past 30 days, our account operates at:*
> * *A **98.6%** average audited QA score,*
> * *A weighted average handling time of **52.5 seconds**, and*
> * *An overall SLA attainment of **78.2%** — trailing our contractual 95.0% commitment.*
>
> `[Gesture toward right KPI cards]`
>
> *"Here is the bottom line up front: **our challenge is not a quality failure, and it is not widespread.** Of 340 audited decisions, 333 were error-free. Our false negative rate — harmful content mistakenly left live — is just 0.59%.*
>
> *"Our high-volume deterministic queues, Commercial Spam and Fraud, are running above target at **96.7% SLA**.*
>
> *"The breach is concentrated in two places:*
> 1. *Our contextual and high-risk queues — **Violence, Hate Speech and Emergency TCO** — hold 93% of all SLA breaches.*
> 2. *A 4-day window, **September 24 to 27**, when the intake mix shifted sharply toward high-risk video and SLA fell to 41%.*
>
> *"Daily volume did not rise during that window. That tells us this is an allocation problem, not a headcount problem. By shifting existing capacity toward the high-risk queues when the mix changes, tightening how we route video, and calibrating our newest agents, we are targeting **95% SLA or better within 14 operational days**. Let me show you what the data reveals."*

`[Transition Cue: Advance to Slide 2]`

---

### Slide 2: WHAT? — Baseline Operations: Queue & Modality Breakdown

#### Slide Architecture & Visual Layout
* **Top Stat Row:** High-level operational throughput (2,800 reviews, 15 active agents, 5 queues, 4 media modalities).
* **Left Chart:** Queue SLA Attainment vs. Contractual Benchmark (horizontal bar chart with a dashed 95.0% target line; queues at or above target in olive lime, below target in coral):
  * Fraud & Scams **96.9%** · Commercial Spam **96.4%** · Hate Speech **65.4%** · Violence (High Risk) **57.6%** · Emergency TCO **56.7%**
  * Footnote: Spam & Fraud = 1,346 reviews at 12–36s AHT; contextual queues = 1,454 reviews at 44–110s AHT.
* **Right Visual:** Human-in-the-Loop (HITL) Funnel Breakdown:
  * Auto-Approved: **22.8%** (Low-risk compliant content)
  * Auto-Rejected: **25.0%** (High-confidence known violations)
  * Manual Review: **43.9%** (Human frontline verification)
  * Tier-2 Escalated: **8.3%** (Complex legal & policy edge cases)
  * Callout: **47.8%** resolved with no human touch.

#### Core Talking Points
1. **Mathematical Rigor:** AHT is duration-weighted across total handling seconds, and SLA is calculated at the transaction level (610 breached of 2,800), not by averaging queue percentages.
2. **The Queue Divide:**
   - *Deterministic Queues (Spam & Fraud):* 1,346 reviews (48.1% of volume) at 12–36s AHT and **96.7% SLA**.
   - *Contextual & Egregious Queues (Violence, Hate Speech, TCO):* 1,454 reviews at 44–110s AHT and **61.1% SLA**, holding 565 of 610 breaches (93%).
3. **HITL Efficiency:** Automation resolves 47.8% of volume, but unevenly: Spam is **75%** automated, Violence **33%** and Emergency TCO only **24%**.

#### Spoken Script (`1:30 – 3:30`)
> *"To understand where the variance comes from, we broke our 2,800 reviews down across 5 queues and 4 content modalities.*
>
> `[Point to Left Chart: Queue SLA Attainment]`
>
> *"The queue-level data shows a sharp split:*
> * *Commercial Spam and Fraud & Scams are model operations. They handle nearly half our volume — 1,346 reviews — at **96.4% and 96.9% SLA**, with handling times under 37 seconds.*
> * *Our contextual and high-risk queues pull the account down: **Hate Speech at 65.4%**, **Violence at 57.6%** and **Emergency TCO at 56.7%**. Together these three queues hold 93% of every SLA breach we recorded.*
>
> `[Point to Right Visual: HITL Funnel]`
>
> *"Now look at how work reaches agents. Our Human-in-the-Loop automation resolves 47.8% of volume without a human touch — about 23% auto-approved and 25% auto-rejected by hash matching and high-confidence classifiers.*
>
> *"That leaves 44% for frontline manual review and 8% for Tier-2 escalation.*
>
> *"The catch is that automation is uneven: three-quarters of Spam is automated, but only a third of Violence and a quarter of Emergency TCO. The human queues carry the hardest content. To see why they breach, we need to look at media type and what happened over time."*

`[Transition Cue: Advance to Slide 3]`

---

### Slide 3: SO WHAT? — Root Cause: Where the SLA Drag & Backlog Originate

#### Slide Architecture & Visual Layout
* **Two Diagnostic Deep-Dive Cards:**
  * **Card 1 (Left — Media Multiplier):** Column chart of Average Handling Time by Content Type:
    * Text Post: **15.8s** AHT (lowest complexity)
    * Static Image: **31.9s** AHT
    * Short Video: **107.7s** AHT (6.8× text)
    * Live Stream: **189.6s** AHT (12× text)
    * *Callout:* Video formats are **28%** of volume but consume **69%** of handling hours.
  * **Card 2 (Right — Daily SLA vs. 95% Target):** 30-day line chart of daily SLA attainment with a dashed 95% target line and the **Sep 24–27** window shaded:
    * Sep 6–23: 95 reviews/day, 84.4% SLA.
    * Sep 24–27: 89 reviews/day (volume flat), daily SLA 38–45%, **41.1%** for the window.
    * Sep 28–Oct 5: 92 reviews/day, recovery to 81.6%.
    * Three fact chips: **Volume 95 → 89/day**, **High-risk mix 24% → 43%**, **Avg. TAT 134 → 241 min**.
* **Bottom Safeguard Banner:** **719 egregious items (26% of volume)** sit entirely in Violence (418), Emergency TCO (164) and Hate Speech (137), triggering 5.5-hour shift caps and 30-minute wellness rotations.

#### Core Talking Points
1. **The Media Multiplier:** AHT is driven by media type, not agent effort. A short video takes 6.8× longer than a text post; a live stream 12×. Video and live are 28% of volume but 69% of handling hours.
2. **The Mix Shock (not a volume spike):** During Sep 24–27, daily volume did not rise. Violence + Emergency TCO rose from 24% to 43% of intake, weighted AHT rose 31% (49.7s → 65.3s), average turnaround nearly doubled (134 → 241 min) and SLA fell to 41.1%. Those 4 days produced 209 of 610 breaches.
3. **Workforce Protection Constraint:** All 719 egregious items sit in the high-risk queues. Exposure caps (5.5-hour shifts) mean the gap cannot be closed by lengthening shifts.

#### Spoken Script (`3:30 – 6:00`)
> *"This brings us to the core diagnostic question: **why did SLA fall to 78%, and where did the backlog come from?***
>
> *"The data points to two root causes.*
>
> `[Focus on Left Card: Media Modality]`
>
> *"First, media type. Reviewing a text post takes an agent about **16 seconds**. A static image takes **32 seconds**. Short-form video jumps to **108 seconds**, and live streams average over **three minutes**.*
>
> *"Here is the critical insight: **video and live streams are only 28% of our volume, but they consume 69% of all handling hours.** Any day the intake tilts toward video, our capacity is stretched.*
>
> `[Focus on Right Card: Daily SLA]`
>
> *"Second, look at the daily trend on the right. Most days ran between 75 and 94%. Then, from **September 24 to 27**, SLA collapsed to roughly 40% a day.*
>
> `[Point to the shaded window and the three facts below]`
>
> *"Importantly, **volume did not spike** — we averaged 89 items a day during the window versus 95 before it. What changed was the mix: Violence and Emergency TCO rose from **24% to 43%** of our intake. Handling time per item rose 31%, and average turnaround nearly doubled, from **134 to 241 minutes**. Emergency TCO, which carries a strict **1-hour legal removal SLA**, averaged 78 minutes to decision and met its SLA only 29% of the time in those 4 days.*
>
> *"Furthermore, every one of our **719 egregious items** sits in these high-risk queues, and our duty-of-care rules properly cap that exposure at **5.5-hour shifts** with wellness rotations.*
>
> *"The conclusion: our agents did not slow down. **We had a structural mismatch between a video-heavy, high-risk intake mix and a fixed allocation of capacity.**"*

`[Transition Cue: Advance to Slide 4]`

---

### Slide 4: SO WHAT? — Workforce Dynamics & Speed vs. Quality Matrix

#### Slide Architecture & Visual Layout
* **Left Visual:** Speed vs. Quality scatter plot of all **15 agents** (AHT on X-axis, audited QA score on Y-axis), coloured by tenure:
  * *Senior (`AGENT_12`–`AGENT_15`, green):* **99.8%** QA, 54.0s AHT overall, **84s on manual reviews**.
  * *Core (`AGENT_04`–`AGENT_11`, aubergine):* **99.2%** QA, 48.0s AHT overall, 97s on manual reviews.
  * *New Hire (`AGENT_01`–`AGENT_03`, amber):* **94.5%** QA, 62.7s AHT overall, **125s on manual reviews**.
  * Footnote: New hires made 4 of 7 audit errors (6.8% error rate vs. 1.1% tenured); 3 of the 4 were false positives.
* **Right Visual:** Capacity Gap under the Surge Mix:
  * Standard 8.0h shift productive hours: **4.80 h/day** (25% shrinkage, 80% occupancy).
  * Egregious 5.5h shift productive hours: **3.08 h/day** (30% shrinkage, 80% occupancy).
  * Handling time per item: **49.7s → 65.3s**; egregious share of handling hours **47% → 53%**.
  * Sep 24–27 at the same daily volume: Required **19 FTEs** vs. Active Roster **15 FTEs** → **−4 FTE deficit**.
  * Model assumption: 15 FTEs sized to the pre-surge mix.

#### Core Talking Points
1. **Tenure & Speed:** On manual reviews, seniors average 84.2s vs. 96.8s for core and 125.2s for new hires (33% faster than new hires). Seniors' overall AHT (54.0s) is higher than core (48.0s) only because they carry more egregious work (30% of their items vs. 23%). On short video, core agents are fastest (102s) and new hires slowest (123s, 20% slower); on live streams new hires are 41% slower than core.
2. **Error Taxonomy Isolation:** 7 errors in 340 audits (4 false positives, 2 false negatives, 1 wrong policy). New hires made 4 of the 7, and 3 of those 4 were false positives on static images — over-enforcement, not missed harm.
3. **Capacity Math (BA Guide Section 5):** Productive hours = shift × (1 − shrinkage) × occupancy. Applying this to each phase's handling hours, split by egregious vs. standard work: if 15 FTEs covered the pre-surge mix, the Sep 24–27 mix needed 18.9 → **19 FTEs** at the same daily volume, a **4-FTE gap**. Workload above available servers means Erlang-C queue delay is effectively certain, which matches turnaround nearly doubling.

#### Spoken Script (`6:00 – 8:00`)
> *"To turn this diagnosis into a staffing model, we looked at agent performance and applied the capacity formulas from our operations guide.*
>
> `[Point to Left Scatter: Speed vs Quality]`
>
> *"On the left, each dot is one of our 15 agents, plotted by handling time and audited QA score.*
>
> *"The tenure pattern is clear:*
> * *Our senior agents in green — Agents 12 through 15 — average **99.8% QA**. Their overall handle time looks higher than core because they take on more of the egregious work, but on manual reviews they are our fastest, at **84 seconds**.*
> * *Our core agents in purple deliver **99.2% QA** at 48 seconds, and they are our fastest on short video.*
> * *Our three new hires in amber — Agents 01, 02 and 03 — average **94.5% QA** and take **125 seconds** on manual reviews.*
>
> *"When we look at the errors themselves, new hires account for 4 of the 7 audit errors we found, and 3 of those were false positives — over-enforcement on images, not missed harm.*
>
> `[Focus on Right Card: Capacity Gap]`
>
> *"Now the workforce math on the right.*
>
> *"On a standard 8-hour shift, with 25% shrinkage and 80% occupancy, each agent delivers **4.8 productive hours**. On egregious queues, the 5.5-hour cap and 30% shrinkage leave just **3.08 productive hours**.*
>
> *"During the September 24 to 27 window, the mix shift raised handling time per item from 50 to 65 seconds, and pushed the egregious share of our workload from 47% to 53%. If our 15 agents were sized for the normal mix, that window needed **19** — a **4-agent shortfall**, at the same daily volume.*
>
> *"That is the mechanical reason our SLA dipped. The good news: the gap is 4 FTEs for a few days, which is a routing problem we can solve without hiring."*

`[Transition Cue: Advance to Slide 5]`

---

### Slide 5: NOW WHAT? — Strategic Action Plan & Executive Takeaway

#### Slide Architecture & Visual Layout
* **Three Structured Action Cards (Telus Color Coded):**
  * **Action 1 (Aubergine `#492C73`): Mix-Triggered Cross-Queue Flex Staffing.**
    * When Violence + TCO exceed 35% of daily intake, flex 4 FTEs from Spam & Fraud.
    * Spam & Fraud use 22% of handling hours and Spam is already 75% automated.
  * **Action 2 (Bright Lime `#6FD904`): Smarter Video Routing & Triage Pilot.**
    * Route video & live to Core and Senior agents; new hires are 20–41% slower on them.
    * Pilot wider auto-triage in Violence (33% automated) and TCO (24%) with QA sign-off.
  * **Action 3 (Olive Lime `#74BF04`): New-Hire Calibration & Wellness Scheduling.**
    * Daily 20-minute calibration with senior mentors on over-enforcement (false positives).
    * Automate rotation: 5.5h caps and ≤2 consecutive hours in egregious queues.
* **Bottom Banner (Bright Lime): Recovery Targets:**
  * **0 New Hires** and zero external software spend.
  * Account-wide SLA target: **78.2% → ≥95%** within 14 days.
  * TCO 1-hour emergency SLA target: **56.7% → ≥95%**.

#### Core Talking Points
1. **Zero Budget Required:** Every action reallocates existing capacity, changes routing or adds coaching time; no hires and no new software.
2. **Evidence for Each Action:** (1) the surge mix needed 4 more FTEs while Spam & Fraud use only 22% of handling hours for 48% of volume; (2) new hires are 20% slower than core on short video and 41% slower on live, and Violence/TCO automation (33%/24%) trails Spam (75%); (3) new hires made 4 of 7 audit errors, 3 of them false positives.
3. **Targets, Not Forecasts:** ≥95% account SLA and ≥95% TCO 1-hour SLA are the contractual targets to hit within 14 days; track them weekly in the dashboard. Excluding the Sep 24–27 window, SLA was already **83.6%**, so most of the gap is the mix-shift response.
4. **Sustainable Workforce Health:** Exposure caps and rotations stay in place, so speed gains do not come at the cost of burnout or attrition.

#### Spoken Script (`8:00 – 10:00`)
> *"That brings us to the plan: **how do we fix this permanently without adding payroll?***
>
> *"We propose three targeted, data-backed interventions.*
>
> `[Point to Action 1: Aubergine Card]`
>
> *"**Action 1: mix-triggered cross-queue flex staffing.**"*
> * *Our model shows the high-risk mix needed 4 more FTEs. So when Violence and Emergency TCO exceed 35% of daily intake, we flex **4 agents' worth of capacity** out of Spam and Fraud into the high-risk queues.*
> * *Spam and Fraud can absorb this: they use only **22% of our handling hours** for nearly half our volume, and three-quarters of Spam is already automated.*
>
> `[Point to Action 2: Bright Lime Card]`
>
> *"**Action 2: smarter video routing and a triage pilot.**"*
> * *Video and live streams drive 69% of our handling hours. Our new hires are **20% slower** than core agents on short video and **41% slower** on live streams, so we route that content to core and senior agents.*
> * *We will also pilot wider automated triage in Violence and Emergency TCO, which are only 33% and 24% automated today versus 75% in Spam — with QA sign-off before any threshold change.*
>
> `[Point to Action 3: Olive Lime Card]`
>
> *"**Action 3: new-hire calibration and automated wellness rotation.**"*
> * *Daily **20-minute calibration huddles** pair our 3 new hires with senior mentors, who run at 99.8% QA. The focus is over-enforcement: 3 of the new hires' 4 audit errors were false positives.*
> * *We automate scheduling so no agent spends more than **2 consecutive hours** in egregious queues, within the 5.5-hour cap.*
>
> `[Highlight Bottom Banner: Recovery Targets]`
>
> *"The executive takeaway:*
> * *This plan needs **zero new hires** and **zero external software spend**.*
> * *Our target is to bring account SLA from **78.2% to 95% or better within 14 operational days**. Outside the 4-day surge window we were already at 83.6%, so most of the gap is in how we respond to mix shifts.*
> * *Most importantly, we target **95% or better on the Emergency TCO 1-hour legal SLA** — up from 56.7% today — protecting platform integrity and our regulatory position.*
>
> *"Thank you for your time. I will now open the floor to questions."*

---

## Anticipated Executive Q&A & Defensible Responses
*(Slide 6 — backup slide shown during the 2:00 synthesis & leadership Q&A)*

### Q1: *"If we flex capacity from Spam and Fraud into the high-risk queues, won't the Spam SLA collapse?"*
* **Defensible Response:** *"Unlikely. Commercial Spam runs at 12.3 seconds AHT and 96.4% SLA, and 75% of Spam items are resolved automatically. Spam and Fraud together account for 48% of our volume but only 22% of our handling hours. And the flex only triggers on days when Violence and TCO exceed 35% of intake. During the Sep 24–27 window Spam and Fraud also dipped (61% and 68%) because the whole floor was saturated, so relieving the high-risk queues helps every queue."*

### Q2: *"Why not simply mandate 8-hour shifts for all agents to clear the backlog?"*
* **Defensible Response:** *"Because the backlog sits exactly where the exposure is. All 719 egregious items are in Violence, Hate Speech and Emergency TCO, and our duty-of-care policy caps that exposure at 5.5-hour shifts. We already saw a warning sign: audited QA in the Violence queue dipped to 88.9% during the surge window, versus 100% before it (a small sample of 9 audits, but the direction matters). Rotation into non-egregious work protects accuracy without driving attrition."*

### Q3: *"Does widening automated triage increase false positives?"*
* **Defensible Response:** *"That is why it is a pilot with QA sign-off, not a blanket change. Today, automated decisions audit well: auto-approved items scored 100% across 75 audits, and auto-rejected items 97.3% across 81 audits. Disputed decisions also have a safety net: of 190 appeals this period, only 30 (15.8%) were overturned."*
