/**
 * OpenRouter API Service
 * 
 * Handles communication with OpenRouter API for LLM chat functionality
 * Using meta-llama/llama-3.3-70b-instruct:free
 */

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

/**
 * Get API key from environment variable or build-time injection
 * For GitHub Pages, this will be injected at build time via GitHub Actions
 */
function getApiKey() {
  // Try environment variable (set at build time)
  if (import.meta.env.VITE_OPENROUTER_API_KEY) {
    return import.meta.env.VITE_OPENROUTER_API_KEY;
  }
  
  // Fallback: Check if set via window (for development)
  if (typeof window !== 'undefined' && window.OPENROUTER_API_KEY) {
    return window.OPENROUTER_API_KEY;
  }
  
  return null;
}

/**
 * Call OpenRouter API
 */
export async function callOpenRouter(messages, options = {}) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY environment variable.');
  }

  try {
    const response = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin, // Optional: for tracking
        'X-Title': 'Humanitarian Intelligence Platform (HIP)' // Optional: for tracking
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        ...options
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
      finishReason: data.choices[0].finish_reason
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured() {
  return getApiKey() !== null;
}
