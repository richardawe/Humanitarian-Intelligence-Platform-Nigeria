/**
 * State-Level Correlation Analysis
 * 
 * Analyzes correlations between state-varying factors and humanitarian indicators
 * Uses real data: food inflation, poverty, conflict, import dependence, infrastructure
 */

import { getAllStateIndicators } from './stateIndicators.js';

/**
 * Calculate Pearson correlation coefficient
 */
function calculateCorrelation(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) {
    return { coefficient: 0, strength: 'insufficient_data', interpretation: 'Not enough data points' };
  }

  const n = x.length;
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  let covariance = 0;
  let varianceX = 0;
  let varianceY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    covariance += diffX * diffY;
    varianceX += diffX * diffX;
    varianceY += diffY * diffY;
  }

  const denominator = Math.sqrt(varianceX * varianceY);
  const coefficient = denominator === 0 ? 0 : covariance / denominator;

  const absCoeff = Math.abs(coefficient);
  let strength, interpretation;
  
  if (absCoeff >= 0.7) {
    strength = 'strong';
    interpretation = coefficient > 0 ? 'Strong positive correlation' : 'Strong negative correlation';
  } else if (absCoeff >= 0.4) {
    strength = 'moderate';
    interpretation = coefficient > 0 ? 'Moderate positive correlation' : 'Moderate negative correlation';
  } else if (absCoeff >= 0.2) {
    strength = 'weak';
    interpretation = coefficient > 0 ? 'Weak positive correlation' : 'Weak negative correlation';
  } else {
    strength = 'negligible';
    interpretation = 'No significant correlation';
  }

  return {
    coefficient: parseFloat(coefficient.toFixed(4)),
    strength,
    interpretation,
    rSquared: parseFloat((coefficient * coefficient).toFixed(4))
  };
}

/**
 * Analyze correlation between state-level factors and food insecurity
 */
export function analyzeStateFactorsFoodInsecurityCorrelation(humanitarianData) {
  if (!humanitarianData || humanitarianData.length === 0) {
    return { error: 'No humanitarian data provided' };
  }

  const stateIndicators = getAllStateIndicators();
  
  // Prepare data arrays
  const foodInflation = [];
  const povertyRates = [];
  const conflictIntensity = [];
  const importDependence = [];
  const infrastructureScores = [];
  const foodInsecurity = [];

  humanitarianData.forEach(item => {
    const state = item.state;
    const indicators = stateIndicators[state];
    
    if (indicators) {
      if (indicators.foodInflation?.current) {
        foodInflation.push(indicators.foodInflation.current);
      }
      if (indicators.poverty?.povertyRate) {
        povertyRates.push(indicators.poverty.povertyRate);
      }
      if (indicators.conflict?.intensity) {
        conflictIntensity.push(indicators.conflict.intensity);
      }
      if (indicators.importDependence?.score) {
        importDependence.push(indicators.importDependence.score);
      }
      if (indicators.infrastructure?.score) {
        infrastructureScores.push(indicators.infrastructure.score);
      }
      foodInsecurity.push(item.foodInsecurity || 0);
    }
  });

  // Calculate correlations
  const correlations = {
    foodInflation: calculateCorrelation(foodInflation, foodInsecurity.slice(0, foodInflation.length)),
    poverty: calculateCorrelation(povertyRates, foodInsecurity.slice(0, povertyRates.length)),
    conflict: calculateCorrelation(conflictIntensity, foodInsecurity.slice(0, conflictIntensity.length)),
    importDependence: calculateCorrelation(importDependence, foodInsecurity.slice(0, importDependence.length)),
    infrastructure: calculateCorrelation(infrastructureScores, foodInsecurity.slice(0, infrastructureScores.length))
  };

  // Generate insights
  const insights = [];
  
  if (correlations.foodInflation.coefficient > 0.4) {
    insights.push(`Food price inflation shows ${correlations.foodInflation.strength} correlation (r=${correlations.foodInflation.coefficient}) with food insecurity`);
    insights.push('States with higher food inflation tend to have higher food insecurity rates');
  }
  
  if (correlations.conflict.coefficient > 0.5) {
    insights.push(`Conflict intensity shows ${correlations.conflict.strength} correlation (r=${correlations.conflict.coefficient}) with food insecurity`);
    insights.push('Conflict-affected states (Borno, Yobe, Adamawa) show the strongest relationship');
  }
  
  if (correlations.poverty.coefficient > 0.3) {
    insights.push(`Poverty levels correlate with food insecurity (r=${correlations.poverty.coefficient})`);
  }

  // Find top contributing factors
  const sortedFactors = Object.entries(correlations)
    .sort((a, b) => Math.abs(b[1].coefficient) - Math.abs(a[1].coefficient))
    .slice(0, 3);

  return {
    correlations,
    insights,
    topFactors: sortedFactors.map(([factor, corr]) => ({
      factor,
      coefficient: corr.coefficient,
      strength: corr.strength,
      interpretation: corr.interpretation
    })),
    timestamp: new Date().toISOString()
  };
}

