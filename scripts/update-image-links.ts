import 'dotenv/config'
import { dbHelpers } from '../lib/db'
import fs from 'fs'
import path from 'path'

// Story order based on story-prompts-list.txt (used only when no name-based match exists)
const storyOrder = [
  'Pinokio',
  'Dumbo',
  'Bambi',
  'Čarobna Obitelj Madrigal',
  'Coco',
  'Priča o Igračkama',
  'Moana',
  'Pronalaženje Nema',
  'Aladin',
  'Ljepotica i Zvijer',
  'Mala Sirena',
  'Kralj Lavova',
  'Moć prijateljstva',
  'Putovanje u Mjesečevu špilju',
  'Priča o dobroj vilici',
  'Tintilinčić i tajna livada',
  'Vesela lutka i tiha šuma',
  'Ruže i zmajevi',
  'Pepeljuga',
  'Crvenkapica',
  'Snjeguljica i sedam patuljaka',
  'Ivica i Marica',
  'Mačak Džingiskan i Miki Trasi',
  'Ptičji festival',
  'Slikar u šumi',
  'Pisac i princeza',
  'Dječak i šuma',
  'Lažeš, Melita',
  'Koko i duhovi',
  'Šestinski kišobran',
  'Pirgo',
  'Devojka postala iz pomaranče',
  'Sunce djever i Neva Nevičica',
  'Jagor',
  'Toporko lutalica i devet župančića',
  'Regoč',
  'Mali domić u staroj kući',
  'Zvijezda iznad Zagreba',
  'Bratac Jaglenac i sestrica Rutvica',
  'Ribar Palunko i njegova žena',
  'Kako je Potjeh tražio istinu',
  'Šuma Striborova',
  'Ogledalce',
  'Hrabri_krojac',
  'Mrav_dobrog_srca',
  'Pale_sam_na_svijetu',
  'Macak_u_cizmama',
  'Kraljica_pcela',
  'Pjetlic_zlatna_krijesta',
  'Mala_vila',
  'Stolicu_prostri_se',
  'Mudri_djecak',
  'Djed_i_unuk',
  'Vjerni_prijatelji',
  'Zlatna_ribica',
  'Mudra_kci',
  'Carobni_grah',
  'Hrabra_pastirica',
  'Djecak_i_baka',
  'Zvjezdani_dukati',
  'Mudra_baka_i_vuk',
]

/** Normalize for matching: spaces -> underscores, remove diacritics and punctuation, lowercase */
function normalizeTitle(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s]+/g, '_')
    .replace(/[^\p{L}\p{N}_]/gu, '') // remove punctuation and other non-letter/non-number (except _)
    .replace(/_+/g, '_')             // collapse multiple underscores
    .replace(/^_|_$/g, '')           // trim leading/trailing underscores
    .toLowerCase()
}

async function main() {
  console.log('Updating image links in database...\n')

  const allStories = dbHelpers.getAllStories()
  const imagesDir = path.join(process.cwd(), 'public', 'images')

  // Get all image files (keep original case)
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))

  console.log(`Found ${imageFiles.length} image files in public/images/`)
  console.log(`Found ${allStories.length} stories in database\n`)

  let updated = 0
  let byName = 0
  let byOrder = 0
  const db = require('../lib/db').default
  const storiesAlreadyAssigned = new Set<string>(
    allStories.filter(s => s.imageUrl).map(s => s.id)
  )
  const usedImageFiles = new Set<string>()

  // 1) Name-based: match image filename (without extension) to story title (normalized)
  for (const imageFile of imageFiles) {
    const baseName = path.basename(imageFile, path.extname(imageFile))
    const baseNormalized = normalizeTitle(baseName)
    const story = allStories.find(
      s => normalizeTitle(s.title) === baseNormalized
    )
    if (story) {
      const imageUrl = `/images/${imageFile}`
      db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?').run(
        imageUrl,
        new Date().toISOString(),
        story.id
      )
      storiesAlreadyAssigned.add(story.id)
      usedImageFiles.add(imageFile)
      console.log(`✓ [name] ${story.title} -> ${imageUrl}`)
      updated++
      byName++
    }
  }

  // 2) Order-based: assign remaining images by storyOrder position (for numbered images like 1-foo.png)
  const sortedByOrder = [...imageFiles]
    .filter(f => !usedImageFiles.has(f))
    .sort((a, b) => {
    const numA = parseInt(a.split(/[-_]/)[0], 10)
    const numB = parseInt(b.split(/[-_]/)[0], 10)
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB
    return 0
  })

  for (let i = 0, nextOrderImageIndex = 0; i < storyOrder.length; i++) {
    const storyTitle = storyOrder[i]
    const story = allStories.find(s => s.title === storyTitle)
    if (!story || storiesAlreadyAssigned.has(story.id)) continue
    if (nextOrderImageIndex >= sortedByOrder.length) continue

    const imageFile = sortedByOrder[nextOrderImageIndex]
    nextOrderImageIndex++
    const imageUrl = `/images/${imageFile}`
    db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?').run(
      imageUrl,
      new Date().toISOString(),
      story.id
    )
    console.log(`✓ [order] ${story.title} -> ${imageUrl}`)
    updated++
    byOrder++
  }

  console.log(`\n✓ Update complete!`)
  console.log(`  Updated: ${updated} (by name: ${byName}, by order: ${byOrder})`)
}

main().catch(console.error)
