plugins {
    kotlin("jvm") version "2.1.10"
    kotlin("plugin.serialization") version "2.1.10"
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    testImplementation("com.icure:cardinal-sdk:2.2.0")
    testImplementation("io.ktor:ktor-client-core:3.2.1")
    testImplementation("io.ktor:ktor-client-cio:3.2.1")
    testImplementation("io.ktor:ktor-client-content-negotiation:3.2.1")
    testImplementation("io.ktor:ktor-serialization-kotlinx-json:3.2.1")
    testImplementation("org.jetbrains.kotlinx:kotlinx-datetime:0.6.2")
    testImplementation("io.kotest:kotest-runner-junit5:5.9.1")
    testImplementation("io.kotest:kotest-assertions-core:5.9.1")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.9.0")
}

application {
    mainClass.set("com.icure.docs.generator.MainKt")
}

sourceSets {
    test {
        kotlin.srcDir(layout.buildDirectory.dir("generated-test-sources/kotlin"))
    }
}
// Include generated test sources only when the property is set:
//   ./gradlew test -PincludeGenerated
if (project.hasProperty("includeGenerated")) {

}

val generateTests by tasks.registering(JavaExec::class) {
    group = "generation"
    description = "Generate Kotlin test files from MDX documentation"
    classpath = sourceSets.main.get().runtimeClasspath
    mainClass.set("com.icure.docs.generator.MainKt")
    args = listOf(
        rootProject.projectDir.resolve("../../sdk").absolutePath,
        layout.buildDirectory.dir("generated-test-sources/kotlin").get().asFile.absolutePath,
        rootProject.projectDir.resolve("helpers-meta").absolutePath,
    )
}

tasks.test {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
    }
    systemProperty("junit.jupiter.execution.timeout.default", "30s")
}

kotlin {
    jvmToolchain(21)
}
