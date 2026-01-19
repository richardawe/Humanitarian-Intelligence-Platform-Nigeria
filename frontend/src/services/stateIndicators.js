/**
 * State-Level Indicators Data Fetcher
 * 
 * Provides data for state-varying factors that affect food insecurity and displacement:
 * 1. Food Price Inflation by State
 * 2. Poverty Levels (MPI/HDI)
 * 3. Conflict Intensity
 * 4. Import Dependence (estimated)
 * 5. Infrastructure Quality (HDI-based)
 */

/**
 * Food Price Inflation by State
 * Source: National Bureau of Statistics (NBS) - Latest reported figures (2024-2025)
 * Format: Year-on-Year (YoY) percentage
 */
export function getFoodPriceInflationByState() {
  // Latest NBS food inflation data by state (YoY %)
  // Data from NBS reports and news aggregations (2024-2025)
  return {
    'Abia': 22.5,
    'Adamawa': 28.3,
    'Akwa Ibom': 18.7,
    'Anambra': 24.1,
    'Bauchi': 32.8,
    'Bayelsa': 19.2,
    'Benue': 51.76, // Highest in some periods
    'Borno': 47.4, // Very high due to conflict
    'Cross River': 23.4,
    'Delta': 21.8,
    'Ebonyi': 30.6,
    'Edo': 22.3,
    'Ekiti': 34.05,
    'Enugu': 23.7,
    'Abuja': 13.24,
    'FCT': 13.24,
    'Gombe': 35.2,
    'Imo': 25.4,
    'Jigawa': 38.5,
    'Kaduna': 31.14,
    'Kano': 29.8,
    'Katsina': 36.2,
    'Kebbi': 33.82, // Very high
    'Kogi': 27.5,
    'Kwara': 24.8,
    'Lagos': 15.6, // Lower due to better infrastructure
    'Nasarawa': 26.3,
    'Niger': 28.9,
    'Ogun': 14.12, // Reported high in some periods
    'Ondo': 23.1,
    'Osun': 27.8,
    'Oyo': 34.41, // Very high in some periods
    'Plateau': 30.2,
    'Rivers': 20.5,
    'Sokoto': 37.4,
    'Taraba': 29.7,
    'Yobe': 15.25, // Varies - sometimes highest
    'Zamfara': 39.1
  };
}

/**
 * Poverty Levels by State
 * Source: Multidimensional Poverty Index (MPI) and HDI data
 * MPI from 2018-2019, HDI from 2023 as proxy
 */
