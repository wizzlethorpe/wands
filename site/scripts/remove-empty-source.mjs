#!/usr/bin/env node

/**
 * Remove files with empty source frontmatter
 *
 * This script finds and deletes markdown files where the frontmatter
 * has `source: ""` (empty string).
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONTENT_DIR = path.join(__dirname, '..', 'content')

// Track deleted files
const deletedFiles = []
const skippedFiles = []

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  return match[1]
}

function hasEmptySource(frontmatter) {
  // Match source: "" or source: '' (empty string)
  return /^source:\s*["']{2}\s*$/m.test(frontmatter)
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      processDirectory(fullPath)
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const frontmatter = extractFrontmatter(content)

      if (frontmatter && hasEmptySource(frontmatter)) {
        const relativePath = path.relative(CONTENT_DIR, fullPath)
        console.log(`Deleting: ${relativePath}`)
        fs.unlinkSync(fullPath)
        deletedFiles.push(relativePath)
      }
    }
  }
}

console.log('Scanning for files with empty source...\n')
processDirectory(CONTENT_DIR)

console.log('\n--- Summary ---')
console.log(`Deleted: ${deletedFiles.length} files`)

if (deletedFiles.length > 0) {
  console.log('\nDeleted files:')
  deletedFiles.forEach(f => console.log(`  - ${f}`))
}
