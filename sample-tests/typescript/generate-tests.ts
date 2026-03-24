import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'fs'
import { resolve, relative, dirname, join, basename } from 'path'
import { fileURLToPath } from 'url'
import { extractTypeScriptBlocks, isImportLine } from './src/mdx-extractor'
import { joinMultiLineImports, mergeImports, renderImports } from './src/import-parser'
import { generateTestFileContent } from './src/test-generator'

const __dirname_val = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname_val, '../..')
const SDK_DIR = join(REPO_ROOT, 'sdk')
const GENERATED_DIR = join(__dirname_val, 'generated')

const HELPERS_DIR = join(__dirname_val, 'helpers')
const INTERACTIVE_PATTERNS = []

interface HelperInfo {
  modulePath: string
  absolutePath: string
}

/**
 * Check if a helper file exists for a given source path.
 * For sdk/how-to/basic-operations.mdx, checks helpers/how-to/basic-operations.ts
 * Returns the relative import path from the generated test file, or undefined.
 */
function findHelperInfo(sourcePath: string, testFilePath: string): HelperInfo | undefined {
  const withoutSdk = sourcePath.replace(/^sdk\//, '')
  const helperFile = join(HELPERS_DIR, withoutSdk.replace(/\.mdx$/, '.ts'))
  if (!existsSync(helperFile)) return undefined
  const testDir = dirname(testFilePath)
  let rel = relative(testDir, helperFile).replace(/\.ts$/, '')
  if (!rel.startsWith('.')) rel = './' + rel
  return { modulePath: rel, absolutePath: helperFile }
}

/**
 * Dynamically import a helper module and read its preTestProvides export.
 */
async function loadPreTestProvides(helperAbsolutePath: string): Promise<Record<string, string[]>> {
  try {
    const mod = await import(helperAbsolutePath)
    return mod.preTestProvides ?? {}
  } catch {
    return {}
  }
}

/**
 * Dynamically import a helper module and read its additionalImports export.
 */
async function loadAdditionalImports(helperAbsolutePath: string): Promise<string[]> {
  try {
    const mod = await import(helperAbsolutePath)
    return mod.additionalImports ?? []
  } catch {
    return []
  }
}

/** Recursively collect all .mdx files under a directory. */
function findMdxFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) results.push(...findMdxFiles(full))
    else if (entry.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

// --- Pass 1: Collect all import lines across all MDX files ---

const mdxFiles = findMdxFiles(SDK_DIR)
const allImportLines: string[] = []

interface FileData {
  mdxPath: string
  sourcePath: string
  blocks: { code: string; startLine: number }[]
}

const fileDataList: FileData[] = []

for (const mdxPath of mdxFiles) {
  const content = readFileSync(mdxPath, 'utf8')
  const blocks = extractTypeScriptBlocks(content)

  if (blocks.length === 0) continue

  const sourcePath = relative(REPO_ROOT, mdxPath)

  for (const block of blocks) {
    // Join multi-line imports into single lines before collecting
    const normalizedLines = joinMultiLineImports(block.code.split('\n'))
    for (const line of normalizedLines) {
      if (isImportLine(line)) {
        allImportLines.push(line.trim())
      }
    }

    for (const pattern of INTERACTIVE_PATTERNS) {
      if (block.code.includes(pattern)) {
        console.warn(`⚠  ${sourcePath} (line ${block.startLine}): block contains "${pattern.trim()}" — will fail at test time`)
        break
      }
    }
  }

  fileDataList.push({ mdxPath, sourcePath, blocks })
}

// Collect additional imports from helper files
for (const fileData of fileDataList) {
  const relToSdk = relative(SDK_DIR, fileData.mdxPath)
  const testFileName = relToSdk.replace(/\.mdx$/, '.test.ts')
  const outPath = join(GENERATED_DIR, testFileName)
  const helperInfo = findHelperInfo(fileData.sourcePath, outPath)
  if (helperInfo) {
    const helperImports = await loadAdditionalImports(helperInfo.absolutePath)
    for (const line of helperImports) {
      const normalizedLines = joinMultiLineImports(line.split('\n'))
      for (const normalized of normalizedLines) {
        if (isImportLine(normalized)) {
          allImportLines.push(normalized.trim())
        }
      }
    }
  }
}

const merged = mergeImports(allImportLines)
const importSuperset = renderImports(merged)

// --- Pass 2: Generate test files ---

if (existsSync(GENERATED_DIR)) {
  rmSync(GENERATED_DIR, { recursive: true, force: true })
}
mkdirSync(GENERATED_DIR, { recursive: true })
writeFileSync(join(GENERATED_DIR, '.gitkeep'), '', 'utf8')

let generated = 0

for (const fileData of fileDataList) {
  const relToSdk = relative(SDK_DIR, fileData.mdxPath)
  const testFileName = relToSdk.replace(/\.mdx$/, '.test.ts')
  const outPath = join(GENERATED_DIR, testFileName)

  const helperInfo = findHelperInfo(fileData.sourcePath, outPath)
  let preTestProvides: Record<string, string[]> | undefined
  if (helperInfo) {
    preTestProvides = await loadPreTestProvides(helperInfo.absolutePath)
  }

  const content = generateTestFileContent({
    sourcePath: fileData.sourcePath,
    blocks: fileData.blocks,
    importSuperset,
    helperModulePath: helperInfo?.modulePath,
    preTestProvides,
  })

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, content, 'utf8')

  console.log(`✓  ${fileData.sourcePath}  →  sample-tests/generated/${testFileName}  (${fileData.blocks.length} block${fileData.blocks.length !== 1 ? 's' : ''})`)
  generated++
}

console.log(`\nGenerated ${generated} test file(s) from ${mdxFiles.length} MDX file(s).`)