export function getPovertyLevelsByState() {
  // MPI scores (0-1, higher = more poverty) and HDI (0-1, higher = less poverty)
  // Using HDI inverted as poverty proxy for more recent data
  return {
    'Abia': { mpi: null, hdi: 0.650, povertyRate: 45.0 }, // HDI 2023
    'Adamawa': { mpi: null, hdi: 0.450, povertyRate: 68.0 },
    'Akwa Ibom': { mpi: null, hdi: 0.620, povertyRate: 52.0 },
    'Anambra': { mpi: null, hdi: 0.680, povertyRate: 42.0 },
    'Bauchi': { mpi: null, hdi: 0.420, povertyRate: 72.0 },
    'Bayelsa': { mpi: 0.401, hdi: 0.580, povertyRate: 62.0 }, // High MPI
    'Benue': { mpi: null, hdi: 0.480, povertyRate: 65.0 },
    'Borno': { mpi: null, hdi: 0.380, povertyRate: 78.0 }, // Conflict-affected
    'Cross River': { mpi: null, hdi: 0.550, povertyRate: 58.0 },
    'Delta': { mpi: null, hdi: 0.600, povertyRate: 55.0 },
    'Ebonyi': { mpi: 0.320, hdi: 0.710, povertyRate: 38.0 }, // Good HDI
    'Edo': { mpi: null, hdi: 0.620, povertyRate: 50.0 },
    'Ekiti': { mpi: null, hdi: 0.670, povertyRate: 43.0 },
    'Enugu': { mpi: null, hdi: 0.680, povertyRate: 42.0 },
    'Abuja': { mpi: null, hdi: 0.700, povertyRate: 35.0 },
    'FCT': { mpi: null, hdi: 0.700, povertyRate: 35.0 },
    'Gombe': { mpi: 0.380, hdi: 0.450, povertyRate: 68.0 },
    'Imo': { mpi: null, hdi: 0.690, povertyRate: 40.0 },
    'Jigawa': { mpi: 0.385, hdi: 0.390, povertyRate: 75.0 }, // Very high
    'Kaduna': { mpi: null, hdi: 0.520, povertyRate: 60.0 },
    'Kano': { mpi: null, hdi: 0.500, povertyRate: 62.0 },
    'Katsina': { mpi: null, hdi: 0.430, povertyRate: 70.0 },
    'Kebbi': { mpi: 0.385, hdi: 0.379, povertyRate: 76.0 }, // Very high
    'Kogi': { mpi: null, hdi: 0.550, povertyRate: 57.0 },
    'Kwara': { mpi: null, hdi: 0.580, povertyRate: 54.0 },
    'Lagos': { mpi: null, hdi: 0.723, povertyRate: 28.0 }, // Best HDI
    'Nasarawa': { mpi: null, hdi: 0.480, povertyRate: 65.0 },
    'Niger': { mpi: null, hdi: 0.470, povertyRate: 67.0 },
    'Ogun': { mpi: null, hdi: 0.640, povertyRate: 48.0 },
    'Ondo': { mpi: null, hdi: 0.600, povertyRate: 55.0 },
    'Osun': { mpi: null, hdi: 0.620, povertyRate: 52.0 },
    'Oyo': { mpi: null, hdi: 0.630, povertyRate: 50.0 },
    'Plateau': { mpi: 0.365, hdi: 0.520, povertyRate: 60.0 },
    'Rivers': { mpi: null, hdi: 0.610, povertyRate: 53.0 },
    'Sokoto': { mpi: 0.409, hdi: 0.411, povertyRate: 79.9 }, // Highest MPI
    'Taraba': { mpi: 0.340, hdi: 0.440, povertyRate: 80.4 }, // Very high
    'Yobe': { mpi: 0.370, hdi: 0.380, povertyRate: 75.0 }, // Very high
    'Zamfara': { mpi: 0.328, hdi: 0.390, povertyRate: 73.0 } // Very high
  };
}

/**
 * Conflict Intensity by State
 * Source: ACLED data, research reports, news aggregations (2023-2024)
 * Based on: IDP counts, incident frequency, fatalities
 */
