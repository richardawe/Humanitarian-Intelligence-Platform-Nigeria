# Data Sources & Update Frequency

This document provides a comprehensive overview of all data sources used in the Humanitarian Intelligence Platform (HIP) - Nigerian Edition and how frequently they are updated.

## ⚠️ Important: Mock vs Real Data

### Data Classification

| Data Type | Status | Source Type | Notes |
|-----------|--------|-------------|-------|
| **Exchange Rates (Current)** | ✅ **LIVE API** | Real-time API | `open.er-api.com` - Updates hourly |
| **Exchange Rates (Historical Chart)** | ⚠️ **GENERATED** | Synthetic | Generated with ±2% variation from current rate |
| **Humanitarian Indicators** | ⚠️ **STATIC (Real Data)** | Manually coded | Based on real UNOCHA/WFP/UNHCR 2024 reports, but not from live API |
| **State Indicators** | ⚠️ **STATIC (Real Data)** | Manually coded | Based on real NBS/HDI/ACLED data, but manually entered |
| **States & Population** | ⚠️ **STATIC (Real Data)** | Manually coded | Based on real 2006 census + 2024 estimates |

### What This Means:

**✅ Real Data (Live API)**:
- Current exchange rates are fetched from a live API in real-time

**⚠️ Real Data (Static/Manually Coded)**:
- Data comes from real, authoritative sources (UNOCHA, NBS, HDI, ACLED)
- But it's manually encoded in the codebase, not fetched from live APIs
- This means it won't automatically update when new reports are published
- Requires manual code updates when new data is released

**⚠️ Generated/Synthetic Data**:
- Exchange rate historical chart generates fake historical data
- Used for visualization purposes only (not for analysis)

### Why Static Data?

For the MVP, data is manually coded because:
1. **HDX API**: Attempts to connect but falls back to static data (API integration incomplete)
2. **NBS/HDI/ACLED**: These sources don't always have easy-to-use APIs
3. **Development Speed**: Faster to start with real data manually encoded than wait for API integrations
4. **Reliability**: Ensures the platform works even if external APIs are down

### Production Roadmap:

- [ ] Connect to live HDX API for humanitarian data
- [ ] Integrate ACLED API for conflict data
- [ ] Set up automated NBS report parsing
- [ ] Add historical exchange rate API for real historical data
- [ ] Implement database storage for all data sources

---

## Current Implementation

### Cache Strategy
- **Cache TTL (Time To Live)**: 1 hour (60 minutes)
- **Cache Type**: In-memory cache (for MVP)
- **Cache Invalidation**: Automatic after TTL expires or on manual refresh

---

## Data Sources

### 1. **Exchange Rates** 💱

**Source**: 
- **Primary**: `open.er-api.com/v6` (ExchangeRate-API.com)
- **API Endpoint**: `https://open.er-api.com/v6/latest/NGN`
- **Provider**: Exchangerate-api.com
- **Authentication**: None required (free tier)

**Data Provided**:
- **Current Rate**: ✅ **LIVE API** - Real-time NGN to USD exchange rate
- **Historical Chart**: ⚠️ **GENERATED** - Last 7 days generated with ±2% variation

**Current Rate (Live)**:
- **Status**: ✅ Real-time API data
- **Update Frequency**: 
  - API Updates: Real-time (updated hourly by provider)
  - Cache: 1 hour (refreshes after cache expires)
  - Manual Refresh: Available via refresh button in UI
- **Data Freshness**: Typically updates every 1-6 hours by provider
- **Timestamp**: Included in API response for transparency

**Historical Chart (Generated)**:
- **Status**: ⚠️ Synthetic data
- **Implementation**: Generates last 7 days with random ±2% variations from current rate
- **Reason**: No historical API integrated yet
- **Location**: `frontend/src/components/ExchangeRateChart.jsx` lines 7-29
- **Note**: Comment in code says "In production, this would come from time-series data from API"
- **Future**: Will be replaced with real historical data API

---

