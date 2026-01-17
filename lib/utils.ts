/**
 * Calculate reading time in minutes based on word count
 * @param body - The story text content
 * @param wordsPerMinute - Reading speed (default: 200 words/min for adults)
 * @returns Reading time in minutes (minimum 1 minute)
 */
export function calculateReadingTime(body: string, wordsPerMinute: number = 200): number {
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
