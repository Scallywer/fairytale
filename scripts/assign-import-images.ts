import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'stories.db')
const db = new Database(dbPath)

// Map image filenames to story titles
const imageMappings: Record<string, string> = {
  'Lutonjica_Toporko.png': 'Lutonjica Toporko i devet župančića',
  'Bijeli_jelen.png': 'Bijeli jelen',
  'Veli_Joze.png': 'Veli Jože',
  'Halugica.png': 'Halugica',
  'Jezeva_kucica.png': 'Ježeva kućica',
  'Macka_Tose.png': 'Doživljaji mačka Toše',
  'Bajka_o_bajci.png': 'Bajka o bajci',
  'Nebeski_zmaj.png': 'Nebeski zmaj',
  'Zvjezdani_vitez.png': 'Zvjezdani vitez',
  'Princ_od_ceznje.png': 'Princ od čežnje',
  'Plesna_haljina_zutog_maslacka.png': 'Plesna haljina žutog maslačka',
  'Kako_je_tisina_prosetala_gradom.png': 'Kako je tišina prošetala gradom',
  'Martin_Krpan.png': 'Martin Krpan'
}

function assignImages() {
  const importDir = path.join(process.cwd(), 'import')
  const imagesDir = path.join(process.cwd(), 'public', 'images')
  
  // Ensure images directory exists
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  
  const now = new Date().toISOString()
  const updateStmt = db.prepare('UPDATE stories SET imageUrl = ?, updatedAt = ? WHERE title = ?')
  
  let moved = 0
  let updated = 0
  let errors = 0
  
  console.log('Moving images and updating database...\n')
  
  for (const [imageFile, storyTitle] of Object.entries(imageMappings)) {
    const sourcePath = path.join(importDir, imageFile)
    const destPath = path.join(imagesDir, imageFile)
    const imageUrl = `/images/${imageFile}`
    
    try {
      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  Image not found: ${imageFile}`)
        errors++
        continue
      }
      
      // Move file to public/images
      if (fs.existsSync(destPath)) {
        console.log(`⚠️  Image already exists, overwriting: ${imageFile}`)
      }
      fs.copyFileSync(sourcePath, destPath)
      moved++
      
      // Update database
      const result = updateStmt.run(imageUrl, now, storyTitle)
      if (result.changes > 0) {
        console.log(`✓ "${storyTitle}" -> ${imageUrl}`)
        updated++
      } else {
        console.log(`⚠️  Story not found in database: "${storyTitle}"`)
        errors++
      }
    } catch (error) {
      console.error(`❌ Error processing ${imageFile}:`, error)
      errors++
    }
  }
  
  console.log(`\n✅ Summary:`)
  console.log(`   ${moved} images moved to public/images/`)
  console.log(`   ${updated} stories updated with image URLs`)
  if (errors > 0) {
    console.log(`   ${errors} errors encountered`)
  }
}

assignImages()
db.close()
