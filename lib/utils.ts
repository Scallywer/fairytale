/**
 * Calculate reading time in minutes based on word count
 * @param body - The story text content
 * @param wordsPerMinute - Reading speed (default: 120 words/min for adult read-aloud)
 * @returns Reading time in minutes (minimum 1 minute)
 */
export function calculateReadingTime(body: string, wordsPerMinute: number = 120): number {
  if (!body || body.trim().length === 0) {
    return 1
  }

  const words = body.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length

  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  return readingTime
}

/**
 * Safely serialize a value for embedding inside a <script> tag via
 * dangerouslySetInnerHTML. Escapes characters that would let user data
 * close the script element, smuggle HTML comments, or insert line
 * terminators that prematurely end a JS string.
 *
 * Without this, a story body containing `</script>` would terminate
 * the JSON-LD block and allow following content to be parsed as HTML.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp('\\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\\u2029', 'g'), '\\u2029')
}

/**
 * Split story body text into logical paragraphs.
 *
 * Rules:
 * - Normalizes Windows newlines to `\n`
 * - Treats one or more blank lines (optionally containing spaces) as a paragraph separator
 * - Trims each paragraph and removes empty paragraphs
 */
export function splitIntoParagraphs(body: string): string[] {
  if (!body) {
    return []
  }

  const normalized = body.replace(/\r\n/g, '\n').trim()
  if (!normalized) {
    return []
  }

  return normalized
    .split(/\n\s*\n+/)
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
}
