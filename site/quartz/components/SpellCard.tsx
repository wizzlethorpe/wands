import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const schoolNames: Record<string, string> = {
  abj: "Abjuration",
  cha: "Charms",
  con: "Conjuration",
  div: "Divination",
  enc: "Enchantment",
  evo: "Evocation",
  ill: "Illusion",
  nec: "Necromancy",
  trs: "Transfiguration",
  tra: "Transfiguration",
}

export default (() => {
  const SpellCard: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    // Only render on spell pages
    const isSpellPage =
      fileData.slug?.includes("Spells/") &&
      fileData.slug !== "Spells/index" &&
      fileData.frontmatter?.type === "spell"

    if (!isSpellPage) {
      return null
    }

    const fm = fileData.frontmatter || {}
    const level = (fm.level as number) ?? 0
    const school = (fm.school as string) || ""
    const schoolDisplay = (fm.school_display as string) || schoolNames[school] || school
    const ritual = fm.ritual === true
    const concentration = fm.concentration === true

    // Format casting time
    const activationType = (fm.activation_type as string) || ""
    const activationCost = fm.activation_cost as number
    let castingTime = activationType
    if (activationCost && activationCost > 1) {
      castingTime = `${activationCost} ${activationType}s`
    }

    return (
      <div class="spell-card">
        <div class="spell-card-header">
          <div class="spell-level-school">
            <span class="spell-level">{level === 0 ? "Cantrip" : `Level ${level}`}</span>
            {schoolDisplay && (
              <>
                <span class="spell-separator">•</span>
                <span class="spell-school">{schoolDisplay}</span>
              </>
            )}
          </div>
          <div class="spell-tags">
            {ritual && <span class="spell-tag ritual">Ritual</span>}
            {concentration && <span class="spell-tag concentration">Concentration</span>}
          </div>
        </div>

        <div class="spell-stats-grid">
          {castingTime && (
            <div class="spell-stat">
              <span class="spell-stat-label">Casting Time</span>
              <span class="spell-stat-value">{castingTime}</span>
            </div>
          )}
          {fm.range_display && (
            <div class="spell-stat">
              <span class="spell-stat-label">Range</span>
              <span class="spell-stat-value">{fm.range_display}</span>
            </div>
          )}
          {fm.duration_display && (
            <div class="spell-stat">
              <span class="spell-stat-label">Duration</span>
              <span class="spell-stat-value">{fm.duration_display}</span>
            </div>
          )}
          {fm.components_display && (
            <div class="spell-stat">
              <span class="spell-stat-label">Components</span>
              <span class="spell-stat-value">{fm.components_display}</span>
            </div>
          )}
          {fm.target_display && fm.target_display !== "—" && (
            <div class="spell-stat">
              <span class="spell-stat-label">Target</span>
              <span class="spell-stat-value">{fm.target_display}</span>
            </div>
          )}
          {fm.save_ability && (
            <div class="spell-stat">
              <span class="spell-stat-label">Saving Throw</span>
              <span class="spell-stat-value">{(fm.save_ability as string).toUpperCase()}</span>
            </div>
          )}
        </div>

        {fm.material_description && (
          <div class="spell-materials">
            <span class="spell-materials-label">Materials:</span> {fm.material_description}
            {fm.material_consumed && <span class="consumed-note"> (consumed)</span>}
          </div>
        )}

        {fm.source && (
          <div class="spell-source">
            <em>Source: {fm.source}</em>
          </div>
        )}
      </div>
    )
  }

  SpellCard.css = `
.spell-card {
  background: var(--lightgray);
  border: 2px solid var(--gray);
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin: 1.5rem 0;
}

.spell-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--secondary);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.spell-level-school {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--secondary);
}

.spell-separator {
  color: var(--gray);
}

.spell-school {
  color: var(--darkgray);
  font-style: italic;
}

.spell-tags {
  display: flex;
  gap: 0.5rem;
}

.spell-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spell-tag.ritual {
  background: var(--tertiary);
  color: var(--dark);
}

.spell-tag.concentration {
  background: var(--secondary);
  color: var(--light);
}

.spell-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.spell-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.spell-stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray);
}

.spell-stat-value {
  font-size: 0.95rem;
  color: var(--dark);
  font-weight: 500;
}

.spell-materials {
  background: color-mix(in srgb, var(--secondary) 10%, transparent);
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.spell-materials-label {
  font-weight: 600;
  color: var(--secondary);
}

.consumed-note {
  color: var(--gray);
  font-style: italic;
}

.spell-source {
  border-top: 1px solid var(--gray);
  padding-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--gray);
}

@media (max-width: 768px) {
  .spell-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .spell-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .spell-stats-grid {
    grid-template-columns: 1fr;
  }
}
`

  return SpellCard
}) satisfies QuartzComponentConstructor
