import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'houses-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Houses')

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

// Process advancement to extract traits
function extractTraits(advancement) {
  const traits = []
  const abilityScoreIncrease = []

  for (const adv of advancement || []) {
    if (adv.type === 'Trait') {
      // Extract trait name from grants
      if (adv.configuration?.grants) {
        for (const grant of adv.configuration.grants) {
          // Grant format might be like "Compendium.wands.features-wands.Item.ABC123"
          // We just want to note it exists
          traits.push(grant)
        }
      }
    } else if (adv.type === 'AbilityScoreImprovement') {
      if (adv.configuration?.fixed) {
        for (const [ability, value] of Object.entries(adv.configuration.fixed)) {
          abilityScoreIncrease.push(`${ability.charAt(0).toUpperCase() + ability.slice(1)} +${value}`)
        }
      }
    } else if (adv.type === 'ItemGrant') {
      if (adv.configuration?.items) {
        for (const item of adv.configuration.items) {
          traits.push(item)
        }
      }
    }
  }

  return {
    traits,
    abilityScoreIncrease: abilityScoreIncrease.join(', ')
  }
}

// Process a single house JSON file
function processHouse(jsonPath) {
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

  // Extract traits from advancement
  const { traits, abilityScoreIncrease } = extractTraits(sys.advancement)

  const house = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'race',
    source: source,
    creature_type: sys.type?.value || 'humanoid',
    movement_walk: sys.movement?.walk ?? 30,
    movement_fly: sys.movement?.fly ?? 0,
    movement_swim: sys.movement?.swim ?? 0,
    movement_climb: sys.movement?.climb ?? 0,
    movement_burrow: sys.movement?.burrow ?? 0,
    senses_darkvision: sys.senses?.darkvision ?? 0,
    size: 'medium',
    ability_score_increase: abilityScoreIncrease,
    traits: traits,
    advancement: sys.advancement || []
  }

  // Format movement display
  const movementParts = []
  if (house.movement_walk) movementParts.push(`${house.movement_walk} ft.`)
  if (house.movement_fly) movementParts.push(`fly ${house.movement_fly} ft.`)
  if (house.movement_swim) movementParts.push(`swim ${house.movement_swim} ft.`)
  if (house.movement_climb) movementParts.push(`climb ${house.movement_climb} ft.`)
  house.movement_display = movementParts.join(', ') || '30 ft.'

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(house.name)}
foundry_id: ${yamlString(house.foundry_id)}
type: race
source: ${yamlString(house.source)}
creature_type: ${yamlString(house.creature_type)}
movement_walk: ${house.movement_walk}
movement_fly: ${house.movement_fly}
movement_swim: ${house.movement_swim}
movement_climb: ${house.movement_climb}
movement_burrow: ${house.movement_burrow}
movement_display: ${yamlString(house.movement_display)}
senses_darkvision: ${house.senses_darkvision}
size: ${yamlString(house.size)}
ability_score_increase: ${yamlString(house.ability_score_increase)}
traits: ${JSON.stringify(house.traits)}
advancement: ${JSON.stringify(house.advancement)}
---`

  // Build content
  const description = htmlToMarkdown(sys.description?.value || '')

  const content = `${frontmatter}

# ${house.name}

${description}
`

  return { house, content }
}

// Main execution
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} house files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { house, content } = processHouse(inputPath)

      const safeName = house.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} houses created, ${errorCount} errors`)
}

main()
