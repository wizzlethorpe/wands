import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_DIR = path.join(__dirname, '..', 'wands', 'packs-json', 'wands-roll-tables')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'Roll Tables')

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

// Process results into structured entries
function processResults(results) {
  const entries = []

  for (const result of results || []) {
    const entry = {
      range: result.range || [1, 1],
      weight: result.weight ?? 1,
      text: result.text || '',
      type: result.type ?? 0
    }
    entries.push(entry)
  }

  // Sort by range start
  entries.sort((a, b) => a.range[0] - b.range[0])

  return entries
}

// Process a single roll table JSON file
function processTable(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))

  // Process results
  const entries = processResults(data.results)

  const table = {
    public: true,
    name: data.name,
    foundry_id: data._id,
    type: 'rolltable',
    formula: data.formula || '1d20',
    replacement: data.replacement ?? true,
    display_roll: data.displayRoll ?? true,
    entries: entries
  }

  // Build frontmatter
  const frontmatter = `---
public: true
name: ${yamlString(table.name)}
foundry_id: ${yamlString(table.foundry_id)}
type: rolltable
formula: ${yamlString(table.formula)}
replacement: ${table.replacement}
display_roll: ${table.display_roll}
entries: ${JSON.stringify(table.entries)}
---`

  // Build content - also display the table in readable format
  let content = `${frontmatter}

# ${table.name}

**Roll:** ${table.formula}

| Roll | Result |
|:----:|:-------|
`

  for (const entry of entries) {
    const rangeStr = entry.range[0] === entry.range[1]
      ? String(entry.range[0])
      : `${entry.range[0]}-${entry.range[1]}`
    const text = entry.text.replace(/\|/g, '\\|').replace(/\n/g, ' ')
    content += `| ${rangeStr} | ${text} |\n`
  }

  return { table, content }
}

// Main execution
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.json'))

  console.log(`Processing ${files.length} roll table files...`)

  let successCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      const inputPath = path.join(INPUT_DIR, file)
      const { table, content } = processTable(inputPath)

      const safeName = table.name.replace(/[<>:"/\\|?*]/g, '_')
      const outputPath = path.join(OUTPUT_DIR, `${safeName}.md`)

      fs.writeFileSync(outputPath, content, 'utf8')
      successCount++
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\nCompleted: ${successCount} roll tables created, ${errorCount} errors`)
}

main()
