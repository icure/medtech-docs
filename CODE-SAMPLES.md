

# Code Sample Validation

The `sample-tests/` directory contains a pipeline that extracts TypeScript code blocks from the SDK documentation (`sdk/**/*.mdx`) and runs them as Vitest tests against a real Cardinal backend.

## Quick Start

```bash
cd sample-tests
yarn install
yarn generate              # extract code blocks into test files
yarn test                  # generate + run all tests
```

Running tests requires environment variables for SDK authentication:

```bash
export CARDINAL_URL="https://api.icure.cloud"
export CARDINAL_USERNAME="your-username"
export CARDINAL_PASSWORD="your-password"
```

> **Note:** You must first implement the SDK initialization logic in `sample-tests/helpers/sdk-fixture.ts`.

## How It Works

### 1. Generator (`yarn generate`)

The generator script (`generate-tests.ts`) performs two passes:

**Pass 1 — Collect imports:** Scans all `sdk/**/*.mdx` files, extracts every `` ```typescript `` fenced code block, and collects all import statements into a single deduplicated superset.

**Pass 2 — Generate test files:** For each MDX file containing TypeScript blocks, writes a `.test.ts` file into `generated/`, mirroring the directory structure. Each code block becomes one `test()` case.

Example: `sdk/how-to/basic-operations.mdx` produces `generated/how-to/basic-operations.test.ts`.

### 2. Generated Test Structure

Every generated file has the same shape:

```typescript
// Auto-generated from sdk/how-to/basic-operations.mdx — do not edit
import { CardinalSdk, HealthcareParty, DecryptedPatient, ... } from "@icure/cardinal-sdk"
import { getTestSdk } from "../helpers/sdk-fixture"

let sdk: CardinalSdk

beforeAll(async () => {
  sdk = await getTestSdk()
})

test("basic-operations block 1 (line 58)", async () => {
  // code from the first TypeScript block
})

test("basic-operations block 2 (line 127)", async () => {
  // code from the second TypeScript block
})
```

- Every file gets the **same import superset** (the union of all imports from all MDX files)
- Import lines are **stripped from block bodies** (they're already in the superset)
- Test names include the **source line number** for easy tracing

### 3. Test Runner (`yarn test`)

Vitest runs the generated tests with a 30-second timeout per test (real backend calls).

## Writing Testable Code Blocks

Each TypeScript code block in the MDX documentation that does **not** have `no-test` must be:

- **Self-contained** — must not depend on variables from other code blocks. Use the `sdk` variable (provided by the test fixture) for SDK access.
- **Non-interactive** — no `readLn()`, `prompt()`, or other interactive I/O. Use hardcoded test values.
- **Executable** — must be runnable statements, not just function/type definitions. If showing a function, include a call to it.

### Skipping Blocks

To exclude a block from test generation, add `no-test` to the fence info:

````markdown
```typescript no-test
// this block will not be tested
```
````

The generator warns about blocks containing interactive patterns (`readLn`, `prompt`) that will fail at test time.

## Project Structure

```
sample-tests/
  generate-tests.ts          # main generator script (run via tsx)
  vitest.config.ts            # Vitest configuration
  tsconfig.json               # TypeScript config (includes vitest/globals)
  package.json                # scripts: generate, test, test:watch
  helpers/
    sdk-fixture.ts            # shared SDK initialization (hand-maintained)
  src/
    import-parser.ts          # parse, merge, deduplicate import statements
    mdx-extractor.ts          # extract TypeScript blocks from MDX content
    test-generator.ts         # generate .test.ts file content
    __tests__/
      import-parser.test.ts   # unit tests for import parser
      mdx-extractor.test.ts   # unit tests for MDX extractor
      test-generator.test.ts  # unit tests for test generator
  generated/                  # gitignored, regenerated on each run
    **/*.test.ts              # one test file per MDX file
```

## Unit Tests

The generator's own modules have unit tests that run alongside the generated tests:

```bash
cd sample-tests
npx vitest run src/__tests__/   # run only unit tests
```
