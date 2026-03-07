/**
 * Shared logic for validating story → image mapping.
 * Used by scripts/investigate-image-mapping.ts and tests.
 */
import path from 'path'
import fs from 'fs'

export interface StoryRow {
  id: string
  title: string
  imageUrl: string | null
}

/** Normalize for matching: spaces -> underscores, remove diacritics and punctuation, lowercase */
export function normalizeTitle(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s]+/g, '_')
    .replace(/[^\p{L}\p{N}_]/gu, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()
}

/** Strip leading number from filename for matching (e.g. "38_ZvijezdaIznadZagreba" -> "zvijezdaiznadzagreba") */
export function normalizedBaseName(filename: string): string {
  const base = path.basename(filename, path.extname(filename))
  const withoutNumber = base.replace(/^\d+[-_]?/, '')
  return normalizeTitle(withoutNumber)
}

/** Strip " (ažurirano)" suffix then normalize (for matching DB titles to images). */
export function normalizeStoryTitle(title: string): string {
  const withoutSuffix = title.replace(/\s*\(ažurirano\)\s*$/i, '').trim()
  return normalizeTitle(withoutSuffix)
}

export function exactMatch(storyTitle: string, imageFile: string): boolean {
  return normalizeStoryTitle(storyTitle) === normalizedBaseName(imageFile)
}

/** Which story title (if any) does this image file belong to? */
export function getStoryTitleForImage(
  imageFile: string,
  stories: StoryRow[]
): string | null {
  const fileNorm = normalizedBaseName(imageFile)
  for (const row of stories) {
    if (normalizeStoryTitle(row.title) === fileNorm) return row.title
  }
  return null
}

export function getExpectedImage(
  storyTitle: string,
  imageFiles: string[]
): string | null {
  for (const file of imageFiles) {
    if (exactMatch(storyTitle, file)) return file
  }
  return null
}

export interface ValidationResult {
  ok: Array<{ story: StoryRow; image: string }>
  missing: StoryRow[]
  broken: Array<{ story: StoryRow; current: string }>
  mismatched: Array<{ story: StoryRow; current: string; expected: string }>
  wrong: Array<{ story: StoryRow; current: string; imageBelongsTo: string }>
}

/**
 * Validate story → image mapping.
 * @param stories - Stories with id, title, imageUrl
 * @param imageFiles - List of image filenames in public/images
 * @param publicDir - Path to public directory (for checking file existence)
 */
export function validateImageMapping(
  stories: StoryRow[],
  imageFiles: string[],
  publicDir: string
): ValidationResult {
  const result: ValidationResult = {
    ok: [],
    missing: [],
    broken: [],
    mismatched: [],
    wrong: [],
  }

  for (const row of stories) {
    const currentPath = row.imageUrl ? row.imageUrl.replace(/^\//, '') : null
    const currentFile = currentPath ? path.basename(currentPath) : null
    const fullPath = currentPath
      ? path.join(publicDir, currentPath)
      : null
    const fileExists = fullPath ? fs.existsSync(fullPath) : false
    const expectedFile = getExpectedImage(row.title, imageFiles)
    const currentImageBelongsTo = currentFile
      ? getStoryTitleForImage(currentFile, stories)
      : null

    if (!currentFile || !row.imageUrl) {
      result.missing.push(row)
      continue
    }
    if (!fileExists) {
      result.broken.push({ story: row, current: row.imageUrl })
      continue
    }
    if (expectedFile && currentFile !== expectedFile) {
      result.mismatched.push({
        story: row,
        current: row.imageUrl,
        expected: expectedFile,
      })
      continue
    }
    if (currentImageBelongsTo && currentImageBelongsTo !== row.title) {
      result.wrong.push({
        story: row,
        current: row.imageUrl,
        imageBelongsTo: currentImageBelongsTo,
      })
      continue
    }
    result.ok.push({ story: row, image: currentFile })
  }

  return result
}

/** Format validation errors for assertion messages */
export function formatValidationErrors(result: ValidationResult): string {
  const lines: string[] = []
  if (result.broken.length) {
    lines.push('BROKEN (file missing):')
    result.broken.forEach(
      ({ story, current }) =>
        lines.push(`  - "${story.title}" → ${current}`)
    )
  }
  if (result.mismatched.length) {
    lines.push('MISMATCHED (wrong image assigned):')
    result.mismatched.forEach(
      ({ story, current, expected }) =>
        lines.push(
          `  - "${story.title}" has ${path.basename(current)}, expected ${expected}`
        )
    )
  }
  if (result.wrong.length) {
    lines.push('WRONG (image belongs to another story):')
    result.wrong.forEach(
      ({ story, current, imageBelongsTo }) =>
        lines.push(
          `  - "${story.title}" has ${path.basename(current)} (belongs to "${imageBelongsTo}")`
        )
    )
  }
  return lines.join('\n')
}
