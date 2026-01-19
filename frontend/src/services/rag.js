/**
 * RAG (Retrieval Augmented Generation) System
 * 
 * Enables users to chat with the humanitarian data
 * - Creates searchable index of all data
 * - Retrieves relevant context based on queries
 * - Prepares context for LLM responses
 */

import { 
  fetchNigeriaStates, 
  fetchHumanitarianData 
} from './dataFetcher.js';
import { getAllStateIndicators } from './stateIndicators.js';
import { getVulnerabilityIndexWithRankings } from './vulnerabilityIndex.js';
import { getComprehensiveStateCorrelationAnalysis } from './stateCorrelationAnalysis.js';

/**
 * Create searchable index of all data
 */
async function createDataIndex() {
  const [states, humanitarianData, stateIndicators, vulnerabilityIndex] = await Promise.all([
    fetchNigeriaStates().catch(() => []),
    fetchHumanitarianData().catch(() => []),
    Promise.resolve(getAllStateIndicators()),
    Promise.resolve(getVulnerabilityIndexWithRankings())
  ]);

  return {
    states,
    humanitarianData,
    stateIndicators,
    vulnerabilityIndex,
    timestamp: new Date().toISOString()
  };
}

/**
 * Simple keyword-based search (for MVP)
 * In production, could use embeddings/vector search
 */
function searchData(query, dataIndex) {
  const lowerQuery = query.toLowerCase();
  const results = {
    states: [],
    humanitarian: [],
    indicators: [],
    vulnerabilities: [],
    correlations: []
  };

  // Search states
  if (dataIndex.states) {
    results.states = dataIndex.states.filter(state => {
      return (
        state.name.toLowerCase().includes(lowerQuery) ||
        state.region.toLowerCase().includes(lowerQuery) ||
        state.capital.toLowerCase().includes(lowerQuery) ||
        (state.population && state.population.toString().includes(query))
      );
    });
  }

  // Search humanitarian data
  if (dataIndex.humanitarianData) {
    results.humanitarian = dataIndex.humanitarianData.filter(item => {
      return (
        item.state.toLowerCase().includes(lowerQuery) ||
        item.healthRisk.toLowerCase().includes(lowerQuery) ||
        (item.foodInsecurity && item.foodInsecurity.toString().includes(query)) ||
        (item.displacement && item.displacement.toString().includes(query))
      );
    });
  }

  // Search state indicators
  if (dataIndex.stateIndicators) {
    Object.entries(dataIndex.stateIndicators).forEach(([state, indicators]) => {
      if (state.toLowerCase().includes(lowerQuery)) {
        results.indicators.push({ state, ...indicators });
      } else if (
        lowerQuery.includes('inflation') || lowerQuery.includes('food price') ||
        lowerQuery.includes('poverty') || lowerQuery.includes('conflict') ||
        lowerQuery.includes('import') || lowerQuery.includes('infrastructure')
      ) {
        results.indicators.push({ state, ...indicators });
      }
    });
  }

  // Search vulnerabilities
  if (dataIndex.vulnerabilityIndex?.rankings) {
    results.vulnerabilities = dataIndex.vulnerabilityIndex.rankings.filter(item => {
      return (
        item.state.toLowerCase().includes(lowerQuery) ||
        item.category.includes(lowerQuery.replace(' ', '_')) ||
        item.score.toString().includes(query)
      );
    });
  }

  return results;
}

/**
 * Format search results into context for LLM
 */
