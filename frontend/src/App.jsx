import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import api from './services/api'
import './App.css'

function App() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getDashboard()
      setDashboardData(data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading Humanitarian Intelligence Platform...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="App">
        <div className="error-screen">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-main">
            <h1>🇳🇬 Humanitarian Intelligence Platform (HIP) - Nigerian Edition</h1>
            <p className="subtitle">Data-Driven Crisis Response System</p>
          </div>
          {dashboardData?.timestamp && (
            <div className="header-meta">
              <span className="last-update">
                Last updated: {new Date(dashboardData.timestamp).toLocaleString()}
              </span>
              <button onClick={fetchDashboardData} className="refresh-header-btn" title="Refresh Data">
                🔄
              </button>
            </div>
          )}
        </div>
      </header>

      <Dashboard data={dashboardData} onRefresh={fetchDashboardData} />
    </div>
  )
}

export default App
