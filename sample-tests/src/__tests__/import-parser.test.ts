import { describe, test, expect } from 'vitest'
import { parseImportLine, mergeImports, renderImports } from '../import-parser'

describe('parseImportLine', () => {
  test('parses named imports', () => {
    const result = parseImportLine('import { CardinalSdk, HealthcareParty } from "@icure/cardinal-sdk"')
    expect(result).toEqual({
      kind: 'named',
      names: ['CardinalSdk', 'HealthcareParty'],
      source: '@icure/cardinal-sdk',
      isTypeOnly: false,
    })
  })

  test('parses type-only imports', () => {
    const result = parseImportLine('import type { FilterOptions } from "@icure/cardinal-sdk"')
    expect(result).toEqual({
      kind: 'named',
      names: ['FilterOptions'],
      source: '@icure/cardinal-sdk',
      isTypeOnly: true,
    })
  })

  test('parses default imports', () => {
    const result = parseImportLine('import Foo from "bar"')
    expect(result).toEqual({
      kind: 'default',
      name: 'Foo',
      source: 'bar',
      isTypeOnly: false,
    })
  })

  test('parses aliased named imports', () => {
    const result = parseImportLine('import { v4 as uuid } from "uuid"')
    expect(result).toEqual({
      kind: 'named',
      names: ['v4 as uuid'],
      source: 'uuid',
      isTypeOnly: false,
    })
  })

  test('parses side-effect imports', () => {
    const result = parseImportLine('import "reflect-metadata"')
    expect(result).toEqual({
      kind: 'side-effect',
      source: 'reflect-metadata',
      isTypeOnly: false,
    })
  })

  test('returns null for non-import lines', () => {
    expect(parseImportLine('const x = 1')).toBeNull()
    expect(parseImportLine('// import { Foo } from "bar"')).toBeNull()
  })
})

describe('mergeImports', () => {
  test('merges named imports from the same module', () => {
    const lines = [
      'import { CardinalSdk, HealthcareParty } from "@icure/cardinal-sdk"',
      'import { DecryptedPatient, randomUuid } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    expect(rendered).toContain('CardinalSdk')
    expect(rendered).toContain('DecryptedPatient')
    expect(rendered).toContain('HealthcareParty')
    expect(rendered).toContain('randomUuid')
    const cardinalLines = rendered.split('\n').filter(l => l.includes('@icure/cardinal-sdk') && !l.includes('import type'))
    expect(cardinalLines).toHaveLength(1)
  })

  test('keeps type-only imports separate from value imports', () => {
    const lines = [
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      'import type { FilterOptions } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const importLines = rendered.split('\n').filter(l => l.includes('@icure/cardinal-sdk'))
    expect(importLines).toHaveLength(2)
    expect(importLines.some(l => l.startsWith('import type'))).toBe(true)
    expect(importLines.some(l => l.startsWith('import {'))).toBe(true)
  })

  test('deduplicates identical named imports', () => {
    const lines = [
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const occurrences = rendered.split('CardinalSdk').length - 1
    expect(occurrences).toBe(1)
  })

  test('deduplicates side-effect imports', () => {
    const lines = [
      'import "reflect-metadata"',
      'import "reflect-metadata"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const occurrences = rendered.split('reflect-metadata').length - 1
    expect(occurrences).toBe(1)
  })

  test('keeps default imports from different modules separate', () => {
    const lines = [
      'import Foo from "foo"',
      'import Bar from "bar"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    expect(rendered).toContain('import Foo from "foo"')
    expect(rendered).toContain('import Bar from "bar"')
  })

  test('warns on name collision across different modules', () => {
    const warnings: string[] = []
    const lines = [
      'import { Filter } from "module-a"',
      'import { Filter } from "module-b"',
    ]
    const merged = mergeImports(lines, (msg) => warnings.push(msg))
    expect(warnings.length).toBeGreaterThan(0)
    expect(warnings[0]).toContain('Filter')
  })

  test('sorts import names alphabetically within a module', () => {
    const lines = [
      'import { Zebra, Alpha, Middle } from "@icure/cardinal-sdk"',
    ]
    const merged = mergeImports(lines)
    const rendered = renderImports(merged)
    const match = rendered.match(/\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const names = match![1].split(',').map(n => n.trim())
    expect(names).toEqual(['Alpha', 'Middle', 'Zebra'])
  })
})