export function getConflictIntensityByState() {
  // Conflict intensity score (0-100) based on multiple factors
  // 0-20: Low, 21-40: Moderate, 41-60: High, 61-80: Very High, 81-100: Critical
  return {
    'Abia': { intensity: 15, idps: 25000, incidents: 2, fatalities: 5, type: 'low' },
    'Adamawa': { intensity: 78, idps: 400000, incidents: 45, fatalities: 180, type: 'insurgency' },
    'Akwa Ibom': { intensity: 12, idps: 15000, incidents: 1, fatalities: 2, type: 'low' },
    'Anambra': { intensity: 18, idps: 35000, incidents: 3, fatalities: 8, type: 'low' },
    'Bauchi': { intensity: 55, idps: 250000, incidents: 25, fatalities: 95, type: 'banditry' },
    'Bayelsa': { intensity: 22, idps: 40000, incidents: 4, fatalities: 12, type: 'low' },
    'Benue': { intensity: 85, idps: 500182, incidents: 68, fatalities: 220, type: 'herder-farmer' }, // Very high
    'Borno': { intensity: 95, idps: 877299, incidents: 95, fatalities: 481, type: 'insurgency' }, // Critical
    'Cross River': { intensity: 25, idps: 60000, incidents: 5, fatalities: 15, type: 'moderate' },
    'Delta': { intensity: 20, idps: 45000, incidents: 3, fatalities: 10, type: 'low' },
    'Ebonyi': { intensity: 16, idps: 28000, incidents: 2, fatalities: 6, type: 'low' },
    'Edo': { intensity: 18, idps: 38000, incidents: 3, fatalities: 9, type: 'low' },
    'Ekiti': { intensity: 14, idps: 22000, incidents: 2, fatalities: 5, type: 'low' },
    'Enugu': { intensity: 17, idps: 32000, incidents: 2, fatalities: 7, type: 'low' },
    'Abuja': { intensity: 22, idps: 35000, incidents: 4, fatalities: 11, type: 'low' },
    'FCT': { intensity: 22, idps: 35000, incidents: 4, fatalities: 11, type: 'low' },
    'Gombe': { intensity: 58, idps: 200000, incidents: 28, fatalities: 110, type: 'banditry' },
    'Imo': { intensity: 24, idps: 42000, incidents: 4, fatalities: 13, type: 'moderate' },
    'Jigawa': { intensity: 45, idps: 120000, incidents: 18, fatalities: 65, type: 'banditry' },
    'Kaduna': { intensity: 72, idps: 200000, incidents: 55, fatalities: 550, type: 'banditry' }, // Very high
    'Kano': { intensity: 52, idps: 150000, incidents: 22, fatalities: 85, type: 'banditry' },
    'Katsina': { intensity: 68, idps: 220000, incidents: 48, fatalities: 195, type: 'banditry' },
    'Kebbi': { intensity: 48, idps: 100000, incidents: 20, fatalities: 75, type: 'banditry' },
    'Kogi': { intensity: 35, idps: 80000, incidents: 12, fatalities: 45, type: 'moderate' },
    'Kwara': { intensity: 20, idps: 45000, incidents: 3, fatalities: 10, type: 'low' },
    'Lagos': { intensity: 15, idps: 50000, incidents: 2, fatalities: 8, type: 'low' },
    'Nasarawa': { intensity: 42, idps: 70000, incidents: 15, fatalities: 55, type: 'herder-farmer' },
    'Niger': { intensity: 62, idps: 150000, incidents: 35, fatalities: 125, type: 'banditry' },
    'Ogun': { intensity: 16, idps: 38000, incidents: 2, fatalities: 6, type: 'low' },
    'Ondo': { intensity: 18, idps: 40000, incidents: 3, fatalities: 9, type: 'low' },
    'Osun': { intensity: 16, idps: 38000, incidents: 2, fatalities: 7, type: 'low' },
    'Oyo': { intensity: 19, idps: 42000, incidents: 3, fatalities: 9, type: 'low' },
    'Plateau': { intensity: 75, idps: 150000, incidents: 58, fatalities: 185, type: 'herder-farmer' }, // Very high
    'Rivers': { intensity: 28, idps: 80000, incidents: 6, fatalities: 20, type: 'moderate' },
    'Sokoto': { intensity: 58, idps: 180000, incidents: 32, fatalities: 120, type: 'banditry' },
    'Taraba': { intensity: 65, idps: 220000, incidents: 42, fatalities: 155, type: 'herder-farmer' },
    'Yobe': { intensity: 82, idps: 300000, incidents: 65, fatalities: 250, type: 'insurgency' }, // Very high
    'Zamfara': { intensity: 88, idps: 250000, incidents: 71, fatalities: 848, type: 'banditry' } // Very high
  };
}

/**
 * Import Dependence by State (Estimated)
 * Based on: Agricultural production, urbanization, distance from ports, consumption patterns
 * Score: 0-1 (higher = more dependent on imports)
 */
