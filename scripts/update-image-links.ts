import 'dotenv/config'
import { storiesService } from '../lib/storiesService'
import fs from 'fs'
import path from 'path'
import { normalizedBaseName, normalizeTitle, normalizeStoryTitle } from '../lib/image-mapping'

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

/** Story titles that use different image filenames (e.g. English/alternate spelling). Map: story title -> image filename. */
const storyTitleToImage: Record<string, string> = {
  'Pinokio': '1_Pinocchio.png',
  'Čarobna Obitelj Madrigal': '4_Encanto.png',
  'Priča o Igračkama': '6_ToyStory.png',
  'Pronalaženje Nema': '8_FindingNemo.png',
  'Aladin': '9_Aladdin.png',
  'Ljepotica i Zvijer': '10_BeautyAndTheBeast.png',
  'Mala Sirena': '11_TheLittleMermaid.png',
  'Kralj Lavova': '12_TheLionKing.png',
  'Pepeljuga': '19_Cindarella.png',
  'Crvenkapica': '20_LittleRedRidingHood.png',
  'Snjeguljica i sedam patuljaka': '21_SnowWhite.png',
  'Ivica i Marica': '22_HanselAndGretel.png',
  'Devojka postala iz pomaranče': '32_DjevojkaNastalaIzNarance.png',
  'Toporko lutalica i devet župančića': '35_ToporkoLutalica.png',
  'Mali domić u staroj kući': '37_MaliDomicUStarojKuci.png',
  'Zvijezda iznad Zagreba': '38_ZvijezdaIznadZagreba.png',
}

async function main() {

  const allStories = storiesService.getAllStories()
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
  // Start empty so name-based phase can overwrite wrong assignments; only stories we assign get added
  const storiesAlreadyAssigned = new Set<string>()
  const usedImageFiles = new Set<string>()

  // 1a) Manual map: story title -> image filename (for Disney/English filenames that don't match by normalization)
  const imageFileSet = new Set(imageFiles)
  for (const [storyTitle, imageFile] of Object.entries(storyTitleToImage)) {
    if (!imageFileSet.has(imageFile)) continue
    const story = allStories.find(s => s.title === storyTitle)
    if (!story || storiesAlreadyAssigned.has(story.id)) continue
    const imageUrl = `/images/${imageFile}`
    db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE id = ?').run(
      imageUrl,
      new Date().toISOString(),
      story.id
    )
    storiesAlreadyAssigned.add(story.id)
    usedImageFiles.add(imageFile)
    console.log(`✓ [map] ${story.title} -> ${imageUrl}`)
    updated++
    byName++
  }

  // 1b) Name-based: match image filename to story title (strip leading number from filename, e.g. 31_Pirgo.png -> Pirgo)
  for (const imageFile of imageFiles) {
    if (usedImageFiles.has(imageFile)) continue
    const baseNormalized = normalizedBaseName(imageFile)
    const story = allStories.find(
      s => normalizeStoryTitle(s.title) === baseNormalized
    )
    if (story && !storiesAlreadyAssigned.has(story.id)) {
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
