# TypeScript Code Sample Validation Infrastructure — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pipeline that extracts all TypeScript code blocks from `sdk/**/*.mdx` docs, assembles them into self-contained `.ts` files, and validates them with `tsc --noEmit`.

**Architecture:** A Node.js extractor script (`extract.mjs`) reads all MDX files, extracts TypeScript fences, deduplicates imports, and writes one `.ts` file per source MDX file into a `generated/` directory. A separate `validate.mjs` script runs `tsc` and maps compiler errors back to their source MDX files. Ambient type declarations cover undeclared tutorial helpers so type-checking can run without live credentials.

**Tech Stack:** Node.js ≥19, TypeScript 5.x, `@icure/cardinal-sdk` (SDK under test), plain ESM `.mjs` scripts (no extra build tooling needed).

---

## Chunk 1: Project Scaffold & TypeScript Config

### Task 1: Create the `sample-tests/` directory scaffold

**Files:**
- Create: `sample-tests/package.json`
- Create: `sample-tests/tsconfig.json`
- Create: `sample-tests/tsconfig.check.json`
- Create: `sample-tests/.gitignore`
- Create: `sample-tests/generated/.gitkeep`

- [ ] **Step 1: Create `sample-tests/package.json`**

```json
{
  "name": "cardinal-sdk-sample-tests",
  "version": "1.0.0",
  "description": "Validates TypeScript code samples from the Cardinal SDK documentation",
  "type": "module",
  "scripts": {
    "extract": "node extract.mjs",
    "check": "tsc --noEmit -p tsconfig.check.json",
    "validate": "node extract.mjs && tsc --noEmit -p tsconfig.check.json 2>&1 | node validate.mjs"
  },
  "dependencies": {
    "@icure/cardinal-sdk": "^2.1.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.0",
    "typescript": "^5.6.2"
  },
  "engines": {
    "node": ">=19"
  }
}
```

- [ ] **Step 2: Create `sample-tests/tsconfig.json`** (base config)

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ESNext"],
    "strict": false,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

- [ ] **Step 3: Create `sample-tests/tsconfig.check.json`** (used to compile generated samples + stubs)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": [
    "stubs/**/*.ts",
    "generated/**/*.ts"
  ]
}
```

- [ ] **Step 4: Create `sample-tests/.gitignore`**

```
node_modules/
generated/
dist/
```

- [ ] **Step 5: Create `sample-tests/generated/.gitkeep`** (empty placeholder)

- [ ] **Step 6: Install dependencies**

```bash
cd sample-tests && yarn install
```

Expected: `node_modules/` created, `@icure/cardinal-sdk` installed.

- [ ] **Step 7: Commit**

```bash
git add sample-tests/
git commit -m "feat(sample-tests): scaffold TypeScript validation project"
```

---

## Chunk 2: Ambient Stubs for Tutorial Helpers

### Task 2: Write ambient declarations for undeclared helpers

Several tutorial files use helper functions (`readLn`, `currentFuzzyDate`, `random`) and assume a top-level `sdk` variable is in scope. These need ambient declarations so `tsc` does not error on them.

**Files:**
- Create: `sample-tests/stubs/doc-helpers.d.ts`

- [ ] **Step 1: Create `sample-tests/stubs/doc-helpers.d.ts`**

```typescript
import type { CardinalSdk } from "@icure/cardinal-sdk";

// Tutorial helper: prompts user for CLI input (readline wrapper)
declare function readLn(prompt: string): Promise<string>;

// Returns current date as a fuzzy date number (YYYYMMDDHHmmss)
declare function currentFuzzyDate(): number;

// Returns a random integer in [min, max]
declare function random(min: number, max: number): number;

// Common top-level tutorial variable — tutorial modules assume this is in scope
declare let sdk: CardinalSdk;
```

- [ ] **Step 2: Verify `tsc` accepts the stubs (nothing else compiled yet)**

```bash
cd sample-tests && yarn check
```

Expected: Exit 0 (no errors from stubs alone).

- [ ] **Step 3: Commit**

```bash
git add sample-tests/stubs/doc-helpers.d.ts
git commit -m "feat(sample-tests): add ambient declarations for tutorial helper functions"
```

---

## Chunk 3: MDX Extractor Script

### Task 3: Write `extract.mjs` — the core MDX to TS file generator

This script:
1. Recursively finds all `sdk/**/*.mdx` files
2. For each file: extracts all ` ```typescript ` fences
3. Deduplicates import statements across all blocks in the file
4. Concatenates all non-import lines in document order
5. Writes the result to `generated/<mirror-path>.ts`

**Files:**
- Create: `sample-tests/extract.mjs`

