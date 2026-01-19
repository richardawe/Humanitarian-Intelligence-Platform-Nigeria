import { useState, useEffect } from 'react'
import MapView from './MapView'
import HumanitarianTable from './HumanitarianTable'
import StatsCards from './StatsCards'
import StateCorrelationAnalysis from './StateCorrelationAnalysis'
import VulnerabilityIndex from './VulnerabilityIndex'
import ExpandableCard from './ExpandableCard'
import InfoTooltip from './InfoTooltip'
import DashboardCounter from './DashboardCounter'
import DataChat from './DataChat'
import HelpIdeas from './HelpIdeas'
import api from '../services/api'
import './Dashboard.css'

const TABS = [
  { id: 'overview', label: '📊 Overview', icon: '📊' },
  { id: 'vulnerability', label: '🔴 Vulnerability', icon: '🔴' },
  { id: 'correlations', label: '📈 Correlations', icon: '📈' },
  { id: 'data', label: '📋 Data Table', icon: '📋' },
  { id: 'chat', label: '💬 Chat with Data', icon: '💬' },
  { id: 'help', label: '💡 What Can I Do?', icon: '💡' }
]

function Dashboard({ data, onRefresh }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedState, setSelectedState] = useState(null)
  const [humanitarianData, setHumanitarianData] = useState([])

  useEffect(() => {
    if (data?.humanitarian) {
      setHumanitarianData(data.humanitarian)
    } else {
      fetchHumanitarianData()
    }
  }, [data])

  const fetchHumanitarianData = async () => {
    try {
      const humanitarianData = await api.getHumanitarian()
      setHumanitarianData(humanitarianData)
    } catch (error) {
      console.error('Error fetching humanitarian data:', error)
    }
  }

  const states = data?.states || []
  const vulnerabilityIndex = data?.vulnerabilityIndex

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName)
    if (stateName && activeTab !== 'vulnerability') {
      setActiveTab('vulnerability')
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <DashboardCounter
              states={states}
              humanitarianData={humanitarianData}
              vulnerabilityIndex={vulnerabilityIndex}
            />
            
            <div className="dashboard-grid">
              <div className="dashboard-card map-card">
                <div className="card-header">
                  <h2>
                    📍 Nigeria Risk Map
                    <InfoTooltip
                      title="Risk Map Legend"
                      definition="The map shows Nigerian states color-coded by food insecurity risk level. Circle size indicates the number of displaced people. Click on any state marker to view detailed information and set it as the selected state for detailed analysis."
                      content="Risk levels: Green (<25%) = Low, Yellow (25-40%) = Medium, Orange (40-60%) = High, Red (>60%) = Critical"
                    />
                  </h2>
                  <p className="card-subtitle">Click on states to view details</p>
                </div>
                <MapView
                  states={states}
                  humanitarianData={humanitarianData}
                  selectedState={selectedState}
                  onStateSelect={handleStateSelect}
                />
              </div>

              <div className="dashboard-card chart-card">
                <div className="card-header">
                  <h2>
                    📈 Vulnerability Distribution
                    <InfoTooltip
                      title="Vulnerability Categories"
                      definition="States are categorized based on their composite vulnerability score (0-100), which combines food inflation, poverty, conflict, import dependence, and infrastructure factors."
                      data={vulnerabilityIndex?.summary ? {
                        'Critical (≥75)': vulnerabilityIndex.summary.critical,
                        'Very High (60-74)': vulnerabilityIndex.summary.veryHigh,
                        'High (45-59)': vulnerabilityIndex.summary.high,
                        'Moderate (30-44)': vulnerabilityIndex.summary.moderate,
                        'Low (15-29)': vulnerabilityIndex.summary.low,
                        'Very Low (<15)': vulnerabilityIndex.summary.veryLow,
                        'Total States': vulnerabilityIndex.summary.total
                      } : {}}
                    />
                  </h2>
                  <p className="card-subtitle">States by vulnerability category</p>
                </div>
                {vulnerabilityIndex && vulnerabilityIndex.summary && (
                  <div className="vulnerability-summary-chart">
                    <div className="summary-chart-grid">
                      <div className="summary-item critical">
                        <div className="summary-icon">🔴</div>
                        <div className="summary-value">{vulnerabilityIndex.summary.critical}</div>
                        <div className="summary-label">Critical</div>
                      </div>
                      <div className="summary-item very-high">
                        <div className="summary-icon">🟠</div>
                        <div className="summary-value">{vulnerabilityIndex.summary.veryHigh}</div>
                        <div className="summary-label">Very High</div>
                      </div>
                      <div className="summary-item high">
                        <div className="summary-icon">🟡</div>
                        <div className="summary-value">{vulnerabilityIndex.summary.high}</div>
                        <div className="summary-label">High</div>
                      </div>
                      <div className="summary-item moderate">
                        <div className="summary-icon">🟢</div>
                        <div className="summary-value">{vulnerabilityIndex.summary.moderate}</div>
                        <div className="summary-label">Moderate</div>
                      </div>
                      <div className="summary-item low">
                        <div className="summary-icon">🔵</div>
                        <div className="summary-value">{vulnerabilityIndex.summary.low}</div>
                        <div className="summary-label">Low</div>
                      </div>
                      <div className="summary-item very-low">
                        <div className="summary-icon">⚪</div>
                        <div className="summary-value">{vulnerabilityIndex.summary.veryLow}</div>
                        <div className="summary-label">Very Low</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {vulnerabilityIndex && vulnerabilityIndex.rankings && (
              <ExpandableCard
                title="⚡ Top 10 Most Vulnerable States"
                summary={`${vulnerabilityIndex.rankings.slice(0, 10).map(r => r.state).join(', ')}`}
                expandedContent={
                  <div className="quick-rankings-list">
                    {vulnerabilityIndex.rankings.slice(0, 10).map((item, idx) => (
                      <div 
                        key={idx} 
                        className="ranking-item"
                        onClick={() => handleStateSelect(item.state)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="ranking-number">#{item.rank}</div>
                        <div className="ranking-state">
                          {item.state}
                          <InfoTooltip
                            title={`${item.state} - Vulnerability Details`}
                            definition={`${item.state} has a vulnerability score of ${item.score}, placing it in the ${item.category.replace('_', ' ')} category. This score combines food inflation, poverty, conflict, import dependence, and infrastructure factors.`}
                            data={{
                              'Vulnerability Score': item.score,
                              'Category': item.category.replace('_', ' '),
                              'Rank': `#${item.rank} of ${vulnerabilityIndex.rankings.length}`,
                              'Risk Level': item.category === 'critical' ? 'Immediate aid needed' : 
                                           item.category === 'very_high' ? 'High priority aid' :
                                           item.category === 'high' ? 'Monitor closely' : 'Lower priority'
                            }}
                            position="right"
                          />
                        </div>
                        <div className="ranking-score">{item.score}</div>
                        <div className={`ranking-badge ${item.category}`}>
                          {item.category.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                }
              />
            )}

            <StatsCards
              states={states}
              humanitarianData={humanitarianData}
              selectedState={selectedState}
              vulnerabilityIndex={vulnerabilityIndex}
            />
          </>
        )

      case 'vulnerability':
        return (
          <div className="dashboard-card">
            <VulnerabilityIndex selectedState={selectedState} />
          </div>
        )

      case 'correlations':
        return (
          <div className="dashboard-card">
            <StateCorrelationAnalysis humanitarianData={humanitarianData} />
          </div>
        )

      case 'data':
        return (
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📋 Humanitarian Indicators</h2>
              <p className="card-subtitle">Detailed data by state</p>
            </div>
            <HumanitarianTable
              data={humanitarianData}
              selectedState={selectedState}
            />
          </div>
        )

      case 'chat':
        return (
          <div className="dashboard-card chat-card">
            <DataChat data={data} />
          </div>
        )

      case 'help':
        return (
          <div className="dashboard-card chat-card">
            <HelpIdeas data={data} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Top Controls */}
        <div className="dashboard-controls">
          <div className="state-selector-wrapper">
            <label htmlFor="state-select">Filter by State:</label>
            <select
              id="state-select"
              value={selectedState || ''}
              onChange={(e) => {
                const value = e.target.value || null
                setSelectedState(value)
                if (value && activeTab !== 'vulnerability') {
                  setActiveTab('vulnerability')
                }
              }}
              className="state-selector"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {selectedState && (
              <button
                onClick={() => setSelectedState(null)}
                className="clear-filter-btn"
                title="Clear filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label.replace(/^[^\s]+\s/, '')}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {selectedState && (
            <div className="selected-state-banner">
              <span>📍 Viewing: <strong>{selectedState}</strong></span>
              <button onClick={() => setSelectedState(null)} className="close-banner-btn">
                ✕ Clear
              </button>
            </div>
          )}
          
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