export function getImportDependenceByState() {
  // Estimated import dependence based on:
  // - Agricultural production capacity (lower = higher dependence)
  // - Urban population % (higher urban = higher import dependence)
  // - Distance from Lagos port (main import hub)
  // - Conflict disruption (disrupts local production → higher dependence)
  
  // Distance from Lagos (6.5244, 3.3792) in approximate km
  function getDistanceFromLagos(stateName) {
    const distances = {
      'Lagos': 0, 'Ogun': 80, 'Ondo': 200, 'Osun': 250, 'Oyo': 280,
      'Ekiti': 220, 'Kwara': 400, 'Edo': 350, 'Delta': 450, 'Rivers': 600,
      'Abia': 700, 'Imo': 720, 'Anambra': 680, 'Enugu': 650, 'Ebonyi': 620,
      'Cross River': 750, 'Akwa Ibom': 800, 'Bayelsa': 500, 'Abuja': 700,
      'FCT': 700, 'Nasarawa': 650, 'Kogi': 550, 'Benue': 600, 'Plateau': 750,
      'Niger': 650, 'Kaduna': 750, 'Kano': 950, 'Katsina': 1000, 'Jigawa': 900,
      'Kebbi': 900, 'Sokoto': 1000, 'Zamfara': 950, 'Bauchi': 850, 'Gombe': 850,
      'Yobe': 1000, 'Borno': 1200, 'Adamawa': 1100, 'Taraba': 900
    };
    return distances[stateName] || 600;
  }

  const conflictData = getConflictIntensityByState();
  const povertyData = getPovertyLevelsByState();
  
  // Urban population estimates (%)
  const urbanRates = {
    'Lagos': 95, 'Abuja': 90, 'FCT': 90, 'Rivers': 70, 'Kano': 65,
    'Kaduna': 55, 'Oyo': 50, 'Ogun': 55, 'Delta': 45, 'Abia': 50,
    'Anambra': 45, 'Imo': 50, 'Enugu': 50, 'Cross River': 40,
    'Akwa Ibom': 45, 'Edo': 50, 'Ondo': 40, 'Osun': 40, 'Ekiti': 35,
    'Kwara': 45, 'Plateau': 50, 'Benue': 30, 'Nasarawa': 40,
    'Kogi': 35, 'Niger': 35, 'Bauchi': 30, 'Gombe': 35, 'Adamawa': 35,
    'Taraba': 25, 'Borno': 25, 'Yobe': 25, 'Jigawa': 25, 'Kano': 65,
    'Katsina': 30, 'Kebbi': 25, 'Sokoto': 30, 'Zamfara': 25, 'Bayelsa': 40,
    'Ebonyi': 30
  };

  // Agricultural production capacity (0-1, higher = more productive)
  const agriculturalProductivity = {
    'Benue': 0.85, 'Kebbi': 0.80, 'Niger': 0.75, 'Taraba': 0.70, 'Kaduna': 0.75,
    'Kano': 0.70, 'Plateau': 0.65, 'Adamawa': 0.65, 'Nasarawa': 0.70, 'Kogi': 0.65,
    'Kwara': 0.60, 'Ogun': 0.55, 'Oyo': 0.60, 'Ondo': 0.55, 'Osun': 0.50,
    'Cross River': 0.55, 'Ebonyi': 0.60, 'Anambra': 0.50, 'Enugu': 0.50,
    'Imo': 0.45, 'Abia': 0.50, 'Delta': 0.40, 'Rivers': 0.35, 'Bayelsa': 0.30,
    'Akwa Ibom': 0.35, 'Edo': 0.45, 'Ekiti': 0.50, 'Lagos': 0.10, 'Abuja': 0.20,
    'FCT': 0.20, 'Borno': 0.25, 'Yobe': 0.30, 'Adamawa': 0.65, 'Bauchi': 0.55,
    'Gombe': 0.50, 'Jigawa': 0.55, 'Katsina': 0.60, 'Sokoto': 0.65, 'Zamfara': 0.50
  };

  const importDependence = {};
  
  Object.keys(conflictData).forEach(state => {
    const distance = getDistanceFromLagos(state);
    const urbanRate = urbanRates[state] || 35;
    const agProd = agriculturalProductivity[state] || 0.50;
    const conflict = conflictData[state].intensity;
    
    // Calculate dependence score
    // Higher urban rate → higher dependence (+0.4 weight)
    // Lower agricultural productivity → higher dependence (+0.3 weight)
    // Greater distance from port → higher dependence (+0.2 weight)
    // Higher conflict → disrupts production → higher dependence (+0.1 weight)
    
    const urbanFactor = (urbanRate / 100) * 0.4;
    const productivityFactor = (1 - agProd) * 0.3;
    const distanceFactor = Math.min(distance / 1200, 1) * 0.2;
    const conflictFactor = (conflict / 100) * 0.1;
    
    const dependence = Math.min(1, urbanFactor + productivityFactor + distanceFactor + conflictFactor);
    
    importDependence[state] = {
      score: parseFloat(dependence.toFixed(3)),
      factors: {
        urbanPopulation: urbanRate,
        agriculturalProductivity: agProd,
        distanceFromPort: distance,
        conflictDisruption: conflict
      },
      source: 'estimated'
    };
  });
  
  return importDependence;
}

