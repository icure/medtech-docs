import { basename, dirname } from 'path'
import type { ExtractedBlock } from './mdx-extractor'
import { stripImportsFromBlock } from './mdx-extractor'

export interface GenerateTestFileOptions {
  sourcePath: string
  blocks: ExtractedBlock[]
  importSuperset: string
}

function computeHelperRelativePath(sourcePath: string): string {
  const withoutSdk = sourcePath.replace(/^sdk\//, '')
  const dir = dirname(withoutSdk)
  const depth = dir === '.' ? 0 : dir.split('/').length
  const ups = '../'.repeat(depth + 1)
  return `${ups}helpers/sdk-fixture`
}

export function generateTestFileContent(options: GenerateTestFileOptions): string {
  const { sourcePath, blocks, importSuperset } = options
  const fileBaseName = basename(sourcePath, '.mdx')
  const helperPath = computeHelperRelativePath(sourcePath)

  const lines: string[] = []

  lines.push(`// Auto-generated from ${sourcePath} — do not edit`)
  lines.push(importSuperset)
  lines.push(`import { getTestSdk } from "${helperPath}"`)
  lines.push('')
  lines.push('let sdk: CardinalSdk')
  lines.push('')
  lines.push('beforeAll(async () => {')
  lines.push('  sdk = await getTestSdk()')
  lines.push('})')
  lines.push('')

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const testName = `${fileBaseName} block ${i + 1} (line ${block.startLine})`
    const body = stripImportsFromBlock(block.code)
    const indentedBody = body
      .split('\n')
      .map(line => (line.trim() === '' ? '' : `  ${line}`))
      .join('\n')

    lines.push(`test("${testName}", async () => {`)
    lines.push(indentedBody)
    lines.push('})')
    lines.push('')
  }

  return lines.join('\n')
}
