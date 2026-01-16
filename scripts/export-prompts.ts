import 'dotenv/config'
import { dbHelpers } from '../lib/db'
import fs from 'fs'

// Helper to get English title where appropriate
function getEnglishTitle(croatianTitle: string, author: string): string {
  const disneyTitles: { [key: string]: string } = {
    'Pinokio': 'Pinocchio',
    'Dumbo': 'Dumbo',
    'Bambi': 'Bambi',
    'Čarobna Obitelj Madrigal': 'Encanto',
    'Coco': 'Coco',
    'Priča o Igračkama': 'Toy Story',
    'Moana': 'Moana',
    'Pronalaženje Nema': 'Finding Nemo',
    'Aladin': 'Aladdin',
    'Ljepotica i Zvijer': 'Beauty and the Beast',
    'Mala Sirena': 'The Little Mermaid',
    'Kralj Lavova': 'The Lion King',
  }
  
  const classicTales: { [key: string]: string } = {
    'Pepeljuga': 'Cinderella',
    'Crvenkapica': 'Little Red Riding Hood',
    'Snjeguljica i sedam patuljaka': 'Snow White and the Seven Dwarfs',
    'Ivica i Marica': 'Hansel and Gretel',
  }
  
  if (disneyTitles[croatianTitle]) return disneyTitles[croatianTitle]
  if (classicTales[croatianTitle]) return classicTales[croatianTitle]
  return croatianTitle
}

// Improved prompt function - no preset elements, English summaries
function createStoryPromptImproved(title: string, body: string, author: string): string {
  const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0] || body.substring(0, 300)
  
  // Extract main character names
  const mainCharacters: string[] = []
  const namePatterns = [
    /po imenu ([A-ZČĆŠĐŽ][a-zčćšđž]+)/g,
    /djevojčica po imenu ([A-ZČĆŠĐŽ][a-zčćšđž]+)/g,
    /dječak po imenu ([A-ZČĆŠĐŽ][a-zčćšđž]+)/g,
    /mladić po imenu ([A-ZČĆŠĐŽ][a-zčćšđž]+)/g,
    /mala ([A-ZČĆŠĐŽ][a-zčćšđž]+)/g,
  ]
  
  namePatterns.forEach(pattern => {
    const matches = body.match(pattern)
    if (matches) {
      matches.forEach(m => {
        const name = m.replace(/(po imenu |djevojčica po imenu |dječak po imenu |mladić po imenu |mala )/gi, '').trim()
        if (name && name.length > 2 && !mainCharacters.includes(name)) {
          mainCharacters.push(name)
        }
      })
    }
  })
  
  // Get English title
  const englishTitle = getEnglishTitle(title, author)
  
  // Create English summary (placeholder - needs translation)
  const croatianSummary = firstParagraph
    .replace(/\s+/g, ' ')
    .substring(0, 300)
    .trim()
  
  // For now, create a placeholder that user can manually translate
  // User will need to fill in English summaries manually
  const englishSummary = `[English summary needed - Croatian text: ${croatianSummary.substring(0, 200)}...]`
  
  // Build character text (keep characters as they are)
  const characterText = mainCharacters.length > 0 
    ? ` featuring the main character ${mainCharacters[0]}${mainCharacters.length > 1 ? ` and ${mainCharacters[1]}` : ''}` 
    : ''
  
  return `A beautiful, magical illustration for a Croatian children's bedtime story titled "${englishTitle}".

Story summary: ${englishSummary}

The illustration should depict the scene from the story${characterText}.
The image should be warm, cozy, suitable for children ages 5-10, with a nighttime/dreamy bedtime story atmosphere.
Style: children's book illustration, soft colors, dreamy, magical, gentle and peaceful, bedtime aesthetic.
Dark mode friendly color palette with deep blues, purples, navy, slate, and warm amber/gold accents.
The illustration should evoke wonder, peace, and dreams, perfect for bedtime reading. No text, words, or letters in the image.`
}

async function main() {
  console.log('Exporting prompts for all stories...\n')
  
  const allStories = dbHelpers.getAllStories()
  const prompts: { title: string; englishTitle: string; author: string; prompt: string }[] = []
  
  for (const story of allStories) {
    const englishTitle = getEnglishTitle(story.title, story.author)
    const prompt = createStoryPromptImproved(story.title, story.body, story.author)
    prompts.push({ title: story.title, englishTitle, author: story.author, prompt })
  }
  
  // Save to file
  const outputFile = 'story-prompts-list.txt'
  let output = `# DALL-E Prompts for All Stories\n\n`
  output += `Generated: ${new Date().toISOString()}\n`
  output += `Total stories: ${prompts.length}\n`
  output += `\nNOTE: English summaries need to be filled in manually. Current summaries show "[English summary needed]" with Croatian text.\n`
  output += `${'='.repeat(80)}\n\n`
  
  prompts.forEach((item, index) => {
    output += `\n${'='.repeat(80)}\n`
    output += `${index + 1}. ${item.englishTitle}\n`
    if (item.title !== item.englishTitle) {
      output += `   (Original Croatian: ${item.title})\n`
    }
    output += `   Author: ${item.author}\n`
    output += `${'='.repeat(80)}\n\n`
    output += item.prompt
    output += `\n\n`
  })
  
  fs.writeFileSync(outputFile, output, 'utf-8')
  console.log(`✓ Exported prompts to: ${outputFile}`)
  console.log(`\nTotal stories: ${prompts.length}`)
  console.log(`\nNOTE: English summaries are placeholders. Please fill them in manually with proper English translations.`)
}

main().catch(console.error)
