/**
 * Git-rename image files under public/images/ to full lowercase basenames.
 * Fixes Linux/Docker: DB imageUrl uses lowercase slugs; mixed-case filenames 404.
 *
 * Usage: node scripts/lowercase-public-image-filenames.mjs
 */
import { execSync } from 'node:child_process'
import path from 'node:path'

const root = process.cwd()
const files = execSync('git ls-files public/images/', {
  encoding: 'utf8',
  cwd: root,
})
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)

const byLower = new Map()
for (const f of files) {
  const base = path.basename(f)
  const low = base.toLowerCase()
  const prev = byLower.get(low)
  if (prev && prev !== base) {
    console.error(`Collision for ${low}: ${prev} vs ${base}`)
    process.exit(1)
  }
  byLower.set(low, base)
}

let n = 0
for (const from of files) {
  const base = path.basename(from)
  const lower = base.toLowerCase()
  if (base === lower) continue
  const to = path.posix.join('public/images', lower)
  const relFrom = from.replace(/\\/g, '/')
  const relTo = to
  if (relFrom.toLowerCase() === relTo.toLowerCase()) {
    const tmp = path.posix.join(
      'public/images',
      `._tmp_case_${process.pid}_${Date.now()}${path.extname(base)}`
    )
    execSync(`git mv "${relFrom}" "${tmp}"`, { cwd: root, stdio: 'inherit' })
    execSync(`git mv "${tmp}" "${relTo}"`, { cwd: root, stdio: 'inherit' })
  } else {
    execSync(`git mv "${relFrom}" "${relTo}"`, { cwd: root, stdio: 'inherit' })
  }
  n++
  console.log(`${base} → ${lower}`)
}

console.log(`\nRenamed ${n} file(s).`)
