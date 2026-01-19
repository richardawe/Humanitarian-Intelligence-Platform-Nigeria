import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchNigeriaStates, fetchExchangeRates, fetchHumanitarianData } from './api/dataFetcher.js';
import { getComprehensiveCorrelationAnalysis } from './api/correlationAnalysis.js';
import { getAllStateIndicators, getStateIndicators } from './api/stateIndicators.js';
import { getComprehensiveStateCorrelationAnalysis } from './api/stateCorrelationAnalysis.js';
import { getVulnerabilityIndexWithRankings, getStateVulnerabilityIndex } from './api/vulnerabilityIndex.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory cache (for MVP)
const cache = {
  states: null,
  exchangeRates: null,
  humanitarianData: null,
  lastFetch: null
};

// Cache TTL: 1 hour for MVP
const CACHE_TTL = 60 * 60 * 1000;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get Nigeria states and LGAs
app.get('/api/states', async (req, res) => {
  try {
    if (cache.states && (Date.now() - cache.lastFetch?.states || 0) < CACHE_TTL) {
      return res.json(cache.states);
    }

    const states = await fetchNigeriaStates();
    cache.states = states;
    cache.lastFetch = { ...cache.lastFetch, states: Date.now() };
    
    res.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to fetch states data' });
  }
});

// Get exchange rates
app.get('/api/exchange-rates', async (req, res) => {
  try {
    if (cache.exchangeRates && (Date.now() - cache.lastFetch?.exchangeRates || 0) < CACHE_TTL) {
      return res.json(cache.exchangeRates);
    }

    const rates = await fetchExchangeRates();
    cache.exchangeRates = rates;
    cache.lastFetch = { ...cache.lastFetch, exchangeRates: Date.now() };
    
    res.json(rates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

// Get humanitarian indicators
app.get('/api/humanitarian', async (req, res) => {
  try {
    const { state } = req.query;
    
    const data = await fetchHumanitarianData(state);
    res.json(data);
  } catch (error) {
    console.error('Error fetching humanitarian data:', error);
    res.status(500).json({ error: 'Failed to fetch humanitarian data' });
  }
});

// Get state-level indicators (food inflation, poverty, conflict, import dependence, infrastructure)
app.get('/api/state-indicators', async (req, res) => {
  try {
    const { state } = req.query;
    
    if (state) {
      const indicators = getStateIndicators(state);
      if (!indicators) {
        return res.status(404).json({ error: `No indicators found for state: ${state}` });
      }
      return res.json(indicators);
    }
    
    const indicators = getAllStateIndicators();
    res.json(indicators);
  } catch (error) {
    console.error('Error fetching state indicators:', error);
    res.status(500).json({ error: 'Failed to fetch state indicators' });
  }
});

// Get vulnerability index
app.get('/api/vulnerability-index', async (req, res) => {
  try {
    const { state } = req.query;
    
    if (state) {
      const vulnerability = getStateVulnerabilityIndex(state);
      if (!vulnerability) {
        return res.status(404).json({ error: `No vulnerability index found for state: ${state}` });
      }
      return res.json(vulnerability);
    }
    
    const vulnerabilityIndex = getVulnerabilityIndexWithRankings();
    res.json(vulnerabilityIndex);
  } catch (error) {
    console.error('Error fetching vulnerability index:', error);
    res.status(500).json({ error: 'Failed to fetch vulnerability index' });
  }
});

// Get correlation analysis (old version - exchange rate based)
app.get('/api/correlation', async (req, res) => {
  try {
    const [exchangeRates, humanitarianData] = await Promise.allSettled([
      fetchExchangeRates().catch(() => null),
      fetchHumanitarianData().catch(() => null)
    ]);

    if (exchangeRates.status !== 'fulfilled' || humanitarianData.status !== 'fulfilled') {
      return res.status(500).json({ error: 'Failed to fetch data for correlation analysis' });
    }

    const analysis = getComprehensiveCorrelationAnalysis(exchangeRates.value, humanitarianData.value);
    res.json(analysis);
  } catch (error) {
    console.error('Error performing correlation analysis:', error);
    res.status(500).json({ error: 'Failed to perform correlation analysis' });
  }
});

// Get state-level correlation analysis (new version - uses state-varying factors)
app.get('/api/state-correlation', async (req, res) => {
  try {
    const humanitarianData = await fetchHumanitarianData().catch(() => null);
    
    if (!humanitarianData || humanitarianData.length === 0) {
      return res.status(500).json({ error: 'Failed to fetch humanitarian data for correlation analysis' });
    }

    const analysis = getComprehensiveStateCorrelationAnalysis(humanitarianData);
    res.json(analysis);
  } catch (error) {
    console.error('Error performing state correlation analysis:', error);
    res.status(500).json({ error: 'Failed to perform state correlation analysis' });
  }
});

// Get combined dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    const [states, exchangeRates, humanitarianData] = await Promise.allSettled([
      fetchNigeriaStates().catch(() => null),
      fetchExchangeRates().catch(() => null),
      fetchHumanitarianData().catch(() => null)
    ]);

    // Get state-level indicators, correlation analysis, and vulnerability index if data is available
    let stateIndicators = null;
    let stateCorrelationAnalysis = null;
    let vulnerabilityIndex = null;
    
    if (humanitarianData.status === 'fulfilled') {
      try {
        stateIndicators = getAllStateIndicators();
        stateCorrelationAnalysis = getComprehensiveStateCorrelationAnalysis(humanitarianData.value);
        vulnerabilityIndex = getVulnerabilityIndexWithRankings();
      } catch (error) {
        console.warn('Could not generate state analysis:', error.message);
      }
    }

    res.json({
      states: states.status === 'fulfilled' ? states.value : null,
      exchangeRates: exchangeRates.status === 'fulfilled' ? exchangeRates.value : null,
      humanitarian: humanitarianData.status === 'fulfilled' ? humanitarianData.value : null,
      stateIndicators: stateIndicators,
      correlation: stateCorrelationAnalysis,
      vulnerabilityIndex: vulnerabilityIndex,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
