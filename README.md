# 🇳🇬 Humanitarian Intelligence Platform (HIP) - Nigerian Edition

**Data-Driven Crisis Response System**

A real-time humanitarian intelligence platform for Nigeria, combining state-level vulnerability indicators with humanitarian data to optimize aid allocation and crisis response decision-making.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install all dependencies (root, backend, and frontend):
```bash
npm run install-all
```

Or install separately:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

From the root directory, run both backend and frontend:
```bash
npm run dev
```

Or run separately:

**Backend** (port 3001):
```bash
cd backend
npm run dev
```

**Frontend** (port 3000):
```bash
cd frontend
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Sources

For detailed information about all data sources and update frequencies, see [DATA_SOURCES_AND_UPDATES.md](./DATA_SOURCES_AND_UPDATES.md)

### Summary:
- **Exchange Rates**: `open.er-api.com` - Updates hourly, cached for 1 hour
- **States & Population**: National Population Commission (2006 census, 2024 estimates) - Static data
- **Humanitarian Indicators**: UNOCHA/WFP/UNHCR reports (2024) - Updated monthly/quarterly
- **Food Inflation**: NBS (National Bureau of Statistics) - Updated monthly/quarterly
- **Poverty Levels**: HDI (2023) / MPI (2018-2019) - Updated annually
- **Conflict Intensity**: ACLED/UNOCHA - Updated weekly/monthly
- **Infrastructure Quality**: HDI (UNDP 2023) - Updated annually

**Current Cache Duration**: 1 hour for all cached endpoints

## 🎯 Features

- ✅ Interactive map showing Nigerian states with risk indicators
- ✅ Real-time humanitarian indicators (food insecurity, displacement)
- ✅ State filtering and detailed state views
- ✅ Vulnerability index calculations
- ✅ State-level correlation analysis
- ✅ Crisis overview dashboard with key metrics
- ✅ **RAG-powered chat with data** (Ask questions about the data)
- ✅ **AI-powered help suggestions** (Get ideas on how to help with the crisis)
- ✅ Statistics dashboard
- ✅ Real-time data refresh

## 💬 AI Chat Features

### Chat with Data (RAG System)
- Ask questions about humanitarian data
- Query specific states, indicators, or trends
- Get AI-powered insights based on the actual data

### What Can I Do?
- Get personalized suggestions on how to help
- Learn about donation opportunities
- Find volunteer organizations
- Get advocacy and action ideas

**AI Model**: Meta Llama 3.3 70B (via OpenRouter)

## 🔧 API Configuration

### OpenRouter API Key Setup

1. **Get API Key**:
   - Sign up at https://openrouter.ai/
   - Get your API key from dashboard

2. **For Local Development**:
   - Create `.env` file in `frontend/` directory
   - Add: `VITE_OPENROUTER_API_KEY=your_key_here`

3. **For GitHub Pages Deployment**:
   - Go to repository Settings → Secrets → Actions
   - Add secret: `OPENROUTER_API_KEY` with your API key
   - The GitHub Actions workflow will inject it during build

**Note**: The API key will be visible in the built JavaScript. Consider:
- Using rate limits on OpenRouter
- Using a proxy server (alternative approach)
- Or accepting the trade-off for free deployment

## 📁 Project Structure

```
naija_aid/
├── backend/           # Node.js/Express API server (optional, not needed for GitHub Pages)
│   ├── api/          # API integrations
│   └── server.js     # Main server file
├── frontend/         # React frontend application
│   └── src/
│       ├── services/     # Client-side API replacements
│       │   ├── api.js
│       │   ├── dataFetcher.js
│       │   ├── rag.js          # RAG system for data queries
│       │   └── openrouter.js   # OpenRouter API client
│       ├── components/  # React components
│       │   ├── DataChat.jsx    # RAG chat component
│       │   ├── HelpIdeas.jsx   # Help suggestions chat
│       │   └── ...
│       └── App.jsx      # Main app component
└── README.md        # This file
```

## 🌐 Deployment

### GitHub Pages (Recommended)

The application is configured for GitHub Pages deployment:

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: **GitHub Actions**

2. **Set API Key Secret**:
   - Go to Settings → Secrets → Actions
   - Add secret: `OPENROUTER_API_KEY`

3. **Push to GitHub**:
   ```bash
   git push origin main
   ```

4. **Automatic Deployment**:
   - GitHub Actions will build and deploy automatically
   - Your app will be live at: `https://<username>.github.io/<repository-name>/`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Tech Stack

- **Frontend**: React, Vite
- **Maps**: Leaflet.js, React-Leaflet
- **Charts**: Recharts
- **AI Chat**: OpenRouter API (Meta Llama 3.3 70B)
- **Styling**: CSS (no framework for MVP)

## 📝 Notes

- This is an MVP prototype for demonstration purposes
- Most data is static/manually coded (not from live APIs)
- Data is cached in localStorage (1 hour TTL)
- All processing runs client-side (no backend needed for GitHub Pages)

## 📄 License

MIT
