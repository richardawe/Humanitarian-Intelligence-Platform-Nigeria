# MVP TODO: Nigeria Aid Optimizer - Quick Local Prototype

## Goal
Build a working prototype locally that demonstrates core concept: combining economic and humanitarian data for Nigeria.

## MVP Scope (What to Build)
- ✅ Simple dashboard showing humanitarian data by state
- ✅ Basic map visualization (states colored by risk/indicator)
- ✅ Time-series chart (exchange rate or key indicator over time)
- ✅ Filter by state/region
- ✅ Real data from available public APIs

## MVP Exclusions (Not Building Yet)
- ❌ Mobile app
- ❌ User authentication
- ❌ Alerts system
- ❌ ML predictions
- ❌ Offline mode

---

## Quick MVP Tasks

### Phase 1: Setup (Day 1)
- [ ] Initialize project structure (backend + frontend)
- [ ] Set up Node.js backend with Express
- [ ] Set up React frontend (Vite or CRA)
- [ ] Test basic local development setup

### Phase 2: Data APIs (Day 1-2)
- [ ] Connect to Nigeria Data API (states, LGAs, population)
- [ ] Connect to HDX Humanitarian API (if available) or use sample data
- [ ] Connect to exchange rate API (CBN or free API)
- [ ] Build simple data fetching functions

### Phase 3: Backend API (Day 2-3)
- [ ] Create endpoints to fetch and serve data
- [ ] Combine/transform data for frontend
- [ ] Add basic caching (in-memory or simple file)
- [ ] Handle errors gracefully

### Phase 4: Frontend Dashboard (Day 3-4)
- [ ] Build map component (Leaflet.js)
- [ ] Color-code Nigeria states by indicator
- [ ] Build simple time-series chart
- [ ] Add state filter dropdown
- [ ] Display key metrics/statistics

### Phase 5: Polish & Test (Day 4-5)
- [ ] Test with real data
- [ ] Fix bugs and improve UI
- [ ] Add loading states
- [ ] Document how to run locally

---

## Tech Stack (Minimal)
- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Maps**: Leaflet.js (free, no API key needed)
- **Charts**: Chart.js or Recharts
- **Database**: None (or SQLite if needed)
- **Hosting**: Local only (localhost)

---

## APIs to Try
1. **Nigeria Data API**: https://ngdata.udeh.ng/docs (states, LGAs, population)
2. **HDX/CKAN**: May need to use dataset downloads instead of live API
3. **Exchange Rates**: Use free APIs like exchangerate-api.com or fixer.io (free tier)
4. **Fallback**: Use sample/mock data if APIs are unavailable

---

## Success Criteria
- [ ] Can run locally with `npm start`
- [ ] Shows Nigeria map with state boundaries
- [ ] Displays at least one humanitarian indicator
- [ ] Shows exchange rate or economic indicator
- [ ] Can filter by state
- [ ] Data refreshes when requested

---

## Notes
- Keep it simple - we're validating the concept
- Use mock data if APIs don't work immediately
- Focus on making it work, not perfect UI
- Can iterate and improve after we have something running
