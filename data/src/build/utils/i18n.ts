import fs from "node:fs";
import path from "node:path";

const localesDir = path.resolve(import.meta.dirname, "../../locales");

/** In-memory cache: locale → namespace → key → value */
const cache = new Map<string, Map<string, Record<string, string>>>();

function loadNamespace(locale: string, namespace: string): Record<string, string> {
  const filePath = path.join(localesDir, locale, `${namespace}.json`);
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function getNamespace(locale: string, namespace: string): Record<string, string> {
  if (!cache.has(locale)) cache.set(locale, new Map());
  const localeCache = cache.get(locale)!;
  if (!localeCache.has(namespace)) {
    localeCache.set(namespace, loadNamespace(locale, namespace));
  }
  return localeCache.get(namespace)!;
}

/**
 * Resolve a translation key for a given locale.
 *
 * Keys follow the pattern `namespace.key`, e.g. `spells.accio.name`.
 * Falls back to English when the requested locale is missing a key.
 */
export function t(key: string, locale: string = "en"): string {
  const dotIdx = key.indexOf(".");
  if (dotIdx === -1) return key;

  const namespace = key.slice(0, dotIdx);
  const subKey = key.slice(dotIdx + 1);

  // Try requested locale
  const data = getNamespace(locale, namespace);
  if (data[subKey] !== undefined) return data[subKey];

  // Fall back to English
  if (locale !== "en") {
    const enData = getNamespace("en", namespace);
    if (enData[subKey] !== undefined) return enData[subKey];
  }

  return key; // return the raw key as last resort
}

/** List all available locales (directories under locales/) */
export function availableLocales(): string[] {
  if (!fs.existsSync(localesDir)) return [];
  return fs
    .readdirSync(localesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/**
 * Report translation coverage for a locale compared to English.
 * Returns { total, translated, missing[] }.
 */
export function coverage(locale: string, namespace: string) {
  const en = getNamespace("en", namespace);
  const target = getNamespace(locale, namespace);
  const enKeys = Object.keys(en);
  const missing = enKeys.filter((k) => target[k] === undefined);
  return { total: enKeys.length, translated: enKeys.length - missing.length, missing };
}

/** Flush the cache (useful between test runs) */
export function clearCache() {
  cache.clear();
}
