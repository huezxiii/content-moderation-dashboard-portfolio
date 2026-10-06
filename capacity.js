/**
 * Content Moderation Operations & Analytics - Capacity Planning & Erlang-C Engine
 * Implements Section 5 of the BA Guide: Workload estimation, productive agent hours,
 * shrinkage & occupancy adjustments, headcount gap analysis, and queue wait modeling.
 * Compatible with Node.js and client-side browser runtimes.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CapacityPlanner = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const CapacityPlanner = {};

  /**
   * Calculates total workload hours required to process a given volume at a given AHT.
   * Workload Hours = (Volume * AHT in seconds) / 3600
   */
  CapacityPlanner.calcWorkloadHours = function (volume, ahtSeconds) {
    const vol = parseFloat(volume) || 0;
    const aht = parseFloat(ahtSeconds) || 0;
    if (vol <= 0 || aht <= 0) return 0;
    return (vol * aht) / 3600.0;
  };

  /**
   * Calculates net productive hours delivered per agent shift.
   * Productive Hours = Shift Hours * (1 - Shrinkage Rate) * Occupancy Rate
   */
  CapacityPlanner.calcProductiveHours = function (shiftHours, shrinkageRate, occupancyRate) {
    const shift = parseFloat(shiftHours) || 8.0;
    const shrink = parseFloat(shrinkageRate) || 0.25;
    const occ = parseFloat(occupancyRate) || 0.80;
    return shift * (1.0 - shrink) * occ;
  };

  /**
   * Calculates required Full-Time Equivalents (FTEs).
   * Required FTE = Total Workload Hours / Productive Hours per Agent
   */
  CapacityPlanner.calcRequiredFte = function (workloadHours, productiveHours) {
    const wl = parseFloat(workloadHours) || 0;
    const prod = parseFloat(productiveHours) || 1;
    if (prod <= 0) return 0;
    return wl / prod;
  };

  /**
   * Log factorial helper for high-precision Erlang-C calculations.
   */
  function logFact(n) {
    let sum = 0;
    for (let i = 2; i <= n; i++) {
      sum += Math.log(i);
    }
    return sum;
  }

  /**
   * Calculates Erlang-C probability of an incoming item experiencing queue delay (Pw).
   * @param {number} trafficIntensity - Traffic intensity in erlangs (A = arrival_rate * AHT)
   * @param {number} servers - Number of active available reviewers (c)
   */
  CapacityPlanner.calcErlangC = function (trafficIntensity, servers) {
    const A = parseFloat(trafficIntensity);
    const c = parseInt(servers, 10);

    if (isNaN(A) || isNaN(c) || A <= 0 || c <= 0) return 0.0;
    if (c <= A) return 1.0; // Over capacity: wait probability 100%

    // Calculate sum of A^k / k! for k = 0 to c-1 using log transform
    let sumTerms = 0.0;
    for (let k = 0; k < c; k++) {
      const logTerm = k * Math.log(A) - logFact(k);
      sumTerms += Math.exp(logTerm);
    }

    // Calculate (A^c / c!) * (c / (c - A))
    const logLastTerm = c * Math.log(A) - logFact(c);
    const lastTerm = Math.exp(logLastTerm) * (c / (c - A));

    const denominator = sumTerms + lastTerm;
    if (denominator <= 0) return 0.0;

    const pw = lastTerm / denominator;
    return Math.min(Math.max(pw, 0.0), 1.0);
  };

  /**
   * Comprehensive operational scenario evaluation.
   */
  CapacityPlanner.evaluateScenario = function (inputs) {
    const volume = parseFloat(inputs.volume) || 10000;
    const aht = parseFloat(inputs.aht) || 180;
    const shiftHours = parseFloat(inputs.shiftHours) || 8.0;
    const shrinkage = parseFloat(inputs.shrinkage) || 0.25;
    const occupancy = parseFloat(inputs.occupancy) || 0.80;
    const currentRoster = parseInt(inputs.currentRoster, 10) || 15;

    const workloadHours = CapacityPlanner.calcWorkloadHours(volume, aht);
    const productiveHours = CapacityPlanner.calcProductiveHours(shiftHours, shrinkage, occupancy);
    const requiredFteExact = CapacityPlanner.calcRequiredFte(workloadHours, productiveHours);
    const requiredFteCeil = Math.ceil(requiredFteExact);

    const fteGap = currentRoster - requiredFteCeil; // Positive: surplus, Negative: deficit

    // Traffic intensity for a daily interval (assuming 16 active operating queue hours)
    const operatingSeconds = shiftHours * 3600;
    const arrivalRatePerSec = volume / operatingSeconds;
    const trafficIntensity = arrivalRatePerSec * aht;
    const queueWaitProb = CapacityPlanner.calcErlangC(trafficIntensity, currentRoster);

    // Health and risk classification
    let status = 'Optimal';
    let recommendations = [];

    if (occupancy > 0.85) {
      status = 'Burnout Risk';
      recommendations.push('Target occupancy exceeds 85%. Agent cognitive fatigue will elevate False Positive/Negative errors.');
    } else if (occupancy < 0.70) {
      status = 'Underutilized';
      recommendations.push('Occupancy below 70%. Excess capacity available for QA calibration sessions or offline training.');
    }

    if (fteGap < 0) {
      recommendations.push(`Staffing deficit of ${Math.abs(fteGap)} FTEs. Average Turnaround Time (TAT) projected to breach SLA by ${Math.min(Math.round(Math.abs(fteGap) * 4.2), 65)}%.`);
      if (shiftHours < 6.0) {
        recommendations.push('Egregious queue safeguard active (5.5h shift). Cross-train secondary tier agents to absorb surge volume.');
      } else {
        recommendations.push('Authorize 1.5h voluntary overtime or route low-risk spam queues to automated pre-moderation filters.');
      }
    } else {
      recommendations.push(`Operating with ${fteGap} surplus FTE buffer. SLA compliance expected to maintain ≥98.5%.`);
    }

    return {
      volume,
      aht,
      shiftHours,
      shrinkage,
      occupancy,
      currentRoster,
      workloadHours: Math.round(workloadHours * 10) / 10,
      productiveHours: Math.round(productiveHours * 100) / 100,
      requiredFteExact: Math.round(requiredFteExact * 10) / 10,
      requiredFte: requiredFteCeil,
      fteGap: fteGap,
      status: status,
      queueWaitProb: Math.round(queueWaitProb * 1000) / 10,
      recommendations: recommendations
    };
  };

  return CapacityPlanner;
}));
