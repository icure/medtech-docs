# TypeScript Sample Test Generation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a TypeScript generator that extracts code blocks from `sdk/**/*.mdx` documentation files and produces Vitest test files, one test per code block, runnable against a real Cardinal backend.

**Architecture:** A single TypeScript script (`generate-tests.ts`) run via `tsx` reads all MDX files, extracts TypeScript fenced blocks, builds a deduplicated import superset, and writes one `.test.ts` file per MDX file into `generated/`. Tests use a shared `helpers/sdk-fixture.ts` for SDK initialization. Vitest runs the generated tests.

**Tech Stack:** TypeScript, Vitest, tsx, `@icure/cardinal-sdk`, Node.js ≥ 19.

**Spec:** `docs/superpowers/specs/2026-03-12-ts-sample-test-generation.md`

---

## Chunk 1: Project Scaffold

### Task 1: Remove old files and update package.json

**Files:**
- Delete: `sample-tests/extract.mjs`
- Delete: `sample-tests/validate.mjs`
- Delete: `sample-tests/tsconfig.check.json`
- Delete: `sample-tests/stubs/doc-helpers.d.ts`
- Modify: `sample-tests/package.json`

- [ ] **Step 1: Delete old files**

```bash
cd sample-tests
rm extract.mjs validate.mjs tsconfig.check.json
rm -rf stubs/
```

- [ ] **Step 2: Update `sample-tests/package.json`**

Replace the full contents with:

```json
{
  "name": "cardinal-sdk-sample-tests",
  "version": "1.0.0",
  "description": "Validates TypeScript code samples from the Cardinal SDK documentation",
  "type": "module",
  "scripts": {
    "generate": "tsx generate-tests.ts",
    "test": "tsx generate-tests.ts && vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@icure/cardinal-sdk": "^2.1.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.2",
    "vitest": "^3.0.0"
  },
  "engines": {
    "node": ">=19"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
cd sample-tests && yarn install
```

Expected: `node_modules/` updated, `vitest` and `tsx` installed.

- [ ] **Step 4: Commit**

```bash
git add -A sample-tests/
git commit -m "chore(sample-tests): remove old tsc-only validation, add vitest + tsx deps"
```

---

### Task 2: Update tsconfig.json and vitest.config.ts

**Files:**
- Modify: `sample-tests/tsconfig.json`
- Create: `sample-tests/vitest.config.ts`
- Modify: `sample-tests/.gitignore`

- [ ] **Step 1: Update `sample-tests/tsconfig.json`**

Replace full contents with:

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
    "noEmit": true,
    "types": ["vitest/globals"]
  }
}
```

The key change: added `"types": ["vitest/globals"]` so `test`, `beforeAll`, `describe` etc. are available without explicit imports in generated files.

- [ ] **Step 2: Create `sample-tests/vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['generated/**/*.test.ts', 'src/__tests__/**/*.test.ts'],
    globals: true,
    testTimeout: 30000,
  },
})
```

- [ ] **Step 3: Update `sample-tests/.gitignore`**

Replace full contents with:

```
node_modules/
generated/
!generated/.gitkeep
dist/
```

The `!generated/.gitkeep` line ensures `.gitkeep` is tracked while the rest of `generated/` is ignored.

- [ ] **Step 4: Verify vitest runs (no tests yet, should exit cleanly)**

```bash
cd sample-tests && npx vitest run
```

Expected: exit 0 with "no test files found" or similar.

- [ ] **Step 5: Commit**

```bash
git add sample-tests/tsconfig.json sample-tests/vitest.config.ts sample-tests/.gitignore
git commit -m "chore(sample-tests): add vitest config, update tsconfig for globals"
```

---

## Chunk 2: Import Parser

### Task 3: Write the import parsing and merging module

This module is responsible for parsing TypeScript import statements, categorizing them (named, default, type-only, side-effect), and merging them into a deduplicated superset.

**Files:**
- Create: `sample-tests/src/import-parser.ts`
- Create: `sample-tests/src/__tests__/import-parser.test.ts`

- [ ] **Step 1: Create `sample-tests/src/__tests__/import-parser.test.ts`**

```typescript
import { describe, test, expect } from 'vitest'
import { parseImportLine, mergeImports, renderImports } from '../import-parser'

describe('parseImportLine', () => {
  test('parses named imports', () => {
    const result = parseImportLine('import { CardinalSdk, HealthcareParty } from "@icure/cardinal-sdk"')
    expect(result).toEqual({
      kind: 'named',
      names: ['CardinalSdk', 'HealthcareParty'],
      source: '@icure/cardinal-sdk',
      isTypeOnly: false,
    })
  })

  test('parses type-only imports', () => {
    const result = parseImportLine('import type { FilterOptions } from "@icure/cardinal-sdk"')
    expect(result).toEqual({
      kind: 'named',
      names: ['FilterOptions'],
      source: '@icure/cardinal-sdk',
      isTypeOnly: true,
    })
  })

  test('parses default imports', () => {
    const result = parseImportLine('import Foo from "bar"')
    expect(result).toEqual({
      kind: 'default',
      name: 'Foo',
      source: 'bar',
      isTypeOnly: false,
    })
  })

  test('parses aliased named imports', () => {
    const result = parseImportLine('import { v4 as uuid } from "uuid"')
    expect(result).toEqual({
      kind: 'named',
      names: ['v4 as uuid'],
      source: 'uuid',
      isTypeOnly: false,
    })
  })

  test('parses side-effect imports', () => {
    const result = parseImportLine('import "reflect-metadata"')
    expect(result).toEqual({
      kind: 'side-effect',
      source: 'reflect-metadata',
      isTypeOnly: false,
    })
  })

  test('returns null for non-import lines', () => {
    expect(parseImportLine('const x = 1')).toBeNull()
    expect(parseImportLine('// import { Foo } from "bar"')).toBeNull()
  })
})

