# sample-tests

Extracts TypeScript code blocks from the Cardinal SDK documentation (MDX files) and generates runnable vitest test files, with optional pre/post hooks for setup and verification.

## Quick start

```bash
yarn                    # install dependencies
yarn generate           # generate test files only
yarn test               # generate + run tests
yarn test:watch         # watch mode (no re-generation)
```

## How it works

### 1. Test generation (`generate-tests.ts`)

The generator scans every `.mdx` file under `../sdk/` and:

1. **Extracts** TypeScript code blocks (skipping those marked ` ```typescript no-test ```).
2. **Collects imports** from all blocks across all files and merges them into a single import superset so every generated test has access to every type.
3. **Detects helpers** — for each MDX file `sdk/<path>.mdx`, the generator checks whether a helper file exists at `helpers/<path>.ts`. If it does, the helper is dynamically imported at generation time to read its `preTestProvides` export.
4. **Emits test files** into `generated/`, one per MDX file, wrapping each code block in a `test(...)` call with pre/post hooks injected when a helper is present.

The generated files are gitignored and rebuilt on every run.

### 2. Generated test structure

Each generated test file follows this shape:

```typescript
// Auto-generated from sdk/how-to/basic-operations.mdx — do not edit
import { /* merged import superset */ } from "@icure/cardinal-sdk"
import { getTestSdk } from "../../helpers/sdk-fixture"
import { preTest, postTest } from "../../helpers/how-to/basic-operations"

let sdk: CardinalSdk

beforeAll(async () => {
  sdk = await getTestSdk()
})

test("basic-operations block 1 (line 57)", async () => {
  await preTest["basic-operations block 1 (line 57)"]?.(sdk)
  // ... code block from the MDX ...
  await postTest["basic-operations block 1 (line 57)"]?.(sdk, createDoctor)
})
```

**Test name convention:** `<fileBaseName> block <n> (line <startLine>)`

- `fileBaseName` is the MDX filename without extension.
- `n` is the 1-based block index within the file.
- `startLine` is the line number in the MDX where the code block begins.

### 3. Pre/post hook injection

When a helper exists, two things happen for each block:

#### Pre-test call

If `preTestProvides` lists variables for the block, the generator emits a destructuring call:

```typescript
const { visitingDoctorSdk, patient } = await preTest["block name"]?.(sdk) ?? {}
```

This injects variables that the code block references but does not declare (cross-block dependencies, placeholder values, undefined helper functions from the MDX).

If `preTestProvides` has no entry (or an empty array) for the block, a plain call is emitted:

```typescript
await preTest["block name"]?.(sdk)
```

#### Post-test call

The generator extracts all **function declarations** and **`const`/`let` variable declarations** from the code block and passes them as arguments to `postTest`:

```typescript
await postTest["block name"]?.(sdk, myFunction, myVariable)
```

Functions come first, then variables, in the order they appear in the code.

### 4. Detection rules

The generator uses simple regex-based extraction (not a full parser):

| Pattern               | Regex                                 | Example                        |
|-----------------------|---------------------------------------|--------------------------------|
| Function declarations | `^(?:async\s+)?function\s+(\w+)\s*\(` | `async function createDoctor(` |
| Variable declarations | `^(?:const\|let)\s+(\w+)\s*=`         | `const patient =`              |

This means:
- `export async function` is **not** captured (the `export` prefix prevents the match).
- Destructuring (`const { a, b } = ...`) is **not** captured.
- Class declarations and arrow-function variables are **not** captured as functions.

These are known limitations. The helper's `postTest` signature should account for what actually gets extracted.

## Writing a helper

Helpers live under `helpers/` and mirror the MDX path structure:

```
sdk/how-to/basic-operations.mdx     ->  helpers/how-to/basic-operations.ts
sdk/how-to/initialize-the-sdk/index.mdx  ->  helpers/how-to/initialize-the-sdk/index.ts
```

### Required exports

A helper must export three things:

```typescript
import { CardinalSdk } from '@icure/cardinal-sdk'

// 1. Declares which variables each pre-test provides to the code block.
//    Keys are test names. Values are arrays of variable names that will
//    be destructured from the pre-test return value.
//    Omit blocks that need no provided variables.
export const preTestProvides: Record<string, string[]> = {
  'basic-operations block 10 (line 747)': ['askUserToResolveNoteConflict'],
}

// 2. Pre-test functions. Called before the code block runs.
//    Must return an object whose keys match preTestProvides.
export const preTest: Record<string, (sdk: CardinalSdk) => Promise<Record<string, any>>> = {
  'basic-operations block 10 (line 747)': async () => ({
    askUserToResolveNoteConflict: (existing: string, incoming: string) => incoming,
  }),
  // Self-contained blocks still need an entry:
  'basic-operations block 1 (line 57)': async () => ({}),
}

// 3. Post-test functions. Called after the code block runs.
//    Receives sdk + all extracted functions and variables from the block.
export const postTest: Record<string, (...args: any[]) => void | Promise<void>> = {
  'basic-operations block 1 (line 57)': async (sdk, createDoctor) => {
    const hp = await createDoctor(sdk, 'Alice', 'Smith')
    expect(hp.firstName).toBe('Alice')
  },
}
```

### Common patterns

#### Self-contained blocks (no external dependencies)

Most blocks define functions or construct objects without referencing anything from other blocks. For these:

- `preTestProvides`: omit the entry or use `[]`
- `preTest`: return `({})`
- `postTest`: call the defined function and assert on the result, or just verify it exists

```typescript
'my-page block 1 (line 42)': async (sdk, myFunction) => {
  const result = await myFunction(sdk, 'arg1')
  expect(result).toBeDefined()
},
```

#### Cross-block dependencies

Some MDX pages tell a sequential story where block 2 references variables from block 1. Since each test runs in isolation, the pre-test must provide those variables.

Use module-level state to carry values between blocks:

```typescript
let patient: DecryptedPatient  // module-level state

export const preTestProvides: Record<string, string[]> = {
  'my-page block 2 (line 100)': ['patient'],
}

export const preTest = {
  'my-page block 1 (line 50)': async () => ({}),
  'my-page block 2 (line 100)': async (sdk) => {
    // Create patient if block 1 didn't run first
    if (!patient) patient = await createTestPatient(sdk)
    return { patient }
  },
}

export const postTest = {
  'my-page block 1 (line 50)': async (sdk, patientLocal) => {
    patient = patientLocal  // stash for block 2
  },
  // ...
}
```

#### Undefined references (placeholder functions)

MDX code often references functions like `askUserValidationCode()` with a comment like "implement this yourself". The pre-test provides a mock:

```typescript
export const preTestProvides: Record<string, string[]> = {
  'my-page block 1 (line 30)': ['askUserValidationCode'],
}

export const preTest = {
  'my-page block 1 (line 30)': async () => ({
    askUserValidationCode: async () => '123456',
  }),
}
```

#### Placeholder credentials

Some blocks use `<PLACEHOLDER>` syntax for credentials. Provide them from environment variables:

```typescript
'my-page block 1 (line 10)': async () => ({
  USERNAME: process.env.CARDINAL_USERNAME ?? 'default-user',
  PASSWORD: process.env.CARDINAL_PASSWORD ?? 'default-pass',
}),
```

#### Browser-only code

Blocks using `window`, `Blob`, `FileReader`, etc. cannot run in Node. For these, the post-test only verifies the function/class is defined:

```typescript
'my-page block 1 (line 42)': async (sdk, exportAndDownloadKeysFile) => {
  expect(typeof exportAndDownloadKeysFile).toBe('function')
},
```

## Directory structure

```
sample-tests/
  generate-tests.ts          # Main generator script
  vitest.config.ts            # Vitest configuration (globals: true)
  tsconfig.json               # TypeScript config (vitest/globals types)
  package.json                # Scripts: generate, test, test:watch
  src/
    mdx-extractor.ts          # Extracts TypeScript blocks from MDX
    import-parser.ts           # Merges imports into a superset
    test-generator.ts          # Generates test file content
  helpers/
    sdk-fixture.ts             # Provides getTestSdk() for all tests
    how-to/
      basic-operations.ts      # Pre/post hooks for basic-operations.mdx
      contact-group-id.ts      # Pre/post hooks for contact-group-id.mdx
      ...                      # One helper per MDX file that needs one
      initialize-the-sdk/
        index.ts
        captcha.ts
        ...
  generated/                   # Output directory (gitignored, rebuilt on each run)
    how-to/
      basic-operations.test.ts
      ...
```

## Environment variables

| Variable            | Description                   |
|---------------------|-------------------------------|
| `CARDINAL_URL`      | Base URL for the Cardinal API |
| `CARDINAL_USERNAME` | Login username                |
| `CARDINAL_PASSWORD` | Login password                |

These are read by `helpers/sdk-fixture.ts` to initialize the SDK.

## Adding a new helper

1. Identify the MDX file: `sdk/<path>.mdx`
2. Create `helpers/<path>.ts` with the three exports (`preTestProvides`, `preTest`, `postTest`)
3. Run `yarn generate` to regenerate — the generator auto-detects the helper
4. Verify with `yarn test`

No changes to the generator or any configuration are needed.
