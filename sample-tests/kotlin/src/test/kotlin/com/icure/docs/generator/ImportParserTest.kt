package com.icure.docs.generator

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.shouldBe

class ImportParserTest : FunSpec({

    test("deduplicates identical imports") {
        val imports = listOf(
            "import com.icure.cardinal.sdk.CardinalSdk",
            "import com.icure.cardinal.sdk.CardinalSdk",
            "import com.icure.cardinal.sdk.model.DecryptedPatient",
        )

        val merged = mergeKotlinImports(imports)
        merged shouldHaveSize 2
    }

    test("sorts imports alphabetically") {
        val imports = listOf(
            "import com.icure.cardinal.sdk.model.DecryptedPatient",
            "import com.icure.cardinal.sdk.CardinalSdk",
            "import com.icure.cardinal.sdk.auth.UsernamePassword",
        )

        val merged = mergeKotlinImports(imports)
        merged shouldContainExactly listOf(
            "import com.icure.cardinal.sdk.CardinalSdk",
            "import com.icure.cardinal.sdk.auth.UsernamePassword",
            "import com.icure.cardinal.sdk.model.DecryptedPatient",
        )
    }

    test("filters out non-import lines") {
        val imports = listOf(
            "import com.icure.cardinal.sdk.CardinalSdk",
            "val x = 1",
            "// import com.icure.something",
            "import com.icure.cardinal.sdk.model.DecryptedPatient",
        )

        val merged = mergeKotlinImports(imports)
        merged shouldHaveSize 2
    }

    test("renders imports as sorted lines") {
        val imports = listOf(
            "import com.icure.cardinal.sdk.model.DecryptedPatient",
            "import com.icure.cardinal.sdk.CardinalSdk",
        )

        val rendered = renderKotlinImports(mergeKotlinImports(imports))
        rendered shouldBe "import com.icure.cardinal.sdk.CardinalSdk\nimport com.icure.cardinal.sdk.model.DecryptedPatient"
    }
})
