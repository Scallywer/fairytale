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

  // Count words by splitting on whitespace and filtering empty strings
  const words = body.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length

  // Calculate reading time: round up to nearest minute, minimum 1 minute
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  return readingTime
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