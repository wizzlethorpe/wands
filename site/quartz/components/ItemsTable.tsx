import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface ItemData {
  name: string
  category: string
  rarity: string
  rarityDisplay: string
  price: string
  slug: string
}

const rarityOrder: Record<string, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  veryRare: 4,
  legendary: 5,
  artifact: 6,
}

export default (() => {
  const ItemsTable: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    // Only render on the Items folder index page (handles both Items/ and Compendium/Items/)
    const slug = fileData.slug ?? ""
    const isItemsIndex = slug.includes("Items/index") || slug.endsWith("Items")

    if (!isItemsIndex) {
      return null
    }

    // Get all item files from the Items folder (handles both Items/ and Compendium/Items/)
    const items: ItemData[] = allFiles
      .filter((file) => {
        const fileSlug = file.slug ?? ""
        const isItem = fileSlug.includes("Items/") && !fileSlug.endsWith("Items/index") && !fileSlug.endsWith("Items")
        return isItem && file.frontmatter?.type !== undefined
      })
      .map((file) => ({
        name: (file.frontmatter?.name as string) || (file.frontmatter?.title as string) || "",
        category: (file.frontmatter?.category as string) || (file.frontmatter?.type as string) || "Item",
        rarity: (file.frontmatter?.rarity as string) || "common",
        rarityDisplay: (file.frontmatter?.rarity_display as string) || "Common",
        price: (file.frontmatter?.price_display as string) || "—",
        slug: file.slug ?? "",
      }))
      .filter((item) => item.name)
      .sort((a, b) => a.name.localeCompare(b.name))

    // Get unique values for filters
    const uniqueCategories = Array.from(new Set(items.map((i) => i.category)))
      .filter(Boolean)
      .sort()
    const uniqueRarities = Array.from(new Set(items.map((i) => i.rarity)))
      .filter(Boolean)
      .sort((a, b) => (rarityOrder[a] || 0) - (rarityOrder[b] || 0))

    const rarityDisplayMap: Record<string, string> = {
      common: "Common",
      uncommon: "Uncommon",
      rare: "Rare",
      veryRare: "Very Rare",
      legendary: "Legendary",
      artifact: "Artifact",
    }

    return (
      <div class="items-table-container">
        <div class="item-filters">
          <div class="filter-row">
            <div class="filter-group">
              <label for="item-search">Search:</label>
              <input
                type="text"
                id="item-search"
                placeholder="Search item names..."
                class="item-filter-input"
              />
            </div>

            <div class="filter-group">
              <label for="item-category-filter">Category:</label>
              <select id="item-category-filter" class="item-filter-select">
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div class="filter-group">
              <label for="item-rarity-filter">Rarity:</label>
              <select id="item-rarity-filter" class="item-filter-select">
                <option value="">All Rarities</option>
                {uniqueRarities.map((rarity) => (
                  <option value={rarity}>{rarityDisplayMap[rarity] || rarity}</option>
                ))}
              </select>
            </div>
          </div>

          <div class="filter-row filter-actions">
            <button id="item-reset-filters" class="reset-button">
              Reset Filters
            </button>
            <div class="item-count">
              Showing <span id="item-visible-count">{items.length}</span> of {items.length} items
            </div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="items-table">
            <thead>
              <tr>
                <th data-sort="name" class="sortable">
                  Name <span class="sort-indicator">↕</span>
                </th>
                <th data-sort="category" class="sortable">
                  Category <span class="sort-indicator">↕</span>
                </th>
                <th data-sort="rarity" class="sortable centered">
                  Rarity <span class="sort-indicator">↕</span>
                </th>
                <th class="centered">Price</th>
              </tr>
            </thead>
            <tbody id="items-table-body">
              {items.map((item) => (
                <tr
                  data-item-name={item.name.toLowerCase()}
                  data-item-category={item.category}
                  data-item-rarity={item.rarity}
                >
                  <td>
                    <a href={`/${item.slug}`} class="internal">
                      {item.name}
                    </a>
                  </td>
                  <td>{item.category}</td>
                  <td class="centered">
                    <span class={`rarity-badge rarity-${item.rarity}`}>{item.rarityDisplay}</span>
                  </td>
                  <td class="centered">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  ItemsTable.css = `
.items-table-container {
  margin: 2rem 0;
}

.item-filters {
  background: var(--lightgray);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.item-filters .filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.item-filters .filter-row:last-child {
  margin-bottom: 0;
}

.item-filters .filter-actions {
  justify-content: space-between;
  align-items: center;
}

.item-filters .filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 150px;
  flex: 1;
}

.item-filters .filter-group label {
  font-weight: 600;
  font-size: 0.9rem;
}

.item-filter-input,
.item-filter-select {
  padding: 0.5rem;
  border: 1px solid var(--gray);
  border-radius: 0.25rem;
  background: var(--light);
  color: var(--dark);
  font-size: 0.9rem;
}

.item-filters .reset-button {
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

.item-filters .reset-button:hover {
  opacity: 0.8;
}

.item-count {
  font-size: 0.9rem;
  color: var(--gray);
}

.items-table-container .table-wrapper {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--light);
  border-radius: 0.5rem;
  overflow: hidden;
}

.items-table thead {
  background: var(--lightgray);
  border-bottom: 2px solid var(--gray);
}

.items-table th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  user-select: none;
}

.items-table th.sortable {
  cursor: pointer;
  transition: background 0.2s;
}

.items-table th.sortable:hover {
  background: var(--gray);
}

.items-table th.centered {
  text-align: center;
}

.items-table .sort-indicator {
  font-size: 0.8rem;
  color: var(--gray);
  margin-left: 0.25rem;
}

.items-table tbody tr {
  border-bottom: 1px solid var(--lightgray);
  transition: background 0.2s;
}

.items-table tbody tr:hover {
  background: var(--lightgray);
}

.items-table tbody tr.hidden {
  display: none;
}

.items-table td {
  padding: 0.75rem;
}

.items-table td.centered {
  text-align: center;
}

.rarity-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.rarity-common { background: #9e9e9e; }
.rarity-uncommon { background: #4caf50; }
.rarity-rare { background: #2196f3; }
.rarity-veryRare { background: #9c27b0; }
.rarity-legendary { background: #ff9800; }
.rarity-artifact { background: #f44336; }

@media (max-width: 768px) {
  .item-filters {
    padding: 1rem;
  }

  .item-filters .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .item-filters .filter-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .item-filters .filter-group {
    min-width: 100%;
  }

  .item-filters .reset-button {
    width: 100%;
    padding: 0.75rem;
  }

  .items-table-container .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .items-table {
    font-size: 0.8rem;
    min-width: 400px;
  }

  .items-table th,
  .items-table td {
    padding: 0.4rem 0.3rem;
  }

  .items-table th {
    font-size: 0.75rem;
  }

  .item-count {
    font-size: 0.85rem;
    text-align: center;
  }
}
`

  ItemsTable.afterDOMLoaded = `
const rarityOrder = {
  'common': 1,
  'uncommon': 2,
  'rare': 3,
  'veryRare': 4,
  'legendary': 5,
  'artifact': 6
};

let currentItemSort = { column: 'name', ascending: true };

function setupItemsTable() {
  const itemSearch = document.getElementById('item-search');
  const categoryFilter = document.getElementById('item-category-filter');
  const rarityFilter = document.getElementById('item-rarity-filter');
  const resetButton = document.getElementById('item-reset-filters');
  const tableBody = document.getElementById('items-table-body');
  const visibleCount = document.getElementById('item-visible-count');

  if (!tableBody) return;

  function filterItems() {
    if (!tableBody || !visibleCount) return;

    const searchTerm = itemSearch?.value.toLowerCase() || '';
    const categoryValue = categoryFilter?.value || '';
    const rarityValue = rarityFilter?.value || '';

    const rows = Array.from(tableBody.querySelectorAll('tr'));
    let visibleRows = 0;

    rows.forEach(row => {
      const name = row.dataset.itemName || '';
      const category = row.dataset.itemCategory || '';
      const rarity = row.dataset.itemRarity || '';

      let show = true;

      if (searchTerm && !name.includes(searchTerm)) show = false;
      if (categoryValue && category !== categoryValue) show = false;
      if (rarityValue && rarity !== rarityValue) show = false;

      if (show) {
        row.classList.remove('hidden');
        visibleRows++;
      } else {
        row.classList.add('hidden');
      }
    });

    visibleCount.textContent = visibleRows.toString();
  }

  function sortItemsTable(column, ascending) {
    if (!tableBody) return;

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let aVal, bVal;

      if (column === 'name') {
        aVal = a.dataset.itemName || '';
        bVal = b.dataset.itemName || '';
      } else if (column === 'category') {
        aVal = a.dataset.itemCategory || '';
        bVal = b.dataset.itemCategory || '';
      } else if (column === 'rarity') {
        aVal = rarityOrder[a.dataset.itemRarity] || 0;
        bVal = rarityOrder[b.dataset.itemRarity] || 0;
      }

      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });

    rows.forEach(row => tableBody.appendChild(row));

    document.querySelectorAll('.items-table th.sortable').forEach(th => {
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

  if (itemSearch) itemSearch.addEventListener('input', filterItems);
  if (categoryFilter) categoryFilter.addEventListener('change', filterItems);
  if (rarityFilter) rarityFilter.addEventListener('change', filterItems);

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (itemSearch) itemSearch.value = '';
      if (categoryFilter) categoryFilter.value = '';
      if (rarityFilter) rarityFilter.value = '';
      currentItemSort = { column: 'name', ascending: true };
      sortItemsTable('name', true);
      filterItems();
    });
  }

  document.querySelectorAll('.items-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.dataset.sort;
      if (currentItemSort.column === column) {
        currentItemSort.ascending = !currentItemSort.ascending;
      } else {
        currentItemSort.column = column;
        currentItemSort.ascending = true;
      }
      sortItemsTable(column, currentItemSort.ascending);
    });
  });
}

setupItemsTable();
document.addEventListener("nav", setupItemsTable);
`

  return ItemsTable
}) satisfies QuartzComponentConstructor
