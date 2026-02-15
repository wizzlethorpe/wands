import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// We have two directories with background data
const INPUT_DIRS = [
  path.join(__dirname, '..', 'wands', 'packs-json', 'backgrounds-wands'),
  path.join(__dirname, '..', 'wands', 'packs-json', 'background-wands')
]
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Backgrounds')

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

// Process a single background JSON file
function processBackground(jsonPath) {
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

  // Determine type - backgrounds-wands has feat type, background-wands has background type
  const isBackgroundType = data.type === 'background'

  const background = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'background',
    feature_type: isBackgroundType ? 'background' : (sys.type?.value || 'background'),
    source: source,
    requirements: sys.requirements || '',

    // Activation (for feature-based backgrounds)
    activation_type: sys.activation?.type || '',
    activation_cost: sys.activation?.cost ?? null,
    activation_condition: sys.activation?.condition || '',

    // Duration
    duration_value: sys.duration?.value ?? null,
    duration_units: sys.duration?.units || '',

    // Uses
    uses_value: sys.uses?.value ?? null,
    uses_max: sys.uses?.max ?? null,
    uses_per: sys.uses?.per || null,
    uses_recovery: sys.uses?.recovery || '',

    // Advancement (for true backgrounds)
    advancement: sys.advancement || []
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(background.name)}
foundry_id: ${yamlString(background.foundry_id)}
type: background
feature_type: ${yamlString(background.feature_type)}
source: ${yamlString(background.source)}
requirements: ${yamlString(background.requirements)}
activation_type: ${yamlString(background.activation_type)}
activation_cost: ${background.activation_cost}
activation_condition: ${yamlString(background.activation_condition)}
duration_value: ${background.duration_value}
duration_units: ${yamlString(background.duration_units)}
uses_value: ${background.uses_value}
uses_max: ${background.uses_max}
uses_per: ${background.uses_per}
uses_recovery: ${yamlString(background.uses_recovery)}
advancement: ${JSON.stringify(background.advancement)}
---`

  // Build content
  const description = htmlToMarkdown(sys.description?.value || '')

  const content = `${frontmatter}

# ${background.name}

${description}
`

  return { background, content }
}

// Main execution
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let totalFiles = 0
  let successCount = 0
  let errorCount = 0

  // Process all input directories
  for (const inputDir of INPUT_DIRS) {
    if (!fs.existsSync(inputDir)) {
      console.log(`Skipping non-existent directory: ${inputDir}`)
      continue
    }

    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'))
    totalFiles += files.length
    console.log(`Processing ${files.length} files from ${path.basename(inputDir)}...`)

    for (const file of files) {
      try {
        const inputPath = path.join(inputDir, file)
        const { background, content } = processBackground(inputPath)

        const safeName = background.name.replace(/[<>:"/\\|?*]/g, '_')
        const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

        fs.writeFileSync(outputPath, content, 'utf8')
        successCount++
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message)
        errorCount++
      }
    }
  }

  console.log(`\nCompleted: ${successCount} backgrounds created, ${errorCount} errors (${totalFiles} total files)`)
}

main()
