import InfoTooltip from './InfoTooltip'
import './StatsCards.css'

function StatsCards({ states, exchangeRates, humanitarianData, selectedState, vulnerabilityIndex }) {
  const filteredStates = selectedState
    ? states.filter((s) => s.name === selectedState)
    : states

  const totalPopulation = filteredStates.reduce((sum, s) => sum + (s.population || 0), 0)

  const filteredHumanitarian = selectedState
    ? humanitarianData.filter((h) => h.state === selectedState)
    : humanitarianData

  const avgFoodInsecurity = filteredHumanitarian.length > 0
    ? (filteredHumanitarian.reduce((sum, h) => sum + (h.foodInsecurity || 0), 0) / filteredHumanitarian.length).toFixed(1)
    : 0

  const totalDisplacement = filteredHumanitarian.reduce((sum, h) => sum + (h.displacement || 0), 0)

  // Calculate Population in Need (based on food insecurity %)
  const calculatePopulationInNeed = () => {
    if (selectedState) {
      const state = filteredStates[0]
      const humanitarian = filteredHumanitarian[0]
      if (state && humanitarian) {
        const populationInNeed = Math.round((state.population * humanitarian.foodInsecurity) / 100)
        return populationInNeed
      }
    }
    // For all states, sum up population in need
    return states.reduce((sum, state) => {
      const humanitarian = humanitarianData.find(h => h.state === state.name)
      if (humanitarian && state.population) {
        return sum + Math.round((state.population * humanitarian.foodInsecurity) / 100)
      }
      return sum
    }, 0)
  }

  const populationInNeed = calculatePopulationInNeed()

  // Calculate States in Crisis (critical or very high vulnerability)
  const statesInCrisis = vulnerabilityIndex?.rankings?.filter(
    state => state.category === 'critical' || state.category === 'very_high'
  ).length || 0

  // Get average vulnerability score
  const avgVulnerabilityScore = selectedState && vulnerabilityIndex?.scores?.[selectedState]
    ? vulnerabilityIndex.scores[selectedState].score
    : vulnerabilityIndex?.rankings?.length > 0
    ? Math.round(vulnerabilityIndex.rankings.reduce((sum, s) => sum + s.score, 0) / vulnerabilityIndex.rankings.length)
    : null

  // Get Priority Score for selected state (combines vulnerability + urgency)
  const getPriorityScore = () => {
    if (!selectedState || !vulnerabilityIndex?.scores?.[selectedState]) return null
    
    const vulnerability = vulnerabilityIndex.scores[selectedState]
    const humanitarian = filteredHumanitarian[0]
    
    if (!humanitarian) return vulnerability.score
    
    // Priority = Vulnerability (70%) + Urgency (30%)
    // Urgency based on conflict intensity and displacement
    const conflictUrgency = vulnerability.components?.conflict?.normalizedScore || 0
    const displacementUrgency = Math.min(100, (humanitarian.displacement / 100000) * 10)
    const urgencyScore = (conflictUrgency * 0.6) + (displacementUrgency * 0.4)
    
    const priorityScore = (vulnerability.score * 0.7) + (urgencyScore * 0.3)
    return Math.round(priorityScore)
  }

  const priorityScore = getPriorityScore()

  // Calculate trend indicators
  const getTrendIndicator = (value, threshold) => {
    if (value > threshold) return { icon: '🔴', color: '#ef4444' }
    if (value > threshold * 0.7) return { icon: '🟠', color: '#f59e0b' }
    if (value > threshold * 0.4) return { icon: '🟡', color: '#eab308' }
    return { icon: '🟢', color: '#10b981' }
  }

  const foodInsecurityTrend = getTrendIndicator(avgFoodInsecurity, 40)
  const displacementTrend = getTrendIndicator(totalDisplacement / 100000, 1)

  return (
    <div className="stats-cards">
      <div className="stat-card primary">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <div className="stat-label">
            Population
            <InfoTooltip
              title="Total Population"
              definition="The total number of people living in the selected state(s). Used as a baseline for calculating percentages of people affected by humanitarian crises."
              data={selectedState ? {
                'State': selectedState,
                'Population': totalPopulation.toLocaleString()
              } : {
                'States': `${filteredStates.length} states`,
                'Total Population': totalPopulation.toLocaleString()
              }}
            />
          </div>
          <div className="stat-value">{totalPopulation.toLocaleString()}</div>
          <div className="stat-subtitle">{selectedState || 'All States'}</div>
        </div>
      </div>

      {selectedState && priorityScore !== null ? (
        <div className="stat-card priority">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-label">
              Priority Score
              <InfoTooltip
                title="Priority Score (0-100)"
                definition="Combines vulnerability (70%) and urgency (30%) to determine aid allocation priority. Higher scores indicate states that need immediate humanitarian assistance. Urgency is calculated from conflict intensity and displacement levels."
                data={{
                  'Priority Score': priorityScore,
                  'Vulnerability Weight': '70%',
                  'Urgency Weight': '30%',
                  'Category': priorityScore >= 75 ? 'Critical' : priorityScore >= 60 ? 'Very High' : priorityScore >= 45 ? 'High' : 'Moderate'
                }}
              />
            </div>
            <div className="stat-value" style={{ 
              color: priorityScore >= 75 ? '#ef4444' : 
                     priorityScore >= 60 ? '#f59e0b' : 
                     priorityScore >= 45 ? '#eab308' : '#10b981' 
            }}>
              {priorityScore}
            </div>
            <div className="stat-subtitle">Urgency + Vulnerability</div>
          </div>
        </div>
      ) : (
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <div className="stat-label">
              States in Crisis
              <InfoTooltip
                title="States in Crisis"
                definition="Number of states with 'Critical' or 'Very High' vulnerability scores (≥60). These states require urgent humanitarian assistance due to combination of high food insecurity, conflict, poverty, and infrastructure challenges."
                data={{
                  'Critical/Very High': statesInCrisis,
                  'Total States': vulnerabilityIndex?.summary?.total || 37,
                  'Percentage': `${Math.round((statesInCrisis / (vulnerabilityIndex?.summary?.total || 37)) * 100)}%`
                }}
              />
            </div>
            <div className="stat-value" style={{ 
              color: statesInCrisis >= 10 ? '#ef4444' : 
                     statesInCrisis >= 5 ? '#f59e0b' : '#10b981' 
            }}>
              {statesInCrisis}
            </div>
            <div className="stat-subtitle">Critical/Very High</div>
          </div>
        </div>
      )}

      <div className="stat-card">
        <div className="stat-icon" style={{ color: foodInsecurityTrend.color }}>
          {foodInsecurityTrend.icon}
        </div>
        <div className="stat-content">
          <div className="stat-label">
            Food Insecurity
            <InfoTooltip
              title="Food Insecurity (%)"
              definition="Percentage of population unable to access adequate, safe, and nutritious food for normal growth and development. Includes people experiencing hunger, malnutrition, or food access challenges. Data sourced from UNOCHA, WFP, and NBS reports."
              data={selectedState ? {
                'State': selectedState,
                'Food Insecurity': `${avgFoodInsecurity}%`,
                'Population Affected': `${populationInNeed.toLocaleString()} people`,
                'Risk Level': avgFoodInsecurity >= 60 ? 'Critical' : avgFoodInsecurity >= 40 ? 'High' : avgFoodInsecurity >= 25 ? 'Medium' : 'Low'
              } : {
                'Average': `${avgFoodInsecurity}%`,
                'States': filteredHumanitarian.length,
                'Source': 'UNOCHA/WFP'
              }}
            />
          </div>
          <div className="stat-value" style={{ color: foodInsecurityTrend.color }}>
            {avgFoodInsecurity}%
          </div>
          <div className="stat-subtitle">Average affected</div>
        </div>
      </div>

      {selectedState ? (
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">
              Population in Need
              <InfoTooltip
                title="Population in Need"
                definition="Estimated number of people requiring humanitarian assistance due to food insecurity. Calculated as: State Population × Food Insecurity %. This metric helps determine the scale of aid resources needed (food, cash, nutrition programs)."
                data={{
                  'Total Population': totalPopulation.toLocaleString(),
                  'Food Insecurity': `${avgFoodInsecurity}%`,
                  'People in Need': populationInNeed.toLocaleString(),
                  'Calculation': `${totalPopulation.toLocaleString()} × ${avgFoodInsecurity}%`
                }}
              />
            </div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>
              {populationInNeed.toLocaleString()}
            </div>
            <div className="stat-subtitle">Food insecure people</div>
          </div>
        </div>
      ) : (
        <div className="stat-card">
          <div className="stat-icon" style={{ color: displacementTrend.color }}>
            {displacementTrend.icon}
          </div>
          <div className="stat-content">
            <div className="stat-label">
              Displaced People
              <InfoTooltip
                title="Internally Displaced Persons (IDPs)"
                definition="Number of people forced to flee their homes but remain within Nigeria's borders. IDPs are typically displaced due to conflict, violence, natural disasters, or human rights violations. Many require shelter, food, water, healthcare, and protection assistance."
                data={{
                  'Total IDPs': totalDisplacement.toLocaleString(),
                  'States Affected': new Set(filteredHumanitarian.filter(h => h.displacement > 0).map(h => h.state)).size,
                  'Source': 'UNOCHA/UNHCR',
                  'Note': 'Includes IDPs in camps and host communities'
                }}
              />
            </div>
            <div className="stat-value" style={{ color: displacementTrend.color }}>
              {totalDisplacement.toLocaleString()}
            </div>
            <div className="stat-subtitle">Total IDPs</div>
          </div>
        </div>
      )}

      {avgVulnerabilityScore !== null && (
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">
              Avg. Vulnerability
              <InfoTooltip
                title="Vulnerability Index (0-100)"
                definition="Composite score combining multiple factors: Food Inflation (25%), Poverty (20%), Conflict (25%), Import Dependence (15%), and Infrastructure Quality (15%, inverted). Higher scores indicate states more vulnerable to humanitarian crises and requiring more aid resources."
                data={{
                  'Score': avgVulnerabilityScore,
                  'Category': avgVulnerabilityScore >= 75 ? 'Critical' : avgVulnerabilityScore >= 60 ? 'Very High' : avgVulnerabilityScore >= 45 ? 'High' : avgVulnerabilityScore >= 30 ? 'Moderate' : 'Low',
                  'Scope': selectedState || 'All States'
                }}
              />
            </div>
            <div className="stat-value" style={{ 
              color: avgVulnerabilityScore >= 60 ? '#ef4444' : 
                     avgVulnerabilityScore >= 45 ? '#f59e0b' : '#10b981' 
            }}>
              {avgVulnerabilityScore}
            </div>
            <div className="stat-subtitle">{selectedState || 'All States'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsCards
