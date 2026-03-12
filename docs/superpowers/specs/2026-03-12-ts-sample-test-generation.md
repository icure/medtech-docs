# TypeScript Sample Test Generation — Design Spec

**Date:** 2026-03-12
**Replaces:** `docs/superpowers/plans/2026-03-11-ts-sample-validation.md` (tsc-only approach)

## Problem

The documentation in `sdk/**/*.mdx` contains TypeScript code samples. These samples can drift out of sync with the actual SDK API. The previous approach (extract + `tsc --noEmit`) only caught type errors. We need a system that:

1. Validates samples compile correctly
2. Validates samples actually **run** against a real backend
3. Is easy to maintain — regenerated automatically from MDX source
4. Uses a standard test runner for clear reporting

## Solution

A TypeScript generator script that reads all MDX files, extracts TypeScript code blocks, and produces Vitest test files. Each code block becomes one `test()` case. Tests run against a real Cardinal backend.

## Architecture

### Generator Script (`sample-tests/generate-tests.ts`)

A TypeScript script executed via `tsx` that:

1. Recursively scans `sdk/**/*.mdx` for all MDX files
2. Extracts every `` ```typescript `` fenced code block using line-by-line plain-text fence detection (not an MDX/AST parser). This is sufficient because TypeScript fences in these files are always direct children of `<TabItem value="typescript">` — there are no nested or commented-out fences to worry about. Blocks with `no-test` in the fence info string are skipped. Each extracted block records its source line number
3. Collects all import statements across all blocks in all files, deduplicates them by merging named imports per source module into a single superset
4. For each MDX file containing at least one TypeScript block, generates a `.test.ts` file into `generated/`, mirroring the directory structure

**Directory mapping:** `sdk/how-to/basic-operations.mdx` becomes `generated/how-to/basic-operations.test.ts`

### Generated Test File Structure

```typescript
// Auto-generated from sdk/how-to/basic-operations.mdx — do not edit
import { CardinalSdk, HealthcareParty, DecryptedPatient, randomUuid } from "@icure/cardinal-sdk"
import { v4 as uuid } from "uuid"
import { getTestSdk } from "../helpers/sdk-fixture"

let sdk: CardinalSdk

beforeAll(async () => {
  sdk = await getTestSdk()
})

test("basic-operations block 1 (line 58)", async () => {
  // code from first typescript block, imports stripped
})

test("basic-operations block 2 (line 127)", async () => {
  // code from second typescript block, imports stripped
})
```

Key properties:
- **Same import superset** in every generated file — the union of all imports found across all MDX files, deduplicated and merged by module
- **Imports stripped from block bodies** — any line starting with `import ` containing ` from ` is removed from the test body since they're hoisted to the superset
- **Test name includes source line number** for easy tracing back to docs
- **All tests are `async`** since SDK operations are async
- **`sdk` variable available** in every test via `beforeAll`

### Import Superset Strategy

Two-pass approach:

**Pass 1 — Collection:** Scan all TypeScript blocks across all MDX files. For each import line, parse the module source and imported names. Group by module, merge named imports.

Example merge:
- `import { CardinalSdk, HealthcareParty } from "@icure/cardinal-sdk"` +
- `import { DecryptedPatient, randomUuid } from "@icure/cardinal-sdk"` =
- `import { CardinalSdk, DecryptedPatient, HealthcareParty, randomUuid } from "@icure/cardinal-sdk"`

**Pass 2 — Generation:** Each test file gets the same merged superset.

Edge cases handled:
- **Default imports** (`import Foo from "bar"`) — kept as-is, deduplicated by module
- **Side-effect imports** (`import "foo"`) — collected and deduplicated
- **Type-only imports** (`import type { Foo }`) — kept as separate `import type` statements (not merged into value imports) to preserve TypeScript semantics
- **Name collisions** — if two different modules export the same named import, the generator emits a warning and keeps both (the second import will shadow the first; the TypeScript compiler will catch any real issues)
- **Unused imports** — suppressed via `tsconfig.json` (`strict: false`, no `noUnusedLocals`). Every file gets the full superset even if it only uses a subset

### Shared Test Helper (`sample-tests/helpers/sdk-fixture.ts`)

Hand-maintained file providing an initialized SDK instance:

```typescript
import { CardinalSdk } from "@icure/cardinal-sdk"

