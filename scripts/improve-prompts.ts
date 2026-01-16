// Helper function to translate title to English where appropriate
function getEnglishTitle(croatianTitle: string, author: string): string {
  // Disney stories should be in English
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
  
  // Classic fairy tales also in English
  const classicTales: { [key: string]: string } = {
    'Pepeljuga': 'Cinderella',
    'Crvenkapica': 'Little Red Riding Hood',
    'Snjeguljica i sedam patuljaka': 'Snow White and the Seven Dwarfs',
    'Ivica i Marica': 'Hansel and Gretel',
  }
  
  if (disneyTitles[croatianTitle]) {
    return disneyTitles[croatianTitle]
  }
  
  if (classicTales[croatianTitle]) {
    return classicTales[croatianTitle]
  }
  
  // Keep Croatian title if not translated
  return croatianTitle
}

// Helper function to translate story summary to English
function translateSummaryToEnglish(summary: string): string {
  // This is a placeholder - in a real scenario, you'd use a translation API
  // For now, we'll keep it simple and just return a note that this needs translation
  // The user can manually update or we can improve this later
  
  // For now, return the Croatian summary - user will need to translate
  // But we'll add a comment that it should be in English
  return summary + ' [NEEDS TRANSLATION TO ENGLISH]'
}

// Helper to create a simple English summary from Croatian story
function createEnglishSummaryFromStory(body: string): string {
  // Extract first paragraph
  const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0)
  const firstParagraph = paragraphs[0] || body.substring(0, 300)
  
  // Simple translations for common phrases (this is basic - would need proper translation)
  let summary = firstParagraph
    .replace(/\s+/g, ' ')
    .substring(0, 300)
    .trim()
  
  // For now, return placeholder that user can manually fill
  // In production, would use translation API
  return summary
}

function createImprovedPrompt(title: string, body: string, author: string): string {
  const englishTitle = getEnglishTitle(title, author)
  
  // Extract first paragraph for summary
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
  
  // Determine setting (simplified - no preset elements)
  const bodyLower = body.toLowerCase()
  let setting = ''
  
  // Detect setting (simplified detection)
  if (bodyLower.includes('savana') || bodyLower.includes('savani') || bodyLower.includes('afrički') || (bodyLower.includes('lav') && bodyLower.includes('savana'))) {
    setting = 'African savanna'
  } else if (bodyLower.includes('cirkus') || bodyLower.includes('circus') || bodyLower.includes('slonica')) {
    setting = 'circus tent'
  } else if (bodyLower.includes('sirena') || bodyLower.includes('podvodno') || bodyLower.includes('koraljnog grebena') || bodyLower.includes('atlantika')) {
    setting = 'underwater ocean'
  } else if (bodyLower.includes('more') && (bodyLower.includes('riba') || bodyLower.includes('sirena') || bodyLower.includes('ocean'))) {
    setting = 'underwater ocean'
  } else if (bodyLower.includes('otok') || bodyLower.includes('motunui')) {
    setting = 'tropical island'
  } else if (bodyLower.includes('kraljevstvo') || bodyLower.includes('dvorac') || bodyLower.includes('palača') || bodyLower.includes('agrabah')) {
    setting = 'magical kingdom or castle'
  } else if (bodyLower.includes('zagreb') || (bodyLower.includes('grad') && !bodyLower.includes('selo'))) {
    setting = 'city skyline at night'
  } else if (bodyLower.includes('šuma') || bodyLower.includes('šumi') || bodyLower.includes('šumu')) {
    setting = 'magical forest'
  } else if (bodyLower.includes('selo') || bodyLower.includes('selu') || bodyLower.includes('radionici') || bodyLower.includes('talijanskog')) {
    setting = 'peaceful village'
  } else if (bodyLower.includes('meksičk') || bodyLower.includes('mexico')) {
    setting = 'Mexican village'
  } else if (bodyLower.includes('kolumbijsk') || bodyLower.includes('planinama')) {
    setting = 'mountain village'
  } else {
    setting = 'magical world'
  }
  
  // Create English summary (placeholder - needs proper translation)
  const croatianSummary = firstParagraph
    .replace(/\s+/g, ' ')
    .substring(0, 300)
    .trim()
  
  // For now, create a basic English summary based on title and setting
  // User will need to manually translate or we can improve this with translation API
  const englishSummary = `A Croatian children's bedtime story about ${englishTitle !== title ? englishTitle : title.toLowerCase()}, set in ${setting}. ${croatianSummary.substring(0, 150)}...`
  
  // Build character text
  const characterText = mainCharacters.length > 0 
    ? ` featuring the main character ${mainCharacters[0]}${mainCharacters.length > 1 ? ` and ${mainCharacters[1]}` : ''}` 
    : ''
  
  return `A beautiful, magical illustration for a Croatian children's bedtime story titled "${englishTitle}".

Story summary: ${englishSummary}

The illustration should depict ${setting}${characterText}.
The image should be warm, cozy, suitable for children ages 5-10, with a nighttime/dreamy bedtime story atmosphere.
Style: children's book illustration, soft colors, dreamy, magical, gentle and peaceful, bedtime aesthetic.
Dark mode friendly color palette with deep blues, purples, navy, slate, and warm amber/gold accents.
The illustration should evoke wonder, peace, and dreams, perfect for bedtime reading. No text, words, or letters in the image.`
}

export { createImprovedPrompt, getEnglishTitle }
