import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_FILE = path.join(__dirname, '..', 'wands_source.txt')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Rules')

// Chapter definitions with line ranges and output structure
const chapters = [
  {
    id: 'introduction',
    title: 'Introduction',
    outputPath: 'Introduction.md',
    startMarker: '# Introduction',
    endMarker: '# Chapter 1: Houses'
  },
  {
    id: 'houses',
    title: 'Houses',
    outputPath: 'Character Creation/Houses.md',
    startMarker: '# Chapter 1: Houses',
    endMarker: '# Chapter 2: Casting Styles'
  },
  {
    id: 'casting-styles',
    title: 'Casting Styles',
    outputPath: 'Character Creation/Casting Styles.md',
    startMarker: '# Chapter 2: Casting Styles',
    endMarker: '# Chapter 3: Schools of Magic'
  },
  {
    id: 'schools-of-magic',
    title: 'Schools of Magic',
    outputPath: 'Character Creation/Schools of Magic.md',
    startMarker: '# Chapter 3: Schools of Magic',
    endMarker: '# Chapter 4: Wands'
  },
  {
    id: 'wands-backgrounds',
    title: 'Wands and Backgrounds',
    outputPath: 'Character Creation/Wands and Backgrounds.md',
    startMarker: '# Chapter 4: Wands',
    endMarker: '# Chapter 5: Wizarding Equipment'
  },
  {
    id: 'equipment',
    title: 'Equipment',
    outputPath: 'Character Creation/Equipment.md',
    startMarker: '# Chapter 5: Wizarding Equipment',
    endMarker: '# Chapter 6: Wizarding Feats'
  },
  {
    id: 'feats',
    title: 'Feats',
    outputPath: 'Character Creation/Feats.md',
    startMarker: '# Chapter 6: Wizarding Feats',
    endMarker: 'Chapter 7: Wizarding Skills'
  },
  {
    id: 'skills',
    title: 'Skills',
    outputPath: 'Character Creation/Skills.md',
    startMarker: 'Chapter 7: Wizarding Skills',
    endMarker: '# Chapter 8: Dark Magic'
  },
  {
    id: 'corruption',
    title: 'Dark Magic Corruption',
    outputPath: 'Dark Magic/Corruption.md',
    startMarker: '# Chapter 8: Dark Magic',
    endMarker: '# Chapter 9: Spells'
  },
  {
    id: 'spellcasting',
    title: 'Spellcasting Rules',
    outputPath: 'Spellcasting/Spellcasting Rules.md',
    startMarker: '# Chapter 9: Spells',
    endMarker: '# Appendix A:'
  },
  {
    id: 'potion-brewing',
    title: 'Potion Brewing',
    outputPath: 'Appendices/Potion Brewing.md',
    startMarker: '# Appendix A:',
    endMarker: '# Appendix B:'
  },
  {
    id: 'patronus',
    title: 'Patronus Tables',
    outputPath: 'Appendices/Patronus Tables.md',
    startMarker: '# Appendix B:',
    endMarker: '# Appendix C:'
  },
  {
    id: 'chocolate-frogs',
    title: 'Chocolate Frog Cards',
    outputPath: 'Appendices/Chocolate Frog Cards.md',
    startMarker: '# Appendix C:',
    endMarker: '# Glossary'
  }
]

