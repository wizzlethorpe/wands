import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'animagus-form-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Animagus Forms')

// Size abbreviations to full names
const sizeMap = {
  tiny: 'Tiny',
  sm: 'Small',
  med: 'Medium',
  lg: 'Large',
  huge: 'Huge',
  grg: 'Gargantuan'
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

// Process items (abilities, weapons, etc.)
function processItems(items) {
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

// Process a single animagus form JSON file
function processAnimagusForm(jsonPath) {
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
  const size = traits.size || 'med'
  const movement = sys.attributes?.movement || {}
  const senses = sys.attributes?.senses || {}

  // Get AC and HP
  const ac = sys.attributes?.ac?.value ?? 10
  const hp = sys.attributes?.hp?.value ?? sys.attributes?.hp?.max ?? 10
  const hpFormula = sys.attributes?.hp?.formula || ''

  // Get type
  const creatureType = sys.details?.type?.value || 'beast'
  const alignment = sys.details?.alignment || 'unaligned'

  // Calculate passive perception
  const wisMod = getAbilityMod(wis)
  const passivePerception = 10 + wisMod

  // Process items
  const { traits: traitsList, actions } = processItems(data.items)

  // Determine form type from name
  let formType = 'land'
  const nameLower = data.name.toLowerCase()
  if (nameLower.includes('air') || nameLower.includes('fly')) {
    formType = 'air'
  } else if (nameLower.includes('water') || nameLower.includes('swim') || nameLower.includes('aquatic')) {
    formType = 'water'
  }

  // Determine combat/evasion
  let formStyle = 'combat'
  if (nameLower.includes('evasion')) {
    formStyle = 'evasion'
  }

  const form = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'animagus',
    form_type: formType,
    form_style: formStyle,
    source: source,
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
    senses_blindsight: senses.blindsight ?? 0,
    passive_perception: passivePerception
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(form.name)}
foundry_id: ${yamlString(form.foundry_id)}
type: animagus
form_type: ${yamlString(form.form_type)}
form_style: ${yamlString(form.form_style)}
source: ${yamlString(form.source)}
size: ${yamlString(form.size)}
size_display: ${yamlString(form.size_display)}
creature_type: ${yamlString(form.creature_type)}
alignment: ${yamlString(form.alignment)}
ac: ${form.ac}
hp: ${form.hp}
hp_formula: ${yamlString(form.hp_formula)}
speed_walk: ${form.speed_walk}
speed_fly: ${form.speed_fly}
speed_swim: ${form.speed_swim}
speed_climb: ${form.speed_climb}
speed_display: ${yamlString(form.speed_display)}
str: ${form.str}
dex: ${form.dex}
con: ${form.con}
int: ${form.int}
wis: ${form.wis}
cha: ${form.cha}
str_mod: ${form.str_mod}
dex_mod: ${form.dex_mod}
con_mod: ${form.con_mod}
int_mod: ${form.int_mod}
wis_mod: ${form.wis_mod}
cha_mod: ${form.cha_mod}
senses_darkvision: ${form.senses_darkvision}
senses_blindsight: ${form.senses_blindsight}
passive_perception: ${form.passive_perception}
---`

  // Build content
  let content = `${frontmatter}

# ${form.name}

`

  if (traitsList.length > 0) {
    content += `## Traits\n\n${traitsList.join('\n\n')}\n\n`
  }

  if (actions.length > 0) {
    content += `## Actions\n\n${actions.join('\n\n')}\n\n`
  }

  return { form, content }
}

// Main execution
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} animagus form files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { form, content } = processAnimagusForm(inputPath)

      const safeName = form.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} animagus forms created, ${errorCount} errors`)
}

main()
