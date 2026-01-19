import { useState, useEffect } from 'react'
import './InfoTooltip.css'

function InfoTooltip({ content, title, definition, data, position = 'top' }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!content && !definition && !data) return null

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.info-tooltip-wrapper') && !e.target.closest('.tooltip-modal')) {
          setIsOpen(false)
        }
      }

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  return (
    <>
      <div className="info-tooltip-wrapper">
        <button
          className="info-icon"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          aria-label="More information"
        >
          ℹ️
        </button>
      </div>

      {isOpen && (
        <div className="tooltip-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="tooltip-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="tooltip-modal-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            
            {title && <div className="tooltip-title">{title}</div>}
            
            {definition && <div className="tooltip-definition">{definition}</div>}
            
            {data && (
              <div className="tooltip-data">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="tooltip-data-item">
                    <span className="tooltip-key" style={{ textTransform: 'none' }}>{key}:</span>
                    <span className="tooltip-value">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {content && <div className="tooltip-content">{content}</div>}
          </div>
        </div>
      )}
    </>
  )
}

export default InfoTooltip