### 2. **Nigeria States & Population** 📍

**Source**:
- **Primary**: National Population Commission Nigeria
- **Data Type**: Census data (2006 baseline) with 2024 population estimates
- **Coverage**: All 36 states + FCT (37 total states)

**⚠️ Current Implementation Status**:
- **Static Data**: Manually coded in `backend/api/dataFetcher.js` lines 13-54
- **Not from API**: Data is hardcoded, not fetched from Nigeria Data API
- **Based on**: Real official census data and estimates

**Data Provided**:
- State names and codes
- Population estimates (2024)
- Regional classification (North-East, North-West, etc.)
- State capitals

**Update Frequency**:
- **Static Data**: Updated manually when new census data is released
- **Last Official Census**: 2006
- **Current Estimates**: 2024 projections
- **Cache**: 1 hour (though data is static)
- **Manual Updates Required**: When new census or estimates are published

**When Updated**:
- When new official census data is published (typically every 10+ years)
- When major population estimates are revised
- Manual code updates when significant demographic changes are reported

---

### 3. **Humanitarian Indicators** 🚨

**Sources**:
- **Primary API**: HDX (Humanitarian Data Exchange) CKAN API
  - Endpoint: `https://data.humdata.org/api/3/action`
  - Organization: UNOCHA (UN Office for the Coordination of Humanitarian Affairs)
- **Data Providers**: UNOCHA, WFP (World Food Programme), UNHCR

**Data Provided**:
- Food insecurity percentages by state
- Internally Displaced Persons (IDPs) counts
- Health risk levels (low, medium, high, critical)
- Overall risk scores

**⚠️ Current Implementation Status**:
- **NOT using live API**: Code attempts to connect to HDX API but always falls back to static data
- **Static Data Source**: `generateHumanitarianIndicatorsFromRealData()` function
- **Data Basis**: Real UNOCHA/WFP/UNHCR reports from 2024, but manually encoded
- **Source Attribution**: 
  - Some states marked `source: 'unocha'` (from real reports)
  - Some states marked `source: 'estimated'` (estimated based on patterns)
- **Location**: `backend/api/dataFetcher.js` lines 149-199

**Update Frequency**:
- **Source Updates**: Varies by organization
  - UNOCHA/WFP: Monthly to quarterly reports
  - UNHCR: Monthly IDP updates
  - Crisis reports: As events occur
- **Current Updates**: Manual code updates required when new reports are published
- **Cache**: 1 hour (though data is static)

**Data Coverage**:
- North-East states: Higher crisis indicators due to ongoing conflict
- North-West states: Food security issues
- All 37 states covered with baseline indicators

**Future Enhancement**:
- Direct integration with HDX API to pull live datasets
- Real-time updates when new reports are published
- Automated data parsing from humanitarian organization reports
- Remove static data fallback once API integration is complete

---

### 4. **State-Level Indicators** 📊

#### 4a. Food Price Inflation

**Source**:
- **Primary**: National Bureau of Statistics (NBS)
- **Website**: https://www.nigerianstat.gov.ng/
- **Latest Data**: 2024-2025

**⚠️ Current Implementation Status**:
- **Static Data**: Manually coded in `backend/api/stateIndicators.js` lines 17-60
- **Not from API**: Data is hardcoded, not fetched from NBS API
- **Based on**: Real NBS reports (2024-2025), but manually entered

**Data Provided**:
- Year-on-Year (YoY) food inflation percentages by state
- Range: ~13% (FCT) to ~52% (Benue)

**Update Frequency**:
- **Source Updates**: Monthly/Quarterly NBS reports
- **Current Data**: Latest NBS reported figures (2024-2025)
- **Manual Updates Required**: When NBS releases new reports (code must be updated)
- **Cache**: Not cached separately (part of state indicators)

#### 4b. Poverty Levels

**Sources**:
- **Multidimensional Poverty Index (MPI)**: 2018-2019 data
- **HDI (Human Development Index)**: 2023 data from UNDP
- **World Bank**: Historical poverty data

