import { useEffect, useState } from 'react'
import './CorrelationAnalysis.css'

// Note: This component uses exchange rate correlation which is no longer used
// Keeping for potential future use but it won't be displayed
function CorrelationAnalysis({ exchangeRates, humanitarianData }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Exchange rate correlation removed - this component is deprecated
    // State-level correlation is now used instead
    setAnalysis(null)
  }, [exchangeRates, humanitarianData])

  if (loading) {
    return <div className="correlation-loading">Analyzing correlations...</div>
  }

  if (!analysis) {
    return null
  }

  const foodCorr = analysis.foodInsecurity?.correlation || {}
  const displacementCorr = analysis.displacement?.correlation || {}

  const getCorrelationColor = (coefficient) => {
    const abs = Math.abs(coefficient)
    if (abs >= 0.7) return '#d32f2f' // Strong - Red
    if (abs >= 0.4) return '#f57c00' // Moderate - Orange
    if (abs >= 0.2) return '#fbc02d' // Weak - Yellow
    return '#999' // Negligible - Gray
  }

  const getCorrelationIcon = (coefficient) => {
    if (coefficient > 0.4) return '📈'
    if (coefficient < -0.4) return '📉'
    return '➡️'
  }

  return (
    <div className="correlation-analysis">
      <h2>📊 Exchange Rate vs Humanitarian Indicators Correlation</h2>
      
      <div className="correlation-explanation">
        <h3>Understanding the Correlation</h3>
        <p>
          <strong>Hypothesis:</strong> When the Naira depreciates (NGN/USD increases), 
          import costs rise, leading to higher food prices and increased food insecurity. 
          Economic instability also contributes to displacement.
        </p>
        <p>
          <strong>Expected Relationship:</strong> Positive correlation - As exchange rate increases, 
          humanitarian indicators worsen.
        </p>
      </div>

      <div className="correlation-cards">
        <div className="correlation-card">
          <div className="correlation-header">
            <h3>Food Insecurity Correlation</h3>
            <span className="correlation-icon">{getCorrelationIcon(foodCorr.coefficient)}</span>
          </div>
          <div className="correlation-value" style={{ color: getCorrelationColor(foodCorr.coefficient) }}>
            r = {foodCorr.coefficient !== undefined ? foodCorr.coefficient.toFixed(3) : 'N/A'}
          </div>
          <div className="correlation-strength">
            <span className={`strength-badge ${foodCorr.strength}`}>
              {foodCorr.strength || 'N/A'}
            </span>
          </div>
          <div className="correlation-interpretation">
            {foodCorr.interpretation || 'No data'}
          </div>
          {analysis.foodInsecurity?.insights && (
            <div className="correlation-insights">
              <h4>Insights:</h4>
              <ul>
                {analysis.foodInsecurity.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.foodInsecurity?.impact && (
            <div className="correlation-impact">
              <h4>Estimated Impact:</h4>
              <p>
                For every <strong>₦{analysis.foodInsecurity.impact.rateChange} increase</strong> in exchange rate:
              </p>
              <ul>
                <li>Food insecurity increases by <strong>{analysis.foodInsecurity.impact.estimatedFoodInsecurityIncrease}%</strong></li>
                <li>Estimated additional displacement: <strong>{analysis.foodInsecurity.impact.estimatedDisplacementIncrease.toLocaleString()} people</strong></li>
                <li>Most affected states: {analysis.foodInsecurity.impact.affectedStates.slice(0, 3).join(', ')}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="correlation-card">
          <div className="correlation-header">
            <h3>Displacement Correlation</h3>
            <span className="correlation-icon">{getCorrelationIcon(displacementCorr.coefficient)}</span>
          </div>
          <div className="correlation-value" style={{ color: getCorrelationColor(displacementCorr.coefficient) }}>
            r = {displacementCorr.coefficient !== undefined ? displacementCorr.coefficient.toFixed(3) : 'N/A'}
          </div>
          <div className="correlation-strength">
            <span className={`strength-badge ${displacementCorr.strength}`}>
              {displacementCorr.strength || 'N/A'}
            </span>
          </div>
          <div className="correlation-interpretation">
            {displacementCorr.interpretation || 'No data'}
          </div>
          {analysis.displacement?.insights && (
            <div className="correlation-insights">
              <h4>Insights:</h4>
              <ul>
                {analysis.displacement.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {analysis.summary && (
        <div className="correlation-summary">
          <h3>Summary & Recommendation</h3>
          <p><strong>Overall:</strong> {analysis.summary.overall}</p>
          <p><strong>Recommendation:</strong> {analysis.summary.recommendation}</p>
        </div>
      )}

      <div className="correlation-note">
        <p>
          <small>
            * Correlation analysis is based on statistical modeling. Real-world impact may vary 
            due to other factors such as conflict, climate, and policy interventions.
          </small>
        </p>
      </div>
    </div>
  )
}

export default CorrelationAnalysis