let cachedSdk: CardinalSdk | undefined

export async function getTestSdk(): Promise<CardinalSdk> {
  if (cachedSdk) return cachedSdk
  cachedSdk = await CardinalSdk.initialize(
    // credentials from env vars
  )
  return cachedSdk
}
```

Not generated — maintained by hand since initialization logic may evolve.

### Vitest Configuration (`sample-tests/vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['generated/**/*.test.ts'],
    testTimeout: 30000,
  },
})
```

Generous timeout since tests hit a real backend.

## File Map

| File | Generated? | Purpose |
|---|---|---|
| `sample-tests/generate-tests.ts` | No | TypeScript generator script |
| `sample-tests/helpers/sdk-fixture.ts` | No | Shared SDK initialization helper |
| `sample-tests/vitest.config.ts` | No | Vitest configuration |
| `sample-tests/package.json` | No | Dependencies & scripts |
| `sample-tests/tsconfig.json` | No | TypeScript config |
| `sample-tests/.gitignore` | No | Ignores `generated/`, `node_modules/` |
| `sample-tests/generated/**/*.test.ts` | Yes | One test file per MDX, one test per block |

### Files to Delete (from previous approach)

- `sample-tests/extract.mjs`
- `sample-tests/validate.mjs`
- `sample-tests/tsconfig.check.json`
- `sample-tests/stubs/` (if exists)

## Package Scripts

```json
{
  "generate": "tsx generate-tests.ts",
  "test": "tsx generate-tests.ts && vitest run",
  "test:watch": "vitest"
}
```

## Dependencies

- **Runtime:** `@icure/cardinal-sdk`, `uuid`
- **Dev:** `vitest`, `tsx`, `typescript`, `@types/uuid`

## Skipping Blocks

Some code blocks should not be tested (pseudo-code, incomplete snippets, non-TypeScript-runnable examples). The generator supports an opt-out annotation:

````markdown
```typescript no-test
// this block will be skipped by the generator
```
````

The generator checks the fence info string for `no-test` and excludes matching blocks from test generation.

## Constraints

### On MDX Authors

Each TypeScript code block that does not have `no-test` must be:
- **Self-contained** — it must not depend on variables defined in other code blocks. All state it needs must be created within the block itself (or use the `sdk` variable provided by the test fixture).
- **Non-interactive** — no `readLn()`, `prompt()`, or other interactive I/O. Use hardcoded test values instead.
- **Executable** — it must be runnable statements, not just function/type definitions. If showing a function, include a call to it.

### On the Generator

- The generator must be idempotent — running it at any time overwrites `generated/` with current state
- When clearing `generated/`, the generator preserves `generated/.gitkeep` (or re-creates it) to ensure the directory exists after clone
- `generated/` is gitignored — regenerated before every test run
- The generator emits a warning for any extracted block that contains `readLn`, `prompt`, or other known interactive patterns, as these will fail at test time
- Tests require a real backend — credentials provided via environment variables (`CARDINAL_URL`, `CARDINAL_USERNAME`, `CARDINAL_PASSWORD` — exact names defined in `helpers/sdk-fixture.ts`)

## TypeScript Configuration

`sample-tests/tsconfig.json` must include `"types": ["vitest/globals"]` so that `test`, `beforeAll`, `describe` etc. are available without explicit imports in generated files.

## Phased Rollout

The current MDX code blocks are **not** self-contained — many are sequential steps with inter-block dependencies, function definitions without invocations, or use interactive `readLn()`. Refactoring all blocks at once is impractical.

**Phase 1 — Infrastructure:** Build the generator and test runner. Most existing blocks get `no-test` annotations. A handful of already-compliant blocks serve as proof the pipeline works end-to-end.

**Phase 2 — Progressive refactoring:** MDX files are refactored one at a time to make their TypeScript blocks self-contained and testable. Each refactored file removes its `no-test` annotations. Priority: how-to guides first (most API surface), then tutorials.

This means initial test coverage will be low and grows as docs are refactored. The generator always processes all files — `no-test` blocks just don't produce tests.

## Workflow

```bash
cd sample-tests
yarn generate    # regenerate test files from current MDX
yarn test        # generate + run all tests
```
