/**
 * Helpers for maintenance scripts: single place for "all stories", "stories missing images", etc.
 */
import fs from 'fs'
import path from 'path'
import type { Story } from './db'
import { storiesService } from './storiesService'

export function getAllStories(): Story[] {
  return storiesService.getAllStories()
}

export function getStoriesMissingImages(): Story[] {
  return getAllStories().filter((s) => !s.imageUrl || s.imageUrl.trim() === '')
}

export function getImagesDir(): string {
  return path.join(process.cwd(), 'public', 'images')
}

export function getImageFiles(): string[] {
  const dir = getImagesDir()
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => /\.(png|jpg|jpeg)$/i.test(f))
}

export function imageFileExists(relativePath: string): boolean {
  const full = path.join(process.cwd(), 'public', relativePath.replace(/^\//, ''))
  return fs.existsSync(full)
}