/**
 * Analyze correlation between state-level factors and displacement
 */
export function analyzeStateFactorsDisplacementCorrelation(humanitarianData) {
  if (!humanitarianData || humanitarianData.length === 0) {
    return { error: 'No humanitarian data provided' };
  }

  const stateIndicators = getAllStateIndicators();
  
  // Prepare data arrays
  const foodInflation = [];
  const povertyRates = [];
  const conflictIntensity = [];
  const importDependence = [];
  const infrastructureScores = [];
  const displacement = [];

  humanitarianData.forEach(item => {
    const state = item.state;
    const indicators = stateIndicators[state];
    
    if (indicators) {
      if (indicators.foodInflation?.current) {
        foodInflation.push(indicators.foodInflation.current);
      }
      if (indicators.poverty?.povertyRate) {
        povertyRates.push(indicators.poverty.povertyRate);
      }
      if (indicators.conflict?.intensity) {
        conflictIntensity.push(indicators.conflict.intensity);
      }
      if (indicators.importDependence?.score) {
        importDependence.push(indicators.importDependence.score);
      }
      if (indicators.infrastructure?.score) {
        infrastructureScores.push(indicators.infrastructure.score);
      }
      displacement.push(item.displacement || 0);
    }
  });

  // Calculate correlations
  const correlations = {
    foodInflation: calculateCorrelation(foodInflation, displacement.slice(0, foodInflation.length)),
    poverty: calculateCorrelation(povertyRates, displacement.slice(0, povertyRates.length)),
    conflict: calculateCorrelation(conflictIntensity, displacement.slice(0, conflictIntensity.length)),
    importDependence: calculateCorrelation(importDependence, displacement.slice(0, importDependence.length)),
    infrastructure: calculateCorrelation(infrastructureScores, displacement.slice(0, infrastructureScores.length))
  };

  // Generate insights
  const insights = [];
  
  if (correlations.conflict.coefficient > 0.6) {
    insights.push(`Conflict intensity shows ${correlations.conflict.strength} correlation (r=${correlations.conflict.coefficient}) with displacement`);
    insights.push('Conflict is the primary driver of displacement in Nigeria');
  }
  
  if (correlations.foodInflation.coefficient > 0.3) {
    insights.push(`Food price inflation contributes to displacement (r=${correlations.foodInflation.coefficient})`);
    insights.push('Economic pressures compound conflict-driven displacement');
  }

  // Find top contributing factors
  const sortedFactors = Object.entries(correlations)
    .sort((a, b) => Math.abs(b[1].coefficient) - Math.abs(a[1].coefficient))
    .slice(0, 3);

  return {
    correlations,
    insights,
    topFactors: sortedFactors.map(([factor, corr]) => ({
      factor,
      coefficient: corr.coefficient,
      strength: corr.strength,
      interpretation: corr.interpretation
    })),
    timestamp: new Date().toISOString()
  };
}

/**
 * Get comprehensive state-level correlation analysis
 */
export function getComprehensiveStateCorrelationAnalysis(humanitarianData) {
  const foodInsecurityAnalysis = analyzeStateFactorsFoodInsecurityCorrelation(humanitarianData);
  const displacementAnalysis = analyzeStateFactorsDisplacementCorrelation(humanitarianData);

  return {
    foodInsecurity: foodInsecurityAnalysis,
    displacement: displacementAnalysis,
    summary: {
      overall: 'State-level factors (food inflation, conflict, poverty, import dependence, infrastructure) show varying correlations with humanitarian indicators',
      recommendation: 'Focus interventions on states with high conflict intensity, food inflation, and poverty - these factors compound to create severe humanitarian crises'
    },
    timestamp: new Date().toISOString()
  };
}
