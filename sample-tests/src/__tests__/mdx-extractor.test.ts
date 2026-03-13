import { describe, test, expect } from 'vitest'
import { extractTypeScriptBlocks, isImportLine, stripImportsFromBlock } from '../mdx-extractor'

describe('extractTypeScriptBlocks', () => {
  test('extracts a single typescript block with line number', () => {
    const mdx = [
      '# Title',
      '',
      '```typescript',
      'const x = 1',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toBe('const x = 1')
    expect(blocks[0].startLine).toBe(3)
  })

  test('extracts multiple blocks preserving order', () => {
    const mdx = [
      '```typescript',
      'const a = 1',
      '```',
      '',
      'Some text',
      '',
      '```typescript',
      'const b = 2',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(2)
    expect(blocks[0].code).toBe('const a = 1')
    expect(blocks[1].code).toBe('const b = 2')
  })

  test('skips blocks with no-test annotation', () => {
    const mdx = [
      '```typescript no-test',
      'const x = 1',
      '```',
      '',
      '```typescript',
      'const y = 2',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toBe('const y = 2')
  })

  test('ignores non-typescript fenced blocks', () => {
    const mdx = [
      '```kotlin',
      'val x = 1',
      '```',
      '',
      '```python',
      'x = 1',
      '```',
      '',
      '```typescript',
      'const x = 1',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toBe('const x = 1')
  })

  test('handles multi-line code blocks', () => {
    const mdx = [
      '```typescript',
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      '',
      'async function foo(sdk: CardinalSdk) {',
      '  return await sdk.patient.getPatient("123")',
      '}',
      '```',
    ].join('\n')

    const blocks = extractTypeScriptBlocks(mdx)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].code).toContain('async function foo')
    expect(blocks[0].code).toContain('getPatient')
  })

  test('returns empty array for mdx with no typescript blocks', () => {
    const mdx = '# Title\n\nSome text\n\n```kotlin\nval x = 1\n```'
    expect(extractTypeScriptBlocks(mdx)).toHaveLength(0)
  })
})

describe('isImportLine', () => {
  test('detects standard import', () => {
    expect(isImportLine('import { Foo } from "bar"')).toBe(true)
  })

  test('detects type import', () => {
    expect(isImportLine('import type { Foo } from "bar"')).toBe(true)
  })

  test('rejects non-import lines', () => {
    expect(isImportLine('const x = 1')).toBe(false)
    expect(isImportLine('// import { Foo } from "bar"')).toBe(false)
  })
})

describe('stripImportsFromBlock', () => {
  test('removes import lines from block code', () => {
    const code = [
      'import { CardinalSdk } from "@icure/cardinal-sdk"',
      '',
      'const x = await sdk.patient.getPatient("123")',
    ].join('\n')

    const stripped = stripImportsFromBlock(code)
    expect(stripped).not.toContain('import')
    expect(stripped).toContain('const x = await sdk.patient.getPatient')
  })

  test('removes multi-line import statements', () => {
    const code = [
      'import {',
      '\tCardinalSdk,',
      '\tDecryptedPatient,',
      '} from "@icure/cardinal-sdk"',
      '',
      'const x = await sdk.patient.getPatient("123")',
    ].join('\n')

    const stripped = stripImportsFromBlock(code)
    expect(stripped).not.toContain('import')
    expect(stripped).not.toContain('CardinalSdk')
    expect(stripped).not.toContain('DecryptedPatient')
    expect(stripped).not.toContain('@icure/cardinal-sdk')
    expect(stripped).toContain('const x = await sdk.patient.getPatient')
  })

  test('preserves non-import lines exactly', () => {
    const code = [
      'const x = 1',
      'const y = 2',
    ].join('\n')

    expect(stripImportsFromBlock(code)).toBe(code)
  })
})
