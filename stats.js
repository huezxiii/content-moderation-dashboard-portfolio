/**
 * Content Moderation Operations & Analytics - Statistical Computation Engine
 * Provides pure mathematical aggregations, duration-weighted metric evaluations,
 * multi-dimensional slicing, and distribution statistics.
 * Compatible with Node.js and client-side browser runtimes.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ModerationStats = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const ModerationStats = {};

  /**
   * Computes top-level strategic KPIs from an array of record objects.
   */
  ModerationStats.computeKpis = function (records) {
    if (!records || records.length === 0) {
      return {
        totalVolume: 0,
        weightedAht: 0,
        slaAttainment: 0,
        slaBreachCount: 0,
        egregiousCount: 0,
        qaAuditedCount: 0,
        qaScoreAvg: 0,
        falsePositiveRate: 0,
        falseNegativeRate: 0,
        appealsCount: 0,
        overturnsCount: 0,
        overturnRate: 0,
        actionRate: 0,
        autoTriageRate: 0
      };
    }

    const total = records.length;
    let totalAhtSec = 0;
    let nonBreachCount = 0;
    let breachCount = 0;
    let egregiousCount = 0;
    let qaAuditedCount = 0;
    let qaScoreSum = 0;
    let fpCount = 0;
    let fnCount = 0;
    let appealsCount = 0;
    let overturnsCount = 0;
    let actionCount = 0;
    let autoTriageCount = 0;

    for (let i = 0; i < total; i++) {
      const r = records[i];
      const aht = parseFloat(r.AHT_Seconds) || 0;
      totalAhtSec += aht;

      const breached = parseInt(r.SLA_Breached, 10);
      if (breached === 0) {
        nonBreachCount++;
      } else {
        breachCount++;
      }

      if (parseInt(r.Egregious_Flag, 10) === 1) {
        egregiousCount++;
      }

      if (r.HITL_Routing === 'Auto_Approved' || r.HITL_Routing === 'Auto_Rejected') {
        autoTriageCount++;
      }

      if (r.Decision_Action !== 'Approve_Keep') {
        actionCount++;
      }

      if (parseInt(r.QA_Audited, 10) === 1) {
        qaAuditedCount++;
        qaScoreSum += parseFloat(r.QA_Score) || 0;
        if (r.Error_Type === 'False_Positive') {
          fpCount++;
        } else if (r.Error_Type === 'False_Negative') {
          fnCount++;
        }
      }

      if (parseInt(r.Appealed_Flag, 10) === 1) {
        appealsCount++;
        if (parseInt(r.Overturned_Flag, 10) === 1) {
          overturnsCount++;
        }
      }
    }

    return {
      totalVolume: total,
      weightedAht: total > 0 ? (totalAhtSec / total) : 0,
      slaAttainment: total > 0 ? ((nonBreachCount / total) * 100) : 0,
      slaBreachCount: breachCount,
      egregiousCount: egregiousCount,
      qaAuditedCount: qaAuditedCount,
      qaScoreAvg: qaAuditedCount > 0 ? (qaScoreSum / qaAuditedCount) : 0,
      falsePositiveRate: qaAuditedCount > 0 ? ((fpCount / qaAuditedCount) * 100) : 0,
      falseNegativeRate: qaAuditedCount > 0 ? ((fnCount / qaAuditedCount) * 100) : 0,
      appealsCount: appealsCount,
      overturnsCount: overturnsCount,
      overturnRate: appealsCount > 0 ? ((overturnsCount / appealsCount) * 100) : 0,
      actionRate: total > 0 ? ((actionCount / total) * 100) : 0,
      autoTriageRate: total > 0 ? ((autoTriageCount / total) * 100) : 0
    };
  };

  /**
   * Filters an array of records across active UI selections.
   */
  ModerationStats.filterRecords = function (records, filters) {
    if (!filters) return records;

    const {
      startDate,
      endDate,
      queue,
      contentType,
      tenure,
      egregious,
      routing,
      search
    } = filters;

    const searchLower = (search || '').trim().toLowerCase();

    return records.filter(r => {
      // Date range filtering
      if (startDate) {
        const rowDate = r.Timestamp.slice(0, 10);
        if (rowDate < startDate) return false;
      }
      if (endDate) {
        const rowDate = r.Timestamp.slice(0, 10);
        if (rowDate > endDate) return false;
      }

      // Categorical filters
      if (queue && queue !== 'All' && r.Queue_Name !== queue) return false;
      if (contentType && contentType !== 'All' && r.Content_Type !== contentType) return false;
      if (tenure && tenure !== 'All' && r.Tenure_Group !== tenure) return false;
      if (routing && routing !== 'All' && r.HITL_Routing !== routing) return false;

      // Egregious filter
      if (egregious !== undefined && egregious !== 'All') {
        const flag = parseInt(r.Egregious_Flag, 10);
        if (egregious === 1 || egregious === '1' || egregious === true) {
          if (flag !== 1) return false;
        } else if (egregious === 0 || egregious === '0' || egregious === false) {
          if (flag !== 0) return false;
        }
      }

      // Text snippet or ID search
      if (searchLower) {
        const snippetMatch = (r.Content_Snippet || '').toLowerCase().includes(searchLower);
        const idMatch = (r.Review_ID || '').toLowerCase().includes(searchLower);
        const agentMatch = (r.Agent_ID || '').toLowerCase().includes(searchLower);
        if (!snippetMatch && !idMatch && !agentMatch) return false;
      }

      return true;
    });
  };

  /**
   * Aggregates records by calendar day (incoming volume, closed volume, SLA %).
   */
  ModerationStats.aggregateDaily = function (records) {
    const map = {};

    records.forEach(r => {
      const day = r.Timestamp.slice(0, 10);
      if (!map[day]) {
        map[day] = {
          date: day,
          total: 0,
          breaches: 0,
          manual: 0,
          automated: 0,
          totalAht: 0
        };
      }
      map[day].total++;
      if (parseInt(r.SLA_Breached, 10) === 1) map[day].breaches++;
      if (r.HITL_Routing === 'Auto_Approved' || r.HITL_Routing === 'Auto_Rejected') {
        map[day].automated++;
      } else {
        map[day].manual++;
      }
      map[day].totalAht += parseFloat(r.AHT_Seconds) || 0;
    });

    const dates = Object.keys(map).sort();
    return dates.map(d => {
      const item = map[d];
      return {
        date: d,
        total: item.total,
        breaches: item.breaches,
        manual: item.manual,
        automated: item.automated,
        slaRate: item.total > 0 ? (((item.total - item.breaches) / item.total) * 100) : 0,
        avgAht: item.total > 0 ? (item.totalAht / item.total) : 0
      };
    });
  };

  /**
   * Aggregates metrics by operational queue.
   */
  ModerationStats.aggregateByQueue = function (records) {
    const map = {};

    records.forEach(r => {
      const q = r.Queue_Name;
      if (!map[q]) {
        map[q] = {
          queue: q,
          total: 0,
          breaches: 0,
          totalAht: 0,
          egregious: 0,
          enforcements: 0
        };
      }
      map[q].total++;
      if (parseInt(r.SLA_Breached, 10) === 1) map[q].breaches++;
      if (parseInt(r.Egregious_Flag, 10) === 1) map[q].egregious++;
      if (r.Decision_Action !== 'Approve_Keep') map[q].enforcements++;
      map[q].totalAht += parseFloat(r.AHT_Seconds) || 0;
    });

    return Object.values(map).map(item => ({
      queue: item.queue,
      total: item.total,
      avgAht: item.total > 0 ? Math.round((item.totalAht / item.total) * 10) / 10 : 0,
      slaRate: item.total > 0 ? Math.round(((item.total - item.breaches) / item.total) * 1000) / 10 : 0,
      egregiousRate: item.total > 0 ? Math.round((item.egregious / item.total) * 1000) / 10 : 0,
      actionRate: item.total > 0 ? Math.round((item.enforcements / item.total) * 1000) / 10 : 0
    }));
  };

  /**
   * Aggregates QA audits by error taxonomy for Pareto charts.
   */
  ModerationStats.aggregateByError = function (records) {
    const counts = {
      False_Positive: 0,
      False_Negative: 0,
      Wrong_Selection: 0
    };

    records.forEach(r => {
      if (parseInt(r.QA_Audited, 10) === 1 && r.Error_Type && r.Error_Type !== 'None') {
        if (counts[r.Error_Type] !== undefined) {
          counts[r.Error_Type]++;
        }
      }
    });

    const totalErrors = Object.values(counts).reduce((a, b) => a + b, 0);

    return [
      { type: 'False Positive (User Harm)', count: counts.False_Positive, key: 'False_Positive' },
      { type: 'False Negative (Platform Risk)', count: counts.False_Negative, key: 'False_Negative' },
      { type: 'Wrong Policy Selection', count: counts.Wrong_Selection, key: 'Wrong_Selection' }
    ].sort((a, b) => b.count - a.count).map(item => ({
      ...item,
      share: totalErrors > 0 ? Math.round((item.count / totalErrors) * 1000) / 10 : 0
    }));
  };

  /**
   * Aggregates agent performance for Speed vs. Quality scatter analysis.
   */
  ModerationStats.aggregateByAgent = function (records) {
    const map = {};

    records.forEach(r => {
      const id = r.Agent_ID;
      if (!map[id]) {
        map[id] = {
          agentId: id,
          tenure: r.Tenure_Group,
          total: 0,
          totalAht: 0,
          auditedCount: 0,
          qaScoreSum: 0,
          errors: 0
        };
      }
      map[id].total++;
      map[id].totalAht += parseFloat(r.AHT_Seconds) || 0;
      if (parseInt(r.QA_Audited, 10) === 1) {
        map[id].auditedCount++;
        map[id].qaScoreSum += parseFloat(r.QA_Score) || 0;
        if (r.Error_Type !== 'None') map[id].errors++;
      }
    });

    return Object.values(map).map(a => ({
      agentId: a.agentId,
      tenure: a.tenure,
      total: a.total,
      avgAht: a.total > 0 ? Math.round((a.totalAht / a.total) * 10) / 10 : 0,
      qaAvg: a.auditedCount > 0 ? Math.round((a.qaScoreSum / a.auditedCount) * 10) / 10 : 100.0,
      auditedCount: a.auditedCount
    }));
  };

  /**
   * Aggregates volume by hour of day (0-23) for diurnal arrival analysis.
   */
  ModerationStats.aggregateHourly = function (records) {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0, breaches: 0 }));

    records.forEach(r => {
      const dt = new Date(r.Timestamp);
      const h = dt.getHours();
      if (h >= 0 && h < 24) {
        hours[h].count++;
        if (parseInt(r.SLA_Breached, 10) === 1) {
          hours[h].breaches++;
        }
      }
    });

    return hours;
  };

  return ModerationStats;
}));
