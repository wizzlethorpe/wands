import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'spells-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Spells')

// School code to full name mapping
const schoolMap = {
  abj: 'Abjuration',
  con: 'Conjuration',
  div: 'Divination',
  enc: 'Enchantment',
  evo: 'Evocation',
  ill: 'Illusion',
  nec: 'Necromancy',
  trs: 'Transmutation',
  cha: 'Charms',
  hex: 'Jinxes, Hexes, and Curses',
  tra: 'Transfiguration',
  hea: 'Healing',
  mag: 'Magizoology'
}

// Duration units to display
const durationUnitMap = {
  inst: 'Instantaneous',
  round: 'round',
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  perm: 'Permanent',
  spec: 'Special',
  turn: 'turn'
}

// Format duration for display
function formatDuration(duration) {
  if (!duration || !duration.units) return 'Instantaneous'

  const units = duration.units
  const value = duration.value

  if (units === 'inst') return 'Instantaneous'
  if (units === 'perm') return 'Permanent'
  if (units === 'spec') return 'Special'

  if (value === null || value === undefined) {
    return durationUnitMap[units] || units
  }

  const unitName = durationUnitMap[units] || units
  const plural = value !== 1 ? 's' : ''
  return `${value} ${unitName}${plural}`
}

// Format range for display
function formatRange(range) {
  if (!range) return 'Self'

  const value = range.value
  const units = range.units

  if (units === 'self') return 'Self'
  if (units === 'touch') return 'Touch'
  if (units === 'spec') return 'Special'
  if (units === 'any') return 'Unlimited'

  if (value === null || value === undefined) {
    return units || 'Self'
  }

  return `${value} ${units}`
}

// Format target for display
function formatTarget(target) {
  if (!target || !target.type) return ''

  const value = target.value
  const type = target.type
  const units = target.units

  if (type === 'self') return 'Self'
  if (type === 'creature' || type === 'object' || type === 'space') {
    if (value && value > 1) {
      return `${value} ${type}s`
    }
    return type
  }

  // Area types
  if (type === 'sphere' || type === 'cube' || type === 'cone' || type === 'cylinder' || type === 'line' || type === 'radius') {
    if (value && units) {
      return `${value}-${units} ${type}`
    }
    return type
  }

  return type
}

// Build components string
function formatComponents(components) {
  const parts = []
  if (components.vocal) parts.push('V')
  if (components.somatic) parts.push('S')
  if (components.material) parts.push('M')
  return parts.join(', ')
}

