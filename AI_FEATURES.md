# AI Features Documentation

## Overview

The application includes two AI-powered chat features:
1. **Chat with Data (RAG System)** - Query the humanitarian data using natural language
2. **What Can I Do?** - Get AI-powered suggestions on how to help with the crisis

## Architecture

### RAG (Retrieval Augmented Generation) System

The RAG system allows users to chat with the humanitarian data:

1. **Data Indexing**: All data is indexed for search (states, humanitarian indicators, vulnerability scores, etc.)
2. **Query Processing**: User queries are matched against the data using keyword search
3. **Context Retrieval**: Relevant data is retrieved and formatted as context
4. **LLM Response**: The context is sent to the LLM along with the user query for a contextual response

**Files**:
- `frontend/src/services/rag.js` - RAG system implementation
- `frontend/src/components/DataChat.jsx` - Chat UI component

### Help Ideas Chat

The help ideas chat provides suggestions on how to help with the crisis:

1. **Crisis Context**: Current crisis data is provided as context
2. **User Query**: User asks about how to help
3. **AI Suggestions**: LLM generates personalized suggestions based on the context

**Files**:
- `frontend/src/components/HelpIdeas.jsx` - Help ideas chat UI

### OpenRouter Integration

Both chat features use OpenRouter API to access Meta Llama 3.3 70B:

**Model**: `meta-llama/llama-3.3-70b-instruct:free`

**Files**:
- `frontend/src/services/openrouter.js` - OpenRouter API client

## API Key Configuration

### For Local Development

1. Create `.env` file in `frontend/` directory:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

2. Restart the dev server:
   ```bash
   cd frontend
   npm run dev
   ```

### For GitHub Pages Deployment

1. **Get OpenRouter API Key**:
   - Sign up at https://openrouter.ai/
   - Get your API key from the dashboard

2. **Add as GitHub Secret**:
   - Go to repository Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key
   - Click "Add secret"

3. **Build-time Injection**:
   - The GitHub Actions workflow (`.github/workflows/deploy.yml`) injects the secret at build time
   - It's available as `VITE_OPENROUTER_API_KEY` environment variable
   - Vite will replace `import.meta.env.VITE_OPENROUTER_API_KEY` in the built code

**Important**: The API key will be visible in the built JavaScript bundle. This is a limitation of client-side applications. Consider:
- Using rate limits on OpenRouter
- Using a proxy server (alternative approach)
- Or accepting this trade-off for free deployment

## Usage

### Chat with Data

1. Navigate to the "💬 Chat with Data" tab
2. Ask questions like:
   - "Which states have the highest food insecurity?"
   - "Show me conflict data for Borno"
   - "What is the vulnerability score for Lagos?"
   - "Compare poverty levels across regions"

The RAG system will:
- Search the data for relevant information
- Retrieve context
- Generate an AI response based on the actual data

### What Can I Do?

1. Navigate to the "💡 What Can I Do?" tab
2. Ask questions like:
   - "How can I help with food insecurity?"
   - "What organizations can I support?"
   - "How can I volunteer?"
   - "What advocacy actions can I take?"

The AI will generate personalized suggestions based on:
- Current crisis context
- Your specific interests
- Different types of help (donations, volunteering, advocacy, etc.)

## Technical Details

### RAG System Implementation

**Simple Keyword Search (MVP)**:
- Currently uses keyword matching
- Could be upgraded to embeddings/vector search in the future
- Searches: state names, regions, indicators, values

**Context Formatting**:
- Formats search results into readable context
- Includes relevant statistics
- Provides summary information

### LLM Prompts

**RAG Chat System Prompt**:
```
You are a helpful assistant analyzing humanitarian data for Nigeria.
You have access to the following data:
[Data Summary]
[Relevant Context]

Please provide accurate, helpful answers based on this data.
```

**Help Ideas System Prompt**:
```
You are a helpful assistant providing guidance on how individuals, 
organizations, and communities can help with the humanitarian crisis in Nigeria.

Current Crisis Context:
[Crisis Summary]

Please provide practical, actionable suggestions...
```

### Error Handling

- API key not configured: Shows error message
- API request fails: Shows error, uses cached responses if available
- Network errors: Gracefully handles and retries

## Future Enhancements

1. **Vector Search**: Upgrade to embeddings-based search for better query matching
2. **Conversation History**: Persist chat history in localStorage
3. **Export Chat**: Allow users to export chat conversations
4. **Streaming Responses**: Stream LLM responses for better UX
5. **Rate Limiting**: Implement client-side rate limiting
6. **Offline Mode**: Cache responses for offline use

## Limitations

1. **API Key Exposure**: API key is visible in built JavaScript (client-side limitation)
2. **Rate Limits**: Subject to OpenRouter rate limits
3. **Simple Search**: Currently uses keyword search (not semantic search)
4. **Context Size**: Limited by LLM context window
5. **Cost**: Free tier has usage limits
