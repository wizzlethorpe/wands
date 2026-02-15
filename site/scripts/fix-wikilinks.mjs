#!/usr/bin/env node

/**
 * Script to simplify wikilinks by removing folder prefixes.
 *
 * Transforms:
 *   [[Spells/Expecto Patronum|patronus charm]] -> [[Expecto Patronum|patronus charm]]
 *   [[Rules/Chapter 1 - Houses|Chapter 1]] -> [[Chapter 1 - Houses|Chapter 1]]
 *   [[Items/Some Item]] -> [[Some Item]]
 *
 * Usage: node scripts/fix-wikilinks.mjs
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const CONTENT_DIR = './content';

// Regex to match wikilinks with folder prefixes
// Matches [[Folder/Page|Display]] or [[Folder/Page]]
// Also handles nested folders like [[Folder/Subfolder/Page|Display]]
const WIKILINK_REGEX = /\[\[([^\]|]+)\/([^\]|]+)(\|[^\]]+)?\]\]/g;

async function getAllMarkdownFiles(dir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && extname(entry.name) === '.md') {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

function fixWikilinks(content) {
  let modified = false;

  const newContent = content.replace(WIKILINK_REGEX, (match, folderPath, pageName, displayPart) => {
    modified = true;
    // displayPart includes the | if present, e.g., "|patronus charm"
    const display = displayPart || '';
    return `[[${pageName}${display}]]`;
  });

  return { content: newContent, modified };
}

async function processFile(filePath) {
  const content = await readFile(filePath, 'utf-8');
  const { content: newContent, modified } = fixWikilinks(content);

  if (modified) {
    await writeFile(filePath, newContent, 'utf-8');
    return true;
  }

  return false;
}

async function main() {
  console.log('Scanning for markdown files...');
  const files = await getAllMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${files.length} markdown files`);

  let modifiedCount = 0;

  for (const file of files) {
    const wasModified = await processFile(file);
    if (wasModified) {
      modifiedCount++;
      console.log(`Updated: ${file}`);
    }
  }

  console.log(`\nDone! Modified ${modifiedCount} files.`);
}

main().catch(console.error);
