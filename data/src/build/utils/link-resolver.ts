/**
 * Builds a lookup function that resolves display names to Foundry @UUID strings.
 *
 * At build time, all entities are loaded so we can build a complete
 * name → { pack, docType, foundryId } map. Wikilinks like [[Called Shot]]
 * become @UUID[Compendium.wands.features-wands.Item.Id95hikL7vGvRxVb]{Called Shot}.
 */

export type LinkResolver = (displayName: string) => string | null;

interface EntityRef {
  name: string;
  id: string;
  foundryId?: string;
  pack: string;
  docType: "Item" | "Actor" | "RollTable";
}

/**
 * Build a link resolver from all loaded entities.
 *
 * @param entities - Flat array of { name, id, foundryId, pack, docType }
 * @returns A function that takes a display name and returns a @UUID string, or null
 */
export function buildLinkResolver(entities: EntityRef[]): LinkResolver {
  // Map display name (case-insensitive) → @UUID string
  const byName = new Map<string, string>();

  for (const e of entities) {
    const fid = e.foundryId ?? e.id;
    const uuid = `@UUID[Compendium.wands.${e.pack}.${e.docType}.${fid}]{${e.name}}`;
    byName.set(e.name.toLowerCase(), uuid);
  }

  return (displayName: string): string | null => {
    return byName.get(displayName.toLowerCase()) ?? null;
  };
}

/** Pack name → Foundry document type mapping */
const PACK_DOC_TYPE: Record<string, "Item" | "Actor" | "RollTable"> = {
  "spells-wands": "Item",
  "items-wands": "Item",
  "features-wands": "Item",
  "backgrounds-wands": "Item",
  "houses-wands": "Item",
  "casting-styles-and-schools-of-magic-wands": "Item",
  "monsters-wands": "Actor",
  "magical-pets-wands": "Actor",
  "animagus-form-wands": "Actor",
  "wands-roll-tables": "RollTable",
};

/**
 * Collect entity refs from all data arrays, ready for buildLinkResolver().
 * Each entity type gets tagged with its pack name and doc type.
 */
export function collectEntityRefs(data: {
  spells?: Array<{ id: string; foundryId?: string }>;
  items?: Array<{ id: string; foundryId?: string }>;
  creatures?: Array<{ id: string; foundryId?: string }>;
  features?: Array<{ id: string; foundryId?: string }>;
  backgrounds?: Array<{ id: string; foundryId?: string }>;
  houses?: Array<{ id: string; foundryId?: string }>;
  castingStyles?: Array<{ id: string; foundryId?: string }>;
  animagusForms?: Array<{ id: string; foundryId?: string }>;
  magicalPets?: Array<{ id: string; foundryId?: string }>;
  rollTables?: Array<{ id: string; foundryId?: string }>;
}, locale: string, t: (key: string, locale: string) => string): EntityRef[] {
  const refs: EntityRef[] = [];

  const addAll = (
    items: Array<{ id: string; foundryId?: string }> | undefined,
    ns: string,
    pack: string,
  ) => {
    if (!items) return;
    const docType = PACK_DOC_TYPE[pack];
    if (!docType) return;
    for (const item of items) {
      refs.push({
        name: t(`${ns}.${item.id}.name`, locale),
        id: item.id,
        foundryId: item.foundryId,
        pack,
        docType,
      });
    }
  };

  addAll(data.spells, "spells", "spells-wands");
  addAll(data.items, "items", "items-wands");
  addAll(data.creatures, "creatures", "monsters-wands");
  addAll(data.features, "features", "features-wands");
  addAll(data.backgrounds, "backgrounds", "backgrounds-wands");
  addAll(data.houses, "houses", "houses-wands");
  addAll(data.castingStyles, "casting-styles", "casting-styles-and-schools-of-magic-wands");
  addAll(data.animagusForms, "animagus-forms", "animagus-form-wands");
  addAll(data.magicalPets, "magical-pets", "magical-pets-wands");
  addAll(data.rollTables, "roll-tables", "wands-roll-tables");

  return refs;
}
