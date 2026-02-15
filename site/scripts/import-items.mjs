import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'items-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Items')

// Rarity mapping
const rarityMap = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  veryRare: 'Very Rare',
  legendary: 'Legendary',
  artifact: 'Artifact'
}

// Item type mapping
const itemTypeMap = {
  consumable: 'Consumable',
  loot: 'Loot',
  tool: 'Tool',
  equipment: 'Equipment',
  weapon: 'Weapon',
  armor: 'Armor',
  container: 'Container',
  backpack: 'Container'
}

// Consumable subtype mapping
const consumableSubtypeMap = {
  potion: 'Potion',
  poison: 'Poison',
  food: 'Food',
  scroll: 'Scroll',
  wand: 'Wand',
  rod: 'Rod',
  trinket: 'Trinket',
  ammo: 'Ammunition'
}

// Duration units to display
const durationUnitMap = {
  inst: 'Instantaneous',
  round: 'round',
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  perm: 'Permanent',
  spec: 'Special'
}

// Format duration for display
function formatDuration(duration) {
  if (!duration || !duration.units) return ''

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

// Format price for display
function formatPrice(price) {
  if (!price || price.value === null || price.value === undefined) return ''
  return `${price.value} ${price.denomination || 'gp'}`
}

// Format weight for display
function formatWeight(weight) {
  if (weight === null || weight === undefined) return ''
  return `${weight} lb.`
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

// Process a single item JSON file
function processItem(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const sys = data.system || {}

  // Get source - handle both string and object formats
  let source = ''
  if (typeof sys.source === 'string') {
    source = sys.source
  } else if (sys.source) {
    source = sys.source.custom || sys.source.book || ''
    if (sys.source.page) {
      source += ` p.${sys.source.page}`
    }
  }

  // Get rarity
  const rarity = sys.rarity || 'common'
  const rarityDisplay = rarityMap[rarity] || rarity

  // Determine category based on type and subtype
  let category = itemTypeMap[data.type] || data.type || 'Loot'
  const subtype = sys.type?.value || ''
  if (data.type === 'consumable' && subtype) {
    category = consumableSubtypeMap[subtype] || subtype
  }

  // Extract all fields
  const item = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: data.type || 'loot',
    subtype: subtype,
    category: category,
    source: source,
    rarity: rarity,
    rarity_display: rarityDisplay,

    // Price and weight
    price_value: sys.price?.value ?? null,
    price_denomination: sys.price?.denomination || 'gp',
    price_display: formatPrice(sys.price),
    weight: sys.weight ?? null,
    weight_display: formatWeight(sys.weight),
    quantity: sys.quantity ?? 1,

    // Activation
    activation_type: sys.activation?.type || '',
    activation_cost: sys.activation?.cost ?? null,
    activation_condition: sys.activation?.condition || '',

    // Duration
    duration_value: sys.duration?.value ?? null,
    duration_units: sys.duration?.units || '',
    duration_display: formatDuration(sys.duration),

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
    uses_autoDestroy: sys.uses?.autoDestroy ?? false,

    // Attunement
    attunement: sys.attunement ?? 0,
    attuned: sys.attuned ?? false,

    // Action type
    action_type: sys.actionType || '',
    attack_bonus: sys.attackBonus ?? 0,
    chat_flavor: sys.chatFlavor || '',

    // Damage
    damage_parts: sys.damage?.parts || [],
    damage_versatile: sys.damage?.versatile || '',

    // Save
    save_ability: sys.save?.ability || '',
    save_dc: sys.save?.dc ?? null,
    save_scaling: sys.save?.scaling || '',

    // Formula for effects
    formula: sys.formula || '',

    // Critical
    critical_threshold: sys.critical?.threshold ?? null,
    critical_damage: sys.critical?.damage || null,

    // Properties (for weapons/armor)
    properties: sys.properties ? Object.keys(sys.properties).filter(k => sys.properties[k]) : [],

    // Armor-specific
    armor_value: sys.armor?.value ?? null,
    armor_dex: sys.armor?.dex ?? null,

    // Weapon-specific
    proficient: sys.proficient ?? null,
    ability: sys.ability || '',

    // Container-specific
    capacity_type: sys.capacity?.type || '',
    capacity_value: sys.capacity?.value ?? null,

    // Equipped/identified state
    equipped: sys.equipped ?? false,
    identified: sys.identified ?? true
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(item.name)}
foundry_id: ${yamlString(item.foundry_id)}
type: ${yamlString(item.type)}
subtype: ${yamlString(item.subtype)}
category: ${yamlString(item.category)}
source: ${yamlString(item.source)}
rarity: ${yamlString(item.rarity)}
rarity_display: ${yamlString(item.rarity_display)}
price_value: ${item.price_value}
price_denomination: ${yamlString(item.price_denomination)}
price_display: ${yamlString(item.price_display)}
weight: ${item.weight}
weight_display: ${yamlString(item.weight_display)}
quantity: ${item.quantity}
activation_type: ${yamlString(item.activation_type)}
activation_cost: ${item.activation_cost}
activation_condition: ${yamlString(item.activation_condition)}
duration_value: ${item.duration_value}
duration_units: ${yamlString(item.duration_units)}
duration_display: ${yamlString(item.duration_display)}
range_value: ${item.range_value}
range_units: ${yamlString(item.range_units)}
target_type: ${yamlString(item.target_type)}
target_value: ${item.target_value}
target_units: ${yamlString(item.target_units)}
uses_value: ${item.uses_value}
uses_max: ${item.uses_max}
uses_per: ${item.uses_per}
uses_recovery: ${yamlString(item.uses_recovery)}
uses_autoDestroy: ${item.uses_autoDestroy}
attunement: ${item.attunement}
attuned: ${item.attuned}
action_type: ${yamlString(item.action_type)}
attack_bonus: ${item.attack_bonus}
chat_flavor: ${yamlString(item.chat_flavor)}
damage_parts: ${JSON.stringify(item.damage_parts)}
damage_versatile: ${yamlString(item.damage_versatile)}
save_ability: ${yamlString(item.save_ability)}
save_dc: ${item.save_dc}
save_scaling: ${yamlString(item.save_scaling)}
formula: ${yamlString(item.formula)}
critical_threshold: ${item.critical_threshold}
critical_damage: ${item.critical_damage}
properties: ${JSON.stringify(item.properties)}
armor_value: ${item.armor_value}
armor_dex: ${item.armor_dex}
proficient: ${item.proficient}
ability: ${yamlString(item.ability)}
capacity_type: ${yamlString(item.capacity_type)}
capacity_value: ${item.capacity_value}
equipped: ${item.equipped}
identified: ${item.identified}
---`

  // Build content
  const description = htmlToMarkdown(sys.description?.value || '')

  const content = `${frontmatter}

# ${item.name}

${description}
`

  return { item, content }
}

// Main execution
function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Get all JSON files
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} item files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { item, content } = processItem(inputPath)

      // Create safe filename
      const safeName = item.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} items created, ${errorCount} errors`)
}

main()
