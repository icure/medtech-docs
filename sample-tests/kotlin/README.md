# sample-tests/kotlin

Extracts Kotlin code blocks from the Cardinal SDK documentation (MDX files) and generates runnable Kotest test files, with optional pre/post hooks for setup and verification.

## Quick start

```bash
./gradlew generateTests       # generate test files only
./gradlew test                 # run generator unit tests
./gradlew test -PincludeGenerated  # run all tests including generated ones
```

## How it works

### 1. Test generation (`./gradlew generateTests` or `./gradlew run`)

The generator scans every `.mdx` file under `../../sdk/` and:

1. **Extracts** Kotlin code blocks (skipping those marked ` ```kotlin no-test `).
2. **Collects imports** from all blocks across all files and merges them into a deduplicated, sorted import superset.
3. **Detects helpers** — for each MDX file `sdk/<path>.mdx`, the generator checks whether a helper metadata file exists at `helpers-meta/<path>.json` and a Kotlin helper class exists at `src/test/kotlin/com/icure/docs/helpers/<path>Helper.kt`.
4. **Emits test files** into `build/generated-test-sources/kotlin/`, one per MDX file, wrapping each code block in a Kotest `test(...)` call with pre/post hooks injected when a helper is present.

### 2. Generated test structure

Each generated test file follows this shape:

```kotlin
// Auto-generated from sdk/how-to/basic-operations.mdx -- do not edit
package com.icure.docs.generated.howto

import com.icure.cardinal.sdk.CardinalSdk
// ... merged import superset ...

import com.icure.docs.helpers.SdkFixture
import com.icure.docs.helpers.howto.BasicOperationsHelper
import io.kotest.core.spec.style.FunSpec

class BasicOperationsTest : FunSpec({

    lateinit var sdk: CardinalSdk

    beforeSpec {
        sdk = SdkFixture.getTestSdk()
    }

    test("basic-operations block 1 (AAAA)") {
        BasicOperationsHelper.preTest["basic-operations block 1 (AAAA)"]?.invoke(sdk)
        // ... code block from the MDX ...
        val __extracted = mutableMapOf<String, Any?>()
        __extracted["createDoctor"] = ::createDoctor
        BasicOperationsHelper.postTest["basic-operations block 1 (AAAA)"]?.invoke(sdk, __extracted)
    }
})
```

**Test name convention:** `<fileBaseName> block <n> (<testId>)`

- `fileBaseName` is the MDX filename without extension.
- `n` is the 1-based block index within the file.
- `testId` is a stable 4-letter code from the fence info ` ```kotlin test-XXXX `. If no marker is present, the generator falls back to `line <startLine>`.

### 3. Pre/post hook injection

When a helper exists, two things happen for each block:

#### Pre-test call

If `preTestProvides` (in the JSON metadata) lists variables for the block, the generator emits:

```kotlin
val __provided = BasicOperationsHelper.preTest["block name"]?.invoke(sdk) ?: emptyMap()
val myVariable = __provided["myVariable"]
```

This injects variables that the code block references but does not declare.

#### Post-test call

The generator extracts all **function declarations** and **val/var declarations** from the code block and passes them in a map to `postTest`:

```kotlin
val __extracted = mutableMapOf<String, Any?>()
__extracted["createDoctor"] = ::createDoctor
__extracted["patient"] = patient
BasicOperationsHelper.postTest["block name"]?.invoke(sdk, __extracted)
```

### 4. Detection rules

| Pattern               | Regex                                  | Example                        |
|-----------------------|----------------------------------------|--------------------------------|
| Function declarations | `^(?:suspend\s+)?fun\s+(\w+)\s*\(`    | `suspend fun createDoctor(`    |
| Variable declarations | `^(?:val\|var)\s+(\w+)\s*[=:]`         | `val patient =`                |

## Writing a helper

Helpers live under `src/test/kotlin/com/icure/docs/helpers/` and mirror the MDX path structure:

```
sdk/how-to/basic-operations.mdx  ->  helpers/howto/BasicOperationsHelper.kt
sdk/how-to/initialize-the-sdk/index.mdx  ->  helpers/howto/initializethesdk/IndexHelper.kt
```

### Kotlin helper structure

```kotlin
package com.icure.docs.helpers.howto

import com.icure.cardinal.sdk.CardinalSdk

object BasicOperationsHelper {
    val preTest: Map<String, suspend (sdk: CardinalSdk) -> Map<String, Any?>> = mapOf(
        "basic-operations block 1 (AAAA)" to { _ -> emptyMap() },
    )

    val postTest: Map<String, suspend (sdk: CardinalSdk, extracted: Map<String, Any?>) -> Unit> = mapOf(
        "basic-operations block 1 (AAAA)" to { sdk, extracted ->
            // Verify the function works
        },
    )
}
```

### JSON metadata

For each helper, create a corresponding JSON file at `helpers-meta/<path>.json`:

```json
{
  "preTestProvides": {
    "basic-operations block 10 (AAAJ)": ["askUserToResolveNoteConflict"]
  }
}
```

The generator reads this at generation time to know which variables to destructure from the pre-test return value.

## Directory structure

```
sample-tests/kotlin/
  build.gradle.kts               # Gradle build with generateTests task
  settings.gradle.kts
  helpers-meta/                   # JSON metadata for preTestProvides
    how-to/
      basic-operations.json
      ...
  src/
    main/kotlin/com/icure/docs/generator/
      MdxExtractor.kt            # Extracts Kotlin blocks from MDX
      ImportParser.kt             # Deduplicates Kotlin imports
      TestGenerator.kt            # Generates Kotest FunSpec files
      Main.kt                    # Entry point
    test/kotlin/com/icure/docs/
      generator/                  # Unit tests for generator
        MdxExtractorTest.kt
        ImportParserTest.kt
        TestGeneratorTest.kt
      helpers/                    # Test helpers
        SdkFixture.kt
        howto/
          BasicOperationsHelper.kt
          ...
  build/generated-test-sources/   # Output (generated, gitignored)
```

## Environment variables

| Variable            | Description                   |
|---------------------|-------------------------------|
| `CARDINAL_URL`      | Base URL for the Cardinal API |
| `CARDINAL_USERNAME` | Login username                |
| `CARDINAL_PASSWORD` | Login password                |

These are read by `SdkFixture.kt` to initialize the SDK.

## Adding a new helper

1. Identify the MDX file: `sdk/<path>.mdx`
2. Create `helpers-meta/<path>.json` with `preTestProvides`
3. Create `src/test/kotlin/com/icure/docs/helpers/<path>Helper.kt` with `preTest` and `postTest` maps
4. Run `./gradlew generateTests` to regenerate
5. Verify with `./gradlew test -PincludeGenerated`