- [ ] **Step 1: Create `sample-tests/extract.mjs`**

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { resolve, relative, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const SDK_DIR = join(REPO_ROOT, 'sdk')
const GENERATED_DIR = join(__dirname, 'generated')

/** Recursively collect all .mdx files under a directory. */
function findMdxFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) results.push(...findMdxFiles(full))
    else if (entry.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

/**
 * Extract all typescript code fence contents from an MDX string.
 * Returns an array of code block strings (content between the fences).
 */
export function extractTypeScriptBlocks(mdxContent) {
  const pattern = /```typescript\r?\n([\s\S]*?)```/g
  return [...mdxContent.matchAll(pattern)].map(m => m[1])
}

/**
 * Merge multiple TypeScript code blocks into a single compilable file:
 * - Collect and deduplicate import statements (exact-line match)
 * - Concatenate all non-import lines in order
 */
export function mergeBlocks(blocks) {
  const importLines = new Set()
  const bodyLines = []

  for (const block of blocks) {
    for (const line of block.split('\n')) {
      const trimmed = line.trim()
      if (trimmed.startsWith('import ') && trimmed.includes(' from ')) {
        importLines.add(line.trimEnd())
      } else {
        bodyLines.push(line.trimEnd())
      }
    }
    bodyLines.push('')  // blank line between merged blocks
  }

  // Collapse runs of more than one blank line
  const dedupedBody = bodyLines.reduce((acc, line) => {
    if (line === '' && acc.length > 0 && acc[acc.length - 1] === '') return acc
    acc.push(line)
    return acc
  }, [])

  return [...importLines, '', ...dedupedBody].join('\n')
}

/** Convert an MDX absolute path to the output .ts path under generated/. */
export function mdxPathToGeneratedPath(mdxPath) {
  const rel = relative(SDK_DIR, mdxPath)       // e.g. "how-to/basic-operations.mdx"
  const tsRel = rel.replace(/\.mdx$/, '.ts')   // e.g. "how-to/basic-operations.ts"
  return join(GENERATED_DIR, tsRel)
}

// --- Main ---

const files = findMdxFiles(SDK_DIR)
let extracted = 0
let skipped = 0

for (const mdxPath of files) {
  const content = readFileSync(mdxPath, 'utf8')
  const blocks = extractTypeScriptBlocks(content)

  if (blocks.length === 0) {
    skipped++
    continue
  }

  const merged = mergeBlocks(blocks)
  const outPath = mdxPathToGeneratedPath(mdxPath)

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, merged, 'utf8')

  console.log(
    `✓  ${relative(REPO_ROOT, mdxPath)}  →  ${relative(REPO_ROOT, outPath)}  (${blocks.length} block${blocks.length > 1 ? 's' : ''})`
  )
  extracted++
}

console.log(`\nExtracted ${extracted} file(s), skipped ${skipped} (no TS blocks).`)
```

- [ ] **Step 2: Run the extractor for the first time**

```bash
cd sample-tests && node extract.mjs
```

Expected: output like:
```
✓  sdk/how-to/basic-operations.mdx  →  sample-tests/generated/how-to/basic-operations.ts  (13 blocks)
...
Extracted 25 file(s), skipped 37 (no TS blocks).
```

- [ ] **Step 3: Spot-check a generated file**

```bash
head -40 sample-tests/generated/how-to/basic-operations.ts
```

Expected: Import lines at top, followed by function definitions from the MDX.

- [ ] **Step 4: Commit**

```bash
git add sample-tests/extract.mjs
git commit -m "feat(sample-tests): add MDX TypeScript extractor"
```

---

## Chunk 4: Validation Reporter

### Task 4: Write `validate.mjs` — maps `tsc` errors back to source MDX files

Reads `tsc` output from stdin, maps each `.ts` generated path back to the original `.mdx` file, and prints a grouped summary with exit code 1 on any errors.

**Files:**
- Create: `sample-tests/validate.mjs`

- [ ] **Step 1: Create `sample-tests/validate.mjs`**

```javascript
#!/usr/bin/env node
/**
 * Reads tsc stdout/stderr (piped in), maps generated .ts error paths back to
 * source .mdx files, and prints a grouped human-readable report.
 *
 * Usage:
 *   tsc --noEmit -p tsconfig.check.json 2>&1 | node validate.mjs
 */
import { createInterface } from 'readline'
import { resolve, relative } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GENERATED_DIR = resolve(__dirname, 'generated')
const REPO_ROOT = resolve(__dirname, '..')

// Matches lines like: generated/how-to/basic-operations.ts(12,5): error TS2304: Cannot find name 'foo'.
const TSC_LINE = /^(.+\.ts)\((\d+),(\d+)\): (error|warning) (TS\d+): (.+)$/

function toSourceMdx(tsRelPath) {
  const abs = resolve(__dirname, tsRelPath)
  const rel = relative(GENERATED_DIR, abs)
  return 'sdk/' + rel.replace(/\.ts$/, '.mdx')
}

const rl = createInterface({ input: process.stdin, terminal: false })
const errorsBySource = new Map()
let totalErrors = 0

