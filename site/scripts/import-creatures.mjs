import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'monsters-wands')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Creatures')

// Size abbreviations to full names
const sizeMap = {
  tiny: 'Tiny',
  sm: 'Small',
  med: 'Medium',
  lg: 'Large',
  huge: 'Huge',
  grg: 'Gargantuan'
}

// Challenge rating to XP lookup table
const xpByCR = {
  0: 10, 0.125: 25, 0.25: 50, 0.5: 100,
  1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800,
  6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900,
  11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000,
  16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000,
  21: 33000, 22: 41000, 23: 50000, 24: 62000, 25: 75000,
  26: 90000, 27: 105000, 28: 120000, 29: 135000, 30: 155000
}

// CR to proficiency bonus
const profByCR = {
  0: 2, 0.125: 2, 0.25: 2, 0.5: 2,
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3,
  9: 4, 10: 4, 11: 4, 12: 4,
  13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6, 20: 6,
  21: 7, 22: 7, 23: 7, 24: 7,
  25: 8, 26: 8, 27: 8, 28: 8,
  29: 9, 30: 9
}

// Ability abbreviations
const abilityNames = ['str', 'dex', 'con', 'int', 'wis', 'cha']

// Skill to ability mapping
const skillAbilityMap = {
  acr: 'dex', ani: 'wis', arc: 'int', ath: 'str',
  dec: 'cha', his: 'int', ins: 'wis', itm: 'cha',
  inv: 'int', med: 'wis', nat: 'int', prc: 'wis',
  prf: 'cha', per: 'cha', rel: 'int', slt: 'dex',
  ste: 'dex', sur: 'wis',
  // W&W custom skills
  herb: 'int', mth: 'int', mug: 'int', mcr: 'wis', pot: 'wis'
}

const skillFullNames = {
  acr: 'Acrobatics', ani: 'Animal Handling', arc: 'Arcana', ath: 'Athletics',
  dec: 'Deception', his: 'History', ins: 'Insight', itm: 'Intimidation',
  inv: 'Investigation', med: 'Medicine', nat: 'Nature', prc: 'Perception',
  prf: 'Performance', per: 'Persuasion', rel: 'Religion', slt: 'Sleight of Hand',
  ste: 'Stealth', sur: 'Survival',
  herb: 'Herbology', mth: 'Magical Theory', mug: 'Muggle Studies',
  mcr: 'Magical Creatures', pot: 'Potion-Making'
}

// Calculate ability modifier
function getAbilityMod(score) {
  return Math.floor((score - 10) / 2)
}

