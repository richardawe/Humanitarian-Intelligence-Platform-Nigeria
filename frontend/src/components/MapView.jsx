import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Nigeria center coordinates
const NIGERIA_CENTER = [9.0820, 8.6753]

// Approximate coordinates for Nigerian states
const STATE_COORDINATES = {
  'Abia': [5.5333, 7.4833],
  'Adamawa': [9.3265, 12.3984],
  'Akwa Ibom': [4.9497, 7.9522],
  'Anambra': [6.2167, 7.0833],
  'Bauchi': [10.3158, 9.8442],
  'Bayelsa': [4.9267, 6.2676],
  'Benue': [7.7333, 8.5333],
  'Borno': [11.8333, 13.1500],
  'Cross River': [4.9600, 8.3300],
  'Delta': [5.5167, 6.2167],
  'Ebonyi': [6.3167, 8.1167],
  'Edo': [6.3350, 5.6225],
  'Ekiti': [7.6231, 5.2209],
  'Enugu': [6.4474, 7.5136],
  'Abuja': [9.0765, 7.3986],
  'FCT': [9.0765, 7.3986], // Also map FCT to Abuja
  'Gombe': [10.2894, 11.1717],
  'Imo': [5.4833, 7.0333],
  'Jigawa': [11.7014, 9.3402],
  'Kaduna': [10.5105, 7.4165],
  'Kano': [12.0022, 8.5919],
  'Katsina': [12.9889, 7.6000],
  'Kebbi': [12.4500, 4.1994],
  'Kogi': [7.8022, 6.7333],
  'Kwara': [8.5000, 4.5500],
  'Lagos': [6.5244, 3.3792],
  'Nasarawa': [8.5167, 7.7333],
  'Niger': [9.6157, 6.5478],
  'Ogun': [7.1667, 3.3500],
  'Ondo': [7.2500, 5.2000],
  'Osun': [7.7669, 4.5600],
  'Oyo': [7.3776, 3.9470],
  'Plateau': [9.9167, 8.9000],
  'Rivers': [4.8396, 6.9112],
  'Sokoto': [13.0667, 5.2333],
  'Taraba': [8.8833, 11.3667],
  'Yobe': [12.0000, 11.5000],
  'Zamfara': [12.1667, 6.6667]
}

function MapView({ states, humanitarianData, selectedState, onStateSelect }) {
  const mapRef = useRef(null)

  // Create a map of humanitarian data by state
  const humanitarianMap = humanitarianData.reduce((acc, item) => {
    acc[item.state] = item
    return acc
  }, {})

  // Get risk color based on food insecurity
  const getRiskColor = (stateName) => {
    const data = humanitarianMap[stateName]
    if (!data) return '#94a3b8'

    const risk = data.foodInsecurity || 0
    if (risk >= 60) return '#ef4444' // Critical - Red
    if (risk >= 40) return '#f59e0b' // High - Orange
    if (risk >= 25) return '#eab308' // Medium - Yellow
    return '#10b981' // Low - Green
  }

  // Get radius based on displacement
  const getRadius = (stateName) => {
    const data = humanitarianMap[stateName]
    if (!data) return 5

    const displacement = data.displacement || 0
    if (displacement > 500000) return 20
    if (displacement > 200000) return 15
    if (displacement > 50000) return 10
    return 5
  }

  const visibleStates = selectedState
    ? states.filter((s) => s.name === selectedState)
    : states

  return (
    <div className="map-view">
      <MapContainer
        center={NIGERIA_CENTER}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visibleStates.map((state) => {
          const coords = STATE_COORDINATES[state.name]
          if (!coords) return null

          const humanitarian = humanitarianMap[state.name] || {}
          const riskColor = getRiskColor(state.name)
          const radius = getRadius(state.name)

          return (
            <CircleMarker
              key={state.id}
              center={coords}
              radius={radius}
              pathOptions={{
                color: riskColor,
                fillColor: riskColor,
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{state.name}</h3>
                  <div className="popup-stats">
                    <p><strong>Population:</strong> {state.population?.toLocaleString() || 'N/A'}</p>
                    {humanitarian.foodInsecurity && (
                      <p><strong>Food Insecurity:</strong> {humanitarian.foodInsecurity}% 
                        <span className="popup-note"> ({Math.round((state.population * humanitarian.foodInsecurity) / 100).toLocaleString()} people)</span>
                      </p>
                    )}
                    {humanitarian.displacement && (
                      <p><strong>Displaced:</strong> {humanitarian.displacement.toLocaleString()} IDPs</p>
                    )}
                    {humanitarian.healthRisk && (
                      <p><strong>Health Risk:</strong> <span className={`risk-${humanitarian.healthRisk}`}>{humanitarian.healthRisk}</span></p>
                    )}
                  </div>
                  <button
                    onClick={() => onStateSelect(state.name)}
                    className="map-select-btn"
                  >
                    📊 View Full Details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      <div className="map-legend">
        <h4>Risk Level</h4>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#10b981' }}></span>
          <span>Low (&lt;25%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#eab308' }}></span>
          <span>Medium (25-40%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#f59e0b' }}></span>
          <span>High (40-60%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ef4444' }}></span>
          <span>Critical (&gt;60%)</span>
        </div>
        <p className="legend-note">Circle size = number of displaced people</p>
      </div>
    </div>
  )
}

export default MapView