// Convert GMBinder HTML/Markdown to clean markdown
function cleanContent(content) {
  let result = content

  // Remove page breaks
  result = result.replace(/\\pagebreak(Num)?/g, '\n---\n')
  result = result.replace(/\\columnbreak/g, '')

  // Remove style blocks
  result = result.replace(/<style>[\s\S]*?<\/style>/gi, '')

  // Remove image tags (per user preference - text only)
  result = result.replace(/<img[^>]*>/gi, '')

  // Remove divs with specific classes (layout elements)
  result = result.replace(/<div[^>]*class=['"][^'"]*(?:cover-|bgwatercolor|footnote|toc)[^'"]*['"][^>]*>[\s\S]*?<\/div>/gi, '')
  result = result.replace(/<div[^>]*style=['"][^'"]*(?:position|margin|text-shadow|color:#ECE6D0)[^'"]*['"][^>]*>[\s\S]*?<\/div>/gi, '')

  // Clean remaining divs - convert class-based tables to markdown
  result = result.replace(/<div\s+class=['"]classTable[^'"]*['"][^>]*>/gi, '')
  result = result.replace(/<div\s+class=['"]wide['"][^>]*>/gi, '')
  result = result.replace(/<\/div>/gi, '')

  // Clean spans
  result = result.replace(/<span[^>]*>/gi, '')
  result = result.replace(/<\/span>/gi, '')

  // Convert line breaks in headings
  result = result.replace(/<\/br>/gi, ' ')
  result = result.replace(/<br\s*\/?>/gi, '\n')

  // Convert paragraph tags
  result = result.replace(/<p>/gi, '\n')
  result = result.replace(/<\/p>/gi, '\n')

  // Convert bold/italic
  result = result.replace(/<strong>/gi, '**')
  result = result.replace(/<\/strong>/gi, '**')
  result = result.replace(/<em>/gi, '*')
  result = result.replace(/<\/em>/gi, '*')
  result = result.replace(/<b>/gi, '**')
  result = result.replace(/<\/b>/gi, '**')
  result = result.replace(/<i>/gi, '*')
  result = result.replace(/<\/i>/gi, '*')

  // Convert lists
  result = result.replace(/<ul>/gi, '')
  result = result.replace(/<\/ul>/gi, '')
  result = result.replace(/<ol>/gi, '')
  result = result.replace(/<\/ol>/gi, '')
  result = result.replace(/<li>/gi, '- ')
  result = result.replace(/<\/li>/gi, '\n')

  // Remove anchor tags but keep text
  result = result.replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')

  // Remove any remaining HTML tags
  result = result.replace(/<[^>]+>/g, '')

  // Decode HTML entities
  result = result.replace(/&nbsp;/g, ' ')
  result = result.replace(/&amp;/g, '&')
  result = result.replace(/&lt;/g, '<')
  result = result.replace(/&gt;/g, '>')
  result = result.replace(/&quot;/g, '"')
  result = result.replace(/&mdash;/g, '—')
  result = result.replace(/&ndash;/g, '–')
  result = result.replace(/&#39;/g, "'")

  // Clean up horizontal rules
  result = result.replace(/^___$/gm, '---')
  result = result.replace(/^─+$/gm, '---')

  // Clean up multiple blank lines
  result = result.replace(/\n{4,}/g, '\n\n\n')

  // Clean up lines that are just whitespace
  result = result.replace(/^\s+$/gm, '')

  // Trim each line
  result = result.split('\n').map(line => line.trimEnd()).join('\n')

  return result.trim()
}

// Extract content between markers
function extractChapter(fullContent, chapter) {
  const startIdx = fullContent.indexOf(chapter.startMarker)
  if (startIdx === -1) {
    console.log(`Warning: Could not find start marker for ${chapter.id}: "${chapter.startMarker}"`)
    return null
  }

  let endIdx = fullContent.length
  if (chapter.endMarker) {
    const foundEnd = fullContent.indexOf(chapter.endMarker, startIdx + 1)
    if (foundEnd !== -1) {
      endIdx = foundEnd
    }
  }

  return fullContent.substring(startIdx, endIdx)
}

// Create frontmatter for a rules page
function createFrontmatter(chapter) {
  return `---
public: true
title: "${chapter.title}"
type: rules
chapter_id: "${chapter.id}"
---`
}

// Main execution
function main() {
  // Read the source file
  const fullContent = fs.readFileSync(INPUT_FILE, 'utf8')

  console.log(`Processing wands_source.txt (${fullContent.length} characters)...`)

  // Ensure output directories exist
  const subdirs = ['Character Creation', 'Spellcasting', 'Dark Magic', 'Appendices']
  for (const subdir of subdirs) {
    const dirPath = path.join(OUTPUT_DIR, subdir)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  }

  let successCount = 0
  let errorCount = 0

  for (const chapter of chapters) {
    try {
      const rawContent = extractChapter(fullContent, chapter)
      if (!rawContent) {
        console.log(`Skipping ${chapter.id}: no content found`)
        errorCount++
        continue
      }

      const cleanedContent = cleanContent(rawContent)
      const frontmatter = createFrontmatter(chapter)
      const finalContent = `${frontmatter}\n\n${cleanedContent}\n`

      const outputPath = path.join(OUTPUT_DIR, chapter.outputPath)
      fs.writeFileSync(outputPath, finalContent, 'utf8')

      console.log(`Created: ${chapter.outputPath} (${cleanedContent.length} chars)`)
      successCount++
    } catch (err) {
      console.error(`Error processing ${chapter.id}:`, err.message)
      errorCount++
    }
  }

  // Create index pages
  createIndexPages()

  console.log(`\nCompleted: ${successCount} chapters created, ${errorCount} errors`)
}

// Create index pages for rules sections
function createIndexPages() {
  const indices = [
    {
      path: 'index.md',
      title: 'Rules',
      content: `---
public: true
title: "Rules"
cssclasses:
  - hide-folder-content
---

# Wands & Wizards Rules

Welcome to the W.A.N.D.S. (Wizarding Alternative for Novelty Dungeoneering Stories) Rulebook. This Harry Potter 5e adaptation substitutes standard D&D races, classes, subclasses, backgrounds, feats, skills, equipment, and spells with wizarding world equivalents.

## Character Creation

- [[Houses]] - Your Hogwarts house (replaces Race)
- [[Casting Styles]] - How you approach magic (replaces Class)
- [[Schools of Magic]] - Your magical specialty (replaces Subclass)
- [[Wands and Backgrounds]] - Your history and wand
- [[Equipment]] - Wizarding gear and tools
- [[Feats]] - Special abilities
- [[Skills]] - Wizarding skills

## Spellcasting

- [[Spellcasting Rules]] - How magic works in W&W

## Dark Magic

- [[Corruption]] - The cost of Dark magic

## Appendices

- [[Potion Brewing]] - Crafting potions
- [[Patronus Tables]] - Determining your Patronus
- [[Chocolate Frog Cards]] - Famous witches and wizards
`
    },
    {
      path: 'Character Creation/index.md',
      title: 'Character Creation',
      content: `---
public: true
title: "Character Creation"
cssclasses:
  - hide-folder-content
---

# Character Creation

Build your witch or wizard using the W&W character creation system.

## Chapters

- [[Houses]] - Choose your Hogwarts house (Gryffindor, Hufflepuff, Ravenclaw, Slytherin) or attend Beauxbatons, Durmstrang, or Ilvermorny
- [[Casting Styles]] - Select your casting style: Willpower, Technique, or Intellect
- [[Schools of Magic]] - Specialize in Charms, Jinxes/Hexes/Curses, Transfiguration, Healing, Divination, or Magizoology
- [[Wands and Backgrounds]] - Discover your wand and background story
- [[Equipment]] - Starting gear, tools, and magical items
- [[Feats]] - Innate and standard feats
- [[Skills]] - Modified skill system for the wizarding world
`
    },
    {
      path: 'Spellcasting/index.md',
      title: 'Spellcasting',
      content: `---
public: true
title: "Spellcasting"
cssclasses:
  - hide-folder-content
---

# Spellcasting

Learn the rules for casting spells in the wizarding world.

- [[Spellcasting Rules]] - Damaging spells, spell tags, targets, and more
`
    },
    {
      path: 'Dark Magic/index.md',
      title: 'Dark Magic',
      content: `---
public: true
title: "Dark Magic"
cssclasses:
  - hide-folder-content
---

# Dark Magic

The Dark Arts carry consequences for those who wield them.

- [[Corruption]] - The corruption system for using Dark magic
`
    },
    {
      path: 'Appendices/index.md',
      title: 'Appendices',
      content: `---
public: true
title: "Appendices"
cssclasses:
  - hide-folder-content
---

# Appendices

Optional rules and reference material.

- [[Potion Brewing]] - The potion brewing subsystem
- [[Patronus Tables]] - Rolling tables for determining your Patronus
- [[Chocolate Frog Cards]] - Famous witches and wizards
`
    }
  ]

  for (const index of indices) {
    const outputPath = path.join(OUTPUT_DIR, index.path)
    fs.writeFileSync(outputPath, index.content, 'utf8')
    console.log(`Created index: ${index.path}`)
  }
}

main()
