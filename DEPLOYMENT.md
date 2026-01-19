# Deployment Guide - GitHub Pages

This application is configured to deploy as a fully client-side static application to GitHub Pages.

## Architecture

The application runs **entirely in the browser** with no backend server required:
- ✅ All data fetching runs client-side
- ✅ All calculations run in the browser
- ✅ Data is cached in localStorage
- ✅ Only external API call is exchange rates (CORS-friendly)

## Prerequisites

1. GitHub repository
2. GitHub Pages enabled (Settings → Pages)
3. GitHub Actions enabled (Settings → Actions)

## Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Convert to client-side for GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: **GitHub Actions** (not "Deploy from a branch")
3. Save

### 3. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build the frontend application
- Deploy to GitHub Pages on every push to `main` branch
- Deploy URL: `https://<username>.github.io/<repository-name>/`

## Local Development

### Run Development Server

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

### Build for Production

```bash
cd frontend
npm run build
```

Output: `frontend/dist/` (ready to deploy)

### Preview Production Build

```bash
cd frontend
npm run preview
```

## Configuration

### Base Path

If deploying to a subdirectory (e.g., `/repository-name/`), update `vite.config.js`:

```js
base: process.env.NODE_ENV === 'production' ? '/repository-name/' : '/',
```

If deploying to root domain, keep `base: '/'`.

### Custom Domain

1. Create `CNAME` file in `frontend/public/` with your domain:
   ```
   example.com
   ```
2. Update DNS records as per GitHub Pages instructions
3. Push to repository

## Features

### Client-Side Features

- ✅ **Data Fetching**: All API endpoints replaced with client-side functions
- ✅ **Caching**: localStorage-based caching (1 hour TTL)
- ✅ **Real-time Exchange Rates**: Fetched directly from `open.er-api.com`
- ✅ **Static Data**: States, humanitarian indicators, state-level data embedded
- ✅ **Calculations**: Vulnerability index, correlation analysis run in browser

### No Backend Required

- ❌ No Node.js server needed
- ❌ No Express.js endpoints
- ❌ No database
- ❌ No server-side processing
- ✅ 100% static files

## CORS Considerations

### Exchange Rate API

The exchange rate API (`open.er-api.com`) should support CORS. If you encounter CORS errors:

1. **Option 1**: Use a CORS proxy service
2. **Option 2**: Cache exchange rates and update manually
3. **Option 3**: Use a different CORS-friendly exchange rate API

Current implementation uses `open.er-api.com` which should work from browsers.

## Troubleshooting

### Build Fails

- Check Node.js version (requires 18+)
- Run `npm install` in frontend directory
- Check for missing dependencies

### Pages Not Loading

- Verify base path in `vite.config.js` matches repository name
- Check GitHub Pages settings (source should be "GitHub Actions")
- Verify workflow completed successfully

### API Calls Fail

- Check browser console for CORS errors
- Verify external APIs are accessible
- Check network tab for failed requests
- App will use cached data if API fails

### Data Not Updating

- Clear browser localStorage: `localStorage.clear()`
- Cache TTL is 1 hour - wait or clear cache
- Check if APIs are still accessible

## File Structure

```
frontend/
├── src/
│   ├── services/          # Client-side API replacements
│   │   ├── api.js         # Unified API service
│   │   ├── dataFetcher.js # Data fetching functions
│   │   ├── stateIndicators.js
│   │   ├── vulnerabilityIndex.js
│   │   └── stateCorrelationAnalysis.js
│   ├── components/        # React components
│   └── App.jsx           # Main app component
├── dist/                  # Production build (generated)
└── vite.config.js        # Vite configuration
```

## Notes

- The backend code in `backend/` is **no longer needed** for GitHub Pages deployment
- All backend logic has been moved to `frontend/src/services/`
- The application is fully self-contained in the frontend build
- Exchange rates are the only external API dependency

## Performance

- **Initial Load**: ~2-5 seconds (downloads all JavaScript)
- **Subsequent Loads**: Faster (cached)
- **API Calls**: Only exchange rates (cached for 1 hour)
- **Calculations**: Instant (runs in browser)
