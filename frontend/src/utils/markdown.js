/**
 * Simple Markdown to HTML converter
 * Handles common markdown formatting for chat responses
 */

/**
 * Process inline formatting (bold, italic)
 */
function processInlineFormatting(text) {
  // Escape HTML first
  let processed = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold (**text** or __text__)
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_) - but not if it's part of bold
  // Simple approach: replace single * and _ that aren't part of ** or __
  processed = processed.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  processed = processed.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em>$1</em>');

  return processed;
}

/**
 * Convert markdown text to HTML
 * Supports: bold (**text**), italic (*text*), lists (- item), numbered lists (1. item), headers (# Header)
 */
export function markdownToHtml(markdown) {
  if (!markdown) return '';

  // Split into lines for processing
  const lines = markdown.split('\n');
  const result = [];
  let currentParagraph = [];
  let inList = false;
  let listType = null;
  let listItems = [];

  const processList = () => {
    if (inList && listItems.length > 0) {
      const tag = listType === 'numbered' ? 'ol' : 'ul';
      result.push(`<${tag}>${listItems.map(item => `<li>${item}</li>`).join('')}</${tag}>`);
      listItems = [];
      inList = false;
      listType = null;
    }
  };

  const processParagraph = () => {
    if (currentParagraph.length > 0) {
      const paraText = currentParagraph.join(' ').trim();
      if (paraText) {
        const processed = processInlineFormatting(paraText);
        result.push(`<p>${processed}</p>`);
      }
      currentParagraph = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      processList();
      processParagraph();
      continue;
    }

    // Headers
    if (trimmed.match(/^###\s+(.+)$/)) {
      processList();
      processParagraph();
      const header = trimmed.replace(/^###\s+/, '').trim();
      result.push(`<h3>${processInlineFormatting(header)}</h3>`);
      continue;
    }
    if (trimmed.match(/^##\s+(.+)$/)) {
      processList();
      processParagraph();
      const header = trimmed.replace(/^##\s+/, '').trim();
      result.push(`<h2>${processInlineFormatting(header)}</h2>`);
      continue;
    }
    if (trimmed.match(/^#\s+(.+)$/)) {
      processList();
      processParagraph();
      const header = trimmed.replace(/^#\s+/, '').trim();
      result.push(`<h1>${processInlineFormatting(header)}</h1>`);
      continue;
    }

    // Numbered lists (1. item, 2. item, etc.)
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      processParagraph();
      const item = numberedMatch[2].trim();
      if (!inList || listType !== 'numbered') {
        processList();
        inList = true;
        listType = 'numbered';
      }
      listItems.push(processInlineFormatting(item));
      continue;
    }

    // Bullet lists (- item or * item)
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      processParagraph();
      const item = bulletMatch[1].trim();
      if (!inList || listType !== 'bullet') {
        processList();
        inList = true;
        listType = 'bullet';
      }
      listItems.push(processInlineFormatting(item));
      continue;
    }

    // Regular text - continue paragraph
    processList();
    currentParagraph.push(line);
  }

  // Process remaining
  processList();
  processParagraph();

  return result.join('\n');
}

/**
 * Format message content with markdown support
 */
export function formatMessageContent(content) {
  return markdownToHtml(content);
}
