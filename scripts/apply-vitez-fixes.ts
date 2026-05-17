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
    id: '9beb3144-9dec-4ef5-bf81-4baeabf217c0', // Bajka o glinenoj ptici
    bodyPath: '/tmp/vitez-review/fixed/01_Bajka_o_glinenoj_ptici.txt',
  },
  {
    id: '818998a3-f655-4dc1-ae69-0dbc74210fef', // Priča o Suncu
    bodyPath: '/tmp/vitez-review/fixed/02_Priča_o_Suncu.txt',
  },
  {
    id: '78547629-b896-4bc3-abca-324321803efb', // Olovka iz sna
    bodyPath: '/tmp/vitez-review/fixed/03_Olovka_iz_sna.txt',
  },
  {
    id: '7ddd9971-7e41-43cb-8224-154c8985cc75', // O zecu koji se volio smijati
    title: 'O zecu koji se volio smijati',
    bodyPath: '/tmp/vitez-review/fixed/04_O_zecu_koji_se_volio_smijati.txt',
  },
  {
    id: '0a4b6911-1b72-4b56-8bce-c068e3d2e866', // Razbojnik sa žutom pjegom
    bodyPath: '/tmp/vitez-review/fixed/05_Razbojnik_sa_žutom_pjegom.txt',
  },
  {
    id: '3db6dc76-b5b3-4a36-bf0c-1920e60ac8bb', // Ogledalce
    bodyPath: '/tmp/vitez-review/fixed/06_Ogledalce.txt',
  },
  {
    id: '1ea2f8bd-7ac1-48c5-ac4d-82854c7cf991', // Kad bi drveće hodalo
    bodyPath: '/tmp/vitez-review/fixed/07_Kad_bi_drveće_hodalo.txt',
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
    console.log(`✓ ${u.id.slice(0, 8)}  ${row.title.padEnd(34)}  (${row.chars} chars, ~${readingTime} min naglas)`)
  }
})

tx()
db.close()
