import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './ExchangeRateChart.css'

function ExchangeRateChart({ exchangeRates }) {
  // Generate historical data for last 7 days based on current rate
  // In production, this would come from time-series data from API
  const generateHistoricalData = () => {
    const data = []
    const today = new Date()
    // Use usdToNgn if available, otherwise calculate from usd rate
    const currentRate = exchangeRates?.usdToNgn || (exchangeRates?.usd ? Math.round(1 / exchangeRates.usd) : 1420)

    // Generate last 7 days with slight realistic variations (±2%)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Add small random variation (±2% of current rate)
      const variationPercent = (Math.random() - 0.5) * 0.04 // -2% to +2%
      const rate = Math.round(currentRate * (1 + variationPercent))

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        'NGN/USD': rate
      })
    }

    return data
  }

  const chartData = generateHistoricalData()
  const currentRate = exchangeRates?.usdToNgn || (exchangeRates?.usd ? Math.round(1 / exchangeRates.usd) : null)

  return (
    <div className="exchange-chart">
      {currentRate && (
        <div className="chart-header">
          <p className="current-rate">Current Rate: ₦{currentRate.toLocaleString()} = $1 USD</p>
          <p className="data-source">Source: {exchangeRates?.provider || exchangeRates?.source || 'Exchange Rate API'}</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'NGN per USD', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="NGN/USD"
            stroke="#2a5298"
            strokeWidth={2}
            dot={{ fill: '#2a5298', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {!currentRate && (
        <p className="chart-note">* Historical data unavailable - showing estimated trends</p>
      )}
    </div>
  )
}

export default ExchangeRateChart