for await (const line of rl) {
  const m = TSC_LINE.exec(line)
  if (!m) continue
  const [, tsFile, lineNum, , severity, tsCode, message] = m
  const source = toSourceMdx(tsFile)
  if (!errorsBySource.has(source)) errorsBySource.set(source, [])
  errorsBySource.get(source).push({ line: +lineNum, severity, tsCode, message })
  if (severity === 'error') totalErrors++
}

if (errorsBySource.size === 0) {
  console.log('✅  All TypeScript code samples compiled successfully.')
  process.exit(0)
}

console.log('\n❌  TypeScript validation failed\n')
for (const [source, issues] of [...errorsBySource.entries()].sort()) {
  console.log(`  ${source}`)
  for (const { line, severity, tsCode, message } of issues) {
    const icon = severity === 'error' ? '✗' : '⚠'
    console.log(`    ${icon} [${tsCode}] ${message}  (generated line ${line})`)
  }
  console.log()
}
console.log(`Total: ${totalErrors} error(s) across ${errorsBySource.size} doc file(s)`)
process.exit(1)
```

Note: `for await` at top-level requires Node ≥14.8 with `"type": "module"`, which is already set in `package.json`.

- [ ] **Step 2: Run the full validation pipeline**

```bash
cd sample-tests && yarn validate
```

Expected: Either a clean `✅` message or a grouped error list by source MDX file — not a raw `tsc` dump.

- [ ] **Step 3: Commit**

```bash
git add sample-tests/validate.mjs
git commit -m "feat(sample-tests): add tsc error reporter that maps errors to source MDX files"
```

---

## Chunk 5: Integration & Clean Pass

### Task 5: Fix compilation errors found in first full run

After running `yarn validate` there will likely be errors. Get to a clean pass (zero errors). Only acceptable fixes:

1. **Add missing ambient declarations** to `stubs/doc-helpers.d.ts` (undeclared variables/functions used in fragments)
2. **Fix the extractor** if it generates malformed TS (bad import deduplication, etc.)
3. **`// @ts-ignore` with comment** only as last resort for genuinely unfixable generated lines

Do NOT modify `.mdx` doc files to make them pass — validate them as-is.

- [ ] **Step 1: Collect all errors**

```bash
cd sample-tests && yarn validate 2>&1 | tee /tmp/ts-errors.txt
cat /tmp/ts-errors.txt
```

- [ ] **Step 2: Categorize the errors**

Common expected issues and fixes:

| Error | Likely Fix |
|---|---|
| `Cannot find name 'readLn'` | Check `tsconfig.check.json` includes `stubs/` |
| `Cannot find module '@icure/cardinal-sdk'` | Run `yarn install` in `sample-tests/` |
| `Duplicate identifier` | Two blocks in same file declare the same `const` — add dedup logic to `mergeBlocks` for `const`/`let`/`var` declarations |
| `Expression expected` or syntax parse error | A block contains non-TS code (bash, partial snippet) — add a heuristic to skip blocks that fail a basic sanity check |
| `Cannot find name 'X'` for a variable used in a tutorial fragment | Add `declare let X: <type>` to `doc-helpers.d.ts` |

- [ ] **Step 3: Apply fixes iteratively, re-running after each batch**

```bash
cd sample-tests && yarn validate
```

Repeat until exit 0.

- [ ] **Step 4: Commit**

```bash
git add sample-tests/stubs/doc-helpers.d.ts sample-tests/extract.mjs
git commit -m "fix(sample-tests): resolve all initial TypeScript compilation errors"
```

---

### Task 6: Wire up a root-level convenience script

**Files:**
- Modify: `package.json` (repo root)

- [ ] **Step 1: Read the root `package.json` to find the `scripts` block**

Read `package.json` (repo root), locate the `"scripts"` section.

- [ ] **Step 2: Add the `validate:samples` script**

Add to `"scripts"`:
```json
"validate:samples": "cd sample-tests && yarn validate"
```

- [ ] **Step 3: Verify from repo root**

```bash
yarn validate:samples
```

Expected: Same output as running from `sample-tests/`.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "feat: add validate:samples script to root package.json"
```

---

## File Map Summary

| File | Purpose |
|---|---|
| `sample-tests/package.json` | Project deps (`@icure/cardinal-sdk`, `typescript`) |
| `sample-tests/tsconfig.json` | Base TS compiler options (ESNext, no strict) |
| `sample-tests/tsconfig.check.json` | Includes `generated/` + `stubs/` for type-checking |
| `sample-tests/stubs/doc-helpers.d.ts` | Ambient declarations for tutorial helpers & common vars |
| `sample-tests/extract.mjs` | MDX parser — writes one `.ts` per source MDX |
| `sample-tests/validate.mjs` | Maps `tsc` output to source MDX files, reports grouped errors |
| `sample-tests/generated/` | Git-ignored, auto-generated TS files |

**Run the full check:**

```bash
yarn validate:samples
# or
cd sample-tests && yarn validate
```