// Format modifier with sign
function formatMod(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

// Get XP from CR
function getXP(cr) {
  return xpByCR[cr] ?? 0
}

// Get proficiency bonus from CR
function getProfBonus(cr) {
  return profByCR[cr] ?? 2
}

// Format CR for display
function formatCR(cr) {
  if (cr === 0.125) return '1/8'
  if (cr === 0.25) return '1/4'
  if (cr === 0.5) return '1/2'
  return String(cr)
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

// Format senses for display
function formatSenses(senses, passivePerception) {
  const parts = []

  if (senses) {
    if (senses.darkvision) parts.push(`Darkvision ${senses.darkvision} ft.`)
    if (senses.blindsight) parts.push(`Blindsight ${senses.blindsight} ft.`)
    if (senses.tremorsense) parts.push(`Tremorsense ${senses.tremorsense} ft.`)
    if (senses.truesight) parts.push(`Truesight ${senses.truesight} ft.`)
    if (senses.special) parts.push(senses.special)
  }

  parts.push(`Passive Perception ${passivePerception}`)
  return parts.join(', ')
}

// Format languages for display
function formatLanguages(languages) {
  if (!languages) return '—'

  const parts = []
  if (languages.value && languages.value.length > 0) {
    parts.push(...languages.value)
  }
  if (languages.custom) {
    parts.push(languages.custom)
  }

  return parts.length > 0 ? parts.join(', ') : '—'
}

// Format damage types for display
function formatDamageTypes(types) {
  if (!types || types.length === 0) return ''
  return types.join(', ')
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

// Process items (abilities, weapons, etc.) from creature
function processCreatureItems(items, profBonus) {
  const traits = []
  const actions = []
  const bonusActions = []
  const reactions = []
  const legendaryActions = []

  for (const item of items || []) {
    const name = item.name
    const sys = item.system || {}
    const desc = htmlToMarkdown(sys.description?.value || '')

    // Check activation type
    const activationType = sys.activation?.type || ''

    // Build the item entry
    let entry = `**${name}.**`

    // Add recharge notation if present
    if (sys.recharge?.value) {
      if (sys.recharge.value === 6) {
        entry = `**${name} (Recharge 6).**`
      } else {
        entry = `**${name} (Recharge ${sys.recharge.value}-6).**`
      }
    }

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

      if (sys.target?.value) {
        entry += `, ${sys.target.value} target${sys.target.value > 1 ? 's' : ''}.`
      } else {
        entry += ', one target.'
      }

      // Add damage
      if (sys.damage?.parts && sys.damage.parts.length > 0) {
        const damageParts = sys.damage.parts.map(([formula, type]) => `${formula} ${type} damage`).join(' plus ')
        entry += ` *Hit:* ${damageParts}.`
      }

      // Add description if present
      if (desc) {
        entry += ` ${desc}`
      }
    } else if (desc) {
      entry += ` ${desc}`
    }

    // Sort into categories
    if (activationType === 'legendary') {
      legendaryActions.push(entry)
    } else if (activationType === 'reaction') {
      reactions.push(entry)
    } else if (activationType === 'bonus') {
      bonusActions.push(entry)
    } else if (activationType === 'action') {
      actions.push(entry)
    } else if (item.type === 'weapon') {
      actions.push(entry)
    } else {
      traits.push(entry)
    }
  }

  return { traits, actions, bonusActions, reactions, legendaryActions }
}

// Process a single creature JSON file
function processCreature(jsonPath) {
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
  const xp = getXP(cr)
  const profBonus = getProfBonus(cr)

  // Get abilities
  const abilities = sys.abilities || {}
  const str = abilities.str?.value ?? 10
  const dex = abilities.dex?.value ?? 10
  const con = abilities.con?.value ?? 10
  const int = abilities.int?.value ?? 10
  const wis = abilities.wis?.value ?? 10
  const cha = abilities.cha?.value ?? 10

  const strMod = getAbilityMod(str)
  const dexMod = getAbilityMod(dex)
  const conMod = getAbilityMod(con)
  const intMod = getAbilityMod(int)
  const wisMod = getAbilityMod(wis)
  const chaMod = getAbilityMod(cha)

  // Get saving throw proficiencies
  const saves = {}
  for (const abl of abilityNames) {
    if (abilities[abl]?.proficient) {
      const mod = getAbilityMod(abilities[abl].value ?? 10)
      saves[abl] = mod + profBonus
    }
  }

  // Format saves display
  const savesDisplay = Object.entries(saves)
    .map(([abl, val]) => `${abl.charAt(0).toUpperCase() + abl.slice(1)} ${formatMod(val)}`)
    .join(', ') || ''

  // Get skill proficiencies
  const skills = sys.skills || {}
  const skillBonuses = {}
  const skillsDisplay = []
  for (const [skill, data] of Object.entries(skills)) {
    if (data.value && data.value > 0) {
      const ability = skillAbilityMap[skill] || 'int'
      const abilityMod = getAbilityMod(abilities[ability]?.value ?? 10)
      const bonus = abilityMod + (data.value * profBonus)
      skillBonuses[skill] = bonus
      const skillName = skillFullNames[skill] || skill
      skillsDisplay.push(`${skillName} ${formatMod(bonus)}`)
    }
  }

  // Calculate passive perception
  const perceptionBonus = skillBonuses.prc ?? wisMod
  const passivePerception = 10 + perceptionBonus

  // Get traits (damage, conditions)
  const traits = sys.traits || {}
  const damageImmunities = traits.di?.value || []
  const damageResistances = traits.dr?.value || []
  const damageVulnerabilities = traits.dv?.value || []
  const conditionImmunities = traits.ci?.value || []
  const languages = traits.languages || {}

  // Get size
  const size = traits.size || 'med'

  // Get movement
  const movement = sys.attributes?.movement || {}

  // Get senses
  const senses = sys.attributes?.senses || {}

  // Get AC
  const ac = sys.attributes?.ac?.value ?? 10
  const acCalc = sys.attributes?.ac?.calc || 'natural'
  const acType = acCalc === 'natural' ? 'natural armor' : ''

  // Get HP
  const hp = sys.attributes?.hp?.value ?? sys.attributes?.hp?.max ?? 10
  const hpFormula = sys.attributes?.hp?.formula || ''

  // Get type and alignment
  const creatureType = sys.details?.type?.value || 'beast'
  const alignment = sys.details?.alignment || 'unaligned'

  // Process items for abilities
  const { traits: traitsList, actions, bonusActions, reactions, legendaryActions } =
    processCreatureItems(data.items, profBonus)

  // Build creature object
  const creature = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'creature',
    source: source,
    cr: cr,
    cr_display: formatCR(cr),
    xp: xp,
    size: size,
    size_display: sizeMap[size] || size,
    creature_type: creatureType,
    alignment: alignment,
    ac: ac,
    ac_type: acType,
    hp: hp,
    hp_formula: hpFormula,
    speed_walk: movement.walk ?? 30,
    speed_fly: movement.fly ?? 0,
    speed_swim: movement.swim ?? 0,
    speed_climb: movement.climb ?? 0,
    speed_burrow: movement.burrow ?? 0,
    speed_hover: movement.hover ?? false,
    speed_display: formatSpeed(movement),
    str, dex, con, int, wis, cha,
    str_mod: strMod, dex_mod: dexMod, con_mod: conMod,
    int_mod: intMod, wis_mod: wisMod, cha_mod: chaMod,
    saves_str: saves.str ?? null,
    saves_dex: saves.dex ?? null,
    saves_con: saves.con ?? null,
    saves_int: saves.int ?? null,
    saves_wis: saves.wis ?? null,
    saves_cha: saves.cha ?? null,
    saving_throws_display: savesDisplay,
    skill_bonuses: skillBonuses,
    skills_display: skillsDisplay.join(', ') || '',
    damage_immunities: damageImmunities,
    damage_resistances: damageResistances,
    damage_vulnerabilities: damageVulnerabilities,
    condition_immunities: conditionImmunities,
    senses_darkvision: senses.darkvision ?? 0,
    senses_blindsight: senses.blindsight ?? 0,
    senses_tremorsense: senses.tremorsense ?? 0,
    senses_truesight: senses.truesight ?? 0,
    senses_special: senses.special || '',
    passive_perception: passivePerception,
    senses_display: formatSenses(senses, passivePerception),
    languages: languages.value || [],
    languages_custom: languages.custom || '',
    languages_display: formatLanguages(languages),
    proficiency_bonus: profBonus
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(creature.name)}
foundry_id: ${yamlString(creature.foundry_id)}
type: creature
source: ${yamlString(creature.source)}
cr: ${creature.cr}
cr_display: ${yamlString(creature.cr_display)}
xp: ${creature.xp}
size: ${yamlString(creature.size)}
size_display: ${yamlString(creature.size_display)}
creature_type: ${yamlString(creature.creature_type)}
alignment: ${yamlString(creature.alignment)}
ac: ${creature.ac}
ac_type: ${yamlString(creature.ac_type)}
hp: ${creature.hp}
hp_formula: ${yamlString(creature.hp_formula)}
speed_walk: ${creature.speed_walk}
speed_fly: ${creature.speed_fly}
speed_swim: ${creature.speed_swim}
speed_climb: ${creature.speed_climb}
speed_burrow: ${creature.speed_burrow}
speed_hover: ${creature.speed_hover}
speed_display: ${yamlString(creature.speed_display)}
str: ${creature.str}
dex: ${creature.dex}
con: ${creature.con}
int: ${creature.int}
wis: ${creature.wis}
cha: ${creature.cha}
str_mod: ${creature.str_mod}
dex_mod: ${creature.dex_mod}
con_mod: ${creature.con_mod}
int_mod: ${creature.int_mod}
wis_mod: ${creature.wis_mod}
cha_mod: ${creature.cha_mod}
saves_str: ${creature.saves_str}
saves_dex: ${creature.saves_dex}
saves_con: ${creature.saves_con}
saves_int: ${creature.saves_int}
saves_wis: ${creature.saves_wis}
saves_cha: ${creature.saves_cha}
saving_throws_display: ${yamlString(creature.saving_throws_display)}
skill_bonuses: ${JSON.stringify(creature.skill_bonuses)}
skills_display: ${yamlString(creature.skills_display)}
damage_immunities: ${JSON.stringify(creature.damage_immunities)}
damage_resistances: ${JSON.stringify(creature.damage_resistances)}
damage_vulnerabilities: ${JSON.stringify(creature.damage_vulnerabilities)}
condition_immunities: ${JSON.stringify(creature.condition_immunities)}
senses_darkvision: ${creature.senses_darkvision}
senses_blindsight: ${creature.senses_blindsight}
senses_tremorsense: ${creature.senses_tremorsense}
senses_truesight: ${creature.senses_truesight}
senses_special: ${yamlString(creature.senses_special)}
passive_perception: ${creature.passive_perception}
senses_display: ${yamlString(creature.senses_display)}
languages: ${JSON.stringify(creature.languages)}
languages_custom: ${yamlString(creature.languages_custom)}
languages_display: ${yamlString(creature.languages_display)}
proficiency_bonus: ${creature.proficiency_bonus}
---`

  // Build content sections
  let content = `${frontmatter}

# ${creature.name}

`

  // Add traits section
  if (traitsList.length > 0) {
    content += `## Traits\n\n${traitsList.join('\n\n')}\n\n`
  }

  // Add actions section
  if (actions.length > 0) {
    content += `## Actions\n\n${actions.join('\n\n')}\n\n`
  }

  // Add bonus actions section
  if (bonusActions.length > 0) {
    content += `## Bonus Actions\n\n${bonusActions.join('\n\n')}\n\n`
  }

  // Add reactions section
  if (reactions.length > 0) {
    content += `## Reactions\n\n${reactions.join('\n\n')}\n\n`
  }

  // Add legendary actions section
  if (legendaryActions.length > 0) {
    content += `## Legendary Actions\n\n${legendaryActions.join('\n\n')}\n\n`
  }

  return { creature, content }
}

// Main execution
function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Get all JSON files
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} creature files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { creature, content } = processCreature(inputPath)

      // Create safe filename
      const safeName = creature.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} creatures created, ${errorCount} errors`)
}

main()