describe('mergeImports', () => {
  test('merges named imports from the same module', () => {
    const lines = [
      'import { CardinalSdk, HealthcareParty } from "@icure/cardinal-sdk"',
      'import { DecryptedPatient, randomUuid } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    expect(rendered).toContain('CardinalSdk')
    expect(rendered).toContain('DecryptedPatient')
    expect(rendered).toContain('HealthcareParty')
    expect(rendered).toContain('randomUuid')
    // Should be a single import line for @icure/cardinal-sdk
    const cardinalLines = rendered.split('\n').filter(l => l.includes('@icure/cardinal-sdk') && !l.includes('import type'))
    expect(cardinalLines).toHaveLength(1)
  })

  test('keeps type-only imports separate from value imports', () => {
    const lines = [
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      'import type { FilterOptions } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const importLines = rendered.split('\n').filter(l => l.includes('@icure/cardinal-sdk'))
    expect(importLines).toHaveLength(2)
    expect(importLines.some(l => l.startsWith('import type'))).toBe(true)
    expect(importLines.some(l => l.startsWith('import {'))).toBe(true)
  })

  test('deduplicates identical named imports', () => {
    const lines = [
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const occurrences = rendered.split('CardinalSdk').length - 1
    expect(occurrences).toBe(1)
  })

  test('deduplicates side-effect imports', () => {
    const lines = [
      'import "reflect-metadata"',
      'import "reflect-metadata"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const occurrences = rendered.split('reflect-metadata').length - 1
    expect(occurrences).toBe(1)
  })

  test('keeps default imports from different modules separate', () => {
    const lines = [
      'import Foo from "foo"',
      'import Bar from "bar"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    expect(rendered).toContain('import Foo from "foo"')
    expect(rendered).toContain('import Bar from "bar"')
  })

  test('warns on name collision across different modules', () => {
    const warnings: string[] = []
    const lines = [
      'import { Filter } from "module-a"',
      'import { Filter } from "module-b"',
    ]
    const merged = mergeImports(lines, (msg) => warnings.push(msg))
    expect(warnings.length).toBeGreaterThan(0)
    expect(warnings[0]).toContain('Filter')
  })

  test('sorts import names alphabetically within a module', () => {
    const lines = [
      'import { Zebra, Alpha, Middle } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const match = rendered.match(/\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const names = match![1].split(',').map(n => n.trim())
    expect(names).toEqual(['Alpha', 'Middle', 'Zebra'])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd sample-tests && npx vitest run src/__tests__/import-parser.test.ts
```

Expected: FAIL — module `../import-parser` not found.

- [ ] **Step 3: Create `sample-tests/src/import-parser.ts`**

```typescript
export interface NamedImport {
  kind: 'named'
  names: string[]
  source: string
  isTypeOnly: boolean
}

export interface DefaultImport {
  kind: 'default'
  name: string
  source: string
  isTypeOnly: boolean
}

export interface SideEffectImport {
  kind: 'side-effect'
  source: string
  isTypeOnly: false
}

export type ParsedImport = NamedImport | DefaultImport | SideEffectImport

export interface MergedImports {
  named: Map<string, { names: Set<string>; isTypeOnly: boolean }>
  defaults: Map<string, { name: string; isTypeOnly: boolean }>
  sideEffects: Set<string>
}

export function parseImportLine(line: string): ParsedImport | null {
  const trimmed = line.trim()

  // Skip comments and non-import lines
  if (!trimmed.startsWith('import ') && !trimmed.startsWith('import\t')) return null
  if (trimmed.startsWith('import(')) return null // dynamic import

  // Side-effect: import "module" or import 'module'
  const sideEffectMatch = trimmed.match(/^import\s+['"]([^'"]+)['"]\s*;?\s*$/)
  if (sideEffectMatch) {
    return { kind: 'side-effect', source: sideEffectMatch[1], isTypeOnly: false }
  }

  const isTypeOnly = trimmed.startsWith('import type ')

  // Named imports: import { A, B } from "module" or import type { A } from "module"
  const namedMatch = trimmed.match(
    /^import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]\s*;?\s*$/
  )
  if (namedMatch) {
    const names = namedMatch[1]
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0)
    return { kind: 'named', names, source: namedMatch[2], isTypeOnly }
  }

  // Default import: import Foo from "module"
  const defaultMatch = trimmed.match(
    /^import\s+(?:type\s+)?(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?\s*$/
  )
  if (defaultMatch) {
    return { kind: 'default', name: defaultMatch[1], source: defaultMatch[2], isTypeOnly }
  }

  return null
}

export function mergeImports(
  importLines: string[],
  onWarning?: (message: string) => void,
): MergedImports {
  const result: MergedImports = {
    named: new Map(),
    defaults: new Map(),
    sideEffects: new Set(),
  }

  // Track which module each named import came from, for collision detection
  const nameToSource = new Map<string, string>()

  for (const line of importLines) {
    const parsed = parseImportLine(line)
    if (!parsed) continue

    switch (parsed.kind) {
      case 'side-effect':
        result.sideEffects.add(parsed.source)
        break

      case 'default':
        if (!result.defaults.has(parsed.source)) {
          result.defaults.set(parsed.source, { name: parsed.name, isTypeOnly: parsed.isTypeOnly })
        }
        break

      case 'named': {
        const key = `${parsed.source}::${parsed.isTypeOnly ? 'type' : 'value'}`
        if (!result.named.has(key)) {
          result.named.set(key, { names: new Set(), isTypeOnly: parsed.isTypeOnly })
        }
        const entry = result.named.get(key)!
        for (const name of parsed.names) {
          const baseName = name.includes(' as ') ? name.split(' as ')[1].trim() : name
          const existingSource = nameToSource.get(baseName)
          if (existingSource && existingSource !== parsed.source) {
            const warn = onWarning ?? ((msg: string) => console.warn(msg))
            warn(`Import name collision: "${baseName}" imported from both "${existingSource}" and "${parsed.source}"`)
          }
          nameToSource.set(baseName, parsed.source)
          entry.names.add(name)
        }
        break
      }
    }
  }

  return result
}

export function renderImports(merged: MergedImports): string {
  const lines: string[] = []

  // Side-effect imports
  for (const source of [...merged.sideEffects].sort()) {
    lines.push(`import "${source}"`)
  }

  // Default imports
  for (const [source, { name, isTypeOnly }] of [...merged.defaults.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const typePrefix = isTypeOnly ? 'type ' : ''
    lines.push(`import ${typePrefix}${name} from "${source}"`)
  }

  // Named imports
  for (const [key, { names, isTypeOnly }] of [...merged.named.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const source = key.split('::')[0]
    const typePrefix = isTypeOnly ? 'type ' : ''
    const sortedNames = [...names].sort((a, b) => {
      const aBase = a.includes(' as ') ? a.split(' as ')[0] : a
      const bBase = b.includes(' as ') ? b.split(' as ')[0] : b
      return aBase.localeCompare(bBase)
    })
    lines.push(`import ${typePrefix}{ ${sortedNames.join(', ')} } from "${source}"`)
  }

  return lines.join('\n')
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd sample-tests && npx vitest run src/__tests__/import-parser.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add sample-tests/src/import-parser.ts sample-tests/src/__tests__/import-parser.test.ts
git commit -m "feat(sample-tests): add import parser with merging and deduplication"
```

---

## Chunk 3: MDX Extractor

### Task 4: Write the MDX block extraction module

This module extracts TypeScript fenced code blocks from MDX content, recording line numbers and respecting `no-test` annotations.

**Files:**
- Create: `sample-tests/src/mdx-extractor.ts`
- Create: `sample-tests/src/__tests__/mdx-extractor.test.ts`

- [ ] **Step 1: Create `sample-tests/src/__tests__/mdx-extractor.test.ts`**

```typescript
import { describe, test, expect } from 'vitest'
import { extractTypeScriptBlocks, isImportLine, stripImportsFromBlock } from '../mdx-extractor'

describe('extractTypeScriptBlocks', () => {
  test('extracts a single typescript block with line number', () => {
    const mdx = [
      '# Title',
      '',
      '```typescript',
      'const x = 1',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toBe('const x = 1')
    expect(blocks[0].startLine).toBe(3)
  })

  test('extracts multiple blocks preserving order', () => {
    const mdx = [
      '```typescript',
      'const a = 1',
      '```',
      '',
      'Some text',
      '',
      '```typescript',
      'const b = 2',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(2)
    expect(blocks[0].code).toBe('const a = 1')
    expect(blocks[1].code).toBe('const b = 2')
  })

  test('skips blocks with no-test annotation', () => {
    const mdx = [
      '```typescript no-test',
      'const x = 1',
      '```',
      '',
      '```typescript',
      'const y = 2',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toBe('const y = 2')
  })

  test('ignores non-typescript fenced blocks', () => {
    const mdx = [
      '```kotlin',
      'val x = 1',
      '```',
      '',
      '```python',
      'x = 1',
      '```',
      '',
      '```typescript',
      'const x = 1',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toBe('const x = 1')
  })

  test('handles multi-line code blocks', () => {
    const mdx = [
      '```typescript',
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      '',
      'async function foo(sdk: CardinalSdk) {',
      '  return await sdk.patient.getPatient("123")',
      '}',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toContain('async function foo')
    expect(blocks[0].code).toContain('getPatient')
  })

  test('returns empty array for mdx with no typescript blocks', () => {
    const mdx = '# Title\n\nSome text\n\n```kotlin\nval x = 1\n```'
    expect(extractTypeScriptBlocks(mdx)).toHaveLength(0)
  })
})

describe('isImportLine', () => {
  test('detects standard import', () => {
    expect(isImportLine('import { Foo } from "bar"')).toBe(true)
  })

  test('detects type import', () => {
    expect(isImportLine('import type { Foo } from "bar"')).toBe(true)
  })

  test('rejects non-import lines', () => {
    expect(isImportLine('const x = 1')).toBe(false)
    expect(isImportLine('// import { Foo } from "bar"')).toBe(false)
  })
})

describe('stripImportsFromBlock', () => {
  test('removes import lines from block code', () => {
    const code = [
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      '',
      'const x = await sdk.patient.getPatient("123")',
    ].join('\n')

    const stripped = stripImportsFromBlock(code)
    expect(stripped).not.toContain('import')
    expect(stripped).toContain('const x = await sdk.patient.getPatient')
  })

  test('preserves non-import lines exactly', () => {
    const code = [
      'const x = 1',
      'const y = 2',
    ].join('\n')

    expect(stripImportsFromBlock(code)).toBe(code)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd sample-tests && npx vitest run src/__tests__/mdx-extractor.test.ts
```

Expected: FAIL — module `../mdx-extractor` not found.

- [ ] **Step 3: Create `sample-tests/src/mdx-extractor.ts`**

```typescript
export interface ExtractedBlock {
  code: string
  startLine: number
}

/**
 * Extract all ```typescript fenced code blocks from MDX content.
 * Skips blocks with `no-test` in the fence info string.
 * Returns blocks with their source line number (1-based).
 */
export function extractTypeScriptBlocks(mdxContent: string): ExtractedBlock[] {
  const lines = mdxContent.split('\n')
  const blocks: ExtractedBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Check for opening typescript fence
    if (trimmed.startsWith('```typescript')) {
      const fenceInfo = trimmed.slice(3) // e.g. "typescript no-test"

      if (fenceInfo.includes('no-test')) {
        // Skip this block entirely
        i++
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          i++
        }
        i++ // skip closing fence
        continue
      }

      const startLine = i + 1 // 1-based line number of the opening fence
      const codeLines: string[] = []
      i++

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing fence

      blocks.push({
        code: codeLines.join('\n'),
        startLine,
      })
    } else {
      i++
    }
  }

  return blocks
}

/**
 * Returns true if the line is an import statement.
 */
export function isImportLine(line: string): boolean {
  const trimmed = line.trim()
  if (trimmed.startsWith('//')) return false
  return (trimmed.startsWith('import ') || trimmed.startsWith('import\t')) && !trimmed.startsWith('import(')
}

/**
 * Remove import lines from a code block, returning only the body.
 * Strips leading/trailing blank lines from the result.
 */
export function stripImportsFromBlock(code: string): string {
  const lines = code.split('\n')
  const bodyLines: string[] = []

  for (const line of lines) {
    if (!isImportLine(line)) {
      bodyLines.push(line)
    }
  }

  // Trim leading/trailing blank lines
  while (bodyLines.length > 0 && bodyLines[0].trim() === '') bodyLines.shift()
  while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1].trim() === '') bodyLines.pop()

  return bodyLines.join('\n')
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd sample-tests && npx vitest run src/__tests__/mdx-extractor.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add sample-tests/src/mdx-extractor.ts sample-tests/src/__tests__/mdx-extractor.test.ts
git commit -m "feat(sample-tests): add MDX TypeScript block extractor"
```

---

## Chunk 4: Test File Generator

### Task 5: Write the test file generator module

This module takes extracted blocks and a merged import superset and generates the `.test.ts` file content.

**Files:**
- Create: `sample-tests/src/test-generator.ts`
- Create: `sample-tests/src/__tests__/test-generator.test.ts`

- [ ] **Step 1: Create `sample-tests/src/__tests__/test-generator.test.ts`**

```typescript
import { describe, test, expect } from 'vitest'
import { generateTestFileContent } from '../test-generator'
import type { ExtractedBlock } from '../mdx-extractor'

describe('generateTestFileContent', () => {
  const importSuperset = 'import { CardinalSdk, DecryptedPatient } from "@icure/cardinal-sdk"'

  test('generates a valid test file with one block', () => {
    const blocks: ExtractedBlock[] = [
      { code: 'const p = await sdk.patient.getPatient("123")', startLine: 42 },
    ]

    const result = generateTestFileContent({
      sourcePath: 'sdk/how-to/basic-operations.mdx',
      blocks,
      importSuperset,
    })

    expect(result).toContain('// Auto-generated from sdk/how-to/basic-operations.mdx')
    expect(result).toContain('import { CardinalSdk, DecryptedPatient } from "@icure/cardinal-sdk"')
    expect(result).toContain('import { getTestSdk } from')
    expect(result).toContain('let sdk: CardinalSdk')
    expect(result).toContain('beforeAll(async () =>')
    expect(result).toContain('test("basic-operations block 1 (line 42)"')
    expect(result).toContain('const p = await sdk.patient.getPatient("123")')
  })

  test('generates multiple tests for multiple blocks', () => {
    const blocks: ExtractedBlock[] = [
      { code: 'const a = 1', startLine: 10 },
      { code: 'const b = 2', startLine: 20 },
      { code: 'const c = 3', startLine: 30 },
    ]

    const result = generateTestFileContent({
      sourcePath: 'sdk/how-to/querying-data.mdx',
      blocks,
      importSuperset,
    })

    expect(result).toContain('test("querying-data block 1 (line 10)"')
    expect(result).toContain('test("querying-data block 2 (line 20)"')
    expect(result).toContain('test("querying-data block 3 (line 30)"')
  })

  test('strips imports from block bodies', () => {
    const blocks: ExtractedBlock[] = [
      {
        code: 'import { CardinalSdk } from "@icure/cardinal-sdk"\n\nconst x = 1',
        startLine: 5,
      },
    ]

    const result = generateTestFileContent({
      sourcePath: 'sdk/test.mdx',
      blocks,
      importSuperset,
    })

    // Import should appear in the superset, not inside the test body
    const testBodyMatch = result.match(/test\("test block 1.*?", async \(\) => \{([\s\S]*?)\n\}\)/)
    expect(testBodyMatch).not.toBeNull()
    expect(testBodyMatch![1]).not.toContain('import')
    expect(testBodyMatch![1]).toContain('const x = 1')
  })

  test('computes relative path to helpers based on nesting depth', () => {
    const blocks: ExtractedBlock[] = [
      { code: 'const x = 1', startLine: 5 },
    ]

    // Deeply nested: generated/tutorial/basic/modules/foo.test.ts → ../../../../helpers/sdk-fixture
    const result = generateTestFileContent({
      sourcePath: 'sdk/tutorial/basic/modules/foo.mdx',
      blocks,
      importSuperset,
    })

    expect(result).toContain('from "../../../../helpers/sdk-fixture"')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd sample-tests && npx vitest run src/__tests__/test-generator.test.ts
```

Expected: FAIL — module `../test-generator` not found.

- [ ] **Step 3: Create `sample-tests/src/test-generator.ts`**

```typescript
import { basename, dirname } from 'path'
import type { ExtractedBlock } from './mdx-extractor'
import { stripImportsFromBlock } from './mdx-extractor'

export interface GenerateTestFileOptions {
  sourcePath: string         // e.g. "sdk/how-to/basic-operations.mdx"
  blocks: ExtractedBlock[]
  importSuperset: string     // rendered import lines
}

/**
 * Compute the relative path from a generated test file to the helpers directory.
 * e.g. for "sdk/how-to/basic-operations.mdx" → generated/how-to/basic-operations.test.ts
 *      the helper is at helpers/sdk-fixture.ts
 *      relative: "../../helpers/sdk-fixture"
 */
function computeHelperRelativePath(sourcePath: string): string {
  // sourcePath is like "sdk/how-to/basic-operations.mdx"
  // generated file will be at "generated/how-to/basic-operations.test.ts"
  // helpers is at "helpers/sdk-fixture"
  // from generated/how-to/ we need ../../helpers/sdk-fixture

  const withoutSdk = sourcePath.replace(/^sdk\//, '')
  const dir = dirname(withoutSdk) // e.g. "how-to" or "tutorial/basic/modules"
  const depth = dir === '.' ? 0 : dir.split('/').length
  const ups = '../'.repeat(depth + 1) // +1 for the generated/ directory itself
  return `${ups}helpers/sdk-fixture`
}

export function generateTestFileContent(options: GenerateTestFileOptions): string {
  const { sourcePath, blocks, importSuperset } = options
  const fileBaseName = basename(sourcePath, '.mdx')
  const helperPath = computeHelperRelativePath(sourcePath)

  const lines: string[] = []

  // Header
  lines.push(`// Auto-generated from ${sourcePath} — do not edit`)
  lines.push(importSuperset)
  lines.push(`import { getTestSdk } from "${helperPath}"`)
  lines.push('')
  lines.push('let sdk: CardinalSdk')
  lines.push('')
  lines.push('beforeAll(async () => {')
  lines.push('  sdk = await getTestSdk()')
  lines.push('})')
  lines.push('')

  // One test per block
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const testName = `${fileBaseName} block ${i + 1} (line ${block.startLine})`
    const body = stripImportsFromBlock(block.code)
    const indentedBody = body
      .split('\n')
      .map(line => (line.trim() === '' ? '' : `  ${line}`))
      .join('\n')

    lines.push(`test("${testName}", async () => {`)
    lines.push(indentedBody)
    lines.push('})')
    lines.push('')
  }

  return lines.join('\n')
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd sample-tests && npx vitest run src/__tests__/test-generator.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add sample-tests/src/test-generator.ts sample-tests/src/__tests__/test-generator.test.ts
git commit -m "feat(sample-tests): add test file content generator"
```

---

## Chunk 5: Main Generator Script & SDK Fixture

### Task 6: Write the main generator entry point

This is the top-level `generate-tests.ts` script that ties everything together: scans MDX files, builds the import superset, and writes generated test files.

**Files:**
- Create: `sample-tests/generate-tests.ts`

- [ ] **Step 1: Create `sample-tests/generate-tests.ts`**

```typescript
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'fs'
import { resolve, relative, dirname, join, basename } from 'path'
import { fileURLToPath } from 'url'
import { extractTypeScriptBlocks, isImportLine } from './src/mdx-extractor'
import { mergeImports, renderImports } from './src/import-parser'
import { generateTestFileContent } from './src/test-generator'

const __dirname_val = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname_val, '..')
const SDK_DIR = join(REPO_ROOT, 'sdk')
const GENERATED_DIR = join(__dirname_val, 'generated')

const INTERACTIVE_PATTERNS = ['readLn(', 'readLn (', 'prompt(', 'prompt (']

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
  sourcePath: string // relative, e.g. "sdk/how-to/basic-operations.mdx"
  blocks: { code: string; startLine: number }[]
}

const fileDataList: FileData[] = []

for (const mdxPath of mdxFiles) {
  const content = readFileSync(mdxPath, 'utf8')
  const blocks = extractTypeScriptBlocks(content)

  if (blocks.length === 0) continue

  const sourcePath = relative(REPO_ROOT, mdxPath)

  // Collect imports from all blocks
  for (const block of blocks) {
    for (const line of block.code.split('\n')) {
      if (isImportLine(line)) {
        allImportLines.push(line.trim())
      }
    }

    // Warn about interactive patterns
    for (const pattern of INTERACTIVE_PATTERNS) {
      if (block.code.includes(pattern)) {
        console.warn(`⚠  ${sourcePath} (line ${block.startLine}): block contains "${pattern.trim()}" — will fail at test time`)
        break
      }
    }
  }

  fileDataList.push({ mdxPath, sourcePath, blocks })
}

// Merge all imports into a superset
const merged = mergeImports(allImportLines)
const importSuperset = renderImports(merged)

// --- Pass 2: Generate test files ---

// Clean generated directory, preserving .gitkeep
if (existsSync(GENERATED_DIR)) {
  rmSync(GENERATED_DIR, { recursive: true, force: true })
}
mkdirSync(GENERATED_DIR, { recursive: true })
writeFileSync(join(GENERATED_DIR, '.gitkeep'), '', 'utf8')

let generated = 0

for (const fileData of fileDataList) {
  const content = generateTestFileContent({
    sourcePath: fileData.sourcePath,
    blocks: fileData.blocks,
    importSuperset,
  })

  // Output path: generated/<path-relative-to-sdk>.test.ts
  const relToSdk = relative(SDK_DIR, fileData.mdxPath)
  const testFileName = relToSdk.replace(/\.mdx$/, '.test.ts')
  const outPath = join(GENERATED_DIR, testFileName)

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, content, 'utf8')

  console.log(`✓  ${fileData.sourcePath}  →  sample-tests/generated/${testFileName}  (${fileData.blocks.length} block${fileData.blocks.length !== 1 ? 's' : ''})`)
  generated++
}

console.log(`\nGenerated ${generated} test file(s) from ${mdxFiles.length} MDX file(s).`)
```

- [ ] **Step 2: Run the generator**

```bash
cd sample-tests && npx tsx generate-tests.ts
```

Expected: output listing each MDX file → generated test file, with block counts. Warnings for blocks containing `readLn`.

- [ ] **Step 3: Spot-check a generated test file**

```bash
head -30 sample-tests/generated/how-to/basic-operations.test.ts
```

Expected: header comment, import superset, `getTestSdk` import, `beforeAll`, first `test()` block.

- [ ] **Step 4: Commit**

```bash
git add sample-tests/generate-tests.ts
git commit -m "feat(sample-tests): add main generator script"
```

---

### Task 7: Create the SDK fixture helper

**Files:**
- Create: `sample-tests/helpers/sdk-fixture.ts`

- [ ] **Step 1: Create `sample-tests/helpers/sdk-fixture.ts`**

```typescript
import { CardinalSdk } from "@icure/cardinal-sdk"

let cachedSdk: CardinalSdk | undefined

/**
 * Returns an initialized CardinalSdk instance, cached for reuse across tests.
 * Reads credentials from environment variables.
 *
 * Required env vars:
 *   CARDINAL_URL       — e.g. "https://api.icure.cloud"
 *   CARDINAL_USERNAME  — login username
 *   CARDINAL_PASSWORD  — login password
 */
export async function getTestSdk(): Promise<CardinalSdk> {
  if (cachedSdk) return cachedSdk

  const url = process.env.CARDINAL_URL
  const username = process.env.CARDINAL_USERNAME
  const password = process.env.CARDINAL_PASSWORD

  if (!url || !username || !password) {
    throw new Error(
      'Missing required environment variables: CARDINAL_URL, CARDINAL_USERNAME, CARDINAL_PASSWORD'
    )
  }

  // TODO: Replace with actual CardinalSdk.initialize() call.
  // The exact initialization API depends on the SDK version.
  // Example:
  //   cachedSdk = await CardinalSdk.initialize(url, username, password)
  //   return cachedSdk
  throw new Error('SDK initialization not yet implemented — update helpers/sdk-fixture.ts')
}
```

This file intentionally throws until the user fills in the real initialization logic, since it depends on their specific backend setup.

- [ ] **Step 2: Commit**

```bash
git add sample-tests/helpers/sdk-fixture.ts
git commit -m "feat(sample-tests): add SDK fixture helper (needs initialization logic)"
```

---

### Task 8: Verify the full pipeline

- [ ] **Step 1: Run the generator and confirm output**

```bash
cd sample-tests && yarn generate
```

Expected: all MDX files processed, test files written to `generated/`.

- [ ] **Step 2: Run vitest in dry-run mode (tests will fail since SDK fixture throws)**

```bash
cd sample-tests && npx vitest run --reporter=verbose 2>&1 | head -40
```

Expected: test files are discovered and attempted. Tests fail with "SDK initialization not yet implemented" error from the fixture. This confirms the full pipeline works — generator produces valid test files that Vitest can discover and execute.

- [ ] **Step 3: Verify `yarn test` script works end-to-end**

```bash
cd sample-tests && yarn test 2>&1 | head -40
```

Expected: exits non-zero — all tests fail with "SDK initialization not yet implemented". This is expected and confirms the full pipeline works (generate → discover → attempt to run).

- [ ] **Step 4: Commit any remaining changes**

```bash
git add -A sample-tests/
git commit -m "chore(sample-tests): verify full generate + test pipeline"
```

---

## File Map Summary

| File | Purpose |
|---|---|
| `sample-tests/package.json` | Dependencies and scripts (`generate`, `test`, `test:watch`) |
| `sample-tests/tsconfig.json` | TypeScript config with `vitest/globals` types |
| `sample-tests/vitest.config.ts` | Vitest config: includes `generated/**/*.test.ts` + `src/__tests__/**/*.test.ts`, 30s timeout, globals |
| `sample-tests/.gitignore` | Ignores `generated/` (except `.gitkeep`), `node_modules/` |
| `sample-tests/generate-tests.ts` | Main entry point: scans MDX, builds import superset, writes test files |
| `sample-tests/src/import-parser.ts` | Parses and merges import statements into a deduplicated superset |
| `sample-tests/src/mdx-extractor.ts` | Extracts TypeScript fenced blocks from MDX with line numbers |
| `sample-tests/src/test-generator.ts` | Generates `.test.ts` file content from extracted blocks |
| `sample-tests/src/__tests__/import-parser.test.ts` | Unit tests for import parser |
| `sample-tests/src/__tests__/mdx-extractor.test.ts` | Unit tests for MDX extractor |
| `sample-tests/src/__tests__/test-generator.test.ts` | Unit tests for test generator |
| `sample-tests/helpers/sdk-fixture.ts` | Hand-maintained SDK initialization helper |
| `sample-tests/generated/**/*.test.ts` | Auto-generated test files (gitignored) |
