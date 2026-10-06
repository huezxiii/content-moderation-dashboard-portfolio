/**
 * ApexTrust Operations - Visualization & Reactive Chart Orchestration Engine
 * Integrates Chart.js with the Telus brand design system, manages reactive filtering,
 * renders multi-axis operational charts, agent scatter plots, and audit tables.
 */

(function () {
  'use strict';

  // State Management
  let allRecords = [];
  let filteredRecords = [];
  const chartInstances = {};

  // Palette configuration
  const PALETTE = {
    aubergine: '#492C73',
    slatePurple: '#66548C',
    brightLime: '#6FD904',
    oliveLime: '#74BF04',
    canvasBg: '#F2F2F2',
    cardBg: '#FFFFFF',
    textMain: '#1E1E24',
    textMuted: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#0284C7',
    chartSeries: [
      '#492C73',
      '#6FD904',
      '#66548C',
      '#74BF04',
      '#0284C7',
      '#F59E0B'
    ]
  };

  /**
   * Helper to safely destroy and re-create a chart instance.
   */
  function createOrUpdateChart(id, config) {
    if (chartInstances[id]) {
      chartInstances[id].destroy();
    }
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, config);
    chartInstances[id] = chart;
    return chart;
  }

  /**
   * Initialize Global Chart.js defaults
   */
  function setupChartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    Chart.defaults.font.size = 11;
    Chart.defaults.color = PALETTE.textMuted;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(73, 44, 115, 0.95)';
    Chart.defaults.plugins.tooltip.titleColor = '#FFFFFF';
    Chart.defaults.plugins.tooltip.bodyColor = '#F2F2F2';
    Chart.defaults.plugins.tooltip.cornerRadius = 6;
    Chart.defaults.plugins.tooltip.padding = 10;
  }

  /**
   * Updates top-level KPI cards and dynamic narrative insights
   */
  function updateKpis(records) {
    if (typeof ModerationStats === 'undefined') return;
    const kpis = ModerationStats.computeKpis(records);

    // Tab 1 KPI Cards
    const elVol = document.getElementById('kpi-total-volume');
    if (elVol) elVol.textContent = kpis.totalVolume.toLocaleString();

    const elAuto = document.getElementById('kpi-auto-rate');
    if (elAuto) elAuto.textContent = `${Math.round(kpis.autoTriageRate * 10) / 10}% Automated`;

    const elAht = document.getElementById('kpi-weighted-aht');
    if (elAht) elAht.textContent = `${Math.round(kpis.weightedAht * 10) / 10} s`;

    const elSla = document.getElementById('kpi-sla-rate');
    if (elSla) elSla.textContent = `${Math.round(kpis.slaAttainment * 10) / 10}%`;

    const elEgregious = document.getElementById('kpi-egregious-count');
    if (elEgregious) elEgregious.textContent = kpis.egregiousCount.toLocaleString();

    const elQa = document.getElementById('kpi-qa-score');
    if (elQa) elQa.textContent = `${Math.round(kpis.qaScoreAvg * 10) / 10}%`;

    // Tab 2 KPI Cards
    const elAction = document.getElementById('kpi-action-rate');
    if (elAction) elAction.textContent = `${Math.round(kpis.actionRate * 10) / 10}%`;

    const queueStats = ModerationStats.aggregateByQueue(records);
    const topQueue = queueStats.slice().sort((a, b) => b.total - a.total)[0];
    const elTopCat = document.getElementById('kpi-top-category');
    if (elTopCat) elTopCat.textContent = topQueue ? topQueue.queue.replace('_', ' ') : '--';

    const videoCount = records.filter(r => r.Content_Type === 'Short_Video' || r.Content_Type === 'Live_Stream').length;
    const elVideo = document.getElementById('kpi-video-share');
    if (elVideo) elVideo.textContent = `${records.length > 0 ? Math.round((videoCount / records.length) * 1000) / 10 : 0}%`;

    const tats = records.map(r => parseFloat(r.TAT_Minutes) || 0).sort((a, b) => a - b);
    const medianTat = tats.length > 0 ? tats[Math.floor(tats.length / 2)] : 0;
    const elTat = document.getElementById('kpi-median-tat');
    if (elTat) elTat.textContent = `${Math.round(medianTat * 10) / 10} m`;

    // Tab 3 KPI Cards
    const elQuality = document.getElementById('kpi-quality-score');
    if (elQuality) elQuality.textContent = `${Math.round(kpis.qaScoreAvg * 10) / 10}%`;

    const elFp = document.getElementById('kpi-fp-rate');
    if (elFp) elFp.textContent = `${Math.round(kpis.falsePositiveRate * 10) / 10}%`;

    const elFn = document.getElementById('kpi-fn-rate');
    if (elFn) elFn.textContent = `${Math.round(kpis.falseNegativeRate * 10) / 10}%`;

    const elOverturn = document.getElementById('kpi-overturn-rate');
    if (elOverturn) elOverturn.textContent = `${Math.round(kpis.overturnRate * 10) / 10}%`;

    const elAppeals = document.getElementById('kpi-appeals-count');
    if (elAppeals) elAppeals.textContent = `${kpis.appealsCount} appeals (${kpis.overturnsCount} overturned)`;

    // Record badge
    const elBadge = document.getElementById('record-count-badge');
    if (elBadge) elBadge.textContent = `Showing ${records.length.toLocaleString()} records`;

    // Dynamic Executive Narrative
    const elNarrative = document.getElementById('exec-narrative-text');
    if (elNarrative) {
      let narrative = `Fleet operations evaluated across ${records.length.toLocaleString()} reviews. Current SLA compliance sits at ${Math.round(kpis.slaAttainment * 10) / 10}%, `;
      if (kpis.slaAttainment >= 95.0) {
        narrative += `surpassing the contractual 95.0% threshold with steady queue turnaround. `;
      } else {
        narrative += `breaching the 95.0% contractual target, primarily driven by surge TAT in high-risk video queues. `;
      }
      narrative += `Audited accuracy is averaging ${Math.round(kpis.qaScoreAvg * 10) / 10}% with a False Negative rate of ${Math.round(kpis.falseNegativeRate * 10) / 10}%. `;
      narrative += `A total of ${kpis.egregiousCount.toLocaleString()} high-severity items were contained under mandatory exposure limits.`;
      elNarrative.textContent = narrative;
    }
  }

  /**
   * Render Tab 1 Visuals
   */
  function renderExecutiveCharts(records) {
    const dailyData = ModerationStats.aggregateDaily(records);

    // 1. Daily Volume vs SLA
    createOrUpdateChart('chart-daily-volume', {
      type: 'bar',
      data: {
        labels: dailyData.map(d => d.date.slice(5)),
        datasets: [
          {
            label: 'Total Volume',
            data: dailyData.map(d => d.total),
            backgroundColor: 'rgba(73, 44, 115, 0.75)',
            borderColor: PALETTE.aubergine,
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Manual Queue Decisions',
            data: dailyData.map(d => d.manual),
            backgroundColor: 'rgba(102, 84, 140, 0.45)',
            borderColor: PALETTE.slatePurple,
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'SLA Attainment (%)',
            data: dailyData.map(d => Math.round(d.slaRate * 10) / 10),
            type: 'line',
            borderColor: PALETTE.brightLime,
            backgroundColor: PALETTE.brightLime,
            borderWidth: 2,
            pointRadius: 3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { grid: { display: false } },
          y: {
            title: { display: true, text: 'Reviews Handled' },
            grid: { color: PALETTE.border }
          },
          y1: {
            position: 'right',
            title: { display: true, text: 'SLA Attainment %' },
            min: 70,
            max: 100,
            grid: { display: false }
          }
        }
      }
    });

    // 2. HITL Automation Funnel
    const routingCounts = { Auto_Approved: 0, Auto_Rejected: 0, Manual_Review: 0, Tier2_Escalated: 0 };
    records.forEach(r => { if (routingCounts[r.HITL_Routing] !== undefined) routingCounts[r.HITL_Routing]++; });

    createOrUpdateChart('chart-hitl-funnel', {
      type: 'doughnut',
      data: {
        labels: ['Auto-Approved', 'Auto-Rejected', 'Manual Review', 'Tier-2 Escalated'],
        datasets: [{
          data: [
            routingCounts.Auto_Approved,
            routingCounts.Auto_Rejected,
            routingCounts.Manual_Review,
            routingCounts.Tier2_Escalated
          ],
          backgroundColor: [
            PALETTE.brightLime,
            PALETTE.slatePurple,
            PALETTE.aubergine,
            PALETTE.warning
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    // 3. Queue SLA Leaderboard
    const queueStats = ModerationStats.aggregateByQueue(records).sort((a, b) => a.slaRate - b.slaRate);
    createOrUpdateChart('chart-queue-sla', {
      type: 'bar',
      data: {
        labels: queueStats.map(q => q.queue.replace('_', ' ')),
        datasets: [{
          label: 'SLA Attainment %',
          data: queueStats.map(q => q.slaRate),
          backgroundColor: queueStats.map(q => q.slaRate >= 95 ? PALETTE.brightLime : PALETTE.aubergine),
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 50,
            max: 100,
            title: { display: true, text: '% Adherence to SLA' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  /**
   * Render Tab 2 Visuals
   */
  function renderQueueCharts(records) {
    // 1. Policy Violation Category Breakdown
    const policyMap = {};
    records.forEach(r => {
      policyMap[r.Queue_Name] = (policyMap[r.Queue_Name] || 0) + 1;
    });
    const policyLabels = Object.keys(policyMap);
    const policyValues = Object.values(policyMap);

    createOrUpdateChart('chart-policy-breakdown', {
      type: 'pie',
      data: {
        labels: policyLabels.map(p => p.replace('_', ' ')),
        datasets: [{
          data: policyValues,
          backgroundColor: PALETTE.chartSeries,
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } }
      }
    });

    // 2. Media Modality vs AHT
    const typeMap = {};
    records.forEach(r => {
      if (!typeMap[r.Content_Type]) typeMap[r.Content_Type] = { total: 0, ahtSum: 0 };
      typeMap[r.Content_Type].total++;
      typeMap[r.Content_Type].ahtSum += parseFloat(r.AHT_Seconds) || 0;
    });

    const typeLabels = Object.keys(typeMap);
    const typeAhts = typeLabels.map(t => Math.round((typeMap[t].ahtSum / typeMap[t].total) * 10) / 10);

    createOrUpdateChart('chart-media-aht', {
      type: 'bar',
      data: {
        labels: typeLabels.map(t => t.replace('_', ' ')),
        datasets: [{
          label: 'Average Handling Time (Seconds)',
          data: typeAhts,
          backgroundColor: [PALETTE.aubergine, PALETTE.slatePurple, PALETTE.oliveLime, PALETTE.brightLime],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { title: { display: true, text: 'AHT (Seconds)' } }
        },
        plugins: { legend: { display: false } }
      }
    });

    // 3. Diurnal Arrival Curve
    const hourly = ModerationStats.aggregateHourly(records);
    createOrUpdateChart('chart-diurnal-heatmap', {
      type: 'line',
      data: {
        labels: hourly.map(h => `${h.hour}:00`),
        datasets: [
          {
            label: 'Total Hourly Volume',
            data: hourly.map(h => h.count),
            borderColor: PALETTE.aubergine,
            backgroundColor: 'rgba(73, 44, 115, 0.1)',
            fill: true,
            tension: 0.35
          },
          {
            label: 'SLA Breaches',
            data: hourly.map(h => h.breaches),
            borderColor: PALETTE.danger,
            backgroundColor: 'transparent',
            borderDash: [4, 4],
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { title: { display: true, text: 'Volume / Breaches' } }
        }
      }
    });

    // 4. Decision Actions by Queue
    const queues = ['Violence_HighRisk', 'Hate_Speech', 'Fraud_Scams', 'Spam_Commercial', 'Emergency_TCO'];
    const actions = ['Approve_Keep', 'Remove_Delete', 'Content_Warning', 'Account_Suspend', 'Escalate'];

    const actionData = actions.map(act => {
      return {
        label: act.replace('_', ' '),
        data: queues.map(q => {
          return records.filter(r => r.Queue_Name === q && r.Decision_Action === act).length;
        }),
        backgroundColor: act === 'Approve_Keep' ? PALETTE.brightLime :
                         act === 'Remove_Delete' ? PALETTE.aubergine :
                         act === 'Content_Warning' ? PALETTE.warning :
                         act === 'Account_Suspend' ? PALETTE.danger : PALETTE.slatePurple
      };
    });

    createOrUpdateChart('chart-action-dist', {
      type: 'bar',
      data: {
        labels: queues.map(q => q.replace('_', ' ')),
        datasets: actionData
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, title: { display: true, text: 'Decisions Executed' } }
        },
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  /**
   * Render Tab 3 Visuals & Audit Table
   */
  function renderQualityCharts(records) {
    // 1. Audit Error Taxonomy Pareto Chart
    const errors = ModerationStats.aggregateByError(records);
    createOrUpdateChart('chart-error-pareto', {
      type: 'bar',
      data: {
        labels: errors.map(e => e.type),
        datasets: [{
          label: 'Error Count',
          data: errors.map(e => e.count),
          backgroundColor: [PALETTE.danger, PALETTE.warning, PALETTE.slatePurple],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { title: { display: true, text: 'Errors Identified in Audit' } }
        }
      }
    });

    // 2. Agent Speed vs Quality Scatter
    const agents = ModerationStats.aggregateByAgent(records);
    createOrUpdateChart('chart-agent-quadrant', {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Agents',
          data: agents.map(a => ({
            x: a.avgAht,
            y: a.qaAvg,
            agentId: a.agentId,
            tenure: a.tenure,
            audited: a.auditedCount
          })),
          backgroundColor: agents.map(a => {
            if (a.tenure.includes('Senior')) return PALETTE.brightLime;
            if (a.tenure.includes('New')) return PALETTE.warning;
            return PALETTE.aubergine;
          }),
          pointRadius: 7,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (ctx) {
                const raw = ctx.raw;
                return `${raw.agentId} (${raw.tenure}): QA ${raw.y}%, AHT ${raw.x}s (${raw.audited} audits)`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Average Handling Time (Seconds) - Benchmark: 90s' }
          },
          y: {
            min: 80,
            max: 100,
            title: { display: true, text: 'QA Accuracy Score (%) - Target: 98.0%' }
          }
        }
      }
    });

    // 3. Appeals vs Overturns Trend
    const dailyMap = {};
    records.forEach(r => {
      const day = r.Timestamp.slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = { appeals: 0, overturns: 0 };
      if (parseInt(r.Appealed_Flag, 10) === 1) dailyMap[day].appeals++;
      if (parseInt(r.Overturned_Flag, 10) === 1) dailyMap[day].overturns++;
    });

    const appealDates = Object.keys(dailyMap).sort();
    createOrUpdateChart('chart-appeals-trend', {
      type: 'line',
      data: {
        labels: appealDates.map(d => d.slice(5)),
        datasets: [
          {
            label: 'User Appeals Filed',
            data: appealDates.map(d => dailyMap[d].appeals),
            borderColor: PALETTE.aubergine,
            backgroundColor: 'transparent',
            tension: 0.2
          },
          {
            label: 'Overturned / Reversals',
            data: appealDates.map(d => dailyMap[d].overturns),
            borderColor: PALETTE.brightLime,
            backgroundColor: 'rgba(111, 217, 4, 0.15)',
            fill: true,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { title: { display: true, text: 'Count per Day' } }
        }
      }
    });

    // Render Audited Records Table
    renderAuditTable(records);
  }

  /**
   * Populates the audited records drill-down table
   */
  function renderAuditTable(records) {
    const tbody = document.getElementById('audit-table-body');
    if (!tbody) return;

    const audited = records.filter(r => parseInt(r.QA_Audited, 10) === 1).slice(0, 25);
    if (audited.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; color: var(--text-muted);">No audited records match the current filter selection.</td></tr>';
      return;
    }

    tbody.innerHTML = audited.map(r => {
      const errorBadge = r.Error_Type === 'None'
        ? '<span class="badge badge-success">Passed</span>'
        : r.Error_Type === 'False_Negative'
        ? '<span class="badge badge-danger">False Negative</span>'
        : '<span class="badge badge-warning">' + r.Error_Type.replace('_', ' ') + '</span>';

      const overturnBadge = parseInt(r.Overturned_Flag, 10) === 1
        ? '<span class="badge badge-info">Reversed</span>'
        : '<span style="color: var(--text-muted);">&mdash;</span>';

      return `
        <tr>
          <td><strong>${r.Review_ID}</strong></td>
          <td>${r.Timestamp.slice(0, 16)}</td>
          <td>${r.Agent_ID}</td>
          <td>${r.Tenure_Group}</td>
          <td>${r.Queue_Name.replace('_', ' ')}</td>
          <td>${r.Content_Type.replace('_', ' ')}</td>
          <td>${r.Decision_Action.replace('_', ' ')}</td>
          <td>${r.QA_Score}%</td>
          <td>${errorBadge}</td>
          <td>${overturnBadge}</td>
          <td class="snippet-cell" title="${r.Content_Snippet}">${r.Content_Snippet}</td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Syncs Capacity Planner inputs and calculated outputs
   */
  function updateCapacityPlanner() {
    if (typeof CapacityPlanner === 'undefined') return;

    const volInput = document.getElementById('cap-volume-input');
    const ahtInput = document.getElementById('cap-aht-input');
    const shiftSelect = document.getElementById('cap-shift-select');
    const occInput = document.getElementById('cap-occupancy-slider');
    const shrinkInput = document.getElementById('cap-shrinkage-slider');
    const rosterInput = document.getElementById('cap-roster-input');

    if (!volInput || !ahtInput || !shiftSelect || !occInput || !shrinkInput || !rosterInput) return;

    // Display values
    document.getElementById('cap-volume-val').textContent = `${parseInt(volInput.value, 10).toLocaleString()} items`;
    document.getElementById('cap-aht-val').textContent = `${ahtInput.value} s`;
    document.getElementById('cap-occupancy-val').textContent = `${occInput.value}%`;
    document.getElementById('cap-shrinkage-val').textContent = `${shrinkInput.value}%`;
    document.getElementById('cap-roster-val').textContent = `${rosterInput.value} FTEs`;

    const result = CapacityPlanner.evaluateScenario({
      volume: volInput.value,
      aht: ahtInput.value,
      shiftHours: shiftSelect.value,
      shrinkage: parseFloat(shrinkInput.value) / 100,
      occupancy: parseFloat(occInput.value) / 100,
      currentRoster: rosterInput.value
    });

    document.getElementById('out-workload-hours').textContent = `${result.workloadHours} h`;
    document.getElementById('out-productive-hours').textContent = `${result.productiveHours} h`;
    document.getElementById('out-required-fte').textContent = `${result.requiredFte} FTE`;

    const gapBox = document.getElementById('box-staffing-gap');
    const gapEl = document.getElementById('out-staffing-gap');
    const gapSubtitle = document.getElementById('out-gap-subtitle');

    if (result.fteGap >= 0) {
      gapEl.textContent = `+${result.fteGap} Surplus`;
      gapEl.style.color = 'var(--status-success)';
      gapSubtitle.textContent = 'Safe operating headcount margin';
    } else {
      gapEl.textContent = `${result.fteGap} Deficit`;
      gapEl.style.color = 'var(--status-danger)';
      gapSubtitle.textContent = 'High risk of queue backlog & SLA breach';
    }

    const erlangEl = document.getElementById('out-erlang-prob');
    if (erlangEl) {
      erlangEl.textContent = `${result.queueWaitProb}%`;
      erlangEl.style.color = result.queueWaitProb > 30 ? 'var(--status-danger)' : 'var(--brand-primary)';
    }

    const recList = document.getElementById('cap-recommendations-list');
    if (recList) {
      recList.innerHTML = result.recommendations.map(r => `<li>${r}</li>`).join('');
    }
  }

  /**
   * Applies active filters and refreshes all views
   */
  function applyFilters() {
    const filters = {
      startDate: document.getElementById('filter-start-date').value,
      endDate: document.getElementById('filter-end-date').value,
      queue: document.getElementById('filter-queue').value,
      contentType: document.getElementById('filter-type').value,
      tenure: document.getElementById('filter-tenure').value,
      egregious: document.getElementById('filter-egregious').value,
      search: document.getElementById('filter-search').value
    };

    filteredRecords = ModerationStats.filterRecords(allRecords, filters);

    updateKpis(filteredRecords);
    renderExecutiveCharts(filteredRecords);
    renderQueueCharts(filteredRecords);
    renderQualityCharts(filteredRecords);
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Tab Switching
    const tabs = ['tab-exec', 'tab-queue', 'tab-quality', 'tab-capacity'];
    tabs.forEach(tabId => {
      const btn = document.getElementById(tabId);
      if (!btn) return;
      btn.addEventListener('click', () => {
        tabs.forEach(t => {
          const b = document.getElementById(t);
          const p = document.getElementById(b.getAttribute('aria-controls'));
          if (b && p) {
            b.setAttribute('aria-selected', t === tabId ? 'true' : 'false');
            p.classList.toggle('active', t === tabId);
          }
        });

        // Trigger chart resize on visible tab
        Object.values(chartInstances).forEach(chart => {
          if (chart) chart.resize();
        });
      });
    });

    // Filter toolbar events
    const filterIds = [
      'filter-start-date',
      'filter-end-date',
      'filter-queue',
      'filter-type',
      'filter-tenure',
      'filter-egregious',
      'filter-search'
    ];

    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', applyFilters);
        el.addEventListener('change', applyFilters);
      }
    });

    // Reset filters button
    const btnReset = document.getElementById('btn-reset-filters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        document.getElementById('filter-start-date').value = '';
        document.getElementById('filter-end-date').value = '';
        document.getElementById('filter-queue').value = 'All';
        document.getElementById('filter-type').value = 'All';
        document.getElementById('filter-tenure').value = 'All';
        document.getElementById('filter-egregious').value = 'All';
        document.getElementById('filter-search').value = '';
        applyFilters();
      });
    }

    // Capacity controls events
    const capControls = [
      'cap-volume-input',
      'cap-aht-input',
      'cap-shift-select',
      'cap-occupancy-slider',
      'cap-shrinkage-slider',
      'cap-roster-input'
    ];

    capControls.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateCapacityPlanner);
        el.addEventListener('change', updateCapacityPlanner);
      }
    });

    // Export CSV
    const btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        if (!filteredRecords || filteredRecords.length === 0) return;
        const csvString = Papa.unparse(filteredRecords);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ApexTrust_Filtered_Moderation_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Export Power BI (.pbip)
    const btnPbip = document.getElementById('btn-export-pbip');
    if (btnPbip) {
      btnPbip.addEventListener('click', () => {
        if (typeof PowerBIExport !== 'undefined' && PowerBIExport.downloadPbipZip) {
          PowerBIExport.downloadPbipZip(allRecords);
        } else {
          alert('Power BI export engine is loading...');
        }
      });
    }
  }

  /**
   * Load Dataset and Start Application
   */
  function initApp() {
    setupChartDefaults();
    setupEventListeners();
    updateCapacityPlanner();

    // Fetch CSV
    Papa.parse('dashboard-ready.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        allRecords = results.data;
        filteredRecords = [...allRecords];

        // Set default date bounds
        if (allRecords.length > 0) {
          const dates = allRecords.map(r => r.Timestamp.slice(0, 10)).sort();
          document.getElementById('filter-start-date').value = dates[0];
          document.getElementById('filter-end-date').value = dates[dates.length - 1];
        }

        applyFilters();
      },
      error: function (err) {
        console.error('Failed to parse dashboard-ready.csv:', err);
        const badge = document.getElementById('record-count-badge');
        if (badge) badge.textContent = 'Error loading CSV dataset';
      }
    });
  }

  // Auto-boot if in browser
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  }

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      PALETTE,
      createOrUpdateChart
    };
  }
})();
