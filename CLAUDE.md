# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cardinal SDK documentation site built with **Docusaurus 3.9**. Deployed at `https://docs.icure.com`.

Requires **Node.js >= 20** (see `.nvmrc`; run `nvm use`).

## Commands

```bash
# Install dependencies (uses Yarn classic)
yarn

# Dev server
yarn start

# Production build
yarn build

# Serve the production build locally
yarn serve

# Type checking
yarn typecheck

# Clear Docusaurus cache
yarn clear
```

**Sample tests** (in `sample-tests/`): the TypeScript code blocks in `sdk/**/*.mdx` are extracted and run as Vitest tests against a real Cardinal backend. Kotlin samples have an equivalent Gradle setup.
```bash
cd sample-tests/typescript
yarn
yarn generate     # generate test files only
yarn test         # generate + run tests
```
Mark a code block ` ```typescript no-test ` to exclude it. See `sample-tests/typescript/README.md`.

## Architecture

### Documentation Sections

- **`sdk/`** — Cardinal SDK docs (primary), routed to `/`, sidebar `sidebarsNsdk.js`
- **`cockpit/`** — Cockpit product docs, routed to `/cockpit`, sidebar `sidebarsCockpit.js`
- **`api/`** — API reference docs

Content is plain Markdown/MDX edited in place. There is no template or code-injection step anymore: the former `sdks/` Mustache templates, generated `medtech-sdk/` and `ehr-lite-sdk/` outputs, and `code-samples/` snippet injection were removed in March 2026.

### Custom Components

- **`src/components/SdkCode/`** — Tabbed multi-language code display (Kotlin, TypeScript, Python, Swift, Dart) with synchronized tab selection via Docusaurus `groupId`
- **`src/components/LanguageTabs.tsx`** — Language tab switcher
- **`src/theme/`** — Swizzled Docusaurus components: forced dark mode (ColorModeToggle hidden), custom footer layout

### Diagram Support

- **Mermaid** — native via `@docusaurus/theme-mermaid`
- **Kroki/PlantUML** — via `remark-kroki` plugin (aliased as `plantuml`)

## MDX Gotchas

MDX parses `<word>` as a JSX tag. Escape literal angle-bracket placeholders in prose as `\<date\>`, or the build fails.

## Formatting

Prettier config (`.prettierrc`): no semicolons, single quotes, trailing commas, 180 char width, 2-space indent.
