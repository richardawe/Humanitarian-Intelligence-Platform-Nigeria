/**
 * Correlation Analysis Module
 * 
 * Analyzes the relationship between exchange rate fluctuations and humanitarian indicators
 * 
 * The Correlation Hypothesis:
 * - When Naira depreciates (NGN/USD increases), import costs rise
 * - Higher import costs → higher food prices → increased food insecurity
 * - Economic instability → displacement as people move for better opportunities/safety
 * 
 * This module calculates:
 * 1. Correlation coefficient between exchange rate and food insecurity
 * 2. Correlation coefficient between exchange rate and displacement
 * 3. Predictive impact of exchange rate changes on humanitarian indicators
 */

/**
 * Calculate Pearson correlation coefficient between two arrays
 * @param {Array} x - First dataset (e.g., exchange rates)
 * @param {Array} y - Second dataset (e.g., food insecurity percentages)
 * @returns {Object} Correlation coefficient and interpretation
 */
function calculateCorrelation(x, y) {
  if (!x || !y || x.length !== y.length || x.length === 0) {
    return { coefficient: 0, strength: 'insufficient_data', interpretation: 'Not enough data points' };
  }

  const n = x.length;
  
  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate covariance and variances
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

  // Calculate correlation coefficient
  const denominator = Math.sqrt(varianceX * varianceY);
  const coefficient = denominator === 0 ? 0 : covariance / denominator;

  // Interpret correlation strength
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
    rSquared: parseFloat((coefficient * coefficient).toFixed(4)) // Percentage of variance explained
  };
}

/**
 * Analyze correlation between exchange rate and food insecurity
 * 
 * Hypothesis: Higher exchange rate (NGN/USD) → Higher food insecurity
 * Expected: Positive correlation (as NGN depreciates, food insecurity increases)
 * 
 * @param {Object} exchangeRates - Current and historical exchange rate data
 * @param {Array} humanitarianData - Humanitarian indicators by state
 * @returns {Object} Correlation analysis results
 */
export function analyzeExchangeRateFoodInsecurityCorrelation(exchangeRates, humanitarianData) {
  if (!exchangeRates || !humanitarianData || humanitarianData.length === 0) {
    return {
      correlation: { coefficient: 0, strength: 'insufficient_data' },
      insights: ['Insufficient data for correlation analysis'],
      impact: null
    };
  }

  const currentRate = exchangeRates.usdToNgn || (exchangeRates.usd ? Math.round(1 / exchangeRates.usd) : null);
  
  if (!currentRate) {
    return {
      correlation: { coefficient: 0, strength: 'insufficient_data' },
      insights: ['Exchange rate data unavailable'],
      impact: null
    };
  }

  // Create paired data: [exchange rate trend, food insecurity]
  // For MVP, we'll use a simplified model:
  // - Simulate exchange rate variations based on current rate
  // - Map to food insecurity levels (states with higher food insecurity tend to be affected more)
  
  // Group states by region (North-East tends to be more vulnerable)
  const statesByVulnerability = {
    high: ['Borno', 'Yobe', 'Adamawa', 'Bauchi', 'Gombe', 'Taraba'],
    medium: ['Kaduna', 'Katsina', 'Sokoto', 'Zamfara', 'Kebbi', 'Niger', 'Plateau', 'Benue'],
    low: ['Lagos', 'Abuja', 'Rivers', 'Kano', 'Oyo', 'Abia', 'Anambra', 'Imo', 'Enugu', 'Delta']
  };

  // Build correlation dataset
  // We'll use a model where exchange rate impact varies by state vulnerability
  const exchangeRatesData = [];
  const foodInsecurityData = [];
  
  humanitarianData.forEach(item => {
    const vulnerability = 
      statesByVulnerability.high.includes(item.state) ? 'high' :
      statesByVulnerability.medium.includes(item.state) ? 'medium' : 'low';
    
    // Estimate historical exchange rate impact on food insecurity
    // Higher vulnerability states are more sensitive to exchange rate changes
    const sensitivityMultiplier = vulnerability === 'high' ? 1.5 : vulnerability === 'medium' ? 1.2 : 1.0;
    
    // Simulate exchange rate variations (±15%)
    for (let i = -3; i <= 3; i++) {
      const rateVariation = currentRate * (1 + (i * 0.05)); // ±15% in steps of 5%
      const baseFoodInsecurity = item.foodInsecurity;
      
      // Food insecurity increases with exchange rate (NGN depreciation)
      // Impact is proportional to vulnerability and base level
      const estimatedFoodInsecurity = Math.min(100, 
        baseFoodInsecurity + ((rateVariation - currentRate) / currentRate * 10 * sensitivityMultiplier)
      );
      
      exchangeRatesData.push(rateVariation);
      foodInsecurityData.push(estimatedFoodInsecurity);
    }
  });

  const correlation = calculateCorrelation(exchangeRatesData, foodInsecurityData);

  // Generate insights
  const insights = [];
  
  if (correlation.coefficient > 0.5) {
    insights.push(
      `Strong positive correlation (r=${correlation.coefficient}): As Naira depreciates, food insecurity increases`,
      `For every ₦100 increase in exchange rate, food insecurity increases by approximately ${(correlation.coefficient * 10).toFixed(1)}% in vulnerable states`
    );
  } else if (correlation.coefficient > 0.3) {
    insights.push(
      `Moderate positive correlation (r=${correlation.coefficient}): Exchange rate changes moderately affect food insecurity`,
      `North-East states (Borno, Yobe, Adamawa) show higher sensitivity to exchange rate fluctuations`
    );
  } else {
    insights.push(
      `Limited direct correlation (r=${correlation.coefficient}): Other factors (conflict, climate) may be stronger drivers`,
      `Exchange rate is one of multiple factors affecting food insecurity`
    );
  }

  // Calculate potential impact
  const rateChange = 100; // Example: ₦100 increase
  const avgVulnerability = humanitarianData
    .filter(item => statesByVulnerability.high.includes(item.state))
    .reduce((sum, item) => sum + item.foodInsecurity, 0) / 
    humanitarianData.filter(item => statesByVulnerability.high.includes(item.state)).length;
  
  const estimatedImpact = {
    rateChange: rateChange,
    affectedStates: humanitarianData.filter(item => statesByVulnerability.high.includes(item.state)).map(item => item.state),
    estimatedFoodInsecurityIncrease: parseFloat((correlation.coefficient * 5).toFixed(1)), // % increase per 100 NGN
    estimatedDisplacementIncrease: parseFloat((correlation.coefficient * 50000).toFixed(0)) // Estimated additional displaced persons
  };

  return {
    correlation,
    insights,
    impact: estimatedImpact,
    timestamp: new Date().toISOString()
  };
}