function formatContextForLLM(searchResults, dataIndex) {
  const context = [];

  // Add states context
  if (searchResults.states.length > 0) {
    context.push(`States (${searchResults.states.length}): ${searchResults.states.map(s => `${s.name} (pop: ${s.population?.toLocaleString()}, region: ${s.region})`).join('; ')}`);
  }

  // Add humanitarian data context
  if (searchResults.humanitarian.length > 0) {
    const topResults = searchResults.humanitarian.slice(0, 5);
    context.push(`Humanitarian Indicators: ${topResults.map(h => `${h.state}: ${h.foodInsecurity}% food insecure, ${h.displacement?.toLocaleString()} IDPs, ${h.healthRisk} health risk`).join('; ')}`);
  }

  // Add vulnerability context
  if (searchResults.vulnerabilities.length > 0) {
    const topResults = searchResults.vulnerabilities.slice(0, 5);
    context.push(`Vulnerability Rankings: ${topResults.map(v => `${v.state}: ${v.score} (${v.category.replace('_', ' ')})`).join('; ')}`);
  }

  // Add summary statistics
  if (dataIndex.vulnerabilityIndex?.summary) {
    const summary = dataIndex.vulnerabilityIndex.summary;
    context.push(`Overall Summary: ${summary.total} states total, ${summary.critical} critical, ${summary.veryHigh} very high vulnerability`);
  }

  // Add state indicators summary
  if (searchResults.indicators.length > 0) {
    const topResults = searchResults.indicators.slice(0, 3);
    context.push(`State Indicators: ${topResults.map(i => {
      return `${i.state}: Food Inflation ${i.foodInflation?.current}%, Poverty ${i.poverty?.povertyRate}%, Conflict Intensity ${i.conflict?.intensity}`;
    }).join('; ')}`);
  }

  return context.join('\n\n');
}

/**
 * Get relevant data context for a user query
 */
export async function getRAGContext(query) {
  try {
    const dataIndex = await createDataIndex();
    const searchResults = searchData(query, dataIndex);
    const context = formatContextForLLM(searchResults, dataIndex);
    
    return {
      context,
      searchResults,
      dataIndex,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting RAG context:', error);
    return {
      context: 'Error retrieving data context',
      searchResults: {},
      dataIndex: null,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generate comprehensive data summary for context
 */
export function generateDataSummary(dataIndex) {
  if (!dataIndex) return '';

  const summary = [];

  // Overall statistics
  const totalPopulation = dataIndex.states?.reduce((sum, s) => sum + (s.population || 0), 0) || 0;
  const totalIDPs = dataIndex.humanitarianData?.reduce((sum, h) => sum + (h.displacement || 0), 0) || 0;
  const avgFoodInsecurity = dataIndex.humanitarianData?.length > 0
    ? (dataIndex.humanitarianData.reduce((sum, h) => sum + (h.foodInsecurity || 0), 0) / dataIndex.humanitarianData.length).toFixed(1)
    : 0;

  summary.push(`Nigeria Humanitarian Data Summary:`);
  summary.push(`- Total Population: ${totalPopulation.toLocaleString()}`);
  summary.push(`- Total IDPs: ${totalIDPs.toLocaleString()}`);
  summary.push(`- Average Food Insecurity: ${avgFoodInsecurity}%`);
  summary.push(`- Total States: ${dataIndex.states?.length || 37}`);

  // Vulnerability summary
  if (dataIndex.vulnerabilityIndex?.summary) {
    const s = dataIndex.vulnerabilityIndex.summary;
    summary.push(`\nVulnerability Distribution:`);
    summary.push(`- Critical: ${s.critical} states`);
    summary.push(`- Very High: ${s.veryHigh} states`);
    summary.push(`- High: ${s.high} states`);
    summary.push(`- Moderate: ${s.moderate} states`);
    summary.push(`- Low: ${s.low} states`);
  }

  // Top vulnerable states
  if (dataIndex.vulnerabilityIndex?.rankings) {
    const top5 = dataIndex.vulnerabilityIndex.rankings.slice(0, 5);
    summary.push(`\nTop 5 Most Vulnerable States:`);
    top5.forEach((v, idx) => {
      summary.push(`${idx + 1}. ${v.state}: ${v.score} (${v.category.replace('_', ' ')})`);
    });
  }

  return summary.join('\n');
}
