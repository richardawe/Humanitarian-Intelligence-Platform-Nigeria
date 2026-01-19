import { useState, useRef, useEffect } from 'react'
import { getRAGContext, generateDataSummary } from '../services/rag.js'
import { callOpenRouter, isApiKeyConfigured } from '../services/openrouter.js'
import { formatMessageContent } from '../utils/markdown.js'
import './DataChat.css'

function DataChat({ data }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '👋 Hello! I can help you explore the humanitarian data for Nigeria. Ask me questions like:\n\n• "Which states have the highest food insecurity?"\n• "Show me conflict data for Borno"\n• "What is the vulnerability score for Lagos?"\n• "Compare poverty levels across regions"\n\nHow can I help you?'
      }])
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      // Get RAG context
      const ragContext = await getRAGContext(userMessage)

      // Prepare system prompt with context
      const systemPrompt = `You are a helpful assistant analyzing humanitarian data for Nigeria. You have access to the following data:

${generateDataSummary(ragContext.dataIndex)}

${ragContext.context ? `\nRelevant Context for this query:\n${ragContext.context}` : ''}

Please provide accurate, helpful answers based on this data. If you don't have specific data, say so clearly. Format your responses clearly with bullet points or numbered lists when appropriate.`;

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
        temperature: 0.7,
        max_tokens: 1500
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
      console.error('Error in chat:', err)
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
    <div className="data-chat">
      <div className="chat-header">
        <h2>
          💬 Chat with Data
          <span className="chat-subtitle">Ask questions about humanitarian indicators, states, and vulnerabilities</span>
        </h2>
      </div>

      {error && (
        <div className="chat-error">
          ⚠️ {error}
        </div>
      )}

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
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
            <div className="message-avatar">🤖</div>
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
          placeholder="Ask about states, food insecurity, displacement, vulnerability..."
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

export default DataChat
