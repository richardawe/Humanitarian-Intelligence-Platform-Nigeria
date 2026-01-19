# Data Sources for State-Level Indicators

This document outlines available data sources for each indicator we need to analyze correlations with food insecurity and displacement.

## 1. Food Price Inflation by State ✅

### Source: National Bureau of Statistics (NBS)
- **Availability**: Monthly/Quarterly reports
- **Latest Data**: 2024-2025
- **Format**: Year-on-Year (YoY) and Month-on-Month (MoM) percentages
- **States Covered**: All 36 states + FCT

### Recent Data Examples (2025):
- **Highest**: Borno (47.4%), Benue (51.76%), Ekiti (34.05%), Kebbi (33.82%), Yobe (15.25%)
- **Lowest**: Bayelsa, Akwa Ibom, Adamawa

### API/Data Access:
- NBS publishes reports at: https://www.nigerianstat.gov.ng/
- May need web scraping or manual data entry
- Alternative: Use reported figures from news sources as baseline

### Implementation:
- Create a data structure with state-level food inflation rates
- Update quarterly/monthly when NBS releases new data
- Can start with latest available figures and simulate monthly updates

---

## 2. Poverty Levels by State ⚠️

### Source: Multidimensional Poverty Index (MPI) / World Bank / NBS
- **Availability**: Limited - mostly 2018-2019 data
- **Latest Data**: Some HDI data available for 2023
- **Format**: Poverty rate percentage, MPI score (0-1)

### Recent Data Examples:
- **Highest Poverty (MPI)**: Sokoto (0.409), Bayelsa (0.401), Jigawa (0.385), Kebbi (0.385), Gombe (0.380), Yobe (0.370)
- **Lowest Poverty**: Lagos (HDI 0.723), Ebonyi (0.710), Imo (0.690)

### API/Data Access:
- World Bank data: Available in datasets
- NBS: May need to contact or check reports
- HDI as proxy: More recent data available

### Implementation:
- Use MPI data where available (2018-2019 baseline)
- Use HDI as proxy for recent poverty levels
- Create vulnerability index combining poverty + HDI

---

## 3. Conflict Intensity by State ✅

### Source: ACLED (Armed Conflict Location & Event Data Project)
- **Availability**: Regular updates
- **Latest Data**: 2024-2025
- **Format**: Number of incidents, fatalities, event types

### Recent Data Examples (2023-2024):
- **Highest Conflict**: Borno (877,299 IDPs in 2023), Benue (500,182 IDPs), Zamfara (848 deaths), Kaduna (550 deaths), Plateau, Taraba
- **Conflict Types**: Banditry, herder-farmer conflicts, insurgency

### API/Data Access:
- ACLED API: Available at https://acleddata.com/ (requires registration)
- News reports and research papers provide aggregated data
- Can use reported incidents/fatalities as proxy

### Implementation:
- Create conflict intensity score (0-100) based on:
  - Number of incidents per month
  - Fatalities
  - IDP counts
  - Conflict type severity weighting

---

## 4. Import Dependence ⚠️

### Source: National trade data / Research reports
- **Availability**: National level good, state level limited
- **Latest Data**: 2023-2025
- **Format**: Agricultural import share, trade balance

### Recent Data Examples:
- **National**: Agricultural imports dropped from 83.9% (2017) to 42.9% (H1 2025)
- **State Level**: Not readily available - need to estimate based on:
  - Agricultural productivity by state
  - Urban vs rural consumption patterns
  - Distance from ports/markets

### API/Data Access:
- Trade.gov reports
- National Bureau of Statistics trade data
- Research estimates

### Implementation:
- Create estimated import dependence index based on:
  - Agricultural production capacity by state
  - Urban population (higher urban = higher import dependence)
  - Distance from Lagos port (main import hub)
  - Local production of key staples

---

## 5. Infrastructure Quality ⚠️

### Source: HDI (Human Development Index) / Various reports
- **Availability**: HDI data available, specific infrastructure metrics limited
- **Latest Data**: HDI 2023 available
- **Format**: HDI score (0-1), composite of education, health, income

### Recent Data Examples (HDI 2023):
- **Highest**: Lagos (0.723), Ebonyi (0.710), Imo (0.690), FCT, Anambra, Enugu
- **Lowest**: Kebbi (~0.379), Zamfara, Jigawa, Bauchi, Sokoto

### Components:
- Education index
- Health index (life expectancy)
- Income index (GNI per capita)

### API/Data Access:
- UNDP HDI reports
- Wikipedia aggregations
- State government reports (inconsistent)

### Implementation:
- Use HDI as primary proxy
- Create infrastructure index combining:
  - HDI components
  - Road network density (if available)
  - Electricity access estimates
  - Market accessibility (urban population as proxy)

---

## Implementation Priority

### Phase 1 (Immediate - Real Data Available):
1. ✅ **Conflict Intensity** - Use reported incidents/IDPs by state
2. ✅ **Food Price Inflation** - Use latest NBS reported figures
3. ✅ **Poverty Levels (HDI Proxy)** - Use HDI 2023 data

### Phase 2 (Estimated/Modeled):
4. ⚠️ **Import Dependence** - Estimate based on agricultural production, urban population, distance from ports
5. ⚠️ **Infrastructure Quality** - Use HDI as proxy, potentially enhance with additional indicators

---

## Data Structure Plan

For each state, we'll store:

```javascript
{
  state: "Borno",
  foodInflation: {
    current: 47.4, // YoY %
    source: "NBS",
    lastUpdate: "2025-06"
  },
  poverty: {
    mpi: 0.370, // or null if not available
    hdi: 0.411, // HDI as proxy
    source: "MPI/HDI",
    year: 2023
  },
  conflict: {
    intensity: 95, // 0-100 score
    idps: 877299, // Total IDPs
    incidents: 71, // Monthly incidents (example)
    fatalities: 481, // Monthly fatalities (example)
    source: "ACLED/Reports",
    lastUpdate: "2024"
  },
  importDependence: {
    score: 0.75, // 0-1 (estimated)
    factors: {
      agriculturalProduction: "low",
      urbanPopulation: 0.25,
      distanceFromPort: "far"
    },
    source: "estimated"
  },
  infrastructure: {
    hdi: 0.411,
    hdiRank: 36, // Out of 37 states
    components: {
      education: 0.3,
      health: 0.5,
      income: 0.4
    },
    source: "UNDP HDI 2023"
  }
}
```

---

## Next Steps

1. Create data fetcher modules for each indicator
2. Build a composite vulnerability index combining all factors
3. Use these state-level variables to analyze correlations with food insecurity and displacement
4. Update data periodically as new reports are released
