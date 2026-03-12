# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CardinalSDK documentation site built with **Docusaurus 3.5.2**. Deployed at `https://docs.icure.com`.

## Commands

```bash
# Install dependencies (uses Yarn classic)
yarn

# Dev server (no template generation)
yarn start

# Template generation + code sample injection, then dev server
yarn old-start    # equivalent to: yarn make && docusaurus start

# Full build with template generation
yarn old-build    # equivalent to: yarn make && docusaurus build

# Template generation only (Mustache + code injection)
yarn make         # node make.mjs && node fill.mjs

# Type checking
yarn typecheck

# Clear Docusaurus cache
yarn clear
```

**Code samples** (in `code-samples/`):
```bash
cd code-samples
yarn
yarn start        # lint-fix + build + run all samples
yarn lint         # ESLint check
yarn lint-fix     # ESLint auto-fix
```

## Architecture

### Two-Stage Content Pipeline

1. **`make.mjs` — Mustache templating**: Templates in `sdks/` are rendered into `medtech-sdk/` and `ehr-lite-sdk/` with different terminology (e.g., "data sample" vs "observation", "healthcare professional" vs "practitioner"). Files prefixed with `!!medtech` or `!!ehrlite` are conditionally included/excluded per SDK.

2. **`fill.mjs` — Code sample injection**: Markdown files contain `<!-- file://code-samples/path.ts snippet:name -->` comments. `fill.mjs` extracts code between `//tech-doc: snippetName` markers in TypeScript files and injects them into markdown code fences. Supports `/* truncate */` for long strings and `//skip` to exclude lines.

**Important**: `medtech-sdk/` and `ehr-lite-sdk/` directories are **generated** — edit `sdks/` templates instead.

### Documentation Sections

- **`sdk/`** — Cardinal SDK (new, primary docs), routed to `/`
- **`cockpit/`** — Cockpit product docs, routed to `/cockpit`
- **`sdks/`** — Templates that generate `medtech-sdk/` and `ehr-lite-sdk/`
- **`api/`** — API reference docs

Each section has its own sidebar file (`sidebarsNsdk.js`, `sidebarsCockpit.js`, etc.).

### Custom Components

- **`src/components/SdkCode/`** — Tabbed multi-language code display (Kotlin, TypeScript, Python, Swift, Dart) with synchronized tab selection via Docusaurus `groupId`
- **`src/components/LanguageTabs.tsx`** — Language tab switcher
- **`src/theme/`** — Swizzled Docusaurus components: forced dark mode (ColorModeToggle hidden), custom footer layout

### Diagram Support

- **Mermaid** — native via `@docusaurus/theme-mermaid`
- **Kroki/PlantUML** — via `remark-kroki` plugin (aliased as `plantuml`)

## Formatting

Prettier config (`.prettierrc`): no semicolons, single quotes, trailing commas, 180 char width, 2-space indent.
