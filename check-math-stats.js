const assert = require('assert');
const path = require('path');

// Test fixtures simulating realistic operational entries
const mockRecords = [
  {
    Review_ID: 'MOD-001',
    Timestamp: '2026-09-10 10:00:00',
    Agent_ID: 'AGENT_01',
    Tenure_Group: 'New Hire (<30d)',
    Queue_Name: 'Violence_HighRisk',
    Content_Type: 'Short_Video',
    Egregious_Flag: 1,
    HITL_Routing: 'Manual_Review',
    AHT_Seconds: 120.0,
    TAT_Minutes: 45.0,
    SLA_Breached: 0,
    Decision_Action: 'Remove_Delete',
    QA_Audited: 1,
    QA_Score: 100.0,
    Error_Type: 'None',
    Appealed_Flag: 1,
    Overturned_Flag: 0,
    Content_Snippet: 'Graphic physical altercation footage'
  },
  {
    Review_ID: 'MOD-002',
    Timestamp: '2026-09-10 11:30:00',
    Agent_ID: 'AGENT_02',
    Tenure_Group: 'Core (1-6mo)',
    Queue_Name: 'Spam_Commercial',
    Content_Type: 'Text_Post',
    Egregious_Flag: 0,
    HITL_Routing: 'Auto_Rejected',
    AHT_Seconds: 30.0,
    TAT_Minutes: 5.0,
    SLA_Breached: 0,
    Decision_Action: 'Remove_Delete',
    QA_Audited: 1,
    QA_Score: 0.0,
    Error_Type: 'False_Positive',
    Appealed_Flag: 1,
    Overturned_Flag: 1,
    Content_Snippet: 'Promotional contest announcement'
  },
  {
    Review_ID: 'MOD-003',
    Timestamp: '2026-09-11 14:00:00',
    Agent_ID: 'AGENT_03',
    Tenure_Group: 'Senior (6mo+)',
    Queue_Name: 'Emergency_TCO',
    Content_Type: 'Short_Video',
    Egregious_Flag: 1,
    HITL_Routing: 'Tier2_Escalated',
    AHT_Seconds: 240.0,
    TAT_Minutes: 75.0,
    SLA_Breached: 1,
    Decision_Action: 'Escalate',
    QA_Audited: 0,
    QA_Score: 0.0,
    Error_Type: 'None',
    Appealed_Flag: 0,
    Overturned_Flag: 0,
    Content_Snippet: 'Suspected extremist propaganda video'
  },
  {
    Review_ID: 'MOD-004',
    Timestamp: '2026-09-11 15:30:00',
    Agent_ID: 'AGENT_01',
    Tenure_Group: 'New Hire (<30d)',
    Queue_Name: 'Hate_Speech',
    Content_Type: 'Text_Post',
    Egregious_Flag: 0,
    HITL_Routing: 'Manual_Review',
    AHT_Seconds: 50.0,
    TAT_Minutes: 25.0,
    SLA_Breached: 0,
    Decision_Action: 'Approve_Keep',
    QA_Audited: 1,
    QA_Score: 0.0,
    Error_Type: 'False_Negative',
    Appealed_Flag: 0,
    Overturned_Flag: 0,
    Content_Snippet: 'Subtle discriminatory slur in comment'
  }
];

// Load modules
const statsPath = path.join(__dirname, 'stats.js');
const capacityPath = path.join(__dirname, 'capacity.js');

let ModerationStats;
let CapacityPlanner;

try {
  ModerationStats = require(statsPath);
} catch (e) {
  console.error('FAIL: Could not require stats.js:', e.message);
  process.exit(1);
}

try {
  CapacityPlanner = require(capacityPath);
} catch (e) {
  console.error('FAIL: Could not require capacity.js:', e.message);
  process.exit(1);
}

console.log('Testing ModerationStats KPI calculations...');
const kpis = ModerationStats.computeKpis(mockRecords);