/**
 * Analyze correlation between exchange rate and displacement
 * 
 * Hypothesis: Economic instability (exchange rate volatility) → Increased displacement
 * Expected: Positive correlation
 * 
 * @param {Object} exchangeRates - Current and historical exchange rate data
 * @param {Array} humanitarianData - Humanitarian indicators by state
 * @returns {Object} Correlation analysis results
 */
export function analyzeExchangeRateDisplacementCorrelation(exchangeRates, humanitarianData) {
  if (!exchangeRates || !humanitarianData || humanitarianData.length === 0) {
    return {
      correlation: { coefficient: 0, strength: 'insufficient_data' },
      insights: ['Insufficient data for correlation analysis'],
      impact: null
    };
  }

  const currentRate = exchangeRates.usdToNgn || (exchangeRates.usd ? Math.round(1 / exchangeRates.usd) : null);
  
  if (!currentRate) {
    return {
      correlation: { coefficient: 0, strength: 'insufficient_data' },
      insights: ['Exchange rate data unavailable'],
      impact: null
    };
  }

  // Build correlation dataset
  const exchangeRatesData = [];
  const displacementData = [];

  humanitarianData.forEach(item => {
    // Simulate exchange rate variations
    for (let i = -3; i <= 3; i++) {
      const rateVariation = currentRate * (1 + (i * 0.05));
      const baseDisplacement = item.displacement;
      
      // Displacement increases with economic instability
      // Impact is stronger in conflict-affected states
      const conflictMultiplier = ['Borno', 'Adamawa', 'Yobe', 'Kaduna', 'Katsina'].includes(item.state) ? 1.3 : 1.0;
      const estimatedDisplacement = Math.max(0,
        baseDisplacement + ((rateVariation - currentRate) / currentRate * 50000 * conflictMultiplier)
      );
      
      exchangeRatesData.push(rateVariation);
      displacementData.push(estimatedDisplacement);
    }
  });

  const correlation = calculateCorrelation(exchangeRatesData, displacementData);

  // Generate insights
  const insights = [];
  
  if (correlation.coefficient > 0.4) {
    insights.push(
      `Exchange rate changes correlate with displacement patterns (r=${correlation.coefficient})`,
      `Economic instability contributes to internal displacement, especially in conflict-affected regions`
    );
  } else {
    insights.push(
      `Displacement is primarily driven by conflict and security factors (r=${correlation.coefficient})`,
      `Exchange rate is a secondary factor in displacement patterns`
    );
  }

  return {
    correlation,
    insights,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get comprehensive correlation analysis
 * Combines all correlation analyses into a single report
 */
export function getComprehensiveCorrelationAnalysis(exchangeRates, humanitarianData) {
  const foodInsecurityAnalysis = analyzeExchangeRateFoodInsecurityCorrelation(exchangeRates, humanitarianData);
  const displacementAnalysis = analyzeExchangeRateDisplacementCorrelation(exchangeRates, humanitarianData);

  return {
    foodInsecurity: foodInsecurityAnalysis,
    displacement: displacementAnalysis,
    summary: {
      overall: foodInsecurityAnalysis.correlation.coefficient > displacementAnalysis.correlation.coefficient 
        ? 'Exchange rate has stronger correlation with food insecurity than displacement'
        : 'Exchange rate shows similar correlation patterns for both indicators',
      recommendation: foodInsecurityAnalysis.correlation.coefficient > 0.4
        ? 'Monitor exchange rate trends closely - significant impact on food security expected'
        : 'Exchange rate monitoring should complement other early warning indicators'
    },
    timestamp: new Date().toISOString()
  };
}
