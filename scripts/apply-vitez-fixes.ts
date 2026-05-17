import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { calculateReadingTime } from '../lib/utils'

interface Update {
  id: string
  title?: string
  bodyPath: string
}

const updates: Update[] = [
  {
    id: '3db6dc76-b5b3-4a36-bf0c-1920e60ac8bb', // Ogledalce
    bodyPath: '/tmp/vitez-review/fixed/06_Ogledalce.txt',
  },
  {
    id: '7ddd9971-7e41-43cb-8224-154c8985cc75', // O zecu …
    title: 'O zecu koji se volio smijati',
    bodyPath: '/tmp/vitez-review/fixed/04_O_zecu_koji_se_volio_smijati.txt',
  },
]

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)
const now = new Date().toISOString()

const tx = db.transaction(() => {
  for (const u of updates) {
    const body = fs.readFileSync(u.bodyPath, 'utf8').trim()
    if (u.title) {
      db.prepare('UPDATE stories SET title = ?, body = ?, updatedAt = ? WHERE id = ?')
        .run(u.title, body, now, u.id)
    } else {
      db.prepare('UPDATE stories SET body = ?, updatedAt = ? WHERE id = ?')
        .run(body, now, u.id)
    }
    const row = db.prepare('SELECT title, length(body) AS chars FROM stories WHERE id = ?').get(u.id) as { title: string; chars: number }
    const readingTime = calculateReadingTime(body)
    console.log(`✓ ${u.id.slice(0, 8)}  ${row.title}  (${row.chars} chars, ~${readingTime} min naglas)`)
  }
})

tx()
db.close()
