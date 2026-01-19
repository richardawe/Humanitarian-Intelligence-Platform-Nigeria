import './HumanitarianTable.css'

function HumanitarianTable({ data, selectedState }) {
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

  if (filteredData.length === 0) {
    return <div className="table-empty">No humanitarian data available</div>
  }

  return (
    <div className="humanitarian-table">
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Food Insecurity (%)</th>
            <th>Displaced People</th>
            <th>Health Risk</th>
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
  )
}

export default HumanitarianTable
