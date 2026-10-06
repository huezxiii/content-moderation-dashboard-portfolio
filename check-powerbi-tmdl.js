const assert = require('assert');
const path = require('path');
const fs = require('fs');

// Mock JSZip in Node environment for headless test
const JSZip = require(path.join(__dirname, 'vendor', 'jszip.min.js'));

global.JSZip = JSZip;

const powerbiPath = path.join(__dirname, 'powerbi.js');
let PowerBIExport;

try {
  PowerBIExport = require(powerbiPath);
} catch (e) {
  console.error('FAIL: Could not require powerbi.js:', e.message);
  process.exit(1);
}

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
    Content_Snippet: 'Graphic footage'
  }
];

console.log('Testing PowerBIExport TMDL generation...');

const moderationTmdl = PowerBIExport.generateModerationTableTmdl(mockRecords);

assert(moderationTmdl.includes('table Moderation'), 'TMDL must declare table Moderation');
assert(moderationTmdl.includes('column Review_ID'), 'TMDL must declare column Review_ID');
assert(moderationTmdl.includes('column Timestamp'), 'TMDL must declare column Timestamp');
assert(moderationTmdl.includes('column AHT_Seconds'), 'TMDL must declare column AHT_Seconds');
assert(moderationTmdl.includes('measure \'Total Reviews\' ='), 'TMDL must define measure [Total Reviews]');
assert(moderationTmdl.includes('measure \'Weighted AHT\' ='), 'TMDL must define measure [Weighted AHT]');
assert(moderationTmdl.includes('measure \'SLA Attainment %\' ='), 'TMDL must define measure [SLA Attainment %]');
assert(moderationTmdl.includes('measure \'QA Accuracy Rate\' ='), 'TMDL must define measure [QA Accuracy Rate]');
assert(moderationTmdl.includes('measure \'False Positive Rate\' ='), 'TMDL must define measure [False Positive Rate]');
assert(moderationTmdl.includes('measure \'False Negative Rate\' ='), 'TMDL must define measure [False Negative Rate]');
assert(moderationTmdl.includes('measure \'Overturn Rate\' ='), 'TMDL must define measure [Overturn Rate]');

console.log('PASS: TMDL syntax and DAX measures validated.');

console.log('Testing PowerBIExport PBIP ZIP generation...');

PowerBIExport.generatePbipZip(mockRecords, JSZip).then(zip => {
  const fileNames = Object.keys(zip.files);

  const requiredEntries = [
    'ApexTrust_Moderation.pbip',
    'ApexTrust_Moderation.SemanticModel/definition.pbism',
    'ApexTrust_Moderation.SemanticModel/definition/model.tmdl',
    'ApexTrust_Moderation.SemanticModel/definition/tables/Moderation.tmdl',
    'ApexTrust_Moderation.SemanticModel/definition/tables/DateTable.tmdl',
    'ApexTrust_Moderation.Report/definition.pbir',
    'ApexTrust_Moderation.Report/report.json',
    'README.md'
  ];

  for (const entry of requiredEntries) {
    assert(fileNames.includes(entry), `ZIP package missing mandatory entry: ${entry}`);
  }

  console.log(`PASS: PBIP ZIP package validated (${fileNames.length} files bundled).`);
}).catch(err => {
  console.error('FAIL in ZIP generation:', err);
  process.exit(1);
});
