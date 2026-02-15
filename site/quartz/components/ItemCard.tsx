import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const rarityColors: Record<string, string> = {
  common: "#9e9e9e",
  uncommon: "#4caf50",
  rare: "#2196f3",
  veryRare: "#9c27b0",
  legendary: "#ff9800",
  artifact: "#f44336",
}

export default (() => {
  const ItemCard: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    // Only render on item pages
    const isItemPage =
      fileData.slug?.includes("Items/") &&
      fileData.slug !== "Items/index" &&
      fileData.frontmatter?.type !== undefined &&
      fileData.frontmatter?.type !== "spell"

    if (!isItemPage) {
      return null
    }

    const fm = fileData.frontmatter || {}
    const category = (fm.category as string) || (fm.type as string) || "Item"
    const rarity = (fm.rarity as string) || "common"
    const rarityDisplay = (fm.rarity_display as string) || rarity
    const attunement = fm.attunement === true || (fm.attunement as number) > 0

    return (
      <div class="item-card">
        <div class="item-card-header">
          <div class="item-type-line">
            <span class="item-category">{category}</span>
            {attunement && <span class="item-attunement">(requires attunement)</span>}
          </div>
          <div class={`item-rarity rarity-${rarity}`}>{rarityDisplay}</div>
        </div>

        <div class="item-stats-grid">
          {fm.price_display && (
            <div class="item-stat">
              <span class="item-stat-label">Price</span>
              <span class="item-stat-value">{fm.price_display}</span>
            </div>
          )}
          {fm.weight_display && (
            <div class="item-stat">
              <span class="item-stat-label">Weight</span>
              <span class="item-stat-value">{fm.weight_display}</span>
            </div>
          )}
          {fm.activation_type && (
            <div class="item-stat">
              <span class="item-stat-label">Activation</span>
              <span class="item-stat-value">{fm.activation_type}</span>
            </div>
          )}
          {fm.duration_display && (
            <div class="item-stat">
              <span class="item-stat-label">Duration</span>
              <span class="item-stat-value">{fm.duration_display}</span>
            </div>
          )}
          {fm.uses_max && (
            <div class="item-stat">
              <span class="item-stat-label">Uses</span>
              <span class="item-stat-value">
                {fm.uses_max}
                {fm.uses_per && ` / ${fm.uses_per}`}
              </span>
            </div>
          )}
          {fm.armor_value && (
            <div class="item-stat">
              <span class="item-stat-label">AC</span>
              <span class="item-stat-value">{fm.armor_value}</span>
            </div>
          )}
        </div>

        {fm.source && (
          <div class="item-source">
            <em>Source: {fm.source}</em>
          </div>
        )}
      </div>
    )
  }

  ItemCard.css = `
.item-card {
  background: var(--lightgray);
  border: 2px solid var(--gray);
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin: 1.5rem 0;
}

.item-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--secondary);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.item-type-line {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-category {
  font-style: italic;
  color: var(--darkgray);
  font-size: 0.95rem;
}

.item-attunement {
  font-size: 0.85rem;
  color: var(--gray);
  font-style: italic;
}

.item-rarity {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
}

.rarity-common { background: #9e9e9e; }
.rarity-uncommon { background: #4caf50; }
.rarity-rare { background: #2196f3; }
.rarity-veryRare { background: #9c27b0; }
.rarity-legendary { background: #ff9800; }
.rarity-artifact { background: #f44336; }

.item-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.item-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray);
}

.item-stat-value {
  font-size: 0.95rem;
  color: var(--dark);
  font-weight: 500;
}

.item-source {
  border-top: 1px solid var(--gray);
  padding-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--gray);
}

@media (max-width: 768px) {
  .item-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .item-stats-grid {
    grid-template-columns: 1fr;
  }
}
`

  return ItemCard
}) satisfies QuartzComponentConstructor
