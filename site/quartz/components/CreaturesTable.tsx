import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface CreatureData {
  name: string
  cr: number
  crDisplay: string
  size: string
  type: string
  hp: number
  ac: number
  slug: string
}

const sizeOrder: Record<string, number> = {
  tiny: 1,
  sm: 2,
  med: 3,
  lg: 4,
  huge: 5,
  grg: 6,
  Tiny: 1,
  Small: 2,
  Medium: 3,
  Large: 4,
  Huge: 5,
  Gargantuan: 6,
}

export default (() => {
  const CreaturesTable: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    // Only render on the Creatures folder index page (handles both Creatures/ and Compendium/Creatures/)
    const slug = fileData.slug ?? ""
    const isCreaturesIndex = slug.includes("Creatures/index") || slug.endsWith("Creatures")

    if (!isCreaturesIndex) {
      return null
    }

    // Get all creature files from the Creatures folder (handles both Creatures/ and Compendium/Creatures/)
    const creatures: CreatureData[] = allFiles
      .filter((file) => {
        const fileSlug = file.slug ?? ""
        const isCreature = fileSlug.includes("Creatures/") && !fileSlug.endsWith("Creatures/index") && !fileSlug.endsWith("Creatures")
        return isCreature && file.frontmatter?.cr !== undefined
      })
      .map((file) => ({
        name: (file.frontmatter?.name as string) || (file.frontmatter?.title as string) || "",
        cr: (file.frontmatter?.cr as number) ?? 0,
        crDisplay: (file.frontmatter?.cr_display as string) || String(file.frontmatter?.cr ?? 0),
        size: (file.frontmatter?.size_display as string) || (file.frontmatter?.size as string) || "Medium",
        type: (file.frontmatter?.creature_type as string) || "creature",
        hp: (file.frontmatter?.hp as number) ?? 0,
        ac: (file.frontmatter?.ac as number) ?? 10,
        slug: file.slug ?? "",
      }))
      .filter((creature) => creature.name)
      .sort((a, b) => a.name.localeCompare(b.name))

    // Get unique values for filters
    const uniqueCRs = Array.from(new Set(creatures.map((c) => c.cr))).sort((a, b) => a - b)
    const uniqueSizes = Array.from(new Set(creatures.map((c) => c.size))).sort(
      (a, b) => (sizeOrder[a] || 0) - (sizeOrder[b] || 0),
    )
    const uniqueTypes = Array.from(new Set(creatures.map((c) => c.type)))
      .filter(Boolean)
      .sort()

    // Format CR for display in dropdown
    const formatCROption = (cr: number): string => {
      if (cr === 0.125) return "1/8"
      if (cr === 0.25) return "1/4"
      if (cr === 0.5) return "1/2"
      return cr.toString()
    }

    return (
      <div class="creatures-table-container">
        <div class="creature-filters">
          <div class="filter-row">
            <div class="filter-group">
              <label for="creature-search">Search:</label>
              <input
                type="text"
                id="creature-search"
                placeholder="Search creature names..."
                class="creature-filter-input"
              />
            </div>

            <div class="filter-group">
              <label for="creature-cr-filter">CR:</label>
              <select id="creature-cr-filter" class="creature-filter-select">
                <option value="">All CRs</option>
                {uniqueCRs.map((cr) => (
                  <option value={cr}>{formatCROption(cr)}</option>
                ))}
              </select>
            </div>

            <div class="filter-group">
              <label for="creature-size-filter">Size:</label>
              <select id="creature-size-filter" class="creature-filter-select">
                <option value="">All Sizes</option>
                {uniqueSizes.map((size) => (
                  <option value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div class="filter-group">
              <label for="creature-type-filter">Type:</label>
              <select id="creature-type-filter" class="creature-filter-select">
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div class="filter-row filter-actions">
            <button id="creature-reset-filters" class="reset-button">
              Reset Filters
            </button>
            <div class="creature-count">
              Showing <span id="creature-visible-count">{creatures.length}</span> of {creatures.length}{" "}
              creatures
            </div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="creatures-table">
            <thead>
              <tr>
                <th data-sort="name" class="sortable">
                  Name <span class="sort-indicator">↕</span>
                </th>
                <th data-sort="cr" class="sortable centered">
                  CR <span class="sort-indicator">↕</span>
                </th>
                <th data-sort="size" class="sortable centered">
                  Size <span class="sort-indicator">↕</span>
                </th>
                <th data-sort="type" class="sortable">
                  Type <span class="sort-indicator">↕</span>
                </th>
                <th class="centered">AC</th>
                <th class="centered">HP</th>
              </tr>
            </thead>
            <tbody id="creatures-table-body">
              {creatures.map((creature) => (
                <tr
                  data-creature-name={creature.name.toLowerCase()}
                  data-creature-cr={creature.cr}
                  data-creature-size={creature.size}
                  data-creature-type={creature.type}
                >
                  <td>
                    <a href={`/${creature.slug}`} class="internal">
                      {creature.name}
                    </a>
                  </td>
                  <td class="centered">{creature.crDisplay}</td>
                  <td class="centered">{creature.size}</td>
                  <td>{creature.type}</td>
                  <td class="centered">{creature.ac}</td>
                  <td class="centered">{creature.hp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  CreaturesTable.css = `
.creatures-table-container {
  margin: 2rem 0;
}

.creature-filters {
  background: var(--lightgray);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.creature-filters .filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.creature-filters .filter-row:last-child {
  margin-bottom: 0;
}

.creature-filters .filter-actions {
  justify-content: space-between;
  align-items: center;
}

.creature-filters .filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 150px;
  flex: 1;
}

.creature-filters .filter-group label {
  font-weight: 600;
  font-size: 0.9rem;
}

.creature-filter-input,
.creature-filter-select {
  padding: 0.5rem;
  border: 1px solid var(--gray);
  border-radius: 0.25rem;
  background: var(--light);
  color: var(--dark);
  font-size: 0.9rem;
}

.creature-filters .reset-button {
  padding: 0.5rem 1rem;
  background: var(--secondary);
  color: var(--light);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.creature-filters .reset-button:hover {
  opacity: 0.8;
}

.creature-count {
  font-size: 0.9rem;
  color: var(--gray);
}

.creatures-table-container .table-wrapper {
  overflow-x: auto;
}

.creatures-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--light);
  border-radius: 0.5rem;
  overflow: hidden;
}

.creatures-table thead {
  background: var(--lightgray);
  border-bottom: 2px solid var(--gray);
}

.creatures-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  user-select: none;
}

.creatures-table th.sortable {
  cursor: pointer;
  transition: background 0.2s;
}

.creatures-table th.sortable:hover {
  background: var(--gray);
}

.creatures-table th.centered {
  text-align: center;
}

.creatures-table .sort-indicator {
  font-size: 0.8rem;
  color: var(--gray);
  margin-left: 0.25rem;
}

.creatures-table tbody tr {
  border-bottom: 1px solid var(--lightgray);
  transition: background 0.2s;
}

.creatures-table tbody tr:hover {
  background: var(--lightgray);
}

.creatures-table tbody tr.hidden {
  display: none;
}

.creatures-table td {
  padding: 0.75rem;
}

.creatures-table td.centered {
  text-align: center;
}

@media (max-width: 768px) {
  .creature-filters {
    padding: 1rem;
  }

  .creature-filters .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .creature-filters .filter-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .creature-filters .filter-group {
    min-width: 100%;
  }

  .creature-filters .reset-button {
    width: 100%;
    padding: 0.75rem;
  }

  .creatures-table-container .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .creatures-table {
    font-size: 0.8rem;
    min-width: 500px;
  }

  .creatures-table th,
  .creatures-table td {
    padding: 0.4rem 0.3rem;
  }

  .creatures-table th {
    font-size: 0.75rem;
  }

  .creature-count {
    font-size: 0.85rem;
    text-align: center;
  }
}
`

  CreaturesTable.afterDOMLoaded = `
const sizeOrder = {
  'Tiny': 1,
  'Small': 2,
  'Medium': 3,
  'Large': 4,
  'Huge': 5,
  'Gargantuan': 6
};

let currentCreatureSort = { column: 'name', ascending: true };

function setupCreaturesTable() {
  const creatureSearch = document.getElementById('creature-search');
  const crFilter = document.getElementById('creature-cr-filter');
  const sizeFilter = document.getElementById('creature-size-filter');
  const typeFilter = document.getElementById('creature-type-filter');
  const resetButton = document.getElementById('creature-reset-filters');
  const tableBody = document.getElementById('creatures-table-body');
  const visibleCount = document.getElementById('creature-visible-count');

  if (!tableBody) return;

  function filterCreatures() {
    if (!tableBody || !visibleCount) return;

    const searchTerm = creatureSearch?.value.toLowerCase() || '';
    const crValue = crFilter?.value || '';
    const sizeValue = sizeFilter?.value || '';
    const typeValue = typeFilter?.value || '';

    const rows = Array.from(tableBody.querySelectorAll('tr'));
    let visibleRows = 0;

    rows.forEach(row => {
      const name = row.dataset.creatureName || '';
      const cr = row.dataset.creatureCr || '';
      const size = row.dataset.creatureSize || '';
      const type = row.dataset.creatureType || '';

      let show = true;

      if (searchTerm && !name.includes(searchTerm)) show = false;
      if (crValue && cr !== crValue) show = false;
      if (sizeValue && size !== sizeValue) show = false;
      if (typeValue && type !== typeValue) show = false;

      if (show) {
        row.classList.remove('hidden');
        visibleRows++;
      } else {
        row.classList.add('hidden');
      }
    });

    visibleCount.textContent = visibleRows.toString();
  }

  function sortCreaturesTable(column, ascending) {
    if (!tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let aVal, bVal;

      if (column === 'name') {
        aVal = a.dataset.creatureName || '';
        bVal = b.dataset.creatureName || '';
      } else if (column === 'cr') {
        aVal = parseFloat(a.dataset.creatureCr || '0');
        bVal = parseFloat(b.dataset.creatureCr || '0');
      } else if (column === 'size') {
        aVal = sizeOrder[a.dataset.creatureSize] || 0;
        bVal = sizeOrder[b.dataset.creatureSize] || 0;
      } else if (column === 'type') {
        aVal = a.dataset.creatureType || '';
        bVal = b.dataset.creatureType || '';
      }

      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });

    rows.forEach(row => tableBody.appendChild(row));

    document.querySelectorAll('.creatures-table th.sortable').forEach(th => {
      const indicator = th.querySelector('.sort-indicator');
      if (indicator) {
        if (th.dataset.sort === column) {
          indicator.textContent = ascending ? '↑' : '↓';
        } else {
          indicator.textContent = '↕';
        }
      }
    });
  }

  if (creatureSearch) creatureSearch.addEventListener('input', filterCreatures);
  if (crFilter) crFilter.addEventListener('change', filterCreatures);
  if (sizeFilter) sizeFilter.addEventListener('change', filterCreatures);
  if (typeFilter) typeFilter.addEventListener('change', filterCreatures);

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (creatureSearch) creatureSearch.value = '';
      if (crFilter) crFilter.value = '';
      if (sizeFilter) sizeFilter.value = '';
      if (typeFilter) typeFilter.value = '';
      currentCreatureSort = { column: 'name', ascending: true };
      sortCreaturesTable('name', true);
      filterCreatures();
    });
  }

  document.querySelectorAll('.creatures-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.dataset.sort;
      if (currentCreatureSort.column === column) {
        currentCreatureSort.ascending = !currentCreatureSort.ascending;
      } else {
        currentCreatureSort.column = column;
        currentCreatureSort.ascending = true;
      }
      sortCreaturesTable(column, currentCreatureSort.ascending);
    });
  });
}

setupCreaturesTable();
document.addEventListener("nav", setupCreaturesTable);
`

  return CreaturesTable
}) satisfies QuartzComponentConstructor
