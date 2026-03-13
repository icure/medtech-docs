import { describe, test, expect } from 'vitest'
import { parseImportLine, mergeImports, renderImports, joinMultiLineImports } from '../import-parser'

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

describe('joinMultiLineImports', () => {
  test('joins a multi-line import into a single line', () => {
    const lines = [
      'import {',
      '\tCardinalSdk,',
      '\tDecryptedPatient,',
      '\tDocIdentifier,',
      '} from "@icure/cardinal-sdk"',
    ]
    const result = joinMultiLineImports(lines)
    expect(result).toHaveLength(1)
    const parsed = parseImportLine(result[0])
    expect(parsed).not.toBeNull()
    expect(parsed!.kind).toBe('named')
    if (parsed!.kind === 'named') {
      expect(parsed!.names).toContain('CardinalSdk')
      expect(parsed!.names).toContain('DecryptedPatient')
      expect(parsed!.names).toContain('DocIdentifier')
      expect(parsed!.source).toBe('@icure/cardinal-sdk')
    }
  })

  test('leaves single-line imports unchanged', () => {
    const lines = [
      'import { Foo, Bar } from "baz"',
      'const x = 1',
    ]
    const result = joinMultiLineImports(lines)
    expect(result).toEqual(lines)
  })

  test('handles mix of single and multi-line imports', () => {
    const lines = [
      'import { Foo } from "foo"',
      'import {',
      '  Bar,',
      '  Baz,',
      '} from "bar"',
      'const x = 1',
    ]
    const result = joinMultiLineImports(lines)
    expect(result).toHaveLength(3)
    expect(result[0]).toBe('import { Foo } from "foo"')
    expect(result[2]).toBe('const x = 1')
    expect(parseImportLine(result[1])).not.toBeNull()
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