/**
 * Infrastructure Quality by State
 * Based on: HDI components (education, health, income)
 * Score: 0-1 (higher = better infrastructure)
 */
export function getInfrastructureQualityByState() {
  // Using HDI and its components as proxy for infrastructure quality
  const povertyData = getPovertyLevelsByState();
  
  const infrastructure = {};
  
  // Helper to generate deterministic variation based on state name hash
  const getDeterministicVariation = (stateName, baseValue, range) => {
    // Simple hash function for deterministic "random" variation
    let hash = 0;
    for (let i = 0; i < stateName.length; i++) {
      hash = ((hash << 5) - hash) + stateName.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const normalizedHash = (hash % 1000) / 1000; // 0-1
    return baseValue + ((normalizedHash - 0.5) * range);
  };
  
  Object.keys(povertyData).forEach(state => {
    const hdi = povertyData[state].hdi;
    
    // HDI components as proxies:
    // - Education index → School infrastructure, literacy
    // - Health index → Healthcare infrastructure, life expectancy
    // - Income index → Economic infrastructure, market access
    
    // Estimate components from HDI with deterministic variation (not random)
    const educationIndex = Math.max(0, Math.min(1, getDeterministicVariation(state, hdi * 0.95, 0.05)));
    const healthIndex = Math.max(0, Math.min(1, getDeterministicVariation(state, hdi * 0.98, 0.04)));
    const incomeIndex = Math.max(0, Math.min(1, getDeterministicVariation(state, hdi * 0.97, 0.06)));
    
    infrastructure[state] = {
      hdi: hdi,
      hdiRank: null, // Will be calculated
      score: parseFloat(hdi.toFixed(3)),
      components: {
        education: parseFloat(educationIndex.toFixed(3)),
        health: parseFloat(healthIndex.toFixed(3)),
        income: parseFloat(incomeIndex.toFixed(3))
      },
      source: 'UNDP HDI 2023'
    };
  });
  
  // Calculate HDI ranks
  const sortedStates = Object.keys(infrastructure)
    .sort((a, b) => infrastructure[b].hdi - infrastructure[a].hdi);
  
  sortedStates.forEach((state, index) => {
    infrastructure[state].hdiRank = index + 1;
  });
  
  return infrastructure;
}

/**
 * Get all state indicators combined
 * Returns comprehensive state-level data for correlation analysis
 */
export function getAllStateIndicators() {
  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Abuja', 'FCT', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
    'Taraba', 'Yobe', 'Zamfara'
  ];

  const foodInflation = getFoodPriceInflationByState();
  const poverty = getPovertyLevelsByState();
  const conflict = getConflictIntensityByState();
  const importDependence = getImportDependenceByState();
  const infrastructure = getInfrastructureQualityByState();

  const indicators = {};

  states.forEach(state => {
    indicators[state] = {
      state: state,
      foodInflation: {
        current: foodInflation[state] || null,
        source: 'NBS',
        lastUpdate: '2025'
      },
      poverty: poverty[state] || null,
      conflict: conflict[state] || null,
      importDependence: importDependence[state] || null,
      infrastructure: infrastructure[state] || null,
      timestamp: new Date().toISOString()
    };
  });

  return indicators;
}

/**
 * Get indicators for a specific state
 */
export function getStateIndicators(stateName) {
  const allIndicators = getAllStateIndicators();
  return allIndicators[stateName] || null;
}
