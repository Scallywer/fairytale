import 'dotenv/config'
import { dbHelpers } from '../lib/db'
import fs from 'fs'

// Copy of createStoryPrompt function to review prompts
function createStoryPrompt(title: string, body: string): string {
  // Extract first few paragraphs for context
  const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0] || body.substring(0, 300)
  
  // Extract main character names from Croatian text patterns
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
  
  // Determine setting and key visual elements
  const bodyLower = body.toLowerCase()
  let setting = ''
  const keyElements: string[] = []
  
  // Detect setting (order matters - more specific first)
  if (bodyLower.includes('savana') || bodyLower.includes('savani') || bodyLower.includes('afrički') || bodyLower.includes('lav')) {
    setting = 'African savanna'
    keyElements.push('lions', 'grasslands', 'sunset')
  } else if (bodyLower.includes('cirkus') || bodyLower.includes('circus') || bodyLower.includes('slonica')) {
    setting = 'circus tent'
    keyElements.push('circus', 'elephants', 'tent')
  } else if (bodyLower.includes('sirena') || bodyLower.includes('podvodno') || bodyLower.includes('koraljnog grebena') || bodyLower.includes('atlantika')) {
    setting = 'underwater ocean'
    keyElements.push('water', 'sea creatures', 'coral')
  } else if (bodyLower.includes('more') || bodyLower.includes('ocean') || bodyLower.includes('riba') || bodyLower.includes('ribe')) {
    setting = 'underwater ocean'
    keyElements.push('water', 'sea creatures', 'coral')
  } else if (bodyLower.includes('otok') || bodyLower.includes('motunui')) {
    setting = 'tropical island'
    keyElements.push('island', 'ocean', 'palm trees')
  } else if (bodyLower.includes('kraljevstvo') || bodyLower.includes('dvorac') || bodyLower.includes('palača') || bodyLower.includes('agrabah')) {
    setting = 'magical kingdom or castle'
    keyElements.push('castle', 'royal', 'grand architecture')
  } else if (bodyLower.includes('zagreb') || (bodyLower.includes('grad') && !bodyLower.includes('selo'))) {
    setting = 'city skyline at night'
    keyElements.push('city lights', 'stars', 'buildings')
  } else if (bodyLower.includes('šuma') || bodyLower.includes('šumi') || bodyLower.includes('šumu')) {
    setting = 'magical forest'
    keyElements.push('trees', 'nature', 'mystery')
  } else if (bodyLower.includes('selo') || bodyLower.includes('selu') || bodyLower.includes('radionici') || bodyLower.includes('talijanskog')) {
    setting = 'peaceful village'
    keyElements.push('village', 'houses', 'countryside')
  } else if (bodyLower.includes('meksičk') || bodyLower.includes('mexico')) {
    setting = 'Mexican village'
    keyElements.push('village', 'colorful houses', 'guitars')
  } else if (bodyLower.includes('kolumbijsk') || bodyLower.includes('planinama')) {
    setting = 'mountain village'
    keyElements.push('village', 'mountains', 'magical house')
  } else {
    setting = 'magical world'
  }
  
  // Detect additional visual elements
  if (bodyLower.includes('zvijezda') || bodyLower.includes('zvijezde') || bodyLower.includes('mjesec')) {
    keyElements.push('night sky', 'stars', 'moon')
  }
  if (bodyLower.includes('cvijeće') || bodyLower.includes('cvijet')) {
    keyElements.push('flowers', 'garden')
  }
  if (bodyLower.includes('ptice') || bodyLower.includes('ptica')) {
    keyElements.push('birds')
  }
  if (bodyLower.includes('mačak') || bodyLower.includes('mačka')) {
    keyElements.push('cats')
  }
  if (bodyLower.includes('riba') || bodyLower.includes('ribe')) {
    keyElements.push('fish')
  }
  
  // Create story summary from first paragraph
  const summary = firstParagraph
    .replace(/\s+/g, ' ')
    .substring(0, 200)
    .trim()
    + (firstParagraph.length > 200 ? '...' : '')
  
  // Build character text
  const characterText = mainCharacters.length > 0 
    ? ` featuring the main character ${mainCharacters[0]}${mainCharacters.length > 1 ? ` and ${mainCharacters[1]}` : ''}` 
    : ''
  
  // Build key elements text
  const elementsText = keyElements.length > 0 
    ? ` Key visual elements: ${keyElements.slice(0, 5).join(', ')}.` 
    : ''
  
  return `A beautiful, magical illustration for a Croatian children's bedtime story titled "${title}".

Story summary: ${summary}

The illustration should depict ${setting}${characterText}.${elementsText}
The image should be warm, cozy, suitable for children ages 5-10, with a nighttime/dreamy bedtime story atmosphere.
Style: children's book illustration, soft colors, dreamy, magical, gentle and peaceful, bedtime aesthetic.
Dark mode friendly color palette with deep blues, purples, navy, slate, and warm amber/gold accents.
The illustration should evoke wonder, peace, and dreams, perfect for bedtime reading. No text, words, or letters in the image.`
}

async function main() {
  console.log('Reviewing prompts for all stories...\n')
  
  const allStories = dbHelpers.getAllStories()
  const prompts: { title: string; prompt: string }[] = []
  
  for (const story of allStories) {
    const prompt = createStoryPrompt(story.title, story.body)
    prompts.push({ title: story.title, prompt })
  }
  
  // Save to file
  const outputFile = 'prompt-review.txt'
  let output = `# DALL-E Prompt Review for All Stories\n\n`
  output += `Generated: ${new Date().toISOString()}\n`
  output += `Total stories: ${prompts.length}\n\n`
  output += `='.repeat(80)}\n\n`
  
  prompts.forEach((item, index) => {
    output += `\n${'='.repeat(80)}\n`
    output += `${index + 1}. ${item.title}\n`
    output += `${'='.repeat(80)}\n\n`
    output += item.prompt
    output += `\n\n`
  })
  
  fs.writeFileSync(outputFile, output, 'utf-8')
  console.log(`✓ Generated prompt review: ${outputFile}`)
  console.log(`\nFirst 5 prompts preview:\n`)
  
  prompts.slice(0, 5).forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.title}`)
    console.log(`${'─'.repeat(60)}`)
    console.log(item.prompt.substring(0, 300) + '...\n')
  })
  
  console.log(`\n✓ Review complete! Check ${outputFile} for all prompts.`)
}

main().catch(console.error)
