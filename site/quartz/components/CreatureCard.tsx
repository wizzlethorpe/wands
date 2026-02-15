import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

function getAbilityMod(score: number): string {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export default (() => {
  const CreatureCard: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    // Only render on creature pages
    const isCreaturePage =
      fileData.slug?.includes("Creatures/") &&
      fileData.slug !== "Creatures/index" &&
      fileData.frontmatter?.cr !== undefined

    if (!isCreaturePage) {
      return null
    }

    const fm = fileData.frontmatter || {}

    // Build type line (e.g., "Large beast, unaligned")
    const typeLine = [
      fm.size_display || fm.size,
      fm.creature_type,
      fm.alignment ? `, ${fm.alignment}` : "",
    ]
      .filter(Boolean)
      .join(" ")

    // AC with type
    const acDisplay = fm.ac_type ? `${fm.ac} (${fm.ac_type})` : fm.ac

    // HP with formula
    const hpDisplay = fm.hp_formula ? `${fm.hp} (${fm.hp_formula})` : fm.hp

    return (
      <div class="creature-card">
        <div class="creature-header">
          <div class="creature-type-line">{typeLine}</div>
          <div class="creature-cr">
            <span class="cr-label">CR</span>
            <span class="cr-value">{fm.cr_display || fm.cr}</span>
            {fm.xp && <span class="xp-value">({fm.xp.toLocaleString()} XP)</span>}
          </div>
        </div>

        <div class="creature-basics">
          <div class="creature-stat-row">
            <span class="stat-label">Armor Class</span>
            <span class="stat-value">{acDisplay}</span>
          </div>
          <div class="creature-stat-row">
            <span class="stat-label">Hit Points</span>
            <span class="stat-value">{hpDisplay}</span>
          </div>
          <div class="creature-stat-row">
            <span class="stat-label">Speed</span>
            <span class="stat-value">{fm.speed_display}</span>
          </div>
        </div>

        <div class="creature-abilities">
          <div class="ability-score">
            <span class="ability-name">STR</span>
            <span class="ability-value">{fm.str}</span>
            <span class="ability-mod">({getAbilityMod(fm.str as number)})</span>
          </div>
          <div class="ability-score">
            <span class="ability-name">DEX</span>
            <span class="ability-value">{fm.dex}</span>
            <span class="ability-mod">({getAbilityMod(fm.dex as number)})</span>
          </div>
          <div class="ability-score">
            <span class="ability-name">CON</span>
            <span class="ability-value">{fm.con}</span>
            <span class="ability-mod">({getAbilityMod(fm.con as number)})</span>
          </div>
          <div class="ability-score">
            <span class="ability-name">INT</span>
            <span class="ability-value">{fm.int}</span>
            <span class="ability-mod">({getAbilityMod(fm.int as number)})</span>
          </div>
          <div class="ability-score">
            <span class="ability-name">WIS</span>
            <span class="ability-value">{fm.wis}</span>
            <span class="ability-mod">({getAbilityMod(fm.wis as number)})</span>
          </div>
          <div class="ability-score">
            <span class="ability-name">CHA</span>
            <span class="ability-value">{fm.cha}</span>
            <span class="ability-mod">({getAbilityMod(fm.cha as number)})</span>
          </div>
        </div>

        <div class="creature-details">
          {fm.saving_throws_display && (
            <div class="creature-stat-row">
              <span class="stat-label">Saving Throws</span>
              <span class="stat-value">{fm.saving_throws_display}</span>
            </div>
          )}
          {fm.skills_display && (
            <div class="creature-stat-row">
              <span class="stat-label">Skills</span>
              <span class="stat-value">{fm.skills_display}</span>
            </div>
          )}
          {fm.damage_vulnerabilities && (fm.damage_vulnerabilities as string[]).length > 0 && (
            <div class="creature-stat-row">
              <span class="stat-label">Damage Vulnerabilities</span>
              <span class="stat-value">{(fm.damage_vulnerabilities as string[]).join(", ")}</span>
            </div>
          )}
          {fm.damage_resistances && (fm.damage_resistances as string[]).length > 0 && (
            <div class="creature-stat-row">
              <span class="stat-label">Damage Resistances</span>
              <span class="stat-value">{(fm.damage_resistances as string[]).join(", ")}</span>
            </div>
          )}
          {fm.damage_immunities && (fm.damage_immunities as string[]).length > 0 && (
            <div class="creature-stat-row">
              <span class="stat-label">Damage Immunities</span>
              <span class="stat-value">{(fm.damage_immunities as string[]).join(", ")}</span>
            </div>
          )}
          {fm.condition_immunities && (fm.condition_immunities as string[]).length > 0 && (
            <div class="creature-stat-row">
              <span class="stat-label">Condition Immunities</span>
              <span class="stat-value">{(fm.condition_immunities as string[]).join(", ")}</span>
            </div>
          )}
          {fm.senses_display && (
            <div class="creature-stat-row">
              <span class="stat-label">Senses</span>
              <span class="stat-value">{fm.senses_display}</span>
            </div>
          )}
          {fm.languages_display && (
            <div class="creature-stat-row">
              <span class="stat-label">Languages</span>
              <span class="stat-value">{fm.languages_display}</span>
            </div>
          )}
        </div>

        {fm.source && (
          <div class="creature-source">
            <em>Source: {fm.source}</em>
          </div>
        )}
      </div>
    )
  }

  CreatureCard.css = `
.creature-card {
  background: var(--lightgray);
  border: 2px solid var(--gray);
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin: 1.5rem 0;
}

.creature-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--secondary);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.creature-type-line {
  font-style: italic;
  color: var(--darkgray);
  font-size: 0.95rem;
}

.creature-cr {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
}

.cr-label {
  color: var(--gray);
  font-size: 0.85rem;
}

.cr-value {
  color: var(--secondary);
  font-size: 1.1rem;
}

.xp-value {
  color: var(--gray);
  font-size: 0.85rem;
  font-weight: normal;
}

.creature-basics {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--gray);
}

.creature-stat-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
  flex-wrap: wrap;
}

.creature-stat-row .stat-label {
  font-weight: 600;
  color: var(--dark);
  min-width: 140px;
}

.creature-stat-row .stat-value {
  color: var(--darkgray);
}

.creature-abilities {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: color-mix(in srgb, var(--secondary) 10%, transparent);
  border-radius: 0.25rem;
  text-align: center;
}

.ability-score {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.ability-name {
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ability-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark);
}

.ability-mod {
  font-size: 0.85rem;
  color: var(--darkgray);
}

.creature-details {
  margin-bottom: 0.75rem;
}

.creature-source {
  border-top: 1px solid var(--gray);
  padding-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--gray);
}

@media (max-width: 768px) {
  .creature-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .creature-abilities {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }

  .creature-stat-row {
    flex-direction: column;
    gap: 0.15rem;
  }

  .creature-stat-row .stat-label {
    min-width: auto;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .creature-abilities {
    grid-template-columns: repeat(2, 1fr);
  }
}
`

  return CreatureCard
}) satisfies QuartzComponentConstructor
