import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import InfoTooltip from './InfoTooltip'
import ExpandableCard from './ExpandableCard'
import api from '../services/api'
import './StateCorrelationAnalysis.css'

function StateCorrelationAnalysis({ humanitarianData }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (humanitarianData && humanitarianData.length > 0) {
      fetchStateCorrelationAnalysis()
    }
  }, [humanitarianData])

  const fetchStateCorrelationAnalysis = async () => {
    try {
      setLoading(true)
      const data = await api.getStateCorrelation(humanitarianData)
      setAnalysis(data)
    } catch (error) {
      console.error('Error fetching state correlation analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="correlation-loading">Analyzing state-level correlations...</div>
  }

  if (!analysis) {
    return null
  }

  const foodInsecurityAnalysis = analysis.foodInsecurity || {}
  const displacementAnalysis = analysis.displacement || {}

  const getCorrelationColor = (coefficient) => {
    const abs = Math.abs(coefficient)
    if (abs >= 0.7) return '#d32f2f'
    if (abs >= 0.4) return '#f57c00'
    if (abs >= 0.2) return '#fbc02d'
    return '#999'
  }

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return '#d32f2f'
      case 'moderate': return '#f57c00'
      case 'weak': return '#fbc02d'
      default: return '#999'
    }
  }

  // Prepare data for correlation chart
  const correlationData = foodInsecurityAnalysis.correlations ? [
    {
      factor: 'Food Inflation',
      coefficient: foodInsecurityAnalysis.correlations.foodInflation?.coefficient || 0,
      strength: foodInsecurityAnalysis.correlations.foodInflation?.strength || 'negligible'
    },
    {
      factor: 'Poverty',
      coefficient: foodInsecurityAnalysis.correlations.poverty?.coefficient || 0,
      strength: foodInsecurityAnalysis.correlations.poverty?.strength || 'negligible'
    },
    {
      factor: 'Conflict',
      coefficient: foodInsecurityAnalysis.correlations.conflict?.coefficient || 0,
      strength: foodInsecurityAnalysis.correlations.conflict?.strength || 'negligible'
    },
    {
      factor: 'Import Dep.',
      coefficient: foodInsecurityAnalysis.correlations.importDependence?.coefficient || 0,
      strength: foodInsecurityAnalysis.correlations.importDependence?.strength || 'negligible'
    },
    {
      factor: 'Infrastructure',
      coefficient: foodInsecurityAnalysis.correlations.infrastructure?.coefficient || 0,
      strength: foodInsecurityAnalysis.correlations.infrastructure?.strength || 'negligible'
    }
  ] : []

  // Calculate direct correlation: Food Inflation vs Displacement
  const inflationDisplacementCorr = displacementAnalysis.correlations?.foodInflation || {}
  const conflictDisplacementCorr = displacementAnalysis.correlations?.conflict || {}

  return (
    <div className="state-correlation-analysis">
      <div className="correlation-header">
        <h2>📊 State-Level Factor Correlation Analysis</h2>
        <p className="correlation-subtitle">
          Understanding links between inflation, conflict, poverty and humanitarian crises
          <InfoTooltip
            title="Correlation Analysis"
            definition="This analysis uses Pearson correlation coefficient to measure relationships between state-level factors (food inflation, poverty, conflict, import dependence, infrastructure) and humanitarian indicators (food insecurity, displacement). Correlation doesn't imply causation, but helps identify key drivers."
            content="Methodology: Pearson correlation coefficient (r), significance testing at p < 0.05. Data sources: NBS, UNOCHA, WFP, ACLED."
          />
        </p>
      </div>
      
      {/* Key Correlations Highlight */}
      <div className="key-correlations-highlight">
        <div className="correlation-highlight-card">
          <h3>🔄 Food Inflation ↔ Displacement</h3>
          <div className="correlation-value" style={{ color: getCorrelationColor(inflationDisplacementCorr.coefficient || 0) }}>
            r = {(inflationDisplacementCorr.coefficient || 0).toFixed(3)}
          </div>
          <div className="correlation-interpretation">
            {inflationDisplacementCorr.interpretation || 'Analyzing correlation...'}
          </div>
          <p className="correlation-explanation">
            <strong>Link:</strong> Higher food inflation correlates with increased displacement as economic pressures 
            force people to leave their homes. This connection is particularly strong in states where conflict 
            compounds economic hardship.
          </p>
          <div className="correlation-citation">
            <strong>Source:</strong> NBS Food Inflation Data, UNOCHA Displacement Reports, 
            <a href="https://acleddata.com/" target="_blank" rel="noopener noreferrer"> ACLED</a>
          </div>
        </div>
        
        <div className="correlation-highlight-card">
          <h3>⚔️ Conflict ↔ Displacement</h3>
          <div className="correlation-value" style={{ color: getCorrelationColor(conflictDisplacementCorr.coefficient || 0) }}>
            r = {(conflictDisplacementCorr.coefficient || 0).toFixed(3)}
          </div>
          <div className="correlation-interpretation">
            {conflictDisplacementCorr.interpretation || 'Analyzing correlation...'}
          </div>
          <p className="correlation-explanation">
            <strong>Link:</strong> Conflict intensity is the strongest predictor of displacement. States with active 
            insurgency, banditry, or farmer-herder conflicts show significantly higher IDP populations.
          </p>
          <div className="correlation-citation">
            <strong>Source:</strong> ACLED Conflict Data, UNHCR IDP Statistics, 
            <a href="https://data.humdata.org/organization/ocha" target="_blank" rel="noopener noreferrer"> UNOCHA</a>
          </div>
        </div>
      </div>

      <ExpandableCard
        title="📖 Understanding State-Level Correlations"
        summary="Analyzes which state-varying factors (food inflation, poverty, conflict, etc.) correlate most with humanitarian indicators"
        expandedContent={
          <div className="correlation-explanation">
            <h3>What is Correlation Analysis?</h3>
            <p>
              Correlation measures the strength and direction of the relationship between two variables. 
              A correlation coefficient (r) ranges from -1 to +1:
            </p>
            <ul>
              <li><strong>r = +0.7 to +1.0:</strong> Strong positive correlation - variables move together</li>
              <li><strong>r = +0.4 to +0.7:</strong> Moderate positive correlation</li>
              <li><strong>r = +0.2 to +0.4:</strong> Weak positive correlation</li>
              <li><strong>r = -0.2 to +0.2:</strong> No significant correlation</li>
              <li><strong>r = -0.4 to -0.2:</strong> Weak negative correlation - variables move in opposite directions</li>
            </ul>
            <h4>Why State-Level Factors Matter</h4>
            <p>
              Unlike national indicators (like exchange rates), these factors vary by state, allowing us to 
              identify which specific drivers are most important in different regions. For example, conflict 
              may be the primary driver in North-East states, while food inflation might drive food insecurity 
              in other regions.
            </p>
            <h4>How to Use This Information</h4>
            <p>
              Factors with strong correlations (r > 0.5) indicate primary drivers that should be addressed first. 
              States with high conflict correlation need security interventions, while those with high food inflation 
              correlation need economic/food price stabilization measures.
            </p>
            <div className="methodology-citation">
              <strong>Methodology:</strong> Pearson correlation coefficient with significance testing. 
              <strong>Data Sources:</strong> National Bureau of Statistics (NBS), UNOCHA, WFP, UNHCR, ACLED, UNDP.
            </div>
          </div>
        }
      />

      {/* Correlation Chart */}
      {correlationData.length > 0 && (
        <div className="correlation-chart-section">
          <h3>Correlation Coefficients: Food Insecurity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="factor" />
              <YAxis label={{ value: 'Correlation (r)', angle: -90, position: 'insideLeft' }} domain={[-1, 1]} />
              <Tooltip 
                formatter={(value) => value.toFixed(3)}
                labelFormatter={(label) => `Factor: ${label}`}
              />
              <Legend />
              <Bar dataKey="coefficient" name="Correlation Coefficient">
                {correlationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCorrelationColor(entry.coefficient)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Factors */}
      {foodInsecurityAnalysis.topFactors && foodInsecurityAnalysis.topFactors.length > 0 && (
        <div className="top-factors-section">
          <h3>Top Contributing Factors to Food Insecurity</h3>
          <div className="factors-grid">
            {foodInsecurityAnalysis.topFactors.map((factor, idx) => (
              <div key={idx} className="factor-card">
                <div className="factor-rank">#{idx + 1}</div>
                <div className="factor-name">{factor.factor}</div>
                <div 
                  className="factor-coefficient" 
                  style={{ color: getStrengthColor(factor.strength) }}
                >
                  r = {factor.coefficient.toFixed(3)}
                </div>
                <div className={`factor-strength ${factor.strength}`}>
                  {factor.strength}
                </div>
                <div className="factor-interpretation">{factor.interpretation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {foodInsecurityAnalysis.insights && foodInsecurityAnalysis.insights.length > 0 && (
        <div className="correlation-insights-section">
          <h3>Key Insights</h3>
          <ul>
            {foodInsecurityAnalysis.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Displacement Analysis */}
      {displacementAnalysis.topFactors && displacementAnalysis.topFactors.length > 0 && (
        <div className="displacement-analysis-section">
          <h3>Top Contributing Factors to Displacement</h3>
          <div className="factors-grid">
            {displacementAnalysis.topFactors.map((factor, idx) => (
              <div key={idx} className="factor-card">
                <div className="factor-rank">#{idx + 1}</div>
                <div className="factor-name">{factor.factor}</div>
                <div 
                  className="factor-coefficient" 
                  style={{ color: getStrengthColor(factor.strength) }}
                >
                  r = {factor.coefficient.toFixed(3)}
                </div>
                <div className={`factor-strength ${factor.strength}`}>
                  {factor.strength}
                </div>
              </div>
            ))}
          </div>
          {displacementAnalysis.insights && displacementAnalysis.insights.length > 0 && (
            <ul className="insights-list">
              {displacementAnalysis.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Summary */}
      {analysis.summary && (
        <div className="correlation-summary">
          <h3>Summary & Recommendation</h3>
          <p><strong>Overall:</strong> {analysis.summary.overall}</p>
          <p><strong>Recommendation:</strong> {analysis.summary.recommendation}</p>
        </div>
      )}
    </div>
  )
}

export default StateCorrelationAnalysis