// Strip HTML and convert to markdown
function htmlToMarkdown(html) {
  if (!html) return ''

  return html
    // Remove secret sections
    .replace(/<section class="secret">[\s\S]*?<\/section>/gi, '')
    // Convert Foundry references to wikilinks
    .replace(/@UUID\[([^\]]+)\]\{([^}]+)\}/g, '[[$2]]')
    .replace(/@Compendium\[([^\]]+)\]\{([^}]+)\}/g, '[[$2]]')
    // Convert HTML lists to markdown
    .replace(/<ul>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    // Convert HTML formatting
    .replace(/<strong>/gi, '**')
    .replace(/<\/strong>/gi, '**')
    .replace(/<em>/gi, '*')
    .replace(/<\/em>/gi, '*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Escape YAML string values
function yamlString(value) {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'boolean') return value.toString()
  if (typeof value === 'number') return value.toString()

  const str = String(value)
  // If contains special characters, quote it
  if (str.includes(':') || str.includes('#') || str.includes("'") || str.includes('"') ||
      str.includes('\n') || str.startsWith(' ') || str.endsWith(' ') ||
      str === '' || str === 'true' || str === 'false' || str === 'null' ||
      str.match(/^\d/)) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}

// Process a single spell JSON file
function processSpell(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const sys = data.system || {}

  // Extract all fields
  const spell = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'spell',
    level: sys.level ?? 0,
    school: sys.school || '',
    school_display: schoolMap[sys.school] || sys.school || '',
    source: typeof sys.source === 'string' ? sys.source : (sys.source?.custom || sys.source?.book || ''),

    // Activation
    activation_type: sys.activation?.type || 'action',
    activation_cost: sys.activation?.cost ?? 1,
    activation_condition: sys.activation?.condition || '',

    // Range
    range_value: sys.range?.value ?? null,
    range_long: sys.range?.long ?? null,
    range_units: sys.range?.units || 'self',
    range_display: formatRange(sys.range),

    // Duration
    duration_value: sys.duration?.value ?? null,
    duration_units: sys.duration?.units || 'inst',
    duration_display: formatDuration(sys.duration),
    concentration: sys.components?.concentration ?? false,

    // Target
    target_type: sys.target?.type || '',
    target_value: sys.target?.value ?? null,
    target_width: sys.target?.width ?? null,
    target_units: sys.target?.units || '',
    target_display: formatTarget(sys.target),

    // Components
    ritual: sys.components?.ritual ?? false,
    components_vocal: sys.components?.vocal ?? false,
    components_somatic: sys.components?.somatic ?? false,
    components_material: sys.components?.material ?? false,
    components_display: formatComponents(sys.components || {}),
    material_description: sys.materials?.value || '',
    material_consumed: sys.materials?.consumed ?? false,
    material_cost: sys.materials?.cost ?? 0,
    material_supply: sys.materials?.supply ?? 0,

    // Action and effects
    action_type: sys.actionType || '',
    attack_bonus: sys.attackBonus ?? 0,
    chat_flavor: sys.chatFlavor || '',

    // Damage
    damage_parts: sys.damage?.parts || [],
    damage_versatile: sys.damage?.versatile || '',

    // Save
    save_ability: sys.save?.ability || '',
    save_dc: sys.save?.dc ?? null,
    save_scaling: sys.save?.scaling || 'spell',

    // Scaling
    scaling_mode: sys.scaling?.mode || 'none',
    scaling_formula: sys.scaling?.formula || '',

    // Formula for non-damage effects
    formula: sys.formula || '',

    // Uses
    uses_value: sys.uses?.value ?? null,
    uses_max: sys.uses?.max ?? null,
    uses_per: sys.uses?.per || null,
    uses_recovery: sys.uses?.recovery || '',

    // Consume
    consume_type: sys.consume?.type || '',
    consume_target: sys.consume?.target || null,
    consume_amount: sys.consume?.amount ?? null,

    // Critical
    critical_threshold: sys.critical?.threshold ?? null,
    critical_damage: sys.critical?.damage || null,

    // Ability used
    ability: sys.ability || '',

    // Preparation
    preparation_mode: sys.preparation?.mode || 'prepared',
    preparation_prepared: sys.preparation?.prepared ?? false
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(spell.name)}
foundry_id: ${yamlString(spell.foundry_id)}
type: spell
level: ${spell.level}
school: ${yamlString(spell.school)}
school_display: ${yamlString(spell.school_display)}
source: ${yamlString(spell.source)}
activation_type: ${yamlString(spell.activation_type)}
activation_cost: ${spell.activation_cost}
activation_condition: ${yamlString(spell.activation_condition)}
range_value: ${spell.range_value}
range_long: ${spell.range_long}
range_units: ${yamlString(spell.range_units)}
range_display: ${yamlString(spell.range_display)}
duration_value: ${spell.duration_value}
duration_units: ${yamlString(spell.duration_units)}
duration_display: ${yamlString(spell.duration_display)}
concentration: ${spell.concentration}
target_type: ${yamlString(spell.target_type)}
target_value: ${spell.target_value}
target_width: ${spell.target_width}
target_units: ${yamlString(spell.target_units)}
target_display: ${yamlString(spell.target_display)}
ritual: ${spell.ritual}
components_vocal: ${spell.components_vocal}
components_somatic: ${spell.components_somatic}
components_material: ${spell.components_material}
components_display: ${yamlString(spell.components_display)}
material_description: ${yamlString(spell.material_description)}
material_consumed: ${spell.material_consumed}
material_cost: ${spell.material_cost}
material_supply: ${spell.material_supply}
action_type: ${yamlString(spell.action_type)}
attack_bonus: ${spell.attack_bonus}
chat_flavor: ${yamlString(spell.chat_flavor)}
damage_parts: ${JSON.stringify(spell.damage_parts)}
damage_versatile: ${yamlString(spell.damage_versatile)}
save_ability: ${yamlString(spell.save_ability)}
save_dc: ${spell.save_dc}
save_scaling: ${yamlString(spell.save_scaling)}
scaling_mode: ${yamlString(spell.scaling_mode)}
scaling_formula: ${yamlString(spell.scaling_formula)}
formula: ${yamlString(spell.formula)}
uses_value: ${spell.uses_value}
uses_max: ${spell.uses_max}
uses_per: ${spell.uses_per}
uses_recovery: ${yamlString(spell.uses_recovery)}
consume_type: ${yamlString(spell.consume_type)}
consume_target: ${spell.consume_target}
consume_amount: ${spell.consume_amount}
critical_threshold: ${spell.critical_threshold}
critical_damage: ${spell.critical_damage}
ability: ${yamlString(spell.ability)}
preparation_mode: ${yamlString(spell.preparation_mode)}
preparation_prepared: ${spell.preparation_prepared}
---`

  // Build content
  const description = htmlToMarkdown(sys.description?.value || '')

  const content = `${frontmatter}

# ${spell.name}

${description}
`

  return { spell, content }
}

// Main execution
function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Get all JSON files
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} spell files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { spell, content } = processSpell(inputPath)

      // Create safe filename
      const safeName = spell.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} spells created, ${errorCount} errors`)
}

main()
