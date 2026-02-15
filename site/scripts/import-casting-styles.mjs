import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'casting-styles-and-schools-of-magic-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Casting Styles')

// Strip HTML and convert to markdown
function htmlToMarkdown(html) {
  if (!html) return ''

  return html
    .replace(/<section class="secret">[\s\S]*?<\/section>/gi, '')
    .replace(/@UUID\[([^\]]+)\]\{([^}]+)\}/g, '[[$2]]')
    .replace(/@Compendium\[([^\]]+)\]\{([^}]+)\}/g, '[[$2]]')
    .replace(/<ul>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<strong>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<em>/gi, '*')
    .replace(/<\/em>/gi, '*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Escape YAML string values
function yamlString(value) {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()

  const str = String(value)
  if (str.includes(':') || str.includes('#') || str.includes("'") || str.includes('"') ||
      str.includes('\n') || str.startsWith(' ') || str.endsWith(' ') ||
      str === '' || str === 'true' || str === 'false' || str === 'null' ||
      str.match(/^\d/)) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}

// Process a single casting style/school JSON file
function processCastingStyle(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const sys = data.system || {}

  // Get source
  let source = ''
  if (typeof sys.source === 'string') {
    source = sys.source
  } else if (sys.source) {
    source = sys.source.custom || sys.source.book || ''
    if (sys.source.page) {
      source += ` p.${sys.source.page}`
    }
  }

  // Determine if this is a class or subclass
  const entityType = data.type || 'subclass'

  const style = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: entityType,
    source: source,
    identifier: sys.identifier || '',
    class_identifier: sys.classIdentifier || 'casting-style',
    spellcasting_ability: sys.spellcasting?.ability || '',
    spellcasting_progression: sys.spellcasting?.progression || '',
    advancement: sys.advancement || []
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(style.name)}
foundry_id: ${yamlString(style.foundry_id)}
type: ${yamlString(style.type)}
source: ${yamlString(style.source)}
identifier: ${yamlString(style.identifier)}
class_identifier: ${yamlString(style.class_identifier)}
spellcasting_ability: ${yamlString(style.spellcasting_ability)}
spellcasting_progression: ${yamlString(style.spellcasting_progression)}
advancement: ${JSON.stringify(style.advancement)}
---`

  // Build content
  const description = htmlToMarkdown(sys.description?.value || '')

  const content = `${frontmatter}

# ${style.name}

${description}
`

  return { style, content }
}

// Main execution
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} casting style/school files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { style, content } = processCastingStyle(inputPath)

      const safeName = style.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} casting styles/schools created, ${errorCount} errors`)
}

main()
