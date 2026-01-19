import { useState } from 'react'
import ExpandableCard from './ExpandableCard'
import './DataTransparency.css'

function DataTransparency({ data }) {
  const [activeSection, setActiveSection] = useState(null)

  const dataSources = [
    {
      name: 'Humanitarian Indicators',
      source: 'UNOCHA, WFP, UNHCR',
      lastUpdate: '2024 Q4',
      updateFrequency: 'Quarterly',
      link: 'https://data.humdata.org/organization/ocha',
      description: 'Compiled from UNOCHA Humanitarian Response Plans, WFP Food Security Analysis, and UNHCR IDP displacement reports.',
      citation: 'UNOCHA Nigeria Humanitarian Response Plan 2024, WFP Food Security Analysis 2024, UNHCR IDP Reports 2024'
    },
    {
      name: 'Food Price Inflation',
      source: 'National Bureau of Statistics (NBS)',
      lastUpdate: '2025',
      updateFrequency: 'Monthly',
      link: 'https://nigerianstat.gov.ng/elibrary',
      description: 'Year-on-Year (YoY) food price inflation by state from NBS official reports and data publications.',
      citation: 'NBS Consumer Price Index Reports 2024-2025'
    },
    {
      name: 'Poverty Levels',
      source: 'UNDP, National Bureau of Statistics',
      lastUpdate: '2023 (HDI), 2018-2019 (MPI)',
      updateFrequency: 'Annual',
      link: 'https://hdr.undp.org/data-center/country-insights',
      description: 'Human Development Index (HDI) 2023 and Multidimensional Poverty Index (MPI) 2018-2019 data.',
      citation: 'UNDP Human Development Report 2023, National Bureau of Statistics MPI Report 2019'
    },
    {
      name: 'Conflict Intensity',
      source: 'ACLED, UNOCHA',
      lastUpdate: '2024',
      updateFrequency: 'Weekly/Monthly',
      link: 'https://acleddata.com/',
      description: 'Conflict incident data from ACLED (Armed Conflict Location & Event Data Project) and UNOCHA crisis reports.',
      citation: 'ACLED Conflict Data 2023-2024, UNOCHA Crisis Reports'
    },
    {
      name: 'Climate Indicators',
      source: 'NEMA, UNOCHA, Climate Risk Index',
      lastUpdate: '2024-2025',
      updateFrequency: 'Seasonal',
      link: 'https://www.nema.gov.ng/',
      description: 'Flooding impact data from National Emergency Management Agency (NEMA) and climate risk assessments.',
      citation: 'NEMA Flood Reports 2024-2025, UNOCHA Climate Risk Assessments'
    },
    {
      name: 'Population Data',
      source: 'National Population Commission',
      lastUpdate: '2006 Census (2024 estimates)',
      updateFrequency: 'Census-based with estimates',
      link: 'https://nationalpopulation.gov.ng/',
      description: 'Based on 2006 national census with 2024 population estimates using growth rates.',
      citation: 'National Population Commission Nigeria, 2006 Census with 2024 Estimates'
    },
    {
      name: 'Exchange Rates',
      source: 'open.er-api.com',
      lastUpdate: 'Real-time',
      updateFrequency: 'Hourly',
      link: 'https://open.er-api.com/',
      description: 'Real-time exchange rate data from open.er-api.com (NGN/USD and other currencies).',
      citation: 'open.er-api.com Exchange Rate API'
    }
  ]

  const discrepancies = [
    {
      metric: 'IDP Displacement Figures',
      platformValue: '~4.7 million (total across all states)',
      officialValue: '~3.5 million (UNHCR 2024)',
      explanation: 'Our platform aggregates state-level displacement data which may include: (1) individuals displaced multiple times (counted in multiple states), (2) temporary displacement not captured in official UN counts, (3) historical cumulative displacement figures, and (4) estimates from state-level assessments. The UNHCR figure represents verified IDPs currently in camps or receiving assistance. Our figure represents total displacement events across all states.',
      source: 'UNHCR Nigeria IDP Statistics 2024, State-Level Displacement Reports'
    },
    {
      metric: 'Food Insecurity Population',
      platformValue: 'Estimated 62+ million',
      officialValue: '~25-30 million (WFP 2024)',
      explanation: 'The platform uses food insecurity percentages multiplied by state populations, which can result in higher totals than official WFP/IPC figures because: (1) we include states with moderate food insecurity (IPC Phase 2), while official counts often focus on Phase 3+ (crisis and above), (2) state-level percentages are applied to entire populations, while WFP uses more granular assessments, (3) our data represents potential peak periods, while official figures are point-in-time assessments. The 6M figure you mentioned may refer to Phase 4+ (emergency) population specifically.',
      source: 'WFP Nigeria Food Security Analysis 2024, IPC Nigeria Reports, NBS Data'
    },
    {
      metric: 'Vulnerability Index Scores',
      platformValue: 'Composite 0-100 score',
      officialValue: 'Not directly comparable',
      explanation: 'Our vulnerability index is a composite metric combining multiple factors (food inflation, poverty, conflict, import dependence, infrastructure). This is not an official UN/NGO metric but rather a predictive tool. Official agencies use different assessment frameworks (IPC for food security, INFORM Risk Index for overall risk). Our index is designed to identify states requiring attention based on multiple compounding factors.',
      source: 'IPC Classification System, INFORM Risk Index Methodology'
    }
  ]

  const updateLog = [
    { date: '2025-01-20', type: 'Data Update', description: 'Added climate indicators (flooding, climate shocks) from NEMA 2024-2025 reports', source: 'NEMA' },
    { date: '2025-01-15', type: 'Feature Addition', description: 'Added export functionality (CSV/PDF) to data tables', source: 'Platform Update' },
    { date: '2025-01-10', type: 'Data Update', description: 'Updated humanitarian indicators with Q4 2024 data', source: 'UNOCHA, WFP' },
    { date: '2024-12-20', type: 'Data Update', description: 'Updated food inflation data with November 2024 NBS report', source: 'NBS' },
    { date: '2024-12-01', description: 'Platform initial release with core humanitarian data', source: 'Initial Release' }
  ]

  return (
    <div className="data-transparency">
      <h2>📊 Data Transparency & Sources</h2>
      
      <ExpandableCard
        title="📚 Data Sources & Citations"
        summary={`${dataSources.length} primary data sources with links and update frequencies`}
        expandedContent={
          <div className="sources-list">
            {dataSources.map((source, index) => (
              <div key={index} className="source-item">
                <div className="source-header">
                  <h3>{source.name}</h3>
                  <span className="source-badge">{source.updateFrequency}</span>
                </div>
                <p className="source-description">{source.description}</p>
                <div className="source-meta">
                  <div className="source-info">
                    <strong>Source:</strong> {source.source}
                  </div>
                  <div className="source-info">
                    <strong>Last Updated:</strong> {source.lastUpdate}
                  </div>
                  <div className="source-info">
                    <strong>Update Frequency:</strong> {source.updateFrequency}
                  </div>
                </div>
                <div className="source-citation">
                  <strong>Citation:</strong> {source.citation}
                </div>
                {source.link && (
                  <a 
                    href={source.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    🔗 Visit Source Website
                  </a>
                )}
              </div>
            ))}
          </div>
        }
      />

      <ExpandableCard
        title="⚠️ Data Discrepancies & Explanations"
        summary="Understanding differences between platform figures and official statistics"
        expandedContent={
          <div className="discrepancies-list">
            {discrepancies.map((item, index) => (
              <div key={index} className="discrepancy-item">
                <h3>{item.metric}</h3>
                <div className="discrepancy-comparison">
                  <div className="comparison-box">
                    <strong>Platform Value:</strong>
                    <span>{item.platformValue}</span>
                  </div>
                  <div className="comparison-box">
                    <strong>Official/Alternative Value:</strong>
                    <span>{item.officialValue}</span>
                  </div>
                </div>
                <div className="discrepancy-explanation">
                  <strong>Explanation:</strong>
                  <p>{item.explanation}</p>
                </div>
                <div className="discrepancy-source">
                  <strong>Sources:</strong> {item.source}
                </div>
              </div>
            ))}
          </div>
        }
      />

      <ExpandableCard
        title="📅 Update Log"
        summary={`Last ${updateLog.length} platform updates and data refreshes`}
        expandedContent={
          <div className="update-log">
            {updateLog.map((update, index) => (
              <div key={index} className="log-entry">
                <div className="log-date">{update.date}</div>
                <div className="log-content">
                  <span className="log-type">{update.type || 'Update'}</span>
                  <p>{update.description}</p>
                  <span className="log-source">Source: {update.source}</span>
                </div>
              </div>
            ))}
          </div>
        }
      />

      <div className="transparency-note">
        <h3>Data Quality & Limitations</h3>
        <ul>
          <li><strong>Static vs. Real-Time:</strong> Most data is manually coded from official reports. Only exchange rates are real-time API data.</li>
          <li><strong>Update Frequency:</strong> Data updates depend on source publication schedules (quarterly for humanitarian, monthly for economic, annual for development indicators).</li>
          <li><strong>Methodology:</strong> Vulnerability index and correlations use our own methodology. These are analytical tools, not official UN/NGO metrics.</li>
          <li><strong>Coverage:</strong> All 37 Nigerian states (36 states + FCT) are included. Data completeness varies by indicator.</li>
          <li><strong>Accuracy:</strong> We use authoritative sources but cannot guarantee 100% accuracy. Users should verify critical figures with primary sources.</li>
        </ul>
      </div>
    </div>
  )
}

export default DataTransparency
