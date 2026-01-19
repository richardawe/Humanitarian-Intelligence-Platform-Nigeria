import { useState } from 'react'
import { exportTableToCSV, exportToPDF } from '../utils/export.js'
import InfoTooltip from './InfoTooltip'
import './HumanitarianTable.css'

function HumanitarianTable({ data, selectedState }) {
  const [tableRef, setTableRef] = useState(null)

  const filteredData = selectedState
    ? data.filter((item) => item.state === selectedState)
    : data

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'critical':
        return 'risk-badge critical'
      case 'high':
        return 'risk-badge high'
      case 'medium':
        return 'risk-badge medium'
      case 'low':
        return 'risk-badge low'
      default:
        return 'risk-badge unknown'
    }
  }

  const handleExportCSV = () => {
    if (tableRef) {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `humanitarian-data-${selectedState || 'all-states'}-${timestamp}.csv`
      exportTableToCSV(tableRef, filename)
    }
  }

  const handleExportPDF = () => {
    exportToPDF('humanitarian-table-export', 'humanitarian-data.pdf')
  }

  if (filteredData.length === 0) {
    return <div className="table-empty">No humanitarian data available</div>
  }

  return (
    <div className="humanitarian-table">
      <div className="table-header">
        <div className="table-title-section">
          <h2>📋 Humanitarian Indicators by State</h2>
          <p className="table-subtitle">
            Data Source: UNOCHA, WFP, UNHCR Reports (2024)
            <InfoTooltip
              title="Data Sources"
              definition="Humanitarian data is compiled from multiple authoritative sources including UNOCHA (UN Office for Coordination of Humanitarian Affairs), WFP (World Food Programme), and UNHCR (UN Refugee Agency) reports. Data reflects conditions as of 2024 and is updated as new reports become available."
              content="Sources: UNOCHA Nigeria Humanitarian Response Plan 2024, WFP Food Security Analysis, UNHCR IDP Displacement Reports"
            />
          </p>
        </div>
        <div className="table-actions">
          <button onClick={handleExportCSV} className="export-btn csv-btn" title="Export to CSV">
            📥 CSV
          </button>
          <button onClick={handleExportPDF} className="export-btn pdf-btn" title="Export to PDF">
            📄 PDF
          </button>
        </div>
      </div>

      <div id="humanitarian-table-export">
        <table ref={(el) => setTableRef(el)}>
          <thead>
            <tr>
              <th>
                State
                <InfoTooltip
                  title="State"
                  definition="One of Nigeria's 37 states (36 states + Federal Capital Territory)"
                />
              </th>
              <th>
                Food Insecurity (%)
                <InfoTooltip
                  title="Food Insecurity"
                  definition="Percentage of population experiencing moderate to severe food insecurity. Based on UNOCHA/WFP assessments. Higher percentages indicate more severe food security crises."
                  content="Source: WFP Food Security Analysis, UNOCHA Reports"
                />
              </th>
              <th>
                Displaced People
                <InfoTooltip
                  title="Internally Displaced Persons (IDPs)"
                  definition="Total number of people internally displaced within Nigeria, typically due to conflict, climate shocks, or economic factors. Note: Figures represent cumulative displacement, not necessarily current IDP camp populations."
                  content="Source: UNHCR IDP Reports, UNOCHA Displacement Tracking Matrix"
                />
              </th>
              <th>
                Health Risk
                <InfoTooltip
                  title="Health Risk Level"
                  definition="Overall health risk assessment based on multiple factors including disease outbreaks, healthcare access, malnutrition, and environmental conditions."
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td className="state-name">{item.state}</td>
                <td>
                  <div className="percentage-bar">
                    <span>{item.foodInsecurity}%</span>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${item.foodInsecurity}%`,
                          background: item.foodInsecurity >= 60 ? '#d32f2f' :
                                     item.foodInsecurity >= 40 ? '#f57c00' :
                                     item.foodInsecurity >= 25 ? '#fbc02d' : '#388e3c'
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>{item.displacement?.toLocaleString() || 0}</td>
                <td>
                  <span className={getRiskBadgeClass(item.healthRisk)}>
                    {item.healthRisk || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p className="table-note">
          <strong>Note:</strong> IDP figures represent cumulative displacement. Some individuals may have returned or relocated multiple times. 
          Food insecurity percentages are based on IPC (Integrated Food Security Phase Classification) assessments.
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="data-citation">
          <strong>Sources:</strong> UNOCHA Nigeria Humanitarian Response Plan 2024, 
          WFP Food Security Analysis, UNHCR IDP Displacement Reports, 
          <a href="https://data.humdata.org/organization/ocha" target="_blank" rel="noopener noreferrer"> Humanitarian Data Exchange</a>
        </p>
      </div>
    </div>
  )
}

export default HumanitarianTable
