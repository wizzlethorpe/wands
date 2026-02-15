/** Escape a value for safe inline YAML output */
export function yamlValue(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value.toString();
  if (typeof value === "number") return value.toString();
  if (Array.isArray(value) || typeof value === "object") return JSON.stringify(value);

  const str = String(value);
  // Quote if the string contains YAML-special characters or looks like a different type
  if (
    str.includes(":") ||
    str.includes("#") ||
    str.includes("'") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.startsWith(" ") ||
    str.endsWith(" ") ||
    str === "" ||
    str === "true" ||
    str === "false" ||
    str === "null" ||
    /^\d/.test(str) ||
    /^[@&*!|>%{[\-?]/.test(str)
  ) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}
