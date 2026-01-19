/**
 * Client-Side API Service
 * 
 * Replaces backend API endpoints with client-side functions
 * All data processing runs in the browser
 */

import { 
  fetchNigeriaStates, 
  fetchExchangeRates, 
  fetchHumanitarianData 
} from './dataFetcher.js';

import { 
  getAllStateIndicators, 
  getStateIndicators 
} from './stateIndicators.js';

import { 
  getAllClimateIndicators, 
  getStateClimateIndicators 
} from './climateIndicators.js';

import { 
  getVulnerabilityIndexWithRankings, 
  getStateVulnerabilityIndex 
} from './vulnerabilityIndex.js';

import { 
  getComprehensiveStateCorrelationAnalysis 
} from './stateCorrelationAnalysis.js';

/**
 * Client-side API service that mimics backend endpoints
 * This allows the frontend to work without a backend server
 */
export const api = {
  /**
   * Health check
   */
  async health() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      client: true // Indicates this is client-side
    };
  },

  /**
   * Get Nigeria states and LGAs
   */
  async getStates() {
    return await fetchNigeriaStates();
  },

  /**
   * Get exchange rates
   */
  async getExchangeRates() {
    return await fetchExchangeRates();
  },

  /**
   * Get humanitarian indicators
   */
  async getHumanitarian(state = null) {
    return await fetchHumanitarianData(state);
  },

  /**
   * Get state-level indicators
   */
  async getStateIndicators(state = null) {
    if (state) {
      const indicators = getStateIndicators(state);
      const climate = getStateClimateIndicators(state);
      return {
        ...indicators,
        climate: climate
      };
    }
    const indicators = getAllStateIndicators();
    const climateIndicators = getAllClimateIndicators();
    
    // Merge climate indicators
    Object.keys(indicators).forEach(state => {
      if (climateIndicators[state]) {
        indicators[state].climate = climateIndicators[state];
      }
    });
    
    return indicators;
  },

  /**
   * Get climate indicators
   */
  async getClimateIndicators(state = null) {
    if (state) {
      return getStateClimateIndicators(state);
    }
    return getAllClimateIndicators();
  },

  /**
   * Get state-level correlation analysis
   */
  async getStateCorrelation(humanitarianData = null) {
    // If humanitarian data not provided, fetch it
    if (!humanitarianData) {
      humanitarianData = await fetchHumanitarianData();
    }
    return getComprehensiveStateCorrelationAnalysis(humanitarianData);
  },

  /**
   * Get vulnerability index
   */
  async getVulnerabilityIndex(state = null) {
    if (state) {
      return getStateVulnerabilityIndex(state);
    }
    return getVulnerabilityIndexWithRankings();
  },

  /**
   * Get combined dashboard data
   * This replaces the /api/dashboard endpoint
   */
  async getDashboard() {
    try {
      // Fetch all data in parallel
      const [states, exchangeRates, humanitarianData] = await Promise.allSettled([
        fetchNigeriaStates().catch(() => null),
        fetchExchangeRates().catch(() => null),
        fetchHumanitarianData().catch(() => null)
      ]);

      // Get state-level indicators, correlation analysis, and vulnerability index if data is available
      let stateIndicators = null;
      let stateCorrelationAnalysis = null;
      let vulnerabilityIndex = null;
      
      if (humanitarianData.status === 'fulfilled' && humanitarianData.value) {
        try {
          stateIndicators = getAllStateIndicators();
          stateCorrelationAnalysis = getComprehensiveStateCorrelationAnalysis(humanitarianData.value);
          vulnerabilityIndex = getVulnerabilityIndexWithRankings();
        } catch (error) {
          console.warn('Could not generate state analysis:', error.message);
        }
      }

      return {
        states: states.status === 'fulfilled' ? states.value : null,
        exchangeRates: exchangeRates.status === 'fulfilled' ? exchangeRates.value : null,
        humanitarian: humanitarianData.status === 'fulfilled' ? humanitarianData.value : null,
        stateIndicators: stateIndicators,
        correlation: stateCorrelationAnalysis,
        vulnerabilityIndex: vulnerabilityIndex,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
};

export default api;
