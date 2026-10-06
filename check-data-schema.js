const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'dashboard-ready.csv');

if (!fs.existsSync(csvPath)) {
  console.error('FAIL: dashboard-ready.csv does not exist');
  process.exit(1);
}

const content = fs.readFileSync(csvPath, 'utf8').trim();
const lines = content.split(/\r?\n/);

if (lines.length < 2501) {
  console.error(`FAIL: Expected at least 2500 data rows, got ${lines.length - 1}`);
  process.exit(1);
}

const expectedHeaders = [
  'Review_ID',
  'Timestamp',
  'Agent_ID',
  'Tenure_Group',
  'Queue_Name',
  'Content_Type',
  'Egregious_Flag',
  'HITL_Routing',
  'AHT_Seconds',
  'TAT_Minutes',
  'SLA_Breached',
  'Decision_Action',
  'QA_Audited',
  'QA_Score',
  'Error_Type',
  'Appealed_Flag',
  'Overturned_Flag',
  'Content_Snippet'
];

// Simple CSV line parser handling quotes
function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

const headers = parseCsvLine(lines[0]);
if (headers.length !== expectedHeaders.length) {
  console.error(`FAIL: Header length mismatch: expected ${expectedHeaders.length}, got ${headers.length}`);
  process.exit(1);
}

for (let i = 0; i < expectedHeaders.length; i++) {
  if (headers[i] !== expectedHeaders[i]) {
    console.error(`FAIL: Header mismatch at index ${i}: expected ${expectedHeaders[i]}, got ${headers[i]}`);
    process.exit(1);
  }
}

const validTenures = new Set(['New Hire (<30d)', 'Core (1-6mo)', 'Senior (6mo+)']);
const validQueues = new Set(['Violence_HighRisk', 'Hate_Speech', 'Fraud_Scams', 'Spam_Commercial', 'Emergency_TCO']);
const validTypes = new Set(['Text_Post', 'Static_Image', 'Short_Video', 'Live_Stream']);
const validRouting = new Set(['Auto_Approved', 'Auto_Rejected', 'Manual_Review', 'Tier2_Escalated']);
const validActions = new Set(['Approve_Keep', 'Remove_Delete', 'Content_Warning', 'Account_Suspend', 'Escalate']);
const validErrors = new Set(['None', 'False_Positive', 'False_Negative', 'Wrong_Selection']);

let checkedCount = 0;
for (let i = 1; i < lines.length; i++) {
  const row = parseCsvLine(lines[i]);
  if (row.length !== expectedHeaders.length) {
    console.error(`FAIL: Line ${i + 1} column count mismatch: expected ${expectedHeaders.length}, got ${row.length}`);
    process.exit(1);
  }

  const [
    reviewId, timestamp, agentId, tenure, queue, contentType,
    egregious, routing, aht, tat, slaBreached, action,
    qaAudited, qaScore, errorType, appealed, overturned, snippet
  ] = row;

  if (!reviewId.startsWith('MOD-')) {
    console.error(`FAIL: Invalid Review_ID format at line ${i + 1}: ${reviewId}`);
    process.exit(1);
  }

  if (isNaN(Date.parse(timestamp))) {
    console.error(`FAIL: Invalid Timestamp at line ${i + 1}: ${timestamp}`);
    process.exit(1);
  }

  if (!validTenures.has(tenure)) {
    console.error(`FAIL: Invalid Tenure_Group at line ${i + 1}: ${tenure}`);
    process.exit(1);
  }

  if (!validQueues.has(queue)) {
    console.error(`FAIL: Invalid Queue_Name at line ${i + 1}: ${queue}`);
    process.exit(1);
  }

  if (!validTypes.has(contentType)) {
    console.error(`FAIL: Invalid Content_Type at line ${i + 1}: ${contentType}`);
    process.exit(1);
  }

  if (!validRouting.has(routing)) {
    console.error(`FAIL: Invalid HITL_Routing at line ${i + 1}: ${routing}`);
    process.exit(1);
  }

  if (!validActions.has(action)) {
    console.error(`FAIL: Invalid Decision_Action at line ${i + 1}: ${action}`);
    process.exit(1);
  }

  if (!validErrors.has(errorType)) {
    console.error(`FAIL: Invalid Error_Type at line ${i + 1}: ${errorType}`);
    process.exit(1);
  }

  const numAht = parseFloat(aht);
  if (isNaN(numAht) || numAht <= 0) {
    console.error(`FAIL: Invalid AHT_Seconds at line ${i + 1}: ${aht}`);
    process.exit(1);
  }

  const numTat = parseFloat(tat);
  if (isNaN(numTat) || numTat <= 0) {
    console.error(`FAIL: Invalid TAT_Minutes at line ${i + 1}: ${tat}`);
    process.exit(1);
  }

  if (slaBreached !== '0' && slaBreached !== '1') {
    console.error(`FAIL: Invalid SLA_Breached flag at line ${i + 1}: ${slaBreached}`);
    process.exit(1);
  }

  if (qaAudited !== '0' && qaAudited !== '1') {
    console.error(`FAIL: Invalid QA_Audited flag at line ${i + 1}: ${qaAudited}`);
    process.exit(1);
  }

  if (qaAudited === '1') {
    const numQa = parseFloat(qaScore);
    if (isNaN(numQa) || numQa < 0 || numQa > 100) {
      console.error(`FAIL: Invalid QA_Score at line ${i + 1}: ${qaScore}`);
      process.exit(1);
    }
  }

  if (appealed !== '0' && appealed !== '1') {
    console.error(`FAIL: Invalid Appealed_Flag at line ${i + 1}: ${appealed}`);
    process.exit(1);
  }

  if (overturned !== '0' && overturned !== '1') {
    console.error(`FAIL: Invalid Overturned_Flag at line ${i + 1}: ${overturned}`);
    process.exit(1);
  }

  if (overturned === '1' && appealed === '0') {
    console.error(`FAIL: Inconsistent Overturned without Appeal at line ${i + 1}`);
    process.exit(1);
  }

  checkedCount++;
}

console.log(`PASS: check-data-schema.js validated ${checkedCount} records across 18 canonical columns.`);
