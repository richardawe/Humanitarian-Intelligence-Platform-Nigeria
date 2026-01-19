import { useState } from 'react'
import './ExpandableCard.css'

function ExpandableCard({ title, summary, expandedContent, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={`expandable-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="expandable-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="expandable-title">
          <h3>{title}</h3>
          {summary && <p className="expandable-summary">{summary}</p>}
        </div>
        <button className="expand-toggle" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      {isExpanded && (
        <div className="expandable-content">
          {expandedContent}
        </div>
      )}
    </div>
  )
}

export default ExpandableCard
