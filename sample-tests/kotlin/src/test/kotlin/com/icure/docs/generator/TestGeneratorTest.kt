package com.icure.docs.generator

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain

class TestGeneratorTest : FunSpec({

    test("extractFunctionNames finds suspend and regular functions") {
        val code = """
            suspend fun createDoctor(sdk: CardinalSdk): HealthcareParty {
                return sdk.healthcareParty.createHealthcareParty(HealthcareParty())
            }

            fun helper(): String {
                return "hello"
            }
        """.trimIndent()

        extractFunctionNames(code) shouldContainExactly listOf("createDoctor", "helper")
    }

    test("extractVariableNames finds val and var declarations") {
        val code = """
            val patient = sdk.patient.createPatient(p)
            var counter = 0
            val document = sdk.document.createDocument(d)
        """.trimIndent()

        extractVariableNames(code) shouldContainExactly listOf("patient", "counter", "document")
    }

    test("sourcePathToPackage converts path correctly") {
        sourcePathToPackage("sdk/how-to/basic-operations.mdx") shouldBe "com.icure.docs.generated.howto"
        sourcePathToPackage("sdk/tutorial/basic/modules/1_create_patient.mdx") shouldBe "com.icure.docs.generated.tutorial.basic.modules"
    }

    test("sourcePathToClassName converts name correctly") {
        sourcePathToClassName("sdk/how-to/basic-operations.mdx") shouldBe "BasicOperationsTest"
        sourcePathToClassName("sdk/tutorial/basic/modules/1_create_patient.mdx") shouldBe "_1CreatePatientTest"
        sourcePathToClassName("sdk/how-to/initialize-the-sdk/index.mdx") shouldBe "IndexTest"
    }

    test("generates test file with single block") {
        val content = generateTestFileContent(
            GenerateTestFileOptions(
                sourcePath = "sdk/how-to/basic-operations.mdx",
                blocks = listOf(
                    ExtractedBlock(
                        code = "suspend fun createDoctor(sdk: CardinalSdk): HealthcareParty {\n    return sdk.healthcareParty.createHealthcareParty(HealthcareParty())\n}",
                        startLine = 42,
                        testId = "MANE",
                    )
                ),
                importSuperset = "import com.icure.cardinal.sdk.CardinalSdk\nimport com.icure.cardinal.sdk.model.HealthcareParty",
                helperClassName = null,
                helperImportPath = null,
                preTestProvides = emptyMap(),
            )
        )

        content shouldContain "package com.icure.docs.generated.howto"
        content shouldContain "class BasicOperationsTest : FunSpec({"
        content shouldContain "test(\"basic-operations block 1 (MANE)\")"
        content shouldContain "suspend fun createDoctor"
    }

    test("generates test file with helper wiring") {
        val content = generateTestFileContent(
            GenerateTestFileOptions(
                sourcePath = "sdk/how-to/basic-operations.mdx",
                blocks = listOf(
                    ExtractedBlock(
                        code = "val patient = sdk.patient.createPatient(p)",
                        startLine = 42,
                        testId = "ABCD",
                    )
                ),
                importSuperset = "import com.icure.cardinal.sdk.CardinalSdk",
                helperClassName = "BasicOperationsHelper",
                helperImportPath = "com.icure.docs.helpers.howto.BasicOperationsHelper",
                preTestProvides = mapOf("basic-operations block 1 (ABCD)" to listOf("p")),
            )
        )

        content shouldContain "import com.icure.docs.helpers.howto.BasicOperationsHelper"
        content shouldContain "__provided[\"p\"]"
        content shouldContain "__extracted[\"patient\"] = patient"
        content shouldContain "BasicOperationsHelper.postTest"
    }
})
