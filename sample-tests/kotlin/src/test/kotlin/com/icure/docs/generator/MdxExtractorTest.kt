package com.icure.docs.generator

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain

class MdxExtractorTest : FunSpec({

    test("extracts a single Kotlin block") {
        val mdx = """
            Some text
            ```kotlin
            val x = 1
            ```
            More text
        """.trimIndent()

        val blocks = extractKotlinBlocks(mdx)
        blocks shouldHaveSize 1
        blocks[0].code shouldBe "val x = 1"
        blocks[0].startLine shouldBe 2
        blocks[0].testId shouldBe null
    }

    test("extracts multiple Kotlin blocks") {
        val mdx = """
            ```kotlin
            val a = 1
            ```
            text
            ```kotlin
            val b = 2
            ```
        """.trimIndent()

        val blocks = extractKotlinBlocks(mdx)
        blocks shouldHaveSize 2
    }

    test("skips no-test blocks") {
        val mdx = """
            ```kotlin no-test
            val skip = true
            ```
            ```kotlin
            val keep = true
            ```
        """.trimIndent()

        val blocks = extractKotlinBlocks(mdx)
        blocks shouldHaveSize 1
        blocks[0].code shouldContain "keep"
    }

    test("extracts test ID from fence info") {
        val mdx = """
            ```kotlin test-ABCD
            val x = 1
            ```
        """.trimIndent()

        val blocks = extractKotlinBlocks(mdx)
        blocks shouldHaveSize 1
        blocks[0].testId shouldBe "ABCD"
    }

    test("ignores non-Kotlin blocks") {
        val mdx = """
            ```typescript
            const x = 1
            ```
            ```python
            x = 1
            ```
            ```kotlin
            val x = 1
            ```
        """.trimIndent()

        val blocks = extractKotlinBlocks(mdx)
        blocks shouldHaveSize 1
    }

    test("returns empty for no Kotlin blocks") {
        val mdx = """
            ```typescript
            const x = 1
            ```
        """.trimIndent()

        val blocks = extractKotlinBlocks(mdx)
        blocks.shouldBeEmpty()
    }

    test("extracts multi-line block") {
        val mdx = """
            ```kotlin
            import com.icure.cardinal.sdk.CardinalSdk

            suspend fun foo(sdk: CardinalSdk): String {
                return "hello"
            }
            ```
        """.trimIndent()

        val blocks = extractKotlinBlocks(mdx)
        blocks shouldHaveSize 1
        blocks[0].code shouldContain "suspend fun foo"
        blocks[0].code shouldContain "import com.icure"
    }

    test("isKotlinImportLine detects imports") {
        isKotlinImportLine("import com.icure.cardinal.sdk.CardinalSdk") shouldBe true
        isKotlinImportLine("  import com.icure.cardinal.sdk.CardinalSdk") shouldBe true
        isKotlinImportLine("// import com.icure.cardinal.sdk.CardinalSdk") shouldBe false
        isKotlinImportLine("val x = 1") shouldBe false
    }

    test("stripImportsFromBlock removes imports and trims") {
        val code = """
            import com.icure.cardinal.sdk.CardinalSdk
            import com.icure.cardinal.sdk.model.DecryptedPatient

            suspend fun foo(sdk: CardinalSdk) {
                val p = DecryptedPatient()
            }
        """.trimIndent()

        val stripped = stripImportsFromBlock(code)
        stripped shouldBe """
            suspend fun foo(sdk: CardinalSdk) {
                val p = DecryptedPatient()
            }
        """.trimIndent()
    }

    test("stripImportsFromBlock strips private and const modifiers") {
        val code = """
            private const val MY_URL = "https://api.icure.cloud"
            private val secret = "abc"
            public fun doSomething() {}
        """.trimIndent()

        val stripped = stripImportsFromBlock(code)
        stripped shouldBe """
            val MY_URL = "https://api.icure.cloud"
            val secret = "abc"
            fun doSomething() {}
        """.trimIndent()
    }
})
