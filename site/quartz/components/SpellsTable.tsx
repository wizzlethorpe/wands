import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface SpellData {
  name: string
  level: number
  school: string
  schoolDisplay: string
  range: string
  duration: string
  ritual: boolean
  concentration: boolean
  slug: string
}

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
  const SpellsTable: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    // Only render on the Spells folder index page (handles both Spells/ and Compendium/Spells/)
    const slug = fileData.slug ?? ""
    const isSpellsIndex = slug.includes("Spells/index") || slug.endsWith("Spells")

    if (!isSpellsIndex) {
      return null
    }

    // Get all spell files from the Spells folder (handles both Spells/ and Compendium/Spells/)
    const spells: SpellData[] = allFiles
      .filter((file) => {
        const fileSlug = file.slug ?? ""
        const isSpell = fileSlug.includes("Spells/") && !fileSlug.endsWith("Spells/index") && !fileSlug.endsWith("Spells")
        return isSpell && file.frontmatter?.type === "spell"
      })
      .map((file) => ({
        name: (file.frontmatter?.name as string) || (file.frontmatter?.title as string) || "",
        level: (file.frontmatter?.level as number) ?? 0,
        school: (file.frontmatter?.school as string) || "",
        schoolDisplay: (file.frontmatter?.school_display as string) || schoolNames[(file.frontmatter?.school as string)] || "",
        range: (file.frontmatter?.range_display as string) || "—",
        duration: (file.frontmatter?.duration_display as string) || "—",
        ritual: file.frontmatter?.ritual === true,
        concentration: file.frontmatter?.concentration === true,
        slug: file.slug ?? "",
      }))
      .filter((spell) => spell.name)
      .sort((a, b) => a.name.localeCompare(b.name))

    // Get unique values for filters
    const uniqueLevels = Array.from(new Set(spells.map((s) => s.level))).sort((a, b) => a - b)
    const uniqueSchools = Array.from(new Set(spells.map((s) => s.school))).filter(Boolean).sort()

    return (
      <div class="spells-table-container">
        <div class="spell-filters">
          <div class="filter-row">
            <div class="filter-group">
              <label for="spell-search">Search:</label>
              <input
                type="text"
                id="spell-search"
                placeholder="Search spell names..."
                class="spell-filter-input"
              />
            </div>

            <div class="filter-group">
              <label for="spell-level-filter">Level:</label>
              <select id="spell-level-filter" class="spell-filter-select">
                <option value="">All Levels</option>
                {uniqueLevels.map((level) => (
                  <option value={level}>{level === 0 ? "Cantrip" : level}</option>
                ))}
              </select>
            </div>

            <div class="filter-group">
              <label for="spell-school-filter">School:</label>
              <select id="spell-school-filter" class="spell-filter-select">
                <option value="">All Schools</option>
                {uniqueSchools.map((school) => (
                  <option value={school}>{schoolNames[school] || school}</option>
                ))}
              </select>
            </div>
          </div>

          <div class="filter-row">
            <label class="checkbox-label">
              <input type="checkbox" id="spell-ritual-filter" />
              <span>Ritual Only</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="spell-concentration-filter" />
              <span>Concentration Only</span>
            </label>
            <button id="spell-reset-filters" class="reset-button">
              Reset Filters
            </button>
          </div>

          <div class="spell-count">
            Showing <span id="spell-visible-count">{spells.length}</span> of {spells.length} spells
          </div>
        </div>

        <div class="table-wrapper">
          <table class="spells-table">
            <thead>
              <tr>
                <th data-sort="name" class="sortable">
                  Name <span class="sort-indicator">↕</span>
                </th>
                <th data-sort="level" class="sortable centered">
                  Level <span class="sort-indicator">↕</span>
                </th>
                <th data-sort="school" class="sortable">
                  School <span class="sort-indicator">↕</span>
                </th>
                <th class="centered">Range</th>
                <th class="centered">Duration</th>
                <th class="centered">R</th>
                <th class="centered">C</th>
              </tr>
            </thead>
            <tbody id="spells-table-body">
              {spells.map((spell) => (
                <tr
                  data-spell-name={spell.name.toLowerCase()}
                  data-spell-level={spell.level}
                  data-spell-school={spell.school}
                  data-spell-ritual={spell.ritual}
                  data-spell-concentration={spell.concentration}
                >
                  <td>
                    <a href={`/${spell.slug}`} class="internal">
                      {spell.name}
                    </a>
                  </td>
                  <td class="centered">{spell.level === 0 ? "Cantrip" : spell.level}</td>
                  <td>{spell.schoolDisplay || "—"}</td>
                  <td class="centered">{spell.range}</td>
                  <td class="centered">{spell.duration}</td>
                  <td class="centered">{spell.ritual ? "✓" : "—"}</td>
                  <td class="centered">{spell.concentration ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  SpellsTable.css = `
.spells-table-container {
  margin: 2rem 0;
}

.spell-filters {
  background: var(--lightgray);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.spell-filters .filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.spell-filters .filter-row:last-of-type {
  margin-bottom: 0.5rem;
}

.spell-filters .filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 200px;
  flex: 1;
}

.spell-filters .filter-group label {
  font-weight: 600;
  font-size: 0.9rem;
}

.spell-filter-input,
.spell-filter-select {
  padding: 0.5rem;
  border: 1px solid var(--gray);
  border-radius: 0.25rem;
  background: var(--light);
  color: var(--dark);
  font-size: 0.9rem;
}

.spell-filters .checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  margin: 0;
}

.spell-filters .checkbox-label input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
  margin: 0;
  flex-shrink: 0;
}

.spell-filters .reset-button {
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

.spell-filters .reset-button:hover {
  opacity: 0.8;
}

.spell-count {
  font-size: 0.9rem;
  color: var(--gray);
  margin-top: 0.5rem;
}

.spells-table-container .table-wrapper {
  overflow-x: auto;
}

.spells-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--light);
  border-radius: 0.5rem;
  overflow: hidden;
}

.spells-table thead {
  background: var(--lightgray);
  border-bottom: 2px solid var(--gray);
}

.spells-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  user-select: none;
}

.spells-table th.sortable {
  cursor: pointer;
  transition: background 0.2s;
}

.spells-table th.sortable:hover {
  background: var(--gray);
}

.spells-table th.centered {
  text-align: center;
}

.spells-table .sort-indicator {
  font-size: 0.8rem;
  color: var(--gray);
  margin-left: 0.25rem;
}

.spells-table tbody tr {
  border-bottom: 1px solid var(--lightgray);
  transition: background 0.2s;
}

.spells-table tbody tr:hover {
  background: var(--lightgray);
}

.spells-table tbody tr.hidden {
  display: none;
}

.spells-table td {
  padding: 0.75rem;
}

.spells-table td.centered {
  text-align: center;
}

@media (max-width: 768px) {
  .spell-filters {
    padding: 1rem;
  }

  .spell-filters .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .spell-filters .filter-group {
    min-width: 100%;
  }

  .spell-filters .checkbox-label {
    padding: 0.5rem;
    background: var(--light);
    border-radius: 0.25rem;
  }

  .spell-filters .reset-button {
    width: 100%;
    padding: 0.75rem;
  }

  .spells-table-container .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .spells-table {
    font-size: 0.8rem;
    min-width: 600px;
  }

  .spells-table th,
  .spells-table td {
    padding: 0.4rem 0.3rem;
  }

  .spells-table th {
    font-size: 0.75rem;
  }

  .spell-count {
    font-size: 0.85rem;
  }
}
`

  SpellsTable.afterDOMLoaded = `
let currentSpellSort = { column: 'name', ascending: true };

function setupSpellsTable() {
  const spellSearch = document.getElementById('spell-search');
  const levelFilter = document.getElementById('spell-level-filter');
  const schoolFilter = document.getElementById('spell-school-filter');
  const ritualFilter = document.getElementById('spell-ritual-filter');
  const concentrationFilter = document.getElementById('spell-concentration-filter');
  const resetButton = document.getElementById('spell-reset-filters');
  const tableBody = document.getElementById('spells-table-body');
  const visibleCount = document.getElementById('spell-visible-count');

  if (!tableBody) return;

  function filterSpells() {
    if (!tableBody || !visibleCount) return;

    const searchTerm = spellSearch?.value.toLowerCase() || '';
    const levelValue = levelFilter?.value || '';
    const schoolValue = schoolFilter?.value || '';
    const ritualOnly = ritualFilter?.checked || false;
    const concentrationOnly = concentrationFilter?.checked || false;

    const rows = Array.from(tableBody.querySelectorAll('tr'));
    let visibleRows = 0;

    rows.forEach(row => {
      const name = row.dataset.spellName || '';
      const level = row.dataset.spellLevel || '';
      const school = row.dataset.spellSchool || '';
      const ritual = row.dataset.spellRitual === 'true';
      const concentration = row.dataset.spellConcentration === 'true';

      let show = true;

      if (searchTerm && !name.includes(searchTerm)) show = false;
      if (levelValue && level !== levelValue) show = false;
      if (schoolValue && school !== schoolValue) show = false;
      if (ritualOnly && !ritual) show = false;
      if (concentrationOnly && !concentration) show = false;

      if (show) {
        row.classList.remove('hidden');
        visibleRows++;
      } else {
        row.classList.add('hidden');
      }
    });

    visibleCount.textContent = visibleRows.toString();
  }

  function sortSpellsTable(column, ascending) {
    if (!tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let aVal, bVal;

      if (column === 'name') {
        aVal = a.dataset.spellName || '';
        bVal = b.dataset.spellName || '';
      } else if (column === 'level') {
        aVal = parseInt(a.dataset.spellLevel || '0');
        bVal = parseInt(b.dataset.spellLevel || '0');
      } else if (column === 'school') {
        aVal = a.dataset.spellSchool || '';
        bVal = b.dataset.spellSchool || '';
      }

      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });

    rows.forEach(row => tableBody.appendChild(row));

    document.querySelectorAll('.spells-table th.sortable').forEach(th => {
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

  if (spellSearch) spellSearch.addEventListener('input', filterSpells);
  if (levelFilter) levelFilter.addEventListener('change', filterSpells);
  if (schoolFilter) schoolFilter.addEventListener('change', filterSpells);
  if (ritualFilter) ritualFilter.addEventListener('change', filterSpells);
  if (concentrationFilter) concentrationFilter.addEventListener('change', filterSpells);

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (spellSearch) spellSearch.value = '';
      if (levelFilter) levelFilter.value = '';
      if (schoolFilter) schoolFilter.value = '';
      if (ritualFilter) ritualFilter.checked = false;
      if (concentrationFilter) concentrationFilter.checked = false;
      currentSpellSort = { column: 'name', ascending: true };
      sortSpellsTable('name', true);
      filterSpells();
    });
  }

  document.querySelectorAll('.spells-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.dataset.sort;
      if (currentSpellSort.column === column) {
        currentSpellSort.ascending = !currentSpellSort.ascending;
      } else {
        currentSpellSort.column = column;
        currentSpellSort.ascending = true;
      }
      sortSpellsTable(column, currentSpellSort.ascending);
    });
  });
}

setupSpellsTable();
document.addEventListener("nav", setupSpellsTable);
`

  return SpellsTable
}) satisfies QuartzComponentConstructor