assert.strictEqual(kpis.totalVolume, 4, 'totalVolume should be 4');
// Weighted AHT: (120 + 30 + 240 + 50) / 4 = 440 / 4 = 110.0
assert.strictEqual(Math.round(kpis.weightedAht * 10) / 10, 110.0, 'Weighted AHT should be 110.0');
// SLA Attainment: 3 non-breached out of 4 = 75.0%
assert.strictEqual(kpis.slaAttainment, 75.0, 'SLA attainment should be 75.0%');
// Egregious Count: 2
assert.strictEqual(kpis.egregiousCount, 2, 'Egregious count should be 2');
// QA Audited: 3 audited
assert.strictEqual(kpis.qaAuditedCount, 3, 'QA audited count should be 3');
// QA Score Average: (100 + 0 + 0) / 3 = 33.3%
assert.strictEqual(Math.round(kpis.qaScoreAvg * 10) / 10, 33.3, 'QA Score avg should be 33.3%');
// False Positive Rate: 1 / 3 = 33.3%
assert.strictEqual(Math.round(kpis.falsePositiveRate * 10) / 10, 33.3, 'FP rate should be 33.3%');
// False Negative Rate: 1 / 3 = 33.3%
assert.strictEqual(Math.round(kpis.falseNegativeRate * 10) / 10, 33.3, 'FN rate should be 33.3%');
// Overturn Rate: 1 overturned out of 2 appeals = 50.0%
assert.strictEqual(kpis.overturnRate, 50.0, 'Overturn rate should be 50.0%');
// Action Rate: 3 enforcements (Remove, Remove, Escalate) out of 4 = 75.0%
assert.strictEqual(kpis.actionRate, 75.0, 'Action rate should be 75.0%');

console.log('PASS: ModerationStats KPI tests passed.');

console.log('Testing ModerationStats filtering...');
const filteredQueue = ModerationStats.filterRecords(mockRecords, { queue: 'Violence_HighRisk' });
assert.strictEqual(filteredQueue.length, 1);
assert.strictEqual(filteredQueue[0].Review_ID, 'MOD-001');

const filteredDate = ModerationStats.filterRecords(mockRecords, {
  startDate: '2026-09-11',
  endDate: '2026-09-11'
});
assert.strictEqual(filteredDate.length, 2);

const filteredSearch = ModerationStats.filterRecords(mockRecords, { search: 'propaganda' });
assert.strictEqual(filteredSearch.length, 1);
assert.strictEqual(filteredSearch[0].Review_ID, 'MOD-003');

console.log('PASS: ModerationStats filtering tests passed.');

console.log('Testing CapacityPlanner core formulas from BA Guide (Q4)...');
// Given: Volume = 10,000, AHT = 180s, Shift = 8h, Occupancy = 0.80, Shrinkage = 0.25
const workloadHours = CapacityPlanner.calcWorkloadHours(10000, 180);
assert.strictEqual(workloadHours, 500, 'Workload hours should be 500.0');

const productiveHours = CapacityPlanner.calcProductiveHours(8, 0.25, 0.80);
assert.strictEqual(Math.round(productiveHours * 100) / 100, 4.80, 'Productive hours should be 4.80');

const requiredFte = CapacityPlanner.calcRequiredFte(workloadHours, productiveHours);
assert.strictEqual(Math.ceil(requiredFte), 105, 'Required FTE should round to 105');

// Test Egregious 5.5 hour shift constraint with 30% shrinkage & 80% occupancy
const egregiousProductive = CapacityPlanner.calcProductiveHours(5.5, 0.30, 0.80);
// 5.5 * 0.70 * 0.80 = 3.08
assert.strictEqual(Math.round(egregiousProductive * 100) / 100, 3.08, 'Egregious productive hours should be 3.08');

console.log('Testing CapacityPlanner Erlang-C engine...');
// Erlang C check: A = 10 erlangs, c = 12 servers
const pw = CapacityPlanner.calcErlangC(10, 12);
assert(pw > 0 && pw < 1.0, 'Erlang C probability should be between 0 and 1');

console.log('PASS: All statistical and capacity tests passed successfully.');
