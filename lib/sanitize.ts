/**
 * Sanitize user input by stripping HTML tags to prevent XSS.
 * React already escapes JSX text nodes, but this provides defense-in-depth
 * at the data layer before storage.
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

/**
 * Sanitize all string fields of an object (shallow, one level).
 */
export function sanitizeStrings<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj }
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      ;(result as Record<string, unknown>)[key] = stripHtmlTags(result[key] as string)
    }
  }
  return result
}
