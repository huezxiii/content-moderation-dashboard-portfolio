const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const brandCssPath = path.join(__dirname, 'brand.css');
const appCssPath = path.join(__dirname, 'app.css');

if (!fs.existsSync(htmlPath)) {
  console.error('FAIL: index.html does not exist');
  process.exit(1);
}
if (!fs.existsSync(brandCssPath)) {
  console.error('FAIL: brand.css does not exist');
  process.exit(1);
}
if (!fs.existsSync(appCssPath)) {
  console.error('FAIL: app.css does not exist');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const brandCss = fs.readFileSync(brandCssPath, 'utf8');
const appCss = fs.readFileSync(appCssPath, 'utf8');

// 1. Check Color Tokens in brand.css
const requiredColors = ['#492C73', '#66548C', '#6FD904', '#74BF04', '#F2F2F2'];
for (const color of requiredColors) {
  if (!brandCss.toUpperCase().includes(color.toUpperCase())) {
    console.error(`FAIL: brand.css missing required Telus color token: ${color}`);
    process.exit(1);
  }
}

// 2. Check Tab Navigation IDs
const requiredTabs = ['tab-exec', 'tab-queue', 'tab-quality', 'tab-capacity'];
for (const tabId of requiredTabs) {
  if (!html.includes(`id="${tabId}"`)) {
    console.error(`FAIL: index.html missing tab button: ${tabId}`);
    process.exit(1);
  }
}

// 3. Check Tab Panels & ARIA roles
const requiredPanels = ['panel-exec', 'panel-queue', 'panel-quality', 'panel-capacity'];
for (const panelId of requiredPanels) {
  if (!html.includes(`id="${panelId}"`)) {
    console.error(`FAIL: index.html missing tab panel: ${panelId}`);
    process.exit(1);
  }
}

if (!html.includes('role="tablist"') || !html.includes('role="tab"') || !html.includes('role="tabpanel"')) {
  console.error('FAIL: index.html missing essential WCAG ARIA roles (tablist, tab, tabpanel)');
  process.exit(1);
}

// 4. Check Global Filters
const requiredFilters = ['filter-start-date', 'filter-end-date', 'filter-queue', 'filter-type', 'filter-search'];
for (const filterId of requiredFilters) {
  if (!html.includes(`id="${filterId}"`)) {
    console.error(`FAIL: index.html missing global filter: ${filterId}`);
    process.exit(1);
  }
}

// 5. Check Chart Canvas IDs
const requiredCanvases = [
  'chart-daily-volume',
  'chart-hitl-funnel',
  'chart-queue-sla',
  'chart-policy-breakdown',
  'chart-media-aht',
  'chart-diurnal-heatmap',
  'chart-action-dist',
  'chart-error-pareto',
  'chart-agent-quadrant',
  'chart-appeals-trend'
];

for (const canvasId of requiredCanvases) {
  if (!html.includes(`id="${canvasId}"`)) {
    console.error(`FAIL: index.html missing chart canvas: ${canvasId}`);
    process.exit(1);
  }
}

// 6. Check Capacity Planner Interactive Controls
const requiredControls = [
  'cap-volume-input',
  'cap-aht-input',
  'cap-shift-select',
  'cap-occupancy-slider',
  'cap-shrinkage-slider'
];

for (const controlId of requiredControls) {
  if (!html.includes(`id="${controlId}"`)) {
    console.error(`FAIL: index.html missing capacity control: ${controlId}`);
    process.exit(1);
  }
}

// 7. Check Power BI Export Button
if (!html.includes('id="btn-export-pbip"') && !html.includes('btn-export-powerbi')) {
  console.error('FAIL: index.html missing Power BI export button');
  process.exit(1);
}

console.log('PASS: check-ui-structure.js validated HTML semantics, Telus design tokens, ARIA attributes, and interactive controls.');