**⚠️ Current Implementation Status**:
- **Static Data**: Manually coded in `backend/api/stateIndicators.js` lines 67-120
- **Not from API**: Data is hardcoded, not fetched from APIs
- **Based on**: Real MPI/HDI/World Bank data, but manually entered

**Data Provided**:
- Poverty rate percentages by state
- HDI scores (0-1) as proxy for recent poverty levels
- MPI scores where available

**Update Frequency**:
- **MPI**: Every 5-10 years (last: 2018-2019)
- **HDI**: Annually (latest: 2023)
- **World Bank**: Periodically
- **Manual Updates Required**: When new reports are published (code must be updated)

#### 4c. Conflict Intensity

**Sources**:
- **Primary**: ACLED (Armed Conflict Location & Event Data Project)
  - Website: https://acleddata.com/
  - API: Available (requires registration)
- **Alternative**: UNOCHA reports, news aggregations

**⚠️ Current Implementation Status**:
- **Static Data**: Manually coded in `backend/api/stateIndicators.js` (conflict functions)
- **Not from API**: Data is hardcoded, not fetched from ACLED API
- **Based on**: Real ACLED/UNOCHA reports (2023-2024), but manually entered

**Data Provided**:
- Conflict intensity scores (0-100) by state
- IDP counts (overlapping with humanitarian data)
- Incident counts and fatalities
- Conflict type classifications

**Update Frequency**:
- **ACLED**: Weekly/Monthly updates
- **UNOCHA Reports**: Monthly/Quarterly
- **Current Data**: 2023-2024 conflict data
- **Manual Updates Required**: When new ACLED data or reports are available (code must be updated)

#### 4d. Import Dependence

**Source**:
- **National Trade Data**: NBS trade reports
- **Research Estimates**: Based on agricultural production, urban population, distance from ports
- **Current Data**: 2023-2025 estimates

**⚠️ Current Implementation Status**:
- **Estimated Data**: Manually coded in `backend/api/stateIndicators.js` (import dependence functions)
- **Not Directly Measured**: This is modeled/estimated data, not from direct measurements
- **Based on**: Trade data, agricultural production patterns, urban population, distance from ports

**Data Provided**:
- Import dependence scores (0-1) by state
- Estimated based on:
  - Agricultural productivity
  - Urban vs rural consumption patterns
  - Distance from Lagos port
  - Local production of key staples

**Update Frequency**:
- **Trade Data**: Quarterly (NBS reports)
- **Estimates**: Updated when underlying factors change significantly
- **Manual Updates Required**: When new trade data or research is available (code must be updated)

#### 4e. Infrastructure Quality

**Source**:
- **HDI (Human Development Index)**: UNDP 2023 data
- **Components**: Education index, Health index (life expectancy), Income index (GNI per capita)

**⚠️ Current Implementation Status**:
- **Static Data**: Manually coded in `backend/api/stateIndicators.js` (infrastructure functions)
- **Not from API**: Data is hardcoded, not fetched from UNDP API
- **Based on**: Real UNDP HDI 2023 data, but manually entered

**Data Provided**:
- HDI scores (0-1) by state
- Infrastructure quality scores (derived from HDI)
- State rankings

**Update Frequency**:
- **HDI**: Annually (latest: 2023)
- **Manual Updates Required**: When UNDP publishes new HDI reports (code must be updated)

---

### 5. **Vulnerability Index** 🎯

**Source**: 
- **Calculated**: Composite score combining all state-level indicators
- **Components**:
  - Food Inflation (25% weight)
  - Poverty (20% weight)
  - Conflict (25% weight)
  - Import Dependence (15% weight)
  - Infrastructure Quality (15% weight, inverted)

**Update Frequency**:
- **Real-time**: Recalculated automatically when any component data updates
- **Cache**: Not separately cached (depends on underlying indicators)

---

## Update Frequency Summary

