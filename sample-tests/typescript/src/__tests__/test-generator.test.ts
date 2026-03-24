import { describe, test, expect } from 'vitest'
import { generateTestFileContent } from '../test-generator'
import type { ExtractedBlock } from '../mdx-extractor'

describe('generateTestFileContent', () => {
  const importSuperset = 'import { CardinalSdk, DecryptedPatient } from "@icure/cardinal-sdk"'

  test('generates a valid test file with one block', () => {
    const blocks: ExtractedBlock[] = [
      { code: 'const p = await sdk.patient.getPatient("123")', startLine: 42 },
    ]

    const result = generateTestFileContent({
      sourcePath: 'sdk/how-to/basic-operations.mdx',
      blocks,
      importSuperset,
    })

    expect(result).toContain('// Auto-generated from sdk/how-to/basic-operations.mdx')
    expect(result).toContain('import { CardinalSdk, DecryptedPatient } from "@icure/cardinal-sdk"')
    expect(result).toContain('import { getTestSdk } from')
    expect(result).toContain('let sdk: CardinalSdk')
    expect(result).toContain('beforeAll(async () =>')
    expect(result).toContain('test("basic-operations block 1 (line 42)"')
    expect(result).toContain('const p = await sdk.patient.getPatient("123")')
  })

  test('generates multiple tests for multiple blocks', () => {
    const blocks: ExtractedBlock[] = [
      { code: 'const a = 1', startLine: 10 },
      { code: 'const b = 2', startLine: 20 },
      { code: 'const c = 3', startLine: 30 },
    ]

    const result = generateTestFileContent({
      sourcePath: 'sdk/how-to/querying-data.mdx',
      blocks,
      importSuperset,
    })

    expect(result).toContain('test("querying-data block 1 (line 10)"')
    expect(result).toContain('test("querying-data block 2 (line 20)"')
    expect(result).toContain('test("querying-data block 3 (line 30)"')
  })

  test('strips imports from block bodies', () => {
    const blocks: ExtractedBlock[] = [
      {
        code: 'import { CardinalSdk } from "@icure/cardinal-sdk"\n\nconst x = 1',
        startLine: 5,
      },
    ]

    const result = generateTestFileContent({
      sourcePath: 'sdk/test.mdx',
      blocks,
      importSuperset,
    })

    const testBodyMatch = result.match(/test\("test block 1.*?", async \(\) => \{([\s\S]*?)\n\}\)/)
    expect(testBodyMatch).not.toBeNull()
    expect(testBodyMatch![1]).not.toContain('import')
    expect(testBodyMatch![1]).toContain('const x = 1')
  })

  test('computes relative path to helpers based on nesting depth', () => {
    const blocks: ExtractedBlock[] = [
      { code: 'const x = 1', startLine: 5 },
    ]

    // Deeply nested: generated/tutorial/basic/modules/foo.test.ts → ../../../../helpers/sdk-fixture
    const result = generateTestFileContent({
      sourcePath: 'sdk/tutorial/basic/modules/foo.mdx',
      blocks,
      importSuperset,
    })

    expect(result).toContain('from "../../../../helpers/sdk-fixture"')
  })
})
