import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'features-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Features')

// Feature type mapping
const featureTypeMap = {
  race: 'Racial Trait',
  class: 'Class Feature',
  background: 'Background Feature',
  feat: 'Feat',
  subclass: 'Subclass Feature',
  monster: 'Monster Trait'
}

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
      str.startsWith('@') || str.startsWith('[') || str.startsWith('{') ||
      str.match(/^\d/)) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}

// Process a single feature JSON file
function processFeature(jsonPath) {
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

  // Get feature type
  const featureType = sys.type?.value || 'feat'
  const featureTypeDisplay = featureTypeMap[featureType] || featureType

  const feature = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'feat',
    feature_type: featureType,
    feature_type_display: featureTypeDisplay,
    source: source,
    requirements: sys.requirements || '',

    // Activation
    activation_type: sys.activation?.type || '',
    activation_cost: sys.activation?.cost ?? null,
    activation_condition: sys.activation?.condition || '',

    // Duration
    duration_value: sys.duration?.value ?? null,
    duration_units: sys.duration?.units || '',

    // Range
    range_value: sys.range?.value ?? null,
    range_units: sys.range?.units || '',

    // Target
    target_type: sys.target?.type || '',
    target_value: sys.target?.value ?? null,
    target_units: sys.target?.units || '',

    // Uses
    uses_value: sys.uses?.value ?? null,
    uses_max: sys.uses?.max ?? null,
    uses_per: sys.uses?.per || null,
    uses_recovery: sys.uses?.recovery || '',

    // Recharge
    recharge_value: sys.recharge?.value ?? null,
    recharge_charged: sys.recharge?.charged ?? true,

    // Action type
    action_type: sys.actionType || '',
    attack_bonus: sys.attackBonus ?? 0,

    // Damage
    damage_parts: sys.damage?.parts || [],

    // Save
    save_ability: sys.save?.ability || '',
    save_dc: sys.save?.dc ?? null,
    save_scaling: sys.save?.scaling || '',

    // Formula
    formula: sys.formula || ''
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(feature.name)}
foundry_id: ${yamlString(feature.foundry_id)}
type: feat
feature_type: ${yamlString(feature.feature_type)}
feature_type_display: ${yamlString(feature.feature_type_display)}
source: ${yamlString(feature.source)}
requirements: ${yamlString(feature.requirements)}
activation_type: ${yamlString(feature.activation_type)}
activation_cost: ${feature.activation_cost}
activation_condition: ${yamlString(feature.activation_condition)}
duration_value: ${feature.duration_value}
duration_units: ${yamlString(feature.duration_units)}
range_value: ${feature.range_value}
range_units: ${yamlString(feature.range_units)}
target_type: ${yamlString(feature.target_type)}
target_value: ${feature.target_value}
target_units: ${yamlString(feature.target_units)}
uses_value: ${feature.uses_value}
uses_max: ${yamlString(feature.uses_max)}
uses_per: ${yamlString(feature.uses_per)}
uses_recovery: ${yamlString(feature.uses_recovery)}
recharge_value: ${feature.recharge_value}
recharge_charged: ${feature.recharge_charged}
action_type: ${yamlString(feature.action_type)}
attack_bonus: ${feature.attack_bonus}
damage_parts: ${JSON.stringify(feature.damage_parts)}
save_ability: ${yamlString(feature.save_ability)}
save_dc: ${feature.save_dc}
save_scaling: ${yamlString(feature.save_scaling)}
formula: ${yamlString(feature.formula)}
---`

  // Build content
  const description = htmlToMarkdown(sys.description?.value || '')

  const content = `${frontmatter}

# ${feature.name}

${description}
`

  return { feature, content }
}

// Main execution
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} feature files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { feature, content } = processFeature(inputPath)

      const safeName = feature.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} features created, ${errorCount} errors`)
}

main()