| Data Source | Update Frequency | Cache Duration | Manual Update Required? |
|------------|-----------------|----------------|------------------------|
| **Exchange Rates** | Real-time (hourly by provider) | 1 hour | No |
| **States & Population** | Static (census every 10+ years) | 1 hour | Only when new census |
| **Humanitarian Indicators** | Monthly/Quarterly (varies by org) | 1 hour | When new reports released |
| **Food Inflation** | Monthly/Quarterly (NBS) | N/A | When NBS releases data |
| **Poverty Levels** | Annually (HDI) / 5-10 years (MPI) | N/A | When new reports published |
| **Conflict Intensity** | Weekly/Monthly (ACLED) | N/A | When new data available |
| **Import Dependence** | Quarterly (trade data) | N/A | When new data available |
| **Infrastructure (HDI)** | Annually (UNDP) | N/A | When new HDI published |
| **Vulnerability Index** | Real-time (auto-calculated) | N/A | No |

---

## Data Freshness Indicators

The platform displays:
- **"Last updated"** timestamp in the header showing when data was last fetched
- **Source attribution** for each metric (visible in tooltips)
- **Cache status** (data is cached for 1 hour to reduce API calls)

---

## Future Enhancements

### Planned Improvements:

1. **Automated Data Ingestion**:
   - Scheduled jobs to fetch data automatically
   - Integration with ACLED API for conflict data
   - Direct HDX API integration for humanitarian data
   - NBS report parsing automation

2. **More Frequent Updates**:
   - Real-time updates for critical indicators (conflict, displacement)
   - Daily checks for new humanitarian reports
   - Automated alerts when new data is available

3. **Data Storage**:
   - Database storage for historical data (currently in-memory)
   - Time-series data for trend analysis
   - Data versioning for audit trails

4. **Multiple Data Providers**:
   - Backup data sources for resilience
   - Cross-validation between sources
   - Fallback mechanisms when primary sources fail

---

## Data Accuracy & Limitations

### Current Limitations:

1. **Static Population Data**: Based on 2006 census with estimates (not real-time, manually coded)
2. **Humanitarian Data**: Real data from 2024 reports but manually coded (not live API)
3. **State Indicators**: All manually coded (not from live APIs)
4. **Exchange Rate History**: Generated/synthetic (not real historical data)
5. **Update Delays**: Manual code updates required for most indicators when source data is published
6. **Import Dependence**: Estimated/modeled (not directly measured)

### Data Quality:

- ✅ **Exchange Rates (Current)**: High accuracy (real-time API)
- ⚠️ **Exchange Rates (Historical)**: Generated/synthetic (not real)
- ✅ **Population**: Official census data (dated but accurate for baseline, manually coded)
- ⚠️ **Humanitarian**: Real data from reports but manually coded (not live API)
- ⚠️ **Food Inflation**: Official NBS data but manually coded (requires manual updates)
- ⚠️ **Poverty/Conflict**: Real data but manually coded (requires manual updates)
- ⚠️ **Import Dependence**: Estimated/modeled (not directly measured)
- ⚠️ **Infrastructure**: Real HDI data but manually coded (requires manual updates)

### Mock/Generated Data Summary:

**Generated/Synthetic**:
- Exchange rate historical chart (last 7 days) - Generated with ±2% variation

**Real Data (Static/Manually Coded)**:
- Humanitarian indicators (from real UNOCHA/WFP/UNHCR reports)
- Food inflation (from real NBS reports)
- Poverty levels (from real HDI/MPI data)
- Conflict intensity (from real ACLED/UNOCHA reports)
- Infrastructure quality (from real HDI data)
- States & population (from real census data)

**Live API Data**:
- Current exchange rates only

---

## Recommendations for Production

1. **Set up automated data pipelines** to fetch updates regularly
2. **Implement database storage** for historical tracking
3. **Add data validation** and quality checks
4. **Create scheduled jobs** for data refresh
5. **Monitor data source APIs** for availability
6. **Implement fallback mechanisms** when sources are unavailable
7. **Add user notifications** when data is outdated beyond acceptable thresholds
