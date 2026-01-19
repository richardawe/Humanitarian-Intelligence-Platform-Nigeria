# Local Testing Checklist

## Server Status
✅ Dev server running at: http://localhost:3000

## Features to Test

### 1. Basic Functionality
- [ ] Page loads without errors
- [ ] Header displays correctly
- [ ] All tabs are visible and clickable
- [ ] State selector dropdown works
- [ ] Map displays and is interactive

### 2. Overview Tab
- [ ] Dashboard counter displays 5 metrics
- [ ] Map shows all states with correct colors
- [ ] Vulnerability distribution chart displays
- [ ] Top 10 vulnerable states expandable card works
- [ ] Stats cards at bottom display correctly

### 3. Vulnerability Tab
- [ ] Vulnerability index loads for all states
- [ ] Single state view works when state selected
- [ ] Charts display correctly (bar chart, radar chart)
- [ ] Component breakdown shows all 5 factors

### 4. Correlations Tab ⭐ NEW
- [ ] Correlation analysis loads
- [ ] **Food Inflation ↔ Displacement** highlight card displays
- [ ] **Conflict ↔ Displacement** highlight card displays
- [ ] Correlation coefficients show correctly
- [ ] Bar chart displays correlation data
- [ ] Top factors cards display
- [ ] Insights section shows
- [ ] Source citations and links work

### 5. Data Table Tab ⭐ ENHANCED
- [ ] Table displays all states
- [ ] Filtering by state works
- [ ] **CSV Export button works** ⭐ NEW
- [ ] **PDF Export button works** ⭐ NEW
- [ ] InfoTooltips on headers work
- [ ] Source citations in footer display
- [ ] Data notes explain methodology

### 6. Sources Tab ⭐ NEW
- [ ] Data Transparency component loads
- [ ] Data Sources section expands and shows all sources
- [ ] **Data Discrepancies section explains 62M vs 6M** ⭐ NEW
- [ ] Update log displays
- [ ] Source links are clickable
- [ ] Citations are properly formatted

### 7. Chat with Data Tab
- [ ] Chat interface loads
- [ ] Welcome message displays
- [ ] Can type and send messages
- [ ] AI responses appear (if API key configured)
- [ ] Markdown formatting works (bold, lists, headers)
- [ ] Error handling works if API key missing

### 8. What Can I Do? Tab
- [ ] Help ideas chat loads
- [ ] Welcome message displays
- [ ] Can ask for help suggestions
- [ ] AI responses formatted correctly
- [ ] Markdown formatting works

### 9. Mobile Responsiveness ⭐ ENHANCED
- [ ] Test on mobile viewport (375px width)
- [ ] Table scrolls horizontally on mobile
- [ ] Export buttons stack properly
- [ ] Correlation cards stack on mobile
- [ ] All tooltips accessible on mobile
- [ ] Tabs scroll horizontally if needed

### 10. Export Functionality ⭐ NEW
- [ ] CSV export downloads file
- [ ] CSV contains correct data
- [ ] PDF export opens print dialog
- [ ] Export filenames include date/state

### 11. Climate Indicators ⭐ NEW
- [ ] Climate data available in state indicators
- [ ] Flooding data accessible
- [ ] Climate shocks scores available

### 12. Citations & Sources ⭐ NEW
- [ ] InfoTooltips show on hover/click
- [ ] Source links work
- [ ] Citations display correctly
- [ ] Data transparency explains discrepancies

## Known Issues to Check

1. **API Key**: Chat features require `VITE_OPENROUTER_API_KEY` in `.env` file
2. **Climate Indicators**: May need to be loaded separately (check console)
3. **Export PDF**: Uses browser print dialog (may vary by browser)

## Browser Console Checks

Open browser DevTools (F12) and check:
- [ ] No red errors in console
- [ ] No failed network requests (except expected API calls)
- [ ] Warnings are acceptable (not critical)

## Performance Checks

- [ ] Page loads in < 3 seconds
- [ ] Charts render smoothly
- [ ] No lag when switching tabs
- [ ] Map loads and renders correctly

## Test URLs

- Main: http://localhost:3000
- Direct to tab: http://localhost:3000/#overview (if using hash routing)

## Quick Test Commands

```bash
# Check if server is running
curl http://localhost:3000

# Check for TypeScript/ESLint errors
cd frontend && npm run build

# Check console output
# Open browser DevTools (F12) → Console tab
```

## Common Issues & Fixes

### Blank Screen
- Check browser console for errors
- Verify all imports are correct
- Check if API key is needed for chat features

### Export Not Working
- Check browser console for errors
- Verify table ref is set correctly
- Try different browser (some browsers block downloads)

### Chat Not Responding
- Check if `VITE_OPENROUTER_API_KEY` is set in `.env`
- Check browser console for API errors
- Verify OpenRouter API is accessible

### Climate Data Missing
- Check console for import errors
- Verify `climateIndicators.js` is in services folder
- May need to refresh page
