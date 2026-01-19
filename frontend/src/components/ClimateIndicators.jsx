import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import InfoTooltip from './InfoTooltip'
import ExpandableCard from './ExpandableCard'
import api from '../services/api'
import './ClimateIndicators.css'

function ClimateIndicators({ selectedState }) {
  const [climateData, setClimateData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClimateData()
  }, [selectedState])

  const fetchClimateData = async () => {
    try {
      setLoading(true)
      const data = selectedState
        ? await api.getClimateIndicators(selectedState)
        : await api.getClimateIndicators()

      setClimateData(data)
    } catch (error) {
      console.error('Error fetching climate indicators:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="climate-loading">Loading climate indicators...</div>
  }

  if (!climateData) {
    return null
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'very_high': return '#d32f2f'
      case 'high': return '#f57c00'
      case 'medium': return '#fbc02d'
      case 'low': return '#388e3c'
      case 'very_low': return '#7b1fa2'
      default: return '#999'
    }
  }

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'very_high': return 'Very High'
      case 'high': return 'High'
      case 'medium': return 'Medium'
      case 'low': return 'Low'
      case 'very_low': return 'Very Low'
      default: return 'Unknown'
    }
  }

  // If single state selected
  if (selectedState && climateData) {
    const stateData = climateData
    const flooding = stateData.flooding || {}
    const climateShocks = stateData.climateShocks || {}

    return (
      <div className="climate-indicators">
        <div className="climate-header">
          <h2>
            🌦️ Climate Indicators: {selectedState}
            <InfoTooltip
              title="Climate Indicators"
              definition="Climate-related risks and impacts affecting humanitarian crises, including flooding risk, affected population, and climate shocks."
              content="Source: NEMA (National Emergency Management Agency), UNOCHA Climate Risk Assessments (2024-2025)"
            />
          </h2>
          <p className="card-subtitle">Flooding and climate shock data for {selectedState}</p>
        </div>

        <div className="climate-grid">
          {/* Flooding Risk Card */}
          <div className="climate-card flooding-card">
            <div className="climate-card-header">
              <h3>💧 Flooding Risk</h3>
              <InfoTooltip
                title="Flooding Risk"
                definition="Assessment of flood risk level based on historical patterns, geography, and recent flooding events (2024-2025)."
                content="Based on NEMA reports and geographic factors. 3-5 million people affected by flooding across Nigeria in 2024-2025."
              />
            </div>
            <div className="climate-card-content">
              <div className="risk-indicator" style={{ color: getRiskColor(flooding.risk) }}>
                <span className="risk-value">{getRiskLabel(flooding.risk || 'unknown')}</span>
                <span className="risk-label">Risk Level</span>
              </div>
              <div className="climate-stat">
                <span className="stat-value">{flooding.affected?.toLocaleString() || 0}</span>
                <span className="stat-label">People Affected (2024-2025)</span>
              </div>
              {flooding.severity && (
                <div className="climate-stat">
                  <span className="stat-value">{flooding.severity.toFixed(1)}</span>
                  <span className="stat-label">Severity Index (0-10)</span>
                </div>
              )}
            </div>
          </div>

          {/* Climate Shocks Card */}
          <div className="climate-card shocks-card">
            <div className="climate-card-header">
              <h3>⚡ Climate Shocks</h3>
              <InfoTooltip
                title="Climate Shocks"
                definition="Climate-related hazards including droughts, extreme heat, rainfall variability, and other weather extremes affecting the state."
                content="Based on NEMA climate assessments and historical patterns. Scores indicate frequency and intensity of climate shocks."
              />
            </div>
            <div className="climate-card-content">
              {climateShocks.shocks && climateShocks.shocks.length > 0 ? (
                <>
                  <div className="shocks-list">
                    {climateShocks.shocks.map((shock, idx) => (
                      <span key={idx} className="shock-badge">
                        {shock}
                      </span>
                    ))}
                  </div>
                  {climateShocks.score !== undefined && (
                    <div className="climate-stat">
                      <span className="stat-value">{climateShocks.score}</span>
                      <span className="stat-label">Climate Shocks Score (0-100)</span>
                    </div>
                  )}
                  {climateShocks.primaryShock && (
                    <div className="climate-stat">
                      <span className="stat-value">{climateShocks.primaryShock}</span>
                      <span className="stat-label">Primary Climate Risk</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-data">No climate shock data available</div>
              )}
            </div>
          </div>
        </div>

        {flooding.source && (
          <p className="data-citation">
            <small>
              <strong>Source:</strong> {flooding.source === 'nema' ? 'NEMA' : flooding.source === 'unocha' ? 'UNOCHA' : flooding.source}
            </small>
          </p>
        )}
      </div>
    )
  }

  // All states view
  if (climateData && typeof climateData === 'object' && !Array.isArray(climateData)) {
    const states = Object.keys(climateData)
    
    // Prepare data for charts
    const floodingChartData = states
      .map(state => {
        const data = climateData[state]
        const flooding = data?.flooding || {}
        return {
          state: state.length > 12 ? state.substring(0, 12) + '...' : state,
          fullState: state,
          affected: flooding.affected || 0,
          severity: flooding.severity || 0,
          risk: flooding.risk || 'unknown'
        }
      })
      .sort((a, b) => b.affected - a.affected)
      .slice(0, 15)

    const riskDistribution = states.reduce((acc, state) => {
      const risk = climateData[state]?.flooding?.risk || 'unknown'
      acc[risk] = (acc[risk] || 0) + 1
      return acc
    }, {})

    const riskPieData = Object.entries(riskDistribution).map(([risk, count]) => ({
      name: getRiskLabel(risk),
      value: count,
      color: getRiskColor(risk)
    }))

    const totalAffected = states.reduce((sum, state) => {
      return sum + (climateData[state]?.flooding?.affected || 0)
    }, 0)

    const topAffectedStates = states
      .map(state => ({
        state,
        affected: climateData[state]?.flooding?.affected || 0,
        risk: climateData[state]?.flooding?.risk || 'unknown',
        severity: climateData[state]?.flooding?.severity || 0
      }))
      .sort((a, b) => b.affected - a.affected)
      .slice(0, 10)

    return (
      <div className="climate-indicators">
        <div className="climate-header">
          <h2>
            🌦️ Climate Indicators
            <InfoTooltip
              title="Climate Indicators"
              definition="Climate-related risks and impacts affecting humanitarian crises across Nigeria, including flooding risk and climate shocks. Total 3-5 million people affected by flooding in 2024-2025."
              content="Source: NEMA (National Emergency Management Agency), UNOCHA Climate Risk Assessments (2024-2025). Data reflects flooding and climate shock patterns affecting Nigerian states."
            />
          </h2>
          <p className="card-subtitle">Flooding risk and climate shocks across all Nigerian states</p>
        </div>

        {/* Summary Cards */}
        <div className="climate-summary">
          <div className="summary-card">
            <div className="summary-icon">💧</div>
            <div className="summary-content">
              <div className="summary-value">{totalAffected.toLocaleString()}</div>
              <div className="summary-label">Total Affected by Flooding (2024-2025)</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🚨</div>
            <div className="summary-content">
              <div className="summary-value">{riskDistribution['very_high'] || 0}</div>
              <div className="summary-label">States with Very High Flood Risk</div>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⚡</div>
            <div className="summary-content">
              <div className="summary-value">{states.filter(s => climateData[s]?.climateShocks?.shocks?.length > 0).length}</div>
              <div className="summary-label">States with Climate Shocks</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="climate-charts">
          {/* Top Flood-Affected States */}
          <div className="chart-container">
            <h3>
              Top 15 States by Flood-Affected Population
              <InfoTooltip
                title="Flood-Affected Population"
                definition="Number of people affected by flooding in each state based on 2024-2025 NEMA reports."
                content="Based on NEMA flooding assessments and emergency response data. Affected includes displaced, evacuated, or otherwise impacted by flooding."
              />
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={floodingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="state" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis 
                  label={{ value: 'People Affected', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === 'affected') {
                      return [`${value.toLocaleString()} people`, 'Affected']
                    }
                    return [value, name]
                  }}
                  labelFormatter={(label) => {
                    const data = floodingChartData.find(d => d.state === label)
                    return data?.fullState || label
                  }}
                />
                <Legend />
                <Bar dataKey="affected" fill="#006400" name="People Affected">
                  {floodingChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Flood Risk Distribution */}
          <div className="chart-container pie-chart">
            <h3>
              Flood Risk Distribution
              <InfoTooltip
                title="Flood Risk Distribution"
                definition="Number of states in each flood risk category."
                content="Risk levels are assessed based on geography, historical patterns, and recent flooding events (2024-2025)."
              />
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Affected States Table */}
        <ExpandableCard
          title="🔝 Top 10 Most Flood-Affected States"
          defaultExpanded={false}
        >
          <div className="flooded-states-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>State</th>
                  <th>People Affected</th>
                  <th>Risk Level</th>
                  <th>Severity Index</th>
                </tr>
              </thead>
              <tbody>
                {topAffectedStates.map((item, idx) => (
                  <tr key={item.state}>
                    <td>{idx + 1}</td>
                    <td className="state-name">{item.state}</td>
                    <td>{item.affected.toLocaleString()}</td>
                    <td>
                      <span 
                        className="risk-badge"
                        style={{ backgroundColor: getRiskColor(item.risk) }}
                      >
                        {getRiskLabel(item.risk)}
                      </span>
                    </td>
                    <td>{item.severity.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ExpandableCard>

        <p className="data-citation">
          <small>
            <strong>Sources:</strong> NEMA (National Emergency Management Agency) Flood Reports 2024-2025, UNOCHA Climate Risk Assessments. 
            Total flooding affected population: 3-5 million across Nigeria (2024-2025). 
            <a href="https://nema.gov.ng/" target="_blank" rel="noopener noreferrer">NEMA Website</a>
          </small>
        </p>
      </div>
    )
  }

  return <div className="climate-empty">No climate data available</div>
}

export default ClimateIndicators
