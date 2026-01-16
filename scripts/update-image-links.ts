import 'dotenv/config'
import { dbHelpers } from '../lib/db'
import fs from 'fs'
import path from 'path'

// Story order based on story-prompts-list.txt
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
]

async function main() {
  console.log('Updating image links in database...\n')
  
  const allStories = dbHelpers.getAllStories()
  const imagesDir = path.join(process.cwd(), 'public', 'images')
  
  // Get all image files (keep original case)
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.split('_')[0]) || 0
      const numB = parseInt(b.split('_')[0]) || 0
      return numA - numB
    })
  
  console.log(`Found ${imageFiles.length} image files in public/images/`)
  console.log(`Found ${allStories.length} stories in database\n`)
  
  let updated = 0
  let notFound = 0
  
  // Match stories to images based on story order
  for (let i = 0; i < storyOrder.length; i++) {
    const storyTitle = storyOrder[i]
    const story = allStories.find(s => s.title === storyTitle)
    
    if (!story) {
      console.log(`✗ [${i + 1}] Story not found: ${storyTitle}`)
      notFound++
      continue
    }
    
    if (i >= imageFiles.length) {
      console.log(`✗ [${i + 1}] ${story.title} -> No image file at index ${i + 1}`)
      notFound++
      continue
    }
    
    const imageFile = imageFiles[i]
    const imageUrl = `/images/${imageFile}`
    
    // Update database
    const db = require('../lib/db').default
    db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?').run(
      imageUrl,
      new Date().toISOString(),
      story.id
    )
    
    console.log(`✓ [${i + 1}] ${story.title} -> ${imageUrl}`)
    updated++
  }
  
  console.log(`\n✓ Update complete!`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Not found: ${notFound}`)
}

main().catch(console.error)
