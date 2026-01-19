import { useMemo } from 'react'
import './DashboardCounter.css'

function DashboardCounter({ states, humanitarianData, vulnerabilityIndex }) {
  const metrics = useMemo(() => {
    if (!states || !humanitarianData || !vulnerabilityIndex) {
      return null
    }

    // 1. Total People in Need
    const totalPeopleInNeed = states.reduce((sum, state) => {
      const humanitarian = humanitarianData.find(h => h.state === state.name)
      if (humanitarian && state.population) {
        return sum + Math.round((state.population * humanitarian.foodInsecurity) / 100)
      }
      return sum
    }, 0)

    // 2. Total IDPs
    const totalIDPs = humanitarianData.reduce((sum, h) => sum + (h.displacement || 0), 0)

    // 3. States in Crisis
    const statesInCrisis = vulnerabilityIndex?.rankings?.filter(
      state => state.category === 'critical' || state.category === 'very_high'
    ).length || 0

    // 4. Conflict-Affected Population
    const conflictAffectedPopulation = states.reduce((sum, state) => {
      const vulnerability = vulnerabilityIndex?.scores?.[state.name]
      const conflictScore = vulnerability?.components?.conflict?.normalizedScore || 0
      if (conflictScore >= 60 && state.population) {
        return sum + state.population
      }
      return sum
    }, 0)

    // 5. High Priority States
    const highPriorityStates = vulnerabilityIndex?.rankings?.filter(
      state => state.score >= 75
    ).length || 0

    return {
      totalPeopleInNeed,
      totalIDPs,
      statesInCrisis,
      conflictAffectedPopulation,
      highPriorityStates
    }
  }, [states, humanitarianData, vulnerabilityIndex])

  if (!metrics) {
    return null
  }

  const counters = [
    {
      label: 'People in Need',
      value: metrics.totalPeopleInNeed,
      format: 'number',
      icon: '👥',
      color: '#ef4444',
      description: 'People requiring humanitarian assistance'
    },
    {
      label: 'Internally Displaced',
      value: metrics.totalIDPs,
      format: 'number',
      icon: '🏠',
      color: '#f59e0b',
      description: 'People forced from their homes'
    },
    {
      label: 'States in Crisis',
      value: metrics.statesInCrisis,
      format: 'number',
      icon: '🚨',
      color: '#dc2626',
      description: 'States requiring urgent aid'
    },
    {
      label: 'Conflict Affected',
      value: metrics.conflictAffectedPopulation,
      format: 'number',
      icon: '⚔️',
      color: '#991b1b',
      description: 'People in conflict-affected areas'
    },
    {
      label: 'High Priority',
      value: metrics.highPriorityStates,
      format: 'number',
      icon: '⚡',
      color: '#b91c1c',
      description: 'States with critical priority scores'
    }
  ]

  return (
    <div className="dashboard-counter">
      <div className="counter-header">
        <h2>📊 Crisis Overview</h2>
        <p className="counter-subtitle">Real-time humanitarian metrics</p>
      </div>
      <div className="counter-grid">
        {counters.map((counter, index) => (
          <div key={index} className="counter-item">
            <div className="counter-icon" style={{ color: counter.color }}>
              {counter.icon}
            </div>
            <div className="counter-content">
              <div className="counter-label">{counter.label}</div>
              <div className="counter-value" style={{ color: counter.color }}>
                {counter.format === 'number' 
                  ? counter.value.toLocaleString() 
                  : counter.value}
              </div>
              <div className="counter-description">{counter.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardCounter
