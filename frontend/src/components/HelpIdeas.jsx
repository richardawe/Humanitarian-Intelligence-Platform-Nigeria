import { useState, useRef, useEffect } from 'react'
import { callOpenRouter, isApiKeyConfigured } from '../services/openrouter.js'
import { formatMessageContent } from '../utils/markdown.js'
import './HelpIdeas.css'

function HelpIdeas({ data }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '🤝 Hello! I\'m here to help you find ways to contribute to the humanitarian crisis response in Nigeria.\n\nI can suggest:\n• Donation opportunities\n• Volunteer organizations\n• Advocacy actions\n• Direct aid initiatives\n• Policy engagement\n• Local community support\n\nWhat area of help are you most interested in?'
      }])
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getCrisisSummary = () => {
    if (!data) return '';

    const states = data.states || [];
    const humanitarian = data.humanitarian || [];
    const vulnerability = data.vulnerabilityIndex;

    const totalPopulation = states.reduce((sum, s) => sum + (s.population || 0), 0);
    const totalIDPs = humanitarian.reduce((sum, h) => sum + (h.displacement || 0), 0);
    const avgFoodInsecurity = humanitarian.length > 0
      ? (humanitarian.reduce((sum, h) => sum + (h.foodInsecurity || 0), 0) / humanitarian.length).toFixed(1)
      : 0;

    const crisisStates = vulnerability?.rankings?.filter(s => 
      s.category === 'critical' || s.category === 'very_high'
    ).slice(0, 5).map(s => s.state) || [];

    return `
Nigeria Humanitarian Crisis Summary:
- Total Population: ${totalPopulation.toLocaleString()}
- Total IDPs: ${totalIDPs.toLocaleString()}
- Average Food Insecurity: ${avgFoodInsecurity}%
- States in Critical Crisis: ${crisisStates.join(', ')}
- Total States Affected: ${humanitarian.length}
`;
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    if (!isApiKeyConfigured()) {
      setError('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY environment variable during build.')
      return
    }

    const userMessage = input.trim()
    setInput('')
    setLoading(true)
    setError(null)

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    try {
      // Prepare system prompt with crisis context
      const systemPrompt = `You are a helpful assistant providing guidance on how individuals, organizations, and communities can help with the humanitarian crisis in Nigeria. 

Current Crisis Context:${getCrisisSummary()}

Please provide practical, actionable suggestions for helping with the crisis. Consider:
- Different levels of involvement (individual, community, organizational)
- Types of help (donations, volunteering, advocacy, direct aid, policy)
- Focus areas (food security, displacement, conflict resolution, health, education)
- Local and international opportunities
- Immediate vs. long-term actions

Be specific, realistic, and helpful. If the user asks about a specific state or issue, tailor your suggestions accordingly. Format responses clearly with bullet points or numbered lists.`;

      // Prepare messages for API
      const apiMessages = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...newMessages.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ]

      // Call OpenRouter API
      const response = await callOpenRouter(apiMessages, {
        temperature: 0.8,
        max_tokens: 2000
      })

      // Add assistant response
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.content
        }
      ])
    } catch (err) {
      console.error('Error in help ideas chat:', err)
      setError(err.message || 'Failed to get response. Please try again.')
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or rephrase your question.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="help-ideas">
      <div className="chat-header">
        <h2>
          💡 What Can I Do?
          <span className="chat-subtitle">Get AI-powered suggestions on how to help with the crisis</span>
        </h2>
      </div>

      {error && (
        <div className="chat-error">
          ⚠️ {error}
        </div>
      )}

      <div className="chat-messages" ref={messagesEndRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '💡'}
            </div>
            <div className="message-content">
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
              />
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <div className="message-avatar">💡</div>
            <div className="message-content">
              <div className="message-text typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask: How can I help with food insecurity? What organizations can I support?..."
          disabled={loading}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="chat-send-btn"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  )
}

export default HelpIdeas
