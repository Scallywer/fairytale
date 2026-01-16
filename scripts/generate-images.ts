import 'dotenv/config'
import { dbHelpers } from '../lib/db'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import axios from 'axios'

// Generate a beautiful colored placeholder image locally
async function generateColoredImage(title: string, index: number): Promise<string> {
  // Color palette for bedtime stories - deep, warm colors
  const colors = [
    { bg: '#1e293b', text: '#fbbf24' }, // slate-900 / amber-400
    { bg: '#0f172a', text: '#fcd34d' }, // slate-900 / amber-300
    { bg: '#1e3a8a', text: '#fbbf24' }, // blue-900 / amber-400
    { bg: '#1e293b', text: '#f59e0b' }, // slate-900 / amber-500
    { bg: '#0c4a6e', text: '#fbbf24' }, // sky-900 / amber-400
    { bg: '#1e293b', text: '#facc15' }, // slate-900 / yellow-400
    { bg: '#1c1917', text: '#fbbf24' }, // stone-900 / amber-400
    { bg: '#1e293b', text: '#eab308' }, // slate-900 / yellow-500
    { bg: '#0f172a', text: '#f59e0b' }, // slate-900 / amber-500
    { bg: '#1e3a8a', text: '#fcd34d' }, // blue-900 / amber-300
  ]
  
  const color = colors[index % colors.length]
  const firstLetter = title.charAt(0).toUpperCase()
  const shortTitle = title.substring(0, 20)
  
  const imagePath = path.join(process.cwd(), 'public', 'images', 'stories', `${index + 1}-${title.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`)
  
  // Create SVG with the story title
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${color.bg}"/>
      <circle cx="200" cy="150" r="60" fill="${color.text}" opacity="0.3"/>
      <text x="200" y="160" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${color.text}" text-anchor="middle">${firstLetter}</text>
      <text x="200" y="280" font-family="Arial, sans-serif" font-size="24" fill="${color.text}" text-anchor="middle" opacity="0.9">${shortTitle}</text>
    </svg>
  `
  
  // Convert SVG to JPG using sharp
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(imagePath)
  
  return `/images/stories/${path.basename(imagePath)}`
}

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

// Simple helper to create English summary (placeholder - would need proper translation API)
function createEnglishSummary(croatianText: string): string {
  // For now, return placeholder that indicates it needs English summary
  // User can manually edit or we can integrate translation API
  return `[English summary needed for Croatian story] ${croatianText.substring(0, 150)}...`
}

// Generate a story-specific prompt based on story content
function createStoryPrompt(title: string, body: string, author?: string): string {
  // Extract first few paragraphs for context
  const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0] || body.substring(0, 300)
  const secondParagraph = paragraphs[1] || ''
  
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
  
  // Get English title
  const englishTitle = getEnglishTitle(title, author || '')
  
  // Create English summary (placeholder - needs translation)
  const croatianSummary = firstParagraph
    .replace(/\s+/g, ' ')
    .substring(0, 300)
    .trim()
  
  // For now, create a basic English summary placeholder
  // User will need to manually translate or integrate translation API
  const englishSummary = `[English summary needed] ${croatianSummary.substring(0, 200)}...`
  
  // Build character text
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

// Generate image using OpenAI DALL-E
async function generateImageWithOpenAI(title: string, index: number, storyBody?: string, author?: string): Promise<string | null> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) {
    return null
  }

  try {
    // Create a detailed prompt based on the story content
    const prompt = storyBody 
      ? createStoryPrompt(title, storyBody, author)
      : `A beautiful, magical illustration for a Croatian children's bedtime story titled "${title}". 
    The image should be warm, cozy, suitable for children ages 5-10, with a nighttime/dreamy atmosphere. 
    Style: children's book illustration, soft colors, dreamy, magical, bedtime story aesthetic. 
    Dark mode friendly with deep blues, purples, and warm amber/gold accents. 
    The illustration should evoke wonder and peace, perfect for bedtime reading.`

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
        timeout: 60000, // 60 second timeout
      }
    )

    const imageUrl = response.data.data[0].url
    
    // Download and save the image
    console.log(`  Downloading image...`)
    const imageResponse = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 30000 
    })
    
    const imagePath = path.join(process.cwd(), 'public', 'images', 'stories', `${index + 1}-${title.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`)
    
    fs.writeFileSync(imagePath, imageResponse.data)
    return `/images/stories/${path.basename(imagePath)}`
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message
    console.error(`  ✗ OpenAI error:`, errorMessage)
    
    // If rate limited, suggest waiting
    if (errorMessage.includes('Rate limit') || errorMessage.includes('rate limit')) {
      console.log(`  ⚠ Rate limit hit. DALL-E 3 allows 5 images per minute.`)
      console.log(`  ⚠ The script will wait 12 seconds between requests.`)
    }
    
    return null
  }
}

async function main() {
  console.log('Generating images for stories missing images...')
  
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY
  if (hasOpenAIKey) {
    console.log('Using OpenAI DALL-E 3 for AI-generated images')
    console.log('Rate limit: 5 images per minute (12 seconds between requests)\n')
  } else {
    console.log('Using local image generation (colored placeholders)\n')
  }
  
  const allStories = dbHelpers.getAllStories()
  
  // Filter stories that are missing images or have placeholder images
  const storiesNeedingImages = allStories.filter(story => 
    !story.imageUrl || 
    story.imageUrl.includes('placehold.co') ||
    !fs.existsSync(path.join(process.cwd(), 'public', story.imageUrl.replace(/^\//, '')))
  )
  
  console.log(`Found ${allStories.length} total stories`)
  console.log(`Stories needing images: ${storiesNeedingImages.length}\n`)

  if (storiesNeedingImages.length === 0) {
    console.log('All stories already have images!')
    return
  }

  // Ensure images directory exists
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'stories')
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  let successCount = 0
  let failCount = 0
  let lastRequestTime = 0

  for (let i = 0; i < storiesNeedingImages.length; i++) {
    const story = storiesNeedingImages[i]
    const originalIndex = allStories.findIndex(s => s.id === story.id)
    console.log(`[${i + 1}/${storiesNeedingImages.length}] Processing: ${story.title}`)
    
    let imagePath: string | null = null

    try {
      // Try OpenAI first if API key is available
      if (hasOpenAIKey) {
        // Wait before making request if needed (DALL-E 3: 5 images per minute = 12 seconds between requests)
        const now = Date.now()
        const timeSinceLastRequest = now - lastRequestTime
        const minWaitTime = 12000 // 12 seconds (allows 5 images per minute)
        
        if (timeSinceLastRequest < minWaitTime && lastRequestTime > 0) {
          const waitTime = minWaitTime - timeSinceLastRequest
          console.log(`  Waiting ${Math.ceil(waitTime / 1000)} seconds (rate limit: 5 images/min)...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
        
        lastRequestTime = Date.now()
        // Pass story body and author to create better prompts
        imagePath = await generateImageWithOpenAI(story.title, originalIndex, story.body, story.author)
        
        // If successful, wait before next request (12 seconds for rate limit)
        if (imagePath) {
          console.log(`  Waiting 12 seconds before next request (rate limit: 5 images/min)...`)
          await new Promise(resolve => setTimeout(resolve, 12000))
          lastRequestTime = Date.now()
        } else {
          // If failed due to rate limit, wait a bit longer
          await new Promise(resolve => setTimeout(resolve, 5000))
        }
      }
      
      // Fallback to local colored image generation
      if (!imagePath) {
        imagePath = await generateColoredImage(story.title, originalIndex)
      }

      if (imagePath) {
        // Update database with new image path
        const db = require('../lib/db').default
        db.prepare('UPDATE stories SET imageUrl = ? WHERE id = ?').run(imagePath, story.id)
        console.log(`  ✓ Generated and saved: ${imagePath}`)
        successCount++
      } else {
        console.log(`  ✗ Failed to generate image`)
        failCount++
      }
    } catch (error) {
      console.error(`  ✗ Error:`, error)
      failCount++
    }
  }

  console.log(`\n✓ Image generation complete!`)
  console.log(`  Success: ${successCount}, Failed: ${failCount}`)
  console.log(`  Images saved to: public/images/stories/`)
  if (hasOpenAIKey && storiesNeedingImages.length > 0) {
    const estimatedTime = Math.ceil((storiesNeedingImages.length * 12) / 60)
    console.log(`  Estimated time: ~${estimatedTime} minutes`)
  }
}

main().catch(console.error)
