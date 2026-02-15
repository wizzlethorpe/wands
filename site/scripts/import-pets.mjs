import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'magical-pets-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Magical Pets')

// Size abbreviations to full names
const sizeMap = {
  tiny: 'Tiny',
  sm: 'Small',
  med: 'Medium',
  lg: 'Large',
  huge: 'Huge',
  grg: 'Gargantuan'
}

// CR to proficiency bonus
const profByCR = {
  0: 2, 0.125: 2, 0.25: 2, 0.5: 2,
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3
}

// Calculate ability modifier
function getAbilityMod(score) {
  return Math.floor((score - 10) / 2)
}

// Format modifier with sign
function formatMod(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

// Format speed for display
function formatSpeed(movement) {
  if (!movement) return '30 ft.'

  const parts = []
  if (movement.walk) parts.push(`${movement.walk} ft.`)
  if (movement.fly) parts.push(`fly ${movement.fly} ft.${movement.hover ? ' (hover)' : ''}`)
  if (movement.swim) parts.push(`swim ${movement.swim} ft.`)
  if (movement.climb) parts.push(`climb ${movement.climb} ft.`)
  if (movement.burrow) parts.push(`burrow ${movement.burrow} ft.`)

  return parts.length > 0 ? parts.join(', ') : '0 ft.'
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
      str.match(/^\d/)) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  return str
}

// Process items (abilities, weapons, etc.) from pet
function processPetItems(items) {
  const traits = []
  const actions = []

  for (const item of items || []) {
    const name = item.name
    const sys = item.system || {}
    const desc = htmlToMarkdown(sys.description?.value || '')

    const activationType = sys.activation?.type || ''

    let entry = `**${name}.**`

    // Add attack info if it's an attack
    if (sys.actionType === 'mwak' || sys.actionType === 'rwak') {
      const attackBonus = sys.attackBonus || 0
      const attackType = sys.actionType === 'mwak' ? 'Melee Weapon Attack' : 'Ranged Weapon Attack'
      entry += ` *${attackType}:* ${formatMod(attackBonus)} to hit`

      if (sys.range?.value) {
        if (sys.actionType === 'mwak') {
          entry += `, reach ${sys.range.value} ft.`
        } else {
          entry += `, range ${sys.range.value}/${sys.range.long || sys.range.value * 4} ft.`
        }
      }

      entry += ', one target.'

      if (sys.damage?.parts && sys.damage.parts.length > 0) {
        const damageParts = sys.damage.parts.map(([formula, type]) => `${formula} ${type} damage`).join(' plus ')
        entry += ` *Hit:* ${damageParts}.`
      }

      if (desc) entry += ` ${desc}`
    } else if (desc) {
      entry += ` ${desc}`
    }

    if (activationType === 'action' || item.type === 'weapon') {
      actions.push(entry)
    } else {
      traits.push(entry)
    }
  }

  return { traits, actions }
}

// Process a single pet JSON file
function processPet(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const sys = data.system || {}

  // Get source
  let source = ''
  if (sys.details?.source) {
    if (typeof sys.details.source === 'string') {
      source = sys.details.source
    } else {
      source = sys.details.source.custom || sys.details.source.book || ''
    }
  }

  // Get CR and derived values
  const cr = sys.details?.cr ?? 0
  const profBonus = profByCR[cr] ?? 2

  // Get abilities
  const abilities = sys.abilities || {}
  const str = abilities.str?.value ?? 10
  const dex = abilities.dex?.value ?? 10
  const con = abilities.con?.value ?? 10
  const int = abilities.int?.value ?? 10
  const wis = abilities.wis?.value ?? 10
  const cha = abilities.cha?.value ?? 10

  // Get traits
  const traits = sys.traits || {}
  const size = traits.size || 'tiny'
  const movement = sys.attributes?.movement || {}
  const senses = sys.attributes?.senses || {}

  // Get AC and HP
  const ac = sys.attributes?.ac?.value ?? 10
  const hp = sys.attributes?.hp?.value ?? sys.attributes?.hp?.max ?? 1
  const hpFormula = sys.attributes?.hp?.formula || ''

  // Get type and alignment
  const creatureType = sys.details?.type?.value || 'beast'
  const alignment = sys.details?.alignment || 'unaligned'

  // Calculate passive perception
  const wisMod = getAbilityMod(wis)
  const passivePerception = 10 + wisMod

  // Process items
  const { traits: traitsList, actions } = processPetItems(data.items)

  const pet = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'pet',
    source: source,
    cr: cr,
    size: size,
    size_display: sizeMap[size] || size,
    creature_type: creatureType,
    alignment: alignment,
    ac: ac,
    hp: hp,
    hp_formula: hpFormula,
    speed_walk: movement.walk ?? 30,
    speed_fly: movement.fly ?? 0,
    speed_swim: movement.swim ?? 0,
    speed_climb: movement.climb ?? 0,
    speed_display: formatSpeed(movement),
    str, dex, con, int, wis, cha,
    str_mod: getAbilityMod(str),
    dex_mod: getAbilityMod(dex),
    con_mod: getAbilityMod(con),
    int_mod: getAbilityMod(int),
    wis_mod: getAbilityMod(wis),
    cha_mod: getAbilityMod(cha),
    senses_darkvision: senses.darkvision ?? 0,
    passive_perception: passivePerception,
    proficiency_bonus: profBonus
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(pet.name)}
foundry_id: ${yamlString(pet.foundry_id)}
type: pet
source: ${yamlString(pet.source)}
cr: ${pet.cr}
size: ${yamlString(pet.size)}
size_display: ${yamlString(pet.size_display)}
creature_type: ${yamlString(pet.creature_type)}
alignment: ${yamlString(pet.alignment)}
ac: ${pet.ac}
hp: ${pet.hp}
hp_formula: ${yamlString(pet.hp_formula)}
speed_walk: ${pet.speed_walk}
speed_fly: ${pet.speed_fly}
speed_swim: ${pet.speed_swim}
speed_climb: ${pet.speed_climb}
speed_display: ${yamlString(pet.speed_display)}
str: ${pet.str}
dex: ${pet.dex}
con: ${pet.con}
int: ${pet.int}
wis: ${pet.wis}
cha: ${pet.cha}
str_mod: ${pet.str_mod}
dex_mod: ${pet.dex_mod}
con_mod: ${pet.con_mod}
int_mod: ${pet.int_mod}
wis_mod: ${pet.wis_mod}
cha_mod: ${pet.cha_mod}
senses_darkvision: ${pet.senses_darkvision}
passive_perception: ${pet.passive_perception}
proficiency_bonus: ${pet.proficiency_bonus}
---`

  // Build content
  let content = `${frontmatter}

# ${pet.name}

`

  if (traitsList.length > 0) {
    content += `## Traits\n\n${traitsList.join('\n\n')}\n\n`
  }

  if (actions.length > 0) {
    content += `## Actions\n\n${actions.join('\n\n')}\n\n`
  }

  return { pet, content }
}

// Main execution
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} magical pet files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { pet, content } = processPet(inputPath)

      const safeName = pet.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} magical pets created, ${errorCount} errors`)
}

main()
