import path from 'path'
import fs from 'fs'

interface StoryRef {
  title: string
  author: string
}

function parseTitlesAndAuthors(filePath: string): StoryRef[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const stories: StoryRef[] = []

  let currentTitle = ''
  let currentAuthor = ''

  function flushCurrent() {
    if (!currentTitle || !currentAuthor) return
    stories.push({ title: currentTitle, author: currentAuthor })
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const lower = line.toLowerCase()

    if (lower.startsWith('title:')) {
      flushCurrent()
      currentTitle = line.substring('title:'.length).trim()
      currentAuthor = ''
      continue
    }

    if (lower.startsWith('author:')) {
      currentAuthor = line.substring('author:'.length).trim()
      continue
    }
  }

  flushCurrent()

  return stories
}

// Main execution
if (require.main === module) {
  const importFilePath =
    process.argv[2] || path.join(process.cwd(), 'import', 'price_za_laku_noc.txt')

  if (!fs.existsSync(importFilePath)) {
    console.error(`❌ Import file not found: ${importFilePath}`)
    process.exit(1)
  }

  const stories = parseTitlesAndAuthors(importFilePath)
  if (stories.length === 0) {
    console.error('❌ No stories found in import file.')
    process.exit(1)
  }

  const exportDir = path.join(process.cwd(), 'export')
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }

  const lines = stories.map(s => `${s.title} (${s.author})`)
  const outputPath = path.join(exportDir, 'new.txt')
  fs.writeFileSync(outputPath, lines.join('\n') + '\n', 'utf-8')

  console.log(`✅ Exported ${stories.length} new stories to: ${outputPath}`)
}

