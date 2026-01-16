import 'dotenv/config'
import { dbHelpers } from '../lib/db'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

// Import the prompt creation function from generate-images
function createStoryPrompt(title: string, body: string): string {
  const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0] || body.substring(0, 300)
  
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
  
  const bodyLower = body.toLowerCase()
  let setting = ''
  const keyElements: string[] = []
  
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
  
  const summary = firstParagraph
    .replace(/\s+/g, ' ')
    .substring(0, 200)
    .trim()
    + (firstParagraph.length > 200 ? '...' : '')
  
  const characterText = mainCharacters.length > 0 
    ? ` featuring the main character ${mainCharacters[0]}${mainCharacters.length > 1 ? ` and ${mainCharacters[1]}` : ''}` 
    : ''
  
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

async function generateImageWithOpenAI(title: string, storyBody: string, index: number): Promise<string | null> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) {
    console.log('  ⚠ No OpenAI API key found')
    return null
  }

  try {
    const prompt = createStoryPrompt(title, storyBody)
    console.log(`  Generating with DALL-E...`)
    console.log(`  Prompt preview: ${prompt.substring(0, 200).replace(/\n/g, ' ')}...`)

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    )

    const imageUrl = response.data.data[0].url
    
    console.log(`  Downloading image...`)
    const imageResponse = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 30000 
    })
    
    const fileName = `${index + 1}-${title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}.jpg`
    const imagePath = path.join(process.cwd(), 'public', 'images', 'stories', fileName)
    
    fs.writeFileSync(imagePath, imageResponse.data)
    return `/images/stories/${fileName}`
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message
    console.error(`  ✗ OpenAI error:`, errorMessage)
    return null
  }
}

async function main() {
  const storyTitles = process.argv.slice(2)
  
  if (storyTitles.length === 0) {
    console.log('Usage: npm run regenerate-specific -- "Story Title 1" "Story Title 2" ...')
    console.log('\nOr regenerating first 3 stories by default...\n')
    
    // Get first 3 stories by creation date
    const allStories = dbHelpers.getAllStories()
    const firstThree = allStories
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, 3)
    
    console.log('Regenerating images for first 3 stories:')
    firstThree.forEach((s, i) => console.log(`  ${i + 1}. ${s.title}`))
    console.log('')
    
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    if (!hasOpenAIKey) {
      console.log('⚠ No OpenAI API key found. Please set OPENAI_API_KEY in .env')
      return
    }
    
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'stories')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }
    
    let successCount = 0
    let failCount = 0
    let lastRequestTime = 0
    const minWaitTime = 12000 // 12 seconds for 5 images per minute
    
    for (let i = 0; i < firstThree.length; i++) {
      const story = firstThree[i]
      const originalIndex = allStories.findIndex(s => s.id === story.id)
      
      console.log(`[${i + 1}/${firstThree.length}] Processing: ${story.title}`)
      
      // Delete old image if exists
      if (story.imageUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', story.imageUrl.replace(/^\//, ''))
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
          console.log(`  ✓ Deleted old image: ${story.imageUrl}`)
        }
      }
      
      try {
        // Wait for rate limit
        const now = Date.now()
        const timeSinceLastRequest = now - lastRequestTime
        
        if (timeSinceLastRequest < minWaitTime && lastRequestTime > 0) {
          const waitTime = minWaitTime - timeSinceLastRequest
          console.log(`  Waiting ${Math.ceil(waitTime / 1000)} seconds (rate limit: 5 images/min)...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
        
        lastRequestTime = Date.now()
        const imagePath = await generateImageWithOpenAI(story.title, story.body, originalIndex)
        
        if (imagePath) {
          // Update database
          const db = require('../lib/db').default
          db.prepare('UPDATE stories SET imageUrl = ? WHERE id = ?').run(imagePath, story.id)
          console.log(`  ✓ Generated and saved: ${imagePath}`)
          successCount++
          
          // Wait before next request
          if (i < firstThree.length - 1) {
            console.log(`  Waiting 12 seconds before next request...`)
            await new Promise(resolve => setTimeout(resolve, 12000))
            lastRequestTime = Date.now()
          }
        } else {
          console.log(`  ✗ Failed to generate image`)
          failCount++
        }
      } catch (error) {
        console.error(`  ✗ Error:`, error)
        failCount++
      }
    }
    
    console.log(`\n✓ Regeneration complete!`)
    console.log(`  Success: ${successCount}, Failed: ${failCount}`)
  }
}

main().catch(console.error)
